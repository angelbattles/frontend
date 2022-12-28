import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { HashRouter as Router, Link, Route, Switch } from 'react-router-dom';
import ConnectionContext from './components/contexts/ConnectionContext'; // TODO - remove when AppContext completed
import AppContext from './components/contexts/AppContext';
import { toast, ToastContainer } from 'react-toastify';
import HomeView from './components/views/HomeView';
import CardsView from './components/views/CardsView';
import BreedingView from './components/views/BreedingView';
import PasturesView from './components/views/PasturesView';
import MyTeamView from './components/views/MyTeamView.js';
import MedalsView from './components/views/MedalsView.js';
import LeaderboardView from './components/views/LeaderboardView';
import BattlesView from './components/views/BattlesView';
import DeployToolView from './components/views/DeployToolView';
import WalletMenuItem from './components/menu/WalletMenuItem';
import HaloMenuItem from './components/menu/HaloMenuItem';
import NewCardsModal from './components/NewCardsModal';
import NetworkNotification from './components/NetworkNotification';
import MyBattleMtnView from './components/views/MyBattleMtnView';
import AccountView from './components/views/AccountView';
import AboutView from './components/views/AboutView';
import FullSetView from './components/views/FullSetView';
import CardCountMenuItem from './components/menu/CardCountMenuItem';

const App = () => {
    const [mobile, setMobile] = useState(false);
    const [allCards, setAllCards] = useState({
        ownerTokens: null,
        ownerTokenIds: null,
    });
    const [globalCardCounts, setGlobalCardCounts] = useState(null);
    const [newCards, setNewCards] = useState(null);
    const [packPrices, setPackPrices] = useState(null);
    const [breedingCost, setBreedingCost] = useState(null);
    const { connection, api } = useContext(AppContext);
    const isUserConnected = useMemo(
        () =>
            connection && connection.isValidNetwork && connection.hasCurrentAddress,
        [connection]
    );
    const [refreshing, setRefreshing] = useState(true)

    // Initialize window size
    useEffect(() => {
        setMobile(window.innerWidth < 750);
    }, []);

    // Get the users latest tokens
    const refreshAllTokens = useCallback(() => {
        console.log('refresh');
        if (api) {
            api.cardData
                .getAllTokens()
                .then((result) => {
                    console.log(result);
                    const latestCards = result || { ownerTokens: [], ownerTokenIds: [] };

                    setAllCards((previousCards) => {
                        // Check if new cards added
                        if (previousCards.ownerTokens) {
                            prepareNewCards(previousCards, latestCards);
                        }

                        return latestCards;
                    });
                    setRefreshing(false)
                })
                .catch((e) => {
                    console.log('error getting all tokens: ', e);
                });

            api.cardData
                .getAllTokenNumbers()
                .then((data) => setGlobalCardCounts(data))
                .catch((e) => {
                    console.log('error getting getCurrentNumbers: ', e);
                });
        }
    }, [api]);

    // Get the users latest tokens
    const hardRefreshAllTokens = useCallback(() => {
        setRefreshing(true)
        console.log('refresh');
        if (api) {
            api.cardData
                .getAllTokens(true)
                .then((result) => {
                    console.log(result);
                    const latestCards = result || { ownerTokens: [], ownerTokenIds: [] };

                    setAllCards((previousCards) => {
                        // Check if new cards added
                        if (previousCards.ownerTokens) {
                            prepareNewCards(previousCards, latestCards);
                        }

                        return latestCards;
                    });
                    setRefreshing(false)
                })
                .catch((e) => {
                    console.log('error getting all tokens: ', e);
                });

            api.cardData
                .getAllTokenNumbers()
                .then((data) => setGlobalCardCounts(data))
                .catch((e) => {
                    console.log('error getting getCurrent token Numbers: ', e);
                });
        }
    }, [api]);


    // Initialize card prices
    useEffect(() => {
        if (api) {
            api.cardData
                .getPrices()
                .then((prices) => {
                    setBreedingCost(prices.breedingCost);
                    setPackPrices({
                        bronze: prices.bronzePackPrice,
                        silver: prices.silverPackPrice,
                        gold: prices.goldPackPrice,
                        ultimatePackPrice: prices.ultimatePackPrice,
                    });
                })
                .catch((e) => {
                    console.log('error getting prices: ', e);
                });

            refreshAllTokens();
        }
    }, [api, refreshAllTokens]);

    const prepareNewCards = (previousCards, latestCards) => {
        const newCards = {
            ownerTokens: [],
            ownerTokenIds: [],
        };

        latestCards.ownerTokenIds.forEach((latestCardId, idx) => {
            if (!previousCards.ownerTokenIds.includes(latestCardId)) {
                newCards.ownerTokens.push(latestCards.ownerTokens[idx]);
                newCards.ownerTokenIds.push(latestCards.ownerTokenIds[idx]);
            }
        });

        if (newCards.ownerTokens.length > 0) {
            setNewCards(newCards);
        }
    };

    return (
        <ConnectionContext.Provider value={connection}>
            <Router>
                <div className="ui container">
                    <div className="App">
                        {!mobile && (
                            <div className="ui nine item stackable menu">
                                <Link to="/" className="item" replace>
                                    <img src={`images/site/logo.png`} alt="logo" />
                                </Link>
                                <div className="ui simple dropdown item">
                                    Account
                                    <i className="dropdown icon"></i>
                                    <div className="menu">
                                        <Link to="/account" className="item" replace>
                                            Account
                                        </Link>
                                        <Link
                                            to={(location) => ({
                                                ...location,
                                                pathname: '/my-team',
                                                state: { lastClicked: new Date() },
                                            })}
                                            className="ui simple dropdown item"
                                            replace
                                        >
                                            My Team
                                        </Link>
                                        <Link to="/medals" className="item" replace>
                                            Medals
                                        </Link>
                                        <a
                                            className="item"
                                            href="https://www.tally.xyz/gov/eip155:137:0xC5c65342C14c95A3c76442d10f2ffB8bbEd2EeaE"
                                        >
                                            DAO Voting
                                        </a>
                                    </div>
                                </div>
                                <div className="ui simple dropdown item">
                                    Cards
                                    <i className="dropdown icon"></i>
                                    <div className="menu">
                                        <Link to="/cards" className="item" replace>
                                            View Types
                                        </Link>
                                        <Link to="/my-sets" className="item" replace>
                                            My Sets
                                        </Link>
                                        <a
                                            className="item"
                                            href="https://opensea.io/collection/angel-battles-2-token-v3"
                                        >
                                            Opensea
                                        </a>
                                    </div>
                                </div>

                                <div className="ui simple dropdown item">
                                    Stables
                                    <i className="dropdown icon"></i>
                                    <div className="menu">
                                        <Link to="/breeding" className="item" replace>
                                            Breeding
                                        </Link>
                                        <Link to="/pastures" className="item" replace>
                                            0x0 Pastures
                                        </Link>
                                    </div>
                                </div>
                                <div className="ui simple dropdown item">
                                    Battles
                                    <i className="dropdown icon"></i>
                                    <div className="menu">
                                        <Link
                                            to={(location) => ({
                                                ...location,
                                                pathname: '/battles',
                                                state: { lastClicked: new Date() },
                                            })}
                                            className="item"
                                            replace
                                        >
                                            Battle Arenas
                                        </Link>
                                        <Link
                                            to={(location) => ({
                                                ...location,
                                                pathname: '/leaderboard',
                                                state: { lastClicked: new Date() },
                                            })}
                                            className="item"
                                            replace
                                        >
                                            Leaderboards
                                        </Link>
                                        <Link
                                            to={(location) => ({
                                                ...location,
                                                pathname: '/my-battle-mountain',
                                                state: { lastClicked: new Date() },
                                            })}
                                            className="item"
                                            replace
                                        >
                                            My Battle Mountains
                                        </Link>
                                    </div>
                                </div>
                                <div className="ui simple dropdown item">
                                    Help
                                    <i className="dropdown icon"></i>
                                    <div className="menu">
                                        <a className="item" href=" https://discord.gg/u2xgWuQ">
                                            <i className="discord icon"></i>Discord (Chat)
                                        </a>
                                        <a
                                            className="item"
                                            href="https://mirror.xyz/angelbattles.eth/oHnN9ewan7H9TjZln5DSuEhN8AuUDFzLl7TMAEJlezQ"
                                        >
                                            Full Guide
                                        </a>
                                        <a
                                            className="item"
                                            href="https://mirror.xyz/angelbattles.eth/Ki1frolvICPBGnlFVLsrGvoZq_-FIPoqRI1knOP2O5w"
                                        >
                                            Troubleshooting
                                        </a>
                                        <Link
                                            to={(location) => ({
                                                ...location,
                                                pathname: '/about',
                                                state: { lastClicked: new Date() },
                                            })}
                                            className="item"
                                            replace
                                        >
                                            About
                                        </Link>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content">
                                        <HaloMenuItem />
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content">
                                        <CardCountMenuItem
                                            allCards={allCards}
                                            refreshAllTokens={hardRefreshAllTokens}
                                            refreshing={refreshing}
                                        />
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="content">
                                        <WalletMenuItem />
                                    </div>
                                </div>
                            </div>
                        )}
                        {mobile && (
                            <div className="ui grid">
                                <div className="sixteen wide column">
                                    <div className="ui left floated menu">
                                        <div className="ui simple dropdown item">
                                            &#9776;
                                            <div className="menu">
                                                <Link to="/" className="item" replace>
                                                    <img src={`images/site/logo.png`} alt="logo" />
                                                </Link>
                                                <div className="ui simple dropdown item">
                                                    Account
                                                    <Link
                                                        to="/my-team"
                                                        className="ui simple dropdown item"
                                                        replace
                                                    >
                                                        My Team
                                                    </Link>
                                                    <Link
                                                        to="/medals"
                                                        className="ui simple dropdown item"
                                                        replace
                                                    >
                                                        Medals
                                                    </Link>
                                                    <a
                                                        className="item"
                                                        href="https://www.tally.xyz/gov/eip155:137:0xC5c65342C14c95A3c76442d10f2ffB8bbEd2EeaE"
                                                    >
                                                        DAO Voting
                                                    </a>
                                                </div>
                                                <div className="ui simple dropdown item">
                                                    Cards
                                                    <i className="dropdown icon"></i>
                                                    <div className="menu">
                                                        <Link to="/cards" className="item" replace>
                                                            View Types
                                                        </Link>
                                                        <Link to="/my-sets" className="item" replace>
                                                            My Sets
                                                        </Link>
                                                        <a
                                                            className="item"
                                                            href="https://opensea.io/collection/angel-battles-2-token-v3"
                                                        >
                                                            Opensea
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className="ui simple dropdown item">
                                                    Stables
                                                    <div className="menu">
                                                        <Link to="/breeding" className="item" replace>
                                                            Breeding
                                                        </Link>
                                                        <Link to="/pastures" className="item" replace>
                                                            0x0 Pastures
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="ui simple dropdown item">
                                                    Battles
                                                    <div className="menu">
                                                        <Link to="/battles" className="item" replace>
                                                            Battle Arenas
                                                        </Link>
                                                        <Link to="/leaderboard" className="item" replace>
                                                            Leaderboards
                                                        </Link>
                                                    </div>
                                                </div>

                                                <div className="ui simple dropdown item">
                                                    Help
                                                    <div className="menu">
                                                        <a
                                                            className="item"
                                                            href=" https://discord.gg/u2xgWuQ"
                                                        >
                                                            <i className="discord icon"></i>Discord (Chat)
                                                        </a>
                                                        <a
                                                            className="item"
                                                            href="https://mirror.xyz/angelbattles.eth/oHnN9ewan7H9TjZln5DSuEhN8AuUDFzLl7TMAEJlezQ"
                                                        >
                                                            Full Guide
                                                        </a>
                                                        <a
                                                            className="item"
                                                            href="https://mirror.xyz/angelbattles.eth/Ki1frolvICPBGnlFVLsrGvoZq_-FIPoqRI1knOP2O5w"
                                                        >
                                                            Troubleshooting
                                                        </a>
                                                    </div>
                                                    <Link
                                                        to={(location) => ({
                                                            ...location,
                                                            pathname: '/about',
                                                            state: { lastClicked: new Date() },
                                                        })}
                                                        className="item"
                                                        replace
                                                    >
                                                        About
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mobile && <WalletMenuItem />}
                        {mobile && <HaloMenuItem />}
                        {mobile && <CardCountMenuItem allCards={allCards}
                            refreshAllTokens={hardRefreshAllTokens}
                            refreshing={refreshing} />}

                        <div className="ui divider"></div>

                        <Switch>
                            <Route
                                path="/my-team"
                                render={(props) =>
                                    isUserConnected ? (
                                        <MyTeamView
                                            cards={allCards}
                                            refreshAllTokens={refreshAllTokens}
                                            toast={toast}
                                            key={props.location.state?.lastClicked || 'direct_route'}
                                        />
                                    ) : (
                                        <NetworkNotification />
                                    )
                                }
                            />
                            <Route
                                path="/account"
                                render={(props) =>
                                    isUserConnected ? (
                                        <AccountView cards={allCards} />
                                    ) : (
                                        <NetworkNotification />
                                    )
                                }
                            />
                            <Route
                                path="/medals"
                                render={(props) =>
                                    isUserConnected ? (
                                        <MedalsView cards={allCards} />
                                    ) : (
                                        <NetworkNotification />
                                    )
                                }
                            />
                            <Route path="/cards">
                                <CardsView globalCardCounts={globalCardCounts} />
                            </Route>
                            <Route path="/breeding">
                                {isUserConnected ? (
                                    <BreedingView
                                        cards={allCards}
                                        breedingCost={breedingCost}
                                        refreshAllTokens={refreshAllTokens}
                                    />
                                ) : (
                                    <NetworkNotification />
                                )}
                            </Route>
                            <Route path="/pastures">
                                {isUserConnected ? (
                                    <PasturesView
                                        cards={allCards}
                                        refreshAllTokens={refreshAllTokens}
                                    />
                                ) : (
                                    <NetworkNotification />
                                )}
                            </Route>
                            <Route
                                path="/battles"
                                render={(props) =>
                                    isUserConnected ? (
                                        <BattlesView
                                            cards={allCards}
                                            key={props.location.state?.lastClicked || 'direct_route'}
                                            refreshAllTokens={refreshAllTokens}
                                        />
                                    ) : (
                                        <NetworkNotification />
                                    )
                                }
                            />
                            <Route
                                path="/leaderboard"
                                render={(props) =>
                                    isUserConnected ? (
                                        <LeaderboardView
                                            cards={allCards}
                                            key={props.location.state?.lastClicked || 'direct_route'}
                                            refreshAllTokens={refreshAllTokens}
                                        />
                                    ) : (
                                        <NetworkNotification />
                                    )
                                }
                            />
                            <Route
                                path="/my-battle-mountain"
                                render={(props) =>
                                    isUserConnected ? (
                                        <MyBattleMtnView
                                            key={props.location.state?.lastClicked || 'direct_route'}
                                        />
                                    ) : (
                                        <MyBattleMtnView />
                                    )
                                }
                            />
                            <Route path="/about">
                                <AboutView />
                            </Route>
                            <Route path="/my-sets">
                                <FullSetView cards={allCards} />
                            </Route>
                            <Route path="/deploy">
                                <DeployToolView />
                            </Route>
                            <Route path="/">
                                <HomeView
                                    refreshAllTokens={refreshAllTokens}
                                    packPrices={packPrices}
                                    mobile={mobile}
                                />
                            </Route>
                        </Switch>
                    </div>
                </div>
                <NewCardsModal newCards={newCards} setNewCards={setNewCards} />
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </Router>
        </ConnectionContext.Provider>
    );
};

export default App;
