import React from 'react';
import ABCard from './ABCard';

const NewCardsModal = ({ newCards, setNewCards }) => {
  if (!newCards) {
    return null;
  }

  return (
    <div className="ui dimmer modals page transition visible active ab-modal">
      <div className="ui active medium active modal">
        <div className="header new-cards-header">
          New Cards Since Last Check!
          <i
            className="close icon"
            onClick={() => {
              setNewCards(null);
            }}
          ></i>
        </div>
        <div className="content new-cards-content">
          <div className="ui center aligned grid">
            {newCards.ownerTokens.map((token, idx) => (
              <ABCard
                key={newCards.ownerTokenIds[idx]}
                id={newCards.ownerTokenIds[idx]}
                card={newCards.ownerTokens[idx]}
                cardId={newCards.ownerTokens[idx].cardSeriesId}
                view={'NewCard'}
                count={1}
                columnSize="five"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCardsModal;
