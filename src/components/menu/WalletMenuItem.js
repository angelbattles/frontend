import React, { useContext } from 'react';
import AppContext from '../contexts/AppContext';

const WalletMenuItem = () => {
  const { connection } = useContext(AppContext);

  const getNetworkVersion = () => {
    return connection.networkId || 0;
  };

  const getProviderImage = () => {
    if (!connection.provider.currentProvider) {
      return '';
    }

    let image = '';

    if (connection.provider.currentProvider.isPortis) {
      image = 'images/portis.png';
    } else if (connection.provider.currentProvider.isMetaMask) {
      image = 'images/metamask.png';
    }

    if (!image) {
      console.log('unknown provider');
    }

    return image;
  };

  const getLoggedInButton = () => {
    // Check if on valid network
  
    if (+getNetworkVersion() !== 137) {
      return (
        <button
          className="ui red mini button"
          onClick={connection.connectToModal}
        >
          invalid network
        </button>
      );
    }

    return (
      <>
        <button
          className="ui green mini button"
          onClick={connection.connectToModal}
        >
          <i className="icon">
            <img
              className="ui mini image"
              alt="provider logo"
              src={getProviderImage()}
            />
          </i>
          Logged in
          {connection && connection.currentAddress ? (
            <>
              <br />
              {connection.currentAddress.slice(0, 8)}
            </>
          ) : (
            ''
          )}
        </button>
      </>
    );
  };

  return connection.provider ? (
    getLoggedInButton()
  ) : (
    <button
      className="ui orange mini button"
      onClick={connection.connectToModal}
    >
      Connect to a wallet
    </button>
  );
};

export default WalletMenuItem;
