import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AppContext from '../../contexts/AppContext';
import {
  getCustomBattleMtnDataContract,
  getVSBattleContract,
} from '../../web3/SolidityContracts';
import * as SolidityContractsAddresses from '../../web3/SolidityContractsAddresses';
import { getDefaultTransactionOptions } from '../../web3/Utilities';

export const CREATE_MTN_STEPS = {
  // Create contracts
  NONE: 'none',
  START: 'start',
  CREATE_MTN: 'create_mtn',
  CREATE_VS: 'create_vs',

  // Initialize contracts
  BATTLE_MTN_SETCARDDATACONTACT: 'battle_mtn_setCardDataContact',
  BATTLE_MTN_INITMOUNTAIN: 'battle_mtn_initMountain',
  BATTLE_MTN_DEFINEPATHS: 'battle_mtn_definePaths',
  BATTLE_MTN_ADDSERAPHIM: 'battle_mtn_addSERAPHIM',
  VSBATTLE_SETPARAMETERS: 'vsbattle_setparameters',

  // Custom Mtn
  CUSTOM_BATTLE_MTN: 'custom_battle_mtn_init',
};

const defaultStep = {
  step: 'none',
  pending_tx: null,
  customBattleMtnAddress: null,
  customVsBattleAddress: null,
};

const useCreateCustomBattleMtn = () => {
  const { api, connection } = useContext(AppContext);
  const [creationStep, setCreationStep] = useState(null);

  // Initialization function calls to contract for step 2
  const initContractActions = useMemo(() => {
    if (
      !api ||
      !connection ||
      !creationStep ||
      !creationStep.customBattleMtnAddress ||
      !creationStep.customVsBattleAddress
    ) {
      return null;
    }

    return {
      [CREATE_MTN_STEPS.BATTLE_MTN_SETCARDDATACONTACT]: {
        action: 'setCardDataContact',
        contract: getCustomBattleMtnDataContract(
          creationStep.customBattleMtnAddress
        ),
        params: [SolidityContractsAddresses.carddata_contract_address],
      },
      [CREATE_MTN_STEPS.BATTLE_MTN_INITMOUNTAIN]: {
        action: 'initMountain',
        contract: getCustomBattleMtnDataContract(
          creationStep.customBattleMtnAddress
        ),
        params: [],
      },
      [CREATE_MTN_STEPS.BATTLE_MTN_DEFINEPATHS]: {
        action: 'definePaths',
        contract: getCustomBattleMtnDataContract(
          creationStep.customBattleMtnAddress
        ),
        params: [],
      },
      [CREATE_MTN_STEPS.BATTLE_MTN_ADDSERAPHIM]: {
        action: 'addSERAPHIM',
        contract: getCustomBattleMtnDataContract(
          creationStep.customBattleMtnAddress
        ),
        params: [creationStep.customVsBattleAddress],
      },
      [CREATE_MTN_STEPS.VSBATTLE_SETPARAMETERS]: {
        action: 'setParameters',
        contract: getVSBattleContract(creationStep.customVsBattleAddress),
        params: [
          SolidityContractsAddresses.carddata_contract_address,
          SolidityContractsAddresses.battle_support_address,
          creationStep.customBattleMtnAddress,
          SolidityContractsAddresses.token_contact_address,
          6,
          12,
          15,
          100,
        ],
      },
    };
  }, [creationStep, connection, api]);

  // Clear all progress
  const resetCustomBattleMtn = () => {
    setCreationStep(defaultStep);
    localStorage.setItem('creationStep', JSON.stringify(defaultStep));
    window.location.reload();
  };

  // Save creationStep to state and local storage
  const saveCreationStep = useCallback(
    (updates) => {
      const updatedCreationStep = {
        ...(creationStep ?? defaultStep),
        ...updates,
      };

      setCreationStep(updatedCreationStep);
      localStorage.setItem('creationStep', JSON.stringify(updatedCreationStep));
    },
    [creationStep]
  );

  // Save transaction
  const saveTransaction = useCallback(
    (tx) => {
      saveCreationStep({ pending_tx: tx });
    },
    [saveCreationStep]
  );

  // Clear transaction
  const clearTransaction = useCallback(
    (tx) => {
      saveCreationStep({ pending_tx: null });
    },
    [saveCreationStep]
  );

  // Return if transaction is pending
  const waitingForTransaction = () => {
    return (
      creationStep?.pending_tx === 'pending' ||
      creationStep?.pending_tx?.startsWith('0x')
    );
  };

  // Handle promise events from the startCreationStep() function
  const handleTransaction = useCallback(
    (promiseEvents) => {
      promiseEvents
        .on('transactionHash', function (transactionHash) {
          saveTransaction(transactionHash);
        })
        .on('error', (error) => {
          // Keep transaction even if not mined in 50 blocks, it could be mined at a later time
          if (error?.message?.includes('50 blocks')) {
            return;
          }

          clearTransaction();
        });
    },
    [clearTransaction, saveTransaction]
  );

  // Call an initialization function for a contract
  const sendInitContractAction = useCallback(
    (step) => {
      if (!initContractActions) {
        return;
      }

      // set transaction to pending
      saveTransaction('pending');

      // Create transaction
      handleTransaction(
        initContractActions[step]['contract'].methods[
          initContractActions[step].action
        ]
          .apply(null, initContractActions[step].params)
          .send(
              {
              from: connection.currentAddress,
            }
          )
      );
    },
    [
      initContractActions,
      connection.currentAddress,
      handleTransaction,
      saveTransaction,
    ]
  );

  // Update the creation step
  const startCreationStep = useCallback(
   async  (step, payload = null) => {
      if (!api) {
        return;
      }
          const options = await getDefaultTransactionOptions();
      switch (step) {
        // Start of mtn creation
        case CREATE_MTN_STEPS.START:
          const createMtnStep = {
            ...defaultStep,
            step: CREATE_MTN_STEPS.CREATE_MTN,
          };
          saveCreationStep(createMtnStep);
          break;
        case CREATE_MTN_STEPS.CREATE_MTN:
          // set transaction to pending
          saveTransaction('pending');

          // Create transaction
          handleTransaction(api.customBattleMtn.createCustomBattleMtn(options));

          break;
        case CREATE_MTN_STEPS.CREATE_VS:
          // set transaction to pending
          saveTransaction('pending');

          // Create transaction
          handleTransaction(api.customBattleMtn.createVsBattle(options));

          break;
        case CREATE_MTN_STEPS.BATTLE_MTN_SETCARDDATACONTACT:
        case CREATE_MTN_STEPS.BATTLE_MTN_INITMOUNTAIN:
        case CREATE_MTN_STEPS.BATTLE_MTN_DEFINEPATHS:
        case CREATE_MTN_STEPS.BATTLE_MTN_ADDSERAPHIM:
        case CREATE_MTN_STEPS.VSBATTLE_SETPARAMETERS:
          sendInitContractAction(step);

          break;
        case CREATE_MTN_STEPS.CUSTOM_BATTLE_MTN:
          saveTransaction('pending');

          handleTransaction(
            api.customBattleMtn.init(
              payload.title,
              payload.description,
              payload.customBattleMtnAddress,
              payload.customVsBattleAddress
            )
          );

          break;
        default:
          console.log('unknown step', { step, payload });
      }
    },
    [
      api,
      handleTransaction,
      saveCreationStep,
      saveTransaction,
      sendInitContractAction,
    ]
  );

  // End the creation sstep
  const endCreationStep = useCallback(
    (step, payload = null) => {
      switch (step) {
        case CREATE_MTN_STEPS.CREATE_MTN:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.CREATE_VS, // next step
              pending_tx: null,
              customBattleMtnAddress: payload.contractAddress,
            });
          } else {
            saveCreationStep({
              pending_tx: null,
              customBattleMtnAddress: null,
            });
          }
          break;
        case CREATE_MTN_STEPS.CREATE_VS:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.BATTLE_MTN_SETCARDDATACONTACT, // next step
              pending_tx: null,
              customVsBattleAddress: payload.contractAddress,
            });
          } else {
            saveCreationStep({ pending_tx: null, customVsBattleAddress: null });
          }
          break;
        case CREATE_MTN_STEPS.BATTLE_MTN_SETCARDDATACONTACT:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.BATTLE_MTN_INITMOUNTAIN, // next step
              pending_tx: null,
            });
          } else {
            saveCreationStep({ pending_tx: null });
          }
          break;
        case CREATE_MTN_STEPS.BATTLE_MTN_INITMOUNTAIN:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.BATTLE_MTN_DEFINEPATHS, // next step
              pending_tx: null,
            });
          } else {
            saveCreationStep({ pending_tx: null });
          }
          break;
        case CREATE_MTN_STEPS.BATTLE_MTN_DEFINEPATHS:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.BATTLE_MTN_ADDSERAPHIM, // next step
              pending_tx: null,
            });
          } else {
            saveCreationStep({ pending_tx: null });
          }
          break;
        case CREATE_MTN_STEPS.BATTLE_MTN_ADDSERAPHIM:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.VSBATTLE_SETPARAMETERS, // next step
              pending_tx: null,
            });
          } else {
            saveCreationStep({ pending_tx: null });
          }
          break;
        case CREATE_MTN_STEPS.VSBATTLE_SETPARAMETERS:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.CUSTOM_BATTLE_MTN, // next step
              pending_tx: null,
            });
          } else {
            saveCreationStep({ pending_tx: null });
          }
          break;
        case CREATE_MTN_STEPS.CUSTOM_BATTLE_MTN:
          if (payload.status === true) {
            saveCreationStep({
              step: CREATE_MTN_STEPS.NONE, // next step
              pending_tx: null,
            });

            // refresh to load new mtn
            window.location.reload();
          } else {
            saveCreationStep({ pending_tx: null });
          }
          break;
        default:
          console.log('unknown step', { step, payload });
      }
    },
    [saveCreationStep]
  );

  // Return if creating a custom mountain is in progress
  const isCreatingInProgress = () =>
    creationStep?.step !== CREATE_MTN_STEPS.NONE;

  // Return if on a creation step (step 1)
  const isOnCreateSteps = () =>
    [
      CREATE_MTN_STEPS.START,
      CREATE_MTN_STEPS.CREATE_MTN,
      CREATE_MTN_STEPS.CREATE_VS,
    ].includes(creationStep.step);

  // Return if creation step 1 is complete
  const isCreateStepsCompleted = () =>
    ![
      CREATE_MTN_STEPS.START,
      CREATE_MTN_STEPS.CREATE_MTN,
      CREATE_MTN_STEPS.CREATE_VS,
    ].includes(creationStep.step) &&
    !!creationStep.customBattleMtnAddress &&
    !!creationStep.customVsBattleAddress;

  // Return if on the initialization step (step 2)
  const isOnInitializingSteps = () =>
    [
      CREATE_MTN_STEPS.BATTLE_MTN_SETCARDDATACONTACT,
      CREATE_MTN_STEPS.BATTLE_MTN_INITMOUNTAIN,
      CREATE_MTN_STEPS.BATTLE_MTN_DEFINEPATHS,
      CREATE_MTN_STEPS.BATTLE_MTN_ADDSERAPHIM,
      CREATE_MTN_STEPS.VSBATTLE_SETPARAMETERS,
    ].includes(creationStep.step);

  const isInitializingStepsCompleted = () =>
    [CREATE_MTN_STEPS.CUSTOM_BATTLE_MTN].includes(creationStep.step);

  const isOnInitCustomBattleMtnStep = () =>
    [CREATE_MTN_STEPS.CUSTOM_BATTLE_MTN].includes(creationStep.step);

  // INIT: Load custom mtn addresses and transactions from local storage. The allows
  // a previous session to continue create a custom mtn creation in progress
  useEffect(() => {
    // load from storage
    let creationStep = localStorage.getItem('creationStep');

    // try to parse value
    try {
      creationStep = JSON.parse(creationStep);
    } catch (e) {
      creationStep = {};
    }

    // assume valid object if it has a step property, if not valid, create a default object
    if (creationStep?.step === undefined) {
      creationStep = defaultStep;
    }

    // save
    setCreationStep(creationStep);
    localStorage.setItem('creationStep', JSON.stringify(creationStep));
  }, []);

  // Wait for a transaction to return a receipt
  useEffect(() => {
    if (
      !connection?.provider?.eth ||
      !connection?.hasCurrentAddress ||
      !creationStep
    ) {
      return;
    }

    // https://ethereum.stackexchange.com/a/67234
    async function getTransactionReceiptMined(txHash) {
      const transactionReceiptAsync = async function (resolve, reject) {
        await connection.provider.eth.getTransactionReceipt(
          txHash,
          (error, receipt) => {
            if (error) {
              // clear failed transaction
              clearTransaction();
              reject(error);
            } else if (receipt == null) {
              // retry (loop)
              setTimeout(() => transactionReceiptAsync(resolve, reject), 1000);
            } else {
              // return receipt
              resolve(receipt);
            }
          }
        );
      };

      return new Promise(transactionReceiptAsync);
    }

    // Get state of pending transaction
    const tx = creationStep.pending_tx;

    if (tx && tx.startsWith('0x')) {
      getTransactionReceiptMined(tx)
        .then((receipt) => {
          endCreationStep(creationStep.step, receipt);
        })
        .catch((error) => console.log(error));
      // }
    }
  }, [connection, creationStep, clearTransaction, endCreationStep]);

  // Regester the custom battle mtn, set the title, description, and addresses
  const initMountain = useCallback(
    (title, description) => {
      if (
        !api ||
        !creationStep.customBattleMtnAddress ||
        !creationStep.customVsBattleAddress
      ) {
        return;
      }
         
      startCreationStep(creationStep.step, {
        title,
        description,
        customBattleMtnAddress: creationStep.customBattleMtnAddress,
        customVsBattleAddress: creationStep.customVsBattleAddress,
      });
    },
    [api, creationStep, startCreationStep]
  );

  return {
    creationStep,
    resetCustomBattleMtn,
    startCreationStep,
    isCreatingInProgress,
    isOnCreateSteps,
    isCreateStepsCompleted,
    isOnInitializingSteps,
    isInitializingStepsCompleted,
    isOnInitCustomBattleMtnStep,
    waitingForTransaction,
    initMountain,
  };
};

export default useCreateCustomBattleMtn;
