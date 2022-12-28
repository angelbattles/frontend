import React from 'react';

const ABPackConfirmation = ({
  visible,
  pack,
  buyPack,
  getPackPrice,
  getPackTicketPrice,
  getPackTicketPriceLabel,
  packTickets,
  setBuyOptionsVisible,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="ui dimmer modals page transition visible active ab-modal"
      onClick={() => setBuyOptionsVisible(false)}
    >
      <div className="ui active mini active modal">
        <div className="header">Purchase Pack: {pack.title}</div>
        <div className="content">
          <div className="ui two column center aligned divided grid">
            <div className="column">
              <button className="ui positive button" onClick={() => buyPack()}>
                <i className="coin icon">
                  <img
                    className="ui mini image"
                    alt="provider logo"
                    src="images/polygon.png"
                  />
                </i>
                {getPackPrice()}
              </button>
            </div>
            {packTickets &&
            getPackTicketPriceLabel() &&
            packTickets >= getPackTicketPrice() ? (
              <div className="column">
                <button
                  className="ui yellow button"
                  onClick={() => buyPack(false)}
                >
                  <i className="ticket icon"></i>
                  {getPackTicketPriceLabel()}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABPackConfirmation;
