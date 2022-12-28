import React, { useContext, useMemo } from 'react';
import AppContext from './contexts/AppContext';
import usePackPurchase from './hooks/usePackPurchase';
import { REACT_APP_NETWORK_NAME } from './web3/SolidityContractsAddresses';

const ABPackBuyButton = ({
  pack,
  refreshAllTokens,
  packPrices,
  packTickets,
  setBuyOptionsVisible,
}) => {
  const { isTransactionPending, connection } = useContext(AppContext);
  const { buyPack, getPackPrice } = usePackPurchase({
    pack,
    refreshAllTokens,
    packPrices,
    packTickets,
  });
  const isUserConnected = useMemo(
    () =>
      connection && connection.isValidNetwork && connection.hasCurrentAddress,
    [connection]
  );

  const confirmPurchase = () => {
    setBuyOptionsVisible(true);
  };

  const getButton = () => {
    // User is not connected
    if (!isUserConnected) {
      return (
        <button className="ui button" onClick={connection.connectToModal}>
          Connect to {REACT_APP_NETWORK_NAME} Network
        </button>
      );
    }

    // Current transaction pending
    if (isTransactionPending(`buyPack_${pack.id}`)) {
      return <button className="mini ui loading button">Loading</button>;
    }

    // Display buy button
    return pack.id === 'free' ? (
      <button className="ui green button" onClick={() => buyPack(false)}>
        Redeem
      </button>
    ) : (
      <div
        className="ui large buttons"
        onClick={() => {
          confirmPurchase();
        }}
      >
        <button className="ui green button">{getPackPrice()}</button>
      </div>
    );
  };

  return <div className="extra content">{getButton()}</div>;
};

export default ABPackBuyButton;
