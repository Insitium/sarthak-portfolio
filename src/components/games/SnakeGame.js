"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { loadUsername, saveUsername, loadLeaderboard, pushScore } from "./gameStorage";

const GRID = 16;
const CELL = 22;
const CANVAS = GRID * CELL;
const TICK_MS = 190;
const LB_KEY = "sv_snake_leaderboard";
const SWIPE_THRESHOLD = 20;

function randomCell(exclude) {
  let cell;
  do {
    cell = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (exclude.some((c) => c.x === cell.x && c.y === cell.y));
  return cell;
}

function drawFrame(ctx, snake, food) {
  ctx.fillStyle = "#05050f";
  ctx.fillRect(0, 0, CANVAS, CANVAS);

  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, CANVAS);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(CANVAS, i * CELL);
    ctx.stroke();
  }

  ctx.fillStyle = "#00d4ff";
  ctx.shadowColor = "#00d4ff";
  ctx.shadowBlur = 10;
  ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
  ctx.shadowBlur = 0;

  snake.forEach((c, i) => {
    ctx.fillStyle = i === 0 ? "#a855f7" : "rgba(168,85,247,0.7)";
    ctx.fillRect(c.x * CELL + 1, c.y * CELL + 1, CELL - 2, CELL - 2);
  });
}

export default function SnakeGame({ onClose }) {
  const [stage, setStage] = useState("name"); // name | playing | over
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [score, setScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const touchStartRef = useRef(null);

  useEffect(() => {
    setLeaderboard(loadLeaderboard(LB_KEY));
    setUsername(loadUsername());
  }, []);

  const endGame = useCallback((finalScore, name) => {
    const next = pushScore(LB_KEY, name, finalScore);
    setStage("over");
    setScore(finalScore);
    setLeaderboard(next);
    setIsNewRecord(next[0]?.name === name && next[0]?.score === finalScore && finalScore > 0);
  }, []);

  const startGame = () => {
    const name = username.trim() || "Player";
    saveUsername(name);
    setUsername(name);

    const start = { x: Math.floor(GRID / 2), y: Math.floor(GRID / 2) };
    const snake = [start, { x: start.x - 1, y: start.y }, { x: start.x - 2, y: start.y }];
    gameRef.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      food: randomCell(snake),
      name,
    };
    setScore(0);
    setIsNewRecord(false);
    setStage("playing");
  };

  const turn = (nd) => {
    const g = gameRef.current;
    if (!g) return;
    if (nd.x === -g.dir.x && nd.y === -g.dir.y) return;
    g.nextDir = nd;
  };

  useEffect(() => {
    if (stage !== "playing") return;
    const KEY_MAP = {
      ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
    };
    const onKey = (e) => {
      const nd = KEY_MAP[e.key];
      if (!nd) return;
      e.preventDefault();
      turn(nd);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage]);

  useEffect(() => {
    if (stage !== "playing") return;
    const ctx = canvasRef.current.getContext("2d");
    const g = gameRef.current;
    drawFrame(ctx, g.snake, g.food);

    const interval = setInterval(() => {
      const state = gameRef.current;
      state.dir = state.nextDir;
      const head = { x: state.snake[0].x + state.dir.x, y: state.snake[0].y + state.dir.y };

      const hitWall = head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID;
      const hitSelf = state.snake.some((c) => c.x === head.x && c.y === head.y);
      if (hitWall || hitSelf) {
        clearInterval(interval);
        endGame(state.snake.length - 3, state.name);
        return;
      }

      state.snake.unshift(head);
      if (head.x === state.food.x && head.y === state.food.y) {
        state.food = randomCell(state.snake);
        setScore(state.snake.length - 3);
      } else {
        state.snake.pop();
      }

      drawFrame(ctx, state.snake, state.food);
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [stage, endGame]);

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
      turn(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
    } else {
      turn(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
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
          <canvas
            ref={canvasRef}
            width={CANVAS}
            height={CANVAS}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="rounded-lg touch-none"
            style={{ width: "100%", maxWidth: CANVAS, height: "auto", aspectRatio: "1 / 1", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <p className="text-slate-600 text-[11px] mt-3 hidden sm:block">Use arrow keys or WASD to move</p>

          <div className="grid grid-cols-3 gap-2 mt-4 sm:hidden w-44">
            <div />
            <button onClick={() => turn({ x: 0, y: -1 })} className="btn-secondary rounded-lg py-3 flex items-center justify-center" aria-label="Up"><ArrowUp size={18} /></button>
            <div />
            <button onClick={() => turn({ x: -1, y: 0 })} className="btn-secondary rounded-lg py-3 flex items-center justify-center" aria-label="Left"><ArrowLeft size={18} /></button>
            <button onClick={() => turn({ x: 0, y: 1 })} className="btn-secondary rounded-lg py-3 flex items-center justify-center" aria-label="Down"><ArrowDown size={18} /></button>
            <button onClick={() => turn({ x: 1, y: 0 })} className="btn-secondary rounded-lg py-3 flex items-center justify-center" aria-label="Right"><ArrowRight size={18} /></button>
          </div>
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
