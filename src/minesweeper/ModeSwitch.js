import React from "react";
import "./ModeSwitch.css";

function ModeSwitch({isMarkMode, onChange}) {
  return (
    <div className="modes-container">
      <div className="mines-icon-container"><span className="mines-icon fas fa-flag"></span></div>
      <label className="switch">
        <input type="checkbox" onChange={onChange} defaultChecked={isMarkMode}></input>
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default ModeSwitch;
