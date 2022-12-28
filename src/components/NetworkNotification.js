import React from 'react';
import HeaderSection from './HeaderSection';
import {REACT_APP_NETWORK_NAME} from "./web3/SolidityContractsAddresses";

const NetworkNotification = () => {
  return (
    <div>
      <div className="ui divider" />
      <HeaderSection title="Connect to network" />
      <div className="ui raised segment">
        <p>
          Angle Battles requires a connection to the {REACT_APP_NETWORK_NAME} network. Install
          MetaMask or Portis to connect to the {REACT_APP_NETWORK_NAME} network.
        </p>
      </div>
    </div>
  );
};

export default NetworkNotification;
