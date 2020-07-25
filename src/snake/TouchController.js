import React from "react";
import Button from "react-bootstrap/Button";
import './TouchController.css';

function TouchController({ onUp, onRight, onDown, onLeft }) {
  return (
    <div className="tc-container">
        <div className="tc-grid">
            <Button variant="light" onClick={onUp} className="tc-up"><i className="fas fa-chevron-up"></i></Button>
            <Button variant="light" onClick={onRight} className="tc-right"><i className="fas fa-chevron-right"></i></Button>
            <Button variant="light" onClick={onDown} className="tc-down"><i className="fas fa-chevron-down"></i></Button>
            <Button variant="light" onClick={onLeft} className="tc-left"><i className="fas fa-chevron-left"></i></Button>
        </div>
    </div>
  );
}

export default TouchController;
