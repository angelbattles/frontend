import React, { useState, useEffect, useContext } from 'react';
import ABCardInfo from '../config/abcardinfo';
import TokenTable from './TokenTable';
import AppContext from './contexts/AppContext';
import { getDefaultTransactionOptions } from './web3/Utilities';

const baseDropdown = [<option key={-10}> Loading and checking... </option>];

const colorDropdown = [
    <option key={null}> Select a Color</option>,
    <option key={1} value={1}> Red Aura </option>,
    <option key={2} value={2}> Blue Aura </option>,
    <option key={3} value={3}> Yellow Aura </option>,
];

function MedalBurner({ cards }) {
    const { api } = useContext(AppContext);

    const [medal, setMedal] = useState(-1);

    // The ids of the selected pet type
    const [selectedPet, setSelectedPet] = useState(null);
    const [selectedAngel, setSelectedAngel] = useState(null);

    const [selectedColor, setSelectedColor] = useState(null);

    const [selectedMedal1, setSelectedMedal1] = useState(null);
    const [selectedMedal2, setSelectedMedal2] = useState(null);
    const [selectedMedal3, setSelectedMedal3] = useState(null);
    const [selectedMedal4, setSelectedMedal4] = useState(null);

    const [selectedCards, setSelectedCards] = useState({});
    // Returns a dropdown menu of only available pets

    // TODO: Filter based on which have already claimed medals.

    const [angelDropdown, setAngelDropdown] = useState(baseDropdown);
    const [petDropdown, setPetDropdown] = useState(baseDropdown);

    const [medal1Dropdown, setMedal1Dropdown] = useState(baseDropdown);
    const [medal2Dropdown, setMedal2Dropdown] = useState(baseDropdown);
    const [medal3Dropdown, setMedal3Dropdown] = useState(baseDropdown);
    const [medal4Dropdown, setMedal4Dropdown] = useState(baseDropdown);

    const getMedalDropdown = async (medalSeriesId) => {
        const options = [
            <option key={null} value="-1">
                Please select an eligible medal
            </option>,
        ];
        if (!cards) {
            return;
        }

        for (const card of cards) {
            if (card.cardSeriesId === medalSeriesId.toString()) {
                options.push(
                    <option key={card.tokenId} value={card.tokenId}>
                        Id - {card.tokenId}
                    </option>
                );
            }
        }
        if (options.length === 1) {
            options.push(
                <option key={-2} value="-2">
                    No valid medals found
                </option>
            );
        }

        return options;
    };

    // Returns a dropdown of all angels
    const getAngelDropdown = async () => {
        const options = [
            <option key={null} value="-1">
                Please select an eligible angel
            </option>,
        ];

        if (!cards) {
            return;
        }

        for (const card of cards) {
            if (parseInt(card.cardSeriesId, 10) < 24) {
                options.push(
                    <option key={card.tokenId} value={card.tokenId}>
                        Name - {ABCardInfo.cards[card.cardSeriesId].name} Id -{' '}
                        {card.tokenId} Power - {card.power}{' '}
                    </option>
                );
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

    // Returns a dropdown of all pets
    const getPetDropdown = async () => {
        const options = [<option value="-1">Please select an eligible pet</option>];

        if (!cards) {
            return;
        }
        for (const card of cards) {
            if (parseInt(card.cardSeriesId, 10) > 23 && parseInt(card.cardSeriesId, 10) < 43) {
                options.push(
                    <option key={card.tokenId} value={card.tokenId}>
                        Name - {ABCardInfo.cards[card.cardSeriesId].name} Id - {card.tokenId}{' '}
                        Speed - {card.power}{' '}
                    </option>
                );
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

    const burnSimple = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnSimple(
                selectedMedal1,
                selectedMedal2,
                selectedMedal3,
                selectedMedal4,
                options
            )
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnSilver = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnSilver(selectedMedal1, selectedAngel, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnGold = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnGold(selectedMedal1, selectedAngel, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnPlatinum = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnPlatinum(selectedMedal1, selectedPet, selectedColor, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnStupidFluffyPink = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnStupidFluffyPink(selectedMedal1, selectedPet, selectedColor, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnOrichalcum = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnOrichalcum(selectedMedal1, selectedPet, selectedColor, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnDiamond = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnDiamond(selectedMedal1, selectedAngel, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnTitanium = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnTitanium(selectedMedal1, selectedPet, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    const burnZeronium = async () => {
        const options = await getDefaultTransactionOptions();
        api.medal
            .burnZeronium(selectedMedal1, selectedAngel, options)
            .on('receipt', function (receipt) {
                console.log(receipt);
            });
    };

    //useEffect to clear selections if medal changes

    useEffect(() => {

        const resetDropdowns = async () => {

            setSelectedMedal1(null);
            setSelectedMedal2(null);
            setSelectedMedal3(null);
            setSelectedMedal4(null);

            setSelectedAngel(-1);
            setSelectedPet(-1);
            setSelectedColor(-1);

            let dropdown;

            if (medal === 0) {
                dropdown = await getMedalDropdown(61);
                setMedal1Dropdown(dropdown);

                dropdown = await getMedalDropdown(62);
                setMedal2Dropdown(dropdown);

                dropdown = await getMedalDropdown(63);
                setMedal3Dropdown(dropdown);

                dropdown = await getMedalDropdown(64);
                setMedal4Dropdown(dropdown);
            } else {
                dropdown = await getMedalDropdown(parseInt(medal, 10) + 61);
                setMedal1Dropdown(dropdown);
            }

            dropdown = await getAngelDropdown();
            setAngelDropdown(dropdown);

            dropdown = await getPetDropdown();
            setPetDropdown(dropdown);

        }

        resetDropdowns();
    }, [medal]);

    useEffect(() => {
        if (!cards) {
            return;
        }

        const tempSelectedCards = [];
        const tempSelectedIds = [];
        cards.forEach((card) => {
            if (parseInt(card.cardSeriesId, 10) > 60) {
                tempSelectedCards.push(card);
                tempSelectedIds.push(card.tokenId);
            }
        });

        setSelectedCards({
            ownerTokens: tempSelectedCards,
            ownerTokenIds: tempSelectedIds,
        });
        console.log(selectedCards);
    }, [selectedMedal1, selectedMedal2, selectedMedal3, selectedMedal4]);

    return (
        <div>
            Burning medals gives permanent buffs to your other cards. Burning the
            first four medals together gives you one new accessory. Select a medal or
            combination of medals to see the effects of burning and choose which medal
            id you would like to burn.
            <div className="dropdown-container">
                <select onChange={(e) => setMedal(e.target.value)}>
                    <option key={-1} value={-1}>Select medal(s) to burn</option>
                    <option key={100} value={0}>First Four Medals Combined </option>
                    <option key={101} value={4}>Silver</option>
                    <option key={102} value={5}>Gold </option>
                    <option key={103} value={6}>Platinum</option>
                    <option key={104} value={7}>Stupid Fluffy Pink</option>
                    <option key={105} value={8}>Orichalcum</option>
                    <option key={106} value={9}>Diamond</option>
                    <option key={107} value={10}>Titanium</option>
                    <option key={108} value={11}>Zeronium</option>
                </select>
            </div>
            {medal === '0' && (
                <div className="dropdown-container">
                    Burning the first four medals together creates a new accessory.
                    <div className="dropdown-container">
                        {' '}
                        Select 1 Ply Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select 2 Ply Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal2(e.target.value)}
                        >
                            {medal2Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Cardboard Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal3(e.target.value)}
                        >
                            {medal3Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Bronze Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal4(e.target.value)}
                        >
                            {medal4Dropdown}
                        </select>
                        <div
                            style={{
                                margin: '2em',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            {selectedMedal1 &&
                                selectedMedal2 &&
                                selectedMedal3 &&
                                selectedMedal4 ? (
                                <button onClick={burnSimple} className="ui primary button">
                                    Burn First 4 Medals
                                </button>
                            ) : (
                                <button className="ui disabled button">Select medals</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {medal === '4' && (
                <div className="dropdown-container">
                    Burning a silver medal gives 5-10bp for one angel
                    <div className="dropdown-container">
                        {' '}
                        Select Silver Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Angel to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel(e.target.value)}
                        >
                            {angelDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel ? (
                        <button onClick={burnSilver} className="ui primary button">
                            Burn Silver Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal and angel
                        </button>
                    )}
                </div>
            )}
            {medal === '5' && (
                <div className="dropdown-container">
                    Burning a gold medal gives +50 exp to one angel
                    <div className="dropdown-container">
                        {' '}
                        Select Gold Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Angel to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel(e.target.value)}
                        >
                            {angelDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel ? (
                        <button onClick={burnGold} className="ui primary button">
                            Burn Gold Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal and angel
                        </button>
                    )}
                </div>
            )}
            {medal === '6' && (
                <div className="dropdown-container">
                    Burning a platinum medal gives +50 aura to one pet
                    <div className="dropdown-container">
                        {' '}
                        Select Platinum Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Pet to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedPet(e.target.value)}
                        >
                            {petDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Aura to Enhance:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedColor(e.target.value)}
                        >
                            {colorDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel && selectedColor ? (
                        <button onClick={burnPlatinum} className="ui primary button">
                            Burn Platinum Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal, pet, and aura
                        </button>
                    )}
                </div>
            )}
            {medal === '7' && (
                <div className="dropdown-container">
                    Burning a stupid fluffy pink medal gives +75 aura to one pet
                    <div className="dropdown-container">
                        {' '}
                        Select Pink Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>{' '}
                    <div className="dropdown-container">
                        {' '}
                        Select Pet to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedPet(e.target.value)}
                        >
                            {petDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Aura to Enhance:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedColor(e.target.value)}
                        >
                            {colorDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel && selectedColor ? (
                        <button onClick={burnStupidFluffyPink} className="ui primary button">
                            Burn Stupid Fluffy Pink Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal, pet, and aura
                        </button>
                    )}
                </div>
            )}
            {medal === '8' && (
                <div>
                    Burning an orichalcum medal gives + 100 aura to one pet.
                    <div className="dropdown-container">
                        {' '}
                        Select Orichalcum Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Pet to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedPet(e.target.value)}
                        >
                            {petDropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Aura to Enhance:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedColor(e.target.value)}
                        >
                            {colorDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel && selectedColor ? (
                        <button onClick={burnOrichalcum} className="ui primary button">
                            Burn Orichalcum Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal, pet, and aura
                        </button>
                    )}
                </div>
            )}
            {medal === '9' && (
                <div className="dropdown-container">
                    Burning a diamond medal gives + 200 exp to one angel
                    <div className="dropdown-container">
                        {' '}
                        Select Diamond Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Angel to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel(e.target.value)}
                        >
                            {angelDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel ? (
                        <button onClick={burnDiamond} className="ui primary button">
                            Burn Diamond Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal and angel
                        </button>
                    )}
                </div>
            )}
            {medal === '10' && (
                <div className="dropdown-container">
                    Burning a Titanium Medal tops up pet speed
                    <div className="dropdown-container">
                        Select Titanium Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div className="dropdown-container">
                        {' '}
                        Select Pet to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedPet(e.target.value)}
                        >
                            {petDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedPet ? (
                        <button onClick={burnTitanium} className="ui primary button">
                            Burn Titanium Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal and pet
                        </button>
                    )}
                </div>
            )}
            {medal === '11' && (
                <div className="dropdown-container">
                    Burning a Zeronium Medal gives plus 15-25 bp for one angel
                    <div className="dropdown-container">
                        Select Zeronium Medal:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedMedal1(e.target.value)}
                        >
                            {medal1Dropdown}
                        </select>
                    </div>
                    <div>
                        {' '}
                        Select Angel to Buff:{' '}
                        <select
                            className="ui dropdown"
                            onChange={(e) => setSelectedAngel(e.target.value)}
                        >
                            {angelDropdown}
                        </select>
                    </div>
                    {selectedMedal1 && selectedAngel ? (
                        <button onClick={burnZeronium} className="ui primary button">
                            Burn Zeronium Medal
                        </button>
                    ) : (
                        <button className="ui disabled button">
                            Select medal and angel
                        </button>
                    )}
                </div>
            )}
            <TokenTable title={'My Medals'} cards={selectedCards} />
        </div>
    );
}
export default MedalBurner;
