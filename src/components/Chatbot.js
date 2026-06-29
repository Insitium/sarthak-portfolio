"use client";
import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";

const QA = [
  {
    patterns: ["skill", "know", "tech", "language", "stack", "expert", "good at", "use"],
    answer:
      "I work across AI/ML (Python, Scikit-learn, Pandas, NumPy), mobile (React Native, Android, Jetpack Compose, Kotlin), and web/backend (React.js, Next.js, Node.js, MongoDB, Express). Basically: full-stack + AI.",
  },
  {
    patterns: ["ai", "machine learning", "ml", "model", "gpt", "openai", "data science", "python", "predict"],
    answer:
      "Sarthak builds real AI — trained ML regression models on the Boston Housing dataset, and integrates GPT/OpenAI APIs into production apps. He also does EDA, feature engineering, and predictive analytics with Pandas & Scikit-learn.",
  },
  {
    patterns: ["project", "build", "work", "app", "portfolio", "show", "demo", "made"],
    answer:
      "Key projects: 🎓 Alumni Portal (React Native + Firebase — real-time posts, auth, comments), 🤖 Housing Price Predictor (ML regression in Python), and this AI assistant you're talking to right now! Check the Projects section above.",
  },
  {
    patterns: ["alumni", "portal", "firebase", "social"],
    answer:
      "The Alumni Portal is a full mobile social platform built with React Native and Firebase — features include login/auth, posting, comments, search, and profile editing. It's a production-grade app.",
  },
  {
    patterns: ["housing", "boston", "price", "regression", "predict"],
    answer:
      "The Housing Price Predictor uses regression algorithms trained on the Boston Housing dataset. Sarthak did full EDA, feature engineering, and model evaluation using NumPy, Pandas, and Scikit-learn.",
  },
  {
    patterns: ["mobile", "android", "react native", "kotlin", "jetpack", "compose", "mvvm"],
    answer:
      "For mobile, Sarthak builds in React Native (cross-platform) and native Android using Jetpack Compose + Kotlin with MVVM architecture. Both are in production-ready projects.",
  },
  {
    patterns: ["web", "react", "next", "node", "express", "mongo", "backend", "api", "rest"],
    answer:
      "On the web side: React.js + Next.js for frontends (this site is Next.js!), Node.js + Express for APIs, and MongoDB for the database. REST APIs are second nature.",
  },
  {
    patterns: ["hire", "contact", "work together", "freelance", "available", "opportunity", "job", "reach"],
    answer:
      "Sarthak is open to opportunities! Best ways to reach him: LinkedIn (linkedin.com/in/sarthak-vashistha) or email vashistha.sarthak31@gmail.com. There's also a 'Let's build something' section at the bottom of this page.",
  },
  {
    patterns: ["resume", "cv", "experience", "background"],
    answer:
      "You can view Sarthak's full resume via the Resume button in the top nav — it's hosted on Google Drive. His background spans AI/ML, mobile development, and full-stack web.",
  },
  {
    patterns: ["github", "code", "repo", "repository", "open source"],
    answer:
      "Sarthak's code lives at github.com/Insitium — check it out for his projects and repos!",
  },
  {
    patterns: ["youtube", "video", "watch", "demo"],
    answer:
      "Sarthak has demo videos of his projects on YouTube (@sarthakvashistha6290). The project cards above embed them directly so you can watch right here.",
  },
  {
    patterns: ["who", "about", "sarthak", "yourself", "introduce", "tell me"],
    answer:
      "Sarthak Vashistha is a Full-Stack Developer & AI Engineer. He builds everything from ML models and GPT-powered apps to React Native mobile apps and web backends. Passionate about turning complex problems into clean, working software.",
  },
  {
    patterns: ["hello", "hi", "hey", "sup", "yo", "howdy", "greet"],
    answer:
      "Hey! 👋 I'm Sarthak's portfolio assistant. Ask me anything — his skills, projects, how to reach him, whatever you need!",
  },
  {
    patterns: ["thanks", "thank", "cool", "awesome", "great", "nice", "good", "perfect"],
    answer:
      "Glad I could help! Feel free to ask anything else, or hit him up on LinkedIn if you want to connect directly.",
  },
];

const FALLBACK =
  "I'm not sure about that one! Try asking about Sarthak's skills, projects, AI/ML work, or how to contact him.";

function getReply(input) {
  const lower = input.toLowerCase();
  for (const item of QA) {
    if (item.patterns.some((p) => lower.includes(p))) {
      return item.answer;
    }
  }
  return FALLBACK;
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm Sarthak's portfolio assistant. Ask me about his projects, skills, or how to reach him 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const chatRef = useRef(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (chatRef.current && !chatRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input.trim() };
    const reply = { role: "assistant", content: getReply(input.trim()) };
    setMessages((prev) => [...prev, userMsg, reply]);
    setInput("");
  };

  return (
    <>
      {/* ── Toggle button ── */}
      {!open && (
        <div className="fixed bottom-6 right-6 flex flex-col items-center gap-2 z-50">
          <div
            className="text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg"
            style={{ background: "linear-gradient(135deg, #00d4ff, #a855f7)" }}
          >
            Talk to me
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open AI assistant"
            className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #00d4ff, #a855f7)",
              boxShadow: "0 0 24px rgba(0,212,255,0.45), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            <Bot size={24} className="text-white" />
          </button>
        </div>
      )}

      {/* ── Chat window ── */}
      {open && (
        <div
          ref={chatRef}
          className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "rgba(8,8,20,0.97)",
            border: "1px solid rgba(0,212,255,0.2)",
            boxShadow:
              "0 0 50px rgba(0,212,255,0.12), 0 0 80px rgba(168,85,247,0.08), 0 25px 60px rgba(0,0,0,0.7)",
            backdropFilter: "blur(24px)",
            maxHeight: "520px",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #00d4ff, #a855f7)" }}
              >
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">Portfolio Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 bg-emerald-400 rounded-full"
                    style={{ animation: "ping-slow 2s ease infinite" }}
                  />
                  <span className="text-emerald-400 text-[10px] font-medium">Always online · Free</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Close chat"
            >
              <X size={17} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
            style={{ maxHeight: "340px" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-lg mr-2 flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.25), rgba(168,85,247,0.25))" }}
                  >
                    <Sparkles size={12} className="text-cyan-400" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-slate-300 border border-white/[0.07] rounded-bl-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg, #00d4ff, #a855f7)" }
                      : { background: "rgba(255,255,255,0.04)" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3.5 border-t border-white/[0.06] flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about Sarthak..."
                className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(0,212,255,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:opacity-90 disabled:opacity-40 active:scale-95 flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #00d4ff, #a855f7)" }}
              >
                <Send size={15} className="text-white" />
              </button>
            </div>
            <p className="text-slate-700 text-[10px] text-center mt-2">No API · No cost · Instant</p>
          </div>
        </div>
      )}
    </>
  );
}
