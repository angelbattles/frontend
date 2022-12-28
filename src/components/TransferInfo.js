import React, { useState, useContext, useEffect } from 'react';
import { getCardDataContract } from './web3/SolidityContracts.js';
import ABCardInfo from '../config/abcardinfo.js';
import Stats from './Stats.js';
import AppContext from './contexts/AppContext';
import './css/site.css';
import Web3 from 'web3';
import { getDefaultTransactionOptions } from './web3/Utilities.js';

const TransferInfo = ({ refreshAllTokens, toast }) => {
  const [loading, setLoading] = useState(true);
  const [tokenId, setTokenId] = useState(0);
  const [value, setValue] = useState('');
  const [cardDataContract, setCardDataContract] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('');
  const [metadata, setMetadata] = useState();
  const [name, setName] = useState('');
  const [transfer, setTransfer] = useState('');
  const [isTransferValid, setIsTransferValid] = useState(true);
  const [currentNum, setCurrentNum] = useState('Loading...');
  const [mounted, setMounted] = useState(true);
  const { connection, api, isTransactionPending, getTransactionGroup } =
    useContext(AppContext);

  // Track unmount
  useEffect(() => {
    // clean up
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (
      connection &&
      connection.currentAddress &&
      connection.currentAddress !== currentAddress
    ) {
      setCurrentAddress(connection.currentAddress);
    }

    setCardDataContract(getCardDataContract());
  }, [api, connection, currentAddress]);

  const handleChange = (event) => {
    setValue(event.target.value);
    setMetadata();
    setLoading('Loading...');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTransferChange = (event) => {
    setTransfer(event.target.value.trim());
    setIsTransferValid(true);
  };

  const handleNameSubmit = async (event) => {
    event.preventDefault();
      const options = await getDefaultTransactionOptions();
    api.cardData.setName(tokenId, name, options).on('receipt', () => {
      if (mounted) {
        setName('');
        // refresh selected token
        getToken();
      }

      refreshAllTokens();
      toast.success('Token Renamed', { className: 'ab-toast-success' });
    });
  };

  const handleTransferSubmit = async (event) => {
    event.preventDefault();
      const options = await getDefaultTransactionOptions();
    const valid = Web3.utils.isAddress(transfer);
    setIsTransferValid(valid);

    if (valid) {
      api.cardData.transferFrom(transfer, tokenId, options).on('receipt', () => {
        refreshAllTokens();
        toast.success('Transfer Complete', { className: 'ab-toast-success' });
        // refresh selected token
        getToken();
      });
    }
  };

  const getToken = (event) => {
    if (event) {
      event.preventDefault();
    }

    setTokenId(value);

    getTokenInfo(value).then(function (result) {
      var today = new Date();
      var dateTime = getHumanReadableDate(today);
      var lastBattleTime = getHumanReadableDate(
        new Date(parseInt(result.lastBattleTime, 10) * 1000)
      );
      let tempMetadata = {
        read: dateTime,
        humanLastBattle: lastBattleTime,
        description: ABCardInfo.cards[result.cardSeriesId].description,
        external_url: 'https://www.angelbattles.com/',
        home_url: 'https://www.angelbattles.com/',
        image: ABCardInfo.cards[result.cardSeriesId].location,
        image_url: ABCardInfo.cards[result.cardSeriesId].location,
        name: ABCardInfo.cards[result.cardSeriesId].name,
        attributes: [
          {
            trait_type: 'cardSeriesId',
            value: result.cardSeriesId,
          },
          {
            trait_type: 'power',
            value: result.power,
          },
          {
            trait_type: 'auraRed',
            value: result.auraRed,
          },
          {
            trait_type: 'auraYellow',
            value: result.auraYellow,
          },
          {
            trait_type: 'auraBlue',
            value: result.auraBlue,
          },
          {
            trait_type: 'name',
            value: result.name,
          },
          {
            trait_type: 'experience',
            value: result.experience,
          },
          {
            trait_type: 'lastBattleTime',
            value: result.lastBattleTime,
          },
          {
            trait_type: 'owner',
            value: result.owner,
          },
        ],
        properties: [
          {
            key: 'cardSeriesId',
            value: result.cardSeriesId,
          },
          {
            key: 'power',
            value: result.power,
          },
          {
            key: 'auraRed',
            value: result.auraRed,
          },
          {
            key: 'auraYellow',
            value: result.auraYellow,
          },
          {
            key: 'auraBlue',
            value: result.auraBlue,
          },
          {
            key: 'name',
            value: result.name,
          },
          {
            key: 'experience',
            value: result.experience,
          },
          {
            key: 'lastBattleTime',
            value: result.lastBattleTime,
          },
          {
            key: 'owner',
            value: result.owner,
          },
        ],
      };
      setMetadata(tempMetadata);
        setLoading(false);

        getTokenNumber(result.cardSeriesId).then(function (result) {
            setCurrentNum(result);
    });

    
    });
  };

  const getHumanReadableDate = (timestamp) => {
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

  const getTokenInfo = async (tokenNum) => {
    return await cardDataContract.methods.getABToken(tokenNum).call();
  };

  const getTokenNumber = async (tokenNum) => {
    return await cardDataContract.methods
      .getCurrentTokenNumbers(tokenNum)
      .call();
  };

  const getPendingTransactionsView = () => {
    const transactionGroup = getTransactionGroup('transferFrom', 1);

    if (!transactionGroup.length) {
      return null;
    }

    return (
      <div>
        <strong>Pending Transfers</strong>

        {getTransactionGroup('transferFrom', 1).map((transaction) => (
          <div key={transaction.name}>
            <button type="button">
              <div className="ui mini active inline loader"></div>
            </button>{' '}
            {transaction.name.split('_')[1]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='one-em-padd'>
          <div className="raised ui segment">
              <h4> Enter a token Id for advanced management </h4>
        <form onSubmit={getToken}>
  <div>
            <input
              type="text"
              className="ui input"
              placeholder="Enter Token Id"
              value={value}
              onChange={handleChange}
                      />
                      </div>
    <div className = 'one-em-padd'>
          <button className="ui button" type="submit" value="Submit">
            Submit
                      </button>
                      </div>
        </form>

        {!loading && (
          <>
                      <div className="ui divider"> </div>
                      <div className='one-em-padd'>
            <div className="ui grid">
              <div className="six wide centered column">
                <img
                  className="ui centered image"
                  src={`${metadata.image}`}
                  alt="Card"
                />
              </div>
              <div className="eight wide centered column">
                <table className="ui striped table">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td data-label="Property">Card Series Name: </td>
                      <td data-label="Value">{metadata.name}</td>
                    </tr>
                    <tr>
                      <td data-label="Property">Description:</td>
                      <td data-label="Value">{metadata.description}</td>
                    </tr>
                    <tr>
                      <td data-label="Property">Card Id:</td>
                      <td data-label="Value">{tokenId}</td>
                    </tr>
                    <tr>
                      <td data-label="Property">Number in Existence:</td>
                      <td data-label="Value">{currentNum}</td>
                    </tr>
                    <tr>
                      <td data-label="Property">Name:</td>
                      <td data-label="Value">{metadata.attributes[5].value}</td>
                    </tr>
                    <tr>
                      <td data-label="Property">
                        Stats:{' '}
                        <i
                          className="bolt icon"
                          title={
                            'Battle Power - The more battle power, the harder likely to attack'
                          }
                        />{' '}
                      </td>
                      <td data-label="Value">
                        <Stats
                          seriesId={metadata.attributes[0].value}
                          power={metadata.attributes[1].value}
                          experience={metadata.attributes[6].value}
                          red={metadata.attributes[2].value}
                          yellow={metadata.attributes[3].value}
                          blue={metadata.attributes[4].value}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                {' '}
                <span style={{ fontWeight: 'bold' }}> Owner: </span>{' '}
                {metadata.attributes[8].value}{' '}
              </p>
              <p>
                <span style={{ fontWeight: 'bold' }}>
                  {' '}
                  Last Battle/Breed Time:{' '}
                </span>{' '}
                {metadata.attributes[7].value} or {metadata.humanLastBattle}{' '}
              </p>

              <p>
                IMPORTANT: Transfering a card is IRREVERSABLE. Make sure to
                double check the address!{' '}
              </p>
              <p>
                To burn a card, transfer it to the{' '}
                <a href="https://etherscan.io/address/0x000000000000000000000000000000000000dead">
                  {' '}
                  0xdead{' '}
                </a>{' '}
                address.{' '}
              </p>
              <p>
                Although the details of each card are public the folllowing
                transactions will fail if you aren't the owner.{' '}
              </p>
              {connection.currentAddress === metadata.attributes[8].value && (
                <table className="ui table">
                  <tbody>
                    <tr>
                      <td>
                        <form onSubmit={handleNameSubmit}>
                          <label>
                                                          Change Name:{'   '}
                            <input
                              type="text"
                              value={name}
                              onChange={handleNameChange}
                            />
                          </label>
                          {!isTransactionPending('setName') ? (
                            <input type="submit" value="Submit" />
                          ) : (
                                                              <button type="button" >
                              <div className="ui mini active inline loader"></div>
                            </button>
                          )}
                        </form>
                      </td>
                      <td>
                        <form onSubmit={handleTransferSubmit}>
                          <label>
                                                          Transfer:{'   '}
                            <input
                              type="text"
                              value={transfer}
                              onChange={handleTransferChange}
                            />
                          </label>
                          {!isTransactionPending('transferFrom') ? (
                                                          <input type="submit" value="Submit"  />
                          ) : (
                            <button type="button">
                              <div className="ui mini active inline loader"></div>
                            </button>
                          )}
                          {!isTransferValid && <div>Invalid address</div>}
                          {getPendingTransactionsView()}
                        </form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
                          </div>
                          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransferInfo;
