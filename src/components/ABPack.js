import React, { useState } from 'react';
import usePackPurchase from './hooks/usePackPurchase';
import ABPackBuyButton from './ABPackBuyButton';
import ABPackConfirmation from './ABPackConfirmation';

const ABPack = ({ pack, packPrices, refreshAllTokens }) => {
  const {
    getCardImage,
    buyPack,
    getPackPrice,
    getPackTicketPrice,
    getPackTicketPriceLabel,
  } = usePackPurchase({
    pack,
    refreshAllTokens,
    packPrices,
  });
  const [buyOptionsVisible, setBuyOptionsVisible] = useState(false);

  return (
    <>
      <div className="ui one cards">
        <div className="ui fluid raised stackable link card">
          <div className="image">
            <img src={`images/site/${pack.image}`} alt="card" />
          </div>
          <div className="content">
            <div className="pack-angel-section">
              <h4 className="ui sub header">{pack.angelsDescription}</h4>
              <div className="ui mini images">
                {pack.angels.map((cardId) => getCardImage(cardId))}
              </div>
            </div>

            <div className="pack-pet-section">
              <div className="ui section divider"></div>
              <h4 className="ui sub header">{pack.petsDescription}</h4>
              <div className="ui mini images">
                {pack.pets.map((cardId) => getCardImage(cardId))}
              </div>
            </div>

            {pack.accessories.length ? (
              <div className="pack-accessory-section">
                <div className="ui section divider"></div>
                <h4 className="ui sub header">{pack.accessoriesDescription}</h4>
                <div className="ui mini images">
                  {pack.accessories.map((cardId) => getCardImage(cardId))}
                </div>
              </div>
            ) : null}
          </div>

          <ABPackBuyButton
            {...{
              pack,
              packPrices,
              refreshAllTokens,
              setBuyOptionsVisible,
            }}
          />
        </div>
      </div>

      <ABPackConfirmation
        {...{
          pack,
          buyPack,
          getPackPrice,
          getPackTicketPrice,
          getPackTicketPriceLabel,
          setBuyOptionsVisible,
        }}
        visible={buyOptionsVisible}
      />
    </>
  );
};

export default ABPack;
