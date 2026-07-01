"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Trophy } from "lucide-react";
import { loadUsername, saveUsername, loadLeaderboard, pushScore } from "./gameStorage";

const W = 420;
const H = 220;
const GROUND_Y = H - 34;
const DRAGON_SIZE = 34;
const DRAGON_X = 46;
const GRAVITY = 0.9;
const JUMP_VELOCITY = -13.5;
const START_SPEED = 4.2;
const MAX_SPEED = 9;
const LB_KEY = "sv_dragon_leaderboard";

function makeObstacle() {
  const height = 22 + Math.random() * 22;
  return { x: W + 10, width: 16 + Math.random() * 10, height };
}

function drawFrame(ctx, dragonY, obstacles, distance) {
  ctx.fillStyle = "#05050f";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 14; i++) {
    const x = (((i * 53 - distance * 0.3) % (W + 40)) + W + 40) % (W + 40) - 20;
    ctx.fillRect(x, 18 + (i % 4) * 18, 2, 2);
  }

  const baseY = GROUND_Y + DRAGON_SIZE;
  ctx.strokeStyle = "rgba(0,212,255,0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, baseY);
  ctx.lineTo(W, baseY);
  ctx.stroke();

  obstacles.forEach((o) => {
    ctx.fillStyle = "#a855f7";
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(o.x, baseY);
    ctx.lineTo(o.x + o.width / 2, baseY - o.height);
    ctx.lineTo(o.x + o.width, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Dragon — drawn as a neon block instead of a canvas emoji glyph, since
  // emoji color-font support is inconsistent across browsers/platforms.
  const dx = DRAGON_X;
  const dy = dragonY;
  ctx.fillStyle = "#00d4ff";
  ctx.shadowColor = "#00d4ff";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(dx, dy, DRAGON_SIZE, DRAGON_SIZE, 9);
  ctx.fill();
  ctx.shadowBlur = 0;

  // horn
  ctx.fillStyle = "#a855f7";
  ctx.beginPath();
  ctx.moveTo(dx + 6, dy);
  ctx.lineTo(dx + 14, dy - 9);
  ctx.lineTo(dx + 18, dy);
  ctx.closePath();
  ctx.fill();

  // tail
  ctx.beginPath();
  ctx.moveTo(dx, dy + DRAGON_SIZE * 0.6);
  ctx.lineTo(dx - 10, dy + DRAGON_SIZE * 0.8);
  ctx.lineTo(dx, dy + DRAGON_SIZE * 0.85);
  ctx.closePath();
  ctx.fill();

  // eye
  ctx.fillStyle = "#05050f";
  ctx.beginPath();
  ctx.arc(dx + DRAGON_SIZE * 0.72, dy + DRAGON_SIZE * 0.36, 2.6, 0, Math.PI * 2);
  ctx.fill();
}

export default function DragonGame({ onClose }) {
  const [stage, setStage] = useState("name"); // name | playing | over
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [score, setScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const rafRef = useRef(null);

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

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (!g || g.ended || g.dragonY < GROUND_Y) return;
    g.velocity = JUMP_VELOCITY;
  }, []);

  const startGame = () => {
    const name = username.trim() || "Player";
    saveUsername(name);
    setUsername(name);

    gameRef.current = {
      dragonY: GROUND_Y,
      velocity: 0,
      obstacles: [],
      distance: 0,
      speed: START_SPEED,
      spawnTimer: 0,
      nextSpawn: 900,
      name,
      ended: false,
    };
    setScore(0);
    setIsNewRecord(false);
    setStage("playing");
  };

  useEffect(() => {
    if (stage !== "playing") return;
    const onKey = (e) => {
      if (e.code === "Space" || e.key === "ArrowUp" || e.key === " ") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stage, jump]);

  useEffect(() => {
    if (stage !== "playing") return;
    const ctx = canvasRef.current.getContext("2d");
    let last = performance.now();

    const loop = (now) => {
      const dt = Math.min(now - last, 500) / 16.67;
      last = now;
      const g = gameRef.current;
      if (!g || g.ended) return;

      g.velocity += GRAVITY * dt;
      g.dragonY += g.velocity * dt;
      if (g.dragonY > GROUND_Y) {
        g.dragonY = GROUND_Y;
        g.velocity = 0;
      }

      g.speed = Math.min(MAX_SPEED, START_SPEED + g.distance / 4000);
      g.distance += g.speed * dt;

      g.spawnTimer += dt * 16.67;
      if (g.spawnTimer > g.nextSpawn) {
        g.spawnTimer = 0;
        g.nextSpawn = 750 + Math.random() * 700;
        g.obstacles.push(makeObstacle());
      }

      const dragonBox = { x: DRAGON_X + 6, y: g.dragonY + 4, w: DRAGON_SIZE - 14, h: DRAGON_SIZE - 10 };
      const baseY = GROUND_Y + DRAGON_SIZE;
      let collided = false;
      g.obstacles.forEach((o) => {
        o.x -= g.speed * dt;
        const obsBox = { x: o.x + 3, y: baseY - o.height, w: o.width - 6, h: o.height };
        if (
          dragonBox.x < obsBox.x + obsBox.w &&
          dragonBox.x + dragonBox.w > obsBox.x &&
          dragonBox.y < obsBox.y + obsBox.h &&
          dragonBox.y + dragonBox.h > obsBox.y
        ) {
          collided = true;
        }
      });
      g.obstacles = g.obstacles.filter((o) => o.x > -40);

      const newScore = Math.floor(g.distance / 20);
      setScore(newScore);
      drawFrame(ctx, g.dragonY, g.obstacles, g.distance);

      if (collided) {
        g.ended = true;
        endGame(newScore, g.name);
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage, endGame]);

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
            width={W}
            height={H}
            onClick={jump}
            onTouchStart={(e) => { e.preventDefault(); jump(); }}
            className="rounded-lg touch-none cursor-pointer"
            style={{ width: "100%", maxWidth: W, height: "auto", aspectRatio: `${W} / ${H}`, border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <button
            onClick={jump}
            className="btn-secondary rounded-xl px-8 py-3 font-semibold text-sm mt-4"
          >
            Jump ↑
          </button>
          <p className="text-slate-600 text-[11px] mt-3">Press Space / Up, or tap the button to jump</p>
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
