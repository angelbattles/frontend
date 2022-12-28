import React, { useContext, useEffect, useState } from 'react';
import HeaderSection from '../HeaderSection';
import BattleSelector from '../BattleSelector';
import BattleArenaView from './BattleArenaView';
import BattleResults from '../BattleResults';
import AppContext from '../contexts/AppContext';
import ABCardInfo from '../../config/abcardinfo';
import LoadingSpinner from '../LoadingSpinner';
import { skale_battle_address } from '../web3/SolidityContractsAddresses';

const BattlesView = ({ cards, refreshAllTokens }) => {
    const [inBattle, setInBattle] = useState('check_if_in_battle');
    const [angel, setAngel] = useState(null);
    const [pet, setPet] = useState(null);
    const [accessory, setAccessory] = useState(null);
    const [petId, setPetId] = useState(null);
    const [accessoryId, setAccessoryId] = useState(null);
    const [monster, setMonster] = useState(99);
    const [continueBattle, setContinueBattle] = useState(null);
    const [haloBalance, setHaloBalance] = useState(null);
    const [bestAngel, setBestAngel] = useState(0);
    const { api, isTransactionPending } = useContext(AppContext);

    // Check if already in a battle
    useEffect(() => {
        console.log(cards.ownerTokens)
        if (!api || !cards.ownerTokens) {
            return;
        }

        // Read the halo balance
        api.token.balanceOf(skale_battle_address).then(function (result) {
            setHaloBalance(result / 1000000000000000000);
        });

        api.battleMountain.getBestAngel().then((result) => {
            setBestAngel(result);
        });

        const getCard = (tokenId) => {
            // Check the owner tokens
            if (cards.ownerTokens) {
                const card = cards.ownerTokens.find(
                    (token) => token.tokenId === tokenId
                );

                if (card !== undefined) {
                    return card;
                }
            }

            // Token wasn't found in owners token, check unowned tokens
            if (cards.unownedTokens) {
                const card = cards.unownedTokens.find(
                    (token) => token.tokenId === tokenId
                );

                if (card !== undefined) {
                    return card;
                }
            }

            return null;
        };

        if (continueBattle == null) {
            api.battle
                .getBattleResultsForCaller()
                .then(function (result) {
                    console.log(result)
                    const resultStatus = +result.status;

                    // Continue previous battle if in progress
                    if (resultStatus > 0 && resultStatus <= 100) {
                        api.battle
                            .getStaticAngelTeamStatsForCaller()
                            .then(function (stats) {
                                const angelCard = getCard(stats.angelId);
                                const petCard = getCard(stats.petId);

                                // There is a chance that that not all cards where retrieved
                                // and the missing cards are in battle so there is a need to verify
                                // cards in battle have been returned
                                if (angelCard && petCard) {
                                    setAngel(ABCardInfo.cards[angelCard.cardSeriesId].name);
                                    setPet(ABCardInfo.cards[petCard.cardSeriesId].name);
                                    setAccessory(
                                        +stats.angelId !== 0 ? getCard(stats.accessoryId) : null
                                    );
                                    setContinueBattle(true);
                                    setInBattle('fighting');
                                } else {
                                    setContinueBattle(true);
                                    setInBattle('error_getting_card_info');
                                }
                            });
                    } else {
                        setContinueBattle(false);
                        setInBattle('selecting');
                    }
                })
                .catch((e) => {
                    // No battles for player, allow assembly of team
                    setContinueBattle(false);
                    setInBattle('selecting');
                });
        }
    }, [continueBattle, cards, api]);

    /*
     * @param angelName:string - Angel name
     * @param petName:string - Pet name
     * @param accessoryName:string|number - Accessory Name or 0
     */
    const onBattleStart = (angelName, petName, accessoryName, petId, accessoryId) => {
        setInBattle('fighting');
        setAngel(angelName); // Angel Name
        setPet(petName); // Pet Name
        setAccessory(accessoryName); // Accessory name or 0
        setPetId(petId);
        setAccessoryId(accessoryId);

    };

    const onBattleEnd = (monsterType, result) => {
        console.log('result in BattlesView', result);
        refreshAllTokens();

        if (result === '101') {
            setInBattle('won');
        }

        if (result === '102') {
            setInBattle('lost');
        }

        if (result === '103') {
            setInBattle('ran');
        }

        if (result === '104') {
            setInBattle('angelRan');
        }

        setMonster(parseInt(monsterType, 10));
    };

    // Wait until done checking if already in battle
    if (continueBattle == null || !cards.ownerTokens) {
        return <LoadingSpinner />;
    }

    // Check if tokens are loading
    if (inBattle === 'selecting' && isTransactionPending('getAllTokens')) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            {inBattle === 'error_getting_card_info' && (
                <div className="ui red message">
                    There was a problem retrieving the battle in progress. We are aware of
                    the problem and working to resolve the issue. Please try again later.
                </div>
            )}

            {inBattle === 'selecting' && (
                <>
                    <div>
                        <HeaderSection title="Battle Arenas" />
                        <div className="ui raised segment">
                            <p>
                                Angel Battles 1 on mainnet had battles that needed to complete
                                in a single tx. Despite this cost, players still did over 6,700
                                battles{' '}
                            </p>

                            <p>
                                {' '}
                                Angel Battles 2 on Polygon has much richer multi-round battles,
                                with healing, aura powers, medal boosts, multiple players, etc.{' '}
                            </p>
                            <p>
                                <a href="https://mirror.xyz/angelbattles.eth/4NEY19VlqeKwlsFrlb7PyH84ATUJzwHRdmCIhi4wt60">
                                    {' '}
                                    Full Battles Guide{' '}
                                </a>
                            </p>
                            <p>
                                Winning a battle (except with Berakiel) will pay out 1% of the
                                Halo Tokens in the battle contract. Tokens are streamed over 5
                                years, claim the current amount from the Account page.
                            </p>
                            {haloBalance !== null ? (
                                <p>
                                    <b>Arena Battles Halo Balance: </b>
                                    {haloBalance.toFixed(2)}
                                </p>
                            ) : (
                                <p>Halo Balance Loading</p>
                            )}
                            <p>
                                <b>Aproximate Rewards Per Battle: </b>
                                {(haloBalance / 100).toFixed(4)}
                            </p>
                        </div>
                    </div>

                    <div className="ui raised segment">
                        <p>
                            {' '}
                            Angels have a cooldown to rest before they battle again to
                            increase competitiveness. The strongest angel in the game can
                            battle every 24 hours. Angels within 30 exp can battle every 8
                            hours, those within 100 exp can battle every 4 hours, those within
                            200 exp can battle every hour, and those at least 300 exp away can
                            battle without delay.
                        </p>
               

                        <b>Current Best Angel Experience: {bestAngel}</b>
                    </div>
                    <BattleSelector
                        cards={cards}
                        onBattleStart={onBattleStart}
                        setInBattle={setInBattle}
                    />
                </>
            )}

            {inBattle === 'waiting_for_opponent' && (
                <div>
                    <img
                        className=" ui centered fluid large image"
                        src={`images/battles/monsters/99.png`}
                        alt="loading"
                        style={styles.whiteBg}
                    />
                    <LoadingSpinner />
                </div>
            )}

            {inBattle === 'fighting' && (
                <BattleArenaView
                    angel={angel}
                    pet={pet}
                    accessory={accessory}
                    onBattleEnd={onBattleEnd}
                    refreshAllTokens={refreshAllTokens}
                    petId={petId}
                    accessoryId={accessoryId}
                />
            )}

            {(inBattle === 'won' ||
                inBattle === 'lost' ||
                inBattle === 'ran') && (
                    <BattleResults
                        status={inBattle}
                        angel={angel}
                        pet={pet}
                        accessory={accessory}
                        monsterType={monster}
                    />
                )}

            {!inBattle && <HeaderSection title="Previous Arenas" color="blue" />}

            {!inBattle && (
                <img
                    className="ui centered fluid image"
                    src={`images/legacy/WCMRoster.jpg`}
                    alt="Wimpy Cirrus Meadows Roster"
                />
            )}
        </div>
    );
};

const styles = {
    whiteBg: {
        backgroundColor: 'white',
    },
};

export default BattlesView;
