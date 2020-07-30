import React, { useState, useEffect } from "react";
import MinesCell from "./MinesCell";
import "./index.css";
import StatusBar from "../StatusBar";
import LeaderboardModal from "../LeaderboardModal";
import ModeSwitch from "./ModeSwitch";
import formatTime from "../utils.js";
import { v4 as uuidv4 } from "uuid";

const size = 10;
const mines = Math.round(size * size * 0.15);

function generateGrid() {
  const grid = [];
  for (let i = 0; i < size * size; i++) {
    grid.push({
      x: i % size,
      y: Math.floor(i / size),
      isOpen: false,
      isMine: false,
      isMarked: false,
    });
  }
  for (let i = 0; i < mines; i++) {
    let x = Math.floor(Math.random() * size);
    let y = Math.floor(Math.random() * size);
    while (grid[y * size + x].isMine) {
      x = Math.floor(Math.random() * size);
      y = Math.floor(Math.random() * size);
    }
    grid[y * size + x] = { ...grid[y * size + x], isMine: true };
  }
  return grid;
}

function minesAt(grid, x, y) {
  if (x < 0 || y < 0 || x >= size || y >= size) return 0;
  const cell = grid[y * size + x];
  return cell.isMine ? 1 : 0;
}

function minesAround(grid, x, y) {
  return (
    minesAt(grid, x - 1, y - 1) +
    minesAt(grid, x - 1, y) +
    minesAt(grid, x - 1, y + 1) +
    minesAt(grid, x, y - 1) +
    minesAt(grid, x, y + 1) +
    minesAt(grid, x + 1, y - 1) +
    minesAt(grid, x + 1, y) +
    minesAt(grid, x + 1, y + 1)
  );
}

function correctlyMarkedMines(grid) {
  return grid.filter((c) => c.isMine && c.isMarked).length;
}

function openCells(grid, x, y) {
  if (x < 0 || y < 0 || x >= size || y >= size) return grid;
  if (grid[y * size + x].isOpen || grid[y * size + x].isMarked) return grid;
  let newGrid = grid.map((c) => {
    if (c.x === x && c.y === y) return { ...c, isOpen: true };
    return c;
  });
  if (minesAround(newGrid, x, y) === 0) {
    newGrid = openCells(newGrid, x - 1, y - 1);
    newGrid = openCells(newGrid, x - 1, y);
    newGrid = openCells(newGrid, x - 1, y + 1);
    newGrid = openCells(newGrid, x, y - 1);
    newGrid = openCells(newGrid, x, y + 1);
    newGrid = openCells(newGrid, x + 1, y - 1);
    newGrid = openCells(newGrid, x + 1, y);
    newGrid = openCells(newGrid, x + 1, y + 1);
  }
  return newGrid;
}

function Minesweeper() {
  const [grid, setGrid] = useState(generateGrid());
  const [timer, setTimer] = useState({
    startTime: 0,
    time: 0,
    id: null,
  });
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameId, setGameId] = useState(uuidv4());
  const [isMarkMode, setIsMarkMode] = useState(false);

  useEffect(() => {
    clearInterval(timer.id);
    setTimer((prev) => {
      return { ...prev, id: null };
    });
  }, [gameOver]);

  useEffect(() => {
    if (grid.every((c) => (c.isMine ? c.isMarked : c.isOpen))) {
      setWin(true);
      setGameOver(true);
      setShowModal(true);
    } else if (grid.some((c) => c.isOpen && c.isMine)) {
      setGameOver(true);
      setShowModal(true);
    }
  }, [grid]);

  function cellOnOpen(cell) {
    if (cell.isMine) {
      setGrid((prev) => {
        return prev.map((c) => {
          return { ...c, isOpen: !c.isMarked };
        });
      });
    } else {
      setGrid((prev) => {
        const newGrid = prev.map((c) => {
          if (c.x === cell.x && c.y === cell.y)
            return { ...c, isMarked: false };
          return c;
        });
        return openCells(newGrid, cell.x, cell.y);
      });
    }
    startTimerIfNeeded();
  }

  function cellOnMark(cell) {
    if (cell.isOpen) return;
    setGrid((prev) => {
      return prev.map((c) => {
        if (c.x === cell.x && c.y === cell.y)
          return { ...c, isMarked: !c.isMarked };
        return c;
      });
    });
    startTimerIfNeeded();
  }

  function startTimerIfNeeded() {
    if (!timer.id) {
      const id = setInterval(() => {
        setTimer((prev) => {
          return { ...prev, time: Date.now() - prev.startTime };
        });
      }, 1000);
      setTimer({
        startTime: Date.now(),
        time: 0,
        id: id,
      });
    }
  }

  function restart() {
    if (timer.id) clearInterval(timer.id);
    setTimer({
      startTime: 0,
      time: 0,
      id: null,
    });
    setGrid(generateGrid());
    setGameOver(false);
    setWin(false);
    setGameId(uuidv4());
  }

  function saveScore(nickname) {
    if (!nickname) return;
    const auth = firebase.auth();
    const db = firebase.firestore();
    auth
      .signInAnonymously()
      .then(() =>
        db.collection("minesweeper").doc(gameId).set({
          name: nickname,
          timeMs: timer.time,
          cells: size * size,
          mines: mines
        })
      )
      .catch(function (error) {
        console.log("Error saving score: ", error);
      });
  }

  function loadLeaderboard() {
    console.log("Loading leaderboard...");
    const auth = firebase.auth();
    const db = firebase.firestore();
    return auth
      .signInAnonymously()
      .then(() => db.collection("minesweeper").get())
      .then((querySnapshot) => {
        let leaderboard = [];
        querySnapshot.forEach((doc) => {
          leaderboard.push(doc.data());
        });
        leaderboard = leaderboard
          .filter(e => e.cells === size * size && e.mines === mines)
          .sort((e1, e2) => e1.timeMs - e2.timeMs)
          .slice(0, 10)
          .map((entry) => entry.name + ": " + formatTime(entry.timeMs));
        return leaderboard;
      })
      .catch(function (error) {
        console.log("Error getting leaderboard: ", error);
      });
  }

  const score = correctlyMarkedMines(grid);

  return (
    <div className="game-container">
      <StatusBar
        timeMs={timer.time}
        score={
          "Mines: " +
          (gameOver ? 0 : mines - grid.filter((c) => c.isMarked).length)
        }
        onRestart={restart}
        showLeaderboard={() => setShowModal(true)}
      ></StatusBar>
      <div className="mines-grid">
        {grid.map((cell) => (
          <MinesCell
            isOpen={cell.isOpen}
            isMine={cell.isMine}
            isMarked={cell.isMarked}
            minesAround={minesAround(grid, cell.x, cell.y)}
            onOpen={() => cellOnOpen(cell)}
            onMark={() => cellOnMark(cell)}
            isMarkMode={isMarkMode}
            key={cell.x + "-" + cell.y}
          ></MinesCell>
        ))}
      </div>
      <ModeSwitch isMarkMode={isMarkMode} onChange={() => setIsMarkMode(!isMarkMode)}></ModeSwitch>
      <LeaderboardModal
        title={
          gameOver &&
          (win ? "Congratulations, you swept all the mines!" : "Game over!")
        }
        message={
          gameOver &&
          (win
            ? "Your time was " + formatTime(timer.time) + "."
            : score > 0
            ? `You found ${score} out of ${mines} mines, but the ${score + 1}${
                score === 1 ? "nd" : score === 2 ? "rd" : "th"
              } one got you.`
            : "Ooh, unlucky... The 1st mine got you!")
        }
        show={showModal}
        onHide={() => setShowModal(false)}
        loadLeaderboard={loadLeaderboard}
        saveScore={win && saveScore}
      ></LeaderboardModal>
    </div>
  );
}

export default Minesweeper;
