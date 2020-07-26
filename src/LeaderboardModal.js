import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function LeaderboardModal({
  show,
  onHide,
  title,
  message,
  loadLeaderboard,
  saveScore,
}) {
  const [leaderboard, setLeaderboard] = useState(null);
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    if (show && !leaderboard) {
      loadLeaderboard().then(leaderboard => setLeaderboard(leaderboard))
    } else if (!show) {
      setLeaderboard(null);
    }
  });

  function handleNicknameChange(event) {
    setNickname(event.target.value);
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Leaderboard"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message && <p>
          <strong>{message}</strong>
        </p>}
        {!leaderboard && <p>Loading leaderboard...</p>}
        {leaderboard &&
          leaderboard.map((entry, i) => (
            <p key={i.toString()}>{i + 1 + ". " + entry}</p>
          ))}
        {saveScore && (
          <Form.Control
            type="text"
            placeholder="Your name"
            onChange={handleNicknameChange}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="light"
          onClick={
            saveScore
              ? () => {
                  saveScore(nickname);
                  onHide();
                }
              : onHide
          }
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LeaderboardModal;
