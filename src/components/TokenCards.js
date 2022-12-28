import React, { useMemo, useState } from 'react';
import HeaderSection from './HeaderSection';
import LoadingSpinner from './LoadingSpinner';
import ABCard from './ABCard';

const getCardType = (card) => {
  if (card.cardSeriesId < 24) {
    return 'angels';
  } else if (card.cardSeriesId < 43) {
    return 'pets';
  } else if (card.cardSeriesId < 61) {
    return 'accessories';
  } else {
    return 'medals';
  }
};

function TokenCards({ view, cards }) {
  const [expanded, setExpanded] = useState(false);

  // Filtered cards based on view (prop)
  const filteredCards = useMemo(() => {
    const fCards = {};

    if (cards && cards.ownerTokens) {
      cards.ownerTokens.forEach((card, idx) => {
        if (getCardType(card) === view) {
          // Check if card series has been seen and added to fCards (filtered cards)
          // if not, initialize a property with shape {cards: Token[], expanded: boolean}
          if (!fCards[card.cardSeriesId]) {
            fCards[card.cardSeriesId] = {
              cards: [],
              expanded: false,
            };
          }

          // Push current card fCards[cardSeriesId]
          fCards[card.cardSeriesId].cards.push({ ...card });
        }
      });
    }

    return fCards;
  }, [cards, view]);

  const hasDuplicates = useMemo(
    () =>
      !!Object.values(filteredCards).find((series) => series.cards.length > 1),
    [filteredCards]
  );

  const handleExpanded = () => setExpanded(!expanded);

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return !cards || !cards.ownerTokens ? (
    <LoadingSpinner />
  ) : (
    <div className="ui stackable grid">
      <HeaderSection title={capitalizeFirstLetter(view)} />

      {hasDuplicates && (
        <div className="row">
          <div className="column">
            <button className="small ui button" onClick={handleExpanded}>
              {expanded ? 'Collapse' : 'Expand'}
            </button>
          </div>
        </div>
      )}

      {Object.values(filteredCards).map((series) =>
        expanded ? (
          series.cards.map((card) => (
            <ABCard
              key={card.tokenId}
              id={card.tokenId}
              card={card}
              cardId={card.cardSeriesId}
              view={'MyTeam'}
              cardType={getCardType(card)}
              breedingCount={card.breedingCount}
            />
          ))
        ) : (
          <ABCard
            key={series.cards[0].tokenId}
            id={series.cards[0].tokenId}
            card={series.cards[0]}
            cardId={series.cards[0].cardSeriesId}
            view={'MyTeam'}
            count={series.cards.length}
            onExpand={handleExpanded}
          />
        )
      )}
    </div>
  );
}
export default TokenCards;
