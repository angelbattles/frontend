import React from 'react';
import ABCardInfo from '../config/abcardinfo';
import Stats from './Stats';
import HeaderSection from './HeaderSection';
import LoadingSpinner from './LoadingSpinner';

function TokenTable({ title, cards }) {
  let rows = null;

  if (!!cards && cards.ownerTokens) {
    rows = cards.ownerTokens.map((token, i) => (
      <tr key={cards.ownerTokenIds[i]}>
        <td data-label="ID">{cards.ownerTokenIds[i]}</td>
        <td data-label="Type">{ABCardInfo.cards[token.cardSeriesId].name}</td>
        <td data-label="Stats">
          <Stats
            seriesId={token.cardSeriesId}
            power={token.power}
            experience={token.experience}
            red={token.auraRed}
            blue={token.auraBlue}
            yellow={token.auraYellow}
          />
        </td>
        <td>
          <div className="ui mini images">
            <img
              className="ui image"
              src={`images/${token.cardSeriesId}.png`}
              alt="card"
            />
          </div>
        </td>
      </tr>
    ));
  }

  return !cards || !cards.ownerTokens ? (
    <LoadingSpinner />
  ) : (
    <div>
      {title !== 'none' && (
        <HeaderSection title={`My Tokens (${rows.length})`} color="purple" />
      )}
      <div className="ui divider"></div>
      <table className="ui celled unstackable table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Stats</th>
            <th data-label="Stats"></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
export default TokenTable;
