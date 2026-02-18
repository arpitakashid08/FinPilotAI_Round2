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
    { question: "What does CIBIL inquiry count indicate?", answer: "Too many recent hard inquiries can reduce your score because lenders read it as credit-seeking behavior." },
    { question: "Why does loan tenure change total interest?", answer: "Longer tenure reduces monthly EMI but usually increases total interest paid over the life of the loan." },
    { question: "How do fraud engines detect account takeover?", answer: "They score anomalies like impossible travel, new device fingerprints, odd transfer amount, and unusual time of day." },
  ],
};

export function fallbackReply(message = "") {
  const q = message.toLowerCase();
  if (q.includes("loan") || q.includes("emi")) return "Given your cash flow, keep EMI under 35% of monthly surplus and prefer shorter tenures when rates are stable.";
  if (q.includes("credit") || q.includes("score")) return "Keep utilization below 30%, pay before due date, and avoid clustered hard inquiries this quarter.";
  if (q.includes("fraud") || q.includes("alert")) return "Highest risk signal is unusual-device activity. Keep transaction limits and push alerts enabled.";
  if (q.includes("stock") || q.includes("market")) return "Market breadth is positive but narrow. Prefer staggered entries over concentrated buying.";
  return "Signals are mixed but constructive. Maintain diversified positions and review debt-to-income monthly.";
}
