import React, { useContext, useEffect, useState } from 'react';
import AppContext from './contexts/AppContext';
import ABCardInfo from '../config/abcardinfo';
import Stats from './Stats';
import HeaderSection from './HeaderSection';
import LoadingSpinner from './LoadingSpinner';
import CardWarning from './web3/CardWarning';
import { getDefaultTransactionOptions } from './web3/Utilities';



const BattleSelector = ({ cards, onBattleStart, setInBattle, attackGate }) => {
  const [arena, setArena] = useState(null);
  const [arenaName, setArenaName] = useState('Choose your arena');
  const [angels, setAngels] = useState(null);
  const [pets, setPets] = useState(null);
  const [accessories, setAccessories] = useState(null);
  const [selectedAngel, setSelectedAngel] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [hasAccessory, setHasAccessory] = useState(false);
  const { api, getMinedTransactionReceipt } = useContext(AppContext);

  useEffect(() => {
    if (!api || !cards) {
      return;
    }

    const currAngels = [];
    const currPets = [];
    const currAccessories = [];

    //Filter the tokens by type.
    for (var i = 0; i < cards.ownerTokens.length; i++) {
      if (cards.ownerTokens[i].cardSeriesId <= 23) {
        currAngels.push({
          token: cards.ownerTokens[i],
          id: cards.ownerTokenIds[i],
        });
      }
      if (
        cards.ownerTokens[i].cardSeriesId >= 24 &&
        cards.ownerTokens[i].cardSeriesId <= 42
      ) {
        currPets.push({
          token: cards.ownerTokens[i],
          id: cards.ownerTokenIds[i],
        });
      }
      if (
        cards.ownerTokens[i].cardSeriesId >= 43 &&
        cards.ownerTokens[i].cardSeriesId <= 60
      ) {
        currAccessories.push({
          token: cards.ownerTokens[i],
          id: cards.ownerTokenIds[i],
        });
      }
    }

    setAngels(currAngels);
    setPets(currPets);
    setAccessories(currAccessories);
  }, [api, cards]);

  const onTokenSelect = (token, remove, type) => {
    //Remove the token from its list and add it to selected list.
    //If determine which way to move the token depending on which array was selected.
    if (type === 'angel') {
      if (remove === false) {
        if (selectedAngel) {
          return;
        }
        setSelectedAngel(angels[token]);
        angels.splice(token, 1);
        setAngels(angels);
      }

      if (remove === true) {
        angels.unshift(selectedAngel);
        setSelectedAngel(null);
      }
    }

    if (type === 'pet') {
      if (remove === false) {
        if (selectedPet) {
          return;
        }
        setSelectedPet(pets[token]);
        pets.splice(token, 1);
        setPets(pets);
      }

      if (remove === true) {
        pets.unshift(selectedPet);
        setSelectedPet(null);
      }
    }

    if (type === 'accessory') {
      // TODO: allow more than one accessory?
      if (remove === false) {
        if (selectedAccessory) {
          return;
        }
        setSelectedAccessory(accessories[token]);
        accessories.splice(token, 1);
        setHasAccessory(true);
        setAccessories(accessories);
      }

      if (remove === true) {
        accessories.unshift(selectedAccessory);
        setSelectedAccessory(null);
        setHasAccessory(false);
      }
    }
  };

  const onTeamSelect = async () => {
    //you don't need an accessory to battle
    const accessoryId = hasAccessory ? selectedAccessory.id : 0;
    var accessoryType = hasAccessory
      ? ABCardInfo.cards[selectedAccessory.token.cardSeriesId].name
      : 0;

      try {
           await api.battle.checkBattleParameters(selectedAngel.id, selectedPet.id, accessoryId)
      }
      catch (error) {
          console.log(error)
          alert('Your team failed the checkBattleParameters function and this tx will likely fail. This could happen if one of your cards is on cooldown or no longer yours. See the console for details')
          return;
      }
    
    console.log(
      'startBattle: ',
      selectedAngel.id,
      selectedPet.id,
      selectedAccessory?.id,
      arena,
      attackGate
    );

    const options = await getDefaultTransactionOptions();

    // Start Battle Arena
    setInBattle('waiting_for_opponent');
    api.battle
      .startBattle(
        selectedAngel.id,
        selectedPet.id,
        accessoryId,
        arena,
        options
      )
      .finally(() => {
        getMinedTransactionReceipt('start_battle')
          .then(() => {
            onBattleStart(
              ABCardInfo.cards[selectedAngel.token.cardSeriesId].name,
              ABCardInfo.cards[selectedPet.token.cardSeriesId].name,
              accessoryType,
              selectedPet.id,
              selectedAccessory?.id
            );
          })
          .catch(() => {
            setInBattle('selecting');
          });
      });
  };

  const getSelectedTeamRows = () => {
    const rows = [];
    const selectedCards = [
      { type: 'angel', card: selectedAngel },
      { type: 'pet', card: selectedPet },
      { type: 'accessory', card: selectedAccessory },
    ];

    selectedCards.forEach((selectedCard) => {
      if (selectedCard.card) {
        rows.push(
          <tr key={selectedCard.type}>
            <td data-label="ID">{selectedCard.card.id}</td>
            <td data-label="Type">
              {
                ABCardInfo.cards[
                  parseInt(selectedCard.card.token.cardSeriesId, 10)
                ].name
              }
            </td>
            <td data-label="Stats">
              <Stats
                seriesId={selectedCard.card.token.cardSeriesId}
                power={selectedCard.card.token.power}
                experience={selectedCard.card.token.experience}
                red={selectedCard.card.token.auraRed}
                blue={selectedCard.card.token.auraBlue}
                yellow={selectedCard.card.token.auraYellow}
              />
            </td>
            <td data-label="Action">
              <button
                className="ui red button"
                onClick={() =>
                  onTokenSelect(selectedCard.type, true, selectedCard.type)
                }
              >
                Remove
              </button>
            </td>
          </tr>
        );
      }
    });

    return rows;
  };

  const getCardRows = (cardNames, cards) => {
    const getCardType = (card) => {
      if (card.cardSeriesId < 24) {
        return 'angel';
      } else if (card.cardSeriesId < 43) {
        return 'pet';
      } else if (card.cardSeriesId < 61) {
        return 'accessory';
      } else {
        return 'medal';
      }
    };

    const displayAction = (card, index) => {
      const token = card.token;
      let battleCooldown = token.battleCooldown ? +token.battleCooldown : 0;
      const cardType = getCardType(token);
      if ((cardType === 'angel' || cardType === 'pet') && battleCooldown) {
        const nextBattleTime =
          parseInt(token.lastBattleTime, 10) + battleCooldown;
        const currentTime = Math.round(new Date().getTime() / 1000);

        const remainingCooldownTime = nextBattleTime - currentTime;
        let cooldownDelayHours = Math.floor(remainingCooldownTime / 3600);
        let cooldownDelaysMinutes = Math.ceil(
          (remainingCooldownTime % 3600) / 60
        );

        // Adjust hours and minutes if minutes equal 60
        if (cooldownDelaysMinutes === 60) {
          cooldownDelaysMinutes = 0;
          cooldownDelayHours++;
        }

        battleCooldown =
          nextBattleTime < currentTime
            ? 0
            : `${cooldownDelayHours} h ${cooldownDelaysMinutes} m`;
      }

      const displayComponent = battleCooldown ? (
        <span>{battleCooldown}</span>
      ) : (
        <button
          className="ui green button"
          onClick={() => onTokenSelect(index, false, cardNames)}
        >
          Select
        </button>
      );

      return displayComponent;
    };

    return cards.map((card, i) => (
      <tr key={card.id}>
        <td data-label="ID">{card.id}</td>
        <td data-label="Type">
          {ABCardInfo.cards[parseInt(card.token.cardSeriesId, 10)].name}
        </td>
        <td data-label="Stats">
          <Stats
            power={card.token.power}
            experience={card.token.experience}
            red={card.token.auraRed}
            blue={card.token.auraBlue}
            yellow={card.token.auraYellow}
            seriesId={card.token.cardSeriesId}
          />
        </td>
        <td data-label="Action">{displayAction(card, i)}</td>
      </tr>
    ));
  };

  return (
    <div>
      <div className="ui divider"></div>
      <div className="ui raised pink segment">
        <h1 align="center"> Battle Arena! </h1>
              <p>Select one angel, pet, and accessory (optional) for battle!</p>
              <p>If you have turned on caching in the Account settings page, be aware
                  that some of your cards may be on cooldown but may not show it here.
                  You can hit the refresh cards icon in the header
                  to sync all of their last battle times with the blockchain.
              </p>
      </div>
      <CardWarning cards={cards} />
      <HeaderSection title="Selected Team" />
      <table className="ui celled table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Stats</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{getSelectedTeamRows()}</tbody>
      </table>
      {(!selectedAngel || !selectedPet || arena === null) && (
        <button className="ui grey button">
          {!selectedAngel || !selectedPet
            ? 'Choose your team..'
            : 'Choose your arena ->'}
        </button>
      )}
      {selectedAngel && selectedPet && arena !== null && (
        <button className="ui orange button" onClick={() => onTeamSelect()}>
          Time to Fight!
        </button>
      )}
      <div className="ui compact menu">
        <div className="ui simple dropdown item">
          {arenaName}
          <i className="dropdown icon"></i>
          <div className="menu">
            <div
              className="item"
              onClick={() => {
                setArena(0);
                setArenaName('Cornu');
              }}
            >
              Cornu (easy)
            </div>
            <div
              className="item"
              onClick={() => {
                setArena(1);
                setArenaName('Wimpy Cirrus Meadows');
              }}
            >
              Wimpy Cirrus Meadows
            </div>
            <div
              className="item"
              onClick={() => {
                setArena(2);
                setArenaName('Menacing Nimbus Forest');
              }}
            >
              Menacing Nimbus Forest
            </div>
            <div
              className="item"
              onClick={() => {
                setArena(3);
                setArenaName('Thuuuuunderdome');
              }}
            >
              Thuuuuuunderdome
            </div>
          </div>
        </div>
      </div>

      <HeaderSection title="Tokens" />
      {!angels && <LoadingSpinner />}
      {angels && !selectedAngel && (
        <table className="ui celled unstackable table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Stats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{getCardRows('angel', angels)}</tbody>
        </table>
      )}
      {pets && !selectedPet && (
        <table className="ui celled unstackable table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Stats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{getCardRows('pet', pets)}</tbody>
        </table>
      )}
      {accessories && !selectedAccessory && (
        <table className="ui celled unstackable table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Stats</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{getCardRows('accessory', accessories)}</tbody>
        </table>
      )}
    </div>
  );
};

export default BattleSelector;
