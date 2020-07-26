import React, { useState, useEffect } from "react";
import Point from "./Point";
import StatusBar from "../StatusBar";
import TouchController from "./TouchController";
import "./index.css";

const width = 20;
const height = 12;
const initialIntervalMs = 400;
function generateGame() {
  const snake = {
    headCell: new Point(width / 2, height / 2),
    tailCells: [new Point(width / 2 - 1, height / 2)],
    dir: "right",
  };
  return {
    snake: snake,
    food: generateFood(snake),
    commands: [],
    isOver: false,
  };
}
function generateFood(snake) {
  let food = new Point(
    Math.floor(Math.random() * width),
    Math.floor(Math.random() * height)
  );
  while (
    food.equals(snake.headCell) ||
    snake.tailCells.some((cell) => food.equals(cell))
  ) {
    food = new Point(
      Math.floor(Math.random() * width),
      Math.floor(Math.random() * height)
    );
  }
  return food;
}
function tick(game) {
  if (game.isOver) return game;
  const { snake, food, commands } = game;
  const command = commands[0];
  let newDir = command || snake.dir;
  if (
    (command === "right" && snake.dir === "left") ||
    (command === "up" && snake.dir === "down") ||
    (command === "left" && snake.dir === "right") ||
    (command === "down" && snake.dir === "up")
  )
    newDir = snake.dir;
  const newHeadCell = snake.headCell.move(newDir);
  if (
    newHeadCell.x < 0 ||
    newHeadCell.y < 0 ||
    newHeadCell.x >= width ||
    newHeadCell.y >= height ||
    snake.tailCells.some((cell) => cell.equals(newHeadCell))
  ) {
    return { ...game, isOver: true };
  }
  const newSnake = {
    headCell: newHeadCell,
    tailCells: [
      snake.headCell,
      snake.tailCells.slice(
        0,
        snake.tailCells.length - (newHeadCell.equals(food) ? 0 : 1)
      ),
      //].flat(), Doesn't work in EDGE
    ].reduce((acc, val) => acc.concat(val), []),
    dir: newDir,
  };
  return {
    snake: newSnake,
    food: food.equals(newHeadCell) ? generateFood(newSnake) : food,
    commands: commands.slice(1),
    isOver: game.isOver,
  };
}

function Snake() {
  const [game, setGame] = useState(generateGame());
  const [intervalMs, setIntervalMs] = useState(initialIntervalMs);
  const [tailLength, setTailLength] = useState(1);
  const [timer, setTimer] = useState({
    startTime: Date.now(),
    time: 0,
    isRunning: true,
  });

  useEffect(() => {
    if (game.isOver) return;
    const intervalId = setInterval(() => {
      setGame((game) => tick(game));
    }, intervalMs);
    return () => clearInterval(intervalId);
  }, [intervalMs]);

  useEffect(() => {
    if (game.snake.tailCells.length !== tailLength) {
      const newIntervalMs =
        initialIntervalMs * Math.pow(0.95, game.snake.tailCells.length / 3);
      setIntervalMs(newIntervalMs);
      setTailLength(game.snake.tailCells.length);
    }
    setTimer((timer) => {
      return { ...timer, isRunning: !game.isOver };
    });
  }, [game]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((timer) => {
        if (timer.isRunning) {
          return { ...timer, time: Date.now() - timer.startTime };
        }
        return timer;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  function handleKeyPress(event) {
    let newDir = null;
    switch (event.keyCode) {
      case 37:
      case 65:
        newDir = "left";
        break;
      case 38:
      case 87:
        newDir = "up";
        break;
      case 39:
      case 68:
        newDir = "right";
        break;
      case 40:
      case 83:
        newDir = "down";
        break;
    }
    addCommand(newDir);
  }

  function addCommand(newDir) {
    setGame((game) => {
      if (newDir && newDir !== game.commands[game.commands.length - 1]) {
        return {
          ...game,
          commands: [game.commands, newDir].reduce(
            (acc, val) => acc.concat(val),
            []
          ),
        };
      }
      return game;
    });
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  function restart() {
    setGame(generateGame());
    setTimer({ startTime: Date.now(), time: 0 });
  }

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = new Point(x, y);
      const style = p.equals(game.snake.headCell)
        ? " head"
        : game.snake.tailCells.some((cell) => p.equals(cell))
        ? " tail"
        : p.equals(game.food)
        ? " food"
        : "";
      cells.push(
        <div className={"snake-cell" + style} key={x + "-" + y}></div>
      );
    }
  }
  return (
    <div className="game-container">
      <StatusBar
        timeMs={timer.time}
        score={game.snake.tailCells.length - 1}
        status={game.isOver ? "Game over!" : null}
        onRestart={restart}
      ></StatusBar>
      <div className="snake-grid">{cells}</div>
      <TouchController
        onUp={() => addCommand("up")}
        onRight={() => addCommand("right")}
        onDown={() => addCommand("down")}
        onLeft={() => addCommand("left")}
      ></TouchController>
    </div>
  );
}

export default Snake;
