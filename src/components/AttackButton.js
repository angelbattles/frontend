import React, { useContext, useEffect, useState } from 'react';
import AppContext from './contexts/AppContext';
import ConfirmModal from './ConfirmModal';
import { getDefaultTransactionOptions } from './web3/Utilities';

const AttackButton = ({ to, from, angel, pet, accessory, startVSBattle }) => {
  const [isValid, setIsValid] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const { api } = useContext(AppContext);

  // Check if valid move (is bridge down)
  useEffect(() => {
    if (!api) {
      return;
    }

    api.vsBattle.isValidMove(from, to).then(setIsValid);
  }, [api, from, to]);

    const [clicked, setClicked] = useState(false)

  const handleClick = async (e) => {
    e.preventDefault();

      const options = await getDefaultTransactionOptions();

      if (isValid) {
          setClicked(true)
      api.vsBattle
        .attackSpot(from, to, 0, 0, 0, options)
          .on('confirmation', (confirmationNum) => {

              if (confirmationNum === 5) {
                  startVSBattle(to, angel, pet, accessory)
              }
          }
              );
    } else {
      setModalVisible(true);
    }
  };

  return (
    <>
      <button
        className={`ui ${isValid ? 'green' : 'red'} inverted button`}
        onClick={handleClick}
      >
              {clicked ? <span>Starting... </span> : <img
                  src="https://img.icons8.com/officel/16/000000/sword.png"
                  alt="sword"
              />}
        {!clicked  && to}
      </button>
      <ConfirmModal
        title="Bridge Is Down"
        content="Bridge is currently down. Change the mountain condition for a chance to repair the bridge or try again at a later time when it's back up. "
        visible={modalVisible}
        onClose={setModalVisible}
      />
    </>
  );
};

export default AttackButton;
