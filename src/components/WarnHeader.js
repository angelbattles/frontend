import React, { useContext, useEffect, useState } from 'react';
import './css/HeaderSection.css';
import AppContext from './contexts/AppContext';

const WarnHeader = ({ title, color = 'white' }) => {
  const { api, isTransactionPending } = useContext(AppContext);
  const [hasApproval, setHasApproval] = useState(null);

  // Check if approval transfer approval given
  useEffect(() => {
    if (!api || isTransactionPending('approval')) {
      return;
    }

    api.cardData
      .hasTransferApproval('pets')
      .then((result) => {
        setHasApproval(result);
      })
      .catch(() => setHasApproval(null));
  }, [api, isTransactionPending]);

  function onRescindApproval(e) {
    e.preventDefault();

    api.cardData
      .rescindApproval('pets')
      .on('transactionHash', function (hash) {
        console.log(hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        console.log(receipt);
      })
      .on('receipt', function (receipt) {
        // receipt example
        console.log(receipt);
      });
  }

  function onGiveApproval(e) {
    e.preventDefault();

    api.cardData
      .giveApproval('pets')
      .on('transactionHash', function (hash) {
        console.log(hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        //console.log(receipt);
      })
      .on('receipt', function (receipt) {
        // receipt example
        console.log(receipt);
      });
  }

  return (
    <div className={`sixteen wide column ABHeader ${color} ui raised segment`}>
      <h4>
        Warning, in order to be able to retire 721 pets, you must first give
        approval to the pets contract to manage your cards.{' '}
      </h4>
      <h4>
        You only need to approve the pets contract once, and it will be valid
        for all your tokens. You may also want to remove the approval once you
        are finished.
      </h4>

      {hasApproval === false && (
        <button
          className={`ui green button ${
            isTransactionPending('approval') ? 'loading' : ''
          }`}
          onClick={onGiveApproval}
        >
          Give Approval
        </button>
      )}

      {hasApproval === true && (
        <button
          className={`ui purple button ${
            isTransactionPending('approval') ? 'loading' : ''
          }`}
          onClick={onRescindApproval}
        >
          Rescind Approval
        </button>
      )}
    </div>
  );
};

export default WarnHeader;
