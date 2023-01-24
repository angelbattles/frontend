import React, { useState, useEffect, useContext } from 'react';
import AppContext from '../contexts/AppContext';
import ABPackInfo from '../../config/abcpackInfo';
import ABPack from '../ABPack';
import ABPackReveal from '../ABPackReveal';
import HeaderSection from '../HeaderSection';

const HomeView = ({ refreshAllTokens, packPrices, mobile }) => {
  const [desktopPacks, setDesktopPacks] = useState([]);
  const [mobilePacks, setMobilePacks] = useState([]);
  const { connection } = useContext(AppContext);

  useEffect(() => {
    setMobilePacks(
      ABPackInfo.map((pack) => (
        <ABPack
          pack={pack}
          key={pack.title}
          refreshAllTokens={refreshAllTokens}
          packPrices={packPrices}
        />
      ))
    );

    setDesktopPacks(
      ABPackInfo.map((pack) => (
        <ABPackReveal
          pack={pack}
          key={pack.title}
          refreshAllTokens={refreshAllTokens}
          packPrices={packPrices}
        />
      ))
    );
  }, [connection, refreshAllTokens, packPrices]);

  return (
    <div>
      <div className="ui stackable grid ">
        <div className="ui raised segment">
          <div className="ui stackable grid">
            <div className="twelve wide column">
              <h3 className="ui dividing centered header">
                Welcome to Angel Battles 2.0
              </h3>
              <img
                className=" ui centered fluid image"
                src={`images/site/poster.png`}
                alt="AB Site Poster"
              />
            </div>
            <div className="four wide column">
              <p>
                Angel Battles is a decentralized application originally built on
                the Ethereum blockchain in 2018.{' '}
                <a href="https://www.angelbattles.com/historic">
                  Historic Site
                </a>{' '}
              </p>

              <p>
                {' '}
                Angel Battles 2 was launched in 2022{' '}
                <a href="https://mirror.xyz/angelbattles.eth/ogvMFDt5lu8afQAS5tUWaJvZv73FJguZmPIdlzoQoSw">
                  on Polygon
                </a>{' '}
                for scalability.
              </p>
              <p>
                Collect angel, pet, and accessory cards to train, breed, and
                battle your way to the top of Mt. Zion, the global leaderboard.{' '}
              </p>
              <p>
                {' '}
                100% of all Matic used to purchase card packs is donated to the
                <a href="https://polygonscan.com/address/0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6">
                  {' '}
                  Gitcoin Matching Fund{' '}
                </a>{' '}
              </p>
              <p>
                {' '}
                New? Check out the about section of this site or the{' '}
                <a href="https://mirror.xyz/angelbattles.eth/oHnN9ewan7H9TjZln5DSuEhN8AuUDFzLl7TMAEJlezQ">
                  {' '}
                  full guide{' '}
                </a>{' '}
                to get started{' '}
              </p>
              <p>
                The game fully open source and controlled by players. Logic is
                100% on chain, and the front end is available on IFPS at hash
                (coming soon) and at angelbattles.eth.{' '}
              </p>
              <p>
                Tuning of any game parameters can only be done by on chain votes
                of HALO token holders{' '}
              </p>
            </div>
          </div>
        </div>

        <HeaderSection title="Packs" />
        {mobile ? mobilePacks : desktopPacks}
      </div>
    </div>
  );
};

export default HomeView;
