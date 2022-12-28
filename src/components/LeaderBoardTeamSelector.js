import React, { useContext, useState, useEffect } from 'react';
import AppContext from './contexts/AppContext';
import ABCardInfo from '../config/abcardinfo';
import Stats from './Stats';
import HeaderSection from './HeaderSection';
import LoadingSpinner from './LoadingSpinner';
import CardWarning from './web3/CardWarning';
import MountainConditions from './MountainConditions';
import { getDefaultTransactionOptions } from './web3/Utilities';

const mtnCondBonuses = {
  attackerBonus: {
    1: 'attacker',
    2: 'defender',
  },
  auraBonus: {
    1: 'blue',
    2: 'yellow',
    3: 'purple',
    4: 'orange',
    5: 'red',
    6: 'green',
  },
  lightAngelBonus: {
    1: 'light',
    2: 'dark',
  },
  petLevelBonus: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
  },
  petTypeBonus: {
    1: 'reptile',
    2: 'avian',
    3: 'feline',
    4: 'equine',
  },
};

const LeaderBoardTeamSelector = ({
  cards,
  cardOnMountainStatuses,
  attackGate,
  mountainConditions,
  onVSFight: startVSBattle,
  onSetFighting,
  cardStatuses,
}) => {
  const [angels, setAngels] = useState(null);
  const [pets, setPets] = useState(null);
  const [accessories, setAccessories] = useState(null);
  const [selectedAngel, setSelectedAngel] = useState(null);
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [hasAccessory, setHasAccessory] = useState(false);
  const [appliedBonuses, setAppliedBonuses] = useState({});
  const { api } = useContext(AppContext);

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

    //let result = await skale_vs_contract.methods.checkBattleParameters(self.state.selectedTeam[0].id, self.state.selectedTeam[1].id, accessoryId).call();

    console.log(
      'startBattle: ',
      selectedAngel.id,
      selectedPet.id,
      selectedAccessory?.id,
      attackGate
    );

      const options = await getDefaultTransactionOptions();
    // Start Leaderboard
    api.vsBattle
      .attackSpot(
        99,
        attackGate,
        selectedAngel.id,
        selectedPet.id,
        accessoryId,
       options
      )
      .on('transactionHash', () => onSetFighting('waiting_for_opponent'))
      .on('receipt', () => console.log('receipt'))
        .on('confirmation', (confirmationNum) => {
            if (confirmationNum === 5) {
                startVSBattle(attackGate, selectedAngel.id, selectedPet.id, accessoryId)
            }
        }
      )
      .on('error', (error, receipt) => {
        console.log('error');
        console.log(error);
        console.log(receipt);
      });
  };

  // TODO: make this a utility function so that it can be used on MountainConditions
  const getBonus = (cardType, cardInfo) => {
    let bonus = [];

    // Pets
    if (cardType === 'pet') {
      // petTypeBonus && lightAngelBonus
      if (
        cardInfo.type &&
        cardInfo.type ===
          mtnCondBonuses.petTypeBonus[mountainConditions.petTypeBonus]
      ) {
        bonus.push(
          <img
            key={cardInfo.type + mountainConditions.petTypeBonus}
            className="ui fluid mini spaced image"
            src={`images/bonuses/${cardInfo.type}.jpg`}
            alt={`${cardInfo.type} bonus`}
          />
        );
      }

      // petLevelBonus
      if (
        cardInfo.level &&
        cardInfo.level ===
          +mtnCondBonuses.petLevelBonus[mountainConditions.petLevelBonus]
      ) {
        bonus.push(
          <img
            key={cardInfo.level + mountainConditions.petLevelBonus}
            className="ui fluid mini spaced image"
            src={`images/bonuses/l${cardInfo.level}.jpg`}
            alt={`level ${cardInfo.level} bonus`}
          />
        );
      }
    }

    // Angels
    if (cardType === 'angel') {
      // lightAngelBonus
      if (
        cardInfo.type &&
        cardInfo.type ===
          mtnCondBonuses.lightAngelBonus[mountainConditions.lightAngelBonus]
      ) {
        bonus.push(
          <img
            key={cardInfo.type + mountainConditions.lightAngelBonus}
            className="ui fluid mini spaced image"
            src={`images/bonuses/${cardInfo.type}.jpg`}
            alt={`${cardInfo.type} bonus`}
          />
        );
      }

      // attackerBonus
      if (
        mountainConditions.attackerBonus &&
        mtnCondBonuses.attackerBonus[mountainConditions.attackerBonus]
      ) {
        bonus.push(
          <img
            key={mountainConditions.attackerBonus}
            className="ui fluid mini spaced image"
            src={`images/bonuses/${
              mtnCondBonuses.attackerBonus[mountainConditions.attackerBonus]
            }.jpg`}
            alt={`${
              mtnCondBonuses.attackerBonus[mountainConditions.attackerBonus]
            } bonus`}
          />
        );
      }

      // lightAngelBonus
      if (
        cardInfo.aura &&
        cardInfo.aura === mtnCondBonuses.auraBonus[mountainConditions.auraBonus]
      ) {
        bonus.push(
          <img
            key={cardInfo.aura + mountainConditions.auraBonus}
            className="ui fluid mini spaced image"
            src={`images/bonuses/${cardInfo.aura}.jpg`}
            alt={`${cardInfo.aura} bonus`}
          />
        );
      }
    }

    return bonus;
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
        const cardInfo =
          ABCardInfo.cards[parseInt(selectedCard.card.token.cardSeriesId, 10)];

        rows.push(
          <tr key={selectedCard.type}>
            <td data-label="ID">{selectedCard.card.id}</td>
            <td data-label="Type">{cardInfo.name}</td>
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
            <td data-label="Bonus">
              {selectedCard.type !== 'accessory'
                ? getBonus(selectedCard.type, cardInfo).map((bonus) => bonus)
                : cardInfo.description}
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

  const getCardRows = (cardType, cards) => {
    const displayAction = (card, index) => {
      let displayComponent = (
        <button
          className="ui green button"
          onClick={() => onTokenSelect(index, false, cardType)}
        >
          Select
        </button>
      );

      const cardOnBattleMtn = cardOnMountainStatuses[card.token.tokenId];
      if (cardOnBattleMtn === true) {
        displayComponent = <span>On Mountain</span>;
      } else if (cardOnBattleMtn === undefined) {
        displayComponent = <span>Possibly on Mountain</span>;
      } else if (
        cardStatuses.prohibited.includes(parseInt(card.token.cardSeriesId))
      ) {
        displayComponent = <span>Not Playable</span>;
      }

      return displayComponent;
    };

    return cards.map((card, i) => {
      const cardInfo = ABCardInfo.cards[parseInt(card.token.cardSeriesId, 10)];

      return (
        <tr key={i}>
          <td data-label="ID">{card.id}</td>
          <td data-label="Type">{cardInfo.name}</td>
          {cardType !== 'accessory' && (
            <td data-label="Stats">
              <Stats
                seriesId={card.token.cardSeriesId}
                power={card.token.power}
                experience={card.token.experience}
                red={card.token.auraRed}
                blue={card.token.auraBlue}
                yellow={card.token.auraYellow}
              />
            </td>
          )}
          <td data-label="Bonus">
            {cardType !== 'accessory'
              ? getBonus(cardType, cardInfo).map((bonus) => bonus)
              : cardInfo.description}
          </td>
          <td className="right aligned collapsing" data-label="Action">
            {displayAction(card, i)}
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    if (!selectedAngel || !selectedPet || !attackGate) {
      setAppliedBonuses({});
      return;
    }

    console.log(
      'bonus for: ',
      selectedAngel.id,
      selectedPet.id,
      hasAccessory ? selectedAccessory.id : 0
    );

    api.battleMountain
      .applyConditions(
        selectedAngel.id,
        selectedPet.id,
        hasAccessory ? selectedAccessory.id : 0,
        true,
        attackGate
      )
      .then((data) => {
        setAppliedBonuses(data);
      });
  }, [
    selectedAngel,
    selectedPet,
    selectedAccessory,
    hasAccessory,
    api.battleMountain,
    attackGate,
  ]);

  const displayConditionBonuses = () => {
    return (
      <>
        <HeaderSection title="Team Bonuses" />

        <table className="ui celled table">
          <thead>
            <tr>
              <th>Power</th>
              <th>Speed</th>
              <th>Red</th>
              <th>Yellow</th>
              <th>Blue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Power"> +{appliedBonuses.newPower}</td>
              <td data-label="Speed">+{appliedBonuses.newSpeed}</td>
              <td data-label="Red">+{appliedBonuses.newRed}</td>
              <td data-label="Yellow">+{appliedBonuses.newYellow}</td>
              <td data-label="Blue">+{appliedBonuses.newBlue}</td>
            </tr>
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div>
      <div className="ui divider"></div>
      <div className="ui raised pink segment">
        <h1 align="center"> Battle Arena! </h1>
        <p>Select one angel, pet, and accessory (optional) for battle!</p>
      </div>
      <CardWarning cards={cards} />
      <HeaderSection title="Selected Team" />
      <table className="ui celled table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Stats</th>
            <th>Bonuses</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{getSelectedTeamRows()}</tbody>
      </table>

      {(!selectedAngel || !selectedPet) && (
        <button className="ui grey button">Choose your team..</button>
      )}

      {selectedAngel && selectedPet && (
        <>
          {displayConditionBonuses()}

          <button className="ui orange button" onClick={() => onTeamSelect()}>
            Time to Fight!
          </button>
        </>
      )}

      <MountainConditions {...mountainConditions} />

      <HeaderSection title="Tokens" />

      {!angels && <LoadingSpinner />}

      {angels && !selectedAngel && (
        <table className="ui celled unstackable table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Stats</th>
              <th>Bonuses</th>
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
              <th>Bonuses</th>
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
              <th>Bonuses</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{getCardRows('accessory', accessories)}</tbody>
        </table>
      )}
    </div>
  );
};

export default LeaderBoardTeamSelector;
