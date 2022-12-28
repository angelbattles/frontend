import React, { useCallback, useContext, useEffect, useReducer } from 'react';
import {
  getCardDataContract,
  getSkaleBattleMtnContract,
} from './web3/SolidityContracts.js';
import ConnectionContext from './contexts/ConnectionContext';
import AppContext from './contexts/AppContext';
import { getDefaultTransactionOptions } from './web3/Utilities';

const reducer = (prevState, newStates) => ({ ...prevState, ...newStates });

const initialState = {
  loading: true,
  action1: 'Round 1',
  action2: 'Round 2',
  action3: 'Round 3',
  action4: 'Round 4',
  action5: 'Round 5',
  action6: 'Round 6',
  petSpot: '0',
  currentAddress: null,
};

const TeamInfo = ({ position, owned }) => {
  const [state, setState] = useReducer(reducer, initialState);
  const { api, connection } = useContext(AppContext);

  const refreshTeamInfo = useCallback(() => {
    let battle_mountain_contract = getSkaleBattleMtnContract();
    battle_mountain_contract.methods
      .getTeamByPosition(position)
      .call()
      .then((result) => {
        setState({ result });
        let skale_carddata_contract = getCardDataContract();
        skale_carddata_contract.methods
          .ownerOf(result.angelId)
          .call()
          .then((result) => {
            setState({ owner: result, loading: false });
          });
      });
  }, [position]);

  useEffect(() => {
    if (!api) {
      return;
    }
    setState({ position, currentAddress: connection.currentAddress });
    refreshTeamInfo();
  }, [api, connection, position, refreshTeamInfo]);

  const handleChange = (event) => {
    setState({ value: event.target.value });
  };

  const updateActions = async (event) => {
    event.preventDefault();
    let battle_mountain_contract = getSkaleBattleMtnContract();
    let action1Int = 0;
    if (state.action1 === 'Attack') {
      action1Int = 1;
    } else if (state.action1 === 'Defend') {
      action1Int = 2;
    } else if (state.action1 === 'Release Aura') {
      action1Int = 3;
    } else if (state.action1 === 'Summon Pet') {
      action1Int = 4;
    }

    let action2Int = 0;
    if (state.action2 === 'Attack') {
      action2Int = 1;
    } else if (state.action2 === 'Defend') {
      action2Int = 2;
    } else if (state.action2 === 'Release Aura') {
      action2Int = 3;
    } else if (state.action2 === 'Summon Pet') {
      action2Int = 4;
    }

    let action3Int = 0;
    if (state.action3 === 'Attack') {
      action3Int = 1;
    } else if (state.action3 === 'Defend') {
      action3Int = 2;
    } else if (state.action3 === 'Release Aura') {
      action3Int = 3;
    } else if (state.action3 === 'Summon Pet') {
      action3Int = 4;
    }

    let action4Int = 0;
    if (state.action4 === 'Attack') {
      action4Int = 1;
    } else if (state.action4 === 'Defend') {
      action4Int = 2;
    } else if (state.action4 === 'Release Aura') {
      action4Int = 3;
    } else if (state.action4 === 'Summon Pet') {
      action4Int = 4;
    }

    let action5Int = 0;
    if (state.action5 === 'Attack') {
      action5Int = 1;
    }
    if (state.action5 === 'Defend') {
      action5Int = 2;
    }
    if (state.action5 === 'Release Aura') {
      action5Int = 3;
    }
    if (state.action5 === 'Summon Pet') {
      action5Int = 4;
    }

    let action6Int = 0;
    if (state.action6 === 'Attack') {
      action6Int = 1;
    } else if (state.action6 === 'Defend') {
      action6Int = 2;
    } else if (state.action6 === 'Release Aura') {
      action6Int = 3;
    } else if (state.action6 === 'Summon Pet') {
      action6Int = 4;
    }
      const options = await getDefaultTransactionOptions();
      options.from = state.currentAddress
    battle_mountain_contract.methods
      .setActions(
        state.position,
        action1Int,
        action2Int,
        action3Int,
        action4Int,
        action5Int,
        action6Int
      )
      .send(options)
      .then(function (result) {});
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      const options = await getDefaultTransactionOptions();
      options.from = state.currentAddress
    let battle_mountain_contract = getSkaleBattleMtnContract();
    battle_mountain_contract.methods
      .setSlogan(state.position, state.value)
      .send(options)
      .then(() => refreshTeamInfo());
  };

  if (state.loading === true) {
    return <div>loading...</div>;
  }

  return (
    <div className="raised ui segment">
      <div> Position: {state.result.position} </div>
      <div> Team Name: {state.result.slogan}</div>
      <div> Angel ID: {state.result.angelId}</div>
      <div> Pet ID: {state.result.petId}</div>
      <div> Accessory ID: {state.result.accessoryId}</div>
      <div> Angel Owner: {state.owner}</div>
      {owned && (
        <div>
          <form onSubmit={handleSubmit}>
            <label>Change Team Name:</label>
            <div className="ui input">
              <input
                type="text"
                placeholder="New Name..."
                value={state.value}
                onChange={handleChange}
              />
            </div>
            <button className="ui button" type="submit">
              Submit
            </button>
          </form>
          Players can set the order of moves that there team will execute when
          attacked. For battles lasting longer than 6 rounds, actions will
          repeat.. If an action is not valid (ie, releasing an already released
          aura,) angel team will attack.
          <table className="ui celled table">
            <thead>
              <tr>
                <th>Choose</th>
                <th>Defender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Choose">
                  <div className="ui compact menu">
                    <div className="ui simple dropdown item">
                      {state.action1}
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        <div
                          className="item"
                          onClick={() => setState({ action1: 'Attack' })}
                        >
                          Attack
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action1: 'Defend' })}
                        >
                          Defend
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action1: 'Release Aura' })}
                        >
                          Release Aura
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action1: 'Summon Pet' })}
                        >
                          Summon Pet
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td data-label="Defender">
                  <div className="ui compact menu">
                    <div className="ui simple dropdown item">
                      {state.action2}
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        <div
                          className="item"
                          onClick={() => setState({ action2: 'Attack' })}
                        >
                          Attack
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action2: 'Defend' })}
                        >
                          Defend
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action2: 'Release Aura' })}
                        >
                          Release Aura
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action2: 'Summon Pet' })}
                        >
                          Summon Pet
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td data-label="Actions">
                  <div className="ui compact menu">
                    <div className="ui simple dropdown item">
                      {state.action3}
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        <div
                          className="item"
                          onClick={() => setState({ action3: 'Attack' })}
                        >
                          Attack
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action3: 'Defend' })}
                        >
                          Defend
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action3: 'Release Aura' })}
                        >
                          Release Aura
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action3: 'Summon Pet' })}
                        >
                          Summon Pet
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td data-label="Choose">
                  <div className="ui compact menu">
                    <div className="ui simple dropdown item">
                      {state.action4}
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        <div
                          className="item"
                          onClick={() => setState({ action4: 'Attack' })}
                        >
                          Attack
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action4: 'Defend' })}
                        >
                          Defend
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action4: 'Release Aura' })}
                        >
                          Release Aura
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action4: 'Summon Pet' })}
                        >
                          Summon Pet
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td data-label="Defender">
                  <div className="ui compact menu">
                    <div className="ui simple dropdown item">
                      {state.action5}
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        <div
                          className="item"
                          onClick={() => setState({ action5: 'Attack' })}
                        >
                          Attack
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action5: 'Defend' })}
                        >
                          Defend
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action5: 'Release Aura' })}
                        >
                          Release Aura
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action5: 'Summon Pet' })}
                        >
                          Summon Pet
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td data-label="Actions">
                  <div className="ui compact menu">
                    <div className="ui simple dropdown item">
                      {state.action6}
                      <i className="dropdown icon"></i>
                      <div className="menu">
                        <div
                          className="item"
                          onClick={() => setState({ action6: 'Attack' })}
                        >
                          Attack
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action6: 'Defend' })}
                        >
                          Defend
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action6: 'Release Aura' })}
                        >
                          Release Aura
                        </div>
                        <div
                          className="item"
                          onClick={() => setState({ action6: 'Summon Pet' })}
                        >
                          Summon Pet
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <button className="ui red inverted button" onClick={updateActions}>
            Update Actions
          </button>
        </div>
      )}
    </div>
  );
};

TeamInfo.contextType = ConnectionContext;
export default TeamInfo;
