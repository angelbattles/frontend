import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import AppContext from '../contexts/AppContext';
import useCreateCustomBattleMtn, {
  CREATE_MTN_STEPS,
} from './hooks/createCustomBattleMtn';
import CustomDeployToolView from './CustomDeployToolView';
import LoadingButton from '../LoadingButton';
import LoadingSpinner from '../LoadingSpinner';
import CustomBattleMtnEditView from './edit/CustomBattleMtnEditView';
import CustomBattleMtnGetStarted from './CustomBattleMtnGetStarted';

const viewMode = {
  LOADING: 1,
  CREATE: 2,
  EDIT: 3,
  GET_STARTED: 4,
};

const reducer = (prevState, newStates) => ({ ...prevState, ...newStates });

const CustomBattleMtns = () => {
  const { api, connection } = useContext(AppContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {
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
  } = useCreateCustomBattleMtn();
  const [mountainCount, setMountainCount] = useState(null);
  const [state, setState] = useReducer(reducer, {
    viewMode: viewMode.LOADING,
    createMtnStep: CREATE_MTN_STEPS.START,
  });
  const [mountains, setMountains] = useState([]);
  const [selectedMountain, setSelectedMountain] = useState(null);
  const [playerBattleMtnIds, setPlayerBattleMtnIds] = useState([]);

  // Load user's mountain count
  // If player does not have mountains, then show the 'Get Started' component, otherwise display edit functions
  const getMountainCount = useCallback(() => {
    if (!api) {
      return;
    }

    api.customBattleMtn.getPlayerMountainCount().then((count) => {
      setMountainCount(+count);
      setState({ viewMode: +count > 0 ? viewMode.EDIT : viewMode.GET_STARTED });
    });
  }, [api]);

  // Get the mountain count
  useEffect(() => {
    getMountainCount();
  }, [getMountainCount]);

  // Get mountain ids
  // TODO: create a Solidity function to just return the mountain by id instead of having to grab ids then mountain.
  useEffect(() => {
    if (!mountainCount) {
      return;
    }

    Promise.all(
      [...Array(mountainCount)].map((_, idx) => {
        return api.customBattleMtn.getPlayerMountainIdByIndex(idx);
      })
    ).then((data) => {
      setPlayerBattleMtnIds(data);
    });
  }, [api, mountainCount]);

  // Get mountain data
  useEffect(() => {
    if (!playerBattleMtnIds.length) {
      return;
    }

    Promise.all(
      playerBattleMtnIds.map((mtnId) => {
        return api.customBattleMtn.getBattleMountainByIndex(mtnId);
      })
    ).then((data) => {
      setMountains(data);
      if (!selectedMountain) {
        setSelectedMountain(data[0]);
      }
    });
  }, [api, playerBattleMtnIds, selectedMountain]);

  const isValid = () => {
    return !title.trim() || !description.trim();
  };

  const startNewMountain = () => {
    // clear current title and description so the last step of the mountain creation displays the correct mtn
    setTitle('');
    setDescription('');

    startCreationStep(CREATE_MTN_STEPS.START);
    setState({ viewMode: viewMode.CREATE });
  };

  // Display Create mode if a mountain in progress of being created
  useEffect(() => {
    if (!creationStep || mountainCount === null) {
      return;
    }

    if (isCreatingInProgress() && state.viewMode !== viewMode.CREATE) {
      if (
        creationStep.step === CREATE_MTN_STEPS.CUSTOM_BATTLE_MTN &&
        creationStep.pending_tx === null
      ) {
        setTitle('');
        setDescription('');
      }

      setState({ viewMode: viewMode.CREATE });
    }
  }, [creationStep, state.viewMode, isCreatingInProgress, mountainCount]);

  /*
   * VIEWS
   */

  if (!connection?.provider?.eth || mountainCount === null) {
    return <LoadingSpinner />;
  }

  if (!connection?.hasCurrentAddress) {
    return <div>You must connect to a wallet TODO: put wallet button here</div>;
  }

  return (
    <>
      {/* View: Get Stated */}
      {state.viewMode === viewMode.GET_STARTED && (
        <CustomBattleMtnGetStarted startNewMountain={startNewMountain} />
      )}

      {/* View: Create */}
      {state.viewMode === viewMode.CREATE && (
        <div className="ui raised segment">
          {/* Main Step Headers */}
          <div className="ui ordered attached steps">
            <div
              className={`${
                isCreateStepsCompleted()
                  ? 'completed'
                  : isOnCreateSteps()
                  ? 'active'
                  : ''
              } step`}
            >
              <div className="content">
                <div className="title">Create</div>
                <div className="description">
                  Create custom battle mountain contracts
                </div>
              </div>
            </div>
            <div
              className={`${
                isInitializingStepsCompleted()
                  ? 'completed'
                  : isOnInitializingSteps()
                  ? 'active'
                  : ''
              } step`}
            >
              <div className="content">
                <div className="title">Initialize</div>
                <div className="description">Initialize contracts</div>
              </div>
            </div>
            <div
              className={`${
                isOnInitCustomBattleMtnStep() ? 'active' : ''
              } step`}
            >
              <div className="content">
                <div className="title">Deploy</div>
                <div className="description">
                  Name and deploy your contracts
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Create Contracts */}
          {isOnCreateSteps() && (
            <div className="ui attached segment">
              <p>Three contracts are needed to create a custom mountain.</p>

              {/* Create Battle Mountain */}
              {creationStep.step === CREATE_MTN_STEPS.CREATE_MTN &&
              !creationStep.customBattleMtnAddress ? (
                <div>
                  <p>First, create a Battle Mountain contract:</p>

                  <LoadingButton
                    isLoading={waitingForTransaction()}
                    onClick={() =>
                      startCreationStep(CREATE_MTN_STEPS.CREATE_MTN)
                    }
                  >
                    Create Battle Mountain
                  </LoadingButton>
                </div>
              ) : (
                <p>
                  <i className="green check circle icon"></i> Battle Mountain
                  Created
                </p>
              )}

              {/* Create VS Battle */}
              {creationStep.step === CREATE_MTN_STEPS.CREATE_VS &&
                !creationStep.customVsBattleAddress && (
                  <div>
                    <p>Create a VS Battle contract:</p>

                    <LoadingButton
                      isLoading={waitingForTransaction()}
                      onClick={() =>
                        startCreationStep(CREATE_MTN_STEPS.CREATE_VS)
                      }
                    >
                      Create VS Battle Contract
                    </LoadingButton>
                  </div>
                )}
            </div>
          )}

          {/* Step 2: Initialize Contracts */}
          {isOnInitializingSteps() && (
            <div className="ui attached segment">
              <CustomDeployToolView
                customBattleMtnAddress={creationStep.customBattleMtnAddress}
                customVsBattleAddress={creationStep.customVsBattleAddress}
                creationStep={creationStep}
                startCreationStep={startCreationStep}
                waitingForTransaction={waitingForTransaction}
              />
            </div>
          )}

          {/* Step 3: Custom Battle Mtn init */}
          {isOnInitCustomBattleMtnStep() && (
            <div className="ui attached segment">
              <div className="ui form">
                <div className="two fields">
                  <div className="field">
                    <label className="custom-mtn-input-label">Title</label>
                    <input
                      type="text"
                      placeholder="title"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                    />
                  </div>
                  <div className="field">
                    <label className="custom-mtn-input-label">
                      Description
                    </label>
                    <input
                      type={'text'}
                      placeholder="description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  </div>
                </div>
                <LoadingButton
                  color={isValid() ? 'disabled' : 'positive'}
                  isLoading={waitingForTransaction()}
                  onClick={() => {
                    initMountain(title, description);
                  }}
                >
                  Submit
                </LoadingButton>
              </div>
            </div>
          )}
          <div className="ui grid">
            <div className="right aligned sixteen wide column">
              <button
                className="ui red mini button mtn-cancel-btn"
                onClick={() => {
                  resetCustomBattleMtn();
                }}
              >
                Cancel/Restart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View: Edit */}
      {state.viewMode === viewMode.EDIT && (
        <CustomBattleMtnEditView
          mountains={mountains}
          mountainCount={mountainCount}
          selectedMountain={selectedMountain}
          setSelectedMountain={setSelectedMountain}
          startNewMountain={startNewMountain}
          setCustomBattleMtnState={setState}
        />
      )}
    </>
  );
};

export default CustomBattleMtns;
