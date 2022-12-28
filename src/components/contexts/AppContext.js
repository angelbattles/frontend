import React, { useMemo } from 'react';
import useConnection from '../web3/useConnection';
import useApi from '../api/useApi';
import useTransactions from '../hooks/useTransactions';
import useBattleMountain from '../hooks/useBattleMountain';

const AppContext = React.createContext({});

const AppContextProvider = (props) => {
  /********************************************************************
   * General app states
   ********************************************************************/
  // Information about the current battle mountain - e.g. Official AB or custom
  const battleMountain = useBattleMountain();

  /********************************************************************
   * Connection
   ********************************************************************/
  const connection = useConnection();
  const currentAddress = useMemo(
    () =>
      connection &&
      connection.currentAddress &&
      connection.currentAddress !== '0x0000000000000000000000000000000000000001'
        ? connection.currentAddress
        : null,
    [connection]
  );

  /********************************************************************
   * Transactions
   ********************************************************************/
  const {
    getTransactionGroup,
    isTransactionPending,
    hasLocalStorageTransaction,
    getMinedTransactionReceipt,
    trackTransaction,
    trackTransactionHash,
  } = useTransactions(connection);

  /********************************************************************
   * Contract API
   ********************************************************************/
  const api = useApi(
    currentAddress,
    trackTransaction,
    trackTransactionHash,
    battleMountain
  );

  return (
    <AppContext.Provider
      value={{
        api,
        connection,
        battleMountain,
        getTransactionGroup,
        isTransactionPending,
        hasLocalStorageTransaction,
        getMinedTransactionReceipt,
        trackTransaction,
        trackTransactionHash,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContext;
export { AppContextProvider };
