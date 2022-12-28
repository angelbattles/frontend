import React from 'react';
import abcardinfo from '../config/abcardinfo';

import { getCardDataContract } from './web3/SolidityContracts.js';

class MountainStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    var self = this;
    let skale_carddata_contract = getCardDataContract();
    skale_carddata_contract.methods
      .getABToken(this.props.Id)
      .call()
      .then((result) => {
        self.setState({ loading: false, result });
      });
  }

  render() {
    if (this.state.loading === true) {
      return <div>loading...</div>;
    } else
      return (
        <div>
          <span className="left floated">
            {' '}
            {abcardinfo.cards[this.state.result.cardSeriesId].name}{' '}
          </span>
          {this.state.result.cardSeriesId < 24 && (
            <span className="right floated">
              <i
                className="yellow bolt icon"
                title={
                  'Battle Power - The more battle power, the harder likely to attack'
                }
              >
                {' '}
              </i>{' '}
              {this.state.result.power}
              <i
                className="graduation cap icon"
                title={'Experience Points (EXP) - Additional hit points (HP)'}
              >
                {' '}
              </i>
              {this.state.result.experience || 0}
            </span>
          )}
          {this.state.result.cardSeriesId > 23 &&
            this.state.result.cardSeriesId < 43 && (
              <span className="right floated">
                <i
                  className="red fire icon"
                  title={'Red Aura - Attack Power'}
                ></i>{' '}
                {this.state.result.auraRed || 0}
                <i
                  className="blue tint icon"
                  title={'Blue Aura - Defense Power'}
                >
                  {' '}
                </i>{' '}
                {this.state.result.auraBlue || 0}
                <i
                  className="yellow sun icon"
                  title={'Yellow Aura - Speed/Luck'}
                >
                  {' '}
                </i>{' '}
                {this.state.result.auraYellow || 0}
                <i
                  className="yellow bolt icon"
                  title={
                    'Battle Power - The more battle power, the harder likely to attack'
                  }
                >
                  {' '}
                </i>{' '}
                {this.state.result.power}
              </span>
            )}
        </div>
      );
  }
}

export default MountainStats;
