import React, {useEffect, useState} from 'react';
import MemoryRow from './MemoryRow';
import { v4 as uuidv4 } from 'uuid';
import './index.css';

const cardNames = [
  "grimace",
  "meh-rolling-eyes",
  "sad-tear",
  "grin-tongue-squint",
  "grin-beam-sweat",
  "dizzy",
  "kiss-wink-heart",
  "angry"
];

function generateCards() {
  return cardNames
    .map(cardName => ({
      id: uuidv4(),
      name: cardName,
      isFlipped: true,
      canFlip: true
    }))
    //.flatMap(e => [e, {id: uuidv4(), name: e.name, isFlipped: true, canFlip: true}]) // Doesn't work in EDGE
	.reduce((acc, e) => acc.concat([e, {id: uuidv4(), name: e.name, isFlipped: true, canFlip: true}]), [])
    .sort(() => Math.random() - 0.5);
}

function Memory() {
  const [cards, setCards] = useState(generateCards());
	const [canFlip, setCanFlip] = useState(true);
  const [firstCard, setFirstCard] = useState(null);
	const [secondCard, setSecondCard] = useState(null);

	function setCardIsFlipped(cardID, isFlipped) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, isFlipped};
		}));
  }
  
	function setCardCanFlip(cardID, canFlip) {
		setCards(prev => prev.map(c => {
			if (c.id !== cardID)
				return c;
			return {...c, canFlip};
		}));
  }

  // showcase
	useEffect(() => {
		setTimeout(() => {
			let index = 0;
			for (const card of cards) {
				setTimeout(() => setCardIsFlipped(card.id, false), index++ * 100);
			}
			setTimeout(() => setCanFlip(true), cards.length * 100);
		}, 3000);
	}, []);
  
  function onSuccessGuess() {
		setCardCanFlip(firstCard.id, false);
		setCardCanFlip(secondCard.id, false);
		setCardIsFlipped(firstCard.id, true);
		setCardIsFlipped(secondCard.id, true);
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
		if (!firstCard || !secondCard)
			return;
		(firstCard.name === secondCard.name) ? onSuccessGuess() : onFailureGuess();
	}, [firstCard, secondCard]);

  function onCardClick(card) {
		if (!canFlip)
			return;
		if (!card.canFlip)
			return;

		if ((firstCard && (card.id === firstCard.id) || (secondCard && (card.id === secondCard.id))))
			return;

		setCardIsFlipped(card.id, true);

		(firstCard) ? setSecondCard(card) : setFirstCard(card);
	}

  function resetFirstAndSecondCards() {
		setFirstCard(null);
		setSecondCard(null);
	}

  let rows = [];
  const rowsCount = cardNames.length / 2;
  for (let i = 0; i < rowsCount; i++) {
    rows.push((
      <MemoryRow cards={cards.slice(rowsCount * i, rowsCount * (i + 1))} onClick={onCardClick} key={i.toString()}></MemoryRow>
    ));
  }

  return (
    <div className="memory-container">
      {rows}
    </div>
  );
}

export default Memory;