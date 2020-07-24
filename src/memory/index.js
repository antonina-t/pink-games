import React, { useEffect, useState } from "react";
import MemoryRow from "./MemoryRow";
import StatusBar from "./StatusBar";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

const cardData = [
  {name: "grimace", color: "memory-yellow"},
  {name: "meh-rolling-eyes", color: "memory-cyan"},
  {name: "sad-tear", color: "memory-blue"},
  {name: "grin-tongue-squint", color: "memory-orange"},
  {name: "grin-beam-sweat", color: "memory-purple"},
  {name: "dizzy", color: "memory-pink"},
  {name: "kiss-wink-heart", color: "memory-red"},
  {name: "angry", color: "memory-green"},
];

function generateCards() {
  return (
    cardData
      .map(({name, color}) => ({
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
            { id: uuidv4(), name: e.name, color: e.color, isFlipped: false, canFlip: true },
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

  function setCardIsFlipped(cardID, isFlipped) {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardID) return c;
        return { ...c, isFlipped };
      })
    );
  }

  function setCardCanFlip(cardID, canFlip) {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== cardID) return c;
        return { ...c, canFlip };
      })
    );
  }

  function onSuccessGuess() {
    setCardCanFlip(firstCard.id, false);
    setCardCanFlip(secondCard.id, false);
    setCardIsFlipped(firstCard.id, true);
    setCardIsFlipped(secondCard.id, true);
    resetFirstAndSecondCards();
    if (cards.every((card) => card.isFlipped)) {
      setWin(true);
    }
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
  }, [firstCard, secondCard]);

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
    }
  }, [win]);

  function restart() {
    setCards(generateCards());
    resetFirstAndSecondCards();
    clearInterval(timer);
    setTimer(null);
    setStartTime(0);
    setTime(0);
    setWin(false);
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

  let rows = [];
  const rowsCount = cardData.length / 2;
  for (let i = 0; i < rowsCount; i++) {
    rows.push(
      <MemoryRow
        cards={cards.slice(rowsCount * i, rowsCount * (i + 1))}
        onClick={onCardClick}
        key={i.toString()}
      ></MemoryRow>
    );
  }

  return (
    <div className="memory-container">
      <StatusBar win={win} timeMs={time} onRestart={() => restart()}></StatusBar>
      {rows}
    </div>
  );
}

export default Memory;
