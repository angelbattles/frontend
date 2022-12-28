import Web3 from 'web3';
import { initContractsWithWeb3 } from './SolidityContracts';

let web3 = null;
let ethereum = window.ethereum;
//let legacyWeb3 = false;
let currentAddress = '0x0000000000000000000000000000000000000001';
//let legacyAccount = null;

async function setMetaMaskWeb3() {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Request account access if needed
      await ethereum.enable();
      // Acccounts now exposed
      currentAddress = ethereum.selectedAddress;
      console.log('we got here');
      console.log(currentAddress);
      web3 = new Web3(Web3.givenProvider);
      initContractsWithWeb3(web3);
    } catch (error) {
      // User denied account access...
      alert(
        'In order to use metamask to interact with Angel Battles 2, you must tell metamask to allow to interact with Angel Battles 2 '
      );
    }
  }
}

function setLegacyWeb3() {
  if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    web3 = new Web3(Web3.givenProvider);
  }
}

function getWeb3() {
  return web3;
}

async function setCurrentAddress() {
  currentAddress = web3.eth.getAccounts().then(function (accounts) {
    console.log('All accounts: ', accounts);
    return accounts[0];
  });
  return currentAddress;
}

async function getCurrentAddress() {
  while (currentAddress === '0x0000000000000000000000000000000000000001') {
    currentAddress = await setCurrentAddress();
    console.log('Current Address: ', currentAddress);
  }
  return currentAddress;
}

export {
  web3,
  getWeb3,
  setMetaMaskWeb3,
  setLegacyWeb3,
  getCurrentAddress,
  currentAddress,
};
