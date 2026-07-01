"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Trophy, Rocket, Star, Heart, Zap, Cloud, Moon, Sun, Flame } from "lucide-react";
import { loadUsername, saveUsername, loadLeaderboard, pushScore } from "./gameStorage";

const LB_KEY = "sv_memory_leaderboard";
const ICONS = [Rocket, Star, Heart, Zap, Cloud, Moon, Sun, Flame];
const FLIP_BACK_DELAY = 700;

function shuffledDeck() {
  const pairs = ICONS.flatMap((Icon, i) => [{ iconIndex: i }, { iconIndex: i }]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((card, i) => ({ ...card, key: i, flipped: false, matched: false }));
}

export default function MemoryMatch({ onClose }) {
  const [stage, setStage] = useState("name"); // name | playing | over
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedKeys, setFlippedKeys] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [locked, setLocked] = useState(false);

  const nameRef = useRef(username);
  nameRef.current = username;
  const cardsRef = useRef(cards);

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

    const deck = shuffledDeck();
    cardsRef.current = deck;
    setCards(deck);
    setFlippedKeys([]);
    setMoves(0);
    setSeconds(0);
    setIsNewRecord(false);
    setLocked(false);
    setStage("playing");
  };

  useEffect(() => {
    if (stage !== "playing") return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const handleCardClick = (key) => {
    if (locked) return;
    const card = cardsRef.current.find((c) => c.key === key);
    if (!card || card.flipped || card.matched) return;
    if (flippedKeys.length === 2) return;

    const updatedCards = cardsRef.current.map((c) => (c.key === key ? { ...c, flipped: true } : c));
    cardsRef.current = updatedCards;
    setCards(updatedCards);

    const nextFlipped = [...flippedKeys, key];
    setFlippedKeys(nextFlipped);

    if (nextFlipped.length === 2) {
      setLocked(true);
      const finishedMoves = moves + 1;
      setMoves(finishedMoves);

      const [firstKey, secondKey] = nextFlipped;
      const first = updatedCards.find((c) => c.key === firstKey);
      const second = updatedCards.find((c) => c.key === secondKey);
      const isMatch = first.iconIndex === second.iconIndex;

      setTimeout(() => {
        const resolved = cardsRef.current.map((c) => {
          if (c.key === firstKey || c.key === secondKey) {
            return isMatch ? { ...c, matched: true } : { ...c, flipped: false };
          }
          return c;
        });
        cardsRef.current = resolved;
        setCards(resolved);
        setFlippedKeys([]);
        setLocked(false);

        if (resolved.every((c) => c.matched)) {
          const finalScore = Math.max(10, 500 - finishedMoves * 15 - seconds * 3);
          endGame(finalScore, nameRef.current || "Player");
        }
      }, isMatch ? 250 : FLIP_BACK_DELAY);
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
          <p className="text-slate-400 text-sm mb-3 flex gap-4">
            <span>Moves: <span className="text-cyan-400 font-semibold">{moves}</span></span>
            <span>Time: <span className="text-cyan-400 font-semibold">{seconds}s</span></span>
          </p>
          <div
            className="grid grid-cols-4 gap-2 p-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", width: "min(90vw, 360px)" }}
          >
            {cards.map((card) => {
              const Icon = ICONS[card.iconIndex];
              const revealed = card.flipped || card.matched;
              return (
                <button
                  key={card.key}
                  onClick={() => handleCardClick(card.key)}
                  className="aspect-square rounded-lg flex items-center justify-center transition-colors"
                  style={{
                    background: card.matched
                      ? "rgba(16,185,129,0.15)"
                      : revealed
                      ? "rgba(0,212,255,0.12)"
                      : "rgba(255,255,255,0.05)",
                    border: card.matched ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {revealed && <Icon size={22} className={card.matched ? "text-emerald-400" : "text-cyan-400"} />}
                </button>
              );
            })}
          </div>
          <p className="text-slate-600 text-[11px] mt-3">Tap two cards to find a matching pair</p>
        </div>
      )}

      {stage === "over" && (
        <div className="text-center">
          <p className="text-white font-bold text-xl mb-1">All Matched!</p>
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
