import React, { useEffect, useState } from "react";
import StatusBar from "../StatusBar";
import { v4 as uuidv4 } from "uuid";
import "./index.css";
import MemoryCard from "./MemoryCard";
import LeaderboardModal from "../LeaderboardModal";
import formatTime from "../utils.js";

const cardData = [
  { name: "grimace", color: "memory-yellow" },
  { name: "meh-rolling-eyes", color: "memory-cyan" },
  { name: "sad-tear", color: "memory-blue" },
  { name: "grin-tongue-squint", color: "memory-orange" },
  { name: "grin-beam-sweat", color: "memory-purple" },
  { name: "dizzy", color: "memory-pink" },
  { name: "kiss-wink-heart", color: "memory-red" },
  { name: "angry", color: "memory-green" },
];

function generateCards() {
  return (
    cardData
      .map(({ name, color }) => ({
        id: uuidv4(),
        name: name,
        color: color,
        isFlipped: false,
        canFlip: true,
      }))
      //.flatMap(e => [e, {id: uuidv4(), name: e.name, isFlipped: true, canFlip: true}]) // Doesn't work in EDGE
      .reduce(
        (acc, e) =>
          acc.concat([
            e,
            {
              id: uuidv4(),
              name: e.name,
              color: e.color,
              isFlipped: false,
              canFlip: true,
            },
          ]),
        []
      )
      .sort(() => Math.random() - 0.5)
  );
}

function Memory() {
  const [cards, setCards] = useState(generateCards());
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [time, setTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [gameId, setGameId] = useState(uuidv4());

  function setCardIsFlipped(cardID, isFlipped) {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardID) return c;
        return { ...c, isFlipped };
      })
    );
  }

  function onSuccessGuess() {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === firstCard.id || c.id === secondCard.id)
          return { ...c, canFlip: false };
        return c;
      })
    );
    resetFirstAndSecondCards();
  }

  function onFailureGuess() {
    const firstCardID = firstCard.id;
    const secondCardID = secondCard.id;

    setTimeout(() => {
      setCardIsFlipped(firstCardID, false);
    }, 1000);
    setTimeout(() => {
      setCardIsFlipped(secondCardID, false);
    }, 1000);

    resetFirstAndSecondCards();
  }

  useEffect(() => {
    if (!firstCard || !secondCard) return;
    firstCard.name === secondCard.name ? onSuccessGuess() : onFailureGuess();
  }, [secondCard]);

  useEffect(() => {
    if (startTime === 0) return;
    setTimer(
      setInterval(() => {
        setTime(Date.now() - startTime);
      }, 1000)
    );
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    if (win) {
      clearInterval(timer);
      setTimer(null);
      setShowModal(true);
    }
  }, [win]);

  useEffect(() => {
    if (cards.every((card) => !card.canFlip)) {
      setWin(true);
    }
  }, [cards]);

  function restart() {
    setCards(generateCards());
    resetFirstAndSecondCards();
    clearInterval(timer);
    setTimer(null);
    setStartTime(0);
    setTime(0);
    setWin(false);
    setGameId(uuidv4());
  }

  function onCardClick(card) {
    if (!card.canFlip) return;

    if (
      (firstCard && card.id === firstCard.id) ||
      (secondCard && card.id === secondCard.id)
    )
      return;

    setCardIsFlipped(card.id, true);

    firstCard ? setSecondCard(card) : setFirstCard(card);

    if (!timer) {
      setStartTime(Date.now());
    }
  }

  function resetFirstAndSecondCards() {
    setFirstCard(null);
    setSecondCard(null);
  }

  function loadLeaderboard() {
    console.log("Loading leaderboard...");
    const auth = firebase.auth();
    const db = firebase.firestore();
    return auth
      .signInAnonymously()
      .then(() => db.collection("memory").get())
      .then((querySnapshot) => {
        let leaderboard = [];
        querySnapshot.forEach((doc) => {
          leaderboard.push(doc.data());
        });
        leaderboard = leaderboard
          .sort((e1, e2) => e1.timeMs - e2.timeMs)
          .slice(0, 10)
          .map((entry) => entry.name + ": " + formatTime(entry.timeMs));
        return leaderboard;
      })
      .catch(function (error) {
        console.log("Error getting leaderboard: ", error);
      });
  }

  function saveScore(nickname) {
    if (!nickname) return;
    const auth = firebase.auth();
    const db = firebase.firestore();
    auth
      .signInAnonymously()
      .then(() =>
        db.collection("memory").doc(gameId).set({
          name: nickname,
          timeMs: time,
        })
      )
      .catch(function (error) {
        console.log("Error saving score: ", error);
      });
  }

  return (
    <div className="game-container">
      <StatusBar
        timeMs={time}
        showLeaderboard={() => setShowModal(true)}
        onRestart={() => restart()}
      ></StatusBar>
      <div className="memory-grid">
        {cards.map((card) => (
          <MemoryCard
            onClick={() => onCardClick(card)}
            key={card.id}
            {...card}
          />
        ))}
      </div>
      <LeaderboardModal
        title={win && "Congratulations, you won!"}
        message={win && "Your time was " + formatTime(time) + "."}
        show={showModal}
        onHide={() => setShowModal(false)}
        loadLeaderboard={loadLeaderboard}
        saveScore={win && saveScore}
      ></LeaderboardModal>
    </div>
  );
}

export default Memory;
