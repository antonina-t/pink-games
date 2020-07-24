import React from "react";

function MemoryCard({ name, color, isFlipped, onClick }) {
  return (
    <div className="memory-card-container">
      <div
        className={"memory-card" + (isFlipped ? " is-flipped" : "")}
        onClick={onClick}
      >
        <div className="memory-card-face"></div>
        <div className="memory-card-face memory-card-face--back">
          <span
            className={"memory-icon far fa-" + name + " " + color}
            style={{ verticalAlign: "middle" }}
          ></span>
        </div>
      </div>
    </div>
  );
}

export default MemoryCard;
