export const mockUser = {
  id: "user-1",
  name: "Arjun Sharma",
  email: "arjun@finpilot.ai",
  balance: 124500,
  riskScore: 0.28,
  lastLogin: "Feb 18, 2026",
};

export const updatesFeed = {
  latestFinance: [
    { title: "RBI keeps liquidity stance flexible as inflation cools", cat: "Macro", time: "1h ago", sentiment: "neutral" },
    { title: "UPI transaction volumes hit fresh monthly high", cat: "Payments", time: "3h ago", sentiment: "bullish" },
    { title: "Fintech NBFCs tighten underwriting after risk review", cat: "Credit", time: "5h ago", sentiment: "bearish" },
  ],
  stockAlerts: [
    { ticker: "NIFTY", price: 22840, change: 0.86, color: "#34d399" },
    { ticker: "SENSEX", price: 75120, change: 0.54, color: "#63b3ff" },
    { ticker: "INFY", price: 1795, change: -0.67, color: "#f87171" },
    { ticker: "HDFCBANK", price: 1682, change: 1.09, color: "#34d399" },
  ],
  knowledge: [
    {
      question: "What does CIBIL inquiry count indicate?",
      answer: "Too many recent hard inquiries can reduce your score because lenders read it as credit-seeking behavior.",
    },
    {
      question: "Why does loan tenure change total interest?",
      answer: "Longer tenure reduces monthly EMI but usually increases total interest paid over the life of the loan.",
    },
    {
      question: "How do fraud engines detect account takeover?",
      answer: "They score anomalies like impossible travel, new device fingerprints, odd transfer amount, and unusual time of day.",
    },
  ],
};

export const featureModules = {
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
    operatorControls: ["Allow / suppress offers by policy and consent", "Cap message frequency to avoid spam", "Approve campaign bundles per segment"],
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
    operatorControls: ["Generate call brief before outreach", "Approve recommendation before customer share", "Push post-call tasks to RM workflow"],
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
    operatorControls: ["Block unsafe actions in real time", "Export regulator-ready audit packet", "Escalate critical violations to compliance queue"],
    appFunctions: [
      "Compliance pulse monitor inside operations dashboard",
      "One-click audit evidence export",
      "Automated breach-risk scoring and alerting",
    ],
  },
};

export function buildAstroReply(message = "") {
  const q = message.toLowerCase();
  if (q.includes("loan") || q.includes("emi")) {
    return "Given your current cash flow, keep EMI under 35% of monthly surplus and prefer shorter tenures when rates are stable.";
  }
  if (q.includes("credit") || q.includes("score")) {
    return "Credit improvement path: keep utilization below 30%, pay before due date, and avoid clustered hard inquiries this quarter.";
  }
  if (q.includes("fraud") || q.includes("alert")) {
    return "Highest current risk signal is unusual-device activity. Keep transaction limits and real-time push alerts enabled.";
  }
  if (q.includes("stock") || q.includes("market")) {
    return "Market breadth is positive but narrow. Consider staggered entries instead of single large exposure.";
  }
  return "Signals are mixed but constructive. Maintain diversified positions and review debt-to-income monthly for stability.";
}
