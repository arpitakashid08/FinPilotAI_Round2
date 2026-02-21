// FinPilot AI — Sphere Edition
// Design: 3D glowing orbs, starfield, NO rectangular cards
// Inspired by AstroFin mockup: organic spheres, particle fields, orbital data
import { useState, useEffect, useRef } from "react";
import PrivacyCompliance from "./components/PrivacyCompliance";
import BankerRMCopilot from "./components/BankerRMCopilot";
import AskAstro from "./components/AskAstro";

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

// ── MAIN APP COMPONENT ────────────────────────────────────────
function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState("");
  const [bankerToken, setBankerToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [updates, setUpdates] = useState(null);
  const [featureModules, setFeatureModules] = useState(null);
  const [customerProfile, setCustomerProfile] = useState({
    name: "Arjun Sharma",
    income: 92000,
    spending: 51000,
    loans: 24000,
    creditScore: 734,
    riskLevel: "medium"
  });

  useEffect(() => {
    const saved = localStorage.getItem("fp_token");
    if (saved) setToken(saved);
    const savedBanker = localStorage.getItem("fp_banker_token");
    if (savedBanker) setBankerToken(savedBanker);
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [profileData, updatesData, modulesData] = await Promise.all([
      api.getProfile(token),
      api.getUpdates(),
      api.getFeatureModules(),
    ]);
    setProfile(profileData);
    setUpdates(updatesData);
    setFeatureModules(modulesData);
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return <Home profile={profile} updates={updates} setPage={setPage} />;
      case "ask-astro":
        return <AskAstro updates={updates} customerProfile={customerProfile} />;
      case "banker-rm":
        return <BankerRMCopilot token={token} bankerToken={bankerToken} setBankerToken={setBankerToken} customerProfile={customerProfile} setCustomerProfile={setCustomerProfile} />;
      case "privacy":
        return <PrivacyCompliance token={token} bankerToken={bankerToken} />;
      default:
        return <Home profile={profile} updates={updates} setPage={setPage} />;
    }
  };

  return (
    <>
      <Styles />
      <Starfield />
      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>
        {renderPage()}
      </div>
    </>
  );
}

// ── HOME COMPONENT ───────────────────────────────────────────
function Home({ profile, updates, setPage }) {
  const mobile = useIsMobile();
  
  return (
    <div style={{ padding: mobile ? 16 : 32, animation: "fadeIn 0.4s ease" }}>
      <div style={{ fontSize: mobile ? 24 : 32, fontWeight: 800, marginBottom: 24 }}>
        Welcome to <span style={{ background: "linear-gradient(135deg,#63b3ff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FinPilot AI</span>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 32 }}>
        <div onClick={() => setPage("ask-astro")} style={{ 
          padding: 24, 
          background: "rgba(99,179,255,0.08)", 
          border: "1px solid rgba(99,179,255,0.2)", 
          borderRadius: 16, 
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#63b3ff", marginBottom: 8 }}>✦ Ask Astro</div>
          <div style={{ fontSize: 12, color: "rgba(226,234,255,0.6)" }}>AI-powered financial assistant</div>
        </div>
        
        <div onClick={() => setPage("banker-rm")} style={{ 
          padding: 24, 
          background: "rgba(52,211,153,0.08)", 
          border: "1px solid rgba(52,211,153,0.2)", 
          borderRadius: 16, 
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#34d399", marginBottom: 8 }}>⌁ Banker/RM Co-Pilot</div>
          <div style={{ fontSize: 12, color: "rgba(226,234,255,0.6)" }}>Relationship manager assistant</div>
        </div>
        
        <div onClick={() => setPage("privacy")} style={{ 
          padding: 24, 
          background: "rgba(251,191,36,0.08)", 
          border: "1px solid rgba(251,191,36,0.2)", 
          borderRadius: 16, 
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fbbf24", marginBottom: 8 }}>⛨ Privacy & Compliance</div>
          <div style={{ fontSize: 12, color: "rgba(226,234,255,0.6)" }}>Data protection & audit</div>
        </div>
      </div>
      
      {profile && (
        <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#e2eaff", marginBottom: 12 }}>Your Profile</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(226,234,255,0.5)" }}>Name</div>
              <div style={{ fontSize: 13, color: "#e2eaff" }}>{profile.name || "User"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(226,234,255,0.5)" }}>Balance</div>
              <div style={{ fontSize: 13, color: "#34d399" }}>₹{profile.balance?.toLocaleString("en-IN") || "0"}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(226,234,255,0.5)" }}>Risk Score</div>
              <div style={{ fontSize: 13, color: "#fbbf24" }}>{(profile.riskScore * 100)?.toFixed(0) || "0"}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
