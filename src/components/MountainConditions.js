import React from 'react';

const MountainConditions = ({
  auraBonus,
  petTypeBonus,
  lightAngelBonus,
  attackerBonus,
  petLevelBonus,
  superBerakiel,
  bridge1,
  bridge2,
  bridge3,
  bonusLevel,
}) => {
  return (
    <table className="ui celled unstackable table">
      <thead>
        <tr>
          <th>Current Bonuses</th>
          <th>Bridge Status</th>
          <th>Bonus Level</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Current Bonuses">
            <div className="ui grid">
              {auraBonus === '1' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/blue.jpg`}
                  alt="blue bonus"
                />
              )}
              {auraBonus === '2' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/yellow.jpg`}
                  alt="yellow bonus"
                />
              )}
              {auraBonus === '3' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/purple.jpg`}
                  alt="purple bonus"
                />
              )}
              {auraBonus === '4' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/orange.jpg`}
                  alt="orange bonus"
                />
              )}
              {auraBonus === '5' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/red.jpg`}
                  alt="red bonus"
                />
              )}
              {auraBonus === '6' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/green.jpg`}
                  alt="green bonus"
                />
              )}

              {petTypeBonus === '1' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/reptile.jpg`}
                  alt="reptile bonus"
                />
              )}
              {petTypeBonus === '2' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/avian.jpg`}
                  alt="avian bonus"
                />
              )}
              {petTypeBonus === '3' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/feline.jpg`}
                  alt="feline bonus"
                />
              )}
              {petTypeBonus === '4' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/equine.jpg`}
                  alt="equine bonus"
                />
              )}

              {lightAngelBonus === '1' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/light.jpg`}
                  alt="light angel bonus"
                />
              )}
              {lightAngelBonus === '2' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/dark.jpg`}
                  alt="dark angel bonus"
                />
              )}

              {attackerBonus === '1' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/attacker.jpg`}
                  alt="attacker bonus"
                />
              )}
              {attackerBonus === '2' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/defender.jpg`}
                  alt="defender bonus"
                />
              )}

              {petLevelBonus === '1' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/l1.jpg`}
                  alt="level1 pet bonus"
                />
              )}
              {petLevelBonus === '2' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/l2.jpg`}
                  alt="level2 pet bonus"
                />
              )}
              {petLevelBonus === '3' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/l3.jpg`}
                  alt="level3 pet bonus"
                />
              )}
              {petLevelBonus === '4' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/l4.jpg`}
                  alt="level4 pet bonus"
                />
              )}

              {superBerakiel === 'true' && (
                <img
                  className="ui fluid small image"
                  src={`images/bonuses/berakiel.jpg`}
                  alt="Super Berakiel"
                />
              )}
            </div>
          </td>
          <td data-label="Bridge Status">
            {bridge1 === true && <div> Bridge 1: Operational </div>}
            {bridge1 === false && <div> Bridge 1: Out! </div>}

            {bridge2 === true && <div> Bridge 2: Operational </div>}
            {bridge2 === false && <div> Bridge 2: Out! </div>}

            {bridge3 === true && <div> Bridge 3: Operational </div>}
            {bridge3 === false && <div> Bridge 3: Out! </div>}
          </td>
          <td data-label="Bonus Level">
            {bonusLevel === '1' && (
              <img
                className="ui fluid small image"
                src={`images/bonuses/level1.jpg`}
                alt="level1 bonus strength"
              />
            )}
            {bonusLevel === '2' && (
              <img
                className="ui fluid small image"
                src={`images/bonuses/level2.jpg`}
                alt="level2 bonus strength"
              />
            )}
            {bonusLevel === '3' && (
              <img
                className="ui fluid small image"
                src={`images/bonuses/level3.jpg`}
                alt="level3 bonus strength"
              />
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MountainConditions;
