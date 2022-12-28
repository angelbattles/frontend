import React from 'react';
import abcardinfo from '../config/abcardinfo';
import PowerStats from './PowerStats';

function BuyStats(props) {
  return (
    <div className={`ui ${abcardinfo.cards[props.cardId].aura} segment`}>
      {props.cardId < 24 && <PowerStats cardId={props.cardId} />}
      <div>
        {(abcardinfo.cards[props.cardId].aura === 'red' ||
          abcardinfo.cards[props.cardId].aura === 'purple' ||
          abcardinfo.cards[props.cardId].aura === 'orange') && (
          <i className="red fire icon"> </i>
        )}
        {(abcardinfo.cards[props.cardId].aura === 'blue' ||
          abcardinfo.cards[props.cardId].aura === 'green' ||
          abcardinfo.cards[props.cardId].aura === 'yellow') && (
          <i className="grey fire icon"> </i>
        )}

        {(abcardinfo.cards[props.cardId].aura === 'blue' ||
          abcardinfo.cards[props.cardId].aura === 'purple' ||
          abcardinfo.cards[props.cardId].aura === 'green') && (
          <i className="blue tint icon"> </i>
        )}
        {(abcardinfo.cards[props.cardId].aura === 'red' ||
          abcardinfo.cards[props.cardId].aura === 'yellow' ||
          abcardinfo.cards[props.cardId].aura === 'orange') && (
          <i className="grey tint icon"> </i>
        )}

        {(abcardinfo.cards[props.cardId].aura === 'yellow' ||
          abcardinfo.cards[props.cardId].aura === 'orange' ||
          abcardinfo.cards[props.cardId].aura === 'green') && (
          <i className="yellow sun icon"> </i>
        )}
        {(abcardinfo.cards[props.cardId].aura === 'red' ||
          abcardinfo.cards[props.cardId].aura === 'blue' ||
          abcardinfo.cards[props.cardId].aura === 'purple') && (
          <i className="grey sun icon"> </i>
        )}

        {props.cardId < 24 && (
          <span>
            {' '}
            Aura:{' '}
            {abcardinfo.cards[props.cardId].aura.slice(0, 1).toUpperCase() +
              abcardinfo.cards[props.cardId].aura.slice(
                1,
                abcardinfo.cards[props.cardId].aura.length
              )}{' '}
          </span>
        )}
      </div>
    </div>
  );
}
export default BuyStats;
