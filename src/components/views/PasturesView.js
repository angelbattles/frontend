import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../contexts/AppContext';
import ABCardInfo from '../../config/abcardinfo';
import Stats from '../Stats';
import HeaderSection from '../HeaderSection';
import LoadingSpinner from '../LoadingSpinner';
import WarnHeader from '../WarnHeader';
import CardWarning from '../web3/CardWarning';
import { getDefaultTransactionOptions } from '../web3/Utilities';

const PasturesView = ({ cards, refreshAllTokens }) => {
  const [recyclablePets, setRecyclablePets] = useState([]);
  const [selectedRecyclablePets, setSelectedRecyclablePets] = useState([]);
  const [hasApproval, setHasApproval] = useState(null);
  const { api, isTransactionPending } = useContext(AppContext);

  // Initialize pet cards
  useEffect(() => {
    if (!cards.ownerTokens) {
      return;
    }

    const pets = [];

    //Only get the tokens of pets that can be pastured.
    for (let i = 0; i < cards.ownerTokens.length; i++) {
      if (
        cards.ownerTokens[i].cardSeriesId >= 28 &&
        cards.ownerTokens[i].cardSeriesId <= 35
      ) {
        pets.push({ token: cards.ownerTokens[i], id: cards.ownerTokenIds[i] });
      }
    }

    setRecyclablePets(pets);
  }, [cards]);

  // Check if approval transfer approval given
  useEffect(() => {
    if (!api || isTransactionPending('approval')) {
      return;
    }

    api.cardData
      .hasTransferApproval('pets')
      .then((result) => {
        setHasApproval(result);
      })
      .catch(() => setHasApproval(null));
  }, [api, isTransactionPending]);

  const onRetireSelect = async () => {
    if (!api || isTransactionPending('retirePets')) {
      return;
    }
      const options = await getDefaultTransactionOptions()
    //Send the 6 pet Ids to the retirement function of the pets contract.

    api.pets
      .retirePets([
        selectedRecyclablePets[0].id,
        selectedRecyclablePets[1].id,
        selectedRecyclablePets[2].id,
        selectedRecyclablePets[3].id,
        selectedRecyclablePets[4].id,
        selectedRecyclablePets[5].id,
      ], options)
      .then(() => {
        refreshAllTokens();
        setSelectedRecyclablePets([]);
      });
  };

  const onPetSelect = (pet, remove) => {
    //Remove the pet from breedable pets and add it to selected pets.

    //If determine which way to move the token depending on which array was selected.
    if (remove === false) {
      if (selectedRecyclablePets.length === 6) {
        return;
      }
      selectedRecyclablePets.push(recyclablePets[pet]);
      recyclablePets.splice(pet, 1);
    }

    if (remove === true) {
      recyclablePets.push(selectedRecyclablePets[pet]);
      selectedRecyclablePets.splice(pet, 1);
    }

    setRecyclablePets([...recyclablePets]);
    setSelectedRecyclablePets([...selectedRecyclablePets]);
  };

  const getSelectedRecyclablePetRows = () => {
    return selectedRecyclablePets.map((pet, i) => (
      <tr key={i}>
        <td data-label="ID">{pet.id}</td>
        <td data-label="Level">
          {ABCardInfo.cards[pet.token.cardSeriesId].level}
        </td>
        <td data-label="Type">
          {ABCardInfo.cards[pet.token.cardSeriesId].name}
        </td>
        <td data-label="Stats">
          <Stats
            power={pet.token.power}
            experience={pet.token.experience}
            red={pet.token.auraRed}
            blue={pet.token.auraBlue}
            yellow={pet.token.auraYellow}
            seriesId={pet.token.cardSeriesId}
          />
        </td>
        <td data-label="Action">
          {!isTransactionPending('retirePets') ? (
            <button
              className="ui red button"
              onClick={() => onPetSelect(i, true)}
            >
              Remove
            </button>
          ) : (
            '--retiring--'
          )}
        </td>
      </tr>
    ));
  };

  const sortPets = (pets) => {
    return pets.sort((pet1, pet2) => {
      const pet1Level = ABCardInfo.cards[pet1.token.cardSeriesId].level;
      const pet2Level = ABCardInfo.cards[pet2.token.cardSeriesId].level;

      if (pet1Level < pet2Level) {
        return -1;
      }

      if (pet1Level > pet2Level) {
        return 1;
      }

      return 0;
    });
  };

  const getRecyclablePetRows = () => {
    return sortPets(recyclablePets).map((pet, i) => (
      <tr key={i}>
        <td data-label="ID">{pet.id}</td>
        <td data-label="Level">
          {ABCardInfo.cards[pet.token.cardSeriesId].level}
        </td>
        <td data-label="Type">
          {ABCardInfo.cards[pet.token.cardSeriesId].name}
        </td>
        <td data-label="Stats">
          <Stats
            power={pet.token.power}
            experience={pet.token.experience}
            red={pet.token.auraRed}
            blue={pet.token.auraBlue}
            yellow={pet.token.auraYellow}
            seriesId={pet.token.cardSeriesId}
          />
        </td>
        <td data-label="Action">
          {hasApproval === true &&
          !isTransactionPending('retirePets') &&
          selectedRecyclablePets.length < 6 ? (
            <button
              className="ui green button"
              onClick={() => onPetSelect(i, false)}
            >
              Select
            </button>
          ) : hasApproval === false ? (
            'Approval Needed'
          ) : null}
        </td>
      </tr>
    ));
  };

  return (
    <div>
      <HeaderSection title="0x0 Pastures" />
      <div className="ui raised segment">
        <p>
          When your pet has had a long and useful life, yet he no longer pulls
          his weight, you can retire him and let him live out the rest of his
          days in the Pastures of address 0.{' '}
        </p>
        <p>
          <a href="https://mirror.xyz/angelbattles.eth/O8kt0qWXbjpyPBPbuPwiDPd40rClkD2aK-4S1wpMdgU">
            {' '}
            Full Pets Guide{' '}
          </a>
        </p>
        <p>
          Retiring six pets will allow you to get one of the next level up.
          However, only level 2 and level 3 pets can be retired.{' '}
        </p>

        <p>Remember, once a pet has been retired, it's IRREVERSABLE. </p>
      </div>

      <div className="ui divider"></div>

      <div className="ui grid">
        <HeaderSection title="Selected Pets" />
        <WarnHeader color="orange" />

        <div className="sixteen wide column">
          <CardWarning cards={cards} />
        </div>

        <div className="sixteen wide column">
          <table className="ui celled table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Level</th>
                <th>Type</th>
                <th>Stats</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{getSelectedRecyclablePetRows()}</tbody>
          </table>

          {hasApproval === true && selectedRecyclablePets.length !== 6 && (
            <button className="ui grey button">
              Select six pets to retire...!
            </button>
          )}

          {hasApproval === true && selectedRecyclablePets.length === 6 && (
            <button
              className={`ui purple centered button ${
                isTransactionPending('retirePets') ? 'loading' : ''
              }`}
              onClick={() => onRetireSelect()}
            >
              Send them to the pasture!
            </button>
          )}
        </div>

        <HeaderSection title="Recyclable Pets" />
        {!isTransactionPending('getAllTokens') && (
          <div className="sixteen wide column">
            <table className="ui celled table mb-20">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Level</th>
                  <th>Type</th>
                  <th>Stats</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{getRecyclablePetRows()}</tbody>
            </table>
          </div>
        )}

        {(!cards.ownerTokens || isTransactionPending('getAllTokens')) && (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default PasturesView;
