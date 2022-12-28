import React from 'react';

const ConfirmModal = ({ title, content, visible, onClose }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="ui dimmer modals page transition visible active ab-modal"
      onClick={() => onClose && onClose(false)}
    >
      <div className="ui active mini active modal">
        <div className="header">{title}</div>
        <div className="content">{content}</div>
        <div className="actions">
          <div className="ui button">OK</div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
