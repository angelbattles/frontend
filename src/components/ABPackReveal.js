import React, { useState } from 'react';
import usePackPurchase from './hooks/usePackPurchase';
import ABPackBuyButton from './ABPackBuyButton';
import ABPackHaloBuyButton from './ABPackHaloBuyButton';
import ABPackConfirmation from './ABPackConfirmation';

const ABPackReveal = ({ pack, packPrices, packTickets, refreshAllTokens }) => {
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
    packTickets,
  });
  const [buyOptionsVisible, setBuyOptionsVisible] = useState(false);

  return (
    <>
      <div className="four wide column">
        <div className="ui fluid raised stackable link card">
          <div className="ui move reveal">
            <div className="visible content pack-reveal">
              <img
                src={`images/site/${pack.image}`}
                alt="card"
                className="pack-reveal-image"
              />
            </div>
            <div className="hidden content pack-reveal pack-reveal-info">
              <div>
                <h4 className="ui sub header">{pack.angelsDescription}</h4>
                <div className="ui mini images">
                  {pack.angels.map((cardId) => getCardImage(cardId))}
                </div>
              </div>

              <div>
                <div className="ui section divider"></div>
                <h4 className="ui sub header">{pack.petsDescription}</h4>
                <div className="ui mini images">
                  {pack.pets.map((cardId) => getCardImage(cardId))}
                </div>
              </div>

              {pack.accessories.length ? (
                <div>
                  <div className="ui section divider"></div>
                  <h4 className="ui sub header">
                    {pack.accessoriesDescription}
                  </h4>
                  <div className="ui mini images">
                    {pack.accessories.map((cardId) => getCardImage(cardId))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {pack.id !== 'special' ? (
            <ABPackBuyButton
              {...{
                pack,
                packTickets,
                packPrices,
                refreshAllTokens,
                setBuyOptionsVisible,
              }}
            />
          ) : (
            <ABPackHaloBuyButton
              {...{
                packPrices,
                refreshAllTokens,
              }}
            />
          )}
        </div>
      </div>

      <ABPackConfirmation
        {...{
          pack,
          buyPack,
          getPackPrice,
          getPackTicketPrice,
          getPackTicketPriceLabel,
          packTickets,
          setBuyOptionsVisible,
        }}
        visible={buyOptionsVisible}
      />
    </>
  );
};

export default ABPackReveal;
