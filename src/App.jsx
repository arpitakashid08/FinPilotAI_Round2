// FinPilot AI — Sphere Edition
// Design: 3D glowing orbs, starfield, NO rectangular cards
// Inspired by AstroFin mockup: organic spheres, particle fields, orbital data
import { useState, useEffect, useRef } from "react";

const delay = ms => new Promise(r => setTimeout(r, ms));
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const fallbackProfile = { name: "", email: "user@finpilot.ai", balance: 124500, riskScore: 0.28, lastLogin: "Feb 17, 2026", insurances: 2, licPolicies: 1, investments: 4 };
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
    liveSignals: [
      "Offer-fit score by customer intent",
      "Eligibility confidence and trust score",
      "Channel timing signal (app / RM / assisted)",
    ],
    operatorControls: [
      "Allow / suppress offers by policy and consent",
      "Cap message frequency to avoid spam",
      "Approve campaign bundles per segment",
    ],
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
    liveSignals: [
      "Meeting urgency and follow-up score",
      "Portfolio risk heat for each relationship",
      "Product suitability confidence",
    ],
    operatorControls: [
      "Generate call brief before outreach",
      "Approve recommendation before customer share",
      "Push post-call tasks to RM workflow",
    ],
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
    liveSignals: [
      "Consent coverage and policy exceptions",
      "Sensitive-data access anomaly alerts",
      "Audit readiness and unresolved control gaps",
    ],
    operatorControls: [
      "Block unsafe actions in real time",
      "Export regulator-ready audit packet",
      "Escalate critical violations to compliance queue",
    ],
    appFunctions: [
      "Compliance pulse monitor inside operations dashboard",
      "One-click audit evidence export",
      "Automated breach-risk scoring and alerting",
    ],
  },
};
const fallbackCrossSell = {
  recommendations: [
    { productName: "Wealth Plus SIP", reason: "Recommended because salary increased and credit utilization is low.", confidence: 0.88, riskTag: "Low", ctaPrimary: "Apply", ctaSecondary: "Save" },
    { productName: "Secured Credit Card", reason: "Recommended due to stable repayment history and safe risk profile.", confidence: 0.82, riskTag: "Medium", ctaPrimary: "Apply", ctaSecondary: "Save" },
  ],
  reasoningOutput: "Recommended because salary increased & low credit utilization.",
  confidenceTop: 0.88,
  profile: { riskScore: 48 },
  filteredUnsafe: 1,
};
const fallbackRmSummary = {
  customer: { customerId: "CUST-7721", name: "Arjun Sharma", phoneMasked: "98****10", income: 92000, spending: 51000, loans: 24000, creditScore: 734, riskLevel: "medium" },
  flags: [
    { label: "EMI Burden", value: "26%", color: "green" },
    { label: "Credit Score", value: "734", color: "green" },
    { label: "Risk Score", value: "52", color: "yellow" },
  ],
  recommendation: "Eligible for secured credit card. Avoid unsecured top-up loan this month.",
  reason: "Moderate EMI burden and healthy score suggest controlled product exposure.",
};
const fallbackRmDecision = {
  allowed: true,
  recommendation: "Eligible for secured credit card",
  reason: "Customer profile passes affordability and policy checks.",
  riskFlag: "yellow",
};
const fallbackCompliance = {
  role: "user",
  consentStatus: "Active",
  dataUsed: ["Income", "Spending trend", "Loan burden", "Credit score", "Risk profile"],
  decisionExplainer: "Decisions are made from affordability, repayment burden, and policy controls.",
  badges: ["RBI-minded controls", "Data minimization", "Audit-ready", "Role-based access"],
  maskedPreview: { email: "us****ai", account: "AC****72", mobile: "98****10" },
  auditLogs: [],
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

function fallbackAstroReply(message = "") {
  const q = message.toLowerCase();
  if (q.includes("sip") || q.includes("mutual") || q.includes("invest") || q.includes("portfolio")) {
    return "For investments, split money into (1) emergency fund in liquid/FD, (2) 2–3 diversified equity index or large-cap funds via SIP, and (3) debt for near-term goals. Match horizon to product and avoid overlapping, high-cost schemes.";
  }
  if (q.includes("loan") || q.includes("emi") || q.includes("interest") || q.includes("personal loan")) {
    return "Keep all EMIs under ~40% of monthly income, prioritise closing high-interest personal/credit-card loans first, and avoid top-ups if utilisation or credit score is already stressed. Use surplus cash to pre-pay expensive debt before starting aggressive investments.";
  }
  if (q.includes("credit score") || q.includes("cibil") || q.includes("score")) {
    return "To improve credit score, avoid late payments, keep utilisation below ~30%, do not open/close many cards at once, and maintain a long, clean repayment track record. Even small on-time EMIs over 6–12 months can move your score meaningfully.";
  }
  if (q.includes("fraud") || q.includes("scam") || q.includes("upi") || q.includes("otp")) {
    return "Treat unknown payment links, OTP requests, and remote-access apps as red flags. Never share OTPs or PINs, lock limits on rarely used channels, and enable strong device + SIM security so suspicious transactions can be blocked quickly.";
  }
  return "Think in terms of cash flow: map income, essential spends, EMIs, and goals, then automate savings on salary day into 2–3 labelled buckets. This makes it easier to stay under a safe EMI limit, fund near-term goals, and still invest long term without surprises.";
}

const api = {
  login: async ({ email = "", password = "" } = {}) =>
    callApi("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }, { otpSent: true }),
  verifyOTP: async ({ otp, email = "" }) =>
    callApi("/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp, email }),
    }, otp === "123456" ? { success: true, token: "fp-local", bankerToken: "fp-banker-local" } : { success: false, message: "Wrong OTP — try 123456" }),
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
  askAstro: async ({ message = "", language = "en" }) =>
    callApi("/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language }),
    }, { reply: fallbackAstroReply(message) }),
  getBankerToken: async () =>
    callApi("/auth/banker-token", { method: "POST" }, { bankerToken: "demo-banker-token" }),
  crossSellRecommend: async ({ profile, token }) =>
    callApi("/cross-sell/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(profile),
    }, fallbackCrossSell),
  rmCustomerSummary: async ({ bankerToken, customer } = {}) => {
    const qs = customer
      ? `?${new URLSearchParams({
          customerId: `${customer.customerId || ""}`,
          name: `${customer.name || ""}`,
          phone: `${customer.phone || ""}`,
          income: `${customer.income ?? ""}`,
          spending: `${customer.spending ?? ""}`,
          loans: `${customer.loans ?? ""}`,
          creditScore: `${customer.creditScore ?? ""}`,
          riskLevel: `${customer.riskLevel || ""}`,
        }).toString()}`
      : "";
    return callApi(`/rm/customer-summary${qs}`, {
      headers: bankerToken ? { Authorization: `Bearer ${bankerToken}` } : {},
    }, fallbackRmSummary);
  },
  rmProductDecision: async ({ bankerToken, payload }) =>
    callApi("/rm/product-decision", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(bankerToken ? { Authorization: `Bearer ${bankerToken}` } : {}) },
      body: JSON.stringify(payload),
    }, fallbackRmDecision),
  complianceStatus: async ({ token }) =>
    callApi("/compliance/status", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }, fallbackCompliance),
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
    else { const r = await api.verifyOTP({ otp, email }); if (r.success) onSuccess(r); else setErr(r.message); }
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
function TopBar({ active, user, mobileMenuOpen, setMobileMenuOpen }) {
  const n = NAV.find(x => x.id === active);
  const mobile = useIsMobile();
  
  return (
    <div className="topbar-inner" style={{
      padding:"15px 36px", borderBottom:"1px solid rgba(255,255,255,0.04)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      background:"rgba(3,7,18,0.7)", backdropFilter:"blur(20px)",
      position:"sticky", top:0, zIndex:5,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        {mobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width:32,
              height:32,
              borderRadius:8,
              border:"1px solid rgba(255,255,255,0.1)",
              background:"rgba(255,255,255,0.05)",
              color:"rgba(226,234,255,0.8)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:18,
              cursor:"pointer",
              transition:"all 0.2s"
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        )}
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
function Home({ user, updates, customerProfile, setCustomerProfile }) {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(customerProfile.income);
  
  const metrics = [
    { value:`₹${customerProfile.income.toLocaleString("en-IN")}`,   label:"Income",    color:"#34d399", x:"68%", y:"12%" },
    { value:`₹${customerProfile.spending.toLocaleString("en-IN")}`,  label:"Spending",  color:"#fbbf24", x:"72%", y:"52%" },
    { value:`₹${(customerProfile.income - customerProfile.spending).toLocaleString("en-IN")}`,  label:"Cash Flow", color:"#63b3ff", x:"5%",  y:"20%" },
    { value:`₹${customerProfile.loans.toLocaleString("en-IN")}`,label:"Liabilities",color:"#f87171",x:"2%",y:"62%"},
  ];
  const latestFinance = updates?.latestFinance || [];
  const stockAlerts = updates?.stockAlerts || [];
  const knowledge = updates?.knowledge || [];
  
  const handleIncomeEdit = () => {
    setIsEditingIncome(true);
    setTempIncome(customerProfile.income);
  };
  
  const handleIncomeSave = () => {
    setCustomerProfile(prev => ({ ...prev, income: tempIncome }));
    setIsEditingIncome(false);
  };
  
  const handleIncomeCancel = () => {
    setTempIncome(customerProfile.income);
    setIsEditingIncome(false);
  };
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
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(226,234,255,0.35)" }}>Portfolio Balance</div>
              <button
                onClick={handleIncomeEdit}
                style={{
                  padding:"6px 12px",
                  background:"linear-gradient(135deg,rgba(99,179,255,0.15),rgba(99,179,255,0.08))",
                  border:"1px solid rgba(99,179,255,0.4)",
                  borderRadius:8,
                  color:"#63b3ff",
                  fontSize:11,
                  fontWeight:700,
                  cursor:"pointer",
                  transition:"all 0.2s",
                  boxShadow:"0 2px 8px rgba(99,179,255,0.2)",
                  position:"relative",
                  zIndex:10
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,179,255,0.25),rgba(99,179,255,0.15))"; e.currentTarget.style.borderColor = "rgba(99,179,255,0.6)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,179,255,0.15),rgba(99,179,255,0.08))"; e.currentTarget.style.borderColor = "rgba(99,179,255,0.4)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                ✏️ Edit Income
              </button>
            </div>
            {isEditingIncome ? (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input
                  type="number"
                  value={tempIncome}
                  onChange={(e) => setTempIncome(Number(e.target.value))}
                  style={{
                    padding:"8px 12px",
                    background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(99,179,255,0.3)",
                    borderRadius:8,
                    color:"#e2eaff",
                    fontSize:32,
                    fontWeight:800,
                    fontFamily:"'JetBrains Mono', monospace",
                    width:"100%"
                  }}
                />
                <div style={{ display:"flex", gap:4 }}>
                  <button
                    onClick={handleIncomeSave}
                    style={{
                      padding:"6px 12px",
                      background:"rgba(52,211,153,0.15)",
                      border:"1px solid rgba(52,211,153,0.3)",
                      borderRadius:6,
                      color:"#34d399",
                      fontSize:12,
                      fontWeight:600,
                      cursor:"pointer"
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleIncomeCancel}
                    style={{
                      padding:"6px 12px",
                      background:"rgba(248,113,113,0.15)",
                      border:"1px solid rgba(248,113,113,0.3)",
                      borderRadius:6,
                      color:"#f87171",
                      fontSize:12,
                      fontWeight:600,
                      cursor:"pointer"
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ position:"relative" }}>
                <div className="balance-num" style={{ fontSize:44, fontWeight:800, fontFamily:"'JetBrains Mono', monospace", background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  ₹{user.balance.toLocaleString("en-IN")}
                </div>
                <button
                  onClick={handleIncomeEdit}
                  style={{
                    position:"absolute",
                    bottom: "-8px",
                    right: "0px",
                    padding:"4px 10px",
                    background:"rgba(99,179,255,0.12)",
                    border:"1px solid rgba(99,179,255,0.3)",
                    borderRadius:6,
                    color:"#63b3ff",
                    fontSize:10,
                    fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,179,255,0.2)"; e.currentTarget.style.borderColor = "rgba(99,179,255,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,179,255,0.12)"; e.currentTarget.style.borderColor = "rgba(99,179,255,0.3)"; }}
                >
                  Edit Income
                </button>
              </div>
            )}
          </div>

          <div style={{ width:"100%", height:1, background:"rgba(255,255,255,0.05)" }} />

          {/* Orbital stat rings */}
          {[
            { label:"Savings Rate",  pct: (customerProfile.income - customerProfile.spending)/customerProfile.income,    color:"#34d399" },
            { label:"Spend Ratio",   pct: customerProfile.spending/customerProfile.income,    color:"#fbbf24" },
            { label:"Health Score",  pct: customerProfile.creditScore/900,           color:"#a78bfa" },
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
function AstroFin({ updates, customerProfile }) {
  const latestFinance = updates?.latestFinance || [];
  const [spentToday, setSpentToday] = useState(1200);
  const [spentMonth, setSpentMonth] = useState(18000);
  const [monthBudget, setMonthBudget] = useState(() => Math.max(5000, Math.round((customerProfile?.income || twin.income) * 0.6)));
  
  // Expense breakdown state
  const [expenses, setExpenses] = useState({
    grocery: 8000,
    rent: 12000,
    electricity: 1500,
    other: 3500
  });

  useEffect(() => {
    setMonthBudget((b) => {
      const next = Math.max(5000, Math.round((customerProfile?.income || twin.income) * 0.6));
      return b ? b : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerProfile?.income]);

  const left = Math.round(monthBudget - spentMonth);
  const leftPct = Math.max(0, Math.min(1, monthBudget ? left / monthBudget : 0));
  const warn = left <= 0 || leftPct < 0.2;
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

          <div style={{
            marginTop:14,
            clipPath:"polygon(6% 0, 94% 0, 100% 18%, 100% 82%, 94% 100%, 6% 100%, 0 82%, 0 18%)",
            border:`1px solid ${warn ? "rgba(248,113,113,0.35)" : "rgba(99,179,255,0.25)"}`,
            background: warn ? "rgba(248,113,113,0.07)" : "rgba(99,179,255,0.06)",
            padding:"16px 18px",
            display:"flex",
            flexDirection:"column",
            gap:10,
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", gap:12 }}>
              <div style={{ fontSize:12, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color: warn ? "rgba(248,113,113,0.95)" : "rgba(99,179,255,0.9)" }}>
                Spend Tracker (interactive)
              </div>
              <div style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:12, color: warn ? "#f87171" : "#63b3ff", fontWeight:800 }}>
                Left ₹{Math.max(0, left).toLocaleString("en-IN")}
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:10 }}>
              <label style={{ fontSize:12, color:"rgba(226,234,255,0.75)" }}>
                Spent today
                <input type="number" value={spentToday} min={0} onChange={e=>setSpentToday(Number(e.target.value) || 0)}
                  className="glass-input"
                  style={{ width:"100%", marginTop:6, background:"rgba(3,7,18,0.7)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, padding:"10px 12px" }}
                />
              </label>
              <label style={{ fontSize:12, color:"rgba(226,234,255,0.75)" }}>
                Spent this month
                <input type="number" value={spentMonth} min={0} onChange={e=>setSpentMonth(Number(e.target.value) || 0)}
                  className="glass-input"
                  style={{ width:"100%", marginTop:6, background:"rgba(3,7,18,0.7)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, padding:"10px 12px" }}
                />
              </label>
              <label style={{ fontSize:12, color:"rgba(226,234,255,0.75)" }}>
                Monthly budget
                <input type="number" value={monthBudget} min={0} onChange={e=>setMonthBudget(Number(e.target.value) || 0)}
                  className="glass-input"
                  style={{ width:"100%", marginTop:6, background:"rgba(3,7,18,0.7)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, padding:"10px 12px" }}
                />
              </label>
            </div>

            {/* Expense Breakdown Sliders */}
            <div style={{ marginTop:20, padding:"16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12 }}>
              <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.4)", marginBottom:16 }}>Expense Breakdown</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
                {[
                  { key: 'grocery', label: 'Grocery', icon: '🛒', color: '#34d399' },
                  { key: 'rent', label: 'Rent', icon: '🏠', color: '#fbbf24' },
                  { key: 'electricity', label: 'Electricity', icon: '⚡', color: '#63b3ff' },
                  { key: 'other', label: 'Other', icon: '📦', color: '#a78bfa' }
                ].map(expense => (
                  <div key={expense.key} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:16 }}>{expense.icon}</span>
                      <span style={{ fontSize:12, color:"rgba(226,234,255,0.6)" }}>{expense.label}</span>
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <span style={{ fontSize:11, fontFamily:"'JetBrains Mono', monospace", color:expense.color }}>
                        ₹{expenses[expense.key].toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize:10, color:"rgba(226,234,255,0.4)" }}>
                        {Math.round((expenses[expense.key] / Object.values(expenses).reduce((a,b) => a+b, 0)) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={expense.key === 'rent' ? 30000 : 15000}
                      step={100}
                      value={expenses[expense.key]}
                      onChange={(e) => setExpenses(prev => ({ ...prev, [expense.key]: Number(e.target.value) }))}
                      style={{
                        width:"100%",
                        height:6,
                        background:`linear-gradient(to right, ${expense.color} ${(expenses[expense.key] / (expense.key === 'rent' ? 30000 : 15000)) * 100}%, rgba(255,255,255,0.15) ${(expenses[expense.key] / (expense.key === 'rent' ? 30000 : 15000)) * 100}%)`,
                        outline:"none",
                        WebkitAppearance:"none",
                        borderRadius:3,
                        cursor:"pointer"
                      }}
                    />
                    <style jsx>{`
                      input[type="range"]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        width: 16px;
                        height: 16px;
                        background: ${expense.color};
                        cursor: pointer;
                        border-radius: 50%;
                        border: 2px solid rgba(255,255,255,0.8);
                        box-shadow: 0 0 8px ${expense.color};
                      }
                      input[type="range"]::-moz-range-thumb {
                        width: 16px;
                        height: 16px;
                        background: ${expense.color};
                        cursor: pointer;
                        border-radius: 50%;
                        border: 2px solid rgba(255,255,255,0.8);
                        box-shadow: 0 0 8px ${expense.color};
                      }
                    `}</style>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:12, padding:"12px", background:"rgba(99,179,255,0.05)", borderRadius:8 }}>
                <div style={{ fontSize:11, color:"rgba(226,234,255,0.6)", marginBottom:4 }}>
                  Total Expenses: <span style={{ color:"#63b3ff", fontWeight:700, fontFamily:"'JetBrains Mono', monospace" }}>
                    ₹{Object.values(expenses).reduce((a,b) => a+b, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div style={{ fontSize:10, color:"rgba(226,234,255,0.4)" }}>
                  Adjust sliders to see real-time expense allocation
                </div>
              </div>
            </div>

            <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:999 }}>
              <div style={{ height:"100%", width:`${leftPct * 100}%`, borderRadius:999, background: warn ? "linear-gradient(90deg,#f87171,#fbbf24)" : "linear-gradient(90deg,#63b3ff,#34d399)", transition:"width 0.35s ease" }} />
            </div>

            {warn ? (
              <div style={{ fontSize:12, lineHeight:1.6, color:"rgba(226,234,255,0.78)" }}>
                <span style={{ color:"#f87171", fontWeight:900 }}>Warning:</span> You’re running low on this month’s budget. Consider pausing discretionary spends and reviewing subscriptions.
              </div>
            ) : (
              <div style={{ fontSize:12, lineHeight:1.6, color:"rgba(226,234,255,0.78)" }}>
                Trend: today ₹{spentToday.toLocaleString("en-IN")} • month ₹{spentMonth.toLocaleString("en-IN")} • pacing looks healthy.
              </div>
            )}
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
  const [fxAmount, setFxAmount] = useState(100000);
  const [fxFrom, setFxFrom] = useState("INR");
  const [fxTo, setFxTo] = useState("USD");
  const fxRates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
  };
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
      <div style={{ marginTop:6, marginBottom:18, clipPath:"polygon(5% 0,95% 0,100% 18%,100% 82%,95% 100%,5% 100%,0 82%,0 18%)", border:"1px solid rgba(99,179,255,0.35)", background:"rgba(15,23,42,0.9)", padding:"14px 18px" }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(99,179,255,0.8)", marginBottom:8 }}>Quick Currency Converter</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, alignItems:"center" }}>
          <input
            type="number"
            value={fxAmount}
            onChange={e=>setFxAmount(Number(e.target.value) || 0)}
            className="glass-input"
            style={{ width:130, padding:"8px 10px", background:"rgba(15,23,42,0.9)", border:"1px solid rgba(148,163,184,0.5)", color:"#e2eaff", fontSize:13 }}
          />
          <select value={fxFrom} onChange={e=>setFxFrom(e.target.value)} style={{ padding:"8px 10px", background:"rgba(15,23,42,0.9)", color:"#e2eaff", border:"1px solid rgba(148,163,184,0.5)", fontSize:13 }}>
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>
          <span style={{ fontSize:12, color:"rgba(226,234,255,0.5)" }}>to</span>
          <select value={fxTo} onChange={e=>setFxTo(e.target.value)} style={{ padding:"8px 10px", background:"rgba(15,23,42,0.9)", color:"#e2eaff", border:"1px solid rgba(148,163,184,0.5)", fontSize:13 }}>
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
          </select>
          <div style={{ marginLeft:"auto", fontFamily:"'JetBrains Mono', monospace", fontSize:12, color:"#a5b4fc" }}>
            ≈ {fxAmount && fxRates[fxFrom] && fxRates[fxTo]
              ? (fxAmount * (fxRates[fxTo] / fxRates[fxFrom])).toFixed(2)
              : "0.00"}{" "}
            {fxTo}
          </div>
        </div>
        <div style={{ marginTop:6, fontSize:10, color:"rgba(148,163,184,0.9)" }}>Indicative mid-market rates for demo only.</div>
      </div>
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

      {/* Transaction Patterns Section */}
      <div style={{ marginTop:32, padding:"24px 0", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize:16, fontWeight:700, marginBottom:16, color:"#e2eaff", display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>📊</span>
          Transaction Patterns
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16 }}>
          {[
            {
              title: "Unusual Time Activity",
              description: "Multiple transactions between 2-4 AM, deviating from your normal pattern",
              frequency: "12 transactions",
              amount: "₹85,400 total",
              risk: "Medium",
              trend: "increasing",
              color: "#fbbf24"
            },
            {
              title: "High-Frequency Small Amounts",
              description: "Rapid succession of small transactions under ₹500, possible testing pattern",
              frequency: "28 transactions",
              amount: "₹12,600 total", 
              risk: "Low",
              trend: "stable",
              color: "#34d399"
            },
            {
              title: "New Merchant Category",
              description: "First-time transactions with international cryptocurrency exchanges",
              frequency: "3 transactions",
              amount: "₹1,25,000 total",
              risk: "High", 
              trend: "new",
              color: "#f87171"
            },
            {
              title: "Location Velocity Anomaly",
              description: "Transactions from multiple cities within 2-hour window",
              frequency: "5 transactions",
              amount: "₹32,800 total",
              risk: "Critical",
              trend: "spike",
              color: "#ef4444"
            }
          ].map((pattern, i) => (
            <div key={pattern.title} style={{
              background:"rgba(255,255,255,0.03)",
              border:`1px solid ${pattern.color}25`,
              borderRadius:16,
              padding:20,
              transition:"all 0.2s",
              animation:`fadeUp 0.4s ease ${(i+3)*0.1}s both`,
              borderLeft:`3px solid ${pattern.color}`
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ fontWeight:600, fontSize:14, color:"#e2eaff" }}>{pattern.title}</div>
                <div style={{ 
                  padding:"4px 8px", 
                  background:`${pattern.color}18`, 
                  color:pattern.color, 
                  borderRadius:6, 
                  fontSize:10, 
                  fontWeight:700,
                  textTransform:"uppercase",
                  letterSpacing:"0.05em"
                }}>
                  {pattern.risk}
                </div>
              </div>
              <div style={{ color:"rgba(226,234,255,0.5)", fontSize:12, marginBottom:12, lineHeight:1.4 }}>
                {pattern.description}
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, fontSize:11 }}>
                <div>
                  <span style={{ color:"rgba(226,234,255,0.4)" }}>Frequency:</span>
                  <div style={{ color:"rgba(226,234,255,0.8)", fontWeight:600, fontFamily:"'JetBrains Mono', monospace" }}>
                    {pattern.frequency}
                  </div>
                </div>
                <div>
                  <span style={{ color:"rgba(226,234,255,0.4)" }}>Total:</span>
                  <div style={{ color:"rgba(226,234,255,0.8)", fontWeight:600, fontFamily:"'JetBrains Mono', monospace" }}>
                    {pattern.amount}
                  </div>
                </div>
              </div>
              <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ fontSize:10, color:"rgba(226,234,255,0.4)" }}>Trend:</span>
                <div style={{ 
                  display:"flex", 
                  alignItems:"center", 
                  gap:4,
                  padding:"2px 6px",
                  background:pattern.trend === "increasing" ? "rgba(239,68,68,0.15)" : 
                           pattern.trend === "new" ? "rgba(251,191,36,0.15)" :
                           pattern.trend === "spike" ? "rgba(239,68,68,0.2)" :
                           "rgba(52,211,153,0.15)",
                  borderRadius:4,
                  fontSize:9,
                  fontWeight:600,
                  color:pattern.trend === "increasing" || pattern.trend === "spike" ? "#ef4444" :
                         pattern.trend === "new" ? "#fbbf24" : "#34d399"
                }}>
                  {pattern.trend === "increasing" && "↗ Rising"}
                  {pattern.trend === "stable" && "→ Stable"}
                  {pattern.trend === "new" && "⚠ New"}
                  {pattern.trend === "spike" && "⚡ Spike"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AI CHAT (Ask Astro) ───────────────────────────────────────
function AskAstro({ updates, customerProfile }) {
  const mobile = useIsMobile();
  
  // Language translation functions with properly encoded Unicode
  const translateText = (text, targetLang) => {
    const translations = {
      mr: {
        "Hi {userName}! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.": 
          "\u0928\u092e\u0938\u094d\u0915\u093e\u0930 {userName}! \u092e\u0940 \u0906\u0938\u094d\u091f\u094d\u0930\u094b \u0906\u0939\u0947, \u0924\u0941\u092e\u091a\u094d\u092f\u093e \u092b\u093f\u0928\u092a\u093e\u092f\u0932\u091f \u090f\u0906\u090f \u0938\u0939-\u092a\u093e\u092f\u0932\u091f. \u092e\u0932\u093e \u0924\u0941\u092e\u091a\u094d\u092f\u093e \u0915\u0930\u094d\u091c\u093e\u0902\u092c\u0926\u094d\u0926\u0932, \u091c\u094b\u0916\u092e \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932\u092c\u0926\u094d\u0926\u0932, \u092b\u0938\u0935\u0923\u0941\u0915\u0940 \u0938\u0942\u091a\u0928\u093e\u0902\u092c\u0926\u094d\u0926\u0932, \u0915\u093f\u0902\u0935\u093e \u0917\u0941\u0902\u0924\u0935\u0923\u0942\u0915 \u0927\u094b\u0930\u0923\u093e\u092c\u0926\u094d\u0926\u0932 \u0935\u093f\u091a\u093e\u0930\u093e.",
        "Based on your current EMI of ₹{amount} and income of ₹{income}, I recommend the following investment strategy:": 
          "\u0924\u0941\u092e\u091a\u094d\u092f\u093e \u0938\u0927\u094d\u092f\u093e\u091a\u094d\u092f\u093e \u20b9{amount} \u0908\u090f\u092e\u0906\u090f \u0906\u0923\u093f \u20b9{income} \u0909\u0924\u094d\u092a\u0928\u094d\u0928\u093e\u0935\u0930 \u0906\u0927\u093e\u0930\u093f\u0924, \u092e\u0940 \u0916\u093e\u0932\u0940\u0932 \u0917\u0941\u0902\u0924\u0935\u0923\u0942\u0915 \u0927\u094b\u0930\u0923 \u0936\u093f\u092b\u093e\u0930\u0938 \u0915\u0930\u0924\u094b:",
        "Emergency Fund": "\u0906\u092a\u0924\u094d\u0915\u093e\u0932\u0940\u0928 \u0928\u093f\u0927\u0940",
        "SIP Investment": "\u090f\u0938\u0906\u090f\u092a\u0940 \u0917\u0941\u0902\u0924\u0935\u0923\u0942\u0915",
        "Debt Repayment": "\u0915\u0930\u094d\u091c \u092a\u0930\u0924\u092b\u0947\u0921",
        "Long-term Growth": "\u0926\u0940\u0930\u094d\u0918\u0915\u093e\u0932\u0940\u0928 \u0935\u093e\u0922",
        "I couldn't generate a response yet. Please try once more.": "\u092e\u0940 \u0905\u091c\u0942\u0928 \u092a\u094d\u0930\u0924\u093f\u0938\u093e\u0926 \u0924\u092f\u093e\u0930 \u0915\u0930\u0942 \u0936\u0915\u0932\u094b \u0928\u093e\u0939\u0940. \u0915\u0943\u092a\u092f\u093e \u090f\u0915\u0926\u093e \u092a\u0941\u0928\u094d\u0939\u093e \u092a\u094d\u0930\u092f\u0924\u094d\u0928 \u0915\u0930\u093e."
      },
      hi: {
        "Hi {userName}! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.": 
          "\u0928\u092e\u0938\u094d\u0924\u0947 {userName}! \u092e\u0948\u0902 \u0906\u0938\u094d\u091f\u094d\u0930\u094b \u0939\u0942\u0902, \u0906\u092a\u0915\u093e \u092b\u093f\u0928\u092a\u093e\u092f\u0932\u091f \u090f\u0906\u0908 \u0938\u0939-\u092a\u093e\u092f\u0932\u091f\u0964 \u092e\u0941\u091d\u0938\u0947 \u0905\u092a\u0928\u0947 \u0923\u0923\u094b\u0902, \u091c\u094b\u0916\u093f\u092e \u092a\u094d\u0930\u094b\u092b\u093e\u0907\u0932, \u0927\u094b\u0916\u093e\u0927\u0921\u093c\u0940 \u0905\u0932\u0930\u094d\u091f, \u092f\u093e \u0928\u093f\u0935\u0947\u0936 \u0930\u0923\u0928\u0940\u0924\u093f \u0915\u0947 \u092c\u093e\u0930\u0947 \u092e\u0947\u0902 \u092a\u0942\u091b\u0947\u0902\u0964",
        "Based on your current EMI of ₹{amount} and income of ₹{income}, I recommend the following investment strategy:": 
          "\u0906\u092a\u0915\u0947 \u0935\u0930\u094d\u0924\u092e\u093e\u0928 \u20b9{amount} \u0908\u090f\u092e\u0906\u0908 \u0914\u0930 \u20b9{income} \u0906\u092f \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930, \u092e\u0948\u0902 \u0928\u093f\u092e\u094d\u0928\u0932\u093f\u0916\u093f\u0924 \u0928\u093f\u0935\u0947\u0936 \u0930\u0923\u0928\u0940\u0924\u093f \u0915\u0940 \u0905\u0928\u0941\u0936\u0902\u0938\u093e \u0915\u0930\u0924\u093e \u0939\u0942\u0902:",
        "Emergency Fund": "\u0906\u092a\u093e\u0924\u0915\u093e\u0932\u0940\u0928 \u0915\u094b\u0937",
        "SIP Investment": "\u090f\u0938\u0906\u0908\u092a\u0940 \u0928\u093f\u0935\u0947\u0936",
        "Debt Repayment": "\u0915\u0930\u094d\u091c \u091a\u0941\u0915\u094c\u0924\u0940",
        "Long-term Growth": "\u0926\u0940\u0930\u094d\u0918\u0915\u093e\u0932\u093f\u0915 \u0935\u093f\u0915\u093e\u0938",
        "I couldn't generate a response yet. Please try once more.": "\u092e\u0948\u0902 \u0905\u092d\u0940 \u0924\u0915 \u092a\u094d\u0930\u0924\u093f\u0915\u094d\u0930\u093f\u092f\u093e \u0928\u0939\u0940\u0902 \u0926\u0947 \u0938\u0915\u093e\u0964 \u0915\u0943\u092a\u092f\u093e \u090f\u0915 \u092c\u093e\u0930 \u092b\u093f\u0930 \u0938\u0947 \u092a\u094d\u0930\u092f\u093e\u0938 \u0915\u0930\u0947\u0902\u0964"
      }
    };
    
    if (targetLang === "en") return text;
    return translations[targetLang]?.[text] || text;
  };

  // State variables
  const [msgs, setMsgs] = useState([{ role:"ai", text:translateText("Hi! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.", "en") }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [chatErr, setChatErr] = useState("");
  const [lang, setLang] = useState("en"); // en, mr, hi
  const [bank, setBank] = useState("HDFC");
  const [bankSnap, setBankSnap] = useState(null);
  const [scanMsg, setScanMsg] = useState("");
  
  // Voice assistant states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  // Check browser support for voice features
  useEffect(() => {
    const speechSupported = 'speechSynthesis' in window;
    const recognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setVoiceSupported(speechSupported && recognitionSupported);
    
    if (recognitionSupported) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        // Auto-send the voice input
        if (transcript.trim()) {
          setTimeout(() => {
            const inputElement = document.querySelector('.glass-input');
            if (inputElement) {
              inputElement.value = transcript;
              setInput(transcript);
              // Trigger send function
              handleVoiceSend(transcript);
            }
          }, 500);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [lang]);
  
  // Handle voice input sending
  const handleVoiceSend = (voiceText) => {
    if (!voiceText.trim() || thinking) return;
    const q = voiceText.trim(); 
    setInput("");
    
    setMsgs(m => [...m, { role:"user", text: q }]);
    setThinking(true);
    setChatErr("");
    
    // Simulate AI response for voice input
    setTimeout(() => {
      let response;
      
      // Check for investment strategy queries
      if (q.toLowerCase().includes("investment") || q.toLowerCase().includes("strategy") || q.toLowerCase().includes("where to invest")) {
        const emi = customerProfile?.loans || 24000;
        const income = customerProfile?.income || 92000;
        response = { reply: generateInvestmentStrategy(emi, income) };
      } else if (q.toLowerCase().includes("hello") || q.toLowerCase().includes("hi")) {
        const userName = customerProfile?.name || "there";
        response = { reply: `Hello ${userName}! I'm Astro, your FinPilot AI co-pilot. How can I help you today?` };
      } else if (q.toLowerCase().includes("name")) {
        const userName = customerProfile?.name || "User";
        response = { reply: `Your name is ${userName}. I'm here to help with your financial questions!` };
      } else {
        response = { reply: `I understand you're asking about: "${q}". Let me help you with that. This is a simulated response for voice input.` };
      }
      
      setMsgs(m => [...m, { role:"ai", text: response.reply || translateText("I couldn't generate a response yet. Please try once more.", lang) }]);
      setThinking(false);
      
      // Auto-speak the response for voice interaction
      setTimeout(() => {
        speakText(response.reply);
      }, 1000);
    }, 1500);
  };
  
  // Voice synthesis function
  const speakText = (text) => {
    if (!voiceSupported || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.0;
    utterance.rate = 0.9;
    utterance.volume = 0.8;
    utterance.lang = lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  
  // Start voice recognition
  const startListening = () => {
    if (!recognition || isListening) return;
    
    setIsListening(true);
    recognition.start();
  };
  
  // Stop voice recognition
  const stopListening = () => {
    if (!recognition || !isListening) return;
    
    recognition.stop();
    setIsListening(false);
  };
  
  const ref = useRef(null);
  const knowledge = updates?.knowledge || [];
  
  // Update initial message when language changes or user name changes
  useEffect(() => {
    const userName = customerProfile?.name || "there";
    const welcomeMessage = `Hi ${userName}! I'm Astro, your FinPilot AI co-pilot. Ask me about your loans, risk profile, fraud alerts, or investment strategy.`;
    setMsgs([{ role:"ai", text:translateText(welcomeMessage, lang) }]);
  }, [lang, customerProfile?.name]);
  
  useEffect(() => { ref.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  // Investment strategy generator
  const generateInvestmentStrategy = (emi, income) => {
    const monthlySavings = Math.max(0, income - emi - (income * 0.3)); // Assuming 30% for basic expenses
    const emergencyFund = monthlySavings * 6; // 6 months emergency fund
    const sipAmount = Math.max(500, monthlySavings * 0.4); // 40% for SIP
    const debtRepayment = Math.max(0, monthlySavings * 0.3); // 30% for debt
    
    let strategy = `Based on your current EMI of ₹${emi.toLocaleString("en-IN")} and income of ₹${income.toLocaleString("en-IN")}, I recommend the following investment strategy:\n\n`;

    if (monthlySavings < 2000) {
      strategy += `⚠️ Low savings detected. Focus on increasing income or reducing expenses first.\n\n`;
    }

    strategy += `💰 Emergency Fund: Build ₹${emergencyFund.toLocaleString("en-IN")} (6 months)\n`;
    strategy += `📈 SIP Investment: ₹${sipAmount.toLocaleString("en-IN")}/month in diversified funds\n`;
    strategy += `🏦 Debt Repayment: ₹${debtRepayment.toLocaleString("en-IN")}/month extra EMI\n`;
    strategy += `🎯 Long-term Growth: Consider equity funds for 10+ year goals\n\n`;

    strategy += `📊 Asset Allocation:\n`;
    strategy += `• 40% Equity (high growth)\n`;
    strategy += `• 30% Debt (stability)\n`;
    strategy += `• 20% Gold (inflation hedge)\n`;
    strategy += `• 10% Cash (liquidity)`;

    return strategy;
  };

  const send = async () => {
    if (!input.trim() || thinking) return;
    const q = input.trim(); setInput("");
    setChatErr("");
    setMsgs(m => [...m, { role:"user", text:q }]);
    setThinking(true);
    
    try {
      let response;
      
      // Check for investment strategy queries
      if (q.toLowerCase().includes("investment") || q.toLowerCase().includes("strategy") || q.toLowerCase().includes("where to invest")) {
        // Extract EMI and income from context or use defaults
        const emi = customerProfile?.loans || 24000;
        const income = customerProfile?.income || 92000;
        response = { reply: generateInvestmentStrategy(emi, income) };
      } else {
        // Use existing API for other queries
        response = await api.askAstro({ message: q, language: lang });
      }
      
      setMsgs(m => [...m, { role:"ai", text: response.reply || translateText("I couldn't generate a response yet. Please try once more.", lang) }]);
    } catch {
      setChatErr(translateText("Ask Astro is temporarily unavailable. Please retry.", lang));
    } finally {
      setThinking(false);
    }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 140px)", animation:"fadeIn 0.4s ease" }}>
      {/* Sphere header */}
      <div style={{ display:"flex", alignItems:"center", gap:mobile ? 12 : 16, marginBottom:mobile ? 12 : 16, flexWrap:"wrap" }}>
        <AstroSphere size={mobile ? 60 : 100} color1="#0a2a5e" color2="#051530" glowColor="#63b3ff" variant="default" animate />
        <div style={{ flex:1, minWidth:mobile ? 140 : 180 }}>
          <div style={{ fontSize:mobile ? 20 : 26, fontWeight:800 }}>✦ Ask <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Astro</span></div>
          <div style={{ color:"rgba(226,234,255,0.35)", fontFamily:"'JetBrains Mono', monospace", fontSize:mobile ? 9 : 11, marginTop:mobile ? 2 : 4 }}>// conversational AI — powered by your financial twin</div>
        </div>
        <div style={{ display:"flex", gap:mobile ? 4 : 6, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ fontSize:mobile ? 9 : 10, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(148,163,184,0.9)" }}>Language</div>
          {[
            { id:"en", label:"English" },
            { id:"mr", label:"Marathi" },
            { id:"hi", label:"Hindi" },
          ].map(l => {
            const active = lang === l.id;
            return (
              <button key={l.id} onClick={()=>setLang(l.id)} style={{
                padding:mobile ? "4px 8px" : "6px 10px",
                fontSize:mobile ? 10 : 11,
                borderRadius:999,
                border: active ? "1px solid rgba(99,179,255,0.7)" : "1px solid rgba(148,163,184,0.5)",
                background: active ? "rgba(99,179,255,0.16)" : "rgba(15,23,42,0.9)",
                color: active ? "#e2eaff" : "rgba(226,234,255,0.7)",
              }}>
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:mobile ? 10 : 12, paddingRight:mobile ? 2 : 4 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", animation:"fadeUp 0.3s ease" }}>
            {m.role==="ai" && (
              <div style={{ width:mobile ? 24 : 32, height:mobile ? 24 : 32, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a8e,#2d1a8e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:mobile ? 12 : 14, flexShrink:0, marginRight:mobile ? 6 : 8, marginTop:2, boxShadow:"0 0 10px rgba(99,179,255,0.3)" }}>✦</div>
            )}
            <div style={{
              maxWidth:mobile ? "85%" : "72%", 
              padding:mobile ? "10px 14px" : "13px 18px",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              background:m.role==="user"?"linear-gradient(135deg,rgba(99,179,255,0.15),rgba(167,139,250,0.15))":"rgba(255,255,255,0.04)",
              border:m.role==="user"?"1px solid rgba(99,179,255,0.2)":"1px solid rgba(255,255,255,0.05)",
              fontSize:mobile ? 13 : 14, 
              lineHeight:1.6, 
              color:m.role==="user"?"#e2eaff":"rgba(226,234,255,0.8)",
              wordBreak:"break-word"
            }}>{m.text}</div>
          </div>
        ))}
        {thinking && (
          <div style={{ display:"flex", gap:mobile ? 3 : 4, paddingLeft:mobile ? 30 : 42 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:mobile ? 5 : 6, height:mobile ? 5 : 6, borderRadius:"50%", background:"#63b3ff", animation:`waveBar 0.9s ${i*0.15}s ease-in-out infinite` }} />)}
          </div>
        )}
        <div ref={ref} />
      </div>

      <div style={{ marginTop:mobile ? 10 : 12, display:"flex", flexDirection:"column", gap:mobile ? 6 : 8 }}>
        {/* Voice Assistant Controls */}
        {voiceSupported && (
          <div style={{ display:"flex", gap:mobile ? 6 : 8, marginBottom:mobile ? 6 : 8, alignItems:"center", padding:mobile ? "8px 12px" : "12px 16px", background:"rgba(99,179,255,0.05)", border:"1px solid rgba(99,179,255,0.2)", borderRadius:mobile ? 8 : 12 }}>
            {/* Voice Input Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              style={{
                padding:mobile ? "8px 12px" : "10px 16px",
                background: isListening ? "rgba(248,113,113,0.2)" : "rgba(99,179,255,0.1)",
                border: isListening ? "1px solid rgba(248,113,113,0.4)" : "1px solid rgba(99,179,255,0.3)",
                borderRadius:mobile ? 6 : 8,
                color: isListening ? "#f87171" : "#e2eaff",
                fontSize:mobile ? 11 : 12,
                fontWeight:600,
                cursor:"pointer",
                transition:"all 0.2s",
                display:"flex",
                alignItems:"center",
                gap:mobile ? 4 : 6
              }}
            >
              {isListening ? (
                <>
                  <div style={{ width:mobile ? 12 : 16, height:mobile ? 12 : 16, borderRadius:"50%", background:"#f87171", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:mobile ? 6 : 8, height:mobile ? 6 : 8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:mobile ? 6 : 8 }}>🔴 Stop</span>
                </>
              ) : (
                <>
                  <div style={{ width:mobile ? 12 : 16, height:mobile ? 12 : 16, borderRadius:"50%", background:"#63b3ff", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:mobile ? 6 : 8, height:mobile ? 6 : 8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:mobile ? 6 : 8 }}>🎤 Start Voice</span>
                </>
              )}
            </button>

            {/* Voice Output Button */}
            <button
              onClick={() => speakText(msgs[msgs.length - 1]?.text || "Welcome to FinPilot AI")}
              disabled={isSpeaking}
              style={{
                padding:mobile ? "8px 12px" : "10px 16px",
                background: isSpeaking ? "rgba(148,163,184,0.2)" : "rgba(52,211,153,0.1)",
                border: isSpeaking ? "1px solid rgba(148,163,184,0.4)" : "1px solid rgba(52,211,153,0.3)",
                borderRadius:mobile ? 6 : 8,
                color: isSpeaking ? "#94a3b8" : "#34d399",
                fontSize:mobile ? 11 : 12,
                fontWeight:600,
                cursor: isSpeaking ? "not-allowed" : "pointer",
                transition:"all 0.2s",
                display:"flex",
                alignItems:"center",
                gap:mobile ? 4 : 6
              }}
            >
              {isSpeaking ? (
                <>
                  <div style={{ width:mobile ? 12 : 16, height:mobile ? 12 : 16, borderRadius:"50%", background:"#94a3b8", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:mobile ? 6 : 8, height:mobile ? 6 : 8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:mobile ? 6 : 8 }}>🔊 Speaking...</span>
                </>
              ) : (
                <>
                  <div style={{ width:mobile ? 12 : 16, height:mobile ? 12 : 16, borderRadius:"50%", background:"#34d399", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <div style={{ width:mobile ? 6 : 8, height:mobile ? 6 : 8, borderRadius:"50%", background:"rgba(255,255,255,0.3)", margin:"0 auto" }}></div>
                  </div>
                  <span style={{ marginLeft:mobile ? 6 : 8 }}>🔊 Speak Response</span>
                </>
              )}
            </button>

            {/* Voice Status Indicator */}
            <div style={{ 
              fontSize:mobile ? 9 : 10, 
              color:"rgba(226,234,255,0.6)", 
              fontFamily:"'JetBrains Mono', monospace",
              textAlign:"center",
              padding:mobile ? "4px 8px" : "6px 12px",
              background:"rgba(15,23,42,0.1)",
              border:"1px solid rgba(52,211,153,0.2)",
              borderRadius:mobile ? 4 : 6,
              minWidth:mobile ? 80 : 120
            }}>
              {isListening ? "🎤 Listening..." : isSpeaking ? "🔊 Speaking..." : "🎤 Voice Ready"}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:mobile ? 6 : 8, flexWrap:"wrap", alignItems:"center" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask about loans, risk, fraud, investments…"
            className="glass-input"
            style={{ flex:1, minWidth:0, padding:mobile ? "10px 14px" : "13px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:mobile ? 10 : 12, color:"#e2eaff", fontSize:mobile ? 13 : 14 }} />
          <button onClick={send} style={{
            padding:mobile ? "10px 14px" : "13px 18px",
            background:"linear-gradient(135deg,rgba(99,179,255,0.2),rgba(167,139,250,0.2))",
            border:"1px solid rgba(99,179,255,0.3)",
            borderRadius:mobile ? 10 : 12,
            color:"#e2eaff",
            fontSize:mobile ? 13 : 14,
            fontWeight:700,
            cursor:"pointer",
            transition:"all 0.2s"
          }}>
            Send
          </button>
          
          {/* Bank Selection & Scan Passbook */}
          <select value={bank} onChange={e=>setBank(e.target.value)} style={{
            padding:mobile ? "8px 12px" : "10px 14px",
            background:"rgba(255,255,255,0.04)",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:mobile ? 8 : 10,
            color:"#e2eaff",
            fontSize:mobile ? 11 : 12,
            cursor:"pointer"
          }}>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="SBI">State Bank of India</option>
            <option value="Axis">Axis Bank</option>
            <option value="Kotak">Kotak Bank</option>
          </select>
          
          <button onClick={() => {
            setScanMsg(`🔍 Scanning ${bank} passbook...`);
            setTimeout(() => {
              const transactions = [
                { date: "2026-02-20", desc: "UPI Transfer to John", amount: -2500, balance: 45600 },
                { date: "2026-02-19", desc: "Salary Credit", amount: 52000, balance: 48100 },
                { date: "2026-02-18", desc: "Amazon Purchase", amount: -1299, balance: 4100 },
                { date: "2026-02-17", desc: "Electric Bill", amount: -850, balance: 5399 }
              ];
              setBankSnap({ bank, balance: 45600, lastTransaction: "UPI Transfer to John", transactions });
              setScanMsg(`✅ ${bank} passbook scanned successfully! Latest balance: ₹45,600`);
            }, 2000);
          }} style={{
            padding:mobile ? "8px 12px" : "10px 14px",
            background:"linear-gradient(135deg,rgba(52,211,153,0.2),rgba(34,211,238,0.2))",
            border:"1px solid rgba(52,211,153,0.3)",
            borderRadius:mobile ? 8 : 10,
            color:"#e2eaff",
            fontSize:mobile ? 11 : 12,
            fontWeight:600,
            cursor:"pointer",
            transition:"all 0.2s"
          }}>
            📷 Scan Passbook
          </button>
          
          <input
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display:"none" }}
            onChange={e=>{
              if (!e.target.files?.length) return;
              setScanMsg("🔍 Processing passbook image...");
              setTimeout(() => {
                setScanMsg(`✅ Passbook processed! Account: ${bank} | Balance: ₹45,600 | Last: UPI Transfer`);
              }, 1500);
            }}
          />
        </div>
        {!!chatErr && <div style={{ marginTop:8, color:"#f87171", fontSize:12 }}>{chatErr}</div>}
        {!!scanMsg && <div style={{ marginTop:4, color:"rgba(226,234,255,0.7)", fontSize:11 }}>{scanMsg}</div>}
        
        {/* Bank Transaction Display */}
        {bankSnap && (
          <div style={{
            marginTop:16,
            padding:16,
            background:"rgba(15,23,42,0.1)",
            border:"1px solid rgba(52,211,153,0.2)",
            borderRadius:12,
            animation:"fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize:14, fontWeight:700, color:"#63b3ff", marginBottom:12 }}>
              📊 {bankSnap.bank} Account Summary
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:16 }}>
              <div style={{ padding:12, background:"rgba(99,179,255,0.1)", borderRadius:8, border:"1px solid rgba(99,179,255,0.2)" }}>
                <div style={{ fontSize:11, color:"rgba(226,234,255,0.6)", marginBottom:4 }}>Current Balance</div>
                <div style={{ fontSize:20, fontWeight:700, color:"#63b3ff" }}>₹{bankSnap.balance.toLocaleString("en-IN")}</div>
              </div>
              <div style={{ padding:12, background:"rgba(52,211,153,0.1)", borderRadius:8, border:"1px solid rgba(52,211,153,0.2)" }}>
                <div style={{ fontSize:11, color:"rgba(226,234,255,0.6)", marginBottom:4 }}>Last Transaction</div>
                <div style={{ fontSize:13, fontWeight:600, color:"#34d399" }}>{bankSnap.lastTransaction}</div>
              </div>
            </div>
            
            <div style={{ fontSize:12, fontWeight:600, color:"rgba(226,234,255,0.7)", marginBottom:8 }}>
              📈 Recent Transactions
            </div>
            <div style={{ maxHeight:200, overflowY:"auto", paddingRight:4 }}>
              {bankSnap.transactions.map((tx, idx) => (
                <div key={idx} style={{
                  display:"flex", 
                  justifyContent:"space-between", 
                  alignItems:"center",
                  padding:"8px 12px",
                  background: idx % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(15,23,42,0.05)",
                  borderBottom:"1px solid rgba(255,255,255,0.04)",
                  fontSize:11
                }}>
                  <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                    <div style={{ color:"rgba(226,234,255,0.6)", fontSize:10 }}>{tx.date}</div>
                    <div style={{ color:"#e2eaff" }}>{tx.desc}</div>
                  </div>
                  <div style={{ 
                    fontWeight:600, 
                    color: tx.amount < 0 ? "#f87171" : "#34d399" 
                  }}>
                    {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    <div style={{ position:"relative", animation:`fadeUp 0.35s ease ${delay}s both` }}>
      <div aria-hidden style={{
        position:"absolute", inset:0,
        clipPath:"polygon(4% 0, 96% 0, 100% 12%, 100% 88%, 96% 100%, 4% 100%, 0 88%, 0 12%)",
        background:`linear-gradient(135deg, ${color}12, rgba(255,255,255,0.02))`,
        border:`1px solid ${color}45`,
        boxShadow:`0 0 18px ${color}15`,
        pointerEvents:"none",
      }} />
      <div style={{
        position:"relative",
        padding:"20px 26px",
        paddingLeft:30,
        overflow:"visible",
      }}>
        <div style={{ fontSize:12, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", color, marginBottom:12, lineHeight:1.2 }}>
          {title}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ display:"flex", alignItems:"flex-start", gap:10, color:"rgba(226,234,255,0.82)", lineHeight:1.6, fontSize:13 }}>
              <span style={{ marginTop:6, width:6, height:6, borderRadius:"50%", background:color, boxShadow:`0 0 7px ${color}`, flexShrink:0 }} />
              <span style={{ paddingRight:6 }}>{it}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SmartCrossSell({ token, customerProfile, setCustomerProfile }) {
  const [result, setResult] = useState(fallbackCrossSell);
  const [loading, setLoading] = useState(false);
  const profile = customerProfile;
  const update = (k, v) => setCustomerProfile((p) => ({ ...p, [k]: v }));
  
  // Dynamic reasoning logic based on profile data
  const generateDynamicRecommendations = (profileData) => {
    const { income, spending, loans, creditScore, riskLevel } = profileData;
    const savingsRatio = (income - spending) / income;
    const debtToIncome = loans / income;
    const creditUtilization = spending / income;
    
    const recommendations = [];
    let reasoningOutput = "";
    let topConfidence = 0;
    
    // Wealth Plus SIP logic
    if (savingsRatio > 0.3 && creditScore > 700) {
      recommendations.push({
        productName: "Wealth Plus SIP",
        reason: `High savings ratio (${Math.round(savingsRatio * 100)}%) and excellent credit score (${creditScore}) indicate strong investment capacity.`,
        confidence: 0.92,
        riskTag: "Low",
        ctaPrimary: "Apply",
        ctaSecondary: "Save"
      });
      topConfidence = Math.max(topConfidence, 0.92);
    } else if (savingsRatio > 0.2) {
      recommendations.push({
        productName: "Wealth Plus SIP",
        reason: `Moderate savings ratio (${Math.round(savingsRatio * 100)}%) suggests potential for systematic investment planning.`,
        confidence: 0.75,
        riskTag: "Low",
        ctaPrimary: "Apply",
        ctaSecondary: "Save"
      });
      topConfidence = Math.max(topConfidence, 0.75);
    }
    
    // Secured Credit Card logic
    if (creditScore > 750 && debtToIncome < 0.3) {
      recommendations.push({
        productName: "Secured Credit Card",
        reason: `Excellent credit score (${creditScore}) and low debt-to-income ratio (${Math.round(debtToIncome * 100)}%) qualify for premium secured card.`,
        confidence: 0.88,
        riskTag: "Low",
        ctaPrimary: "Apply",
        ctaSecondary: "Save"
      });
      topConfidence = Math.max(topConfidence, 0.88);
    } else if (creditScore > 650 && debtToIncome < 0.5) {
      recommendations.push({
        productName: "Secured Credit Card",
        reason: `Good credit score (${creditScore}) and manageable debt levels (${Math.round(debtToIncome * 100)}% DTI) support secured card eligibility.`,
        confidence: 0.72,
        riskTag: "Medium",
        ctaPrimary: "Apply",
        ctaSecondary: "Save"
      });
      topConfidence = Math.max(topConfidence, 0.72);
    }
    
    // Instant Personal Loan logic
    if (spending > income * 0.8 && creditScore > 600) {
      recommendations.push({
        productName: "Instant Personal Loan",
        reason: `High spending ratio (${Math.round(creditUtilization * 100)}%) with decent credit score (${creditScore}) suggests need for liquidity management.`,
        confidence: 0.68,
        riskTag: "Medium",
        ctaPrimary: "Apply",
        ctaSecondary: "Save"
      });
      topConfidence = Math.max(topConfidence, 0.68);
    } else if (loans > 50000 && creditScore > 700) {
      recommendations.push({
        productName: "Instant Personal Loan",
        reason: `Existing loan portfolio (₹${loans.toLocaleString("en-IN")}) with strong credit score (${creditScore}) indicates loan consolidation opportunity.`,
        confidence: 0.74,
        riskTag: "Low",
        ctaPrimary: "Apply",
        ctaSecondary: "Save"
      });
      topConfidence = Math.max(topConfidence, 0.74);
    }
    
    // Generate reasoning output
    if (recommendations.length > 0) {
      const topRec = recommendations.reduce((prev, curr) => prev.confidence > curr.confidence ? prev : curr);
      reasoningOutput = `Primary recommendation: ${topRec.productName}. Based on income ₹${income.toLocaleString("en-IN")}, spending ratio ${Math.round(creditUtilization * 100)}%, and credit score ${creditScore}.`;
    } else {
      reasoningOutput = `Profile analysis complete. Income: ₹${income.toLocaleString("en-IN")}, Credit Score: ${creditScore}. Current financial profile is stable - consider savings products.`;
    }
    
    return {
      recommendations,
      reasoningOutput,
      confidenceTop: topConfidence,
      profile: { riskScore: Math.round((1 - savingsRatio) * 100) },
      filteredUnsafe: riskLevel === "high" ? 2 : riskLevel === "medium" ? 1 : 0
    };
  };
  
  const run = async () => {
    setLoading(true);
    // Simulate API call with dynamic logic
    setTimeout(() => {
      const dynamicResult = generateDynamicRecommendations(profile);
      setResult(dynamicResult);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ fontSize:30, fontWeight:800 }}>⟠ <span style={{ background:"linear-gradient(135deg,#34d399,#63b3ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Smart Cross-Sell</span></div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
        <FeatureShard title="Profile Inputs" color="#63b3ff" items={[`Income ₹${profile.income.toLocaleString("en-IN")}`, `Spending ₹${profile.spending.toLocaleString("en-IN")}`, `Loans ₹${profile.loans.toLocaleString("en-IN")}`, `Credit ${profile.creditScore}`, `Risk ${profile.riskLevel}`]} />
        <div style={{ position:"relative" }}>
          <div aria-hidden style={{
            position:"absolute",
            inset:0,
            clipPath:"polygon(6% 0, 94% 0, 100% 16%, 100% 84%, 94% 100%, 6% 100%, 0 84%, 0 16%)",
            border:"1px solid rgba(99,179,255,0.4)",
            background:"rgba(99,179,255,0.08)",
            boxShadow:"0 0 16px rgba(99,179,255,0.2)",
            pointerEvents:"none",
          }} />
          <div style={{ position:"relative", padding:"18px 22px", paddingLeft:26, display:"flex", flexDirection:"column", gap:10 }}>
            <label style={{ fontSize:12, display:"block" }}>Income
              <input type="range" min={25000} max={220000} step={1000} value={profile.income} onChange={e=>update("income", Number(e.target.value))} style={{ width:"100%", marginTop:4 }} />
            </label>
            <label style={{ fontSize:12, display:"block" }}>Spending
              <input type="range" min={8000} max={160000} step={1000} value={profile.spending} onChange={e=>update("spending", Number(e.target.value))} style={{ width:"100%", marginTop:4 }} />
            </label>
            <label style={{ fontSize:12, display:"block" }}>Loans
              <input type="range" min={0} max={120000} step={1000} value={profile.loans} onChange={e=>update("loans", Number(e.target.value))} style={{ width:"100%", marginTop:4 }} />
            </label>
            <label style={{ fontSize:12, display:"block" }}>Credit Score
              <input type="range" min={500} max={900} step={1} value={profile.creditScore} onChange={e=>update("creditScore", Number(e.target.value))} style={{ width:"100%", marginTop:4 }} />
            </label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:4 }}>
              {["low","medium","high"].map((r)=>(
                <button key={r} onClick={()=>update("riskLevel", r)} style={{ clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)", border:`1px solid ${profile.riskLevel===r?"rgba(52,211,153,0.6)":"rgba(255,255,255,0.2)"}`, color:profile.riskLevel===r?"#34d399":"rgba(226,234,255,0.7)", padding:"7px 10px", fontSize:11 }}>
                  {r}
                </button>
              ))}
            </div>
            <div style={{ marginTop:4 }}>
              <Btn onClick={run} loading={loading}>POST /cross-sell/recommend</Btn>
            </div>
          </div>
        </div>
        <FeatureShard title="Reasoning Output" color="#34d399" items={[result.reasoningOutput || "No recommendation yet", `Top confidence ${Math.round((result.confidenceTop || 0) * 100)}%`, `Unsafe filtered ${result.filteredUnsafe || 0}`]} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:14 }}>
        {(result.recommendations || []).map((rec, i) => (
          <div key={i} style={{ position:"relative" }}>
            <div aria-hidden style={{
              position:"absolute", inset:0,
              clipPath:"polygon(8% 0, 92% 0, 100% 18%, 100% 82%, 92% 100%, 8% 100%, 0 82%, 0 18%)",
              border:"1px solid rgba(52,211,153,0.4)",
              background:"linear-gradient(145deg, rgba(52,211,153,0.16), rgba(99,179,255,0.06))",
              boxShadow:"0 0 18px rgba(52,211,153,0.28)",
              pointerEvents:"none",
            }} />
            <div style={{ position:"relative", padding:"16px 22px", paddingLeft:26, display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8 }}>
                <div style={{ fontSize:18, fontWeight:800 }}>{rec.productName}</div>
                <div style={{ clipPath:"polygon(15% 0,100% 0,85% 100%,0 100%)", border:"1px solid rgba(255,255,255,0.25)", padding:"4px 9px", fontSize:10, color:rec.riskTag==="Low"?"#34d399":"#fbbf24" }}>{rec.riskTag}</div>
              </div>
              <div style={{ fontSize:13, color:"rgba(226,234,255,0.82)", lineHeight:1.6 }}>{rec.reason}</div>
              <div style={{ fontSize:12, color:"#63b3ff" }}>Confidence {Math.round((rec.confidence || 0) * 100)}%</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button style={{ clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#e2eaff", padding:"8px 12px", fontSize:12 }}>{rec.ctaPrimary || "Apply"}</button>
                <button style={{ clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)", border:"1px solid rgba(255,255,255,0.28)", background:"rgba(255,255,255,0.06)", color:"#e2eaff", padding:"8px 12px", fontSize:12 }}>{rec.ctaSecondary || "Save"}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BankerRMCopilot({ token, bankerToken, setBankerToken, customerProfile, setCustomerProfile }) {
  const [summary, setSummary] = useState(null);
  const [decision, setDecision] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("Secured Credit Card");
  const [err, setErr] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionSecure, setSessionSecure] = useState(false);
  const activeToken = bankerToken || token;

  // Security & Authentication Layer
  const authenticateBanker = () => {
    if (!activeToken) {
      setErr("🔒 Banker authentication required. Please provide valid credentials.");
      return false;
    }
    
    // Simulate secure authentication
    setIsAuthenticated(true);
    setSessionSecure(true);
    setErr("");
    return true;
  };

  const enableBanker = () => {
    if (authenticateBanker()) {
      setBankerToken("banker_" + Date.now());
      setErr("✅ Banker mode enabled - Secure session active");
    }
  };

  // Generate product-specific reasonings
  const getProductReasoning = (product, profile) => {
    const { income, spending, loans, creditScore, riskLevel } = profile;
    const savingsRatio = (income - spending) / income;
    const debtToIncome = loans / income;
    const creditUtilization = spending / income;

    switch (product) {
      case "Secured Credit Card":
        if (creditScore > 750 && debtToIncome < 0.3) {
          return {
            allowed: true,
            recommend: "APPROVED - Premium Secured Card",
            reason: "Excellent credit score (>750) and low debt-to-income ratio (<30%) qualify for premium secured credit card with ₹2,00,000 limit and cashback benefits."
          };
        } else if (creditScore > 650 && debtToIncome < 0.5) {
          return {
            allowed: true,
            recommend: "APPROVED - Standard Secured Card",
            reason: "Good credit score (>650) and manageable debt levels (<50% DTI) support secured credit card eligibility with ₹1,00,000 limit."
          };
        } else {
          return {
            allowed: false,
            recommend: "BLOCKED - Improve Credit Profile",
            reason: `Credit score ${creditScore} and DTI ${Math.round(debtToIncome * 100)}% below threshold. Focus on reducing existing debt and improving payment history.`
          };
        }

      case "Wealth Plus SIP":
        if (savingsRatio > 0.3 && creditScore > 700) {
          return {
            allowed: true,
            recommend: "APPROVED - Wealth Plus SIP",
            reason: `High savings ratio (${Math.round(savingsRatio * 100)}%) and excellent credit score (${creditScore}) indicate strong investment capacity. Recommended SIP: ₹15,000/month for diversified portfolio.`
          };
        } else if (savingsRatio > 0.2) {
          return {
            allowed: true,
            recommend: "APPROVED - Starter SIP",
            reason: `Moderate savings ratio (${Math.round(savingsRatio * 100)}%) suggests potential for systematic investment. Recommended SIP: ₹8,000/month to begin wealth building.`
          };
        } else {
          return {
            allowed: false,
            recommend: "BLOCKED - Increase Savings",
            reason: `Current savings ratio (${Math.round(savingsRatio * 100)}%) below minimum 20%. Focus on increasing savings before starting SIP investments.`
          };
        }

      case "Instant Personal Loan":
        if (creditScore > 750 && debtToIncome < 0.4) {
          return {
            allowed: true,
            recommend: "APPROVED - Premium Personal Loan",
            reason: `Excellent credit score (${creditScore}) and low debt burden qualify for premium personal loan up to ₹5,00,000 at 10.5% APR.`
          };
        } else if (creditScore > 650 && debtToIncome < 0.6) {
          return {
            allowed: true,
            recommend: "APPROVED - Standard Personal Loan",
            reason: `Good credit profile supports personal loan up to ₹3,00,000 at 12.5% APR. Recommended for debt consolidation.`
          };
        } else {
          return {
            allowed: false,
            recommend: "BLOCKED - High Risk Profile",
            reason: `High debt-to-income ratio (${Math.round(debtToIncome * 100)}%) and credit score ${creditScore} indicate elevated risk. Reduce existing obligations first.`
          };
        }

      default:
        return {
          allowed: false,
          recommend: "UNKNOWN PRODUCT",
          reason: "Product not recognized in risk assessment system."
        };
    }
  };

  const getDecision = async () => {
    if (!summary?.customer) return;
    // Use local reasoning logic instead of API call
    const reasoning = getProductReasoning(selectedProduct, customerProfile);
    setDecision(reasoning);
  };

  const loadSummary = async () => {
    if (!isAuthenticated) {
      setErr("🔒 Authentication required to access customer data");
      return;
    }

    try {
      const x = await api.getBankerToken();
      setBankerToken(x.bankerToken || "");
      setSummary({
        customerName: customerProfile?.name || "Customer",
        customerId: customerProfile?.customerId || "CUST-7721",
        riskProfile: customerProfile?.riskLevel || "medium",
        lastLogin: new Date().toLocaleDateString("en-IN"),
        sessionSecure: true,
        dataEncrypted: true
      });
      setErr("✅ Secure customer data loaded");
    } catch (error) {
      setErr("🔐 Failed to load customer summary - Please check permissions");
    }
  };

  useEffect(() => {
    if (bankerToken) loadSummary();
  }, [bankerToken]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!bankerToken) return;
    const t = setTimeout(() => loadSummary(), 180);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bankerToken,
    customerProfile?.name,
    customerProfile?.income,
    customerProfile?.spending,
    customerProfile?.loans,
    customerProfile?.creditScore,
    customerProfile?.riskLevel,
  ]);

  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ fontSize:30, fontWeight:800 }}>⌁ <span style={{ background:"linear-gradient(135deg,#63b3ff,#34d399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Banker / RM Co-Pilot</span></div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
        <button onClick={enableBanker} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#63b3ff", padding:"10px 14px", fontSize:12 }}>Enable Banker Role</button>
        <button onClick={loadSummary} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(52,211,153,0.4)", background:"rgba(52,211,153,0.12)", color:"#34d399", padding:"10px 14px", fontSize:12 }}>GET /rm/customer-summary</button>
      </div>
      {!bankerToken && <div style={{ color:"rgba(226,234,255,0.7)", fontSize:12 }}>Enable banker role to access RM-protected APIs.</div>}
      {!!err && <div style={{ color:"#f87171", fontSize:12 }}>{err}</div>}
      <div style={{
        clipPath:"polygon(4% 0, 96% 0, 100% 12%, 100% 88%, 96% 100%, 4% 100%, 0 88%, 0 12%)",
        border:"1px solid rgba(99,179,255,0.25)",
        background:"rgba(99,179,255,0.06)",
        padding:"16px 18px",
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
        gap:12,
      }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(99,179,255,0.85)", fontWeight:800, gridColumn:"1 / -1" }}>
          Live Customer Inputs (shared with Cross‑Sell)
        </div>
        <label style={{ fontSize:12 }}>Name
          <input value={customerProfile.name} onChange={e=>setCustomerProfile(p=>({...p, name:e.target.value}))} className="glass-input" style={{ width:"100%", marginTop:6, background:"rgba(3,7,18,0.7)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.14)", borderRadius:10, padding:"10px 12px" }} />
        </label>
        <label style={{ fontSize:12 }}>Income ₹{customerProfile.income.toLocaleString("en-IN")}
          <input type="range" min={25000} max={220000} step={1000} value={customerProfile.income} onChange={e=>setCustomerProfile(p=>({...p, income:Number(e.target.value)}))} style={{ width:"100%" }} />
        </label>
        <label style={{ fontSize:12 }}>Spending ₹{customerProfile.spending.toLocaleString("en-IN")}
          <input type="range" min={8000} max={160000} step={1000} value={customerProfile.spending} onChange={e=>setCustomerProfile(p=>({...p, spending:Number(e.target.value)}))} style={{ width:"100%" }} />
        </label>
        <label style={{ fontSize:12 }}>Loans ₹{customerProfile.loans.toLocaleString("en-IN")}
          <input type="range" min={0} max={120000} step={1000} value={customerProfile.loans} onChange={e=>setCustomerProfile(p=>({...p, loans:Number(e.target.value)}))} style={{ width:"100%" }} />
        </label>
        <label style={{ fontSize:12 }}>Credit {customerProfile.creditScore}
          <input type="range" min={500} max={900} step={1} value={customerProfile.creditScore} onChange={e=>setCustomerProfile(p=>({...p, creditScore:Number(e.target.value)}))} style={{ width:"100%" }} />
        </label>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ fontSize:12 }}>Risk Level</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["low","medium","high"].map((r)=>(
              <button key={r} onClick={()=>setCustomerProfile(p=>({...p, riskLevel:r}))} style={{ clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)", border:`1px solid ${customerProfile.riskLevel===r?"rgba(52,211,153,0.6)":"rgba(255,255,255,0.2)"}`, color:customerProfile.riskLevel===r?"#34d399":"rgba(226,234,255,0.7)", padding:"7px 10px", fontSize:11 }}>{r}</button>
            ))}
          </div>
        </div>
      </div>
      {summary?.customer && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }} className="sphere-row">
          <FeatureShard title="Customer Snapshot" color="#63b3ff" items={Object.entries(summary.customer).map(([k,v]) => `${k}: ${v}`)} />
          <FeatureShard title="Risk Flags + RM Recommendation" color="#fbbf24" items={[...(summary.flags || []).map((f)=>`${f.label}: ${f.value} (${f.color})`), summary.recommendation, `Why: ${summary.reason}`]} />
        </div>
      )}
      <div style={{ clipPath:"polygon(7% 0,100% 0,93% 100%,0 100%)", border:"1px solid rgba(52,211,153,0.35)", background:"rgba(52,211,153,0.08)", padding:"16px 20px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <select value={selectedProduct} onChange={(e)=>setSelectedProduct(e.target.value)} style={{ background:"rgba(3,7,18,0.8)", color:"#e2eaff", border:"1px solid rgba(255,255,255,0.2)", padding:"8px 10px" }}>
          <option>Secured Credit Card</option>
          <option>Instant Personal Loan</option>
          <option>Wealth Plus SIP</option>
        </select>
        <button onClick={getDecision} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#e2eaff", padding:"9px 14px", fontSize:12 }}>POST /rm/product-decision</button>
      </div>
      {decision && <FeatureShard title="Decision Reasoning" color={decision.allowed ? "#34d399" : "#f87171"} items={[`${decision.allowed ? "Allowed" : "Blocked"}: ${decision.recommendation}`, `Why ${decision.allowed ? "allowed" : "blocked"}: ${decision.reason}`]} />}
    </div>
  );
}

function PrivacyCompliance({ token, bankerToken }) {
  const [data, setData] = useState(fallbackCompliance);
  const load = async () => {
    const d = await api.complianceStatus({ token: bankerToken || token });
    setData(d);
  };
  useEffect(() => { load(); }, [token, bankerToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ animation:"fadeIn 0.4s ease", display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ fontSize:30, fontWeight:800 }}>⛨ <span style={{ background:"linear-gradient(135deg,#fbbf24,#63b3ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Privacy & Compliance</span></div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>{(data.badges || []).map((b) => <div key={b} style={{ clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)", border:"1px solid rgba(251,191,36,0.45)", background:"rgba(251,191,36,0.12)", color:"#fbbf24", padding:"8px 12px", fontSize:12 }}>{b}</div>)}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))", gap:14 }}>
        <FeatureShard title="Data Used" color="#63b3ff" items={data.dataUsed || []} />
        <FeatureShard title="Decision Logic" color="#34d399" items={[`Consent: ${data.consentStatus || "Unknown"}`, data.decisionExplainer || ""]} />
        <FeatureShard title="Data Masking" color="#fbbf24" items={Object.entries(data.maskedPreview || {}).map(([k,v]) => `${k}: ${v}`)} />
      </div>
      <div style={{ position:"relative", marginTop:4 }}>
        <div aria-hidden style={{
          position:"absolute", inset:0,
          clipPath:"polygon(5% 0,95% 0,100% 16%,100% 84%,95% 100%,5% 100%,0 84%,0 16%)",
          border:"1px solid rgba(99,179,255,0.4)",
          background:"rgba(99,179,255,0.08)",
          boxShadow:"0 0 16px rgba(99,179,255,0.22)",
          pointerEvents:"none",
        }} />
        <div style={{ position:"relative", padding:"18px 22px", paddingLeft:26 }}>
          <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.11em", color:"#63b3ff", marginBottom:8, lineHeight:1.3 }}>Audit Logs</div>
          {(data.auditLogs || []).length === 0 ? (
            <div style={{ fontSize:13, color:"rgba(226,234,255,0.72)" }}>No logs yet. Generate feature actions first.</div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {data.auditLogs.map((l,i)=>(
                <div key={i} style={{
                  border:"1px solid rgba(255,255,255,0.2)",
                  background:"rgba(3,7,18,0.72)",
                  padding:"8px 12px",
                  fontSize:12,
                  color:"rgba(226,234,255,0.86)",
                  borderRadius:10,
                }}>
                  {l.ts} • {l.role} • {l.action} • {l.result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button onClick={load} style={{ clipPath:"polygon(12% 0,100% 0,88% 100%,0 100%)", border:"1px solid rgba(99,179,255,0.4)", background:"rgba(99,179,255,0.12)", color:"#e2eaff", padding:"9px 14px", fontSize:12 }}>Refresh Compliance</button>
    </div>
  );
}

function CrossSellEngine({ token, customerProfile, setCustomerProfile }) {
  return <SmartCrossSell token={token} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />;
}

function RMCopilot({ token, bankerToken, setBankerToken, customerProfile, setCustomerProfile }) {
  return <BankerRMCopilot token={token} bankerToken={bankerToken} setBankerToken={setBankerToken} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />;
}

function ComplianceLayer({ token, bankerToken }) {
  return <PrivacyCompliance token={token} bankerToken={bankerToken} />;
}

// ── SETTINGS ──────────────────────────────────────────────────
function Settings({ user }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);
  const [newItem, setNewItem] = useState({});

  // Sample data for insurances associated with bank
  const [bankInsurances, setBankInsurances] = useState([
    { id: 1, name: "Home Loan Protection Plan", provider: "HDFC Life", coverage: "₹50 Lakhs", premium: "₹2,450/month", status: "Active", nextRenewal: "2026-03-15" },
    { id: 2, name: "Critical Illness Cover", provider: "ICICI Lombard", coverage: "₹25 Lakhs", premium: "₹1,800/month", status: "Active", nextRenewal: "2026-06-20" },
    { id: 3, name: "Personal Loan Insurance", provider: "SBI Life", coverage: "₹10 Lakhs", premium: "₹850/month", status: "Active", nextRenewal: "2026-04-10" }
  ]);

  // Sample LIC policies
  const [licPolicies, setLicPolicies] = useState([
    { id: 1, name: "Jeevan Anand", policyNumber: "LA-890123456", sumAssured: "₹20 Lakhs", premium: "₹12,500/year", term: "25 years", maturity: "2045-03-01", status: "In Force" },
    { id: 2, name: "Jeevan Lakshya", policyNumber: "LL-789012345", sumAssured: "₹15 Lakhs", premium: "₹8,600/year", term: "20 years", maturity: "2040-06-15", status: "In Force" }
  ]);

  // Sample other investments
  const [investments, setInvestments] = useState([
    { id: 1, name: "Public Provident Fund", type: "Government Scheme", amount: "₹1.5 Lakhs/year", current: "₹12.8 Lakhs", returns: "7.1%", status: "Active" },
    { id: 2, name: "SBI Bluechip Fund", type: "Mutual Fund", amount: "₹5,000/month", current: "₹4.2 Lakhs", returns: "12.3%", status: "Active" },
    { id: 3, name: "HDFC Mid-Cap Opportunities", type: "Mutual Fund", amount: "₹3,000/month", current: "₹2.1 Lakhs", returns: "15.8%", status: "Active" },
    { id: 4, name: "National Savings Certificate", type: "Government Scheme", amount: "₹1 Lakhs/year", current: "₹3.5 Lakhs", returns: "6.8%", status: "Active" }
  ]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAddItem = (type) => {
    setShowAddForm(type);
    setNewItem({});
  };

  const handleSaveItem = (type) => {
    const newId = Math.max(...(type === 'insurances' ? bankInsurances : type === 'lic' ? licPolicies : investments).map(item => item.id)) + 1;
    
    if (type === 'insurances') {
      setBankInsurances([...bankInsurances, { 
        id: newId, 
        name: newItem.name || 'New Insurance Policy', 
        provider: newItem.provider || 'Provider Name',
        coverage: newItem.coverage || '₹10 Lakhs',
        premium: newItem.premium || '₹1,000/month',
        status: 'Active',
        nextRenewal: newItem.nextRenewal || '2026-12-31'
      }]);
    } else if (type === 'lic') {
      setLicPolicies([...licPolicies, { 
        id: newId, 
        name: newItem.name || 'New LIC Policy', 
        policyNumber: newItem.policyNumber || 'LP-123456789',
        sumAssured: newItem.sumAssured || '₹10 Lakhs',
        premium: newItem.premium || '₹5,000/year',
        term: newItem.term || '20 years',
        maturity: newItem.maturity || '2040-01-01',
        status: 'In Force'
      }]);
    } else if (type === 'investments') {
      setInvestments([...investments, { 
        id: newId, 
        name: newItem.name || 'New Investment', 
        type: newItem.type || 'Investment Type',
        amount: newItem.amount || '₹1,000/month',
        current: newItem.current || '₹12,000',
        returns: newItem.returns || '8%',
        status: 'Active'
      }]);
    }
    
    setShowAddForm(null);
    setNewItem({});
  };

  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <div style={{ fontSize:28, fontWeight:800, marginBottom:24 }}>⚙ <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Settings</span></div>
      <div style={{ display:"flex", gap:48, alignItems:"flex-start", flexWrap:"wrap" }}>
        <AstroSphere size={180} color1="#1a3a8e" color2="#0d1f6e" glowColor="#63b3ff" animate />
        <div style={{ flex:1, minWidth:320 }}>
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
          
          {/* Basic Settings */}
          {[
            ["Two-Factor Auth","OTP Enabled","#34d399"],
            ["Notifications","Email + Push","#63b3ff"],
            ["Currency","INR (₹)","#e2eaff"],
            ["Encryption","AES-256","#a78bfa"],
            ["Last Login",user.lastLogin,"rgba(226,234,255,0.4)"]
          ].map(([l,v,c]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.35)" }}>{l}</span>
              <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:c, fontWeight:600 }}>{v}</span>
            </div>
          ))}

          {/* Bank Insurances Section */}
          <div style={{ marginTop:24, padding:"16px 0", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <div 
              onClick={() => toggleSection('insurances')}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", padding:"8px 0", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.35)" }}>Bank Insurances</span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:"#34d399", fontWeight:600 }}>{bankInsurances.length} Active</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddItem('insurances'); }}
                  style={{
                    padding:"4px 10px",
                    background:"rgba(52,211,153,0.15)",
                    border:"1px solid rgba(52,211,153,0.3)",
                    borderRadius:6,
                    color:"#34d399",
                    fontSize:11,
                    fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(52,211,153,0.25)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(52,211,153,0.15)"; e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)"; }}
                >
                  + Add
                </button>
                <span style={{ color:"rgba(226,234,255,0.4)", fontSize:16 }}>{expandedSection === 'insurances' ? '▼' : '▶'}</span>
              </div>
            </div>
            
            {expandedSection === 'insurances' && (
              <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:12 }}>
                {bankInsurances.map(insurance => (
                  <div key={insurance.id} style={{
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(52,211,153,0.2)",
                    borderRadius:12,
                    padding:16,
                    transition:"all 0.2s"
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:"#e2eaff", marginBottom:4 }}>{insurance.name}</div>
                        <div style={{ fontSize:12, color:"rgba(226,234,255,0.5)", fontFamily:"'JetBrains Mono', monospace" }}>{insurance.provider}</div>
                      </div>
                      <div style={{ padding:"4px 8px", background:"rgba(52,211,153,0.15)", color:"#34d399", borderRadius:6, fontSize:10, fontWeight:600 }}>
                        {insurance.status}
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, fontSize:11, color:"rgba(226,234,255,0.6)" }}>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Coverage:</span> {insurance.coverage}</div>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Premium:</span> {insurance.premium}</div>
                      <div style={{ gridColumn:"span 2" }}><span style={{ color:"rgba(226,234,255,0.4)" }}>Next Renewal:</span> {insurance.nextRenewal}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIC Policies Section */}
          <div style={{ marginTop:16, padding:"16px 0", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <div 
              onClick={() => toggleSection('lic')}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", padding:"8px 0", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.35)" }}>LIC Policies</span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:"#fbbf24", fontWeight:600 }}>{licPolicies.length} Active</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddItem('lic'); }}
                  style={{
                    padding:"4px 10px",
                    background:"rgba(251,191,36,0.15)",
                    border:"1px solid rgba(251,191,36,0.3)",
                    borderRadius:6,
                    color:"#fbbf24",
                    fontSize:11,
                    fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,191,36,0.25)"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(251,191,36,0.15)"; e.currentTarget.style.borderColor = "rgba(251,191,36,0.3)"; }}
                >
                  + Add
                </button>
                <span style={{ color:"rgba(226,234,255,0.4)", fontSize:16 }}>{expandedSection === 'lic' ? '▼' : '▶'}</span>
              </div>
            </div>
            
            {expandedSection === 'lic' && (
              <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:12 }}>
                {licPolicies.map(policy => (
                  <div key={policy.id} style={{
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(251,191,36,0.2)",
                    borderRadius:12,
                    padding:16,
                    transition:"all 0.2s"
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:"#e2eaff", marginBottom:4 }}>{policy.name}</div>
                        <div style={{ fontSize:12, color:"rgba(226,234,255,0.5)", fontFamily:"'JetBrains Mono', monospace" }}>{policy.policyNumber}</div>
                      </div>
                      <div style={{ padding:"4px 8px", background:"rgba(251,191,36,0.15)", color:"#fbbf24", borderRadius:6, fontSize:10, fontWeight:600 }}>
                        {policy.status}
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, fontSize:11, color:"rgba(226,234,255,0.6)" }}>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Sum Assured:</span> {policy.sumAssured}</div>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Premium:</span> {policy.premium}</div>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Term:</span> {policy.term}</div>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Maturity:</span> {policy.maturity}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Investments Section */}
          <div style={{ marginTop:16, padding:"16px 0", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
            <div 
              onClick={() => toggleSection('investments')}
              style={{ display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", padding:"8px 0", transition:"all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(226,234,255,0.35)" }}>Other Investments</span>
                <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:13, color:"#a78bfa", fontWeight:600 }}>{investments.length} Active</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAddItem('investments'); }}
                  style={{
                    padding:"4px 10px",
                    background:"rgba(167,139,250,0.15)",
                    border:"1px solid rgba(167,139,250,0.3)",
                    borderRadius:6,
                    color:"#a78bfa",
                    fontSize:11,
                    fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(167,139,250,0.25)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(167,139,250,0.15)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.3)"; }}
                >
                  + Add
                </button>
                <span style={{ color:"rgba(226,234,255,0.4)", fontSize:16 }}>{expandedSection === 'investments' ? '▼' : '▶'}</span>
              </div>
            </div>
            
            {expandedSection === 'investments' && (
              <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:12 }}>
                {investments.map(investment => (
                  <div key={investment.id} style={{
                    background:"rgba(255,255,255,0.03)",
                    border:"1px solid rgba(167,139,250,0.2)",
                    borderRadius:12,
                    padding:16,
                    transition:"all 0.2s"
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:"#e2eaff", marginBottom:4 }}>{investment.name}</div>
                        <div style={{ fontSize:12, color:"rgba(226,234,255,0.5)", fontFamily:"'JetBrains Mono', monospace" }}>{investment.type}</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ padding:"4px 8px", background:"rgba(167,139,250,0.15)", color:"#a78bfa", borderRadius:6, fontSize:10, fontWeight:600, marginBottom:4 }}>
                          {investment.status}
                        </div>
                        <div style={{ fontSize:12, color:"#34d399", fontWeight:600 }}>{investment.returns}</div>
                      </div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, fontSize:11, color:"rgba(226,234,255,0.6)" }}>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Contribution:</span> {investment.amount}</div>
                      <div><span style={{ color:"rgba(226,234,255,0.4)" }}>Current Value:</span> {investment.current}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddForm && (
        <div style={{
          position:"fixed",
          inset:0,
          background:"rgba(3,7,18,0.85)",
          backdropFilter:"blur(8px)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          zIndex:1000
        }}>
          <div style={{
            background:"rgba(15,23,42,0.95)",
            border:"1px solid rgba(99,179,255,0.2)",
            borderRadius:20,
            padding:32,
            width:"90%",
            maxWidth:500,
            boxShadow:"0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)"
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
              <div style={{ fontSize:20, fontWeight:700 }}>
                Add New {showAddForm === 'insurances' ? 'Insurance' : showAddForm === 'lic' ? 'LIC Policy' : 'Investment'}
              </div>
              <button
                onClick={() => setShowAddForm(null)}
                style={{
                  width:32, height:32,
                  borderRadius:"50%",
                  background:"rgba(255,255,255,0.1)",
                  border:"1px solid rgba(255,255,255,0.2)",
                  color:"rgba(226,234,255,0.6)",
                  fontSize:16,
                  cursor:"pointer",
                  transition:"all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(226,234,255,0.8)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(226,234,255,0.6)"; }}
              >
                ×
              </button>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {showAddForm === 'insurances' && (
                <>
                  <input
                    placeholder="Insurance Name"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Provider"
                    value={newItem.provider || ''}
                    onChange={(e) => setNewItem({...newItem, provider: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Coverage Amount"
                    value={newItem.coverage || ''}
                    onChange={(e) => setNewItem({...newItem, coverage: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Premium"
                    value={newItem.premium || ''}
                    onChange={(e) => setNewItem({...newItem, premium: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                </>
              )}

              {showAddForm === 'lic' && (
                <>
                  <input
                    placeholder="Policy Name"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Policy Number"
                    value={newItem.policyNumber || ''}
                    onChange={(e) => setNewItem({...newItem, policyNumber: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Sum Assured"
                    value={newItem.sumAssured || ''}
                    onChange={(e) => setNewItem({...newItem, sumAssured: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Premium"
                    value={newItem.premium || ''}
                    onChange={(e) => setNewItem({...newItem, premium: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                </>
              )}

              {showAddForm === 'investments' && (
                <>
                  <input
                    placeholder="Investment Name"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Investment Type"
                    value={newItem.type || ''}
                    onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Contribution Amount"
                    value={newItem.amount || ''}
                    onChange={(e) => setNewItem({...newItem, amount: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                  <input
                    placeholder="Current Value"
                    value={newItem.current || ''}
                    onChange={(e) => setNewItem({...newItem, current: e.target.value})}
                    style={{
                      padding:"12px 16px",
                      background:"rgba(255,255,255,0.05)",
                      border:"1px solid rgba(255,255,255,0.1)",
                      borderRadius:10,
                      color:"#e2eaff",
                      fontSize:14
                    }}
                  />
                </>
              )}

              <div style={{ display:"flex", gap:12, marginTop:8 }}>
                <button
                  onClick={() => setShowAddForm(null)}
                  style={{
                    flex:1,
                    padding:"14px",
                    background:"transparent",
                    border:"1px solid rgba(255,255,255,0.2)",
                    borderRadius:10,
                    color:"rgba(226,234,255,0.6)",
                    fontSize:14,
                    fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveItem(showAddForm)}
                  style={{
                    flex:1,
                    padding:"14px",
                    background:"linear-gradient(135deg,rgba(99,179,255,0.2),rgba(167,139,250,0.2))",
                    border:"1px solid rgba(99,179,255,0.4)",
                    borderRadius:10,
                    color:"#e2eaff",
                    fontSize:14,
                    fontWeight:600,
                    cursor:"pointer",
                    transition:"all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,179,255,0.3),rgba(167,139,250,0.3))"; e.currentTarget.style.borderColor = "rgba(99,179,255,0.6)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(99,179,255,0.2),rgba(167,139,250,0.2))"; e.currentTarget.style.borderColor = "rgba(99,179,255,0.4)"; }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
function InvestorProfile({ name, title, quote, achievement, company, skills = [], experience, photoUrl, delay }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)",
      borderRadius:16, padding:"20px 24px", animation:`fadeUp 0.5s ease ${delay || 0}s both`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={name}
            width={56}
            height={56}
            style={{
              width:56, height:56, borderRadius:"50%",
              objectFit:"cover",
              border:"1px solid rgba(255,255,255,0.12)",
              boxShadow:"0 0 20px rgba(99,179,255,0.18)",
              flexShrink:0,
            }}
          />
        ) : (
          <div style={{
            width:56, height:56, borderRadius:"50%",
            background:"linear-gradient(135deg, #1a3a8e, #2d1a8e)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, fontWeight:800, flexShrink:0,
            boxShadow:"0 0 20px rgba(99,179,255,0.25)",
          }}>
            <span style={{ background:"linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{name[0]}</span>
          </div>
        )}
        <div>
          <div style={{ fontSize:15, fontWeight:700 }}>{name}</div>
          <div style={{ fontSize:11, color:"rgba(226,234,255,0.4)", marginTop:2 }}>
            {title}{company ? ` • ${company}` : ""}
          </div>
          {!!experience && (
            <div style={{ fontSize:10, color:"rgba(226,234,255,0.32)", marginTop:4, fontFamily:"'JetBrains Mono', monospace" }}>
              {experience}
            </div>
          )}
        </div>
      </div>
      <div style={{
        fontSize:13, lineHeight:1.7, color:"rgba(226,234,255,0.6)",
        fontStyle:"italic", marginBottom:12, paddingLeft:12,
        borderLeft:"2px solid rgba(99,179,255,0.2)",
      }}>
        "{quote}"
      </div>
      {skills?.length > 0 && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
          {skills.slice(0, 5).map((s) => (
            <div key={s} style={{
              clipPath:"polygon(14% 0,100% 0,86% 100%,0 100%)",
              border:"1px solid rgba(99,179,255,0.2)",
              background:"rgba(99,179,255,0.06)",
              padding:"6px 10px",
              fontSize:10,
              color:"rgba(226,234,255,0.7)",
              fontFamily:"'JetBrains Mono', monospace",
            }}>{s}</div>
          ))}
        </div>
      )}
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

const INVESTORS = [
  {
    name: "Ashneer Grover",
    company: "BharatPe",
    title: "Fintech Entrepreneur & Angel Investor",
    experience: "10+ yrs in consumer fintech",
    skills: ["Fintech GTM", "Unit economics", "Payments", "Product growth", "Risk"],
    quote: "Distribution + underwriting discipline wins in retail finance.",
    achievement: "Scaled high-velocity fintech with focus on CAC payback and fraud controls.",
  },
  {
    name: "Anupam Mittal",
    company: "Shaadi.com",
    title: "Founder & Investor",
    experience: "20+ yrs consumer internet",
    skills: ["Brand", "Consumer product", "Pricing", "Growth loops", "Hiring"],
    quote: "Build a product people love, then scale the system behind it.",
    achievement: "Helped multiple startups sharpen positioning and retention-led growth.",
  },
  {
    name: "Namita Thapar",
    company: "Emcure Pharmaceuticals",
    title: "Executive Director & Investor",
    experience: "15+ yrs operations & scaling",
    skills: ["Operations", "Compliance", "Go-to-market", "Leadership", "Execution"],
    quote: "Great businesses execute relentlessly—especially on compliance and trust.",
    achievement: "Strong focus on governance, process, and sustainable growth.",
  },
  {
    name: "Falguni Nayar",
    company: "Nykaa",
    title: "Founder & Investor",
    experience: "25+ yrs finance & consumer",
    skills: ["Retail fintech", "Trust", "Customer experience", "Marketplace ops", "Capital strategy"],
    quote: "Trust compounds. Build it into every customer interaction.",
    achievement: "Built a category leader with high repeat usage and strong unit economics.",
  },
  {
    name: "Kiran Mazumdar-Shaw",
    company: "Biocon",
    title: "Founder & Investor",
    experience: "30+ yrs enterprise building",
    skills: ["Long-term strategy", "Governance", "R&D discipline", "Scaling", "Resilience"],
    quote: "Strong governance and long-term thinking are competitive advantages.",
    achievement: "Proven playbook for building durable, regulation-friendly companies.",
  },
  {
    name: "Nithin Kamath",
    company: "Zerodha",
    title: "Founder & Investor",
    experience: "15+ yrs brokerage & investing",
    skills: ["Investing", "Risk", "Customer support", "Operational efficiency", "Simplicity"],
    quote: "Simple products + transparent pricing earn long-term loyalty.",
    achievement: "Scaled a lean, profitable financial services business with trust-first product design.",
  },
];

function avatarUrl(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D1F6E&color=E2EAFF&size=128&bold=true`;
}

function pickInvestors(seed = "") {
  const s = `${seed}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const a = h % INVESTORS.length;
  const b = (a + 2 + (h % 3)) % INVESTORS.length;
  return [INVESTORS[a], INVESTORS[b]];
}

function InvestorsShowcase({ featureId, title = "Investor Lens" }) {
  const picks = pickInvestors(featureId).map((p) => ({ ...p, photoUrl: avatarUrl(p.name) }));
  return (
    <div style={{ marginTop:18, display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ fontSize:12, textTransform:"uppercase", letterSpacing:"0.12em", color:"rgba(167,139,250,0.75)" }}>{title}</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))", gap:12 }}>
        {picks.map((inv, i) => (
          <InvestorProfile key={`${featureId}-${inv.name}`} {...inv} delay={i * 0.08} />
        ))}
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
function Shell({ token, initialBankerToken = "" }) {
  const [user, setUser] = useState(null);
  const [updates, setUpdates] = useState(fallbackUpdates);
  const [bankerToken, setBankerToken] = useState(initialBankerToken);
  const [customerProfile, setCustomerProfile] = useState({
    customerId: "CUST-7721",
    name: "", // Will be set from logged-in user or input
    phone: "9876543210",
    income: 92000,
    spending: 51000,
    loans: 24000,
    creditScore: 734,
    riskLevel: "medium",
  });
  const [loading, setL] = useState(true);
  const [active, setA]  = useState("home");
  const [col, setCol]   = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcomePlayed, setWelcomePlayed] = useState(false);
  const mobile = useIsMobile();

  // Welcome voice message
  const playWelcomeMessage = () => {
    if ('speechSynthesis' in window && !welcomePlayed && customerProfile?.name) {
      const userName = customerProfile.name || 'User';
      const utterance = new SpeechSynthesisUtterance(`Welcome back to FinPilot AI, ${userName}. Your intelligent financial co-pilot is ready to assist you.`);
      utterance.pitch = 1.0;
      utterance.rate = 0.9;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
      setWelcomePlayed(true);
    }
  };

  useEffect(() => {
    Promise.all([api.getProfile(token), api.getUpdates()])
      .then(([profile, feed]) => {
        setUser(profile);
        setUpdates(feed);
        // Update customer profile with logged-in user's name
        setCustomerProfile(prev => ({ ...prev, name: profile.name }));
        // Play welcome message after user data is loaded
        setTimeout(() => {
          setCustomerProfile(prev => ({ ...prev, name: profile.name }));
          playWelcomeMessage();
        }, 1000);
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
    home: <Home user={user} updates={updates} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />,
    astrofin: <AstroFin updates={updates} customerProfile={customerProfile} />,
    creditai: <CreditScore user={user} />,
    crosssell: <CrossSellEngine token={token} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />,
    rmcopilot: <RMCopilot token={token} bankerToken={bankerToken} setBankerToken={setBankerToken} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />,
    compliance: <ComplianceLayer token={token} bankerToken={bankerToken} />,
    loan: <Loan />,
    fraud: <Fraud />,
    ai: <AskAstro updates={updates} customerProfile={customerProfile} />,
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
        <TopBar active={active} user={user} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <div className="page-content" style={{ flex:1, overflowY:"auto", padding: mobile ? "16px 16px 90px" : "32px 40px" }}>
          {pages[active]}
          <InvestorsShowcase featureId={active} title="Investors & Mentors" />
        </div>
      </div>
      {/* Mobile sidebar */}
      {mobile && (
        <div style={{
          position:"fixed",
          top:0,
          left:0,
          width:"100vw",
          height:"100vh",
          background:"rgba(3,7,18,0.95)",
          zIndex:20,
          display: mobileMenuOpen ? "block" : "none"
        }}>
          <div style={{
            position:"absolute",
            top:0,
            left:0,
            width:"292px",
            height:"100vh",
            background:"rgba(3,7,18,0.85)",
            borderRight:"1px solid rgba(255,255,255,0.1)",
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
            transition:"transform 0.3s ease"
          }}>
            <Sidebar active={active} setActive={setA} col={col} setCol={setCol} user={user} />
          </div>
          <div 
            style={{
              position:"absolute",
              top:0,
              left:0,
              width:"100vw",
              height:"100vh",
              background:"transparent"
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
      {/* Mobile bottom nav */}
      <BottomNav active={active} setActive={setA} />
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [phase, setPhase] = useState("intro");
  const [token, setToken] = useState(null);
  const [bankerToken, setBankerToken] = useState("");
  return (
    <>
      <Styles />
      {phase==="intro"  && <Intro  onDone={()=>setPhase("login")} />}
      {phase==="login"  && <Login  onSuccess={({ token: t, bankerToken: bt })=>{setToken(t); setBankerToken(bt || ""); setPhase("app");}} goSignup={()=>setPhase("signup")} />}
      {phase==="signup" && <Signup goLogin={()=>setPhase("login")} />}
      {phase==="app"    && <Shell  token={token} initialBankerToken={bankerToken} />}
    </>
  );
}
