import React from "react";
import ms from "pretty-ms";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ time, win, onRestart }) {
  return (
    <div>
      <div className="status-container">
        {win && <h4 className="win">You won!&nbsp;</h4>}
        <h4 className="timer">Time: {ms(time)}</h4>
        <Button variant="light" className="reset" onClick={onRestart}>
          Restart
        </Button>
      </div>
    </div>
  );
}

export default StatusBar;
