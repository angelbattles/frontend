import React, { useState, useEffect, useContext } from 'react';
import * as SolidityContractsAddresses from '../web3/SolidityContractsAddresses';
import * as contracts from '../web3/SolidityContracts';
import ConnectionContext from '../contexts/ConnectionContext';
import {
  getPetsContract,
  getSkaleBattleMtnContract,
  getBattleSupportContract,
  getSkaleBattleContract,
  getVSBattleContract,
  getCardDataContract,
  getStoreContract,
  getMedalsContract,
  getBattleMtnStructure,
} from '../web3/SolidityContracts';
import LoadingSpinner from '../LoadingSpinner';

const DeployTool = () => {
  const connection = useContext(ConnectionContext);
  const [contractActions, setContractActions] = useState(null);

  // const testAction = async () => {
  //   console.log('test')
  //   let res = await contracts
  //     .getVSBattleContract()
  //     .methods.ABTokenDataContract()
  //     .call();
  //
  //   console.log(res);
  //   console.log(SolidityContractsAddresses.carddata_contract_address);
  //   console.log(res === SolidityContractsAddresses.carddata_contract_address);
  //
  //   res = await contracts
  //     .getVSBattleContract()
  //     .methods.ABBattleSupportContract()
  //     .call();
  //
  //   console.log(res);
  //   console.log(SolidityContractsAddresses.battle_support_address);
  //   console.log(res === SolidityContractsAddresses.battle_support_address);
  //
  //   res = await contracts
  //     .getVSBattleContract()
  //     .methods.BattleMtnDataContract()
  //     .call();
  //   console.log(res);
  //   console.log(SolidityContractsAddresses.battle_mountain_address);
  //   console.log(res === SolidityContractsAddresses.battle_mountain_address);
  //
  //   res = await contracts
  //     .getVSBattleContract()
  //     .methods.HaloTokenContract()
  //     .call();
  //
  //   console.log(res);
  //   console.log(SolidityContractsAddresses.token_contact_address);
  //   console.log(res === SolidityContractsAddresses.token_contact_address);
  // };

  const performAction = async (actionStep) => {
    const contractAction = contractActions[actionStep];
    const sendData = {
      from: connection.currentAddress,
      //gas: contractAction.gas ? contractAction.gas : 900000,
      //gasPrice: web3.utils.toWei('1.1', 'gwei'),
    };

    try {
      await contractAction['contract'].methods[contractAction.action]
        .apply(null, contractAction.params)
        .send(sendData)
        .on('receipt', () => {
          console.log('confirmed');
          updateActions();
        });
    } catch (e) {
      console.log('error calling ', contractAction.action);
      console.log('with params ', contractAction.params);
      console.log('error ', e);
    }
  };

  useEffect(() => {
    console.log('update actions');
    if (
      !connection ||
      !connection.currentAddress ||
      connection.currentAddress === '0x0000000000000000000000000000000000000001'
    ) {
      return;
    }

    updateActions();
  }, [connection]);

  const updateActions = async () => {
    /*
        A)    Deploy Halo Contract
        1)    Deploy ABToken.sol
        2)    Set ABToken address and Deploy Pets.sol
        3)    Set ABToken address and Deploy BattleMtnData.sol
        4)    Run initMountain() on BattleMtnData.sol
        // 5)    Run definePaths() on BattleMtnData.sol
        6)    Set ABToken address and Deploy ABBattleSupport.sol
        7)    Run initMonsters() on ABBattleSupport.sol
        8)    Set ABToken address and ABBattleSupport address and deploy ABArenaBattles.sol
        9)    Set ABToken, ABBattleSupport, and BattleMtnData addresses and deploy VSBattle.sol
        10)   Set ABToken address and Deploy ABStore.sol
        10a)  Set setHaloAddress on ABstore.sol
        11)   Set Seraphim on ABToken.sol  (Pets, VSBattle, ABArenaBattles, ABStore)
        12)   Set Seraphim on ABBattleSupport (ABArenaBattles) (for Liquid Metal Cornu)
        13)   Run initStore() on ABStore.sol
        14)   Set Seraphim on BattleMtnData (VS Battle) (when we restrict addTeam after testing)
        15)   Run SetDataContracts on MedalClaim
        16)   Run setBattleMtnContract on ABStore
        17a)  Run init() BattleMtnStructure
        17b)  Run definePaths() on BattleMtnStructure


        Other Actions

        * deploy custom official battle mountains (light only, dark only, etc)
        * 
        *
        * 
    
        Dao 

   ADD TOKEN ADDRESS TO STREAMDROP BEFORE DEPLOYING IT....

        1) Deploy timelock contract  (both the TimelockController and MyGovenor are in govenor_flat.sol) and verify (add ipfs when deploying and remove excess abi encoded args)
            Deploy with mindelay = <delay for executing proposals>
            proposers = ["0x0000000000000000000000000000000000000000"] 
            executors = ["0x0000000000000000000000000000000000000000"]

abi encoded for 3600 min delay 
0000000000000000000000000000000000000000000000000000000000000e10000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000
        2) Deploy MyGovenor Contract and verify
            Deploy with halo token address and timelock address
        3) Call grantRole on the treasury contract from the original deployer and give the govenor role d8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63 (prepend 0x) also role? 0xb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1
        4) Add the DAO to tally.xyz
            Tell Tally the governor address and block it was added in
            Tell Tally the Halo address and block it was added on. 
            Governor type is compound bravo
        5) Call grantRole to give the govenor the admin role  (TODO)
        6) call revokeRole on the original deployer to remove admin access. (NOT YET) 
        7) Update dao link on app.js
        
        Stream Drop
        2) Add the addresses of the airdrop recepients to generator/merkle.json on merkle-airdrop-starter (DONE)
        3) run the generator (DONE)
        4) Add the generated merkle root and Halo token address to StreamDrop.sol. Add the config file to the front end. 
        ADD TOKEN ADDRESS TO STREAMDROP BEFORE DEPLOYING....
        5) Deploy StreamDrop.sol
        6) Transfer majority of tokens to StreamDrop contract by calling initialize() on Halo from angelbattles.eth
        7) Call startSponsoredStreams() and startTreasuryStream() on streamDrop from angelbattles.eth
        8) MAKE SURE to award to the 'vs battle' addresses, NOT the 'battlemtndata' addresses. 
        9) We tried to do startTreasuryStream with the timelock (treasury) address





        Liquidity Mining (N/A)
        1) Open a pool on Uniswap for Halo/Matic
        2) Deploy StakingRewards.sol
        3) Send Halo Tokens to staking Rewards Contract
        4) Set parameters on staking rewards contract (notify reward)
        5) Make sure owner can be changed to DAO later. 

        Other TO DO ON MAINNET
   
        2) Change prices of packs in the store in matic. 
        3) Change VRF endpoints to mainnet. (store and mountain)
        4) Change govenor_flat line 3780 to 1 week. 

     */
    const actions = {
      0: {
        action: '',
        contract: null,
        isComplete: true,
        params: [],
      },
      1: {
        action: '',
        contract: null,
        isComplete: true,
        params: [],
      },
      2: {
        action: 'DataContacts',
        contract: getPetsContract(),
        isComplete:
          (await contracts
            .getPetsContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address &&
          (await contracts.getPetsContract().methods.HaloContract().call()) ===
            SolidityContractsAddresses.token_contact_address,
        params: [
          SolidityContractsAddresses.carddata_contract_address,
          SolidityContractsAddresses.token_contact_address,
        ],
      },
      '3a': {
        action: 'setCardDataContact',
        contract: getSkaleBattleMtnContract(),
        isComplete:
          (await contracts
            .getSkaleBattleMtnContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address,
        params: [SolidityContractsAddresses.carddata_contract_address],
      },
      '3b': {
        action: 'initMountain',
        contract: getSkaleBattleMtnContract(),
        isComplete:
          (
            await contracts
              .getSkaleBattleMtnContract()
              .methods.getTeamByPosition(1)
              .call()
          ).petId !== '0',
        params: [],
      },
      '3c': {
        action: 'setBattleMtnStructureContact',
        contract: getSkaleBattleMtnContract(),
        isComplete:
          (await contracts
            .getSkaleBattleMtnContract()
            .methods.BattleMtnStructureContract()
            .call()) ===
          SolidityContractsAddresses.battle_mountain_structure_address,
        params: [SolidityContractsAddresses.battle_mountain_structure_address],
      },
      // 5: {
      //   action: 'definePaths',
      //   contract: getSkaleBattleMtnContract(),
      //   isComplete:
      //     (await contracts
      //       .getSkaleBattleMtnContract()
      //       .methods.isValidMove(1, 2)
      //       .call()) === true,
      //   params: [],
      // },

      6: {
        action: 'setParameters',
        contract: getBattleSupportContract(),
        isComplete:
          (await contracts
            .getBattleSupportContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address,
        params: [SolidityContractsAddresses.carddata_contract_address, 6, 12],
      },
      7: {
        action: 'initMonsters',
        contract: getBattleSupportContract(),
        isComplete:
          (await contracts
            .getBattleSupportContract()
            .methods.getMonster(0)
            .call()
            .then((data) => data.hp)
            .catch(() => -1)) === '100',
        params: [],
      },
      8: {
        action: 'setParameters',
        contract: getSkaleBattleContract(),
        isComplete:
          (await contracts
            .getSkaleBattleContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address &&
          (await contracts
            .getSkaleBattleContract()
            .methods.ABBattleSupportContract()
            .call()) === SolidityContractsAddresses.battle_support_address &&
          (await contracts
            .getSkaleBattleContract()
            .methods.HaloTokenContract()
            .call()) === SolidityContractsAddresses.token_contact_address,
        params: [
          SolidityContractsAddresses.carddata_contract_address,
          SolidityContractsAddresses.battle_support_address,
          SolidityContractsAddresses.token_contact_address,
          301,
          86400,
          3600,
            100,
          20
        ],
      },
      9: {
        action: 'setParameters',
        contract: getVSBattleContract(),
        isComplete:
          (await contracts
            .getVSBattleContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address &&
          (await contracts
            .getVSBattleContract()
            .methods.ABBattleSupportContract()
            .call()) === SolidityContractsAddresses.battle_support_address &&
          (await contracts
            .getVSBattleContract()
            .methods.BattleMtnDataContract()
            .call()) === SolidityContractsAddresses.battle_mountain_address &&
          (await contracts
            .getVSBattleContract()
            .methods.HaloTokenContract()
            .call()) === SolidityContractsAddresses.token_contact_address,
        params: [
          SolidityContractsAddresses.carddata_contract_address,
          SolidityContractsAddresses.battle_support_address,
          SolidityContractsAddresses.battle_mountain_address,
          SolidityContractsAddresses.token_contact_address,
          6,
          12,
          15,
          100,
        ],
      },
      10: {
        action: 'setABTokenDataContract',
        contract: getStoreContract(),
        isComplete:
          (await contracts
            .getStoreContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address,
        params: [SolidityContractsAddresses.carddata_contract_address],
      },
      '10a': {
        action: 'setHaloAddress',
        contract: getStoreContract(),
        isComplete:
          (await contracts
            .getStoreContract()
            .methods.haloContractAddress()
            .call()) === SolidityContractsAddresses.token_contact_address,
        params: [SolidityContractsAddresses.token_contact_address],
      },
      '11a': {
        action: 'addSERAPHIM',
        contract: getCardDataContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.seraphims(SolidityContractsAddresses.pets_contract_address)
            .call()) === true,
        params: [SolidityContractsAddresses.pets_contract_address],
      },
      '11b': {
        action: 'addSERAPHIM',
        contract: getCardDataContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.seraphims(SolidityContractsAddresses.vs_battle_address)
            .call()) === true,
        params: [SolidityContractsAddresses.vs_battle_address],
      },
      '11c': {
        action: 'addSERAPHIM',
        contract: getCardDataContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.seraphims(SolidityContractsAddresses.skale_battle_address)
            .call()) === true,
        params: [SolidityContractsAddresses.skale_battle_address],
      },
      '11d': {
        action: 'addSERAPHIM',
        contract: getCardDataContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.seraphims(SolidityContractsAddresses.store_contact_address)
            .call()) === true,
        params: [SolidityContractsAddresses.store_contact_address],
      },
      '11e': {
        action: 'addSERAPHIM',
        contract: getSkaleBattleMtnContract(),
        isComplete:
          (await contracts
            .getSkaleBattleMtnContract()
            .methods.seraphims(SolidityContractsAddresses.vs_battle_address)
            .call()) === true,
        params: [SolidityContractsAddresses.vs_battle_address],
      },
      '11f': {
        action: 'addSERAPHIM',
        contract: getCardDataContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.seraphims(
              SolidityContractsAddresses.battle_support_address
            )
            .call()) === true,
        params: [SolidityContractsAddresses.battle_support_address],
      },
      '11g': {
        action: 'addSERAPHIM',
        contract: getCardDataContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.seraphims(SolidityContractsAddresses.medals_address)
            .call()) === true,
        params: [SolidityContractsAddresses.medals_address],
      },
      12: {
        action: 'addSERAPHIM',
        contract: getBattleSupportContract(),
        isComplete:
          (await contracts
            .getBattleSupportContract()
            .methods.seraphims(SolidityContractsAddresses.skale_battle_address)
            .call()) === true,
        params: [SolidityContractsAddresses.skale_battle_address],
      },
      13: {
        action: 'initStore',
        contract: getStoreContract(),
        isComplete:
          (await contracts
            .getCardDataContract()
            .methods.totalSupply()
            .call()) !== '0',
        params: [],
      },
      15: {
        action: 'setDataContacts',
        contract: getMedalsContract(),
        isComplete:
          (await contracts
            .getMedalsContract()
            .methods.ABTokenDataContract()
            .call()) === SolidityContractsAddresses.carddata_contract_address &&
          (await contracts
            .getMedalsContract()
            .methods.ABBattleSupportContract()
            .call()) === SolidityContractsAddresses.battle_support_address &&
          (await contracts
            .getMedalsContract()
            .methods.BattleMtnDataContract()
            .call()) === SolidityContractsAddresses.battle_mountain_address,
        params: [
          SolidityContractsAddresses.carddata_contract_address,
          SolidityContractsAddresses.battle_support_address,
          SolidityContractsAddresses.battle_mountain_address,
        ],
      },
      16: {
        action: 'setBattleMtnContract',
        contract: getStoreContract(),
        isComplete:
          (await contracts
            .getStoreContract()
            .methods.BattleMtnAddress()
            .call()) === SolidityContractsAddresses.gitcoin_address,
        params: [SolidityContractsAddresses.gitcoin_address],
      },
      '17a': {
        action: 'init',
        contract: getBattleMtnStructure(),
        isComplete:
          (await contracts
            .getBattleMtnStructure()
            .methods.getSpotFromPanel(0, 0)
            .call()) !== '0',
        params: [],
      },
      '17b': {
        action: 'definePaths',
        contract: getBattleMtnStructure(),
        isComplete:
          (await contracts
            .getBattleMtnStructure()
            .methods.isValidMove(
              1,
              2,
              SolidityContractsAddresses.battle_mountain_address
            )
            .call()) === true,
        params: [],
      },
    };

    setContractActions(actions);
  };

  if (!contractActions) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h1>Deploy Tool</h1>

      <table border="1" style={{ borderSpacing: 0 }}>
        <tbody>
          <tr>
            <td>---</td>
            <td>A. Deploy Halo Contract</td>
            <td>{SolidityContractsAddresses.token_contact_address}</td>
          </tr>
          <tr>
            <td>---</td>
            <td>1. Deploy ABToken.sol</td>
            <td>{SolidityContractsAddresses.carddata_contract_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['2'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('2');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>2. Set ABToken and Halo address then Deploy Pets.sol</td>
            <td>{SolidityContractsAddresses.pets_contract_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['3a'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('3a');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>3a. Set ABToken address and Deploy BattleMtnData.sol</td>
            <td>{SolidityContractsAddresses.battle_mountain_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['3b'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('3b');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>3b. Run initMountain() on BattleMtnData.sol</td>
            <td>
              <font color="red">Run Once!</font>
            </td>
          </tr>
          <tr>
            <td>
              {contractActions['3c'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('3c');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>3c. Run setBattleMtnStructureContact() on BattleMtnData.sol</td>
            <td>
              <font color="red">Run Once!</font>
            </td>
          </tr>
          {/*<tr>*/}
          {/*  <td>*/}
          {/*    {contractActions['5'].isComplete ? null : (*/}
          {/*      <button*/}
          {/*        type="button"*/}
          {/*        onClick={() => {*/}
          {/*          performAction('5');*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        Run*/}
          {/*      </button>*/}
          {/*    )}*/}
          {/*  </td>*/}
          {/*  <td>5. Run definePaths() on BattleMtnData.sol</td>*/}
          {/*  <td>*/}
          {/*    <font color="red">Run Once!</font>*/}
          {/*  </td>*/}
          {/*</tr>*/}
          <tr>
            <td>
              {contractActions['6'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('6');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>6. Set ABToken address and Deploy ABBattleSupport.sol</td>
            <td>{SolidityContractsAddresses.battle_support_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['7'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('7');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>7. Run initMonsters() on ABBattleSupport.sol</td>
            <td>
              <font color="red">Run Once!</font>
            </td>
          </tr>
          <tr>
            <td>
              {contractActions['8'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('8');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>
              8. Set ABToken, ABBattleSupport, and Halo address then deploy
              ABArenaBattles.sol
            </td>
            <td>{SolidityContractsAddresses.skale_battle_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['9'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('9');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>
              9. Set ABToken, ABBattleSupport, BattleMtnData, Halo addresses
              then deploy VSBattle.sol
            </td>
            <td>{SolidityContractsAddresses.vs_battle_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['10'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('10');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>10. Set ABToken address and Deploy ABStore.sol</td>
            <td>{SolidityContractsAddresses.store_contact_address}</td>
          </tr>
          <tr>
            <td>
              {contractActions['10a'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('10a');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>10a. Set setHaloAddress address and ABStore.sol</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11a'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11a');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11a. Set Seraphim on ABToken.sol (Pets)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11b'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11b');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11b. Set Seraphim on ABToken.sol (VSBattle)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11c'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11c');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11c. Set Seraphim on ABToken.sol (ABArenaBattles)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11d'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11d');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11d. Set Seraphim on ABToken.sol (ABStore)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11e'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11e');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11e. Set Seraphim on BattleMtnData.sol (VSBattle)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11f'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11f');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11f. Set Seraphim on ABToken.sol (ABBattleSupport)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['11g'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('11g');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>11g. Set Seraphim on ABToken.sol (MedalsView)</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['12'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('12');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>
              12. Set Seraphim on ABBattleSupport (ABArenaBattles) (for Liquid
              Metal Cornu)
            </td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['13'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('13');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>13. Run initStore() on ABStore.sol</td>
            <td>---</td>
          </tr>
          <tr>
            <td>TODO</td>
            <td>
              14. Set Seraphim on BattleMtnData (VS Battle) (when we restrict
              addTeam after testing)
            </td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['15'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('15');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>15. Run SetDataContracts on MedalClaim</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['16'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('16');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>16. Run setBattleMtnContract on ABStore for gitcoin address</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['17a'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('17a');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>17a. Run init() BattleMtnStructure</td>
            <td>---</td>
          </tr>
          <tr>
            <td>
              {contractActions['17b'].isComplete ? null : (
                <button
                  type="button"
                  onClick={() => {
                    performAction('17b');
                  }}
                >
                  Run
                </button>
              )}
            </td>
            <td>17b. Run definePaths() on BattleMtnStructure</td>
            <td>---</td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default DeployTool;
