import React from 'react';

const Alert = ({ color = 'red', message }) => {
  if (!message) {
    return null;
  }

  return <div className={`ui ${color} message`}>{message}</div>;
};

export default Alert;
