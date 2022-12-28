import React, { useContext, useState, useEffect } from 'react';
import HeaderSection from '../HeaderSection';
import AppContext from '../contexts/AppContext';
import { medalInfo } from '../../config/medalInfo';
import ABCard from '../ABCard';
import MedalClaimer from '../MedalClaimer';
import MedalBurner from '../MedalBurner';
import { getDefaultTransactionOptions } from '../web3/Utilities';

const MedalsView = ({ cards }) => {
    const { api, isTransactionPending } = useContext(AppContext);

    const [selectedMedal, setSelectedMedal] = useState(0);
    const [claiming, setClaiming] = useState(false);
    const [view, setView] = useState('claim');
    const [hasApproval, setHasApproval] = useState(false);
    const [medalNumbers, setMedalNumbers] = useState(0);

    // Check if approval transfer approval given
    useEffect(() => {
        if (!api || isTransactionPending('approval')) {
            return;
        }

        api.cardData
            .hasTransferApproval('medals')
            .then((result) => {
                setHasApproval(result);
            })
            .catch(() => setHasApproval(null));
    }, [api, isTransactionPending]);

    useEffect(() => {
        if (!api || selectedMedal === 0) {
            return;
        }

        api.cardData.getCurrentTokenNumbers(parseInt(selectedMedal, 10) + 61).then((result) => {
            setMedalNumbers(result);
        });
    }, [api, selectedMedal]);

    const giveApproval = async () => {
        const options = await getDefaultTransactionOptions();
        api.cardData
            .giveApproval('medals', options)
            .on('transactionHash', function (hash) {
                console.log(hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                //console.log(receipt);
            })
            .on('receipt', function (receipt) {
                // receipt example
                console.log(receipt);
            });
    };

    return (
        <div>
            <p>. </p>
            <p>. </p>
            <HeaderSection title="Medals" />
            <div className="ui raised segment">
                <p>
                    Medals in angel battles are NFTs that you can earn through special
                    achievements.{' '}
                </p>
                <p>
                    {' '}
                    They can be collected, and then burned in exchange for one time
                    permanent boosts to your existing cards{' '}
                </p>
                <p>
                    <a href="https://mirror.xyz/angelbattles.eth/4NEY19VlqeKwlsFrlb7PyH84ATUJzwHRdmCIhi4wt60">
                        {' '}
                        Full Medals Guide{' '}
                    </a>
                </p>
                {!hasApproval && (
                    <p>
                        {' '}
                        You need to give a one time approval to the medals contract before
                        you will be able to burn any medals{' '}
                    </p>
                )}
                <div>
                    <button
                        className="ui primary button"
                        onClick={() => setView('claim')}
                    >
                        Claim
                    </button>

                    {hasApproval ? (
                        <button
                            className="ui primary button"
                            onClick={() => setView('burn')}
                        >
                            Burn
                        </button>
                    ) : (
                        <button className="ui primary button" onClick={giveApproval}>
                            Approve Medals Contract
                        </button>
                    )}
                </div>
            </div>
            <div className="ui divider"></div>

            {view === 'claim' && (
                <div>
                    {' '}
                    <HeaderSection title="Claim" />
                    <div className="ui raised segment">
                        <div>
                            {' '}
                            Select a Medal:{' '}
                            <select
                                className="ui dropdown"
                                onChange={(e) => {
                                    setSelectedMedal(parseInt(e.target.value, 10))
                                    setMedalNumbers('loading...');
                                }}
                            >
                                <option value={0}>1 Ply Paper Towel </option>
                                <option value={1}>2 Ply Paper Towel </option>
                                <option value={2}>Cardboard </option>
                                <option value={3}>Bronze </option>
                                <option value={4}>Silver </option>
                                <option value={5}>Gold </option>
                                <option value={6}>Platinum</option>
                                <option value={7}>Stupid Fluffy Pink </option>
                                <option value={8}>Orichalcum </option>
                                <option value={9}>Diamond </option>
                                <option value={10}>Titanium </option>
                                <option value={11}>Zeronium </option>
                            </select>
                        </div>
                        <div className="ui grid">
                            <div className="twelve wide column" style={{ paddingTop: '2em' }}>
                                <div style={{ paddingTop: '1em' }}>
                                    <b>Medal Name: </b> {medalInfo[selectedMedal].name}{' '}
                                </div>
                                <div style={{ paddingTop: '1em' }}>
                                    <b>How To Earn: </b> {medalInfo[selectedMedal].earn}{' '}
                                </div>
                                <div style={{ paddingTop: '1em' }}>
                                    <b>Burn Effect: </b> {medalInfo[selectedMedal].burn}{' '}
                                </div>
                                <div style={{ paddingTop: '1em' }}>
                                    <b>Claiming Restrictions: </b>{' '}
                                    {medalInfo[selectedMedal].restrictions}{' '}
                                </div>
                                <div style={{ padding: '1em' }}>
                                    {selectedMedal === 5 ||
                                        selectedMedal === 9 ||
                                        selectedMedal === 11 ? (
                                        <div>
                                            Gold, Diamond and Zeronium Medals can be claimed directly
                                            from the main battle mountain.
                                        </div>
                                    ) : (
                                        <div>
                                            {!claiming ? (
                                                <button
                                                    className="ui blue button"
                                                    onClick={() => setClaiming(true)}
                                                >
                                                    Start Claim
                                                </button>
                                            ) : (
                                                <button
                                                    className="ui grey button"
                                                    onClick={() => setClaiming(false)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {claiming && (
                                    <MedalClaimer
                                        medal={selectedMedal}
                                        cards={cards.ownerTokens}
                                    />
                                )}
                            </div>
                            <div className="four wide column">
                                <ABCard
                                    cardId={parseInt(selectedMedal) + 61}
                                    view={'Home'}
                                    globalCardCount={medalNumbers}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {view === 'burn' && <MedalBurner cards={cards.ownerTokens} />}
        </div>
    );
};

export default MedalsView;
