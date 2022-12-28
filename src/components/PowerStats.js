import React from 'react';

function PowerStats(props) {
  return (
    <span className="ui right aligned">
      <i
        className="yellow bolt icon"
        title={
          'Battle Power - The more battle power, the harder likely to attack'
        }
      >
        {' '}
      </i>
      Power Min:
      {props.cardId >= 4 && 100 + (props.cardId - 4) * 10}
      {props.cardId === 0 && 50}
      {props.cardId === 1 && 120}
      {props.cardId === 2 && 330}
      {props.cardId === 3 && 350}
    </span>
  );
}
export default PowerStats;
