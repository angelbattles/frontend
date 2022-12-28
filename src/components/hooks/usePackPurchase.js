import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../contexts/AppContext';

const usePackPurchase = ({ pack, refreshAllTokens, packPrices }) => {
  const { api } = useContext(AppContext);
  const [buyOptionsVisible, setBuyOptionsVisible] = useState(false);
  const isMounted = useRef(true);

  // Keep track of unmounted component
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getCardImage = (cardId) => {
    return (
      <img
        key={cardId}
        className="ui image"
        src={`images/${cardId}.png`}
        alt="card"
      />
    );
  };

  const buyPack = async (purchaseWithCurrency = true) => {
    await api.cardData
      .buyPack(pack, purchaseWithCurrency ? packPrices[pack.id] : '0')
      .then((response) => {
        refreshAllTokens();
        return response;
      })
      .catch((e) => {
        if (e.code === 4001) {
          console.log('Transaction cancelled');
          return;
        }

        console.log('Redeeming/Purchasing pack failed');
        console.log(e);
      });
  };

  const getPackPrice = () => {
    if (!packPrices) {
      return '--loading--';
    }

    return packPrices[pack.id] / 1000000000000000000 + ' Matic';
  };

  const getPackTicketPrice = () => {
    return packPrices[`${pack.id}Ticket`] ? packPrices[`${pack.id}Ticket`] : 0;
  };

  const getPackTicketPriceLabel = () => {
    if (!packPrices) {
      return '--loading--';
    }

    return packPrices[`${pack.id}Ticket`]
      ? packPrices[`${pack.id}Ticket`] +
          ' Ticket' +
          (packPrices[`${pack.id}Ticket`] > 1 ? 's' : '')
      : null;
  };

  return {
    buyOptionsVisible,
    buyPack,
    getCardImage,
    getPackPrice,
    getPackTicketPrice,
    getPackTicketPriceLabel,
    setBuyOptionsVisible,
  };
};

export default usePackPurchase;
