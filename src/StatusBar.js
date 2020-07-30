import React from "react";
import Button from "react-bootstrap/Button";
import formatTime from "./utils.js"
import "./StatusBar.css";

function StatusBar({ timeMs, score, onRestart, showLeaderboard }) {
  return (
    <div>
      <div className="status-container">
        <div className="text-group">
          <p className="text">{score}</p>
          <p className="text">
            Time: {formatTime(timeMs)}
          </p>
        </div>
        <Button variant="light" className="rightButton" onClick={onRestart}>
          Restart
        </Button>
        <Button variant="light" className="rightButton" onClick={showLeaderboard}>
          Leaderboard
        </Button>
      </div>
    </div>
  );
}

export default StatusBar;
