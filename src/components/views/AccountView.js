import React, { useContext, useState, useEffect } from 'react';
import HeaderSection from '../HeaderSection';
import AppContext from '../contexts/AppContext';
import {getDefaultTransactionOptions} from '../web3/Utilities';
import web3 from 'web3';
import {
    pets_contract_address,
    vs_battle_address,
    skale_battle_address,
    store_contact_address,
    light_angel_address,
    dark_angel_address,
    treasury_address,
    free_only_address,
    bronze_only_address,
} from '../web3/SolidityContractsAddresses';
import StreamClaimer from '../StreamClaimer';
import config from '../../config/airdrop';
import airdropProof from '../../config/airdropProof';

const AccountView = () => {
    const { api, isTransactionPending, connection } = useContext(AppContext);
    const [storeBalance, setStoreBalance] = useState(0);
    //const [mountainBalance, setMountainBalance] = useState(0);
    const [hasMedalApproval, setHasMedalApproval] = useState(false);
    const [hasPet721Approval, setHasPet721Approval] = useState(false);
    const [hasPet20Approval, setHasPet20Approval] = useState(false);
    const [hasStoreApproval, setHasStoreApproval] = useState(false);
    const [haloBalance, setHaloBalance] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(
        '0x0000000000000000000000000000000000000001'
    );

    const [amount, setAmount] = useState(0);

    const [claimed, setClaimed] = useState(null);
    const [proof, setProof] = useState(null);
    const [stream, setStream] = useState(null);
    const [addressError, setAddressError] = useState(false);
    const [cacheEnabled, setCacheEnabled] = useState(false);

    const [claimAddress, setClaimAddress] = useState('');

    useEffect(() => {
        if (connection && connection.currentAddress) {
            console.log(connection.currentAddress);
            setCurrentAddress(connection.currentAddress);
        }
    }, [connection]);

    useEffect(() => {
        if (localStorage.getItem('cacheForABAccount') === currentAddress) {
            setCacheEnabled(true);
        }
    }, [currentAddress]);

    const enableCache = () => {
        setCacheEnabled(true);
        localStorage.setItem('cacheForABAccount', currentAddress);
    };

    const disableCache = () => {
        setCacheEnabled(false);
        localStorage.removeItem('cacheForABAccount');
    };

    // Check if transfer approval given
    useEffect(() => {
        if (!api || isTransactionPending('approval')) {
            return;
        }

        api.cardData
            .hasTransferApproval('medals')
            .then((result) => {
                setHasMedalApproval(result);
            })
            .catch(() => setHasMedalApproval(null));

        api.cardData
            .hasTransferApproval('pets')
            .then((result) => {
                setHasPet721Approval(result);
            })
            .catch(() => setHasPet721Approval(null));

        api.token
            .allowance(pets_contract_address)
            .then((result) => {
                console.log('pets approval', result);
                setHasPet20Approval(result);
            })
            .catch(() => setHasPet20Approval(null));

        api.token
            .allowance(store_contact_address)
            .then((result) => {
                console.log('store approval', result);
                setHasStoreApproval(result);
            })
            .catch(() => setHasStoreApproval(null));

        api.cardData.getStoreBalance().then((result) => setStoreBalance(result));

        api.token.balanceOf(connection.currentAddress).then(function (result) {
            setHaloBalance(result);
        });

        // api.battleMountain
        //  .getMountainBalance()
        // .then((result) => setMountainBalance(result.balance));
    }, [api, isTransactionPending, connection.currentAddress]);

    const claim = async () => {
        const options = await getDefaultTransactionOptions();
        // claim to current address if no claim to address specified
        if (claimAddress === '') {
            api.streamDrop.claimStream(
                currentAddress,
                // amount + '000000000000000000',
                amount,
                proof,
                options
            );
        }

        // Validate address
        else {
            console.log(claimAddress);
            if (web3.utils.isAddress(claimAddress.trim())) {
                setAddressError(false);
                const address = web3.utils.toChecksumAddress(claimAddress.trim());
                console.log(address);
                api.streamDrop.claimStreamForOtherAddress(
                    currentAddress,
                    address,
                    amount,
                    proof,
                    options
                );
            } else {
                setAddressError(true);
            }
        }
    };

    const giveApproval = async (type) => {
        const options = await getDefaultTransactionOptions();
        api.cardData
            .giveApproval(type, options)
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

    const rescindApproval = async (type) => {
        const options = await getDefaultTransactionOptions();
        api.cardData
            .rescindApproval(type, options)
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

    const giveERC20Approval = async (type) => {
        const options = await getDefaultTransactionOptions();
        const approvalAddress =
            type === 'pets' ? pets_contract_address : store_contact_address;

        api.token
            .approveHalo(approvalAddress, options)
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

    const rescindERC20Approval = async (type) => {
        const approvalAddress =
            type === 'pets' ? pets_contract_address : store_contact_address;
        const options = await getDefaultTransactionOptions();
        api.token
            .rescindHaloApproval(approvalAddress, options)
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

    const reviver = (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (value.dataType === 'Map') {
                return new Map(value.value);
            }
        }
        return value;
    };

    useEffect(() => {
        if (currentAddress === '0x0000000000000000000000000000000000000001') {
            return;
        }

        const allProof = JSON.parse(JSON.stringify(airdropProof), reviver);

        // If address is in airdrop
        if (currentAddress in config.airdrop) {
            // Return number of tokens available
            setAmount(config.airdrop[currentAddress]);
            setProof(allProof.get(currentAddress));
            console.log(allProof.get(currentAddress));
        } else {
            setAmount(0);
        }
    }, [currentAddress]);

    useEffect(() => {
        if (!api) {
            return;
        }
        // Check if the user has already claimed tokens
        api.streamDrop.hasClaimed(currentAddress).then(function (result) {
            console.log('claim result', result);
            setClaimed(result);
        });
    }, [api, currentAddress]);

    useEffect(() => {
        if (!api) {
            return;
        }
        // Get the values if the user has claimed
        api.streamDrop.getStreamForAddress(currentAddress).then(function (result) {
            setStream(result);
        });
    }, [api, currentAddress]);

    const fundMountain = async () => {
        const options = await getDefaultTransactionOptions();
        api.cardData
            .fundMountain(connection.currentAddress, options)
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

            <HeaderSection title="Account" />
            <div className="ui raised segment">
                <p>
                    This page contains various settings and actions that are applied
                    across the game.
                </p>
            </div>

            <HeaderSection title="Halo Tokens" />
            <div className="ui raised segment">
                <p>
                    <b> My Halo Balance: </b> {haloBalance} hWei or{' '}
                    {(haloBalance / 1000000000000000000).toFixed(2)} Halo
                </p>
                <p>
                    Read more about the{' '}
                    <a href="https://mirror.xyz/angelbattles.eth/QHap5gs8t-6RxjXJnGS2DDH7QuvHgzKVy1Qq_-SRguk">
                        Halo Token
                    </a>{' '}
                </p>

                <p>
                    {' '}
                    <b>HALO allocated in StreamDrop: </b>{' '}
                    {(amount / 1000000000000000000).toFixed(2)}{' '}
                </p>

                <p>
                    {' '}
                    You can claim your streamdrop to another address. For instance, if
                    your qualified address is a cold wallet and you wish to claim to a hot
                    wallet.
                </p>

                <p>
                    {' '}
                    Each address can only have one stream. If someone previously claimed a
                    stream to your address, you can claim your stream to a different
                    address.{' '}
                </p>
                {claimed === null && (
                    <p>
                        <b>Stream claimed BY address:</b> Loading...{' '}
                    </p>
                )}
                {claimed === false && (
                    <p>
                        <b>Stream already claimed BY address:</b> NO{' '}
                    </p>
                )}
                {claimed === true && (
                    <p>
                        <b>Stream already claimed BY address:</b> YES{' '}
                    </p>
                )}

                {stream === null && (
                    <p>
                        <b>Stream exists FOR address:</b> Loading...{' '}
                    </p>
                )}
                {parseInt(stream?.id, 10) === 0 && (
                    <p>
                        <b>Stream exists FOR address:</b> NO{' '}
                    </p>
                )}
                {parseInt(stream?.id, 10) > 0 && (
                    <p>
                        <b>Stream exists FOR address:</b> YES{' '}
                    </p>
                )}

                {claimed === false && amount > 0 && (
                    <div>
                        {parseInt(stream?.id, 10) > 0 ? (
                            <p>
                                {' '}
                                The signed in wallet already has a stream. Enter a <b>
                                    new
                                </b>{' '}
                                address to claim below{' '}
                            </p>
                        ) : (
                            <p> Leave blank to claim to the currently signed in wallet </p>
                        )}
                        <input
                            type="text"
                            value={claimAddress}
                            onChange={(e) => {
                                setClaimAddress(e.target.value);
                            }}
                        />
                        {addressError && (
                            <div style={{ color: 'red' }}>
                                There seems to be a problem with the entered address. Please try
                                again
                            </div>
                        )}
                        <button onClick={claim}>Claim Stream</button>
                    </div>
                )}
            </div>

            <HeaderSection title="Claim Streams" />
            <div className="ui raised segment">
                <p>
                    Halo token rewards are streamed to 5 VS Battle contracts and the Arena
                    Battles contract over 5 years. Rewards are also streamed to the
                    treasury over 10 years. Any player can transfer the accumulated
                    rewards from the stream contract to any of these contracts at any
                    time. The battle contracts then reward 1% of their current balance
                    when anyone wins a battle.
                </p>
                <select onChange={(e) => setSelectedAddress(e.target.value)}>
                    <option value={null}> Select a Stream </option>
                    <option value={vs_battle_address}> VS Battle Contract</option>
                    <option value={skale_battle_address}> Arena Battle Contract</option>
                    <option value={light_angel_address}> Light Angels Mountain</option>
                    <option value={dark_angel_address}> Dark Angels Mountain</option>
                    <option value={bronze_only_address}>
                        {' '}
                        Bronze Pack Only Mountain
                    </option>
                    <option value={free_only_address}> Free Card Only Mountain</option>
                    <option value={treasury_address}> Treasury </option>
                    {currentAddress !== '0x0000000000000000000000000000000000000001' && (
                        <option value={currentAddress}> My Address </option>
                    )}
                </select>
                {selectedAddress !== null && (
                    <StreamClaimer key={selectedAddress} claimAddress={selectedAddress} />
                )}
            </div>

            <div>
                {' '}
                <HeaderSection title="Approvals" />
                <div className="ui raised segment">
                    <p>
                        Certain functions within Angel Battles require you to allow some of
                        our open source contracts to manage all your AB tokens.
                    </p>
                    <p>
                        You can leave the approvals in place or rescind them during periods
                        where you do not need this functionality.
                    </p>
                    <table className="ui celled unstackable table">
                        <thead>
                            <tr>
                                <th>Contract</th>
                                <th>Reason Needed</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Medals Contract</td>
                                <td>Needed in order to burn medals</td>
                                <td>
                                    {' '}
                                    {hasMedalApproval ? (
                                        <button
                                            className="ui orange button"
                                            onClick={() => rescindApproval('medals')}
                                        >
                                            Rescind Approval
                                        </button>
                                    ) : (
                                        <button
                                            className="ui primary button"
                                            onClick={() => giveApproval('medals')}
                                        >
                                            Approve Medals Contract
                                        </button>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Store Contract (ERC20 Halo)</td>
                                <td>Needed to purchase the special pack</td>
                                <td>
                                    {' '}
                                    {hasStoreApproval > 0 ? (
                                        <div>
                                            {' '}
                                            <button
                                                className="ui orange button"
                                                onClick={() => rescindERC20Approval('store')}
                                            >
                                                Rescind Approval
                                            </button>{' '}
                                            Remaining in approval:{' '}
                                            {hasStoreApproval / 1000000000000000000}
                                        </div>
                                    ) : (
                                        <button
                                            className="ui primary button"
                                            onClick={() => giveERC20Approval('store')}
                                        >
                                            Approve Store Contract
                                        </button>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Pets Contract (ERC721 ABToken)</td>
                                <td>Needed in order to recycle pets</td>
                                <td>
                                    {' '}
                                    {hasPet721Approval ? (
                                        <button
                                            className="ui orange button"
                                            onClick={() => rescindApproval('pets')}
                                        >
                                            Rescind Approval
                                        </button>
                                    ) : (
                                        <button
                                            className="ui primary button"
                                            onClick={() => giveApproval('pets')}
                                        >
                                            Approve Pets Contract for ERC721
                                        </button>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td>Pets Contract (ERC20 Halo)</td>
                                <td>Needed in order to pay for breeding</td>
                                <td>
                                    {' '}
                                    {hasPet20Approval > 0 ? (
                                        <div>
                                            {' '}
                                            <button
                                                className="ui orange button"
                                                onClick={() => rescindERC20Approval('pets')}
                                            >
                                                Rescind Approval
                                            </button>
                                            Remaining in approval:{' '}
                                            {hasPet20Approval / 1000000000000000000}
                                        </div>
                                    ) : (
                                        <button
                                            className="ui primary button"
                                            onClick={() => giveERC20Approval('pets')}
                                        >
                                            Approve Pets Contract for ERC20
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="ui divider" />
                    <p>
                        {' '}
                        Certain functions can be called by any player at any time. The
                        optimal times to call them is part of the overall game theory of
                        Angel Battles{' '}
                    </p>
                    <p>
                        {' '}
                        Funds from pack purchases collect in the store contract until some
                        player transfers them to the{' '}
                        <a href="https://polygonscan.com/address/0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6">
                            gitcoin Matching Multisig
                        </a>{' '}
                    </p>
                    <p>
                        <b> Store Balance: </b> {storeBalance.balance} Matic Wei
                    </p>
                    <p>
                        {' '}
                        <b> Store Total Paid: </b> {storeBalance.totalSentValue} Matic Wei
                    </p>
                    <button className="ui primary button" onClick={fundMountain}>
                        Fund Gitcoin
                    </button>
                </div>
                <HeaderSection title="Use Local Storage Cache" />
                <div className="ui raised segment">
                    <p>
                        Your browser can store the values of your cards in local storage,
                        rather than reading from the chain each time.
                    </p>
                    <p>
                        {' '}
                        <b>PRO: </b> This will make loading your cards super fast.{' '}
                    </p>
                    <p>
                        {' '}
                        <b>CON: </b> Your browser will show some outdated values. For
                        istance, cooldown times, exp, etc. Also, if multiple family members
                        play on the same browser, only one of them can have caching on at a
                        time.{' '}
                    </p>

                    <p>
                        {' '}
                        It's generally recommended to keep caching off when you have a small
                        number of cards (say less than 20) and turn it on when you have more
                        cards. You can also open the console to see progress messages when
                        loading cards{' '}
                    </p>
                    <p>
                        {' '}
                        <b>NOTE: </b> Whether caching is on or not, you can always refresh
                        your current cards by hitting the refresh button on the top right{' '}
                    </p>

                    <p>
                        {cacheEnabled ? (
                            <button className="ui grey button" onClick={disableCache}>
                                Disable Caching
                            </button>
                        ) : (
                            <button className="ui green button" onClick={enableCache}>
                                Enable Caching
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountView;
