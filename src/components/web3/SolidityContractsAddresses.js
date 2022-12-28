//File that contains contract addresses for the main contracts for AngelBattles.
//For contracts from AngelBattles 1.0 (ie, AngelCardData, PetCardData, etc, check the file LegacyCards.js)
const networks = {
    dev: {
        name: process.env.REACT_APP_NETWORK_NAME || 'Gnosis',
        network: process.env.REACT_APP_NETWORK || 100,
        portis_network: process.env.REACT_PORTIS_NETWORK || 'xdai',
        ABToken:
            process.env.REACT_APP_CARDDATA_CONTRACT_ADDRESS ||
            '0x454090c4b90A41894f8ABD8C0255A662531b5744',
        Pets:
            process.env.REACT_APP_PETS_CONTRACT_ADDRESS ||
            '0xDC5908E29566Da2b659DcC1Bf074c1a2Ed27d595',
        ABArenaBattles:
            process.env.REACT_APP_SKALE_BATTLE_ADDRESS ||
            '0xA0CeF1087Fb2fb06dF36B121b934cE9bcFdd9d8e',
        ABBattleSupport:
            process.env.REACT_APP_BATTLE_SUPPORT_ADDRESS ||
            '0xf9079Dbd535bB170Fe2EC0A305C109E39D744Ea4',
        BattleMtnData:
            process.env.REACT_APP_BATTLE_MOUNTAIN_ADDRESS ||
            '0xc731af83524D3902FC985e3388d70ACba23F7A37',
        BattleMtnStructure:
            process.env.REACT_APP_BATTLE_MOUNTAIN_STRUCTURE_ADDRESS ||
            '0xc731af83524D3902FC985e3388d70ACba23F7A37',
        VSBattle:
            process.env.REACT_APP_VS_BATTLE_ADDRESS ||
            '0x3cCc88E607abc98729B01126ff7349c70D17c142',
        ABStore:
            process.env.REACT_APP_STORE_ADDRESS ||
            '0xa0B52135c67426125219AeD50F2b7F4d1d89314A',
        CustomBattleMtn:
            process.env.REACT_APP_CUSTOM_BATTLE_MOUNTAIN ||
            '0x75c04C7AAC9b4a9813579C7BE9c881be43822B26',
        CustomBattleData:
            process.env.REACT_APP_CUSTOM_BATTLE_MOUNTAIN_DATA ||
            '0x75c04C7AAC9b4a9813579C7BE9c881be43822B26',
        MedalClaim:
            process.env.REACT_APP_MEDALS_ADDRESS ||
            '0x331Db62D68F10f03deBd70BAd20615b11425571e',
        token_contact_address:
            process.env.REACT_APP_TOKEN_ADDRESS ||
            '0x00D5B35cDB5e751dEAd5d6b442c602007b922EC0',
        lp_token_contact_address:
            process.env.REACT_APP_LPTOKEN_ADDRESS ||
            '0x5564092a21f3D0cCd814946AF6D7ED4CcA61Ffc3',
        sr_token_contact_address:
            process.env.REACT_APP_SR_TOKEN_ADDRESS ||
            '0xb403e477cf1eba9c5c6e69ae2a2373f4356c40fe',
        streamdrop_token_address:
            process.env.REACT_APP_SR_TOKEN_ADDRESS ||
            '0xF7852A937473816084D5D17d9fCd95bdd1Ce4BC2',
    },
    /*
    polygon_testnet: {
        name: 'Polygon Testnet',
        network: 80001,
        portis_network: 'maticMumbai',
        ABToken: '0x6647a30D76Da05dB7285732D9CCaE2a4CbFb694B',
        Pets: '0x458C4051be44c426beCEfc4F014b21c557ED8EC0',
        ABArenaBattles: '0xfe29fe7592D01b06688a3E4f419Aa91c5B341b05',
        ABBattleSupport: '0x57CC69C64Aa9334aF51CD6B7F8582d6f04174E9A',
        BattleMtnData: '0x6D634560D1d18CfD34F7ec0D12F81fdd459a183c',
        BattleMtnStructure: '0x5e2F45869eE30Fe618aD7808D06fF61832051f47',
        VSBattle: '0x63817FA202058C7a69C3fE1BaA64d2BfE8ab9F5c',
        ABStore: '0x9c4c3Ba331B0eEd652D684005A1C5134acF09Db0',
        CustomBattleMtn: '0x8E61Df98aF05D88a6FdEee0b200FcBc403462ba1',
        CustomBattleData: '0x66b579eC6cC001d958Ea100e61f7F1edE8E27A8F',
        MedalClaim: '0x3B98E1645a989091deCA9078bE8600147A7Af4FE',
        token_contact_address: '0x08B71E17A9044ea1E46cb0fFCC4b401E6A6F4b02',
        treasury_address: '0xD43f70f6726E830ABf8a33da26d53aAA9266ca98', //(timelock controller)
        govenor: '0x66280A82a0A9d02d9519b37017390081335ce730',
        streamdrop_token_address: '0x53148F45189dDAefAE8F4209f8Ab02d5816A085F',
        light_angel_address: '0x224C0a4BA0b07ef53F29E8ba64Bc8009C79e2dA9',
        dark_angel_address: '',
        free_only_address: '',
        bronze_only_address: '',
        gitcoin_address: '0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6',
    },
    */



    default: {
        name: 'Polygon',
        network: '137',
        portis_network: 'matic',
        ABToken: '0x3d78b36F7746f05752d45Fb4f48dAcCaF107628e',
        Pets: '0xB340686da996b8B3d486b4D27E38E38500A9E926',
        ABArenaBattles: '0x9A1C755305c6fbf361B4856c9b6b6Bbfe3aCE738',
        ABBattleSupport: '0xAe772Ba3d0A96Ec0F4Bd973ff76C8EC0B9Ba0368',
        BattleMtnData: '0x70353b5E4D9Cde1D57fFAd8955322B31062688Fb',
        BattleMtnStructure: '0x43507B809aBB41c099934365ec3d25535983a1c9',
        VSBattle: '0x5C03061A3A45EFB2635b4Bf903Fd9A3C76b47845',
        ABStore: '0xE7bAc8fcdE6F2ABD4c51b0eC0E67Ac1C69778AEA',
        CustomBattleMtn: '0xE0455c0c2105088d8cae772096d20F24E7D38563',
        MedalClaim: '0x5f3476448F194D52bDD905eb42eD167c08276cab',
        token_contact_address: '0x3F0ED4324052196930bbEe42746C63A6cFfB5a20',
        light_angel_address: '0x16de1D8ed75F25Fc7189fA693D1B26125eEE2407',
        dark_angel_address: '0xB72F09aa80F97Dda4E2c02FAcde81d69D2ec725C',
        free_only_address: '0xb8C551b42b0f0ff64Cf799Bcd69EaAA4F162A0cD',
        bronze_only_address: '0xabCE332B5A053530a9F062a229941696E243A97E',
        treasury_address: '0xAD9027C60e997D8504dc55848818ebf9C2756277', //(timelock controller)
        govenor: '0xC5c65342C14c95A3c76442d10f2ffB8bbEd2EeaE',
        streamdrop_token_address: '0x2C8f094474226E410422020dB27387238B94F451',
        gitcoin_address: '0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6',
    },

};

// Update selected network if provided as a GET parameter
const params = new URLSearchParams(document.location.search);
if (params.get('network')) {
    localStorage.setItem(
        'network',
        networks[params.get('network')] ? params.get('network') : 'default'
    );
}

// Get selected network information
const selectedNetwork = localStorage.getItem('network') ?? 'default';
const contractInfo = networks[selectedNetwork] ?? networks['default'];

// Export addresses
export const REACT_APP_NETWORK = contractInfo['network'];
export const REACT_APP_NETWORK_NAME = contractInfo['name'];
export const REACT_APP_PORTIS_NETWORK = contractInfo['portis_network'];
export const carddata_contract_address = contractInfo['ABToken'];
export const pets_contract_address = contractInfo['Pets'];
export const skale_battle_address = contractInfo['ABArenaBattles'];
export const battle_support_address = contractInfo['ABBattleSupport'];
export const battle_mountain_address = contractInfo['BattleMtnData'];
export const battle_mountain_structure_address =
    contractInfo['BattleMtnStructure'];
export const vs_battle_address = contractInfo['VSBattle'];
export const store_contact_address = contractInfo['ABStore'];
export const custom_battle_mtn_address = contractInfo['CustomBattleMtn'];
export const medals_address = contractInfo['MedalClaim'];
export const token_contact_address = contractInfo['token_contact_address'];
export const lp_token_contact_address =
    contractInfo['lp_token_contact_address'];
export const sr_token_contact_address =
    contractInfo['sr_token_contact_address'];
export const streamdrop_address = contractInfo['streamdrop_token_address'];
export const light_angel_address = contractInfo['light_angel_address'];
export const dark_angel_address = contractInfo['dark_angel_address'];
export const bronze_only_address = contractInfo['bronze_only_address'];
export const free_only_address = contractInfo['free_only_address'];
export const treasury_address = contractInfo['treasury_address'];
export const gitcoin_address = contractInfo['gitcoin_address'];
