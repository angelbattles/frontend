//File that contains contract ABIs for the main contracts for AngelBattles.
//For contracts from AngelBattles 1.0 (ie, AngelCardData, PetCardData, etc, check the file LegacyCards.js)
import ABTokenAbi from './abis/ABTokenAbi';
import ABStoreAbi from './abis/ABStoreAbi';
import PetsAbi from './abis/PetsAbi';
import ABBattleSupportAbi from './abis/ABBattleSupportAbi';
import VsBattleAbi from './abis/VsBattleAbi';
import ABArenaBattleAbi from './abis/ABArenaBattlesAbi';
import BattleMtnAbi from './abis/BattleMtnAbi';
import HaloAbi from './abis/HaloAbi';
import StakingRewardsAbi from './abis/StakingRewards';
import CustomBattleMtnAbi from './abis/CustomBattleMtnAbi';
import MedalClaimAbi from './abis/MedalClaimAbi';
import {
  carddata_contract_address,
  pets_contract_address,
  skale_battle_address,
  battle_mountain_address,
  battle_mountain_structure_address,
  vs_battle_address,
  battle_support_address,
  store_contact_address,
  token_contact_address,
  lp_token_contact_address,
  sr_token_contact_address,
  custom_battle_mtn_address,
  medals_address,
  streamdrop_address,
} from './SolidityContractsAddresses';
import { LPTokenAbi } from './abis/LPTokenAbi';
import StreamdropAbi from './abis/StreamdropAbi';
import BattleMtnStructureAbi from './abis/BattleMtnStructureAbi';
import CustomBattleMtnDataAbi from './abis/CustomBattleMtnDataAbi';

let web3Provider = null;

let vs_battle_contract = null;
function getVSBattleContract(customAddress = null) {
  return customAddress
    ? new web3Provider.eth.Contract(VsBattleAbi, customAddress)
    : vs_battle_contract;
}

let carddata_contract = null;
function getCardDataContract() {
  return carddata_contract;
}

let pets_contract = null;
function getPetsContract() {
  return pets_contract;
}

let skale_battle_contract = null;
function getSkaleBattleContract() {
  return skale_battle_contract;
}

let battle_support_contract = null;
function getBattleSupportContract() {
  return battle_support_contract;
}

let skale_battle_mtn_contract = null;
function getSkaleBattleMtnContract(customAddress = null) {
  return customAddress
    ? new web3Provider.eth.Contract(BattleMtnAbi, customAddress)
    : skale_battle_mtn_contract;
}

let battle_mtn_structure = null;
function getBattleMtnStructure() {
  return battle_mtn_structure;
}

let custom_battle_mtn_data_contract = null;
function getCustomBattleMtnDataContract(customAddress = null) {
  return customAddress
    ? new web3Provider.eth.Contract(CustomBattleMtnDataAbi, customAddress)
    : custom_battle_mtn_data_contract;
}

let store_contract = null;
function getStoreContract() {
  return store_contract;
}

let token_contract = null;
function getTokenContract() {
  return token_contract;
}

let lp_token_contract = null;
function getLPTokenContract() {
  return lp_token_contract;
}

let sr_token_contract = null;
function getSRTokenContract() {
  return sr_token_contract;
}

let custom_battle_mtn_contract = null;
function getCustomBattleMtnContract() {
  return custom_battle_mtn_contract;
}

let medals_contract = null;
function getMedalsContract() {
  return medals_contract;
}

let streamdrop_contract = null;
function getStreamdropContract() {
  return streamdrop_contract;
}

function initContractsWithWeb3(web3) {
  web3Provider = web3;

  vs_battle_contract = new web3.eth.Contract(VsBattleAbi, vs_battle_address);
  carddata_contract = new web3.eth.Contract(
    ABTokenAbi,
    carddata_contract_address
  );
  store_contract = new web3.eth.Contract(ABStoreAbi, store_contact_address);
  pets_contract = new web3.eth.Contract(PetsAbi, pets_contract_address);
  skale_battle_contract = new web3.eth.Contract(
    ABArenaBattleAbi,
    skale_battle_address
  );
  skale_battle_mtn_contract = new web3.eth.Contract(
    BattleMtnAbi,
    battle_mountain_address
  );
  battle_mtn_structure = new web3.eth.Contract(
    BattleMtnStructureAbi,
    battle_mountain_structure_address
  );
  custom_battle_mtn_data_contract = new web3.eth.Contract(
    CustomBattleMtnDataAbi
  );

  battle_support_contract = new web3.eth.Contract(
    ABBattleSupportAbi,
    battle_support_address
  );

  token_contract = new web3.eth.Contract(HaloAbi, token_contact_address);

  lp_token_contract = new web3.eth.Contract(
    LPTokenAbi,
    lp_token_contact_address
  );

  sr_token_contract = new web3.eth.Contract(
    StakingRewardsAbi,
    sr_token_contact_address
  );

  custom_battle_mtn_contract = new web3.eth.Contract(
    CustomBattleMtnAbi,
    custom_battle_mtn_address
  );

  medals_contract = new web3.eth.Contract(MedalClaimAbi, medals_address);
  streamdrop_contract = new web3.eth.Contract(
    StreamdropAbi,
    streamdrop_address
  );
}

export {
  getCardDataContract,
  getStoreContract,
  getPetsContract,
  getSkaleBattleContract,
  getBattleMtnStructure,
  getSkaleBattleMtnContract,
  getCustomBattleMtnDataContract,
  getVSBattleContract,
  getBattleSupportContract,
  getTokenContract,
  getLPTokenContract,
  getSRTokenContract,
  getCustomBattleMtnContract,
  getMedalsContract,
  getStreamdropContract,
  initContractsWithWeb3,
};
