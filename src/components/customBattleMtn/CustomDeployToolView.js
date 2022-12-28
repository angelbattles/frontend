import React from 'react';

import LoadingButton from '../LoadingButton';
import { CREATE_MTN_STEPS } from './hooks/createCustomBattleMtn';

const stepIndex = {
  [CREATE_MTN_STEPS.BATTLE_MTN_SETCARDDATACONTACT]: 1,
  [CREATE_MTN_STEPS.BATTLE_MTN_INITMOUNTAIN]: 2,
  [CREATE_MTN_STEPS.BATTLE_MTN_DEFINEPATHS]: 3,
  [CREATE_MTN_STEPS.BATTLE_MTN_ADDSERAPHIM]: 4,
  [CREATE_MTN_STEPS.VSBATTLE_SETPARAMETERS]: 5,
};

const DeployTool = ({
  creationStep,
  startCreationStep,
  waitingForTransaction,
}) => {
  return (
    <>
      <div>
        Initialization Step {stepIndex[creationStep.step]} of 5
        <div className="ui progress">
          <div className="bar">
            <div className="progress"></div>
          </div>
        </div>
      </div>
      <LoadingButton
        isLoading={waitingForTransaction()}
        onClick={() => {
          startCreationStep(creationStep.step);
        }}
      >
        Run
      </LoadingButton>
    </>
  );
};

export default DeployTool;
