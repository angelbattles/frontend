import React, {
  useReducer,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import AppContext from '../contexts/AppContext';
import { ValidPaths } from '../../config/mountain';
import HeaderSection from '../HeaderSection';
import VSBattleArenaView from './VSBattleArenaView';
import MountainStats from '../MountainStats';
import TeamInfo from '../TeamInfo';
import AttackButton from '../AttackButton';
import BattleMtnResults from '../BattleMtnResults';
import CardWarning from '../web3/CardWarning';
import LoadingSpinner from '../LoadingSpinner';
import MountainConditions from '../MountainConditions';
import LeaderBoardTeamSelector from '../LeaderBoardTeamSelector';
import {
  getHumanReadableDate,
  getNextConditionChangeDate,
} from '../utils/date';
import { vs_battle_address } from '../web3/SolidityContractsAddresses';
import ChangeConditionsButton from '../ChangeConditionsButton';
import { getDefaultTransactionOptions } from '../web3/Utilities';

const initialState = {
  view: 'overview',
  fighting: 'loading',
  spotsData: [],
  spots: [],
  gates: [50, 51, 52, 53, 54, 55, 56, 63, 54],
  teamInfo: 0,
  ownerTokenIds: [],
  mountainConditions: {},
  searchMtnId: '',
  searchMtnResult: null,
  claimData: {},
};

const reducer = (prevState, newStates) => ({ ...prevState, ...newStates });

const mapSpots = {
  1: [1, 2, 3, 4, 5, 13, 20, 27],
  2: [6, 11, 12, 14, 15, 21, 22, 28],
  3: [7, 9, 16, 18, 23, 25, 30, 32],
  4: [8, 10, 17, 19, 24, 26, 34, 37],
  5: [29, 31, 33, 35, 38, 40, 42, 45],
  6: [36, 41, 44, 46, 48, 54, 55, 56],
  7: [39, 43, 47, 49, 50, 51, 52, 53],
  8: [57, 58, 59, 60, 61, 62, 63, 64],
};

const LeaderboardView = ({ cards, refreshAllTokens }) => {
  const { api, isTransactionPending, battleMountain } = useContext(AppContext);
  const [state, setState] = useReducer(reducer, initialState);
  const [mountainCount, setMountainCount] = useState(0);
  const [mountains, setMountains] = useState([]);
  const [cardOnMountainStatuses, setCardOnMountainStatuses] = useState({});
  const [cardStatuses, setCardStatuses] = useState({
    allowed: [],
    prohibited: [],
  });
  //const [ownerBalance, setOwnerBalance] = useState(0);
  //const [mountainPayoutInfo, setMountainPayoutInfo] = useState(0);
  const [vSHaloBalance, setVSHaloBalance] = useState(0);

  const getCurrentCardPlayability = useCallback(() => {
    const getCardStatuses = () =>
      Promise.all(
        [...Array(60)].map((_, cardSeriesId) => {
          return api.battleMountain.getCardProhibitedStatus(cardSeriesId);
        })
      );

    const currCardStatues = {
      allowed: [],
      prohibited: [],
    };

    getCardStatuses().then((statuses) => {
      statuses.forEach((status, idx) => {
        currCardStatues[status ? 'prohibited' : 'allowed'].push(idx);
      });
      setCardStatuses(currCardStatues);
    });
  }, [api]);

  const getCurrentConditions = useCallback(() => {
    api.battleMountain.getCurrentConditions().then((result) => {
      setState({
        mountainConditions: result,
      });
    });
  }, [api]);

  // Init
  useEffect(() => {
    if (!api || !cards.ownerTokens) {
      return;
    }

    // Read the halo balance

    api.token.balanceOf(vs_battle_address).then(function (result) {
      setVSHaloBalance(result / 1000000000000000000);
    });
    getCurrentConditions();
    getCurrentCardPlayability();

    setState({ ownerTokenIds: cards.ownerTokenIds });
  }, [api, getCurrentConditions, getCurrentCardPlayability, cards]);

  // Check if cards on mountain
  useEffect(() => {
    if (!api || !cards.ownerTokens) {
      return;
    }

    const onMountainStatuses = {};
    const getMtnStatuses = () =>
      Promise.all(
        cards.ownerTokens.map((token) =>
          api.battleMountain.cardOnBattleMtn(token.tokenId)
        )
      );

    getMtnStatuses().then((statuses) => {
      statuses.forEach((status, idx) => {
        onMountainStatuses[cards.ownerTokens[idx].tokenId] = status;
      });

      setCardOnMountainStatuses(onMountainStatuses);
    });
  }, [api, cards, battleMountain]);

  /* Check mountain balances
  useEffect(async () => {
    if (!api || !battleMountain) {
      return;
      }


    const currentAddress = await getCurrentAddress();

    let balance = await api.battleMountain.getOwnerBalance(
      currentAddress,
      battleMountain
    );
    setOwnerBalance(balance);
    api.battleMountain
      .getMountainBalance()
      .then((result) => setMountainPayoutInfo(result));
  }, [api, battleMountain]);

*/

  // Display View (loading, won, lost, etc)
  // Set the fighting state to none after initial page load If cards are refreshed in the app, like when after a battle
  // and the view is the results page then setting fighting to 'none' will not allow the the intended page to be viewed.
  useEffect(() => {
    if (!api || !cards.ownerTokens) {
      return;
    }

    if (state.fighting === 'loading') {
      setState({ fighting: 'none' });
    }
  }, [api, cards, state.fighting]);

  const getClaimData = async (angelId, position) => {
    if (battleMountain?.data?.id !== 0) {
      return [];
    }

    position = +position; // convert to int
    const data = [];

    // be anywhere on the mountain
    const claimedGold = await api.medal.goldClaimedAngel(angelId);
    if (!claimedGold) {
      data.push({
        type: 'gold',
        position: position,
        angelId: angelId,
      });
    }

    // be on the first panel [1, 2, 3, 4, 5, 13, 20, 27]
    const validSpots = [1, 2, 3, 4, 5, 13, 20, 27];

    if (validSpots.includes(position)) {
      const claimedDiamond = await api.medal.diamondClaimedAngel(angelId);
      if (!claimedDiamond) {
        data.push({
          type: 'diamond',
          position: position,
          angelId: angelId,
        });
      }
    }

    // be at spot 1
    if (position === 1) {
      const claimedZeronium = await api.medal.zeroniumClaimedAngel(angelId);
      if (!claimedZeronium) {
        data.push({
          type: 'zeronium',
          position: position,
          angelId: angelId,
        });
      }
    }

    return data;
  };

  const getClaimButton = (button) => {
    switch (button.type) {
      case 'gold':
        return (
            <button
                className='ui button'
            key={`goldClaim-{$button.position}-{$button.angelId}`}
            onClick={() => claimGold(button.angelId, button.position)}
          >
            Claim Gold
          </button>
        );
      case 'diamond':
        return (
            <button
                className='ui button'
            key={`diamondClaim-{$button.position}-{$button.angelId}`}
            onClick={() => claimDiamond(button.angelId, button.position)}
          >
            Claim Diamond
          </button>
        );
      case 'zeronium':
        return (
            <button
                className='ui button'
            key={`zeroniumClaim-{$button.position}-{$button.angelId}`}
            onClick={() => claimZeronium(button.angelId, button.position)}
          >
            Claim Zeronium
          </button>
        );
      default:
        return '';
    }
  };

    const claimGold = async (angelId, position) => {
        const options = await getDefaultTransactionOptions();
    api.medal.claimGold(angelId, options).on('receipt', function (receipt) {
      getClaimData(angelId, position).then((data) => {
        setState({
          claimData: { ...state.claimData, [position]: data },
        });
      });

      console.log(receipt);
    });
  };

    const claimDiamond = async (angelId, position) => {
        const options = await getDefaultTransactionOptions();
    api.medal.claimDiamond(angelId, position, options).on('receipt', function (receipt) {
      getClaimData(angelId, position).then((data) => {
        setState({
          claimData: { ...state.claimData, [position]: data },
        });
      });

      console.log(receipt);
    });
  };

    const claimZeronium = async (angelId, position) => {
        const options = await getDefaultTransactionOptions();
    api.medal.claimZeronium(angelId, options).on('receipt', function (receipt) {
      getClaimData(angelId, position).then((data) => {
        setState({
          claimData: { ...state.claimData, [position]: data },
        });
      });

      console.log(receipt);
    });
  };

  /*
  const withdrawBalance = async () => {
    const currentAddress = await getCurrentAddress();
    console.log(currentAddress);
    api.battleMountain
      .claimOwnerBalance(currentAddress)
      .on('receipt', function (receipt) {
        console.log(receipt);
      });
  };
  */

  const handleMountainSelect = (id) => {
    console.log('handleMountainSelect: ', id);
    battleMountain.switchBattleMountain(id);
    setState({ searchMtnResult: null });

    // refresh current map view for the newly selected mountain
    if (state.view >= 1 && state.view <= 8) {
      getSpotsData(mapSpots[state.view]);
    }
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.customBattleMtn.getCount().then(setMountainCount);
  }, [api]);

  // Get mountain data
  useEffect(() => {
    if (!mountainCount) {
      return;
    }

    Promise.all(
      [...Array(+mountainCount)].map((_, idx) => {
        return api.customBattleMtn.getBattleMountainByIndex(idx);
      })
    ).then((data) => {
      setMountains(data.filter((mtn) => +mtn.id && mtn.active));
    });
  }, [api, mountainCount]);

  const createTeamRow = (spotData) => {
    return (
      <React.Fragment key={spotData.position}>
        <tr>
          <td data-label="Rank">{spotData.position}</td>
          <td data-label="Angel">
            <MountainStats Id={spotData.angelId} />
          </td>
          <td data-label="Pet">
            <MountainStats Id={spotData.petId} />
          </td>
          <td data-label="Accessory">
            {spotData.accessoryId !== '0' && (
              <MountainStats Id={spotData.accessoryId} />
            )}
          </td>
          {state.ownerTokenIds.length === 0 && (
            <td data-label="Action">loading...</td>
          )}
          <td data-label="Action">
            <button
              className="ui inverted blue button"
              onClick={() =>
                setState({
                  teamInfo:
                    state.teamInfo !== spotData.position
                      ? spotData.position // expand
                      : 0, //collapse
                })
              }
            >
              <i className="info circle icon"></i>
            </button>
            {state.ownerTokenIds.includes(spotData.angelId) && (
              <>
                {ValidPaths[spotData.position].map((path) => (
                  <AttackButton
                    key={`${spotData.position}${spotData.position}${path}`}
                    startVSBattle={startVSBattle}
                    from={spotData.position}
                    to={path}
                    angel={spotData.angelId}
                    pet={spotData.petId}
                    accessory={spotData.accessoryId}
                  />
                ))}

                {/* show medal claiming buttons here */}
                {state.claimData[spotData.position]?.map((button) =>
                  getClaimButton(button)
                )}
              </>
            )}
          </td>
        </tr>
        {+state.teamInfo === +spotData.position && (
          <tr>
            <td colSpan="5">
              <TeamInfo
                position={state.teamInfo}
                owned={state.ownerTokenIds.includes(spotData.angelId)}
              />
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const getSpotsData = async (spotsPosition) => {
    //Read the current teams in the section and update state.
    const getTeamByPositionPromise = spotsPosition
      .sort((a, b) => a - b)
      .map((spot) =>
        api.battleMountain.getTeamByPosition(spot).then((result) => result)
      );

    const spotsData = await Promise.all(getTeamByPositionPromise)
      .then((spotsData) => {
        setState({ spotsData });
        return spotsData;
      })
      .catch(() => {
        console.log('error getting teams by positions');
        return [];
      });

    // Display claim data
    const getClaimDataPromise = spotsData.map((spot) =>
      getClaimData(spot.angelId, spot.position)
    );
    Promise.all(getClaimDataPromise)
      .then((result) => {
        const claimData = {};

        result.forEach((data, idx) => {
          claimData[spotsData[idx].position] = data;
        });

        setState({ claimData });
      })
      .catch(() => {
        console.log('error claim buttons');
        return [];
      });
  };

  const onChangeConditions = () => {
    getCurrentConditions();
  };

  const startVSBattle = (spotContested, angelId, petId, accessoryId) => {
    console.log('starting vs battle');
    setState({
      spotContested: spotContested,
      angel: angelId,
      pet: petId,
      accessory: accessoryId,
      fighting: 'fighting',
    });
  };

  const onBattleEnd = (spotContested, result) => {
    refreshAllTokens();
    if (result === '101') {
      setState({ fighting: 'won', spotContested: spotContested });
    }
    if (result === '102') {
      setState({ fighting: 'lost', spotContested: spotContested });
    }
  };

  const updateMap = (newMap) => {
    if (newMap < 0 || newMap > 9) {
      console.log('error in case statement');
      setState({ view: [] });
      return;
    }

    if (newMap === 0) {
      setState({ view: 'overview' });
      return;
    }
    if (newMap === 9) {
      setState({ view: 'legacy' });
      return;
    }

    setState({ view: newMap });
    getSpotsData(mapSpots[newMap]);
  };

  const getMountain = () => {
    if (!api) {
      return;
    }

    api.customBattleMtn
      .getBattleMountainByIndex(state.searchMtnId)
      .then((data) => {
        setState({ searchMtnResult: { ...data, status: 'found' } });
      })
      .catch(() => {
        setState({ searchMtnResult: { status: 'notfound' } });
      });
  };

  if (!api || !cards) {
    return <LoadingSpinner />;
    }

  return (
    <div>
      {state.fighting !== 'fighting' ? (
        <HeaderSection title={`${battleMountain.data.title} - Leaderboard`} />
      ) : (
        <HeaderSection
          title="Battle Arena"
          subtitle={`${battleMountain.data.title} - Leaderboard`}
        />
      )}
      <p>{battleMountain.data.description}</p>

      <CardWarning cards={cards} />

      {state.fighting === 'loading' && <LoadingSpinner />}

      {state.fighting === 'selecting' &&
        (isTransactionPending('getAllTokens') ? (
          <LoadingSpinner />
        ) : (
          <LeaderBoardTeamSelector
            attackGate={state.attackGate}
            onVSFight={startVSBattle}
            cards={cards}
            cardOnMountainStatuses={cardOnMountainStatuses}
            mountainConditions={state.mountainConditions}
            onSetFighting={(status) => setState({ fighting: status })}
            cardStatuses={cardStatuses}
          />
        ))}

      {state.fighting === 'waiting_for_opponent' && (
        <div>
          <LoadingSpinner />
        </div>
      )}

      {state.fighting === 'fighting' && (
        <VSBattleArenaView
          angel={state.angel}
          pet={state.pet}
          accessory={state.accessory}
          spotContested={state.spotContested}
          onBattleEnd={onBattleEnd}
          battleMtnData={battleMountain.data}
        />
      )}
      {(state.fighting === 'won' || state.fighting === 'lost') && (
        <BattleMtnResults
          status={state.fighting}
          spotContested={state.spotContested}
        />
      )}

      {state.fighting === 'none' && (
        <>
          <div className="ui raised segment">
            <div className="ui compact menu">
              <div className="ui simple dropdown item">
                Official Mountains
                <i className="dropdown icon"></i>
                <div className="menu">
                  <div className="item" onClick={() => handleMountainSelect(0)}>
                    Mt. Zion
                  </div>
                  {mountains.map((mountain) => (
                    <div
                      className="item"
                      key={mountain.id}
                      onClick={() => handleMountainSelect(mountain.id)}
                    >
                      {mountain.title} (#{mountain.id})
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/*  <div>
                        
              <b>Last Payout (overall) info: </b>
            </div>
            <div>
              <b> Panel</b> : {mountainPayoutInfo.lastPayoutPanel}{' '}
            </div>{' '}
            <div>
              <b> Value :</b> {mountainPayoutInfo.lastPayoutValue} Matic Wei{' '}
            </div>{' '}
            <div>
              <b> Time :</b> {mountainPayoutInfo.lastPayoutTime}{' '}
            </div>{' '}
            <hr></hr>
            <div>
              <b> Mountain Balance:</b> {mountainPayoutInfo.balance} Matic Wei
            </div>{' '}
            <div>
              <b> My owed balance: </b> {ownerBalance} Matic Wei{' '}
            </div>
            {ownerBalance > 0 && (
              <button className="ui primary button" onClick={withdrawBalance}>
                Withdraw{' '}
              </button>
                      )}
                      */}
            <div>
              <b> Mountain Balance: </b> {vSHaloBalance.toFixed(2)} Halo
            </div>{' '}
            <div>
              {' '}
              <b>Aproximate Win Rewards: </b> {(vSHaloBalance / 100).toFixed(4)}{' '}
              Halo{' '}
            </div>
            <hr />
            <p>Find a custom mountain by mountain id</p>
            <div className="ui action input">
              <input
                type="text"
                value={state.searchMtnId}
                width="3"
                maxLength="3"
                onChange={(e) => setState({ searchMtnId: e.target.value })}
              />
              <button className="ui button" onClick={getMountain}>
                Search
              </button>
            </div>
            <p>
              {state.searchMtnResult &&
                (state.searchMtnResult.status === 'found' ? (
                  <>
                    <b>Mountain Name: </b> {state.searchMtnResult.title}
                    <br />
                    <b> Description: </b> {state.searchMtnResult.description}
                    <br />
                    <div>
                      <div class="ui horizontal divider">Warning</div>
                      <p>
                        {' '}
                        Custom mountains deployed with our tool all have the
                        same code. However, it is possible for an attacker to
                        create a custom mountain that looks like a real mountain
                        but executes malicious code underneath.{' '}
                      </p>

                      <p>
                        {' '}
                        To be safe, interact only with official mountains, those
                        mountains deployed by poeple you trust, or verify the vs
                        battle and battle mountain code on polygonscan.{' '}
                      </p>

                      <p>
                        {' '}
                        <b> VS Battle Address: </b>
                        {state.searchMtnResult.vsBattleAddress}{' '}
                      </p>
                      <p>
                        {' '}
                        <b> Battle Mtn Address: </b>
                        {state.searchMtnResult.battleMtnAddress}{' '}
                      </p>
                    </div>
                    <div style={{ marginTop: '1em' }}>
                      <button
                        className="ui green button"
                        onClick={() =>
                          handleMountainSelect(state.searchMtnResult.id)
                        }
                      >
                        Play On Mountain
                      </button>
                    </div>
                  </>
                ) : (
                  <h4 className="ui red inverted header">mountain not found</h4>
                ))}
            </p>
          </div>

          <div className="ui raised segment">
            <p>
              {' '}
              Leaderboards are complex environments where players can put their
              skills and cards to the ultimate test!
            </p>
            <p>
              There are five incentivized leaderboards, which you can access
              through the 'My Battle Mountains' section. You can also create
              your own custom mountains and restrict which cards and players can
              use them.
            </p>
            <p>
              Read the{' '}
              <a href="https://mirror.xyz/angelbattles.eth/YIAkHqdjhG2XXijS638scgaZWPLv8qOjibt0hmjji6Q">
                detailed instructions (updated!){' '}
              </a>
              or get started!
            </p>
            <label>
              {' '}
              Choose a Mountain Section:{' '}
              <select
                className="ui selection dropdown"
                onChange={(e) => updateMap(parseInt(e.target.value, 10))}
              >
                <option value={0} key={0}>
                  {' '}
                  Overview{' '}
                </option>
                <option value={1} key={1}>
                  1 - Ultimate Summit{' '}
                </option>
                <option value={2} key={2}>
                  2 - Beta Peak{' '}
                </option>
                <option value={3} key={3}>
                  3 - Forest Peak{' '}
                </option>
                <option value={4} key={4}>
                  4 - Ice Peak{' '}
                </option>
                <option value={5} key={5}>
                  5 - Lava Lake{' '}
                </option>
                <option value={6} key={6}>
                  6 - Entrance 1{' '}
                </option>
                <option value={7} key={7}>
                  7 - Entrance 2{' '}
                </option>
                <option value={8} key={8}>
                  8 - Sunny Meadows{' '}
                </option>
                <option value={9} key={9}>
                  Legacy Leaderboard{' '}
                </option>
              </select>
            </label>

            <label>
              {' '}
              or Enter Mountain:{' '}
              <select
                className="ui selection dropdown"
                onChange={(e) =>
                  e.target.value
                    ? setState({
                        fighting: 'selecting',
                        attackGate: parseInt(e.target.value, 10),
                      })
                    : setState({ fighting: 'loading' })
                }
              >
                <option value={0} key={0}>
                  {' '}
                  Choose Gate to Attack
                </option>
                <option value={53} key={53}>
                  Section 6 - Gate 53{' '}
                </option>
                <option value={54} key={54}>
                  Section 6 - Gate 54{' '}
                </option>
                <option value={55} key={55}>
                  Section 6 - Gate 55{' '}
                </option>
                <option value={56} key={56}>
                  Section 6 - Gate 56{' '}
                </option>
                <option value={50} key={50}>
                  Section 7 - Gate 50{' '}
                </option>
                <option value={51} key={51}>
                  Section 7 - Gate 51{' '}
                </option>
                <option value={52} key={52}>
                  Section 7 - Gate 52{' '}
                </option>
                <option value={63} key={63}>
                  Section 8 - Gate 63{' '}
                </option>
                <option value={64} key={64}>
                  Section 8 - Gate 64{' '}
                </option>
              </select>
            </label>
            <table className="ui celled unstackable table">
              <thead>
                <tr>
                  <th>Last Change</th>
                  <th>Next Change</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Last Change">
                    {getHumanReadableDate(
                      state.mountainConditions?.lastConditionChangeTime
                    )}
                  </td>
                  <td data-label="Next Change">
                    {getNextConditionChangeDate(
                      state.mountainConditions?.lastConditionChangeTime
                    )}{' '}
                  </td>
                  <td data-label="Action">
                                      {new Date() > new Date(getNextConditionChangeDate(
                                          state.mountainConditions?.lastConditionChangeTime
                                      )) ? <span> <ChangeConditionsButton
                                          onChangeConditions={onChangeConditions}
                                          nextChangeAllowed={true}
                                      /> After commiting, wait a few mins and refresh before revealing</span>: <span>Not Yet Available </span>}
                  </td>
                </tr>
              </tbody>
            </table>
            <MountainConditions {...state.mountainConditions} />
          </div>
        </>
      )}
      <div style={{ paddingTop: '2em' }}>
              {state.view === 'overview' && (
                  <div style={{'display': 'flex', 'justifyContent': 'space-around' }}>
          <img
            className="ui large fluid image"
            src={`images/mountain/mountainOverview.jpg`}
            alt="Mountain Overview"
                  />
                      <img
            className="ui large fluid image"
            src={`images/mountain/mountainDetails.jpg`}
            alt="Mountain Details"
                      />
                      </div>
        )}
        {state.view === 1 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/1.jpg`}
            alt="Mountain1"
          />
        )}
        {state.view === 2 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/2.jpg`}
            alt="Mountain2"
          />
        )}
        {state.view === 3 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/3.jpg`}
            alt="Mountain3"
          />
        )}
        {state.view === 4 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/4.jpg`}
            alt="Mountain4"
          />
        )}
        {state.view === 5 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/5.jpg`}
            alt="Mountain5"
          />
        )}
        {state.view === 6 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/6.jpg`}
            alt="Mountain6"
          />
        )}
        {state.view === 7 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/7.jpg`}
            alt="Mountain7"
          />
        )}
        {state.view === 8 && (
          <img
            className="ui centered large fluid image"
            src={`images/mountain/8.jpg`}
            alt="Mountain8"
          />
        )}
      </div>

      {state.view !== 'overview' &&
        state.fighting === 'none' &&
        state.view !== 'legacy' && (
          <table className="ui celled unstackable table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Angel</th>
                <th>Pet</th>
                <th>Accessory</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.spotsData.map((spotData) => createTeamRow(spotData))}
            </tbody>
          </table>
        )}

      {state.view === 'legacy' && (
        <div className="ui grid">
          <HeaderSection title="Legacy Leaderboard" color="blue" />
          <img
            className="ui centered fluid image"
            src={`images/legacy/leaderboard1.png`}
            alt="Legacy1"
          />
          <img
            className="ui centered fluid image"
            src={`images/legacy/leaderboard2.png`}
            alt="Legacy2"
          />
          <img
            className="ui centered fluid image"
            src={`images/legacy/leaderboard3.png`}
            alt="Legacy3"
          />
          <img
            className="ui centered fluid image"
            src={`images/legacy/leaderboard4.png`}
            alt="Legacy4"
          />
          <img
            className="ui centered fluid image"
            src={`images/legacy/leaderboard5.png`}
            alt="Legacy5"
          />
        </div>
      )}
    </div>
  );
};

export default LeaderboardView;
