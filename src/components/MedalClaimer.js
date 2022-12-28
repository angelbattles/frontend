import React, { useState, useEffect, useContext } from 'react';
import ABCardInfo from '../config/abcardinfo';
import TokenTable from './TokenTable';
import AppContext from './contexts/AppContext';
import './css/Extras.css';
import { getDefaultTransactionOptions } from './web3/Utilities';

const baseDropdown = [<option key={-10}> Loading and checking... </option>];

function MedalClaimer({ medal, cards }) {
    const { api } = useContext(AppContext);

    // The ids of the selected pet type
    const [selectedLizard, setSelectedLizard] = useState(-1);
    const [selectedAvian, setSelectedAvian] = useState(-1);
    const [selectedFeline, setSelectedFeline] = useState(-1);
    const [selectedEquine, setSelectedEquine] = useState(-1);

    const [selectedElemental, setSelectedElemental] = useState(-1);

    const [selectedAngel1, setSelectedAngel1] = useState(-1);
    const [selectedAngel2, setSelectedAngel2] = useState(-1);
    const [selectedAngel3, setSelectedAngel3] = useState(-1);
    const [selectedAngel4, setSelectedAngel4] = useState(-1);

    const [selectedCards, setSelectedCards] = useState({});
    // Returns a dropdown menu of only available pets

    const [lizardDropdown, setLizardDropdown] = useState(baseDropdown);
    const [avianDropdown, setAvianDropdown] = useState(baseDropdown);
    const [felineDropdown, setFelineDropdown] = useState(baseDropdown);
    const [equineDropdown, setEquineDropdown] = useState(baseDropdown);

    const [elementalDropdown, setElementalDropdown] = useState(baseDropdown);

    const [angel1Dropdown, setAngel1Dropdown] = useState(baseDropdown);
    const [angel2Dropdown, setAngel2Dropdown] = useState(baseDropdown);
    const [angel3Dropdown, setAngel3Dropdown] = useState(baseDropdown);
    const [angel4Dropdown, setAngel4Dropdown] = useState(baseDropdown);

    const getPetsDropdown = async (petSeriesId) => {
        const options = [
            <option key={-1} value="-1">
                Please select an eligible pet
            </option>,
        ];
        if (!cards) {
            return;
        }

        for (const card of cards) {
            if (card.cardSeriesId === petSeriesId.toString()) {
                let claimed = await api.medal.mainClaimedPets(card.tokenId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Id - {card.tokenId} Speed - {card.power}{' '}
                        </option>
                    );
                }
            }
        }
        if (options.length === 1) {
            options.push(
                <option key={-2} value="-2">
                    No valid pets found
                </option>
            );
        }

        return options;
    };

    // Returns a dropdown of all angels
    // as well as a filter for which medal
    const getAngelDropdown = async (filter) => {
        const options = [
            <option key={-1} value="-1">
                Please select an eligible angel
            </option>,
        ];

        if (!cards) {
            return;
        }

        for (const card of cards) {
            if (
                filter === '1ply' &&
                card.cardSeriesId < 24 &&
                card.cardSeriesId > 0
            ) {
                let claimed = await api.medal.onePlyClaimedAngel(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Power - {card.power}{' '}
                        </option>
                    );
                }
            }

            if (
                filter === 'red' &&
                ABCardInfo.cards[card.cardSeriesId].aura === 'red'
            ) {
                let claimed = await api.medal.silverClaimedAngel(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Power - {card.power}{' '}
                        </option>
                    );
                }
            }

            if (
                filter === 'green' &&
                ABCardInfo.cards[card.cardSeriesId].aura === 'green'
            ) {
                let claimed = await api.medal.silverClaimedAngel(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Power - {card.power}{' '}
                        </option>
                    );
                }
            }

            if (
                filter === 'purple' &&
                ABCardInfo.cards[card.cardSeriesId].aura === 'purple'
            ) {
                let claimed = await api.medal.silverClaimedAngel(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Power - {card.power}{' '}
                        </option>
                    );
                }
            }
            if (
                filter === 'yellow' &&
                ABCardInfo.cards[card.cardSeriesId].aura === 'yellow'
            ) {
                let claimed = await api.medal.silverClaimedAngel(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Power - {card.power}{' '}
                        </option>
                    );
                }
            }

            if (filter === 'cardboard' && card.experience > 350) {
                let claimed = await api.medal.cardboardClaimedAngel(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Power - {card.power}{' '}
                        </option>
                    );
                }
            }
        }

        if (options.length === 1) {
            options.push(
                <option key={-2} value="-2">
                    No valid angels found
                </option>
            );
        }

        return options;
    };

    // Returns a dropdown of all elementals
    // as well as a filter for which medal
    const getElementalDropdown = async () => {
        const options = [
            <option key={-1} value="-1">Please select an eligible elemental</option>,
        ];

        if (!cards) {
            return;
        }
        for (const card of cards) {
            if (
                card.cardSeriesId === "40" ||
                card.cardSeriesId === "41" ||
                card.cardSeriesId === "42"
            ) {
                let claimed = await api.medal.mainClaimedPets(card.cardSeriesId);
                if (!claimed) {
                    options.push(
                        <option key={card.tokenId} value={card.tokenId}>
                            Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                            {card.tokenId} Speed - {card.power}{' '}
                        </option>
                    );
                }
            }
        }

        if (options.length === 1) {
            options.push(
                <option key={-2} value="-2">
                    No valid elementals found
                </option>
            );
        }

        return options;
    };

    const claim1Ply = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .claim1Ply(selectedAngel1, selectedAngel2, selectedAngel3, selectedAngel4, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const claim2Ply = async () => {
        const options = await getDefaultTransactionOptions();

        api.medal
            .claim2Ply(selectedLizard, selectedAvian, selectedFeline, selectedEquine, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const claimCardboard = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal.claimCardboard(selectedAngel1, options).on('receipt', function (receipt) {
            console.log(receipt);
        });
    };

    const claimBronze = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .claimBronze(
                selectedLizard,
                selectedAvian,
                selectedFeline,
                selectedEquine,
                options
            )
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const claimSilver = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .claimSilver(
                selectedAngel1,
                selectedAngel2,
                selectedAngel3,
                selectedAngel4,
                options
            )
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const claimPlatinum = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .claimPlatinum(
                selectedLizard,
                selectedAvian,
                selectedFeline,
                selectedEquine,
                options
            )
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const claimStupidFluffyPink = async () => {
        const options = await getDefaultTransactionOptions();
        console.log('claiming...')
        api.medal
            .claimPink(
                selectedLizard,
                selectedAvian,
                selectedFeline,
                selectedEquine,
                options
            )
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const claimOrichalcum = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .claimOrichalcum(selectedElemental, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    //useEffect to clear selections if medal changes

    useEffect(() => {
        setSelectedAngel1(null);
        setSelectedAngel2(null);
        setSelectedAngel3(null);
        setSelectedAngel4(null);

        setSelectedLizard(null);
        setSelectedAvian(null);
        setSelectedEquine(null);
        setSelectedFeline(null);


        const getDropdowns = async () => {
            let dropdown;
            switch (medal) {
                case 0:
                    dropdown = await getAngelDropdown('1ply');
                    setAngel1Dropdown(dropdown);

                    dropdown = await getAngelDropdown('1ply');
                    setAngel2Dropdown(dropdown);

                    dropdown = await getAngelDropdown('1ply');
                    setAngel3Dropdown(dropdown);

                    dropdown = await getAngelDropdown('1ply');
                    setAngel4Dropdown(dropdown);
                    break;

                case 1:
                    dropdown = await getPetsDropdown(24);
                    setLizardDropdown(dropdown);

                    dropdown = await getPetsDropdown(25);
                    setAvianDropdown(dropdown);

                    dropdown = await getPetsDropdown(26);
                    setFelineDropdown(dropdown);

                    dropdown = await getPetsDropdown(27);
                    setEquineDropdown(dropdown);
                    break;

                case 2:
                    dropdown = await getAngelDropdown('cardboard');
                    setAngel1Dropdown(dropdown);
                    break;

                case 3:
                    dropdown = await getPetsDropdown(28);
                    setLizardDropdown(dropdown);

                    dropdown = await getPetsDropdown(29);
                    setAvianDropdown(dropdown);

                    dropdown = await getPetsDropdown(30);
                    setFelineDropdown(dropdown);

                    dropdown = await getPetsDropdown(31);
                    setEquineDropdown(dropdown);
                    break;
                case 4:
                    dropdown = await getAngelDropdown('red');
                    setAngel1Dropdown(dropdown);

                    dropdown = await getAngelDropdown('green');
                    setAngel2Dropdown(dropdown);

                    dropdown = await getAngelDropdown('purple');
                    setAngel3Dropdown(dropdown);

                    dropdown = await getAngelDropdown('yellow');
                    setAngel4Dropdown(dropdown);
                    break;

                case 6:
                    dropdown = await getPetsDropdown(32);
                    setLizardDropdown(dropdown);

                    dropdown = await getPetsDropdown(33);
                    setAvianDropdown(dropdown);

                    dropdown = await getPetsDropdown(34);
                    setFelineDropdown(dropdown);

                    dropdown = await getPetsDropdown(35);
                    setEquineDropdown(dropdown);

                    break;
                case 7:
                    dropdown = await getPetsDropdown(36);
                    setLizardDropdown(dropdown);

                    dropdown = await getPetsDropdown(37);
                    setAvianDropdown(dropdown);

                    dropdown = await getPetsDropdown(38);
                    setFelineDropdown(dropdown);

                    dropdown = await getPetsDropdown(39);
                    setEquineDropdown(dropdown);

                    break;
                case 8:
                    dropdown = await getElementalDropdown();
                    setElementalDropdown(dropdown);
                    break;
                default:
                    break;
            }

        }
        getDropdowns();
    }, [medal]);

    useEffect(() => {
        if (!cards) {
            return;
        }

        const tempSelectedCards = [];
        const tempSelectedIds = [];
        cards.forEach((card) => {
            if (card.tokenId === selectedAngel1) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedAngel2) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedAngel3) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedAngel4) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedLizard) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedAvian) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedFeline) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
            if (card.tokenId === selectedEquine) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
        });

        setSelectedCards({
            ownerTokens: tempSelectedCards,
            ownerTokenIds: tempSelectedIds,
        });
    }, [
        selectedAngel1,
        selectedAngel2,
        selectedAngel3,
        selectedAngel4,
        selectedLizard,
        selectedAvian,
        selectedEquine,
        selectedFeline,
    ]);

    return (
        <div>
            <div style={{ 'marginBottom': '2em' }}>
                The dropdowns will load the cards you have that pass the required criteria
                for each medal and filter out cards that have already claimed that medal.
                This may take some time if you have many cards of the required type.
            </div>
            {medal === 0 && (
                <div>
                    <span style={{ color: 'red' }}>
                        Note: Angels must be selected in order from lowest id to highest id
                        and you must select a different angel in each dropdown.{' '}
                    </span>
                    <div className="dropdown-container">
                        {' '}
                        Select First Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel1(e.target.value)}
                        >
                            {angel1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Second Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel2(e.target.value)}
                        >
                            {angel2Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Third Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel3(e.target.value)}
                        >
                            {angel3Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Fourth Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel4(e.target.value)}
                        >
                            {angel4Dropdown}
                        </select>
                        <div
                            style={{
                                margin: '2em',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {selectedAngel1 &&
                                selectedAngel2 &&
                                selectedAngel3 &&
                                selectedAngel4 &&
                                selectedAngel1 < selectedAngel2 &&
                                selectedAngel2 < selectedAngel3 &&
                                selectedAngel3 < selectedAngel4 ? (
                                <button onClick={claim1Ply} className="ui primary button">
                                    Claim 1 Ply Medal
                                </button>
                            ) : (
                                <button className="ui disabled button">Select Angels...</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {medal === 1 && (
                <div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Gecko:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedLizard(e.target.value)}
                        >
                            {lizardDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Parakeet:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAvian(e.target.value)}
                        >
                            {avianDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Cat:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedFeline(e.target.value)}
                        >
                            {felineDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Horse:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedEquine(e.target.value)}
                        >
                            {equineDropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedLizard &&
                            selectedAvian &&
                            selectedFeline &&
                            selectedEquine ? (
                            <button onClick={claim2Ply} className="ui primary button">
                                Claim 2 Ply Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">Select Pets...</button>
                        )}
                    </div>
                </div>
            )}
            {medal === 2 && (
                <div>
                    Select an angel with at least 350 experience who has not already
                    claimed this medal
                    <div className="dropdown-container">
                        {' '}
                        Select Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel1(e.target.value)}
                        >
                            {angel1Dropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedAngel1 ? (
                            <button onClick={claimCardboard} className="ui primary button">
                                Claim Cardboard Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">Select Angel</button>
                        )}
                    </div>
                </div>
            )}
            {medal === 3 && (
                <div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Komodo:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedLizard(e.target.value)}
                        >
                            {lizardDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Falcon:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAvian(e.target.value)}
                        >
                            {avianDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Bobcat:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedFeline(e.target.value)}
                        >
                            {felineDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Unicorn:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedEquine(e.target.value)}
                        >
                            {equineDropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedLizard &&
                            selectedAvian &&
                            selectedFeline &&
                            selectedEquine ? (
                            <button onClick={claimBronze} className="ui primary button">
                                Claim Bronze Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">Select Pets...</button>
                        )}
                    </div>
                </div>
            )}
            {medal === 4 && (
                <div>
                    <div className="dropdown-container">
                        {' '}
                        Select Red Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel1(e.target.value)}
                        >
                            {angel1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Green Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel2(e.target.value)}
                        >
                            {angel2Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Purple Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel3(e.target.value)}
                        >
                            {angel3Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Yellow Angel:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel4(e.target.value)}
                        >
                            {angel4Dropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedAngel1 &&
                            selectedAngel2 &&
                            selectedAngel3 &&
                            selectedAngel4 ? (
                            <button onClick={claimSilver} className="ui primary button">
                                Claim Silver Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">Select Angels...</button>
                        )}
                    </div>
                </div>
            )}
            {medal === 6 && (
                <div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Rock Dragon:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedLizard(e.target.value)}
                        >
                            {lizardDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select an Archaeopteryx:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAvian(e.target.value)}
                        >
                            {avianDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Sabertooth:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedFeline(e.target.value)}
                        >
                            {felineDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Pegasus:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedEquine(e.target.value)}
                        >
                            {equineDropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedLizard &&
                            selectedAvian &&
                            selectedFeline &&
                            selectedEquine ? (
                            <button onClick={claimPlatinum} className="ui primary button">
                                Claim Platinum Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">Select Pets...</button>
                        )}
                    </div>
                </div>
            )}
            {medal === 7 && (
                <div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Dire Dragon:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedLizard(e.target.value)}
                        >
                            {lizardDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Phoenix:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAvian(e.target.value)}
                        >
                            {avianDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select a Liger:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedFeline(e.target.value)}
                        >
                            {felineDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select an Alicorn:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedEquine(e.target.value)}
                        >
                            {equineDropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedLizard &&
                            selectedAvian &&
                            selectedFeline &&
                            selectedEquine ? (
                            <button
                                onClick={claimStupidFluffyPink}
                                className="ui primary button"
                            >
                                Claim Stupid Fluffy Pink Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">Select Pets...</button>
                        )}
                    </div>
                </div>
            )}
            {medal === 8 && (
                <div>
                    <div className="dropdown-container">
                        {' '}
                        Select Elemental:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedElemental(e.target.value)}
                        >
                            {elementalDropdown}
                        </select>
                    </div>
                    <div
                        style={{
                            margin: '2em',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        {selectedElemental ? (
                            <button onClick={claimOrichalcum} className="ui primary button">
                                Claim Orichalcum Medal
                            </button>
                        ) : (
                            <button className="ui disabled button">
                                Select Elemental...
                            </button>
                        )}
                    </div>
                </div>
            )}
            {selectedCards && (
                <TokenTable title={'Selected Cards'} cards={selectedCards} />
            )}
        </div>
    );
}
export default MedalClaimer;
