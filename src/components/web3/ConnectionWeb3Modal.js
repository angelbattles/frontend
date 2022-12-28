import Web3 from 'web3';
import Portis from '@portis/web3';
import Web3Modal, { getProviderInfo } from 'web3modal';
import { initContractsWithWeb3 } from './SolidityContracts';

const portisDappId = 'db8a6364-423a-4abe-83f6-7177dc64a462';
const providerOptions = {
  portis: {
    package: Portis, // required
    options: { id: portisDappId },
  },
};

let portis = new Portis(portisDappId, 'mainnet');

let web3 = null;
let currentAddress = '0x0000000000000000000000000000000000000001';
let isLoggedIn = false;
const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
  providerOptions,
});
let provider;
async function connectToModal() {
  await web3Modal.clearCachedProvider();
  provider = await web3Modal.connect();
  let info = await getProviderInfo(provider);
  window.localStorage.setItem('provider', info.name);
  window.localStorage.setItem('provider', 'walletconnect manual');

  if (info && info.name === 'MetaMask') {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Acccounts now exposed
        currentAddress = window.ethereum.selectedAddress;
        provider = Web3.givenProvider;
        web3 = new Web3(provider);
      } catch (error) {
        // User denied account access...
        alert(
          'In order to use metamask to interact with Angel Battles 2, you must allow metamask to interact with Angel Battles 2 '
        );
      }
    }
  } else {
    web3 = new Web3(provider);
  }

  await setCurrentAddress();
  window.location.reload();
  isLoggedIn = true;
  initContractsWithWeb3(web3);
}

web3 = new Web3(portis.provider);
const switchWeb3 = async () => {
  provider = await web3Modal.connectTo('injected');
  web3 = new Web3(provider);
  await initContractsWithWeb3(web3);
};
// If they previously logged in with metamask, do so again.
if (window.localStorage.getItem('provider') !== 'Portis') {
  switchWeb3();
}

if (
  window.localStorage.getItem('currentAddress') &&
  window.localStorage.getItem('currentAddress') !== '-1'
) {
  currentAddress = window.localStorage.getItem('currentAddress');
  isLoggedIn = true;
}
portis.onLogin(async () => {
  isLoggedIn = true;
  window.localStorage.setItem('provider', 'Portis');
  await setCurrentAddress();
});
portis.onLogout(() => {
  isLoggedIn = false;
  window.localStorage.setItem('provider', null);
  window.location.reload(true);
});
function getWeb3() {
  return web3;
}
function setLoggedIn() {
  isLoggedIn = !isLoggedIn;
}
function logMeIn() {
  isLoggedIn = true;
}

async function setCurrentAddress() {
  await web3.eth.getAccounts();

  currentAddress = await web3.eth.getAccounts().then(function (accounts) {
    return accounts[0];
  });
  window.localStorage.setItem('currentAddress', currentAddress);
  return currentAddress;
}

async function getCurrentAddress() {
  while (currentAddress === '0x0000000000000000000000000000000000000001') {
    currentAddress = await setCurrentAddress();
  }
  return currentAddress;
}

export {
  connectToModal,
  portis,
  web3,
  getWeb3,
  getCurrentAddress,
  currentAddress,
  //getCurrentUser,
  isLoggedIn,
  setLoggedIn,
  logMeIn,
  setCurrentAddress,
};
