import { useCallback, useEffect, useMemo, useState } from 'react';
import Portis from '@portis/web3';
import Web3Modal from 'web3modal';
import Web3 from 'web3';
import { initContractsWithWeb3 } from './SolidityContracts';
import {
  REACT_APP_PORTIS_NETWORK,
  REACT_APP_NETWORK,
} from './SolidityContractsAddresses';

const useConnection = () => {
  const portisDappId = 'db8a6364-423a-4abe-83f6-7177dc64a462';
  const [provider, setProvider] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(
    '0x0000000000000000000000000000000000000001'
  );
  const [web3Modal, setWeb3Modal] = useState(null);
  const [connection, setConnection] = useState({});
  const [networkId, setNetworkId] = useState(0);
  const isValidNetwork = useMemo(
    () => +networkId === +REACT_APP_NETWORK,
    [networkId]
  );
  const hasCurrentAddress = useMemo(
    () =>
      currentAddress &&
      currentAddress !== '0x0000000000000000000000000000000000000001',
    [currentAddress]
  );

  const updateProvider = useCallback((newProvider) => {
    // Subscribe to accounts change
    newProvider.currentProvider.on('accountsChanged', (accounts) => {
      console.log('accountsChanged: ', accounts);
    });

    // Subscribe to chainId change
    newProvider.currentProvider.on('chainChanged', (chainId) => {
      console.log('chainChanged: ', chainId);
      setNetworkId(chainId);
      //setConnection({ ...connection });
    });

    // Subscribe to provider connection
    newProvider.currentProvider.on('connect', (info) => {
      console.log('connect: ', info);
    });

    // Subscribe to provider disconnection
    newProvider.currentProvider.on('disconnect', (error) => {
      console.log('disconnect: ', error);
    });

    setProvider(newProvider);
  }, []);

  const connectToModal = useCallback(async () => {
    if (!web3Modal) {
      return;
    }

    await web3Modal.clearCachedProvider();
    let currProvider = await web3Modal.connect();
    //const info = await getProviderInfo(currProvider);
    //console.log(currProvider);
    //console.log(info);

    window.web3 = new Web3(currProvider);
    updateProvider(window.web3);
    setNetworkId(getNetworkId());
    await updateCurrentAddress();
    await initContractsWithWeb3(window.web3);
  }, [web3Modal, updateProvider]);

  const updateCurrentAddress = async () => {
    const address = await window.web3.eth
      .getAccounts()
      .then(function (accounts) {
        return accounts[0];
      });

    setCurrentAddress(address);
    return address;
  };

  const getNetworkId = () => {
    if (!window.web3.currentProvider) {
      return 0;
    }

    if (window.web3.currentProvider.isPortis) {
      return window.web3.currentProvider._portis.config.network.chainId;
    } else if (window.web3.currentProvider.isMetaMask) {
      return window.web3.currentProvider.networkVersion;
    }

    return 0;
  };

  const getCurrentAddress = useCallback(async () => {
    while (currentAddress === '0x0000000000000000000000000000000000000001') {
      const currAddress = await updateCurrentAddress();
      return currAddress;
    }
  }, [currentAddress]);

  // Instantiate a web3Modal
  useEffect(() => {
    if (!window.web3Modal) {
      const providerOptions = {
        portis: {
          package: Portis,
          options: { id: portisDappId },
        },
      };

      window.web3Modal = new Web3Modal({
        network: REACT_APP_PORTIS_NETWORK,
        cacheProvider: true,
        providerOptions,
      });
    }

    // Connect to the previous provider if possible
    if (window.web3Modal.cachedProvider) {
      window.web3Modal.connect().then(async (currProvider) => {
        window.web3 = new Web3(currProvider);
        updateProvider(window.web3);
        setNetworkId(getNetworkId());
        await updateCurrentAddress();
        await initContractsWithWeb3(window.web3);
      });
    }

    setWeb3Modal(window.web3Modal);
  }, [updateProvider]);

  useEffect(() => {
    setConnection({
      provider,
      currentAddress,
      connectToModal,
      getCurrentAddress,
      networkId,
      isValidNetwork,
      hasCurrentAddress,
    });
  }, [
    provider,
    currentAddress,
    connectToModal,
    getCurrentAddress,
    networkId,
    isValidNetwork,
    hasCurrentAddress,
  ]);

  return connection;
};

export default useConnection;
