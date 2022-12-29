import React, { useState, useEffect, useContext, useCallback } from 'react';
import web3 from 'web3';
import AppContext from '../contexts/AppContext';
import ABCardInfo from '../../config/abcardinfo.js';
import Stats from '../Stats';
import HeaderSection from '../HeaderSection';
import LoadingSpinner from '../LoadingSpinner';
import CardWarning from '../web3/CardWarning';
import Alert from '../Alert';
import { pets_contract_address } from '../web3/SolidityContractsAddresses';
import { getDefaultTransactionOptions } from '../web3/Utilities';

const BreedingView = ({ cards, breedingCost, refreshAllTokens }) => {
  const [restingPets, setRestingPets] = useState([]);
  const [breedablePets, setBreedablePets] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);
  const [successful, setSuccessful] = useState(false);
  const [breedingDelaySeconds, setBreedingDelaySeconds] = useState(null);
  const [error, setError] = useState('');
  const [haloBalance, setHaloBalance] = useState(0);
  const { api, isTransactionPending, connection } = useContext(AppContext);
  const [hasPet20Approval, setHasPet20Approval] = useState(false);

  // Get Breeding Delay
  useEffect(() => {
    if (api || !connection) {
      api.pets
        .getBreedingDelay()
        .then((seconds) => setBreedingDelaySeconds(parseInt(seconds, 10)));

      api.token.balanceOf(connection.currentAddress).then(function (result) {
        setHaloBalance(result);
      });

      api.token
        .allowance(pets_contract_address)
        .then((result) => {
          console.log('pets approval', result);
          setHasPet20Approval(parseInt(result, 10));
        })
        .catch(() => setHasPet20Approval(null));
    }
  }, [api, connection]);

  // Determine breedable and resting pets
  useEffect(() => {
    if (!cards.ownerTokens || breedingDelaySeconds === null) {
      return;
    }

    const currRestingPets = [];
    const currBreedablePets = [];

    for (var i = 0; i < cards.ownerTokens.length; i++) {
      if (
        cards.ownerTokens[i].cardSeriesId > 23 &&
        cards.ownerTokens[i].cardSeriesId < 40 &&
        cards.ownerTokens[i].breedingCount < 5
      ) {
        const nextBreedingTime =
          parseInt(cards.ownerTokens[i].lastBreedingTime, 10) +
          breedingDelaySeconds;
        const currentTime = Math.round(new Date().getTime() / 1000);

        nextBreedingTime < currentTime
          ? currBreedablePets.push({
              token: cards.ownerTokens[i],
              id: cards.ownerTokenIds[i],
            })
          : currRestingPets.push({
              token: cards.ownerTokens[i],
              id: cards.ownerTokenIds[i],
            });
      }
    }

    setRestingPets(currRestingPets);
    setBreedablePets(currBreedablePets);
  }, [cards, breedingDelaySeconds]);

  const giveERC20Approval = async (type) => {
    const approvalAddress = pets_contract_address;
      const options = await getDefaultTransactionOptions()
    api.token
      .approveHalo(approvalAddress, options)
      .on('transactionHash', function (hash) {
        console.log(hash);
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        //console.log(receipt);
      })
      .on('receipt', function (receipt) {
        // receipt example
        console.log(receipt);
      });
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

  const getBreedablePetRows = () => {
    return sortPets(breedablePets).map((pet, i) => (
      <tr key={i}>
        <td data-label="ID">{pet.id}</td>
        <td data-label="Name">
          {ABCardInfo.cards[pet.token.cardSeriesId].name}
        </td>
        <td data-label="Level">
          {ABCardInfo.cards[pet.token.cardSeriesId].level}
        </td>
        <td data-label="Type">
          {ABCardInfo.cards[pet.token.cardSeriesId].type}
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
        <td data-label="Breed Count">{pet.token.breedingCount}</td>
        <td data-label="Action">
          {selectedPets.length < 2 && (
            <button
              className="ui green button"
              onClick={() => onPetSelect(i, false)}
            >
              Select
            </button>
          )}
        </td>
      </tr>
    ));
  };

  const getRestingPetRows = () => {
    if (breedingDelaySeconds === null) {
      return null;
    }

    return sortPets(restingPets).map((pet, i) => {
      const nextBreedingTime =
        parseInt(pet.token.lastBreedingTime, 10) + breedingDelaySeconds;
      const currentTime = Math.round(new Date().getTime() / 1000);
      const remainingRestingTime = nextBreedingTime - currentTime;
      let breedingDelayHours = Math.floor(remainingRestingTime / 3600);
      let breedingDelaysMinutes = Math.ceil((remainingRestingTime % 3600) / 60);

      // Adjust hours and minutes if minutes equal 60
      if (breedingDelaysMinutes === 60) {
        breedingDelaysMinutes = 0;
        breedingDelayHours++;
      }

      return (
        <tr key={i}>
          <td data-label="ID">{pet.id}</td>

          <td data-label="Name">
            {ABCardInfo.cards[pet.token.cardSeriesId].name}
          </td>
          <td data-label="Level">
            {ABCardInfo.cards[pet.token.cardSeriesId].level}
          </td>
          <td data-label="Type">
            {ABCardInfo.cards[pet.token.cardSeriesId].type}
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
          <td data-label="Breed Count">{pet.token.breedingCount}</td>
          <td data-label="Action">
            {breedingDelayHours} h {breedingDelaysMinutes} m
          </td>
        </tr>
      );
    });
  };

  const onPetSelect = useCallback(
    (pet, remove) => {
      // Remove the pet from breedable pets and add it to selected pets.
      if (remove === false) {
        if (selectedPets.length === 2) {
          return;
        }
        selectedPets.push(breedablePets[pet]);
        breedablePets.splice(pet, 1);
      }

      // Remove the pet from selected pets and add it to breedable pets.
      if (remove === true) {
        breedablePets.push(selectedPets[pet]);
        selectedPets.splice(pet, 1);
      }

      setBreedablePets([...breedablePets]);
      setSelectedPets([...selectedPets]);
    },
    [breedablePets, selectedPets]
  );

    const onBreedSelect = async () => {
        const options = await getDefaultTransactionOptions()
        
    api.pets
      .breedPets(selectedPets[0].id, selectedPets[1].id, options)
      .on('receipt', (receipt) => {
        setSelectedPets([]);
        setSuccessful(false);
        refreshAllTokens();
      })
      .on('error', (error) => {
        const message = error.message ?? null;
        if (!message) {
          return;
        }

        let selectedPet = null;
        if (message.includes('Pet 1 cannot breed')) {
          selectedPet = selectedPets[0];
        } else if (message.includes('Pet 2 cannot breed')) {
          selectedPet = selectedPets[2];
        }

        if (selectedPet) {
          setError(
            `${ABCardInfo.cards[selectedPet.token.cardSeriesId].name} - (ID ${
              selectedPet.id
            }) cannot be breed more than 5 times`
          );
        }
      });
  };

  const getSelectedPetRows = () => {
    return selectedPets.map((pet, i) => (
      <tr key={i}>
        <td data-label="ID">{pet.id}</td>
        <td data-label="Name">
          {ABCardInfo.cards[pet.token.cardSeriesId].name}
        </td>
        <td data-label="Level">
          {ABCardInfo.cards[pet.token.cardSeriesId].level}
        </td>
        <td data-label="Type">
          {ABCardInfo.cards[pet.token.cardSeriesId].type}
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
        <td data-label="Breed Count">{pet.token.breedingCount}</td>
        <td data-label="Action">
          <button
            className="ui red button"
            onClick={() => onPetSelect(i, true)}
          >
            Remove
          </button>
        </td>
      </tr>
    ));
  };

  if (isTransactionPending('getBreedingDelay')) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pb-20">
      <div className="ui raised pink segment">
        <h1 align="center"> Breeding Stables </h1>
        {successful && (
          <div className="ui success message">
            <i className="close icon" onClick={() => setSuccessful(false)}></i>
            <div className="header">Breeding Transaction Sent!</div>
            <p>
              Check the manage page in a couple of minutes to see your new pet!
            </p>
          </div>
        )}
        <p>
          Love is in the air! Mate two of your pets to create a powerful new
          ally. What kind of pet will be born? Children are always the same pet
          line as one of their parents, and their aura powers will usually be
          stronger than either parent.
        </p>
        <p>
          <a href="https://mirror.xyz/angelbattles.eth/O8kt0qWXbjpyPBPbuPwiDPd40rClkD2aK-4S1wpMdgU">
            {' '}
            Full Pets Guide{' '}
          </a>
        </p>
        <p>
          Choose any two of your pets below and then click the breed button.
          There is a current breeding fee of{' '}
          {breedingCost
            ? web3.utils.fromWei(breedingCost, 'ether')
            : '--Loading--'}{' '}
          Halo Tokens
        </p>
        <p>
          My current Halo balance:{' '}
          {haloBalance
            ? (haloBalance / 1000000000000000000).toFixed(2)
            : '--Loading--'}
        </p>
        <p>
          Pets can only breed once during any given 24 hour period, and level 1,
          2,3 and 4 pets are breedable. You cannot breed a brand new pet until
          it is at least 24 hours old.
        </p>
        <p>Each pet can be bred a maximum of 5 times.</p>
        {hasPet20Approval === 0 && (
          <div>
            {' '}
            <p>
              In order to breed, you must approve the pets contract to collect
              the breeding fee. This only needs to be done once. Refresh the
              page after your approval tx is mined
            </p>
            <button
              className="ui primary button"
              onClick={() => giveERC20Approval('pets')}
            >
              Approve Pets Contract for ERC20
            </button>
          </div>
        )}
        <img
          className="ui centered small image"
          src={`images/site/LovePotion.png`}
          alt="Love Potion"
        />
      </div>

      <CardWarning cards={cards} />

      {isTransactionPending('breedPets') ? (
        <>
          <HeaderSection title="Breeding in progress. Please do not disturb." />
          <LoadingSpinner />
        </>
      ) : (
        <>
          {parseInt(haloBalance, 10) < parseInt(breedingCost, 10) ? (
            <div>
              You need more Halo tokens to be able to breed. Check out the
              account page to claim or earn some from the battles{' '}
            </div>
          ) : (
            <>
              {' '}
              <HeaderSection title="Selected Pets" />
              <Alert message={error} />
              <table className="ui celled stackable table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Level</th>
                    <th>Type</th>
                    <th>Stats</th>
                    <th>Breed Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{getSelectedPetRows()}</tbody>
              </table>
              {selectedPets.length !== 2 && (
                <button className="ui grey button">Looking for love...!</button>
              )}
              {selectedPets.length === 2 && (
                <button
                  className="ui purple button"
                  onClick={() => onBreedSelect()}
                >
                  Let's get it on!
                </button>
              )}
              {!isTransactionPending('getAllTokens') && hasPet20Approval > 0 && (
                <>
                  <HeaderSection
                    title={`Breedable (${breedablePets.length})`}
                  />
                  <table className="ui celled stackable table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Type</th>
                        <th>Stats</th>
                        <th>Breed Count</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>{getBreedablePetRows()}</tbody>
                  </table>
                </>
              )}
              {!isTransactionPending('getAllTokens') && restingPets.length ? (
                <>
                  <HeaderSection title={`Resting (${restingPets.length})`} />
                  <table className="ui celled stackable table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Level</th>
                        <th>Type</th>
                        <th>Stats</th>
                        <th>Breed Count</th>
                        <th>Time Left</th>
                      </tr>
                    </thead>
                    <tbody>{getRestingPetRows()}</tbody>
                  </table>
                </>
              ) : null}
              {!cards.ownerTokens ||
                (isTransactionPending('getAllTokens') && <LoadingSpinner />)}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BreedingView;
