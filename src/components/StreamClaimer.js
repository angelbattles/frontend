import React, { useContext, useState, useEffect } from 'react';
import AppContext from './contexts/AppContext';
import { getDefaultTransactionOptions } from './web3/Utilities';

const StreamClaimer = ({ claimAddress }) => {
  const { api } = useContext(AppContext);
  const [stream, setStream] = useState(null);
  const [claimAmount, setClaimAmount] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }
    // Get the values of the stream
    api.streamDrop.getStreamForAddress(claimAddress).then(function (result) {
      setStream(result);
      console.log(result);
    });

    api.streamDrop.getClaimAmount(claimAddress).then(function (result) {
      setClaimAmount(result);
      console.log(result);
    });
  }, [api, claimAddress]);

  const getHumanReadableDate = (raw) => {
    const timestamp = new Date(parseInt(raw * 1000, 10));
    var date =
      timestamp.getFullYear() +
      '-' +
      (timestamp.getMonth() + 1) +
      '-' +
      timestamp.getDate();
    var time =
      timestamp.getHours() +
      ':' +
      timestamp.getMinutes() +
      ':' +
      timestamp.getSeconds();
    return date + ' ' + time;
  };

  const claimTokens = async (address) => {
      console.log('claiming for ', claimAddress);
      const options = await getDefaultTransactionOptions();
    api.streamDrop.claimTokens(claimAddress, options);
  };

  return (
    <div>
      {stream && (
        <div>
          <table className="ui striped table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-label="Property">Address: </td>
                <td data-label="Value">{claimAddress}</td>
              </tr>
              <tr>
                <td data-label="Property">Balance Remaining: </td>
                <td data-label="Value">{stream.balance}</td>
              </tr>
              <tr>
                <td data-label="Property">Start Time:</td>
                <td data-label="Value">
                  {getHumanReadableDate(stream.startTime)}
                </td>
              </tr>
              <tr>
                <td data-label="Property">End Time:</td>
                <td data-label="Value">
                  {getHumanReadableDate(stream.endTime)}
                </td>
              </tr>
              <tr>
                <td data-label="Property">Rate: (HaloWei / second) </td>
                <td data-label="Value">
                  {stream.balance / (stream.endTime - stream.startTime)}
                </td>
              </tr>
              <tr>
                <td data-label="Property">Rate: (Halo / day) </td>
                <td data-label="Value">
                  {((stream.balance / (stream.endTime - stream.startTime)) *
                    24 *
                    60 *
                    60) /
                    1000000000000000000}
                </td>
              </tr>
              <tr>
                <td data-label="Property">Current Halo Wei Owed </td>
                <td data-label="Value">
                  {claimAmount !== null ? claimAmount : 'Loading'}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="ui divider" />
          {claimAmount !== null && (
            <button onClick={() => claimTokens(claimAddress)}>
              Claim {claimAmount / 1000000000000000000} Halo{' '}
            </button>
          )}
        </div>
      )}

      <div className="ui divider" />
    </div>
  );
};

export default StreamClaimer;

//(amount / 1000000000000000000).toFixed(2)
