import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ timeMs, win, onRestart }) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return (
    <div>
      <div className="status-container">
        {win && <h4 className="win">You won!&nbsp;</h4>}
        <h4 className="timer">
          Time: {minutes > 0 ? minutes + "m " : ""} {seconds}s
        </h4>
        <Button variant="light" className="reset" onClick={onRestart}>
          Restart
        </Button>
      </div>
    </div>
  );
}

export default StatusBar;
