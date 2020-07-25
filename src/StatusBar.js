import React from "react";
import Button from "react-bootstrap/Button";
import "./StatusBar.css";

function StatusBar({ timeMs, status, score, onRestart }) {
  const totalSeconds = Math.floor(timeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;

  return (
    <div>
      <div className="status-container">
        {status && <p className="text">{status}&nbsp;</p>}
        {score != null && <p className="text">Score: {score}&nbsp;</p>}
        <p className="text">
          Time: {minutes > 0 ? minutes + "m " : ""} {seconds}s
        </p>
        <Button variant="light" className="reset" onClick={onRestart}>
          Restart
        </Button>
      </div>
    </div>
  );
}

export default StatusBar;
