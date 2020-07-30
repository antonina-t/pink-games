import React from "react";

function MinesCell({ isOpen, isMine, isMarked, minesAround, onOpen, onMark, isMarkMode }) {
  return (
    <div className="mines-cell-container">
      <div
        className={"mines-cell" + (isOpen ? " mines-cell-open" : "")}
        onClick={isMarkMode ? onMark : onOpen}
        onContextMenu={(e) => {
          e.preventDefault();
          onMark();
        }}
      >
        {isMarked && <span className="mines-icon fas fa-flag"></span>}
        {isOpen && isMine && <span className="mines-icon fas fa-bomb"></span>}
        {isOpen && !isMine && minesAround > 0 ? (
          <span className={"mines-icon mines-" + minesAround}>
            {minesAround}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default MinesCell;
