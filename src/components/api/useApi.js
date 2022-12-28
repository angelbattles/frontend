import { useMemo } from 'react';
import * as ContractUtils from '../web3/Utilities';

const useApi = (
  currentAddress,
  trackTransaction,
  trackTransactionHash,
  battleMountain
) => {
  const api = useMemo(() => {
    if (!currentAddress) {
      return null;
    }

    return {
      token: {
        balanceOf: (address) => ContractUtils.balanceOf(address),
        approveHalo: (to, options) =>
          trackTransaction(
            'approveHalo',
            ContractUtils.approveHalo(to, currentAddress, options)
          ),
        rescindHaloApproval: (to, options) =>
          ContractUtils.rescindHaloApproval(to, currentAddress, options),
        allowance: (allowAddress) =>
          ContractUtils.allowance(currentAddress, allowAddress),
      },
      streamDrop: {
        hasClaimed: (currentAddress) =>
          ContractUtils.hasClaimed(currentAddress),
        getClaimAmount: (currentAddress) =>
          ContractUtils.getClaimAmount(currentAddress),
        claimStream: (currentAddress, amount, proof, options) =>
          ContractUtils.claimStream(currentAddress, amount, proof, options),
        claimStreamForOtherAddress: (currentAddress, address, amount, proof, options) =>
          ContractUtils.claimStreamForOtherAddress(
            currentAddress,
            address,
            amount,
              proof, 
            options
          ),
        getStreamForAddress: (address) =>
          ContractUtils.getStreamForAddress(address),
        claimTokens: (address, options) =>
          ContractUtils.claimTokens(address, currentAddress, options),
      },
      medal: {
        claim1Ply: (card1, card2, card3, card4, options) =>
          ContractUtils.claim1Ply(card1, card2, card3, card4, currentAddress, options),
        claim2Ply: (pet1, pet2, pet3, pet4, options) =>
          ContractUtils.claim2Ply(pet1, pet2, pet3, pet4, currentAddress, options),
        claimCardboard: (angelId, options) =>
          ContractUtils.claimCardboard(angelId, currentAddress, options),
        claimBronze: (pet1, pet2, pet3, pet4, options) =>
          ContractUtils.claimBronze(pet1, pet2, pet3, pet4, currentAddress, options),
        claimSilver: (card1, card2, card3, card4, options) =>
          ContractUtils.claimSilver(card1, card2, card3, card4, currentAddress, options),
        claimGold: (angelId, options) =>
          ContractUtils.claimGold(angelId, currentAddress, options),
        claimPlatinum: (pet1, pet2, pet3, pet4, options) =>
          ContractUtils.claimPlatinum(pet1, pet2, pet3, pet4, currentAddress, options),
        claimPink: (pet1, pet2, pet3, pet4, options) =>
          ContractUtils.claimStupidFluffyPink(
            pet1,
            pet2,
            pet3,
            pet4,
            currentAddress, 
            options
          ),
        claimOrichalcum: (angelId, options) =>
          ContractUtils.claimOrichalcum(angelId, currentAddress, options),
        claimDiamond: (angelId, position, options) =>
          ContractUtils.claimDiamond(angelId, position, currentAddress, options),
        claimZeronium: (angelId, options) =>
          ContractUtils.claimZeronium(angelId, currentAddress, options),
        onePlyClaimedAngel: (angelId) =>
          ContractUtils.onePlyClaimedAngel(angelId),
        cardboardClaimedAngel: (angelId) =>
          ContractUtils.cardboardClaimedAngel(angelId),
        silverClaimedAngel: (angelId) =>
          ContractUtils.silverClaimedAngel(angelId),
        goldClaimedAngel: (angelId) => ContractUtils.goldClaimedAngel(angelId),
        diamondClaimedAngel: (angelId) =>
          ContractUtils.diamondClaimedAngel(angelId),
        zeroniumClaimedAngel: (angelId) =>
          ContractUtils.zeroniumClaimedAngel(angelId),
        mainClaimedPets: (petId) => ContractUtils.mainClaimedPets(petId),
        burnSimple: (onePlyId, twoPlyId, cardboardId, bronzeId, options) =>
          ContractUtils.burnSimple(
            onePlyId,
            twoPlyId,
            cardboardId,
            bronzeId,
              currentAddress,
            options
          ),
        burnSilver: (medalId, cardId, options) =>
          ContractUtils.burnSilver(medalId, cardId, currentAddress, options),
        burnGold: (medalId, cardId, options) =>
          ContractUtils.burnGold(medalId, cardId, currentAddress, options),
        burnPlatinum: (medalId, cardId, color, options) =>
          ContractUtils.burnPlatinum(medalId, cardId, color, currentAddress, options),
        burnStupidFluffyPink: (medalId, cardId, color, options) =>
          ContractUtils.burnStupidFluffyPink(
            medalId,
            cardId,
            color,
              currentAddress,
            options
          ),
        burnOrichalcum: (medalId, cardId, color, options) =>
          ContractUtils.burnOrichalcum(medalId, cardId, color, currentAddress, options),
        burnDiamond: (medalId, cardId, options) =>
          ContractUtils.burnDiamond(medalId, cardId, currentAddress, options),
        burnTitanium: (medalId, cardId, options) =>
          ContractUtils.burnTitanium(medalId, cardId, currentAddress, options),
        burnZeronium: (medalId, cardId, options) =>
          ContractUtils.burnZeronium(medalId, cardId, currentAddress, options),
      },
      cardData: {
        buyPack: (pack, price) =>
          trackTransaction(
            `buyPack_${pack.id}`,
            ContractUtils.buyPack(pack, price, currentAddress)
          ),
        getAllTokens: (refresh = false) =>
          trackTransaction(
            'getAllTokens',
            ContractUtils.getAllTokens(currentAddress, refresh)
          ),
        getPrices: () =>
          trackTransaction('getPrices', ContractUtils.getPrices()),
        getAllTokenNumbers: () => ContractUtils.getAllTokenNumbers(),
        getCurrentTokenNumbers: (tokenNumber) =>
          ContractUtils.getCurrentTokenNumbers(tokenNumber),
        giveApproval: (approvalType, options) =>
          trackTransaction(
            'approval',
            ContractUtils.giveApproval(currentAddress, approvalType, options)
          ),
        hasTransferApproval: (approvalType) =>
          ContractUtils.isApprovedForAll(currentAddress, approvalType),
        rescindApproval: (approvalType, options) =>
          trackTransaction(
            'approval',
            ContractUtils.rescindApproval(currentAddress, approvalType, options)
          ),
        setName: (tokenId, name, options) =>
          trackTransaction(
            'setName',
            ContractUtils.setName(currentAddress, tokenId, name, options)
          ),
        getStoreBalance: () => ContractUtils.getStoreBalance(),
        getStoreCommit: () =>
          ContractUtils.getStoreCommitStatus(currentAddress),
        commitToBuySpecialPack: (options) =>
          trackTransaction(
            'commitToBuySpecialPack',
            ContractUtils.commitToBuySpecialPack(currentAddress, options)
          ),
        receiveSpecialPack: (options) =>
            trackTransactionHash(
            'receiveSpecialPack',
            ContractUtils.receiveSpecialPack(currentAddress, options)
          ),
        fundMountain: (currentAddress, options) =>
          ContractUtils.fundMountain(currentAddress, options),
        transferFrom: (destinationAddress, tokenId, options) =>
          trackTransaction(
            `transferFrom_${tokenId}`,
            ContractUtils.transferFrom(
              currentAddress,
              destinationAddress,
                tokenId,
              options
            )
          ),
      },
      battle: {
        doAction: (action, id, options) =>
         ContractUtils.doAction(action, id, currentAddress, options),
        getBattleIdForAddress: () =>
          ContractUtils.getBattleIdForAddress(currentAddress),
        getBattleResultsForCaller: () =>
          ContractUtils.getBattleResultsForCaller(currentAddress),
        getStaticAngelTeamStatsForCaller: () =>
          ContractUtils.getStaticAngelTeamStatsForCaller(currentAddress),
        getStaticMonsterStatsForCaller: () =>
              ContractUtils.getStaticMonsterStatsForCaller(currentAddress),
          getStaticAngelStatsForCaller: () =>
              ContractUtils.getStaticAngelStatsForCaller(currentAddress),
          getSmallAuraEffect: () =>
              ContractUtils.getSmallAuraEffect(),
          getBigAuraEffect: () =>
              ContractUtils.getBigAuraEffect(),
          checkBattleParameters: (angelId, petId, accessoryId) => 
              ContractUtils.checkBattleParameters(angelId, petId, accessoryId, currentAddress),
        startBattle: (angelId, petId, accessoryId, arena, options) =>
          trackTransactionHash(
            'start_battle',
            ContractUtils.startBattle(
              angelId,
              petId,
              accessoryId,
              arena,
                currentAddress, 
              options
            )
          ),
      },
      battleMountain: {
        applyConditions: (angelId, petId, accessoryId, attacker, attackGate) =>
          ContractUtils.applyConditions(
            angelId,
            petId,
            accessoryId,
            attacker,
            attackGate,
            battleMountain.data
          ),
        getBestAngel: () => ContractUtils.getBestAngel(),
        cardOnBattleMtn: (tokenId) =>
          ContractUtils.cardOnBattleMtn(tokenId, battleMountain.data),
        getOwnerBalance: (owner) =>
          ContractUtils.getOwnerBalance(owner, battleMountain.data),
        getMountainBalance: () =>
          ContractUtils.getMountainBalance(battleMountain.data),
        claimOwnerBalance: (owner) =>
          ContractUtils.claimOwnerBalance(owner, battleMountain.data),
        changeConditionsCommit: (options) =>
          ContractUtils.changeConditionsCommit(
            battleMountain.data,
              currentAddress,
            options
          ),
        changeConditionsReveal: (options) =>
          ContractUtils.changeConditionsReveal(
            battleMountain.data.battleMtnAddress,
              currentAddress,
            options
          ),
        getDelayTime: () => ContractUtils.getDelayTime(battleMountain.data),
        getCommitStatus: () =>
          ContractUtils.getCommitStatus(battleMountain.data.battleMtnAddress),
        getCardProhibitedStatus: (cardSeriesId) =>
          ContractUtils.getCardProhibitedStatus(
            cardSeriesId,
            battleMountain.data
          ),
        getCurrentConditions: () =>
          ContractUtils.getCurrentConditions(battleMountain.data),
        getTeamByPosition: (spot) =>
          ContractUtils.getTeamByPosition(spot, battleMountain.data),
        setCardProhibitedStatus: (cardSeriesId, prohibited, options) =>
          trackTransactionHash(
            `setCardProhibitedStatus_${cardSeriesId}`,
            ContractUtils.setCardProhibitedStatus(
              cardSeriesId,
              prohibited,
              battleMountain.data.battleMtnAddress,
                currentAddress, 
              options
            )
          ),
        setPlayerAllowed: (playerAddress, options) =>
          ContractUtils.setPlayerAllowed(
            playerAddress,
            battleMountain.data.battleMtnAddress,
              currentAddress, 
            options
          ),
      },
      pets: {
        breedPets: (petId1, petId2, options) =>
          trackTransaction(
            'breedPets',
            ContractUtils.breedPets(petId1, petId2, currentAddress, options)
          ),
        getBreedingDelay: () =>
          trackTransaction('getBreedingDelay', ContractUtils.breedingDelay()),
        retirePets: (pets, options) =>
          trackTransaction(
            'retirePets',
            ContractUtils.retirePets(pets, currentAddress, options)
          ),
      },
      vsBattle: {
        attackSpot: (
          fromSpot,
          attackGate,
          angelId,
          petId,
          accessoryId,
          options
        ) =>
          ContractUtils.attackSpot(
            fromSpot,
            attackGate,
            angelId,
            petId,
            accessoryId,
            battleMountain.data.vsBattleAddress,
            currentAddress,
            options
          ),
        isValidMove: (from, to) => {
          return ContractUtils.isValidMove(from, to, battleMountain.data);
        },
      },
      customBattleMtn: {
        createCustomBattleMtn: (options) =>
          trackTransaction(
            'createCustomBattleMtn',
            ContractUtils.createCustomBattleMtn(options, currentAddress)
          ),
        createVsBattle: (options) =>
          trackTransaction(
            'createVsBattle',
            ContractUtils.createVsBattle(options, currentAddress)
          ),
        getBattleMountainByIndex: (idx) =>
          ContractUtils.getBattleMountainByIndex(idx),
        getCount: () => ContractUtils.getCustomBattleMtnCount(),
        getPlayerMountainCount: () =>
          ContractUtils.getPlayerMountainCount(currentAddress),
        getPlayerMountainIdByIndex: (idx) =>
          ContractUtils.getPlayerMountainId(idx, currentAddress),
        init: (
          title,
          description,
          customBattleMtnAddress,
          customVsBattleAddress
        ) =>
          trackTransaction(
            'initMtn',
            ContractUtils.initCustomBattleMtn(
              title,
              description,
              customBattleMtnAddress,
              customVsBattleAddress,
              currentAddress
            )
          ),
        updateBattleMtnInfo: (battleMtnId, title, description, options) =>
          trackTransaction(
            'updateBattleMtnInfo',
            ContractUtils.updateBattleMtnInfo(
              battleMtnId,
              title,
              description,
                currentAddress,
              options
            )
          ),
      },
    };
  }, [currentAddress, trackTransaction, trackTransactionHash, battleMountain]);

  return api;
};

export default useApi;
