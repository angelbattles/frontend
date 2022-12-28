import React, { useContext, useState, useEffect } from 'react';
import AppContext from '../contexts/AppContext';

const HaloMenuItem = () => {
  const { connection, api } = useContext(AppContext);
  const [haloBalance, setHaloBalance] = useState('Loading');
  const [refreshing, setRefreshing] = useState(false);

  // Check if transfer approval given
  useEffect(() => {
    refreshHaloBalance();
  }, [connection, api]);

  const refreshHaloBalance = () => {
    setRefreshing(true);
    if (!api || !connection) {
      return;
    }

    api.token.balanceOf(connection.currentAddress).then(function (result) {
      setRefreshing(false);
      setHaloBalance(result / 1000000000000000000);
    });
  };

  if (refreshing) {
    return <div>loading...</div>;
  }

  if (!connection.provider) {
    return (
      <>
        <i className="icon">
          <img
            className="ui tiny image"
            alt="provider logo"
            src={'images/halo.png'}
          />
        </i>
        Not Connected
      </>
    );
  }

  return (
    <div className="hover-cursor" onClick={refreshHaloBalance}>
      <i className="icon">
        <img
          className="ui tiny image"
          alt="provider logo"
          src={'images/halo.png'}
        />
      </i>
      {haloBalance === 'Loading' ? 'Loading' : haloBalance.toFixed(2)}
    </div>
  );
};

export default HaloMenuItem;
