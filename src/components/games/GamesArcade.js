"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Gamepad2, Sparkles } from "lucide-react";

const loading = () => <div className="py-16 text-center text-slate-500 text-sm">Loading game…</div>;

const SnakeGame = dynamic(() => import("./SnakeGame"), { ssr: false, loading });
const DragonGame = dynamic(() => import("./DragonGame"), { ssr: false, loading });
const Game2048 = dynamic(() => import("./Game2048"), { ssr: false, loading });
const MemoryMatch = dynamic(() => import("./MemoryMatch"), { ssr: false, loading });

const GAMES = [
  { id: "snake", emoji: "🐍", name: "Snake", desc: "The classic Nokia game", Component: SnakeGame },
  { id: "dragon", emoji: "🐉", name: "Jumping Dragon", desc: "Jump the spikes, beat your best", Component: DragonGame },
  { id: "2048", emoji: "🔢", name: "2048", desc: "Merge tiles to reach 2048", Component: Game2048 },
  { id: "memory", emoji: "🧠", name: "Memory Match", desc: "Find every pair, fewer moves wins", Component: MemoryMatch },
];

export default function GamesArcade() {
  const [expanded, setExpanded] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const ActiveComponent = GAMES.find((g) => g.id === activeGame)?.Component;

  return (
    <section id="arcade" className="py-16 px-6 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        {!expanded ? (
          <button
            onClick={() => setExpanded(true)}
            className="glow-card group relative w-full sm:w-auto inline-flex items-center gap-3 rounded-2xl px-8 py-6 border-2 transition-all duration-300 hover:-translate-y-1"
            style={{
              borderColor: "rgba(0,212,255,0.35)",
              background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(168,85,247,0.08) 100%)",
              boxShadow: "0 0 40px rgba(0,212,255,0.15), 0 0 70px rgba(168,85,247,0.08)",
              animation: "glowPulse 3.5s ease-in-out infinite",
            }}
          >
            <span
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #00d4ff, #a855f7)" }}
            >
              <Gamepad2 size={20} className="text-white" />
            </span>
            <span className="text-left">
              <span className="block font-bold text-white text-base md:text-lg group-hover:text-cyan-300 transition-colors">
                Didn&apos;t like the site? Play some games instead
              </span>
              <span className="block text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                <Sparkles size={12} className="text-cyan-400" /> 4 games inside — click to load
              </span>
            </span>
          </button>
        ) : (
          <div className="glow-card rounded-2xl border border-white/[0.06] p-6 md:p-10">
            <p className="font-bold text-white text-lg md:text-xl mb-8">
              You did not like the site. That is fine — at least play some games here.
            </p>

            {!ActiveComponent ? (
              <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
                {GAMES.map((game) => (
                  <button
                    key={game.id}
                    onClick={() => setActiveGame(game.id)}
                    className="glow-card rounded-xl p-5 border border-white/[0.06] hover:border-cyan-400/40 transition-colors text-left"
                  >
                    <p className="font-semibold text-white">{game.emoji} {game.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{game.desc}</p>
                  </button>
                ))}
              </div>
            ) : (
              <ActiveComponent onClose={() => setActiveGame(null)} />
            )}

            <button
              onClick={() => { setExpanded(false); setActiveGame(null); }}
              className="mt-8 text-slate-600 text-xs hover:text-slate-400 transition-colors"
            >
              Collapse section
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
