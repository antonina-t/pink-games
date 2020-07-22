import React, {Component, useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import MemoryCard from './MemoryCard';
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
    .map(e => [e, {id: uuidv4(), name: e.name, isFlipped: true, canFlip: true}])
    .flat()
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

  return (
    <div className="memory-container">
      <div className="memory-row">
        {cards.slice(0,4).map(card => <MemoryCard onClick={() => onCardClick(card)} key={card.id} {...card}/>)}
      </div>
      <div className="memory-row">
        {cards.slice(4,8).map(card => <MemoryCard onClick={() => onCardClick(card)} key={card.id} {...card}/>)}
      </div>
      <div className="memory-row">
        {cards.slice(8,12).map(card => <MemoryCard onClick={() => onCardClick(card)} key={card.id} {...card}/>)}
      </div>
      <div className="memory-row">
        {cards.slice(12,16).map(card => <MemoryCard onClick={() => onCardClick(card)} key={card.id} {...card}/>)}
      </div>
    </div>
  );
}

export default Memory;