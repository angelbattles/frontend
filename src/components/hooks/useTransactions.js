import { useCallback, useState } from 'react';
const localStorageKeyPrefix = 'ab_transaction_';

const useTransactions = (connection) => {
  const [transactions, setTransactions] = useState({});
  // const [pendingTransactionReceipts, setPendingTransactionReceipts] = useState(
  //   {}
  // );

  /*
   * Save transaction name and count to memory.
   *
   * If not existing transaction exist, then set count to 1, else increment current count.
   * Attach a finally() to the transaction to decrement the count.
   */
  const trackTransaction = useCallback((name, transaction) => {
    // Increment transaction count
    setTransactions((prevTransactions) => {
      const transactionCount = prevTransactions[name]
        ? ++prevTransactions[name]
        : 1;

      return {
        ...prevTransactions,
        [name]: transactionCount,
      };
    });
      console.log(transaction)
    // Decrement transaction count when transaction complete
    transaction.finally(() => {
      setTransactions((prevTransactions) => {
        const transactionCount = --prevTransactions[name];
        //console.log(`transaction completed: ${name} ${transactionCount}`);

        return {
          ...prevTransactions,
          [name]: transactionCount,
        };
      });
    });

    return transaction;
  }, []);

  /*
   * Save transaction information to localStorage and memory
   */
  const trackTransactionHash = useCallback(
    (name, transaction) => {
      // Save to memory
      trackTransaction(name, transaction);

      // Save 'pending' to localStorage
      const localStorageTransactionName = localStorageKeyPrefix + name;
      saveTransactionToLocalStorage(localStorageTransactionName, 'pending');

      // Save hash to localStorage
      transaction
        .on('transactionHash', function (transactionHash) {
          saveTransactionToLocalStorage(
            localStorageTransactionName,
            transactionHash
          );
        })
        .on('error', (error) => {
          // Keep transaction even if not mined in 50 blocks, it could be mined at a later time
          if (error?.message?.includes('50 blocks')) {
            return;
          }

          // Hash not available, clear transaction
          saveTransactionToLocalStorage(localStorageTransactionName, null);
        });

      return transaction;
    },
    [trackTransaction]
  );

  /*
   * Save state of transaction to localStorage
   */
  const saveTransactionToLocalStorage = (name, state) => {
    localStorage.setItem(
      name,
      JSON.stringify({ transaction: state, updated: Date.now() })
    );
  };

  /*
   * Return if transaction is pending
   */
  const isTransactionPending = (name) => {
    // Memory
    if (!!transactions[name]) {
      return true;
    }

    // localStorage
    return hasLocalStorageTransaction(name);
  };

  const getLocalStorageTransaction = useCallback((name) => {
    let localStorageTransaction = localStorage.getItem(
      localStorageKeyPrefix + name
    );

    // try to parse value
    try {
      localStorageTransaction = JSON.parse(localStorageTransaction);
    } catch (e) {
      localStorageTransaction = {};
    }

    return localStorageTransaction;
  }, []);

  /*
   * Check if there is a transaction being tracked
   *
   * expirationTime - milliseconds it takes for a transaction to be invalid
   *                  If invalid then return false (default 10 minutes)
   */
  const hasLocalStorageTransaction = useCallback(
    (name, expirationTime = 10 * 60 * 1000) => {
      // Storage
      let localStorageTransaction = getLocalStorageTransaction(name);

      // check if there is an updated time and transaction,
      // if not then assume this transaction is invalid
      if (
        !localStorageTransaction?.updated ||
        !localStorageTransaction?.transaction
      ) {
        return false;
      }

      // check transaction timeout
      if (localStorageTransaction.updated < Date.now() - expirationTime) {
        return false;
      }

      return (
        localStorageTransaction?.transaction === 'pending' ||
        localStorageTransaction?.transaction?.startsWith('0x')
      );
    },
    [getLocalStorageTransaction]
  );

  /*
   * Return a group of transactions that start with a given groupName and >= minCount
   */
  const getTransactionGroup = (groupName, minCount = 0) => {
    return Object.entries(transactions)
      .filter(
        ([name, count]) => name.startsWith(groupName) && count >= minCount
      )
      .map((transaction) => ({ name: transaction[0], count: transaction[1] }));
  };

  const getMinedTransactionReceipt = useCallback(
    (name) => {
      if (!connection) {
        return Promise.reject();
      }

      if (hasLocalStorageTransaction(name)) {
        const localStorageTransaction = getLocalStorageTransaction(name);

        const transactionReceiptAsync = async function (resolve, reject) {
          await connection.provider.eth.getTransactionReceipt(
            localStorageTransaction.transaction,
            (error, receipt) => {
              if (error) {
                // clear failed transaction
                saveTransactionToLocalStorage(
                  localStorageKeyPrefix + name,
                  null
                );
                reject(error);
              } else if (receipt == null) {
                // retry (loop)
                setTimeout(
                  () => transactionReceiptAsync(resolve, reject),
                  1000
                );
              } else {
                // return the receipt
                saveTransactionToLocalStorage(
                  localStorageKeyPrefix + name,
                  null
                );
                resolve(receipt);
              }
            }
          );
        };

        return new Promise(transactionReceiptAsync);
      }

      return Promise.reject();
    },
    [hasLocalStorageTransaction, getLocalStorageTransaction, connection]
  );

  return {
    getTransactionGroup,
    isTransactionPending,
    hasLocalStorageTransaction,
    getMinedTransactionReceipt,
    setTransactions,
    trackTransaction,
    trackTransactionHash,
  };
};

export default useTransactions;
