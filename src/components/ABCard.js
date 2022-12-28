import React from 'react';
import abcardinfo from '../config/abcardinfo';
import Stats from './Stats';
import BuyStats from './BuyStats';

const ABCard = ({
  card,
  count,
  view,
  cardId,
  id,
  onExpand,
  cardType = '', // pet, angel, etc
  breedingCount = null,
  columnSize = 'four',
  globalCardCount = ' ',
}) => {
  return (
    <div className={`${columnSize} wide column`}>
      <div className="ui fluid raised stackable card">
        <div className="image">
          {+count > 1 && <div className="floating ui red label">{count}</div>}
          <img src={`images/${cardId}.png`} alt="card" />
        </div>
        <div className="content">
          <span className="header">{abcardinfo.cards[cardId].description}</span>
          <div className="meta">
            {view !== 'Home' && ((count && count <= 1) || (!count && id)) ? (
              <>
                <div className="left aligned">Token ID: {id} </div>
                {cardType === 'pets' && breedingCount !== null && (
                  <div className="left aligned">
                    Breeding Count: {breedingCount}
                  </div>
                )}
              </>
            ) : view !== 'Home' ? (
              <span className="left floated"> &nbsp; </span>
            ) : (
              <span className="center floated">
                {globalCardCount} in circulation
              </span>
            )}
          </div>
        </div>
        <div className="extra content card-stats">
          {view !== 'Home' &&
          cardId <= 60 &&
          ((count && count <= 1) || !count) ? (
            <Stats
              seriesId={cardId}
              red={card.auraRed}
              yellow={card.auraYellow}
              blue={card.auraBlue}
              power={card.power}
              experience={card.experience}
            />
          ) : view !== 'Home' && cardId <= 60 ? (
            <button className="mini ui button" onClick={onExpand}>
              <i className="red eye icon"></i> Expand
            </button>
          ) : null}

          {view === 'Home' && cardId > 23 && cardId < 28 && (
            <Stats red={2} yellow={2} blue={2} power={10} />
          )}
          {view === 'Home' && cardId > 27 && cardId < 32 && (
            <Stats red={4} yellow={4} blue={4} power={20} />
          )}
          {view === 'Home' && cardId > 31 && cardId < 36 && (
            <Stats red={6} yellow={6} blue={6} power={30} />
          )}
          {view === 'Home' && cardId > 35 && cardId < 40 && (
            <Stats red={8} yellow={8} blue={8} power={40} />
          )}
          {view === 'Home' && cardId > 39 && cardId < 43 && (
            <Stats red={10} yellow={10} blue={10} power={50} />
          )}
          {view === 'Home' && cardId < 24 && <BuyStats cardId={cardId} />}
        </div>
      </div>
    </div>
  );
};

export default ABCard;
