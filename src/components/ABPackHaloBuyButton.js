import React, { useContext, useMemo, useState, useEffect } from 'react';
import AppContext from './contexts/AppContext';
import { REACT_APP_NETWORK_NAME } from './web3/SolidityContractsAddresses';
import { store_contact_address } from './web3/SolidityContractsAddresses';
import web3 from 'web3';
import { getDefaultTransactionOptions } from './web3/Utilities';

const ABPackHaloBuyButton = ({ refreshAllTokens, packPrices }) => {
    const { api, isTransactionPending, connection, getMinedTransactionReceipt } =
        useContext(AppContext);
    const isUserConnected = useMemo(
        () =>
            connection && connection.isValidNetwork && connection.hasCurrentAddress,
        [connection]
    );
    const [haloBalance, setHaloBalance] = useState(0);
    const ultimatePackPrice = useMemo(() => {
        if (!packPrices || !packPrices.ultimatePackPrice) {
            return 0;
        }

        return packPrices.ultimatePackPrice;
    }, [packPrices]);
    const [hasStoreApproval, setHasStoreApproval] = useState(0);
    const [currentCommit, setCurrentCommit] = useState(null);
    const [commitTimer, setCommitTimer] = useState(null);


    useEffect(() => {
        if (!api || !commitTimer) {
            return;
        }

        const updatedTimer = commitTimer - 1;
        setTimeout(() => setCommitTimer(updatedTimer), 1000);

        // At the end of timer, get current commit
        if (updatedTimer === 0) {
            api.cardData.getStoreCommit().then(function (result) {
                console.log('result of get store commit', result);
                setCurrentCommit(result);
            });
        }
    }, [api, commitTimer]);


    // Check if transfer approval given
    useEffect(() => {
        if (
            !api ||
            isTransactionPending('approval') ||
            !connection ||
            !connection.currentAddress
        ) {
            return;
        }

        api.token.balanceOf(connection.currentAddress).then(function (result) {
            setHaloBalance(parseInt(result, 10));
        });

        api.token
            .allowance(store_contact_address)
            .then((result) => {
                setHasStoreApproval(parseInt(result, 10));
            })
            .catch(() => setHasStoreApproval(null));

        // Check if user has already committed

        api.cardData.getStoreCommit().then(function (result) {
            setCurrentCommit(result);
        });
        //
    }, [api, isTransactionPending, connection]);

    const giveERC20Approval = async () => {
        const options = await getDefaultTransactionOptions()
        api.token
            .approveHalo(store_contact_address, options)
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

    const commitToBuySpecialPack = async () => {
        const options = await getDefaultTransactionOptions()
        api.cardData
            .commitToBuySpecialPack(options)
            .on('transactionHash', function (hash) {
                console.log(hash);
            })
            .on('confirmation', function (confirmationNumber, receipt) {
                //console.log(receipt);
            })
            .on('receipt', function (receipt) {
                // receipt example
                setCommitTimer(90);
                console.log(receipt);
            });
    };

    const revealSpecialPack = async () => {
        const options = await getDefaultTransactionOptions()
        api.cardData.receiveSpecialPack(options).on('transactionHash', function () {
            getMinedTransactionReceipt('receiveSpecialPack')
                .then(() => {
                    refreshAllTokens();
                })
                .catch(() => { });
        });
    };

    if (!packPrices || !packPrices.ultimatePackPrice) {
        return <button className="mini ui loading button">Loading</button>;
    }

    if (
        isTransactionPending('approval') ||
        isTransactionPending('buySpecialPack') ||
        currentCommit === null
    ) {
        return <button className="mini ui loading button">Loading</button>;
    }

    // Not connected button
    if (!isUserConnected) {
        return (
            <button className="ui button" onClick={connection.connectToModal}>
                Connect to {REACT_APP_NETWORK_NAME} Network
            </button>
        );
    }

    // Reveal button
    if (isTransactionPending('receiveSpecialPack')) {
        return (
            <div className="extra content">
                <button className="ui primary button">--Revealing Cards--</button>
            </div>
        );
    }

    if (currentCommit === true) {
        return (
            <div className="extra content">
                <button onClick={revealSpecialPack} className="ui primary button">
                    Reveal Cards
                </button>
            </div>
        );
    }

    // Approve Store button
    if (hasStoreApproval === 0) {
        if (isTransactionPending('approveHalo')) {
            return <button className="ui button">--Approving Store--</button>;
        }

        return (
            <button className="ui button" onClick={giveERC20Approval}>
                Approve Store
            </button>
        );
    }

    // Insufficient Halo Balance button
    if (haloBalance < ultimatePackPrice) {
        return (
            <button className="ui disabled button">Insufficient Halo Balance</button>
        );
    }

    // Commit button
    if (isTransactionPending('commitToBuySpecialPack')) {
        return (
            <div className="extra content">
                <button className="ui primary button">
                    --Committing {web3.utils.fromWei(ultimatePackPrice, 'ether')} Halo--
                </button>
            </div>
        );
    }

    // Start countdown timer to allow time to Chainlink VRF to set commit to true
    if (currentCommit === false && commitTimer === null) {
        setCommitTimer(90);
        // Return nothing, this component should be re-rendered so another button is displayed
        return null;
    }

    // Countdown timer
    if (currentCommit === false && commitTimer) {
        return (
            <div className="extra content">
                <button className="ui primary button">
                    Verifying commit ({commitTimer})
                </button>
            </div>
        );
    }

    if (currentCommit === false) {
        return (
            <div className="extra content">
                <button onClick={commitToBuySpecialPack} className="ui primary button">
                    Commit {web3.utils.fromWei(ultimatePackPrice, 'ether')} Halo
                </button>
            </div>
        );
    }

    return null;
};

export default ABPackHaloBuyButton;
