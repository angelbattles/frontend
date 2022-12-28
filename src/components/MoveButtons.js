import React from 'react';
import { ValidPaths } from '../config/mountain';


function MoveButtons(props) {
  function handleClick(e, attackSpot) {
    // e.preventDefault();
    console.log(props);
  }
  var buttons = [];
  for (var i = 0; i < ValidPaths[props.location].length; i++) {
    buttons.push(
      <button
        className="ui red fluid button"
        onClick={handleClick(ValidPaths[props.location][i])}
      >
        Attack {ValidPaths[props.location][i]}
      </button>
    );
  }
  return { buttons };
}

export default MoveButtons;
