import React from 'react';

const Stats = ({ seriesId, red, blue, yellow, power, experience }) => {
  return seriesId <= 42 ? (
    <div>
      <span>
        <i className="red fire icon" title={'Red Aura - Attack Power'}></i>{' '}
        {red || 0}{' '}
      </span>
      <span>
        <i className="blue tint icon" title={'Blue Aura - Defense Power'}>
          {' '}
        </i>{' '}
        {blue || 0}{' '}
      </span>
      <span>
        <i className="yellow sun icon" title={'Yellow Aura - Speed/Luck'}>
          {' '}
        </i>{' '}
        {yellow || 0}{' '}
      </span>
      <span>
        <i
          className="bolt icon "
          title={
            'Battle Power - The more battle power, the harder you are likely to attack'
          }
        >
          {' '}
        </i>{' '}
        {power || 0}{' '}
      </span>
          {seriesId < 24 && <span>
              <i
                  className="graduation cap icon"
                  title={'Experience Points (EXP) - Additional hit points (HP)'}
              >
                  {' '}
              </i>
              {experience || 0}{' '}
          </span>}
    </div>
  ) : null;
};
export default Stats;
