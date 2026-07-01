"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";
import { loadUsername, saveUsername, loadLeaderboard, pushScore } from "./gameStorage";

const SIZE = 4;
const LB_KEY = "sv_2048_leaderboard";
const SWIPE_THRESHOLD = 20;

const TILE_STYLES = {
  2: "bg-slate-700 text-slate-200",
  4: "bg-slate-600 text-slate-100",
  8: "bg-cyan-700 text-white",
  16: "bg-cyan-600 text-white",
  32: "bg-cyan-500 text-white",
  64: "bg-purple-600 text-white",
  128: "bg-purple-500 text-white",
  256: "bg-pink-600 text-white",
  512: "bg-pink-500 text-white",
  1024: "bg-amber-500 text-white",
  2048: "bg-amber-400 text-white",
};

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function emptyCells(board) {
  const cells = [];
  board.forEach((row, r) => row.forEach((v, c) => { if (v === 0) cells.push([r, c]); }));
  return cells;
}

function spawnTile(board) {
  const cells = emptyCells(board);
  if (cells.length === 0) return board;
  const [r, c] = cells[Math.floor(Math.random() * cells.length)];
  const next = board.map((row) => [...row]);
  next[r][c] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function slideRowLeft(row) {
  const arr = row.filter((v) => v !== 0);
  let scoreGained = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      scoreGained += arr[i];
      arr[i + 1] = 0;
    }
  }
  const merged = arr.filter((v) => v !== 0);
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, scoreGained };
}

function reverseRows(board) { return board.map((row) => [...row].reverse()); }
function transpose(board) { return board[0].map((_, c) => board.map((row) => row[c])); }

function moveLeftAll(board) {
  let scoreGained = 0;
  let moved = false;
  const next = board.map((row) => {
    const { row: newRow, scoreGained: gained } = slideRowLeft(row);
    if (!moved && newRow.some((v, i) => v !== row[i])) moved = true;
    scoreGained += gained;
    return newRow;
  });
  return { board: next, scoreGained, moved };
}

function move(board, direction) {
  let transform = (b) => b;
  let inverse = (b) => b;
  if (direction === "right") {
    transform = reverseRows;
    inverse = reverseRows;
  } else if (direction === "up") {
    transform = transpose;
    inverse = transpose;
  } else if (direction === "down") {
    transform = (b) => reverseRows(transpose(b));
    inverse = (b) => transpose(reverseRows(b));
  }
  const { board: slid, scoreGained, moved } = moveLeftAll(transform(board));
  return { board: inverse(slid), scoreGained, moved };
}

function isGameOver(board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return false;
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

export default function Game2048({ onClose }) {
  const [stage, setStage] = useState("name"); // name | playing | over
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [board, setBoard] = useState(emptyBoard());
  const [score, setScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const touchStartRef = useRef(null);
  const boardRef = useRef(board);
  boardRef.current = board;
  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => {
    setLeaderboard(loadLeaderboard(LB_KEY));
    setUsername(loadUsername());
  }, []);

  const endGame = useCallback((finalScore, name) => {
    const next = pushScore(LB_KEY, name, finalScore);
    setStage("over");
    setLeaderboard(next);
    setIsNewRecord(next[0]?.name === name && next[0]?.score === finalScore && finalScore > 0);
  }, []);

  const startGame = () => {
    const name = username.trim() || "Player";
    saveUsername(name);
    setUsername(name);

    let b = spawnTile(emptyBoard());
    b = spawnTile(b);
    setBoard(b);
    setScore(0);
    setIsNewRecord(false);
    setStage("playing");
  };

  const nameRef = useRef(username);
  nameRef.current = username;

  const doMove = useCallback((direction) => {
    const current = boardRef.current;
    const { board: next, scoreGained, moved } = move(current, direction);
    if (!moved) return;

    const withNewTile = spawnTile(next);
    const updatedScore = scoreRef.current + scoreGained;
    setBoard(withNewTile);
    setScore(updatedScore);
    if (isGameOver(withNewTile)) {
      endGame(updatedScore, nameRef.current || "Player");
    }
  }, [endGame]);

  useEffect(() => {
    if (stage !== "playing") return;
    const KEY_MAP = {
      ArrowUp: "up", w: "up", W: "up",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right",
    };
    const onKey = (e) => {
      const dir = KEY_MAP[e.key];
      if (!dir) return;
      e.preventDefault();
      doMove(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, doMove]);

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e) => {
    const start = touchStartRef.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    touchStartRef.current = null;

    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      doMove(dx > 0 ? "right" : "left");
    } else {
      doMove(dy > 0 ? "down" : "up");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {stage === "name" && (
        <div className="text-center">
          <p className="text-white font-semibold mb-4">Enter your name to play</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startGame()}
            placeholder="Your name"
            maxLength={16}
            autoFocus
            className="w-full rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 text-center focus:outline-none mb-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <button onClick={startGame} className="btn-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
            Start Game
          </button>

          {leaderboard.length > 0 && (
            <div className="mt-8 text-left max-w-xs mx-auto">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Trophy size={12} className="text-cyan-400" /> All-time best
              </p>
              <ol className="space-y-1">
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <li key={i} className="flex justify-between text-sm text-slate-400">
                    <span>{i + 1}. {entry.name}</span>
                    <span className="text-cyan-400 font-medium">{entry.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {stage === "playing" && (
        <div className="flex flex-col items-center">
          <p className="text-slate-400 text-sm mb-3">
            Score: <span className="text-cyan-400 font-semibold">{score}</span>
          </p>
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="grid grid-cols-4 gap-2 p-2 rounded-xl touch-none select-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "min(90vw, 360px)" }}
          >
            {board.flat().map((v, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg ${v ? TILE_STYLES[v] || "bg-fuchsia-500 text-white" : ""}`}
                style={!v ? { background: "rgba(255,255,255,0.03)" } : undefined}
              >
                {v || ""}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 sm:hidden w-44">
            <div />
            <button onClick={() => doMove("up")} className="btn-secondary rounded-lg py-3 text-sm" aria-label="Up">↑</button>
            <div />
            <button onClick={() => doMove("left")} className="btn-secondary rounded-lg py-3 text-sm" aria-label="Left">←</button>
            <button onClick={() => doMove("down")} className="btn-secondary rounded-lg py-3 text-sm" aria-label="Down">↓</button>
            <button onClick={() => doMove("right")} className="btn-secondary rounded-lg py-3 text-sm" aria-label="Right">→</button>
          </div>
          <p className="text-slate-600 text-[11px] mt-3 hidden sm:block">Use arrow keys or WASD — merge matching tiles</p>
        </div>
      )}

      {stage === "over" && (
        <div className="text-center">
          <p className="text-white font-bold text-xl mb-1">Game Over</p>
          <p className="text-slate-400 text-sm mb-1">Your score</p>
          <p className="gradient-text text-4xl font-extrabold mb-4">{score}</p>
          {isNewRecord && (
            <p className="text-cyan-400 text-sm font-semibold mb-4 flex items-center justify-center gap-1.5">
              <Trophy size={14} /> New all-time record!
            </p>
          )}

          <div className="text-left mb-6 max-w-xs mx-auto">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Trophy size={12} className="text-cyan-400" /> All-time best
            </p>
            <ol className="space-y-1">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <li
                  key={i}
                  className={`flex justify-between text-sm ${entry.name === username && entry.score === score ? "text-cyan-400 font-semibold" : "text-slate-400"}`}
                >
                  <span>{i + 1}. {entry.name}</span>
                  <span className="font-medium">{entry.score}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={startGame} className="btn-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm">
              Play Again
            </button>
            <button onClick={onClose} className="btn-secondary px-5 py-2.5 rounded-xl font-semibold text-sm">
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
