import React, { useContext, useState, useEffect } from 'react';
import AppContext from './contexts/AppContext';
import { getDefaultTransactionOptions } from './web3/Utilities';

const ChangeConditionsButton = ({ onChangeConditions, nextChangeAllowed }) => {
  const { api, isTransactionPending, battleMountain } = useContext(AppContext);
  const [commitStatus, setCommitStatus] = useState(null);

  // Only get commit status for main mountain id = 0
  useEffect(() => {
    if (!api || battleMountain?.data?.id !== 0) {
      return;
    }

    api.battleMountain.getCommitStatus().then((status) => {
      setCommitStatus(status);
    });
  }, [api, isTransactionPending, battleMountain]);

    const changeConditionsCommit = async () => {
        const options = await getDefaultTransactionOptions();
    api.battleMountain
      .changeConditionsCommit( options)
      .on('confirmation', function (confirmationNumber, receipt) {
        // start countdown
      });
  };

  const changeConditionsReveal = async () => {
      const options = await getDefaultTransactionOptions();
    api.battleMountain
      .changeConditionsReveal( options)
      .on('confirmation', function (confirmationNumber, receipt) {
        onChangeConditions();
      });
  };

  if (
    isTransactionPending('changeConditionsCommit') ||
    isTransactionPending('changeConditionsReveal')
  ) {
    return <button className="mini ui loading button">Loading</button>;
  }

  if (!nextChangeAllowed) {
    return <button className="ui disabled button">Insuffecient Time</button>;
  }

  return (
    <div className="extra content">
      {commitStatus ? (
        <button
          className="ui purple button"
          onClick={() => changeConditionsReveal()}
        >
          Change Conditions Reveal
        </button>
      ) : (
        <button
          className="ui purple button"
          onClick={() => changeConditionsCommit()}
        >
          Change Conditions Commit
        </button>
      )}
    </div>
  );
};

export default ChangeConditionsButton;
