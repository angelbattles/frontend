import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Confetti from 'react-dom-confetti';

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

const BattleMtnResult = (props) => {
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    setConfetti(true);
  }, []);

  return (
    <div>
      <div className="ui divider" />
      <div className={`sixteen wide column ABHeader blue ui raised segment`}>
        <div className="ui divider" />
        <h2> Battle Results </h2>
        <div className="ui grid">
          <div className="battle-mtn-results-content">
            <div className="row battle-mtn-results-content-header">
              It was an epic battle!
            </div>
            <div className="row battle-mtn-results-content-body">
              {props.status === 'won' && (
                <div>
                  <div className="confetti-container">
                    <Confetti active={confetti} config={config} />
                  </div>
                  <img
                    className=" ui centered fluid medium image battle-mtn-results-ribbon-img"
                    src={`images/site/BattleRibbon.png`}
                    alt="Battle Results"
                  />
                  Congrats, you won! You have now been promoted to spot{' '}
                  {props.spotContested}. Enjoy the lofty view!
                </div>
              )}
              {props.status === 'lost' && (
                <div>
                  You lost - Better luck next time, though. No one has changed
                  spots.
                </div>
              )}
              <div className="battle-mtn-results-battle-again">
                <Link
                  to={(location) => ({
                    ...location,
                    pathname: '/leaderboard',
                    state: { lastClicked: new Date() },
                  })}
                  className="item"
                  replace
                >
                  <button className=" ui compact blue button">
                    Battle again!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BattleMtnResult;
