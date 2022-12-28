import React, { useState, useEffect } from 'react';
import { Monsters } from '../config/battles';
import './css/site.css';
import Confetti from 'react-dom-confetti';
import ABCardInfo from '../config/abcardinfo';

const config = {
  angle: '109',
  spread: '247',
  startVelocity: 40,
  elementCount: '84',
  dragFriction: '0.17',
  duration: '4740',
  stagger: 3,
  width: '16px',
  height: '14px',
  perspective: '385px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

function BattleResult(props) {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    if (props.status === 'won') {
      setConfetti(true);
    }
  }, [props.status]);

  const getAccessoryName = () => {
    if (typeof props.accessory === 'string') {
      return props.accessory;
    }

    return ABCardInfo.cards[parseInt(props.accessory.cardSeriesId, 10)].name;
  };
  return (
    <div>
      <div className="ui divider"></div>
      <div className={`sixteen wide column ABHeader blue ui raised segment`}>
        <div className="ui divider"></div>

        <h2>
          Battle Results
          {props.status === 'won' && (
            <div className="confetti-container">
              <Confetti active={confetti} config={config} />
            </div>
          )}
        </h2>

        <div className="ui grid">
          <div className="row">
            <img
              className=" ui centered medium image"
              src={`images/battles/monsters/${props.monsterType}.png`}
              alt="Battle Results"
            />
          </div>
          <div className="one-em-padd">
            <div className="row">
              Your Team of {props.angel}
              {!props.accessory ? ` and ` : ', '} {props.pet}{' '}
              {props.accessory ? `and ${getAccessoryName()}` : ''} faced off in
              a vicious battle.
            </div>
            {props.status === 'won' && (
              <div>
                Congrats, you won! You earned{' '}
                {Monsters[props.monsterType].experience} experience
              </div>
            )}
            {props.status === 'lost' && (
              <div> You lost - Better luck next time, though </div>
            )}
            {props.status === 'ran' && (
              <div>
                Unfortunately, the {Monsters[props.monsterType].name} ran away
                like a little coward though.
              </div>
            )}
            {props.monsterType === 12 && props.status === 'won' && (
              <div className="one-em-padd">
                You beat the rarest of the rare, the Liquid Metal Cornu! You
                have earned a Titanium Medal and the Cornu has gained 5 hp and 4
                power to prepare for the next player that challenges it.
              </div>
            )}
            {props.status === 'angelRan' && (
              <div>Sadly, you ran away like a little coward though.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default BattleResult;
