import React from 'react';
import './css/HeaderSection.css';

function HeaderSection({ title, color = 'white', subtitle = null }) {
  return (
    <div className={`sixteen wide column ${color}  `}>
      <h1 className="ui header">
        {title}
        {subtitle && (
          <>
            <div className="sub header">({subtitle})</div>
            <div className="ui hidden divider" />
          </>
        )}
      </h1>
    </div>
  );
}
export default HeaderSection;
