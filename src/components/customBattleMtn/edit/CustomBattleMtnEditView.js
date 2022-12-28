import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import LoadingButton from '../../LoadingButton';
import LoadingSpinner from '../../LoadingSpinner';
import AppContext from '../../contexts/AppContext';
import CustomCardToggle from '../CustomCardToggle';
import { getDefaultTransactionOptions } from '../../web3/Utilities';

const reducer = (prevState, newStates) => ({ ...prevState, ...newStates });
const cardStatusesReducer = (cardStatuses, payload) => {
  switch (payload.action) {
    case 'updateAll':
      return payload.data;
    case 'updateSingle':
      const cardSeriesId = payload.data.cardSeriesId;

      // payload.data.status == true means it's prohibited
      const newStatus = payload.data.status ? 'prohibited' : 'allowed';

      // Add card to new status ('allowed' or 'prohibited')
      if (!cardStatuses[newStatus].includes(cardSeriesId)) {
        cardStatuses[newStatus].push(cardSeriesId);
        cardStatuses[newStatus].sort((a, b) => a - b);
      }

      // Remove card from old status
      const oldStatus = newStatus === 'allowed' ? 'prohibited' : 'allowed';
      cardStatuses[oldStatus] = cardStatuses[oldStatus].filter(
        (oldId) => cardSeriesId !== oldId
      );

      return { ...cardStatuses };
    default:
      return cardStatuses;
  }
};

const CustomBattleMtnEditView = ({
  mountains,
  mountainCount,
  selectedMountain,
  setSelectedMountain,
  startNewMountain,
  setCustomBattleMtnState,
}) => {
  const {
    api,
    isTransactionPending,
    battleMountain,
    getMinedTransactionReceipt,
  } = useContext(AppContext);
  const [state, setState] = useReducer(reducer, {
    playerAllowedAddress: '',
    selectedCardSeriesId: null,
    selectedCardStatus: true,
    isMountainDataLoading: false,
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cardStatuses, setCardStatuses] = useReducer(cardStatusesReducer, null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomBattleMtnState({ [name]: value });
  };

  const handleMountainSelect = (e) => {
    const mtnId = +e.target.value;
    if (mtnId) {
      setSelectedMountain(mountains.find((mtn) => +mtn.id === mtnId));
    }
  };

    const updateInfo = async () => {
        const options = await getDefaultTransactionOptions();
    api.customBattleMtn.updateBattleMtnInfo(
      selectedMountain.id,
      title,
        description,
      options
    );
  };

  /*
   * Validate title
   */
  const isValidTitle = () => {
    return !title.trim() || !description.trim();
  };

  /*
   * Get all card statuses
   */
  const refreshCardStatuses = useCallback(() => {
    if (!api) {
      return;
    }

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

    setState({ isMountainDataLoading: true });
    getCardStatuses().then((statuses) => {
      statuses.forEach((status, idx) => {
        currCardStatues[status ? 'prohibited' : 'allowed'].push(idx);
      });
      setCardStatuses({ action: 'updateAll', data: currCardStatues });
      setState({ isMountainDataLoading: false });
    });
  }, [api]);

  /*
   * Toggle player status
   */
    const togglePlayer = async (address) => {
        const options = await getDefaultTransactionOptions();
    api.battleMountain.setPlayerAllowed(address, options).then(() => {});
  };

  /*
   * Toggle card prohibit status
   */
    const toggleStatus = async (cardSeriesId, status) => {
        const options = await getDefaultTransactionOptions();
    api.battleMountain
      .setCardProhibitedStatus(cardSeriesId, status, options)
      .finally(() => {
        handleMinedCardTransaction(cardSeriesId);
      });
  };

  /*
   * Close toggle modal
   */
  const closeToggleStatus = useCallback(() => {
    setState({ selectedCardSeriesId: null });
  }, []);

  /*
   * Check for card transaction, update single card
   */
  const handleMinedCardTransaction = useCallback(
    (cardSeriesId) => {
      if (!api) {
        return;
      }

      getMinedTransactionReceipt(`setCardProhibitedStatus_${cardSeriesId}`)
        .then(() => {
          api.battleMountain
            .getCardProhibitedStatus(cardSeriesId)
            .then((status) => {
              setCardStatuses({
                action: 'updateSingle',
                data: { cardSeriesId, status },
              });

              if (state.selectedCardSeriesId === cardSeriesId) {
                closeToggleStatus();
              }
            });
        })
        .catch(() => {});
    },
    [
      api,
      getMinedTransactionReceipt,
      state.selectedCardSeriesId,
      closeToggleStatus,
    ]
  );

  // Refresh card statuses when global battle mountain changed
  useEffect(() => {
    if (!battleMountain?.data || battleMountain.data.id.toString() === '0') {
      return;
    }

    refreshCardStatuses();
  }, [refreshCardStatuses, battleMountain]);

  // Update card statuses. Called when cards first set and when cards are prohibited status is toggled.
  useEffect(() => {
    if (!cardStatuses || !selectedMountain) {
      return;
    }

    [...Array(60)].forEach((_, cardSeriesId) => {
      handleMinedCardTransaction(cardSeriesId);
    });
  }, [cardStatuses, handleMinedCardTransaction, selectedMountain]);

  // Switch the BattleMtn globally, app-wide, when selected mountain changed
  useEffect(() => {
    // Do not do a global switch of mountain of none selected or it's already selected
    if (!selectedMountain || +battleMountain.data.id === +selectedMountain.id) {
      return;
    }

    battleMountain.switchBattleMountain(selectedMountain.id);
    setTitle(selectedMountain.title.trim());
    setDescription(selectedMountain.description.trim());
  }, [selectedMountain, battleMountain]);

  return selectedMountain && mountainCount ? (
    <>
      <div className="ui raised segment">
        <div className="ui form">
          <div className="field">
            <label>Select a battle mountain</label>
            <select
              onChange={handleMountainSelect}
              value={+selectedMountain.id}
              placeholder={'select a mountain'}
              className="custom-mtn-mountains"
            >
              {mountains.map((mountain) => (
                <option key={mountain.id} value={mountain.id}>
                  {mountain.title} #{mountain.id} (active -
                  {mountain.active ? 'true' : 'false'})
                </option>
              ))}
            </select>
          </div>

          <h5> Create a new battle mountain</h5>
          <button
            className="ui positive button"
            onClick={() => startNewMountain()}
          >
            Get Started
          </button>
        </div>
      </div>
      {!state.isMountainDataLoading && cardStatuses ? (
        <>
          <div className="ui raised segment">
            <>
              <h2>{selectedMountain.title}</h2>
              <p>
                <strong>Battle Mountain Address:</strong>{' '}
                {selectedMountain.battleMtnAddress}
              </p>
              <p>
                <strong>VS Battle Address:</strong>{' '}
                {selectedMountain.vsBattleAddress}
              </p>
              {/*<p>*/}
              {/*  <button onClick={() => changeMountain(selectedMountain.id)}>*/}
              {/*    Play on {selectedMountain.title} - {selectedMountain.id}*/}
              {/*  </button>*/}
              {/*</p>*/}
              <div className="ui form">
                <div className="two fields">
                  <div className="field">
                    <label className="custom-mtn-input-label">Title</label>
                    <input
                      type="text"
                      placeholder="title"
                      onChange={(e) => setTitle(e.target.value.trim())}
                      value={title}
                    />
                  </div>
                  <div className="field">
                    <label className="custom-mtn-input-label">
                      Description
                    </label>
                    <input
                      type={'text'}
                      placeholder="description"
                      onChange={(e) => setDescription(e.target.value.trim())}
                      value={description}
                    />
                  </div>
                </div>
                <LoadingButton
                  color={isValidTitle() ? 'disabled' : 'positive'}
                  isLoading={isTransactionPending('updateBattleMtnInfo')}
                  onClick={updateInfo}
                >
                  Submit
                </LoadingButton>
              </div>
            </>
          </div>
          <div className="ui raised segment mini images">
            <div
              style={{
                color: 'green',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Allowed
            </div>
            {cardStatuses.allowed.map((cardSeriesId) => (
              <img
                key={battleMountain.data.id + cardSeriesId}
                src={`images/${cardSeriesId}.png`}
                alt="card"
                onClick={() =>
                  setState({
                    selectedCardSeriesId: cardSeriesId,
                    selectedCardStatus: false,
                  })
                }
              />
            ))}
            <hr />
            <div
              style={{
                color: 'red',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              Prohibited
            </div>
            {cardStatuses.prohibited.map((cardSeriesId) => (
              <img
                key={battleMountain.data.id + cardSeriesId}
                src={`images/${cardSeriesId}.png`}
                alt="card"
                onClick={() =>
                  setState({
                    selectedCardSeriesId: cardSeriesId,
                    selectedCardStatus: true,
                  })
                }
              />
            ))}
          </div>
          <div className="ui raised segment">
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '16px',
              }}
            >
              <h4>Allow or Deny access to mountain</h4>
              <p>
                <input
                  name="playerAllowedAddress"
                  value={state.playerAllowedAddress}
                  onChange={handleChange}
                />
              </p>
              <button
                className="positive ui button"
                onClick={() => togglePlayer(state.playerAllowedAddress, true)}
              >
                Allow Access To Mountain
              </button>

              <button
                className="negative ui button"
                onClick={() => togglePlayer(state.playerAllowedAddress, false)}
              >
                Deny Access To Mountain
              </button>
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}

      {/*View: Toggle card modal */}
      <CustomCardToggle
        cardSeriesId={state.selectedCardSeriesId}
        status={state.selectedCardStatus}
        toggleStatus={toggleStatus}
        closeToggleStatus={closeToggleStatus}
      />
    </>
  ) : (
    <LoadingSpinner />
  );
};

export default CustomBattleMtnEditView;
