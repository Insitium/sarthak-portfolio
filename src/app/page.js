"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import sarthak from "../../public/sarthak.jpg";
import { AiFillGithub, AiFillLinkedin, AiFillYoutube } from "react-icons/ai";
import { Brain, Code2, Smartphone, Sparkles, Zap } from "lucide-react";
import Chatbot from "../components/Chatbot";

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 52, delay = 900) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return { displayed, done };
}

// ── Data ──────────────────────────────────────────────────────────────────────
const skillCategories = [
  {
    name: "AI & Machine Learning",
    icon: <Brain size={22} />,
    colorClass: "text-purple-400",
    borderClass: "border-purple-500/25 hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]",
    skills: ["Python", "Scikit-learn", "Pandas", "NumPy", "OpenAI API", "ML Regression", "EDA", "Predictive Analytics"],
  },
  {
    name: "Mobile Development",
    icon: <Smartphone size={22} />,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/25 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,212,255,0.12)]",
    skills: ["React Native", "Android", "Jetpack Compose", "Kotlin", "MVVM Architecture", "Firebase"],
  },
  {
    name: "Web & Backend",
    icon: <Code2 size={22} />,
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/25 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)]",
    skills: ["React.js", "Next.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "SQL"],
  },
];

const projects = [
  {
    title: "Alumni Portal",
    category: "Mobile Application",
    badge: "React Native",
    badgeClass: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
    description:
      "A full-featured social platform for alumni — real-time posts, comments, authentication, search, and profile editing. React Native frontend with Firebase as the entire backend.",
    tech: ["React Native", "Firebase", "Auth", "Realtime DB"],
    videoId: "F2YT74ygsXc",
    gradientBg: "from-cyan-900/20 to-blue-900/20",
    hoverBorder: "hover:border-cyan-500/50 hover:shadow-[0_0_35px_rgba(6,182,212,0.15)]",
  },
  {
    title: "Housing Price Predictor",
    category: "AI / Machine Learning",
    badge: "ML Project",
    badgeClass: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    description:
      "Trained regression models on the Boston Housing dataset to predict property prices. Deep EDA, feature engineering, and model evaluation with NumPy, Pandas, and Scikit-learn.",
    tech: ["Python", "NumPy", "Pandas", "Scikit-learn", "Regression"],
    videoId: "ttNy2XOnuqA",
    gradientBg: "from-purple-900/20 to-pink-900/20",
    hoverBorder: "hover:border-purple-500/50 hover:shadow-[0_0_35px_rgba(168,85,247,0.15)]",
  },
  {
    title: "AI Portfolio Assistant",
    category: "AI Integration",
    badge: "Live on this site",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    description:
      "A GPT-powered conversational AI built directly into this portfolio. It knows everything about my projects and skills. Try it — it's live in the bottom-right corner right now.",
    tech: ["OpenAI API", "GPT-3.5", "Next.js", "React"],
    isLive: true,
    gradientBg: "from-emerald-900/20 to-teal-900/20",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]",
  },
];

const navItems = ["About", "Skills", "Projects"];

// Deterministic particle colours by index
const PARTICLE_COLORS = ["0,212,255", "168,85,247", "16,185,129"];

export default function Home() {
  const cursorRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const { displayed: subtitle, done: subtitleDone } = useTypewriter("Full-Stack Developer & AI Engineer");

  // ── Cursor glow (no re-render on move) ──────────────────────────────────
  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;
    const onMove = (e) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
      el.style.opacity = "1";
    };
    const onLeave = () => { el.style.opacity = "0"; };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // ── Generate particles client-side only (avoids SSR hydration mismatch) ──
  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        x: (i * 3.7 + 5) % 100,
        y: (i * 7.1 + 10) % 100,
        size: (i % 4) * 0.6 + 1,
        delay: (i * 0.43) % 12,
        duration: (i % 5) * 4 + 18,
        opacity: (i % 5) * 0.08 + 0.12,
        color: PARTICLE_COLORS[i % 3],
      }))
    );
  }, []);

  // ── Scroll reveal via IntersectionObserver ───────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── 3-D card tilt ────────────────────────────────────────────────────────
  const handleTilt = useCallback((e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-6px)`;
  }, []);

  const resetTilt = useCallback((e) => {
    e.currentTarget.style.transform = "";
  }, []);

  return (
    <div className="min-h-screen bg-[#05050f] text-slate-300">
      {/* ── Cursor glow ── */}
      <div
        ref={cursorRef}
        className="cursor-glow"
        style={{ opacity: 0, left: "-999px", top: "-999px" }}
      />

      {/* ── Fixed Nav ── */}
      <header
        className="fixed top-0 left-0 w-full z-50 border-b border-white/[0.05]"
        style={{ background: "rgba(5,5,15,0.85)", backdropFilter: "blur(18px)" }}
      >
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="gradient-text font-bold text-xl tracking-tight logo-glow cursor-default select-none">SV</span>

          <ul className="hidden sm:flex gap-8 text-sm text-slate-500">
            {navItems.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="nav-link cursor-pointer"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="https://www.linkedin.com/in/sarthak-vashistha/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-white text-sm px-5 py-2 rounded-lg font-semibold flex items-center gap-2"
          >
            <AiFillLinkedin size={16} /> Connect
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section
        id="about"
        className="grid-bg min-h-screen flex items-center justify-center pt-24 pb-16 px-6 relative overflow-hidden"
      >
        {/* Floating particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: `rgba(${p.color}, ${p.opacity})`,
              animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        {/* Ambient glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }}
        />

        <div className="max-w-6xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left" style={{ animation: "fadeInUp 0.8s ease forwards" }}>
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" style={{ animation: "ping-slow 2s ease infinite" }} />
              Open to opportunities
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Sarthak<br />
              <span className="gradient-text">Vashistha</span>
            </h1>

            {/* Typewriter subtitle */}
            <p className="text-lg text-slate-400 mb-3 font-medium min-h-[1.75rem]">
              {subtitle}
              {!subtitleDone && <span className="tw-cursor" />}
            </p>

            <p className="text-slate-500 max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed text-sm">
              I build intelligent, production-ready applications — from AI-powered chatbots and ML models to cross-platform mobile apps. Clean code, real results.
            </p>

            {/* CTA */}
            <div className="flex gap-3 justify-center lg:justify-start flex-wrap mb-10">
              <a
                href="https://www.linkedin.com/in/sarthak-vashistha/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
              >
                <AiFillLinkedin size={17} />
                Let&apos;s Connect
              </a>
              <a
                href="https://github.com/Insitium"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
              >
                <AiFillGithub size={17} />
                GitHub
              </a>
            </div>

            {/* Socials */}
            <div className="flex gap-5 justify-center lg:justify-start text-slate-600 text-2xl">
              <a href="https://www.linkedin.com/in/sarthak-vashistha/" target="_blank" rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">
                <AiFillLinkedin />
              </a>
              <a href="https://github.com/Insitium" target="_blank" rel="noopener noreferrer"
                className="hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">
                <AiFillGithub />
              </a>
              <a href="https://www.youtube.com/@sarthakvashistha6290/videos" target="_blank" rel="noopener noreferrer"
                className="hover:text-red-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
                <AiFillYoutube />
              </a>
            </div>
          </div>

          {/* Photo */}
          <div className="relative flex-shrink-0" style={{ animation: "fadeIn 1s ease 0.3s both" }}>
            <div
              className="w-60 h-60 lg:w-72 lg:h-72 float-animation rounded-full photo-glow border-2 overflow-hidden"
              style={{ borderColor: "rgba(0,212,255,0.35)" }}
            >
              <Image
                src={sarthak}
                alt="Sarthak Vashistha"
                width={288}
                height={288}
                className="object-cover w-full h-full"
                priority
              />
            </div>

            {/* Spinning ring */}
            <div
              className="absolute -inset-6 rounded-full spin-slow"
              style={{ border: "1px dashed rgba(168,85,247,0.25)" }}
            />
            {/* Second ring */}
            <div
              className="absolute -inset-10 rounded-full"
              style={{
                border: "1px solid rgba(0,212,255,0.08)",
                animation: "spin-slow 35s linear infinite reverse",
              }}
            />

            {/* Floating badge */}
            <div className="absolute -bottom-3 -right-3 bg-[#0d0d1f] border border-cyan-500/30 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="text-xs text-slate-300 font-medium">AI Engineer</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills" className="py-28 px-6 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(0,212,255,0.25), transparent)" }}
        />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              What I <span className="gradient-text">Build</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
              From training ML models to shipping cross-platform apps — here&apos;s everything I bring to the table.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {skillCategories.map((cat, i) => (
              <div
                key={cat.name}
                className={`glow-card anim-border rounded-2xl p-7 border transition-all duration-300 ${cat.borderClass} reveal-scale`}
                style={{ transitionDelay: `${i * 110}ms` }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <div className={`mb-3 ${cat.colorClass}`}>{cat.icon}</div>
                <h3 className={`text-base font-semibold mb-5 ${cat.colorClass}`}>{cat.name}</h3>
                <div className="flex flex-wrap gap-2 stagger">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="skill-badge text-xs px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-28 px-6 relative">
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(168,85,247,0.25), transparent)" }}
        />

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-up">
            <h2 className="text-4xl font-bold text-white mb-4">
              Projects &amp; <span className="gradient-text">AI Work</span>
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
              Real things I&apos;ve built — mobile apps, machine learning models, and live AI integrations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div
                key={project.title}
                className={`glow-card anim-border rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-300 bg-gradient-to-br ${project.gradientBg} ${project.hoverBorder} reveal-up`}
                style={{ transitionDelay: `${i * 120}ms` }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                {/* Media */}
                {project.videoId && (
                  <div className="aspect-video w-full">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${project.videoId}`}
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {project.isLive && (
                  <div className="aspect-video w-full bg-gradient-to-br from-emerald-950/60 to-teal-950/60 flex items-center justify-center relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: "linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                      }}
                    />
                    <div className="text-center relative z-10">
                      <div className="text-5xl mb-3">🤖</div>
                      <p className="text-emerald-400 text-sm font-semibold">AI Assistant — Live</p>
                      <p className="text-slate-500 text-xs mt-1">Bottom-right corner →</p>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full" style={{ animation: "ping-slow 1.5s ease infinite" }} />
                      <span className="text-emerald-400 text-xs font-medium">Live</span>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium inline-block mb-3 ${project.badgeClass}`}>
                    {project.badge}
                  </span>
                  <h3 className="text-white font-semibold text-lg mb-2 leading-snug">{project.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="skill-badge text-xs px-2.5 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Callout Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden reveal-scale"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(168,85,247,0.06) 50%, rgba(16,185,129,0.06) 100%)",
              border: "1px solid rgba(0,212,255,0.15)",
            }}
          >
            {/* Corner glow */}
            <div
              className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)" }}
            />
            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)" }}
            />

            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Zap size={26} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Let&apos;s build something <span className="gradient-text">intelligent</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
                I combine mobile, web, and AI engineering to ship products that actually work. If you have an idea, let&apos;s talk.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="https://www.linkedin.com/in/sarthak-vashistha/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-white px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                >
                  <AiFillLinkedin size={17} />
                  Connect on LinkedIn
                </a>
                <a
                  href="mailto:vashistha.sarthak31@gmail.com"
                  className="btn-secondary px-6 py-3 rounded-xl font-semibold text-sm"
                >
                  Send an Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="gradient-text font-bold text-xl tracking-tight mb-1">Sarthak Vashistha</p>
            <p className="text-slate-600 text-xs">Full-Stack Developer &amp; AI Engineer</p>
          </div>
          <div className="flex gap-5 text-slate-600 text-xl">
            <a href="https://www.linkedin.com/in/sarthak-vashistha/" target="_blank" rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">
              <AiFillLinkedin />
            </a>
            <a href="https://github.com/Insitium" target="_blank" rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]">
              <AiFillGithub />
            </a>
            <a href="https://www.youtube.com/@sarthakvashistha6290/videos" target="_blank" rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
              <AiFillYoutube />
            </a>
          </div>
          <p className="text-slate-700 text-xs">Built with Next.js &amp; Tailwind</p>
        </div>
      </footer>

      {/* ── AI Chatbot ── */}
      <Chatbot />
    </div>
  );
}
