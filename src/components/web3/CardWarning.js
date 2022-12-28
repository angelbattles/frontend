import React from 'react';

const CardWarning = ({ cards }) => {
  if (cards ) {
    return null;
  }

  return (
    <>
      <div className="ui divider" />
      <div className="ui red message">
        There was a problem retrieving all of your cards. Please try refreshing
        or changing your RPC node.
      </div>
    </>
  );
};

export default CardWarning;
