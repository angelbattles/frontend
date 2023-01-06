import {
    getCardDataContract,
    getStoreContract,
    getPetsContract,
    getSkaleBattleContract,
    getVSBattleContract,
    getSkaleBattleMtnContract,
    getTokenContract,
    getCustomBattleMtnContract,
    getMedalsContract,
    getStreamdropContract,
    getBattleMtnStructure,
    getCustomBattleMtnDataContract,
    getBattleSupportContract
} from './SolidityContracts.js';
import web3 from 'web3';
import {
    medals_address,
    pets_contract_address,
} from './SolidityContractsAddresses';

import CustomBattleMtnDataBytecode from './bytecodes/CustomBattleMtnDataBytecode';
import VsBattleBytecode from './bytecodes/VsBattleBytecode';



let allTokens = [];

async function getCurrentGasPrices() {
    let response = await fetch('https://gasstation-mainnet.matic.network/v2')
    let body = await response.json();
    return body;

}

// Return if main battle mountain
const isMainBattleMtn = (battleMtn) => {
    return +battleMtn.id === 0;
};

// Return the main or custom battle mountain data contract
const getCurrentBattleMtnDataContract = (battleMtn) => {
    return isMainBattleMtn(battleMtn)
        ? getSkaleBattleMtnContract(battleMtn.battleMtnAddress)
        : getCustomBattleMtnDataContract(battleMtn.battleMtnAddress);
};

// Return the main or custom battle mountain structure contract
// Note: the custom mountain data and structure are in the same contract
const getCurrentBattleMtnStructureContract = (battleMtn) => {
    return isMainBattleMtn(battleMtn)
        ? getBattleMtnStructure()
        : getCustomBattleMtnDataContract(battleMtn.battleMtnAddress); // Custom structure is within custom data contract
};

const getDefaultTransactionOptions = async () => {
    const options = {
        maxPriorityFeePerGas:
            localStorage.getItem('maxPriorityFeePerGas') ??
            web3.utils.toWei('30', 'gwei'),
        maxFeePerGas:
            localStorage.getItem('maxFeePerGas') ??
            web3.utils.toWei('31', 'gwei'),
        gas: 500000,
    };

    const prices = await getCurrentGasPrices();

    if (prices.standard.maxPriorityFee) {
        options.maxPriorityFeePerGas = web3.utils.toWei(parseInt(prices.standard.maxPriorityFee, 10).toString(), 'gwei')
    }
    if (prices.standard.maxFee) {
        options.maxFeePerGas = web3.utils.toWei(parseInt(prices.standard.maxFee, 10).toString(), 'gwei')
    }

    console.log(options)
    return options;
};

const defaultTransactionOptions = () => {

    const options = {
        maxPriorityFeePerGas:
            localStorage.getItem('maxPriorityFeePerGas') ??
            web3.utils.toWei('30', 'gwei'),
        maxFeePerGas:
            localStorage.getItem('maxFeePerGas') ??
            web3.utils.toWei('31', 'gwei'),
        gas: 500000
    }
    return options;
}


const getAllTokens = async (currentAddress, refresh = false) => {
    if (!currentAddress) {
        console.log('getAllTokens: address needed');
        return;
    }

    if (localStorage.getItem('cacheForABAccount') === currentAddress && refresh === false) {
        allTokens = JSON.parse(localStorage.getItem('allTokens'))
        console.log('returning cached tokens ', allTokens)
        return allTokens;
    }

    if (allTokens?.ownerTokens?.length > 1 && refresh === false) {
        console.log('returning')
        return allTokens
    }

    const carddata_contract = getCardDataContract();

    //First see how many tokens the address owns. We need to check the total supply because recycling pets will otherwise cause some to not show up.
    let numTokensOwned = await carddata_contract.methods
        .balanceOf(currentAddress)
        .call();

    console.log("Number of tokens owned for address", numTokensOwned)

    // Add burned tokens to total of numTokensOwned
    const burnedTokens = await carddata_contract.methods
        .balanceOf('0x000000000000000000000000000000000000dead')
        .call();
    numTokensOwned =
        (parseInt(numTokensOwned) || 0) + (parseInt(burnedTokens) || 0);

    //Find their token Ids.
    const tokenIds = await getTokenIds(
        numTokensOwned,
        currentAddress,
        carddata_contract
    );

    //Return the information about each owned token id.
    allTokens = await getTokenArray(tokenIds, currentAddress);
    if (localStorage.getItem('cacheForABAccount') === currentAddress) {
        localStorage.setItem('allTokens', JSON.stringify(allTokens))
    }
    return allTokens
};

const getTokenIds = async (
    numTokensOwned,
    currentAddress,
    carddata_contract
) => {
    const tokenIds = [];
    let i = 0;
    let id = 0

    do {
        id = await carddata_contract.methods
            .getABTokenByIndex(currentAddress, i)
            .call()
        // Check if id is a duplicate.
        // This could happen if a user sold a token and then bought it back
        if (!tokenIds.includes(id) && id !== "0") {
            console.log('Address has owned token id: ', id)
            tokenIds.push(id);
        }

        i = i + 1;

    }
    while (id !== "0")
    console.log('returning tokens ', tokenIds)

    return tokenIds;
};

const getABToken = async (tokenId) => {
    const carddata_contract = await getCardDataContract();
    const result = await carddata_contract.methods
        .getABToken(tokenId)
        .call();
    return result;

}

const getTokenArray = async (tokenIds, currentAddress) => {
    const carddata_contract = getCardDataContract();
    const battleArenaContract = getSkaleBattleContract();
    const ownerTokens = [];
    const ownerTokenIds = [];
    const invalidTokens = [];
    const unownedTokens = [];

    const getCardType = (card) => {
        if (card.cardSeriesId < 24) {
            return 'angel';
        } else if (card.cardSeriesId < 43) {
            return 'pet';
        } else if (card.cardSeriesId < 61) {
            return 'accessory';
        } else {
            return 'medal';
        }
    };

    for (var i = 0; i < tokenIds.length; i++) {
        let token;

        // TODO: Use a Promise.all to allow async fetching of data, might speed up loading
        if (tokenIds[i] !== undefined) {
            // Get ABToken
            token = await carddata_contract.methods
                .getABToken(tokenIds[i])
                .call()
                .catch(() => {
                    // Could not retrieve data
                    return {
                        invalid: true,
                    };
                });

            // Get meta info for the token
            if (!token.invalid) {
                const cardType = getCardType(token);
                if (cardType === 'pet') {
                    // Last Breeding Time
                    token.lastBreedingTime = await carddata_contract.methods
                        .getLastBreedingTime(tokenIds[i])
                        .call()
                        .catch(() => {
                            // Default timestamp to now so that it can't breed
                            // until we get the real last breeding time
                            return new Date().getTime() / 1000;
                        });

                    token.breedingCount = await carddata_contract.methods
                        .getBreedingCount(tokenIds[i])
                        .call()
                        .catch(() => {
                            // If we can't get the breeding count,
                            // then assume it can't be breed
                            return 5;
                        });

                    token.battleCooldown = await battleArenaContract.methods
                        .petBattleDelay()
                        .call()
                        .catch(() => {
                            // default to no cooldown
                            return 0;
                        });
                } else if (cardType === 'angel') {
                    token.battleCooldown = await battleArenaContract.methods
                        .getBattleCooldown(tokenIds[i])
                        .call()
                        .catch(() => {
                            // default to no cooldown
                            return 0;
                        });
                }
            } else {
                token = {
                    invalid: true,
                    message: `could not get ABToken token[${i}] : ` + token[i],
                };
            }
        } else {
            // Undefined token id provided
            token = {
                invalid: true,
                message: 'undefined token id ' + tokenIds[i],
            };
        }


        // Set the token id on the token
        if (token) {
            token.tokenId = tokenIds[i];
        }

        console.log('read token ', i, 'of ', tokenIds.length, '-', token)
        // result will be all tokens an address has EVER owned, so check if they currently own it.
        if (
            token &&
            !token.invalid &&
            token?.owner?.toUpperCase() === currentAddress.toUpperCase()
        ) {
            ownerTokens.push(token);
            ownerTokenIds.push(tokenIds[i]);
        } else if (token && token?.owner) {
            unownedTokens.push(token);
        } else if (token) {
            invalidTokens.push(token);
        }

        if (token === 0 && i !== 0) {
            break;
        } //break out of for loop if we have passed the users tokens.
    }

    return { ownerTokens, ownerTokenIds, invalidTokens, unownedTokens };
};

const cardOnBattleMtn = (tokenId, battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.cardOnBattleMtn(tokenId)
        .call()
        .catch((e) => {
            return undefined;
        });
};

//Function that takes in an old aura 0-5 and returns a new 3 component Aura.
const getAura = (oldAura) => {
    let auraBlue = 0;
    let auraYellow = 0;
    let auraRed = 0;

    if (oldAura === 0) {
        auraBlue = 1;
    } //blue aura
    if (oldAura === 1) {
        auraYellow = 1;
    } //yellow Aura
    if (oldAura === 2) {
        auraBlue = 1;
        auraRed = 1;
    } //purple Aura
    if (oldAura === 3) {
        auraYellow = 1;
        auraRed = 1;
    } //orange Aura
    if (oldAura === 4) {
        auraRed = 1;
    } //red Aura
    if (oldAura === 5) {
        auraBlue = 1;
        auraYellow = 1;
    } //green Aura

    return { auraRed, auraYellow, auraBlue };
};

//Function called on app load that grabs the current and main numbers of tokens from the chain.
const getAllTokenNumbers = async () => {
    let current = [];

    let carddata_contract = getCardDataContract();
    for (var i = 0; i < 73; i++) {
        try {
            current[i] = await carddata_contract.methods
                .currentTokenNumbers(i)
                .call();
        }
        catch {
            console.log('error getting token current numbers for token: ', i)
        }
    }

    return current;
};

const getCurrentTokenNumbers = async (tokenNumber) => {
    let carddata_contract = getCardDataContract();
    try {
        const num = await carddata_contract.methods
            .getCurrentTokenNumbers(tokenNumber)
            .call();
        return num;
    }
    catch {
        console.log('error getting numbers for token: ', tokenNumber)
        return -1
    }
};

const getPrices = async () => {
    let petContract = getPetsContract();
    let storeContract = getStoreContract();

    const breedingCost = await petContract.methods.breedingPrice().call();
    const bronzePackPrice = await storeContract.methods.bronzePrice().call();
    const silverPackPrice = await storeContract.methods.silverPrice().call();
    const goldPackPrice = await storeContract.methods.goldPrice().call();
    const ultimatePackPrice = await storeContract.methods
        .specialPackHaloPrice()
        .call();

    return {
        breedingCost,
        bronzePackPrice,
        silverPackPrice,
        goldPackPrice,
        ultimatePackPrice,
    };
};

const buyPack = async (pack, price, currentAddress) => {
    let packMethod = null;

    const options = await getDefaultTransactionOptions();
    options.value = price;
    options.from = currentAddress;
    console.log(options)

    switch (pack.name) {
        case 'free_pack':
            packMethod = getStoreContract().methods.getFreePack;
            break;
        case 'bronze_pack':
            packMethod = getStoreContract().methods.buyBronzePack;
            break;
        case 'silver_pack':
            packMethod = getStoreContract().methods.buySilverPack;
            break;
        case 'gold_pack':
            packMethod = getStoreContract().methods.buyGoldPack;
            break;
        default:
            console.log('invalid pack');
    }

    return packMethod
        ? packMethod().send(options)
        : Promise.reject(new Error('invalid pack'));
};



const commitToBuySpecialPack = (currentAddress, options) => {
    options.from = currentAddress;
    getStoreContract()
        .methods.commitToBuySpecialPack()
        .send(options);
}

const receiveSpecialPack = async (currentAddress, options) => {
    options.from = currentAddress;

    getStoreContract()
        .methods.receiveSpecialPack()
        .send(options);
}

const getStoreCommitStatus = (currentAddress) =>
    getStoreContract().methods.getCommitStatus(currentAddress).call();

const breedingDelay = () => getPetsContract().methods.breedingDelay().call();

const breedPets = (petId1, petId2, currentAddress, options) => {
    options.from = currentAddress;
    return getPetsContract()
        .methods.Breed(petId1, petId2)
        .send(options);
}

const retirePets = async (pets, currentAddress, options) => {
    options.from = currentAddress;
    return getPetsContract()
        .methods.retirePets(...pets)
        .send(options);
};

const isApprovedForAll = (currentAddress, approvalType) => {
    const approvalAddress =
        approvalType === 'medals' ? medals_address : pets_contract_address;

    return getCardDataContract()
        .methods.isApprovedForAll(currentAddress, approvalAddress)
        .call();
};

const giveApproval = (currentAddress, approvalType = 'pets', options) => {
    options.from = currentAddress;
    const approvalAddress =
        approvalType === 'medals' ? medals_address : pets_contract_address;
    return getCardDataContract()
        .methods.setApprovalForAll(approvalAddress, true)
        .send(options);
};

const rescindApproval = (currentAddress, approvalType, options) => {
    options.from = currentAddress;
    const approvalAddress =
        approvalType === 'medals' ? medals_address : pets_contract_address;
    return getCardDataContract()
        .methods.setApprovalForAll(approvalAddress, false)
        .send(options);
};

const setName = (currentAddress, tokenId, name, options) => {
    options.from = currentAddress;
    return getCardDataContract()
        .methods.setName(tokenId, name)
        .send(options);
}

const transferFrom = (currentAddress, destinationAddress, tokenId, options) => {
    options.from = currentAddress;
    return getCardDataContract()
        .methods.transferFrom(currentAddress, destinationAddress, tokenId)
        .send({ from: currentAddress });
}

const startBattle = (angelId, petId, accessoryId, arena, currentAddress, options) => {
    options.from = currentAddress;
    return getSkaleBattleContract()
        .methods.startBattle(angelId, petId, accessoryId, arena)
        .send(options);
}

const attackSpot = (
    fromSpot,
    attackGate,
    angelId,
    petId,
    accessoryId,
    vsBattleAddress,
    currentAddress,
    options
) => {
    console.log('attackSpot', {
        fromSpot,
        attackGate,
        angelId,
        petId,
        accessoryId,
    });
    options.from = currentAddress;
    options.gas = 800000;
    return getVSBattleContract(vsBattleAddress)
        .methods.attackSpot(fromSpot, attackGate, angelId, petId, accessoryId)
        .send(options);
};

const getTeamByPosition = (spot, battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.getTeamByPosition(spot)
        .call();
};

const setCardProhibitedStatus = (
    cardSeriesId,
    prohibited,
    battleMtnAddress,
    currentAddress,
    options
) => {

    options.from = currentAddress;
    return getCustomBattleMtnDataContract(battleMtnAddress)
        .methods.setCardProhibitedStatus(cardSeriesId, prohibited)
        .send(options);
};

const setPlayerAllowed = (playerAddress, battleMtnAddress, currentAddress, options) => {

    options.from = currentAddress;
    return getCustomBattleMtnDataContract(battleMtnAddress)
        .methods.setPlayerAllowed(playerAddress)
        .send(options);
};

const getCurrentConditions = (battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.getCurrentConditions()
        .call();
};

const changeConditions = (battleMtnAddress, currentAddress, options) => {
    options.from = currentAddress;
    return getSkaleBattleMtnContract(battleMtnAddress)
        .methods.changeConditions()
        .send(options);
};

const getCardProhibitedStatus = (cardSeriesId, battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.cardsProhibited(cardSeriesId)
        .call();
};

const getBattleIdForAddress = async (currentAddress) => {
    return await getSkaleBattleContract()
        .methods.getBattleIdForAddress(currentAddress)
        .call();
};

const getBattleResultsForCaller = (currentAddress) => {
    return getSkaleBattleContract()
        .methods.getBattleResultsForCaller(currentAddress)
        .call();
};

const getStaticMonsterStatsForCaller = (currentAddress) => {
    return getSkaleBattleContract()
        .methods.getStaticMonsterStatsForCaller(currentAddress)
        .call();
};

const getStaticAngelStatsForCaller = (currentAddress) => {
    return getSkaleBattleContract()
        .methods.getStaticAngelStatsForCaller(currentAddress)
        .call();
};

const getSmallAuraEffect = () => {
    return getBattleSupportContract()
        .methods.smallAuraEffect()
        .call();
};

const getBigAuraEffect = () => {
    return getBattleSupportContract()
        .methods.bigAuraEffect()
        .call();
};


const getStaticAngelTeamStatsForCaller = (currentAddress) => {
    return getSkaleBattleContract()
        .methods.getStaticAngelTeamStatsForCaller(currentAddress)
        .call();
};

// actions => attack, defend, run, auraBurst, summonPet
const doAction = (action, id, currentAddress, options) => {
    options.from = currentAddress;
    options.gas = 500000;

    return getSkaleBattleContract()
        .methods[action](id)
        .send(options);
};


const applyConditions = (
    angelId,
    petId,
    accessoryid,
    attacker,
    attackGate,
    battleMtn
) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.applyConditions(angelId, petId, accessoryid, attacker, attackGate)
        .call();
};

const checkBattleParameters = (
    angelId,
    petId,
    accessoryid,
    currentAddress
) => {
    return getSkaleBattleContract()
        .methods.checkBattleParameters(angelId, petId, accessoryid, currentAddress)
        .call();
};

const getDelayTime = (battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn).methods.delayTime.call();
};

const changeConditionsCommit = (battleMtn, currentAddress, options) => {
    if (!currentAddress) {
        console.log('changeConditionsCommit: address needed');
        return;
    }

    options.from = currentAddress;
    const battleMtnContract = getCurrentBattleMtnDataContract(battleMtn);

    return isMainBattleMtn(battleMtn)
        ? battleMtnContract.methods
            .changeConditionsCommit()
            .send(options)
        : battleMtnContract.methods
            .changeConditions()
            .send(options);
};

const changeConditionsReveal = (battleMtnAddress, currentAddress, options) => {
    if (!currentAddress) {
        console.log('changeConditionsReveal: address needed');
        return;
    }
    options.from = currentAddress;
    const battle_mtn_contract = getSkaleBattleMtnContract(battleMtnAddress);

    return battle_mtn_contract.methods
        .changeConditionsReveal()
        .send(options);
};

const getCommitStatus = (battleMtnAddress) => {
    return getSkaleBattleMtnContract(battleMtnAddress)
        .methods.getCommitStatus()
        .call();
};

const balanceOf = (currentAddress) => {
    if (!currentAddress) {
        console.log('balanceOf: address needed');
        return;
    }

    return getTokenContract().methods.balanceOf(currentAddress).call();
};


const isValidMove = (from, to, battleMtn) => {
    const mtnContract = getCurrentBattleMtnStructureContract(battleMtn);

    return isMainBattleMtn(battleMtn)
        ? mtnContract.methods
            .isValidMove(from, to, battleMtn.battleMtnAddress)
            .call()
        : mtnContract.methods.isValidMove(from, to).call();
};

const getOwnerBalance = (owner, battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.getOwnerBalance(owner)
        .call();
};

const claimOwnerBalance = async (owner, battleMtn) => {
    const options = await getDefaultTransactionOptions();
    options.from = owner;
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.claimOwnerBalance(owner)
        .send(options);
};

const getMountainBalance = async (battleMtn) => {
    return getCurrentBattleMtnDataContract(battleMtn)
        .methods.getPayoutInfo()
        .call();
};

const getStoreBalance = async () => {
    const storeContract = getStoreContract();
    return storeContract.methods.getStoreInfo().call();
};

const fundMountain = (currentAddress, options) => {

    options.from = currentAddress;
    const storeContract = getStoreContract();
    return storeContract.methods
        .withdrawEther()
        .send(options);
};


const createCustomBattleMtn = (options, currentAddress) => {
    if (!currentAddress) {
        console.log('createCustomBattleMtn: address needed');
        return;
    }
    options.from = currentAddress;
    options.gas = 7000000
    return getCustomBattleMtnDataContract()
        .deploy({
            data: CustomBattleMtnDataBytecode.object,
            argument: [],
        })
        .send(options);
};

const createVsBattle = (options, currentAddress) => {
    if (!currentAddress) {
        console.log('createVsBattle: address needed');
        return;
    }

    options.from = currentAddress;
    options.gas = 7000000
    return getVSBattleContract()
        .deploy({
            data: VsBattleBytecode.object,
            argument: [],
        })
        .send(options);
};

const getCustomBattleMtnCount = () => {
    return getCustomBattleMtnContract().methods.getCount().call();
};

const getBattleMountainByIndex = (id) => {
    return getCustomBattleMtnContract().methods.battleMtns(id).call();
};

const getPlayerMountainId = (idx, currentAddress) => {
    if (!currentAddress) {
        console.log('playerMtnCount: address needed');
        return;
    }

    return getCustomBattleMtnContract()
        .methods.playerMountainIds(currentAddress, idx)
        .call();
};

const getPlayerMountainCount = (currentAddress) => {
    if (!currentAddress) {
        console.log('playerMtnCount: address needed');
        return;
    }

    return getCustomBattleMtnContract()
        .methods.playerMtnCount(currentAddress)
        .call();
};

const initCustomBattleMtn = (
    title,
    description,
    customBattleMtnAddress,
    customVsBattleAddress,
    currentAddress
) => {
    if (!currentAddress) {
        console.log('initCustomBattleMtn: address needed');
        return;
    }
    const options = {}
    options.from = currentAddress;
    options.gas = 8000000

    return getCustomBattleMtnContract()
        .methods.initMountain(
            title,
            description,
            customBattleMtnAddress,
            customVsBattleAddress
        )
        .send(options);
};

const updateBattleMtnInfo = async (
    battleMtnId,
    title,
    description,
    currentAddress,
    options
) => {
    if (!currentAddress) {
        console.log('updateBattleMtnInfo: address needed');
        return;
    }
    options.from = currentAddress;

    return getCustomBattleMtnContract()
        .methods.updateInfo(battleMtnId, title, description, options)
        .send(options);
};

const claim1Ply = (card1, card2, card3, card4, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claim1Ply(card1, card2, card3, card4)
        .send(options);
};

const claim2Ply = (pet1, pet2, pet3, pet4, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claim2Ply(pet1, pet2, pet3, pet4)
        .send(options);
};

const claimCardboard = (angelId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimCardboard(angelId)
        .send(options);
};

const claimBronze = (pet1, pet2, pet3, pet4, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimBronze(pet1, pet2, pet3, pet4, options)
        .send(options);
};

const claimSilver = (card1, card2, card3, card4, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimSilver(card1, card2, card3, card4)
        .send(options);
};

const claimGold = (angelId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimGold(angelId)
        .send(options);
};

const claimPlatinum = (pet1, pet2, pet3, pet4, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimPlatinum(pet1, pet2, pet3, pet4)
        .send(options);
};

const claimStupidFluffyPink = (pet1, pet2, pet3, pet4, currentAddress, options) => {
    console.log('pink')
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimStupidFluffyPink(pet1, pet2, pet3, pet4)
        .send(options);
};

const claimOrichalcum = (angelId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimOrichalcum(angelId)
        .send(options);
};

const claimDiamond = (angelId, position, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimDiamond(angelId, position)
        .send(options);
};

const claimZeronium = (angelId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.claimZeronium(angelId)
        .send(options);
};

const onePlyClaimedAngel = (angelId) => {
    return getMedalsContract().methods.onePlyClaimedAngel(angelId).call();
};

const cardboardClaimedAngel = (angelId) => {
    return getMedalsContract().methods.cardboardClaimedAngel(angelId).call();
};

const silverClaimedAngel = (angelId) => {
    return getMedalsContract().methods.silverClaimedAngel(angelId).call();
};

const goldClaimedAngel = (angelId) => {
    return getMedalsContract().methods.goldClaimedAngel(angelId).call();
};

const diamondClaimedAngel = (angelId) => {
    return getMedalsContract().methods.diamondClaimedAngel(angelId).call();
};

const zeroniumClaimedAngel = (angelId) => {
    return getMedalsContract().methods.zeroniumClaimedAngel(angelId).call();
};

const mainClaimedPets = (petId) => {
    return getMedalsContract().methods.mainClaimedPets(petId).call();
};

const burnSimple = (
    onePlyId,
    twoPlyId,
    cardboardId,
    bronzeId,
    currentAddress,
    options
) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnSimple(onePlyId, twoPlyId, cardboardId, bronzeId)
        .send(options);
};

const burnSilver = (medalId, cardId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnSilver(medalId, cardId)
        .send(options);
};

const burnGold = (medalId, cardId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnGold(medalId, cardId)
        .send(options);
};

const burnPlatinum = (medalId, cardId, color, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnPlatinum(medalId, cardId, color)
        .send(options);
};

const burnStupidFluffyPink = (medalId, cardId, color, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnStupidFluffyPink(medalId, cardId, color)
        .send(options);
};

const burnOrichalcum = (medalId, cardId, color, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnOrichalcum(medalId, cardId, color)
        .send(options);
};

const burnDiamond = (medalId, cardId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnDiamond(medalId, cardId)
        .send(options);
};

const burnTitanium = (medalId, cardId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnTitanium(medalId, cardId)
        .send(options);
};

const burnZeronium = (medalId, cardId, currentAddress, options) => {
    options.from = currentAddress;
    return getMedalsContract()
        .methods.burnZeronium(medalId, cardId)
        .send(options);
};

// Stream Drop
const hasClaimed = (currentAddress) => {
    return getStreamdropContract().methods.hasClaimed(currentAddress).call();
};

const getClaimAmount = (currentAddress) => {
    return getStreamdropContract().methods.getClaimAmount(currentAddress).call();
};

const claimStream = (currentAddress, amount, proof, options) => {
    options.from = currentAddress;
    return getStreamdropContract()
        .methods.claimStream(currentAddress, amount, proof)
        .send(options);
};

const claimStreamForOtherAddress = (currentAddress, address, amount, proof, options) => {
    options.from = currentAddress;
    return getStreamdropContract()
        .methods.claimStreamForOtherAddress(address, amount, proof)
        .send(options);
};

const getStreamForAddress = (address) => {
    return getStreamdropContract().methods.streamForAddress(address).call();
};

const claimTokens = (address, currentAddress, options) => {
    options.from = currentAddress;
    return getStreamdropContract()
        .methods.claimTokens(address)
        .send(options);
};

const approveHalo = (to, currentAddress, options) => {
    options.from = currentAddress;
    return getTokenContract()
        .methods.approve(to, '100000000000000000000000')
        .send(options);
};

const rescindHaloApproval = (to, currentAddress, options) => {
    options.from = currentAddress;
    return getTokenContract()
        .methods.approve(to, 0)
        .send(options);
};

const allowance = (currentAddress, allowAddress) => {
    return getTokenContract()
        .methods.allowance(currentAddress, allowAddress)
        .call();
};

const getBestAngel = () => {
    const battleMtnContract = getSkaleBattleContract();

    return battleMtnContract.methods
        .getBestAngel()
        .call()
        .catch((e) => {
            return undefined;
        });
};

export {
    applyConditions,
    attackSpot,
    balanceOf,
    breedingDelay,
    breedPets,
    buyPack,
    cardOnBattleMtn,
    changeConditions,
    createCustomBattleMtn,
    createVsBattle,
    doAction,
    getAllTokens,
    getAura,
    checkBattleParameters,
    getBattleIdForAddress,
    getBattleMountainByIndex,
    getBattleResultsForCaller,
    getCardProhibitedStatus,
    getCurrentConditions,
    getAllTokenNumbers,
    getCustomBattleMtnCount,
    getStoreCommitStatus,
    commitToBuySpecialPack,
    receiveSpecialPack,
    getPlayerMountainId,
    getPlayerMountainCount,
    getPrices,
    getSkaleBattleMtnContract,
    getABToken,
    getStaticMonsterStatsForCaller,
    getStaticAngelStatsForCaller,
    getSmallAuraEffect,
    getBigAuraEffect,
    getStaticAngelTeamStatsForCaller,
    getTeamByPosition,
    getOwnerBalance,
    getMountainBalance,
    getStoreBalance,
    fundMountain,
    claimOwnerBalance,
    giveApproval,
    initCustomBattleMtn,
    getDelayTime,
    getCommitStatus,
    changeConditionsReveal,
    changeConditionsCommit,
    isApprovedForAll,
    isValidMove,
    rescindApproval,
    retirePets,
    setCardProhibitedStatus,
    setPlayerAllowed,
    setName,
    startBattle,
    transferFrom,
    updateBattleMtnInfo,
    getBestAngel,
    getCurrentTokenNumbers,
    // Token
    approveHalo,
    rescindHaloApproval,
    allowance,
    // Medals
    claim1Ply,
    claim2Ply,
    claimCardboard,
    claimBronze,
    claimSilver,
    claimGold,
    claimPlatinum,
    claimStupidFluffyPink,
    claimOrichalcum,
    claimDiamond,
    claimZeronium,
    onePlyClaimedAngel,
    cardboardClaimedAngel,
    silverClaimedAngel,
    goldClaimedAngel,
    diamondClaimedAngel,
    zeroniumClaimedAngel,
    mainClaimedPets,
    // Medal burning
    burnSimple,
    burnSilver,
    burnGold,
    burnPlatinum,
    burnStupidFluffyPink,
    burnOrichalcum,
    burnDiamond,
    burnTitanium,
    burnZeronium,
    defaultTransactionOptions,
    getDefaultTransactionOptions,
    // Stream Drop
    hasClaimed,
    getClaimAmount,
    claimStream,
    claimStreamForOtherAddress,
    getStreamForAddress,
    claimTokens,
};
