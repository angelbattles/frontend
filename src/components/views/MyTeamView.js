import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../LoadingSpinner';
import HeaderSection from '../HeaderSection';
import TokenTable from '../TokenTable';
import TransferInfo from '../TransferInfo';
import CardWarning from '../web3/CardWarning';
import TokenCards from '../TokenCards';

const MyTeamView = ({ cards, refreshAllTokens, toast }) => {
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('angels');
  const [mounted, setMounted] = useState(true);

  // Track unmount
  useEffect(() => {
    // clean up
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted && cards.ownerTokens) {
      setLoaded(true);
    }
  }, [cards, mounted]);

  return (
    <div>
      <HeaderSection title="My Team" />
      <div className="ui raised segment">
        <p>
          See a summary of all your cards with the table view, or choose to see
          details of one type.
              </p>
              <p>
                <b> Note: </b> This might take a while if you have a lot of cards (over 40 or so). You can open the console and read the 
                  logs to see the loading progress. 
              </p>

        <div className="ui compact menu">
          <div className="ui simple dropdown item">
            {view}
            <i className="dropdown icon" />
            <div className="menu">
              <div className="item" onClick={() => setView('table')}>
                Table (all)
              </div>
              <div className="item" onClick={() => setView('angels')}>
                Angels
              </div>
              <div className="item" onClick={() => setView('pets')}>
                Pets
              </div>
              <div className="item" onClick={() => setView('accessories')}>
                Accessories
              </div>
              <div className="item" onClick={() => setView('medals')}>
                Medals
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardWarning cards={cards} />

      <div className="ui divider" />
      <TransferInfo refreshAllTokens={refreshAllTokens} toast={toast} />
      {loaded === false ? (
        <LoadingSpinner />
      ) : (
        <div>
          {view === 'table' && <TokenTable cards={cards} />}
          {view !== 'table' && <TokenCards view={view} cards={cards} />}
        </div>
      )}
    </div>
  );
};

export default MyTeamView;
