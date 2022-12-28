import React, { useState, useEffect, useCallback, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import {
  angelTeamActions,
  monsterActions,
  Monsters,
} from '../../config/battles.js';
import HeaderSection from '../HeaderSection';
import BattleTurnResult from '../BattleTurnResult';
import Sound from 'react-sound';
import '../css/site.css';
import {
  getABToken,
  getSmallAuraEffect,
  getBigAuraEffect,
  getDefaultTransactionOptions,
} from '../web3/Utilities';



const getBackground = (monsterType) => {
    console.log(monsterType)
    if (monsterType <= 3) {
        return 'images/battles/backgrounds/meadow.png';
    }
    if (monsterType <= 7) {
        return 'images/battles/backgrounds/forest.png';
    }
    if (monsterType <= 7) {
        return 'images/battles/backgrounds/thunderdome.png';
    }

    return 'images/battles/backgrounds/meadow.png';
}

const BattleArenaView = ({
  angel,
  pet,
  onBattleEnd,
  refreshAllTokens,
  petId,
  accessoryId,
}) => {
  const [id, setId] = useState(null);
  //const [lastRound, setLastRound] = useState(0);
  const [status, setStatus] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [animation, setAnimation] = useState('normal');
  const [battleOver, setBattleOver] = useState(false);
  const [confirmResults, setConfirmResults] = useState(false);
  const [angelFirst, setAngelFirst] = useState(false);
  const [auraColor, setAuraColor] = useState('blue');
  const [soundOn, setSoundOn] = useState(false);
  const [angelTeam, setAngelTeam] = useState({
    angelId: null,
    petId: null,
    accessoryId: null,
    hp: 0,
    summonedPet: false,
    releasedAura: false,
    action: 'What will you do',
    resultValue: 0,
    defenseBuff: 0,
    aura: 0,
  });
  const [angelPower, setAngelPower] = useState('loading');
  const [angelSpeed, setAngelSpeed] = useState('loading');
  const [angelTeamRed, setAngelTeamRed] = useState('-');
  const [angelTeamYellow, setAngelTeamYellow] = useState('-');
  const [angelTeamBlue, setAngelTeamBlue] = useState('-');
  // Use with contract defaults
  const [smallAuraEffect, setSmallAuraEffect] = useState(15);
  const [bigAuraEffect, setBigAuraEffect] = useState(30);
  const [auraEffectsUpdated, setAuraEffectsUpdated] = useState(false);
  const [accessorySeriesId, setAccessorySeriesId] = useState(0);
    const [monster, setMonster] = useState(null);
    const [imgUrl, setImgUrl] = useState('images/battles/backgrounds/meadow.png')
    const { api } = useContext(AppContext);
 

  //If battle is finished, send the results up to the BattlesView component.
  useEffect(() => {
    if (battleOver === true) {
      console.log('Battle over -sending up');
      onBattleEnd(monster.type, status);
    }
  }, [battleOver, onBattleEnd, monster, status]);

  const updateBattleInfo = useCallback(
    async (_monster) => {
      if (!api) {
        return;
      }

      //function called to update state after each turn/
      const readUpdateFromChain = async () => {
        await api.battle.getBattleResultsForCaller().then(function (result) {
          setId(result.id);

          setStatus(result.status);

          console.log(
            `battle ${result.id} round ${result.status} result`,
            result
          );

          angelTeam.hp = result.angelHp;
          angelTeam.defenseBuff = result.angelDefenseBuff;
          angelTeam.action =
            result.status !== 103
              ? angelTeamActions[result.angelAction]
              : 'is victorious'; //here change to string based on array.
          angelTeam.resultValue = result.angelResultValue;

          const petAuraStatus = parseInt(result.petAuraStatus);
          if (petAuraStatus === 0) {
            angelTeam.releasedAura = false;
            angelTeam.summonedPet = false;
          }
          if (petAuraStatus === 1) {
            angelTeam.releasedAura = true;
            angelTeam.summonedPet = false;
          }
          if (petAuraStatus === 10) {
            angelTeam.releasedAura = false;
            angelTeam.summonedPet = true;
          }
          if (petAuraStatus === 11) {
            angelTeam.releasedAura = true;
            angelTeam.summonedPet = true;
          }

          angelTeam.defenseBuff = result.angelDefenseBuff;

          setMonster({
            ..._monster,
            hp: result.monsterHp,
            action: monsterActions[result.monsterAction],
            resultValue: result.monsterResultValue,
            defenseBuff: result.monsterDefenseBuff,
          });
            setAngelTeam(angelTeam);

            setAngelFirst(result.angelFirst);

          if (result.status > 100) {
            console.log('battle over');
            setConfirmResults(true);
            refreshAllTokens();
            return;
          }

          setPlayerTurn(true);
   

          return true;
        });
      };

      await readUpdateFromChain();
      //setLastRound(status);
      setAnimation('normal');
    },
    [angelTeam, api, refreshAllTokens]
    );

  // Run once - This should initialize the battle and monster
    useEffect(() => {

    if (monster || !api) {
      return;
    }

    //Function called once to get monster information
    const getMonsterInfo = async () =>
      await api.battle.getStaticMonsterStatsForCaller().then(function (result) {
        console.log('monster info:', result);
        const newMonster = {
          type: result.monsterType,
          hp: 0,
          power: result.monsterPower,
          auraRed: result.monsterAuraRed,
          auraBlue: result.monsterAuraBlue,
          auraYellow: result.monsterAuraYellow,
          action: 'appears',
          resultValue: 0,
          defenseBuff: 0,
        };
          setMonster(newMonster);

          const img = getBackground(result.monstersTyle);
          console.log(img)
          setImgUrl(img)
        var auraColor = 'maroon';

        switch (result.aura) {
          case '0':
            auraColor = 'blue';
            break;
          case '1':
            auraColor = 'yellow';
            break;
          case '2':
            auraColor = 'purple';
            break;
          case '3':
            auraColor = 'orange';
            break;
          case '4':
            auraColor = 'red';
            break;
          case '5':
            auraColor = 'green';
            break;
          default:
            break;
        }

        setAuraColor(auraColor);
        return newMonster;
      });

    const init = async () => {
      const newMonster = await getMonsterInfo();
      //Keep reading from the chain until we have a new battle
        console.log('waiting', status);
        setTimeout(async () => {
            await updateBattleInfo(newMonster);
        }, 5000)
  
    };

    init();
  }, [api, updateBattleInfo, status, monster]);

  // Run once - This should report the angel team's power and speed
  // which is set at the beginning of the battle and then doesn't change
  useEffect(() => {
    if (angelPower !== 'loading' || !api) {
      return;
    }

    //Function called once to get angel information
    const getAngelStaticInfo = async () =>
      await api.battle.getStaticAngelStatsForCaller().then(function (result) {
        setAngelPower(result.power);
        setAngelSpeed(result.speed);
      });

    getAngelStaticInfo();
  }, [api, updateBattleInfo, status, monster, petId, accessoryId, angelPower]);

  // Run once - This should update the angel team's aura
  // including any effects from accessories.
  useEffect(() => {
    console.log(petId, accessoryId);
    if (angelTeamRed !== '-' || !api) {
      return;
    }

    // get small and big Aura Effects from ABBattleSupport Contract
    const getAuraEffectValues = async () => {
      const sae = await getSmallAuraEffect();
      setSmallAuraEffect(parseInt(sae, 10));
      const bae = await getBigAuraEffect();
      setBigAuraEffect(parseInt(bae, 10));
      setAuraEffectsUpdated(true);
    };

    //Function called once to get angel information
    const getAngelDynamicAuraInfo = async () => {
      if (petId) {
        const pet = await getABToken(parseInt(petId, 10));

        setAngelTeamRed(pet.auraRed);
        setAngelTeamYellow(pet.auraYellow);
        setAngelTeamBlue(pet.auraBlue);
      }
      if (accessoryId) {
        const accessory = await getABToken(parseInt(accessoryId, 10));
          console.log(accessory)
        setAccessorySeriesId(parseInt(accessory.cardSeriesId));
      }
    };

    getAuraEffectValues();
    getAngelDynamicAuraInfo();
  }, [api, status, petId, accessoryId, angelTeamRed]);

  useEffect(() => {
    if (!auraEffectsUpdated || accessorySeriesId === 0) {
      return;
    }
      console.log('accessory series id',
          accessorySeriesId)
    const red = parseInt(angelTeamRed, 10);
    const yellow = parseInt(angelTeamYellow, 10);
    const blue = parseInt(angelTeamBlue, 10);

    //Account for colored accessories here. Other accessories
    // have already affected power/ speed values returned from contract.
    if (accessorySeriesId === 49) {
      setAngelTeamRed(red + smallAuraEffect);
    }
    if (accessorySeriesId === 50) {
      setAngelTeamRed(red + bigAuraEffect);
    }
    if (accessorySeriesId === 51) {
      setAngelTeamYellow(yellow + smallAuraEffect);
    }
    if (accessorySeriesId === 52) {
      setAngelTeamYellow(yellow + bigAuraEffect);
    }
    if (accessorySeriesId === 53) {
      setAngelTeamBlue(blue + smallAuraEffect);
    }
    if (accessorySeriesId === 54) {
      setAngelTeamBlue(blue + bigAuraEffect);
    }
  }, [auraEffectsUpdated, accessorySeriesId]);

  const resetPlayerTurn = () => {
    setPlayerTurn(true);
    setAnimation('normal');
  };

    const doAction = async (action) => {
        const options = await getDefaultTransactionOptions();
        setPlayerTurn(false);
        if (action === 'auraBurst') {
            setAnimation(action + auraColor)
        }
        else { setAnimation(action) };
     
      api.battle
          .doAction(action, id, options)
      .on('receipt', (receipt) => {
        console.log(receipt);
        updateBattleInfo(monster);
      })
      .on('error', function (error, gasError) {
        resetPlayerTurn();
      });
  };

  //Render if battle is still loading.
  if (!monster || status === 0) {
    return (
      <div>
        <img
          className=" ui centered fluid large image"
          src={`images/battles/monsters/99.png`}
          alt="loading"
          style={styles.whiteBg}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minWidth: '100%',
        maxWidth: 500,
        minHeight: '100%',
        maxHeight: 150,
      }}
    >
          <HeaderSection title="Battle Arena" />
      <div className="ui hidden divider"></div>
      {soundOn && (
        <Sound url="sounds/fightMusic.m4a" playStatus={Sound.status.PLAYING} />
          )}
          <h4>
              {' '}
              Battle id: {id} -{' '}
              {parseInt(status, 10) < 100 ? (
                  <span>Results for Round: {parseInt(status, 10) - 1} </span>
              ) : (
                  <span> Final Results </span>
              )}{' '}
          </h4>
          <div className="ui centered fluid grid" key={imgUrl} style={{
              'backgroundSize': 'cover',
              'overflow': 'hidden',
              'backgroundImage': `url(${imgUrl})`
          }
          } >
        <div className="fourteen wide column">
          {angelFirst && (
            <BattleTurnResult
              color="blue"
              subject={angel}
              pet={pet}
              action={angelTeam.action}
              resultValue={angelTeam.resultValue}
              number={'1. '}
            />
          )}
          {!angelFirst && (
            <BattleTurnResult
              color="red"
              subject={Monsters[monster.type].name}
              action={monster.action}
              resultValue={monster.resultValue}
              number={'1. '}
            />
          )}
          {!angelFirst && (
            <BattleTurnResult
              color="blue"
              subject={angel}
              pet={pet}
              action={angelTeam.action}
              resultValue={angelTeam.resultValue}
              number={'2. '}
            />
          )}
          {angelFirst && (
            <BattleTurnResult
              color="red"
              subject={Monsters[monster.type].name}
              action={monster.action}
              resultValue={monster.resultValue}
              number={'2. '}
            />
          )}
        </div>

        <div className="row 3 columns">
          <div className="six wide column">
            <div className="ui red segment">
              <div>Enemy Stats</div>
              <span>
                <i
                  className="red heart icon"
                  title="The red rocket ship for angels represents pet speed/luck. This helps in determining whether the angel or the monster will go first."
                ></i>{' '}
                {monster.hp || 0}
              </span>
              <span>
                <i
                  className="red fire icon"
                  title={'Red Aura - Affects Initial Battle Power'}
                ></i>
                {monster.auraRed || 0}
              </span>
              <span>
                <i
                  className="blue tint icon"
                  title={'Blue Aura - Affects Initial Defense'}
                >
                  {' '}
                </i>
                {monster.auraBlue || 0}
              </span>
              <span>
                <i
                  className="yellow sun icon"
                  title={'Yellow Aura - Speed/Luck'}
                >
                  {' '}
                </i>
                {monster.auraYellow || 0}
              </span>
              <span>
                <i
                  className="bolt icon"
                  title={
                    'Battle Power - The more battle power, the harder likely to attack'
                  }
                >
                  {' '}
                </i>{' '}
                {monster.power || 0}
              </span>

              <span>
                <i
                  className="green shield alternate icon"
                  title={
                    'Defense buff - Extra increase in defense that will result in enemy strikes causing less damage'
                  }
                >
                  {' '}
                </i>
                {monster.defenseBuff || 0}
              </span>
            </div>
          </div>
          <div className="column" />
          <div className="six wide column">
            <div className={`ui ${auraColor} segment`}>
              <div>Angel Stats</div>
              <span>
                <i
                  className="red heart icon"
                  title={
                    'Hit points (HP) - amount of damage taken before defeat'
                  }
                ></i>{' '}
                {angelTeam.hp || 0}
              </span>
              <span>
                <i
                  className="red fire icon"
                  title={'Red Aura - Affects Initial Battle Power'}
                ></i>
                {angelTeamRed}
              </span>
              <span>
                <i
                  className="blue tint icon"
                  title={'Blue Aura - Affects Initial Defense'}
                >
                  {' '}
                </i>
                {angelTeamBlue}
              </span>
              <span>
                <i
                  className="yellow sun icon"
                  title={'Yellow Aura - Affects Initial Speed/Luck'}
                >
                  {' '}
                </i>
                {angelTeamYellow}
              </span>
              <span>
                <i
                  className="bolt icon"
                  title={
                    'Battle Power - The more battle power, the harder likely to attack'
                  }
                >
                  {' '}
                </i>{' '}
                {angelPower}
              </span>
              <span>
                <i
                  className="red rocket icon"
                  title={
                    'Speed/Luck - Helps in determining whether the angel or the monster will go first'
                  }
                ></i>
                {angelSpeed}
              </span>
              <span>
                <i
                  className="green shield alternate icon"
                  title={
                    'Defense buff - Extra increase in defense that will result in enemy strikes causing less damage'
                  }
                >
                  {' '}
                </i>
                {angelTeam.defenseBuff || 0}
              </span>
              <span>
                <i className={`${auraColor} fire icon`} title={'Angel color'}>
                  {' '}
                </i>
                {auraColor}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div style={styles.animation}>
            {animation !== 'normal' && (
              <img
                className="ui centered fluid medium image"
                src={`images/battles/animations/${animation}.gif`}
                alt="battle action animation"
              />
            )}
          </div>
          <div style={styles.monster}>
            <img
              className=" ui centered fluid medium image"
              src={`images/battles/monsters/${monster.type}.png`}
              alt="Wimpy Cirrus Meadows Roster"
            />
          </div>
        </div>
        <div onClick={() => setSoundOn(!soundOn)}>
          {soundOn ? (
            <img
              height="30px"
              src="./images/battles/soundOff.svg"
              alt="turn sound off"
            />
          ) : (
            <img
              height="30px"
              src="./images/battles/soundOn.svg"
              alt="turn sound on"
            />
          )}
        </div>
        {!confirmResults && (
          <>
            <div className="four column centered row">
              {playerTurn && (
                <div className="column" onClick={() => doAction('attack')}>
                  <img
                    className="ui centered fluid small image hover-cursor"
                    src={`images/battles/Attack_Active.png`}
                    alt="fight"
                  />
                </div>
              )}
              {!playerTurn && (
                <div className="column">
                  <img
                    className="ui centered fluid small image"
                    src={`images/battles/Attack_Inactive.png`}
                    alt="fight"
                  />
                </div>
              )}
              {playerTurn && (
                <div className="column" onClick={() => doAction('defend')}>
                  <img
                    className="ui centered fluid small image hover-cursor"
                    src={`images/battles/Defend_Active.png`}
                    alt="defend"
                  />
                </div>
              )}
              {!playerTurn && (
                <div className="column">
                  <img
                    className="ui centered fluid small image"
                    src={`images/battles/Defend_Inactive.png`}
                    alt="defend"
                  />
                </div>
              )}
            </div>
            <div className="four column centered row">
              {playerTurn && !angelTeam.releasedAura && (
                <div className="column" onClick={() => doAction('auraBurst')}>
                  <img
                    className="ui centered fluid small image hover-cursor"
                    src={`images/battles/AuraBurst_Active.png`}
                    alt="AuraBurst"
                  />
                </div>
              )}
              {(!playerTurn || angelTeam.releasedAura) && (
                <div className="column">
                  <img
                    className="ui centered fluid small image"
                    src={`images/battles/AuraBurst_Inactive.png`}
                    alt="auraBurst"
                  />
                </div>
              )}
              {playerTurn && !angelTeam.summonedPet && (
                <div className="column" onClick={() => doAction('summonPet')}>
                  <img
                    className="ui centered fluid small image hover-cursor"
                    src={`images/battles/Summon_Active.png`}
                    alt="Summon Pet"
                  />
                </div>
              )}
              {(!playerTurn || angelTeam.summonedPet) && (
                <div className="column">
                  <img
                    className="ui centered fluid small image"
                    src={`images/battles/Summon_Inactive.png`}
                    alt="summon pet"
                  />
                </div>
              )}
            </div>
          </>
              )}
              {!confirmResults && (<div className="one-em-padd">
                  <button
                      type="button"
                      className="ui button"
                      onClick={() => updateBattleInfo(monster)}
                  >
                      Manual Update{' '}
                  </button>
              </div>) }
        {confirmResults && (
          <div className="one-em-padd">
            <button
              type="button"
              className="ui button"
              onClick={() => setBattleOver(true)}
            >
              Confirm Results{' '}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


let styles = {
  whiteBg: {
    backgroundColor: 'white',
  },
  normal: {},
  animation: {
    position: 'absolute',
    zIndex: 100,
    width: 300,
    height: 300,
  },
  relative: {
    position: 'relative',
    zIndex: 1,
    width: 300,
    height: 300,
  },
};

export default BattleArenaView;
