import React, { useState, useEffect } from "react";
import Point from "./Point";
import StatusBar from "../StatusBar";
import TouchController from "./TouchController";
import "./index.css";

const width = 20;
const height = 12;
function generateSnake() {
  return {
    headCell: new Point(width / 2, height / 2),
    tailCells: [new Point(width / 2 - 1, height / 2)],
    dir: "right",
  };
}
function generateFood(snake) {
  let food = new Point(width / 2, height / 2);
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
function moveSnake(snake, food, command) {
  let dir = command || snake.dir;
  if (
    (command === "right" && snake.dir === "left") ||
    (command === "up" && snake.dir === "down") ||
    (command === "left" && snake.dir === "right") ||
    (command === "down" && snake.dir === "up")
  )
    dir = snake.dir;
  const newHeadCell = snake.headCell.move(dir);
  if (
    newHeadCell.x < 0 ||
    newHeadCell.y < 0 ||
    newHeadCell.x >= width ||
    newHeadCell.y >= height ||
    snake.tailCells.some((cell) => cell.equals(newHeadCell))
  ) {
    return null;
  }
  return {
    headCell: newHeadCell,
    tailCells: [
      snake.headCell,
      snake.tailCells.slice(
        0,
        snake.tailCells.length - (newHeadCell.equals(food) ? 0 : 1)
      ),
    ].flat(),
    dir: dir,
  };
}

function Snake() {
  const [snake, setSnake] = useState(generateSnake());
  const [commands, setCommands] = useState([]);
  const [food, setFood] = useState(generateFood(snake));
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTime(Date.now() - startTime);
      const newSnake =
        snake &&
        moveSnake(snake, food, commands.length > 0 ? commands[0] : null);
      if (commands.length > 0) setCommands(commands.slice(1));
      if (newSnake) {
        setSnake(newSnake);
        if (food.equals(newSnake.headCell)) {
          setFood(generateFood(newSnake));
        }
      } else {
        setGameOver(true);
      }
    }, 200 * Math.pow(0.9, Math.floor(snake.tailCells.length) / 3));
    return () => clearInterval(interval);
  });

  function handleKeyPress(event) {
    let newDir = null;
    console.log(event.keyCode);
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
    if (newDir && newDir !== commands[commands.length - 1]) {
      setCommands([commands, newDir].flat());
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  });

  function restart() {
    const newSnake = generateSnake();
    setSnake(newSnake);
    setCommands([]);
    setFood(generateFood(newSnake));
    setGameOver(false);
    setStartTime(Date.now());
    setTime(0);
  }

  const cells = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = new Point(x, y);
      const style = p.equals(snake.headCell)
        ? " head"
        : snake.tailCells.some((cell) => p.equals(cell))
        ? " tail"
        : p.equals(food)
        ? " food"
        : "";
      cells.push(
        <div className={"snake-cell" + style} key={x + "-" + y}></div>
      );
    }
  }
  return (
    <div className="snake-container">
      <StatusBar
        timeMs={time}
        score={snake.tailCells.length - 1}
        status={gameOver ? "Game over!" : null}
        onRestart={() => restart()}
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
