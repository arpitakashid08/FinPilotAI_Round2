// FinPilot AI — Sphere Edition
// Design: 3D glowing orbs, starfield, NO rectangular cards
// Inspired by AstroFin mockup: organic spheres, particle fields, orbital data
import { useState, useEffect, useRef } from "react";

const delay = ms => new Promise(r => setTimeout(r, ms));
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const fallbackProfile = { name: "Arjun Sharma", email: "arjun@finpilot.ai", balance: 124500, riskScore: 0.28, lastLogin: "Feb 17, 2026" };
const fallbackUpdates = {
  latestFinance: [
    { title: "RBI hints at cautious rate path amid inflation softening", cat: "Macro", time: "2h ago", sentiment: "neutral" },
    { title: "Digital lending growth accelerates across tier-2 markets", cat: "Fintech", time: "4h ago", sentiment: "bullish" },
    { title: "Global bond yields stabilize after volatile session", cat: "Bonds", time: "6h ago", sentiment: "neutral" },
  ],
  stockAlerts: [
    { ticker: "NIFTY", price: 22840, change: 0.86, color: "#34d399" },
    { ticker: "BANKNIFTY", price: 48820, change: -0.42, color: "#f87171" },
    { ticker: "RELIANCE", price: 2934, change: 1.12, color: "#63b3ff" },
  ],
  knowledge: [
    { question: "What is credit utilization?", answer: "It is your used credit divided by total credit limit. Keeping it under 30% can significantly improve your score." },
    { question: "How do repo rates affect EMIs?", answer: "When policy rates rise, floating-rate loans usually become costlier and monthly EMIs can increase." },
    { question: "Why does fraud monitoring flag device changes?", answer: "First-time device + unusual transaction pattern is a common anomaly signal to prevent account takeover." },
  ],
};
const fallbackFeatureModules = {
  crossSell: {
    id: "crossSell",
    title: "Intelligent Cross-Sell Engine",
    oneLiner: "Suggests right products to the right customer at the right time without spam.",
    whatItDoes: [
      "Scores customer-product affinity in real time.",
      "Ranks recommendations by trust, eligibility, and lifecycle stage.",
      "Suppresses noisy offers using fatigue and consent-aware controls.",
    ],
    aiMlUsed: [
      "Recommendation systems (hybrid collaborative + rule-guided)",
      "Customer clustering and propensity modeling",
      "Contextual bandits for next-best-offer timing",
    ],
    techStack: ["Python", "FastAPI", "Feature Store", "Kafka stream triggers", "React in-app widgets"],
    appFunctions: [
      "Embedded offer rail inside dashboard and RM screens",
      "Explain-why tooltip for each recommendation",
      "Campaign performance telemetry loop",
    ],
  },
  rmCopilot: {
    id: "rmCopilot",
    title: "Banker / RM Co-Pilot",
    oneLiner: "Decision assistant for relationship managers with safer, faster customer actions.",
    whatItDoes: [
      "Surfaces risk-aware product suggestions before banker outreach.",
      "Builds meeting briefs from transaction and profile context.",
      "Generates compliant response drafts for customer queries.",
    ],
    aiMlUsed: [
      "Decision intelligence with risk scoring",
      "Retrieval-augmented generation on policy/product docs",
      "Conversation summarization and intent extraction",
    ],
    techStack: ["Python", "LLM APIs", "RBAC admin panel", "Audit logs", "CRM connector"],
    appFunctions: [
      "RM cockpit timeline with AI recommendations",
      "Pre-call prep cards and objection handling prompts",
      "Post-call summary + follow-up task generation",
    ],
  },
  compliance: {
    id: "compliance",
    title: "Privacy & Compliance Layer",
    oneLiner: "Ensures data protection, explainability, and regulator-ready controls.",
    whatItDoes: [
      "Enforces consent, purpose limitation, and role-based data access.",
      "Logs model decisions for explainability and review.",
      "Monitors policy violations and escalates alerts automatically.",
    ],
    aiMlUsed: [
      "Explainable AI traces (reason codes + feature attribution)",
      "Anomaly detection on access patterns",
      "Policy-rule + ML hybrid compliance checks",
    ],
    techStack: ["AES-256 encryption", "RBAC", "Private cloud", "Tokenization", "Immutable audit trail"],
    appFunctions: [
      "Compliance pulse monitor inside operations dashboard",
      "One-click audit evidence export",
      "Automated breach-risk scoring and alerting",
    ],
  },
};

async function callApi(path, opts = {}, fallback) {
  try {
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (!res.ok) throw new Error("request_failed");
    return await res.json();
  } catch {
    await delay(350);
    return typeof fallback === "function" ? fallback() : fallback;
  }
}

const api = {
  login: async ({ email = "", password = "" } = {}) =>
    callApi("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, { otpSent: true }),
  verifyOTP: async ({ otp }) =>
    callApi("/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    }, otp === "123456" ? { success: true, token: "fp-local" } : { success: false, message: "Wrong OTP — try 123456" }),
  signup: async ({ name = "", email = "", password = "" } = {}) =>
    callApi("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    }, { success: true }),
  getProfile: async (token = "") =>
    callApi("/auth/profile", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }, fallbackProfile),
  getUpdates: async () => callApi("/updates", {}, fallbackUpdates),
  getFeatureModules: async () => callApi("/features/modules", {}, fallbackFeatureModules),
  voiceReply: async ({ transcript = "" }) =>
    callApi("/voice/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript }),
    }, { transcript, reply: "Voice noted. Market remains mixed with selective upside in high-quality assets." }),
  askAstro: async ({ message = "" }) =>
    callApi("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }, { reply: "Based on your current patterns, keep exposure diversified and track repayment health weekly." }),
};
const twin = { income: 85000, spending: 42000, liabilities: 12000, cashFlow: 31000, riskScore: 0.28 };

// ── GLOBAL STYLES ─────────────────────────────────────────────
function Styles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #root { height: 100%; }
      body { background: #030712; color: #e2eaff; font-family: 'Syne', sans-serif; -webkit-font-smoothing: antialiased; overflow: hidden; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-thumb { background: rgba(99,179,255,0.15); border-radius: 2px; }
      input, button { font-family: 'Syne', sans-serif; border: none; outline: none; }
      button { cursor: pointer; background: none; }

      @keyframes spin360   { to { transform: rotate(360deg); } }
      @keyframes spinRev   { to { transform: rotate(-360deg); } }
      @keyframes fadeUp    { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
      @keyframes orbFloat  { 0%,100%{transform:translateY(0) scale(1);} 40%{transform:translateY(-22px) scale(1.02);} 70%{transform:translateY(-10px) scale(0.99);} }
      @keyframes orbPulse  { 0%,100%{opacity:0.7;transform:scale(1);} 50%{opacity:1;transform:scale(1.08);} }
      @keyframes ringRot   { to { transform: rotate(360deg); } }
      @keyframes ringRotR  { to { transform: rotate(-360deg); } }
      @keyframes particleFly { 0%{opacity:0;transform:translate(0,0) scale(0);} 20%{opacity:1;} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0.3);} }
      @keyframes blink     { 0%,100%{opacity:1;} 50%{opacity:0;} }
      @keyframes dashDraw  { from{stroke-dashoffset:var(--len);} to{stroke-dashoffset:0;} }
      @keyframes ripple    { 0%{transform:scale(0.6);opacity:0.8;} 100%{transform:scale(2.2);opacity:0;} }
      @keyframes slideIn   { from{transform:translateX(-110%);} to{transform:translateX(0);} }
      @keyframes waveBar   { 0%,100%{transform:scaleY(0.35);} 50%{transform:scaleY(1);} }
      @keyframes countNum  { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }
      @keyframes typewriter{ from{width:0;} to{width:100%;} }
      @keyframes glowPing  { 0%{transform:scale(1);opacity:1;} 100%{transform:scale(2.8);opacity:0;} }
      @keyframes lightning { 0%,95%,100%{opacity:0;} 96%,99%{opacity:1;} }
      @keyframes introFade { 0%{opacity:1;} 80%{opacity:1;} 100%{opacity:0;} }
      @keyframes floatUp   { 0%{transform:translateY(0);opacity:1;} 100%{transform:translateY(-100vh);opacity:0;} }

      .nav-pill:hover { background: rgba(99,179,255,0.1) !important; color: #e2eaff !important; }
      .nav-pill:hover .pill-dot { opacity:1 !important; }
      .action-orb:hover { transform: scale(1.08); filter: brightness(1.15); }
      .glass-input:focus { border-color: rgba(99,179,255,0.5) !important; background: rgba(99,179,255,0.06) !important; }

      /* ── RESPONSIVE ── */
      @media (max-width: 640px) {
        .bottom-nav   { display: flex !important; }
        .desktop-sidebar { display: none !important; }
        .sphere-row   { flex-direction: column !important; align-items: center !important; gap: 12px !important; }
        .sphere-row > div:first-child { transform: scale(0.72); margin-bottom: -28px; }
        .page-content { padding: 16px 16px 90px !important; }
        .topbar-path  { display: none !important; }
        .topbar-date  { display: none !important; }
        .auth-card    { border-radius: 20px !important; padding: 32px 22px !important; }
        .hero-name    { font-size: 22px !important; }
        .balance-num  { font-size: 28px !important; }
        .orbit-label  { display: none !important; }
        .chat-wrap    { height: calc(100vh - 230px) !important; }
        .topbar-inner { padding: 12px 16px !important; }
      }
      @media (min-width: 641px) {
        .bottom-nav      { display: none !important; }
        .desktop-sidebar { display: flex !important; }
      }
    `;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ── MOBILE HOOK ───────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ── STARFIELD CANVAS ──────────────────────────────────────────
function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.0003 + 0.0001,
      twinkle: Math.random() * Math.PI * 2,
    }));
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.twinkle += s.speed * 60;
        const alpha = (Math.sin(s.twinkle) * 0.4 + 0.6) * s.a;
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 210, 255, ${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

// ── 3D SPHERE SVG ─────────────────────────────────────────────
function AstroSphere({ size = 320, color1, color2, glowColor, label, sublabel, variant = "default", animate = true }) {
  const c = size / 2;
  const r = size * 0.42;

  // Latitude/longitude lines for 3D wireframe effect
  const latLines = [-60, -30, 0, 30, 60];
  const lonLines = [0, 30, 60, 90, 120, 150];

  const toXY = (lat, lon, perspective = 1) => {
    const latR = (lat * Math.PI) / 180;
    const lonR = (lon * Math.PI) / 180;
    const x = r * Math.cos(latR) * Math.sin(lonR);
    const y = -r * Math.sin(latR);
    const z = r * Math.cos(latR) * Math.cos(lonR);
    const scale = perspective / (perspective + z / r);
    return { x: c + x * scale, y: c + y * scale, visible: z >= 0 };
  };

  // Lightning bolt paths for fraud variant
  const lightningPaths = variant === "fraud" ? [
    `M${c} ${c-r*0.8} L${c+r*0.2} ${c-r*0.2} L${c+r*0.05} ${c} L${c+r*0.35} ${c+r*0.7}`,
    `M${c-r*0.6} ${c-r*0.4} L${c-r*0.1} ${c+r*0.1} L${c-r*0.3} ${c+r*0.2} L${c} ${c+r*0.8}`,
    `M${c+r*0.7} ${c-r*0.3} L${c+r*0.3} ${c+r*0.2} L${c+r*0.5} ${c+r*0.4}`,
  ] : [];

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {/* Outer glow rings */}
      {animate && [1.4, 1.7, 2.1].map((scale, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: r * 2 * scale, height: r * 2 * scale,
          marginTop: -r * scale, marginLeft: -r * scale,
          borderRadius: "50%",
          border: `1px solid ${glowColor}`,
          opacity: 0.07 - i * 0.02,
          animation: `orbPulse ${4 + i * 1.5}s ${i * 0.8}s ease-in-out infinite`,
        }} />
      ))}

      {/* Ripple for active */}
      {variant === "default" && animate && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: r * 2.4, height: r * 2.4,
          marginTop: -r * 1.2, marginLeft: -r * 1.2,
          borderRadius: "50%",
          border: `1px solid ${glowColor}40`,
          animation: "ripple 3s ease-out infinite",
        }} />
      )}

      <svg width={size} height={size} style={{ animation: animate ? `orbFloat 6s ease-in-out infinite` : "none", overflow: "visible" }}>
        <defs>
          <radialGradient id={`sphGrad${variant}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor={color1} stopOpacity="0.9" />
            <stop offset="50%"  stopColor={color2} stopOpacity="0.7" />
            <stop offset="100%" stopColor="#030712" stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id={`sphGlow${variant}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"  stopColor={glowColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
          </radialGradient>
          <filter id={`blur${variant}`}>
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <clipPath id={`sphClip${variant}`}>
            <circle cx={c} cy={c} r={r} />
          </clipPath>
        </defs>

        {/* Glow backdrop */}
        <circle cx={c} cy={c} r={r * 1.5} fill={`url(#sphGlow${variant})`} filter={`url(#blur${variant})`} />

        {/* Main sphere body */}
        <circle cx={c} cy={c} r={r} fill={`url(#sphGrad${variant})`} />

        {/* Wireframe lines clipped to sphere */}
        <g clipPath={`url(#sphClip${variant})`} opacity="0.25">
          {latLines.map(lat => {
            const pts = Array.from({ length: 73 }, (_, i) => toXY(lat, i * 5));
            const d = pts.map((p, i) => `${i === 0 ? "M" : p.visible ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
            return <path key={lat} d={d} fill="none" stroke={glowColor} strokeWidth="0.8" opacity="0.6" />;
          })}
          {lonLines.map(lon => {
            const pts = Array.from({ length: 37 }, (_, i) => toXY(-90 + i * 5, lon));
            const d = pts.map((p, i) => `${i === 0 ? "M" : p.visible ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
            return <path key={lon} d={d} fill="none" stroke={glowColor} strokeWidth="0.8" opacity="0.6" />;
          })}
        </g>

        {/* Lightning for fraud */}
        {lightningPaths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#ff4444" strokeWidth="2"
            strokeLinejoin="round" opacity="0.9"
            style={{ animation: `lightning ${1.5 + i * 0.7}s ${i * 0.3}s ease-in-out infinite`,
              filter: "drop-shadow(0 0 6px #ff4444)" }} />
        ))}

        {/* Rotating orbit ring */}
        {variant !== "fraud" && (
          <ellipse cx={c} cy={c} rx={r * 1.25} ry={r * 0.28}
            fill="none" stroke={glowColor} strokeWidth="1" opacity="0.3"
            strokeDasharray="6 4"
            style={{ animation: `ringRot 12s linear infinite`, transformOrigin: `${c}px ${c}px` }} />
        )}

        {/* Sphere edge highlight */}
        <circle cx={c} cy={c} r={r} fill="none" stroke={glowColor} strokeWidth="1.5" opacity="0.4" />
        <circle cx={c - r * 0.25} cy={c - r * 0.28} r={r * 0.15}
          fill="none" stroke="white" strokeWidth="0.8" opacity="0.12" />

        {/* Inner specular highlight */}
        <ellipse cx={c - r * 0.2} cy={c - r * 0.3} rx={r * 0.22} ry={r * 0.12}
          fill="white" opacity="0.08" />
      </svg>

      {/* Center label overlay */}
      {label && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          {sublabel && <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase",
            color: `${glowColor}cc`, marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>{sublabel}</div>}
          <div style={{ fontSize: size * 0.1, fontWeight: 800, letterSpacing: "0.06em",
            background: `linear-gradient(135deg, white, ${glowColor})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            textShadow: "none", filter: `drop-shadow(0 0 20px ${glowColor}80)` }}>
            {label}
          </div>
        </div>
      )}
    </div>
  );
}

// ── INTRO ANIMATION ───────────────────────────────────────────
function Intro({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=black 1=sphere 2=text 3=fadeout

  useEffect(() => {
    const t0 = setTimeout(() => setPhase(1), 300);
    const t1 = setTimeout(() => setPhase(2), 1400);
    const t2 = setTimeout(() => setPhase(3), 2800);
    const t3 = setTimeout(onDone, 3500);
    return () => [t0,t1,t2,t3].forEach(clearTimeout);
  }, []);

  // Floating particles
  const particles = Array.from({ length: 24 }, (_, i) => ({
    angle: (i / 24) * Math.PI * 2,
    dist: 140 + Math.random() * 60,
    size: 2 + Math.random() * 3,
    delay: i * 0.08,
    color: i % 3 === 0 ? "#63b3ff" : i % 3 === 1 ? "#a78bfa" : "#34d399",
  }));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#030712",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 9999, overflow: "hidden",
      opacity: phase === 3 ? 0 : 1, transition: "opacity 0.7s ease",
    }}>
      <Starfield />

      {/* Background pulse */}
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(30,60,140,0.35) 0%, transparent 70%)",
        filter: "blur(40px)",
        opacity: phase >= 1 ? 1 : 0, transition: "opacity 1s ease",
      }} />

      {/* Sphere + particles container */}
      <div style={{
        position: "relative",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "scale(1)" : "scale(0.5)",
        transition: "all 1.1s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Particles orbiting */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {particles.map((p, i) => (
            <div key={i} style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: p.size, height: p.size, borderRadius: "50%",
              background: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              transform: `translate(${Math.cos(p.angle) * p.dist - p.size/2}px, ${Math.sin(p.angle) * p.dist - p.size/2}px)`,
              opacity: phase >= 1 ? 0.8 : 0,
              transition: `opacity 0.5s ease ${p.delay}s`,
              animation: phase >= 1 ? `orbPulse ${2 + Math.random() * 2}s ${p.delay}s ease-in-out infinite` : "none",
            }} />
          ))}
        </div>

        <AstroSphere
          size={280}
          color1="#1a3a8e" color2="#0d1f6e"
          glowColor="#63b3ff"
          label="FINPILOT"
          sublabel="AI"
          variant="default"
          animate={phase >= 1}
        />
      </div>

      {/* Text reveal */}
      <div style={{
        marginTop: 40, textAlign: "center",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.7s ease",
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase",
          color: "rgba(99,179,255,0.55)", marginBottom: 10,
        }}>Your Internal Banking Co-Pilot</div>

        {/* Animated loading dots */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: i === 2 ? 20 : 6, height: 6, borderRadius: 3,
              background: i === 2 ? "#63b3ff" : "rgba(99,179,255,0.25)",
              transition: "all 0.3s ease",
              animation: `blink ${1 + i * 0.1}s ${i * 0.15}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── GLASSMORPHIC INPUT ────────────────────────────────────────
function Input({ placeholder, type = "text", value, onChange, icon }) {
  return (
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.35, pointerEvents: "none" }}>{icon}</span>}
      <input className="glass-input" type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{
          width: "100%", padding: icon ? "14px 18px 14px 42px" : "14px 18px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 14, color: "#e2eaff", fontSize: 14,
          transition: "all 0.25s ease",
        }} />
    </div>
  );
}

function Btn({ children, onClick, loading, outline }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: "100%", padding: "14px",
      background: outline ? "transparent" : "linear-gradient(135deg, rgba(99,179,255,0.18), rgba(167,139,250,0.18))",
      border: `1px solid ${outline ? "rgba(255,255,255,0.08)" : "rgba(99,179,255,0.3)"}`,
      borderRadius: 14, color: outline ? "rgba(226,234,255,0.4)" : "#e2eaff",
      fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.04em",
      opacity: loading ? 0.6 : 1, transition: "all 0.2s ease",
      backdropFilter: "blur(10px)",
    }}
      onMouseEnter={e => { if(!loading && !outline) e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,179,255,0.28),rgba(167,139,250,0.28))"; }}
      onMouseLeave={e => { if(!loading && !outline) e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,179,255,0.18),rgba(167,139,250,0.18))"; }}
    >
      {loading
        ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
            <span style={{ width:14,height:14,border:"2px solid rgba(99,179,255,0.2)",borderTop:"2px solid #63b3ff",borderRadius:"50%",display:"inline-block",animation:"spin360 0.7s linear infinite" }} />
            Processing
          </span>
        : children}
    </button>
  );
}

// ── AUTH WRAPPER ──────────────────────────────────────────────
function AuthWrap({ children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#030712", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Starfield />
      <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,40,120,0.3) 0%, transparent 70%)", filter: "blur(50px)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 420,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 28, padding: "44px 40px",
        backdropFilter: "blur(24px)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        animation: "fadeUp 0.55s ease both",
      }}>
        {children}
      </div>
    </div>
  );
}

function Login({ onSuccess, goSignup }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [otp, setOtp]     = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setL]   = useState(false);
  const [err, setErr]     = useState("");

  const go = async () => {
    setErr(""); setL(true);
    if (!sent) { await api.login({ email, password: pass }); setSent(true); }
    else { const r = await api.verifyOTP({ otp }); if (r.success) onSuccess(r.token); else setErr(r.message); }
    setL(false);
  };

  return (
    <AuthWrap>
      {/* Mini sphere */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom: 24 }}>
        <AstroSphere size={90} color1="#1a3a8e" color2="#0d1f6e" glowColor="#63b3ff" variant="default" animate />
      </div>
      <div style={{ textAlign:"center", marginBottom: 28 }}>
        <div style={{ fontSize:22, fontWeight:800 }}>
          {sent ? "Check your email" : <><span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fin</span>Pilot AI</>}
        </div>
        <div style={{ color:"rgba(226,234,255,0.35)", fontSize:12, marginTop:5, fontFamily:"'JetBrains Mono', monospace" }}>
          {sent ? `OTP → ${email}` : "// sign in to continue"}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
        {!sent ? <>
          <Input placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} icon="✉" />
          <Input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} icon="◉" />
        </> : <>
          <div style={{ background:"rgba(99,179,255,0.05)", border:"1px solid rgba(99,179,255,0.15)", borderRadius:12, padding:"11px 16px", textAlign:"center", fontFamily:"'JetBrains Mono', monospace", fontSize:12, color:"rgba(99,179,255,0.7)" }}>
            Demo OTP: <span style={{ color:"#63b3ff", letterSpacing:"0.2em", fontWeight:700 }}>123456</span>
          </div>
          <Input placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value)} icon="🔑" />
        </>}
        {err && <div style={{ color:"#f87171", fontSize:12, fontFamily:"'JetBrains Mono', monospace", paddingLeft:4 }}>⚠ {err}</div>}
        <Btn onClick={go} loading={loading}>{sent ? "Verify & Enter →" : "Send OTP →"}</Btn>
        {sent && <Btn outline onClick={()=>setSent(false)}>← Back</Btn>}
      </div>
      <div style={{ textAlign:"center", marginTop:24, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:13, color:"rgba(226,234,255,0.35)" }}>
        New?{" "}<span onClick={goSignup} style={{ color:"#63b3ff", cursor:"pointer", fontWeight:600 }}>Create account</span>
      </div>
    </AuthWrap>
  );
}

function Signup({ goLogin }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [loading, setL] = useState(false); const [done, setDone] = useState(false);
  if (done) return (
    <AuthWrap>
      <div style={{ textAlign:"center" }}>
        <AstroSphere size={100} color1="#0d4a2e" color2="#082e1a" glowColor="#34d399" variant="default" animate />
        <div style={{ fontSize:22, fontWeight:800, marginTop:20 }}>All set!</div>
        <div style={{ color:"rgba(226,234,255,0.4)", fontSize:13, margin:"8px 0 24px", fontFamily:"'JetBrains Mono', monospace" }}>// account created</div>
        <Btn onClick={goLogin}>Sign in now →</Btn>
      </div>
    </AuthWrap>
  );
  return (
    <AuthWrap>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:22, fontWeight:800 }}>Create account</div>
        <div style={{ color:"rgba(226,234,255,0.35)", fontSize:12, marginTop:5, fontFamily:"'JetBrains Mono', monospace" }}>// join FinPilot AI</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
        <Input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} icon="◈" />
        <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} icon="✉" />
        <Input placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} icon="◉" />
        <Btn onClick={async()=>{ setL(true); await api.signup({ name, email, password: pass }); setL(false); setDone(true); }} loading={loading}>Create Account →</Btn>
      </div>
      <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:"rgba(226,234,255,0.35)" }}>
        Have account?{" "}<span onClick={goLogin} style={{ color:"#63b3ff", cursor:"pointer", fontWeight:600 }}>Sign in</span>
      </div>
    </AuthWrap>
  );
}

// ── SIDEBAR (Dribbble-style pills) ────────────────────────────
const NAV = [
  { id:"home",      icon:"⬡", label:"Overview"          },
  { id:"astrofin",  icon:"◈", label:"AstroFin Twin"     },
  { id:"creditai",  icon:"◆", label:"AI Credit Score Improver" },
  { id:"crosssell", icon:"⟠", label:"Intelligent Cross-Sell Engine" },
  { id:"rmcopilot", icon:"⌁", label:"Banker / RM Co-Pilot" },
  { id:"compliance", icon:"⛨", label:"Privacy & Compliance Layer" },
  { id:"loan",      icon:"↯", label:"Loan Simulator"    },
  { id:"fraud",     icon:"◉", label:"Fraud Alerts"      },
  { id:"ai",        icon:"✦", label:"Ask Astro"          },
  { id:"analytics", icon:"▲", label:"Analytics"         },
  { id:"settings",  icon:"⚙", label:"Settings"          },
];

function Sidebar({ active, setActive, col, setCol, user }) {
  return (
    <aside style={{
      width: col ? 72 : 292, flexShrink:0,
      background: "rgba(3,7,18,0.85)",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      backdropFilter: "blur(24px)",
      display:"flex", flexDirection:"column",
      transition:"width 0.32s cubic-bezier(0.4,0,0.2,1)",
      animation:"slideIn 0.4s ease both",
      zIndex:10, height:"100vh", position:"sticky", top:0,
    }}>
      {/* Logo */}
      <div style={{ padding: col ? "22px 0" : "22px 20px", borderBottom:"1px solid rgba(255,255,255,0.04)", display:"flex", alignItems:"center", justifyContent: col ? "center" : "space-between", gap:10 }}>
        {!col && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a8e,#2d1a8e)", boxShadow:"0 0 16px rgba(99,179,255,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>
              <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:800 }}>F</span>
            </div>
            <span style={{ fontSize:16, fontWeight:800 }}>
              <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fin</span>Pilot
            </span>
          </div>
        )}
        <button onClick={()=>setCol(!col)} style={{
          width:28, height:28, borderRadius:8, border:"1px solid rgba(255,255,255,0.07)",
          background:"rgba(255,255,255,0.04)", color:"rgba(226,234,255,0.4)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, transition:"all 0.2s",
        }}>{col ? "›" : "‹"}</button>
      </div>

      {/* Nav pills */}
      <nav style={{ flex:1, padding:"12px 10px", display:"flex", flexDirection:"column", gap:3, overflowY:"auto" }}>
        {NAV.map(n => {
          const isA = active === n.id;
          return (
            <button key={n.id} className="nav-pill" onClick={()=>setActive(n.id)} title={col ? n.label : ""}
              style={{
                display:"flex", alignItems:"center", gap: col ? 0 : 11,
                justifyContent: col ? "center" : "flex-start",
                padding: col ? "12px 0" : "10px 14px",
                borderRadius:12,
                background: isA ? "linear-gradient(135deg,rgba(99,179,255,0.12),rgba(167,139,250,0.08))" : "transparent",
                border: isA ? "1px solid rgba(99,179,255,0.2)" : "1px solid transparent",
                color: isA ? "#e2eaff" : "rgba(226,234,255,0.38)",
                fontFamily:"'Syne', sans-serif", fontSize:13, fontWeight: isA ? 600 : 400,
                transition:"all 0.15s ease", position:"relative",
              }}>
              {/* Active left glow bar */}
              {isA && !col && <div style={{ position:"absolute", left:0, top:"20%", height:"60%", width:3, background:"linear-gradient(to bottom,#63b3ff,#a78bfa)", borderRadius:"0 2px 2px 0", boxShadow:"0 0 8px #63b3ff" }} />}
              <span style={{ fontSize:16, filter: isA ? "drop-shadow(0 0 5px #63b3ff)" : "none", transition:"filter 0.2s" }}>{n.icon}</span>
              {!col && <span>{n.label}</span>}
              {/* Active dot */}
              <span className="pill-dot" style={{ marginLeft:"auto", width:5, height:5, borderRadius:"50%", background:"#63b3ff", boxShadow:"0 0 6px #63b3ff", opacity: isA ? 1 : 0, transition:"opacity 0.2s" }} />
            </button>
          );
        })}
      </nav>

      {/* User */}
      {user && !col && (
        <div style={{ margin:"10px", padding:"12px 14px", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a8e,#2d1a8e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, flexShrink:0, boxShadow:"0 0 12px rgba(99,179,255,0.2)" }}>
            <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user.name[0]}</span>
          </div>
          <div style={{ overflow:"hidden", flex:1 }}>
            <div style={{ fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
            <div style={{ fontSize:10, color:"rgba(226,234,255,0.3)", fontFamily:"'JetBrains Mono', monospace" }}>PREMIUM</div>
          </div>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 6px #34d399", animation:"orbPulse 2s ease-in-out infinite" }} />
        </div>
      )}
    </aside>
  );
}

// ── PAGE HEADER ───────────────────────────────────────────────
function TopBar({ active, user }) {
  const n = NAV.find(x => x.id === active);
  return (
    <div className="topbar-inner" style={{
      padding:"15px 36px", borderBottom:"1px solid rgba(255,255,255,0.04)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background:"rgba(3,7,18,0.7)", backdropFilter:"blur(20px)",
      position:"sticky", top:0, zIndex:5,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:18, filter:"drop-shadow(0 0 5px #63b3ff)" }}>{n?.icon}</span>
        <div>
          <div style={{ fontWeight:700, fontSize:14 }}>{n?.label}</div>
          <div className="topbar-path" style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:10, color:"rgba(226,234,255,0.3)", marginTop:1 }}>finpilot.ai / {active}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div className="topbar-date" style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:"rgba(226,234,255,0.2)" }}>
          {new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", background:"rgba(52,211,153,0.07)", border:"1px solid rgba(52,211,153,0.14)", borderRadius:20, fontSize:11, color:"#34d399", fontWeight:600 }}>
          <span style={{ width:5, height:5, borderRadius:"50%", background:"#34d399", boxShadow:"0 0 5px #34d399", display:"inline-block", animation:"orbPulse 2s ease-in-out infinite" }} />
          LIVE
        </div>
      </div>
    </div>
  );
}

// ── DATA LABEL (floating near sphere) ────────────────────────
function OrbitLabel({ value, label, color, x, y }) {
  return (
    <div className="orbit-label" style={{ position:"absolute", left:x, top:y, pointerEvents:"none" }}>
      <div style={{ fontSize:18, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", color, filter:`drop-shadow(0 0 8px ${color})` }}>{value}</div>
      <div style={{ fontSize:10, color:"rgba(226,234,255,0.4)", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:2 }}>{label}</div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────
function Home({ user, updates }) {
  const metrics = [
    { value:`₹${twin.income.toLocaleString("en-IN")}`,   label:"Income",    color:"#34d399", x:"68%", y:"12%" },
    { value:`₹${twin.spending.toLocaleString("en-IN")}`,  label:"Spending",  color:"#fbbf24", x:"72%", y:"52%" },
    { value:`₹${twin.cashFlow.toLocaleString("en-IN")}`,  label:"Cash Flow", color:"#63b3ff", x:"5%",  y:"20%" },
    { value:`₹${twin.liabilities.toLocaleString("en-IN")}`,label:"Liabilities",color:"#f87171",x:"2%",y:"62%"},
  ];
  const latestFinance = updates?.latestFinance || [];
  const stockAlerts = updates?.stockAlerts || [];
  const knowledge = updates?.knowledge || [];
  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:36 }}>
      <div>
        <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:"rgba(99,179,255,0.5)", letterSpacing:"0.15em", marginBottom:8 }}>
          FINANCIAL OVERVIEW · <span style={{ animation:"blink 1.2s step-end infinite" }}>●</span> LIVE
        </div>
        <div className="hero-name" style={{ fontSize:34, fontWeight:800, lineHeight:1.1 }}>
          Welcome back, <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user.name.split(" ")[0]}</span>
        </div>
      </div>

      {/* Sphere + floating labels */}
      <div className="sphere-row" style={{ display:"flex", gap:48, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <AstroSphere size={300} color1="#1a3a8e" color2="#0d1f6e" glowColor="#63b3ff"
            label="ASTROFIN" sublabel="TWIN" variant="default" animate />
          {metrics.map((m, i) => (
            <OrbitLabel key={i} {...m} />
          ))}
        </div>

        {/* Right: balance hero + score */}
        <div style={{ flex:1, minWidth:200, display:"flex", flexDirection:"column", gap:20 }}>
          <div>
            <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(226,234,255,0.35)", marginBottom:6 }}>Portfolio Balance</div>
            <div className="balance-num" style={{ fontSize:44, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              ₹{user.balance.toLocaleString("en-IN")}
            </div>
          </div>

          <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.05)" }} />

          {/* Orbital stat rings */}
          {[
            { label:"Savings Rate",  pct: twin.cashFlow/twin.income,    color:"#34d399" },
            { label:"Spend Ratio",   pct: twin.spending/twin.income,    color:"#fbbf24" },
            { label:"Health Score",  pct: 1 - twin.riskScore,           color:"#a78bfa" },
          ].map(s => (
            <div key={s.label} style={{ display:"flex", alignItems:"center", gap:14 }}>
              <svg width={42} height={42} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
                <circle cx={21} cy={21} r={17} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4} />
                <circle cx={21} cy={21} r={17} fill="none" stroke={s.color} strokeWidth={4}
                  strokeDasharray={107} strokeDashoffset={107*(1-s.pct)} strokeLinecap="round"
                  style={{ filter:`drop-shadow(0 0 4px ${s.color})`, transition:"stroke-dashoffset 1.2s ease" }} />
              </svg>
              <div>
                <div style={{ fontSize:16, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", color:s.color }}>{Math.round(s.pct*100)}%</div>
                <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(226,234,255,0.35)" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(226,234,255,0.4)" }}>Latest Finance Updates</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:18, position:"relative", zIndex:3 }}>
          {latestFinance.map((item, i) => (
            <HexNews key={`${item.title}-${i}`} title={item.title} cat={item.cat} time={item.time} sentiment={item.sentiment} delay={i * 0.08} />
          ))}
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:14 }}>
        {stockAlerts.map((s, i) => (
          <StockTicker key={`${s.ticker}-${i}`} ticker={s.ticker} price={s.price} change={s.change} color={s.color} />
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(99,179,255,0.7)" }}>Do You Know?</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:10 }}>
          {knowledge.slice(0, 2).map((k, i) => (
            <DoYouKnowButton key={`home-btn-${i}`} question={k.question} answer={k.answer} />
          ))}
        </div>
        {knowledge.slice(0, 2).map((k, i) => (
          <KnowledgePill key={`${k.question}-${i}`} question={k.question} answer={k.answer} delay={i * 0.1} />
        ))}
      </div>
    </div>
  );
}

// ── ASTROFIN PAGE ─────────────────────────────────────────────
function AstroFin({ updates }) {
  const latestFinance = updates?.latestFinance || [];
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontSize:28, fontWeight:800 }}>◈ AstroFin <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Digital Twin</span></div>
        <div style={{ color:"rgba(226,234,255,0.35)", fontFamily:"'JetBrains Mono', monospace", fontSize:11, marginTop:5 }}>// real-time financial mirror simulation</div>
      </div>
      <div className="sphere-row" style={{ display:"flex", gap:48, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flexShrink:0 }}>
          <AstroSphere size={260} color1="#0d3a2e" color2="#081f1a" glowColor="#34d399" label="TWIN" sublabel="ASTROFIN" variant="default" animate />
          <OrbitLabel value={`₹${twin.income.toLocaleString("en-IN")}`}    label="Income"   color="#34d399" x="65%" y="10%" />
          <OrbitLabel value={`₹${twin.cashFlow.toLocaleString("en-IN")}`}  label="Net Flow" color="#63b3ff" x="-5%"  y="40%" />
        </div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:16, minWidth:200 }}>
          {[
            { l:"Income Stream",  v:`₹${twin.income.toLocaleString("en-IN")}`,      c:"#34d399", w:1 },
            { l:"Outflow",        v:`₹${twin.spending.toLocaleString("en-IN")}`,    c:"#fbbf24", w:twin.spending/twin.income },
            { l:"Liabilities",    v:`₹${twin.liabilities.toLocaleString("en-IN")}`, c:"#f87171", w:twin.liabilities/twin.income },
            { l:"Free Cash Flow", v:`₹${twin.cashFlow.toLocaleString("en-IN")}`,    c:"#63b3ff", w:twin.cashFlow/twin.income },
          ].map(m => (
            <div key={m.l}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(226,234,255,0.4)" }}>{m.l}</span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:16, fontWeight:800, color:m.c }}>{m.v}</span>
              </div>
              <div style={{ height:2, background:"rgba(255,255,255,0.05)", borderRadius:1 }}>
                <div style={{ height:"100%", width:`${m.w*100}%`, background:m.c, borderRadius:1, transition:"width 1.2s ease", filter:`drop-shadow(0 0 3px ${m.c})` }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:8, padding:"16px 20px", background:"rgba(52,211,153,0.04)", border:"1px solid rgba(52,211,153,0.12)", borderRadius:16 }}>
            <div style={{ fontSize:12, color:"rgba(226,234,255,0.5)", lineHeight:1.8 }}>
              Twin projects <span style={{ color:"#34d399", fontWeight:700 }}>36.5% savings rate</span>. Debt service at <span style={{ color:"#fbbf24", fontWeight:700 }}>14.1%</span>. Modeled net worth: <span style={{ color:"#a78bfa", fontWeight:700 }}>+12.4% YoY</span>.
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop:22 }}>
        <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(52,211,153,0.65)", marginBottom:12 }}>Twin Context Feed</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:18, position:"relative", zIndex:3 }}>
          {latestFinance.map((item, i) => (
            <HexNews key={`astro-${item.title}-${i}`} title={item.title} cat={item.cat} time={item.time} sentiment={item.sentiment} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LOAN PAGE ─────────────────────────────────────────────────
function Loan() {
  const [amount, setAmt] = useState(200000);
  const [months, setMon] = useState(24);
  const [rate, setRate]  = useState(9);
  const [res, setRes]    = useState(null);
  const calc = () => { const r=rate/1200,emi=(amount*r)/(1-Math.pow(1+r,-months)); setRes({ emi:Math.round(emi), total:Math.round(emi*months), interest:Math.round(emi*months-amount), rem:Math.round(twin.cashFlow-emi) }); };
  const S = ({ label, min, max, step, value, onChange, fmt }) => (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
        <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.1em", color:"rgba(226,234,255,0.4)" }}>{label}</span>
        <span style={{ fontFamily:"'JetBrains Mono', monospace", fontWeight:800, color:"#63b3ff", fontSize:15 }}>{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor:"#63b3ff", height:3, cursor:"pointer", marginBottom:20 }} />
    </div>
  );
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>↯ Loan <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Simulator</span></div>
      <div className="sphere-row" style={{ display:"flex", gap:40, alignItems:"center", flexWrap:"wrap", marginTop:24 }}>
        {/* Sphere */}
        <div style={{ position:"relative", flexShrink:0 }}>
          <AstroSphere size={220} color1="#1a2a6e" color2="#0d1560" glowColor="#a78bfa" label="EMI" sublabel="SIMULATE" variant="default" animate />
          {res && <>
            <OrbitLabel value={`₹${res.emi.toLocaleString()}`} label="/ month" color="#a78bfa" x="62%" y="8%" />
            <OrbitLabel value={`₹${res.total.toLocaleString()}`} label="total" color="#fbbf24" x="-10%" y="55%" />
          </>}
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <S label="Loan Amount" min={10000} max={2000000} step={5000} value={amount} onChange={setAmt} fmt={v=>`₹${v.toLocaleString("en-IN")}`} />
          <S label="Tenure" min={3} max={84} step={1} value={months} onChange={setMon} fmt={v=>`${v} months`} />
          <S label="Interest Rate" min={1} max={30} step={0.25} value={rate} onChange={setRate} fmt={v=>`${v}%`} />
          <Btn onClick={calc}>Calculate EMI →</Btn>
          {res && (
            <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:1 }}>
              {[
                ["Monthly EMI",        `₹${res.emi.toLocaleString("en-IN")}`,   "#a78bfa"],
                ["Total Repayment",    `₹${res.total.toLocaleString("en-IN")}`, "#fbbf24"],
                ["Total Interest",     `₹${res.interest.toLocaleString("en-IN")}`, "#f87171"],
                ["Post-EMI Cash Flow", `₹${res.rem.toLocaleString("en-IN")}`,   res.rem>0?"#34d399":"#f87171"],
              ].map(([l,v,c]) => (
                <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.35)" }}>{l}</span>
                  <span style={{ fontFamily:"'JetBrains Mono', monospace", fontWeight:800, color:c }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── FRAUD PAGE ────────────────────────────────────────────────
function Fraud() {
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>◉ Fraud <span style={{ background:"linear-gradient(135deg,#f87171,#fbbf24)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Shield</span></div>
      <div className="sphere-row" style={{ display:"flex", gap:40, alignItems:"flex-start", flexWrap:"wrap", marginTop:24 }}>
        {/* Fraud sphere — red electric */}
        <div style={{ flexShrink:0 }}>
          <AstroSphere size={220} color1="#5a0a0a" color2="#3a0505" glowColor="#f87171" label="THREAT" sublabel="ANALYSIS" variant="fraud" animate />
        </div>
        <div style={{ flex:1, minWidth:220, display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { type:"Unusual Location",    detail:"Transaction from Moscow — IP mismatch detected", amount:"₹12,500", time:"Today · 3:12 AM", risk:"CRITICAL", color:"#f87171", score:94 },
            { type:"Large Wire Transfer", detail:"Outbound NEFT 3× above your monthly average",    amount:"₹45,000", time:"Yesterday",       risk:"MODERATE", color:"#fbbf24", score:67 },
            { type:"New Device Login",    detail:"MacBook Air first-time device — flagged for review", amount:"—",   time:"Feb 15",          risk:"LOW",      color:"#34d399", score:22 },
          ].map((a, i) => (
            <div key={a.type} style={{
              display:"flex", alignItems:"center", gap:18, padding:"18px 22px",
              background:`rgba(${a.color==="#f87171"?"248,113,113":a.color==="#fbbf24"?"251,191,36":"52,211,153"},0.04)`,
              border:`1px solid ${a.color}18`, borderLeft:`3px solid ${a.color}`,
              borderRadius:18, animation:`fadeUp 0.4s ease ${i*0.1}s both`,
            }}>
              {/* Mini ring */}
              <svg width={52} height={52} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
                <circle cx={26} cy={26} r={20} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3.5} />
                <circle cx={26} cy={26} r={20} fill="none" stroke={a.color} strokeWidth={3.5}
                  strokeDasharray={126} strokeDashoffset={126*(1-a.score/100)} strokeLinecap="round"
                  style={{ filter:`drop-shadow(0 0 4px ${a.color})` }} />
              </svg>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>{a.type}</span>
                  <span style={{ padding:"2px 9px", borderRadius:20, fontSize:10, fontWeight:700, background:`${a.color}18`, color:a.color, letterSpacing:"0.1em" }}>{a.risk}</span>
                </div>
                <div style={{ color:"rgba(226,234,255,0.4)", fontSize:12 }}>{a.detail}</div>
                <div style={{ marginTop:4, fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:"rgba(226,234,255,0.25)" }}>{a.time} · {a.amount}</div>
              </div>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:20, fontWeight:800, color:a.color }}>{a.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI CHAT (Ask Astro) ───────────────────────────────────────
function AskAstro({ updates }) {
  const [msgs, setMsgs] = useState([{ role:"ai", text:"Hi! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy." }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chatErr, setChatErr] = useState("");
  const ref = useRef(null);
  const knowledge = updates?.knowledge || [];
  useEffect(() => { ref.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || thinking) return;
    const q = input.trim(); setInput("");
    setChatErr("");
    setMsgs(m => [...m, { role:"user", text:q }]);
    setThinking(true);
    try {
      const result = await api.askAstro({ message: q });
      setMsgs(m => [...m, { role:"ai", text: result.reply || "I couldn't generate a response yet. Please try once more." }]);
    } catch {
      setChatErr("Ask Astro is temporarily unavailable. Please retry.");
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)", animation:"fadeIn 0.4s ease" }}>
      {/* Sphere header */}
      <div style={{ display:"flex", alignItems:"center", gap:24, marginBottom:20, flexWrap:"wrap" }}>
        <AstroSphere size={100} color1="#0a2a5e" color2="#051530" glowColor="#63b3ff" variant="default" animate />
        <div>
          <div style={{ fontSize:26, fontWeight:800 }}>✦ Ask <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Astro</span></div>
          <div style={{ color:"rgba(226,234,255,0.35)", fontFamily:"'JetBrains Mono', monospace", fontSize:11, marginTop:4 }}>// conversational AI — powered by your financial twin</div>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:14, paddingRight:4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", animation:"fadeUp 0.3s ease" }}>
            {m.role==="ai" && (
              <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a8e,#2d1a8e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:10, marginTop:2, boxShadow:"0 0 10px rgba(99,179,255,0.3)" }}>✦</div>
            )}
            <div style={{
              maxWidth:"72%", padding:"13px 18px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?"linear-gradient(135deg,rgba(99,179,255,0.15),rgba(167,139,250,0.15))":"rgba(255,255,255,0.04)",
              border:m.role==="user"?"1px solid rgba(99,179,255,0.2)":"1px solid rgba(255,255,255,0.05)",
              fontSize:14, lineHeight:1.65, color:m.role==="user"?"#e2eaff":"rgba(226,234,255,0.8)",
            }}>{m.text}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display:"flex", gap:5, paddingLeft:42 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:"#63b3ff", animation:`waveBar 0.9s ${i*0.15}s ease-in-out infinite` }} />)}
          </div>
        )}
        <div ref={ref} />
      </div>

      <div style={{ marginTop:16, display:"flex", gap:10 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
          placeholder="Ask about loans, risk, fraud, investments…"
          className="glass-input"
          style={{ flex:1, padding:"13px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, color:"#e2eaff", fontSize:14 }} />
        <button onClick={send} style={{
          padding:"13px 22px", background:"linear-gradient(135deg,rgba(99,179,255,0.2),rgba(167,139,250,0.2))",
          border:"1px solid rgba(99,179,255,0.3)", borderRadius:14, color:"#63b3ff",
          fontWeight:700, fontSize:16, transition:"all 0.2s",
          opacity: thinking ? 0.6 : 1,
        }}
          onMouseEnter={e=>e.currentTarget.style.background="linear-gradient(135deg,rgba(99,179,255,0.3),rgba(167,139,250,0.3))"}
          onMouseLeave={e=>e.currentTarget.style.background="linear-gradient(135deg,rgba(99,179,255,0.2),rgba(167,139,250,0.2))"}
          disabled={thinking}
        >{thinking ? "…" : "↑"}</button>
      </div>
      {!!chatErr && <div style={{ marginTop:8, color:"#f87171", fontSize:12 }}>{chatErr}</div>}

      <div className="sphere-row" style={{ marginTop:20, display:"flex", gap:18, alignItems:"stretch", flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:240 }}>
          <VoiceAssistant />
        </div>
        <div style={{ flex:1, minWidth:240, display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(99,179,255,0.7)" }}>Do You Know Buttons</div>
          {knowledge.slice(0, 2).map((k, i) => (
            <KnowledgePill key={`astro-know-${i}`} question={k.question} answer={k.answer} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ANALYTICS ─────────────────────────────────────────────────
function Analytics({ updates }) {
  const months = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
  const income  = [72,78,75,82,85,80,85];
  const spend   = [38,42,39,44,48,41,42];
  const stockAlerts = updates?.stockAlerts || [];
  const knowledge = updates?.knowledge || [];
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ fontSize:28, fontWeight:800, marginBottom:8 }}>▲ <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Analytics</span></div>
      <div className="sphere-row" style={{ display:"flex", gap:40, alignItems:"center", flexWrap:"wrap", marginTop:24 }}>
        <AstroSphere size={200} color1="#1a1a6e" color2="#0d0d4e" glowColor="#a78bfa" label="DATA" sublabel="STREAM" variant="default" animate />
        <div style={{ flex:1, minWidth:220 }}>
          <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(226,234,255,0.35)", marginBottom:20 }}>7-Month Income vs Spending (₹000s)</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:12, height:160 }}>
            {months.map((m,i) => (
              <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:0, height:"100%", justifyContent:"flex-end" }}>
                <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", justifyContent:"center" }}>
                  <div style={{ width:"45%", height:Math.round(income[i]/85*130)+"px", background:"linear-gradient(to top,#63b3ff,#63b3ff50)", borderRadius:"3px 3px 0 0", filter:"drop-shadow(0 0 4px #63b3ff40)" }} />
                  <div style={{ width:"45%", height:Math.round(spend[i]/85*130)+"px",  background:"linear-gradient(to top,#fbbf24,#fbbf2450)", borderRadius:"3px 3px 0 0", filter:"drop-shadow(0 0 4px #fbbf2440)" }} />
                </div>
                <div style={{ fontSize:9, color:"rgba(226,234,255,0.3)", marginTop:8, letterSpacing:"0.04em" }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:20, marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            {[["#63b3ff","Income"],["#fbbf24","Spending"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:"rgba(226,234,255,0.4)" }}>
                <div style={{ width:10, height:3, background:c, borderRadius:2, filter:`drop-shadow(0 0 3px ${c})` }} />{l}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop:24, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))", gap:14 }}>
        {stockAlerts.map((s, i) => (
          <StockTicker key={`analytics-${s.ticker}-${i}`} ticker={s.ticker} price={s.price} change={s.change} color={s.color} />
        ))}
      </div>
      <div style={{ marginTop:18, display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(167,139,250,0.75)" }}>Fintech Knowledge Pulse</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:10 }}>
          {knowledge.slice(0, 2).map((k, i) => (
            <DoYouKnowButton key={`analytics-btn-${i}`} question={k.question} answer={k.answer} />
          ))}
        </div>
        {knowledge.slice(1, 3).map((k, i) => (
          <KnowledgePill key={`analytics-know-${i}`} question={k.question} answer={k.answer} delay={i * 0.1} />
        ))}
      </div>
      <div style={{ marginTop:18, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:12 }}>
        <InvestorProfile
          name="Radhika Menon"
          title="Fintech Portfolio Strategist"
          quote="In uncertain markets, cash flow quality beats short-term momentum."
          achievement="Backtested 14% drawdown reduction with staggered allocation rules."
          delay={0}
        />
        <InvestorProfile
          name="Kabir Shah"
          title="Risk & Fraud Research Lead"
          quote="Device intelligence combined with behavioral velocity catches fraud earlier."
          achievement="Reduced false positives by 22% using dynamic threshold scoring."
          delay={0.12}
        />
      </div>
    </div>
  );
}

function FeatureShard({ title, items, color, delay = 0 }) {
  return (
    <div style={{
      clipPath:"polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
      background:`linear-gradient(135deg, ${color}10, rgba(255,255,255,0.02))`,
      border:`1px solid ${color}40`,
      padding:"18px 22px",
      animation:`fadeUp 0.35s ease ${delay}s both`,
    }}>
      <div style={{ fontSize:12, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color, marginBottom:10 }}>{title}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {items.map((it, idx) => (
          <div key={idx} style={{ display:"flex", alignItems:"flex-start", gap:10, color:"rgba(226,234,255,0.82)", lineHeight:1.6, fontSize:13 }}>
            <span style={{ marginTop:6, width:6, height:6, borderRadius:"50%", background:color, boxShadow:`0 0 7px ${color}`, flexShrink:0 }} />
            <span>{it}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleRail({ module, icon, accent }) {
  if (!module) return null;
  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:24 }}>
      <div>
        <div style={{ fontSize:30, fontWeight:800 }}>{icon} <span style={{ background:`linear-gradient(135deg,${accent},#a78bfa)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{module.title}</span></div>
        <div style={{ color:"rgba(226,234,255,0.55)", fontSize:14, marginTop:8 }}>{module.oneLiner}</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
        <FeatureShard title="What It Does" items={module.whatItDoes} color={accent} delay={0} />
        <FeatureShard title="AI / ML Used" items={module.aiMlUsed} color="#63b3ff" delay={0.06} />
        <FeatureShard title="Tech Stack" items={module.techStack} color="#34d399" delay={0.12} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:16 }} className="sphere-row">
        <div style={{
          clipPath:"polygon(0 8%, 86% 8%, 100% 50%, 86% 92%, 0 92%, 6% 50%)",
          border:`1px solid ${accent}45`,
          background:`radial-gradient(circle at 15% 25%, ${accent}22, rgba(255,255,255,0.02) 60%)`,
          padding:"24px 34px",
        }}>
          <div style={{ fontSize:12, letterSpacing:"0.11em", textTransform:"uppercase", color:accent, marginBottom:12, fontWeight:800 }}>How It Adds In-App Value</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {module.appFunctions.map((fn, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, fontSize:14, lineHeight:1.65 }}>
                <span style={{ color:accent, fontWeight:800 }}>{i + 1}.</span>
                <span style={{ color:"rgba(226,234,255,0.84)" }}>{fn}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          clipPath:"polygon(12% 0, 100% 0, 88% 100%, 0 100%)",
          border:"1px solid rgba(99,179,255,0.3)",
          background:"rgba(8,18,42,0.72)",
          padding:"20px 24px",
          display:"flex", flexDirection:"column", gap:12,
        }}>
          <div style={{ fontSize:12, letterSpacing:"0.11em", textTransform:"uppercase", color:"#63b3ff", fontWeight:800 }}>Execution Flow</div>
          {["Sense customer state", "Score recommendations/risk", "Explain and action in UI"].map((step, idx) => (
            <div key={idx} style={{
              clipPath:"polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
              background:"rgba(99,179,255,0.08)",
              border:"1px solid rgba(99,179,255,0.26)",
              padding:"10px 14px",
              fontSize:13,
              color:"rgba(226,234,255,0.82)",
            }}>
              <span style={{ color:"#63b3ff", fontWeight:800 }}>{idx + 1}</span> {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CrossSellEngine({ modules }) {
  return <ModuleRail module={modules?.crossSell} icon="⟠" accent="#34d399" />;
}

function RMCopilot({ modules }) {
  return <ModuleRail module={modules?.rmCopilot} icon="⌁" accent="#63b3ff" />;
}

function ComplianceLayer({ modules }) {
  return <ModuleRail module={modules?.compliance} icon="⛨" accent="#fbbf24" />;
}

// ── SETTINGS ──────────────────────────────────────────────────
function Settings({ user }) {
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ fontSize:28, fontWeight:800, marginBottom:24 }}>⚙ <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Settings</span></div>
      <div style={{ display:"flex", gap:48, alignItems:"flex-start", flexWrap:"wrap" }}>
        <AstroSphere size={180} color1="#1a3a8e" color2="#0d1f6e" glowColor="#63b3ff" animate />
        <div style={{ flex:1, minWidth:220 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, paddingBottom:24, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a8e,#2d1a8e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:800, boxShadow:"0 0 24px rgba(99,179,255,0.3)" }}>
              <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{user.name[0]}</span>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:17 }}>{user.name}</div>
              <div style={{ color:"rgba(226,234,255,0.35)", fontSize:12, fontFamily:"'JetBrains Mono', monospace" }}>{user.email}</div>
              <div style={{ marginTop:6, display:"inline-block", padding:"3px 10px", background:"rgba(52,211,153,0.1)", color:"#34d399", borderRadius:20, fontSize:10, fontWeight:700 }}>VERIFIED</div>
            </div>
          </div>
          {[["Two-Factor Auth","OTP Enabled","#34d399"],["Notifications","Email + Push","#63b3ff"],["Currency","INR (₹)","#e2eaff"],["Encryption","AES-256","#a78bfa"],["Last Login",user.lastLogin,"rgba(226,234,255,0.4)"]].map(([l,v,c]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.35)" }}>{l}</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:c, fontWeight:600 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── BOTTOM NAV (mobile) ───────────────────────────────────────
const BOTTOM_NAV = [
  { id:"home",     icon:"⬡", label:"Home"    },
  { id:"astrofin", icon:"◈", label:"Twin"    },
  { id:"creditai", icon:"◆", label:"Credit"  },
  { id:"loan",     icon:"↯", label:"Loan"    },
  { id:"ai",       icon:"✦", label:"Astro"   },
];

function BottomNav({ active, setActive }) {
  // Show only 5 most used on mobile, rest hidden
  const visible = BOTTOM_NAV.slice(0, 5);
  return (
    <nav className="bottom-nav" style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:50,
      background:"rgba(3,7,18,0.95)", backdropFilter:"blur(20px)",
      borderTop:"1px solid rgba(255,255,255,0.07)",
      padding:"8px 4px calc(8px + env(safe-area-inset-bottom))",
      alignItems:"center", justifyContent:"space-around",
      display:"none", // toggled by CSS media query
    }}>
      {visible.map(n => {
        const isA = active === n.id;
        return (
          <button key={n.id} onClick={() => setActive(n.id)} style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            padding:"6px 12px", borderRadius:12, background:"none",
            color: isA ? "#63b3ff" : "rgba(226,234,255,0.35)",
            fontFamily:"'Syne', sans-serif", fontSize:10, fontWeight: isA ? 700 : 400,
            transition:"all 0.15s", border:"none", minWidth:52,
          }}>
            <span style={{ fontSize:20, filter: isA ? "drop-shadow(0 0 6px #63b3ff)" : "none", transition:"filter 0.2s" }}>{n.icon}</span>
            <span style={{ letterSpacing:"0.04em" }}>{n.label}</span>
            {isA && <div style={{ width:4, height:4, borderRadius:"50%", background:"#63b3ff", boxShadow:"0 0 5px #63b3ff", marginTop:1 }} />}
          </button>
        );
      })}
    </nav>
  );
}

// ── INNOVATIVE WIDGETS ────────────────────────────────────────

// Hexagonal news tile
function HexNews({ title, cat, time, sentiment, delay }) {
  const borderColor = sentiment === "bullish" ? "#34d399" : sentiment === "bearish" ? "#f87171" : "#63b3ff";
  return (
    <div style={{
      position:"relative", width:280, minHeight:178,
      clipPath:"polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
      background:"rgba(255,255,255,0.045)",
      border:`1px solid ${borderColor}45`,
      padding:"24px 18px", display:"flex", alignItems:"center", justifyContent:"center",
      animation:`fadeUp 0.4s ease ${delay}s both`,
      transition:"all 0.2s",
      boxShadow:`0 0 22px ${borderColor}22`,
    }}
      onMouseEnter={e => { e.currentTarget.style.background = `${borderColor}10`; e.currentTarget.style.borderColor = `${borderColor}60`; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = `${borderColor}30`; }}
    >
      <div style={{ width:"78%", minWidth:0 }}>
        <div style={{ fontSize:13, textTransform:"uppercase", letterSpacing:"0.14em", color:`${borderColor}`, marginBottom:10, fontWeight:800 }}>{cat}</div>
        <div style={{
          fontSize:21, lineHeight:1.42, marginBottom:10, fontWeight:800, color:"#eef6ff",
          textShadow:"0 0 10px rgba(0,0,0,0.35)",
          display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
        }}>{title}</div>
        <div style={{ fontSize:13, color:"rgba(226,234,255,0.7)", fontFamily:"'JetBrains Mono', monospace", fontWeight:600 }}>{time}</div>
      </div>
    </div>
  );
}

// Diagonal stock ticker
function StockTicker({ ticker, price, change, color }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.05)",
      borderLeft:`3px solid ${color}`,
      padding:"10px 14px", borderRadius:10,
      display:"flex", justifyContent:"space-between", alignItems:"center",
      transform:"skewX(-2deg)", transition:"all 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "skewX(-2deg) translateX(4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "skewX(-2deg)"}
    >
      <div style={{ transform:"skewX(2deg)" }}>
        <div style={{ fontSize:12, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", marginBottom:2 }}>{ticker}</div>
        <div style={{ fontSize:16, fontWeight:800, color }}>{change > 0 ? "+" : ""}{change}%</div>
      </div>
      <div style={{ fontSize:18, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", color:"rgba(226,234,255,0.6)", transform:"skewX(2deg)" }}>
        ₹{price.toLocaleString("en-IN")}
      </div>
    </div>
  );
}

// Expandable "Did You Know" pill
function KnowledgePill({ question, answer, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background:open?"rgba(99,179,255,0.06)":"rgba(255,255,255,0.03)",
      border:open?"1px solid rgba(99,179,255,0.2)":"1px solid rgba(255,255,255,0.06)",
      borderRadius:16, padding:open?"16px 18px":"12px 16px",
      cursor:"pointer", transition:"all 0.3s ease",
      animation:`fadeUp 0.3s ease ${delay}s both`,
      overflow:"hidden",
    }} onClick={()=>setOpen(!open)}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, flex:1 }}>
          <span style={{ fontSize:16, filter:"drop-shadow(0 0 4px #63b3ff)" }}>💡</span>
          <span style={{ fontSize:16, fontWeight:700, lineHeight:1.4 }}>{question}</span>
        </div>
        <span style={{ fontSize:16, color:"rgba(226,234,255,0.4)", transition:"transform 0.3s", transform:open?"rotate(180deg)":"rotate(0)" }}>▼</span>
      </div>
      <div style={{
        maxHeight:open?200:0, opacity:open?1:0,
        transition:"all 0.3s ease", overflow:"hidden",
        marginTop:open?12:0,
      }}>
        <div style={{ fontSize:15, lineHeight:1.75, color:"rgba(226,234,255,0.72)", borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:12 }}>
          {answer}
        </div>
      </div>
    </div>
  );
}

function DoYouKnowButton({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          padding:"12px 18px",
          color:"#63b3ff",
          fontSize:12,
          fontWeight:700,
          letterSpacing:"0.08em",
          textTransform:"uppercase",
          background:"rgba(99,179,255,0.08)",
          border:"1px solid rgba(99,179,255,0.3)",
          clipPath:"polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)",
          transition:"all 0.2s ease",
        }}
      >
        Do You Know
      </button>
      {open && (
        <div style={{ fontSize:12, lineHeight:1.7, color:"rgba(226,234,255,0.6)", padding:"0 6px" }}>
          <div style={{ color:"#e2eaff", fontWeight:700, marginBottom:4 }}>{question}</div>
          {answer}
        </div>
      )}
    </div>
  );
}

// Investor Profile card
function InvestorProfile({ name, title, quote, achievement, delay }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:16, padding:"20px 24px", animation:`fadeUp 0.5s ease ${delay || 0}s both`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
        <div style={{
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(135deg, #1a3a8e, #2d1a8e)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24, fontWeight:800, flexShrink:0,
          boxShadow:"0 0 20px rgba(99,179,255,0.25)",
        }}>
          <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{name[0]}</span>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:700 }}>{name}</div>
          <div style={{ fontSize:11, color:"rgba(226,234,255,0.4)", marginTop:2 }}>{title}</div>
        </div>
      </div>
      <div style={{
        fontSize:13, lineHeight:1.7, color:"rgba(226,234,255,0.6)",
        fontStyle:"italic", marginBottom:12, paddingLeft:12,
        borderLeft:"2px solid rgba(99,179,255,0.2)",
      }}>
        "{quote}"
      </div>
      <div style={{
        fontSize:11, color:"rgba(99,179,255,0.7)", padding:"8px 12px",
        background:"rgba(99,179,255,0.05)", borderRadius:10,
        border:"1px solid rgba(99,179,255,0.12)",
      }}>
        💡 {achievement}
      </div>
    </div>
  );
}

// Voice Assistant component for Ask Astro  
function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [err, setErr] = useState("");

  const toggleListen = () => {
    if (listening) {
      setListening(false);
      return;
    }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) {
      setErr("Speech recognition is not supported in this browser.");
      return;
    }
    setErr("");
    setReply("");
    setTranscript("");
    setThinking(false);
    setListening(true);
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = async (event) => {
      const text = Array.from(event.results).map((r) => r[0]?.transcript || "").join(" ").trim();
      setTranscript(text);
      if (event.results[event.results.length - 1]?.isFinal && text) {
        try {
          setThinking(true);
          const r = await api.voiceReply({ transcript: text });
          setReply(r.reply || "");
          if (r.reply && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(r.reply);
            u.rate = 1;
            u.pitch = 1;
            window.speechSynthesis.speak(u);
          }
        } catch {
          setErr("Could not fetch voice reply. Please try again.");
        } finally {
          setThinking(false);
        }
      }
    };
    rec.onerror = () => {
      setErr("Microphone error. Please allow mic access and retry.");
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <div style={{
      background:"rgba(99,179,255,0.04)", border:"1px solid rgba(99,179,255,0.15)",
      borderRadius:16, padding:"20px 24px", textAlign:"center",
    }}>
      <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>🎤 Voice Assistant</div>
      <button onClick={toggleListen} style={{
        width:80, height:80, borderRadius:"50%",
        background: listening ? "linear-gradient(135deg, #34d399, #63b3ff)" : "rgba(255,255,255,0.05)",
        border: listening ? "none" : "2px solid rgba(99,179,255,0.3)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:32, margin:"0 auto 16px",
        transition:"all 0.3s", cursor:"pointer",
        animation: listening ? "orbPulse 1.5s ease-in-out infinite" : "none",
        boxShadow: listening ? "0 0 30px rgba(52,211,153,0.5)" : "none",
      }}>
        {listening ? "🔊" : "🎤"}
      </button>
      <div style={{ fontSize:12, color:"rgba(226,234,255,0.5)", minHeight:40 }}>
        {listening ? (
          <div style={{ animation:"blink 1s ease-in-out infinite" }}>Listening...</div>
        ) : thinking ? (
          <div style={{ animation:"blink 1s ease-in-out infinite", color:"#63b3ff" }}>Thinking...</div>
        ) : transcript ? (
          <div style={{ color:"#63b3ff" }}>"{transcript}"</div>
        ) : (
          "Tap mic to speak"
        )}
      </div>
      {!!reply && <div style={{ fontSize:12, color:"rgba(52,211,153,0.9)", marginTop:8, lineHeight:1.6 }}>{reply}</div>}
      {!!err && <div style={{ fontSize:11, color:"#f87171", marginTop:8 }}>{err}</div>}
    </div>
  );
}

// ── CREDIT SCORE IMPROVER PAGE ────────────────────────────────
function CreditScore({ user }) {
  const currentScore = 720;
  const targetScore = 800;
  const maxScore = 900;
  const progress = (currentScore - 300) / (maxScore - 300);
  const targetProgress = (targetScore - 300) / (maxScore - 300);

  const actions = [
    { task: "Pay credit card bills on time", impact: "+15 pts", status: "pending", color: "#fbbf24" },
    { task: "Reduce credit utilization to <30%", impact: "+20 pts", status: "in-progress", color: "#63b3ff" },
    { task: "Don't apply for new credit", impact: "+10 pts", status: "done", color: "#34d399" },
    { task: "Check for report errors", impact: "+5 pts", status: "pending", color: "#fbbf24" },
    { task: "Maintain old credit accounts", impact: "+8 pts", status: "done", color: "#34d399" },
    { task: "Diversify credit mix", impact: "+12 pts", status: "in-progress", color: "#63b3ff" },
  ];

  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:32 }}>
      <div>
        <div style={{ fontSize:28, fontWeight:800, marginBottom:6 }}>◆ AI Credit <span style={{ background:"linear-gradient(135deg,#34d399,#63b3ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Score Improver</span></div>
        <div style={{ color:"rgba(226,234,255,0.35)", fontFamily:"'JetBrains Mono', monospace", fontSize:11 }}>// boost your creditworthiness with AI-powered recommendations</div>
      </div>

      {/* Main arc gauge + actions */}
      <div className="sphere-row" style={{ display:"flex", gap:48, alignItems:"center", flexWrap:"wrap" }}>
        {/* Animated arc gauge */}
        <div style={{ position:"relative", flexShrink:0 }}>
          <svg width={280} height={180} style={{ overflow:"visible" }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            {/* Background arc */}
            <path d="M 40 150 A 100 100 0 0 1 240 150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" strokeLinecap="round" />
            {/* Progress arc */}
            <path d="M 40 150 A 100 100 0 0 1 240 150" fill="none" stroke="url(#scoreGrad)" strokeWidth="20" strokeLinecap="round"
              strokeDasharray={314} strokeDashoffset={314 * (1 - progress)}
              style={{ transition:"stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)", filter:"drop-shadow(0 0 8px #34d399)" }} />
            {/* Target marker */}
            <circle cx={140 + 100 * Math.cos(Math.PI - Math.PI * targetProgress)} cy={150 - 100 * Math.sin(Math.PI - Math.PI * targetProgress)}
              r={6} fill="#a78bfa" stroke="white" strokeWidth={2}
              style={{ filter:"drop-shadow(0 0 6px #a78bfa)" }} />
          </svg>
          {/* Score display */}
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-30%)", textAlign:"center" }}>
            <div style={{ fontSize:54, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", background:"linear-gradient(135deg,#fbbf24,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1 }}>
              {currentScore}
            </div>
            <div style={{ fontSize:11, color:"rgba(226,234,255,0.4)", marginTop:4, textTransform:"uppercase", letterSpacing:"0.1em" }}>
              Target: {targetScore}
            </div>
          </div>
        </div>

        {/* Action items */}
        <div style={{ flex:1, minWidth:220, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>AI Recommendations</div>
          {actions.map((a, i) => (
            <div key={i} style={{
              display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
              background:`${a.color}08`, border:`1px solid ${a.color}20`, borderLeft:`3px solid ${a.color}`,
              borderRadius:12, animation:`fadeUp 0.4s ease ${i*0.1}s both`,
            }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:a.color, boxShadow:`0 0 6px ${a.color}`, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>{a.task}</div>
                <div style={{ fontSize:10, color:"rgba(226,234,255,0.35)", fontFamily:"'JetBrains Mono', monospace" }}>Impact: {a.impact}</div>
              </div>
              <div style={{ fontSize:10, padding:"4px 10px", borderRadius:20, background:`${a.color}20`, color:a.color, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                {a.status === "done" ? "✓" : a.status === "in-progress" ? "⟳" : "○"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score timeline prediction */}
      <div>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>6-Month Projection</div>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:140 }}>
          {[720, 735, 752, 768, 784, 800].map((score, i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ fontSize:11, color:"rgba(226,234,255,0.5)", fontFamily:"'JetBrains Mono', monospace" }}>{score}</div>
              <div style={{
                width:"100%", height:Math.round((score-700)/100*120), background:"linear-gradient(to top, #fbbf24, #34d399)",
                borderRadius:"4px 4px 0 0", filter:"drop-shadow(0 0 4px #34d399)",
                animation:`fadeUp 0.6s ease ${i*0.15}s both`,
              }} />
              <div style={{ fontSize:10, color:"rgba(226,234,255,0.3)" }}>M{i+1}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SHELL ─────────────────────────────────────────────────────
function Shell({ token }) {
  const [user, setUser] = useState(null);
  const [updates, setUpdates] = useState(fallbackUpdates);
  const [modules, setModules] = useState(fallbackFeatureModules);
  const [loading, setL] = useState(true);
  const [active, setA]  = useState("home");
  const [col, setCol]   = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    Promise.all([api.getProfile(token), api.getUpdates(), api.getFeatureModules()])
      .then(([profile, feed, featureData]) => {
        setUser(profile);
        setUpdates(feed);
        setModules(featureData);
      })
      .finally(() => setL(false));
  }, [token]);

  if (loading) return (
    <div style={{ position:"fixed", inset:0, background:"#030712", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:20 }}>
      <Starfield />
      <div style={{ position:"relative", zIndex:1 }}>
        <AstroSphere size={mobile ? 110 : 140} color1="#1a3a8e" color2="#0d1f6e" glowColor="#63b3ff" animate />
      </div>
      <div style={{ position:"relative", zIndex:1, fontFamily:"'JetBrains Mono', monospace", fontSize:11, color:"rgba(99,179,255,0.5)", letterSpacing:"0.2em", animation:"blink 1.5s ease-in-out infinite" }}>LOADING…</div>
    </div>
  );

  const pages = {
    home: <Home user={user} updates={updates} />,
    astrofin: <AstroFin updates={updates} />,
    creditai: <CreditScore user={user} />,
    crosssell: <CrossSellEngine modules={modules} />,
    rmcopilot: <RMCopilot modules={modules} />,
    compliance: <ComplianceLayer modules={modules} />,
    loan: <Loan />,
    fraud: <Fraud />,
    ai: <AskAstro updates={updates} />,
    analytics: <Analytics updates={updates} />,
    settings: <Settings user={user} />,
  };

  return (
    <div style={{ display:"flex", height:"100vh", position:"fixed", inset:0 }}>
      <Starfield />
      {/* Desktop sidebar */}
      <div className="desktop-sidebar" style={{ flexDirection:"column" }}>
        <Sidebar active={active} setActive={setA} col={col} setCol={setCol} user={user} />
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", position:"relative", zIndex:1, overflow:"hidden" }}>
        <TopBar active={active} user={user} />
        <div className="page-content" style={{ flex:1, overflowY:"auto", padding: mobile ? "16px 16px 90px" : "32px 40px" }}>
          {pages[active]}
        </div>
      </div>
      {/* Mobile bottom nav */}
      <BottomNav active={active} setActive={setA} />
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("intro");
  const [token, setToken] = useState(null);
  return (
    <>
      <Styles />
      {phase==="intro"  && <Intro  onDone={()=>setPhase("login")} />}
      {phase==="login"  && <Login  onSuccess={t=>{setToken(t);setPhase("app");}} goSignup={()=>setPhase("signup")} />}
      {phase==="signup" && <Signup goLogin={()=>setPhase("login")} />}
      {phase==="app"    && <Shell  token={token} />}
    </>
  );
}
