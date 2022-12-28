import React from 'react';
import '../../components/css/site.css';
const CardCountMenuItem = ({ allCards, refreshAllTokens , refreshing}) => {
    return (
        <div className="hover-cursor" onClick={refreshAllTokens}>
            {!refreshing ? <i className="icon">
                <img
                    className="ui tiny image"
                    alt="card refresh"
                    title="click to refresh cards"
                    src={'images/refresh.png'}
                />
            </i> :

                <i className="icon">
                    <img
                        className="ui tiny image rotate"
                        alt="card refresh"
                        title="click to refresh cards"
                        src={'images/refresh.png'}
                    />
                </i>

            }
            <i className="icon">
                <img
                    className="ui tiny image"
                    alt="card count"
                    title="click to refresh cards"
                    src={'images/card_icon.png'}
                />
            </i>
            {allCards.ownerTokens?.length ?? '--'}
        </div>
    );
};

export default CardCountMenuItem;
