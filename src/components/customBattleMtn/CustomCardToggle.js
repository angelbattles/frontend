import { useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ABCard from '../ABCard';
import LoadingButton from '../LoadingButton';

const CustomCardToggle = ({
  cardSeriesId,
  status,
  toggleStatus,
  closeToggleStatus,
}) => {
  const { isTransactionPending } = useContext(AppContext);

  if (cardSeriesId === null) {
    return null;
  }

  return (
    <div className="ui dimmer modals page transition visible active ab-modal">
      <div className="ui active tiny active modal">
        <div className="header custom-card-status-header">
          Card Status
          <i className="close icon" onClick={closeToggleStatus}></i>
        </div>
        <div className="content custom-card-status-content">
          <div className="ui two column centered grid">
            <div className="column">
              <ABCard cardId={cardSeriesId} view={'Home'} columnSize={'one'} />
            </div>
            <div className="column">
              <LoadingButton
                color={`${status ? 'positive' : 'negative'} ui button`}
                loadingColor={`${status ? 'positive' : 'negative'} ui button`}
                isLoading={isTransactionPending(
                  `setCardProhibitedStatus_${cardSeriesId}`
                )}
                onClick={() => toggleStatus(cardSeriesId, !status)}
              >
                {status ? 'Allow' : 'Prohibit'}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCardToggle;
