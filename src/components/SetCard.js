import React from 'react';

const SetCard = ({ cards, requiredCards, label, image, description }) => {
    // Send in an array of required cards
    const hasSet = (requiredCards) => {
        let allCards = true;

        requiredCards.forEach((requiredCard) => {
            if (!cards.ownerTokens.some((c) => parseInt(c.cardSeriesId, 10) === requiredCard)) {
                allCards = false;
            }
        });

        return allCards;
    };

    return (
        <div className="ui fluid raised stackable card">
            <div className="ui fluid small centered image">
                {hasSet(requiredCards) ? (
                    <img src={image} alt={`${label} completed set`} />
                ) : (
                    <img
                        src={image}
                        alt={`${label} non completed set`}
                        style={{ filter: 'grayscale(100%)' }}
                    />
                )}
            </div>
            <div className="content">
                <div className="meta">{description}</div>
            </div>
        </div>
    );
};

export default SetCard;
