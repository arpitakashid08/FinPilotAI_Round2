export const mockUser = {
  id: "user-1",
  name: "Arjun Sharma",
  email: "arjun@finpilot.ai",
  balance: 124500,
  riskScore: 0.28,
  lastLogin: "Feb 18, 2026",
  insurances: 2,
  licPolicies: 1,
  investments: 4,
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

export function getLiveUpdatesFeed() {
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const since = [Math.round((now % (3 * hour)) / hour) + 1, Math.round((now % (5 * hour)) / hour) + 2, Math.round((now % (7 * hour)) / hour) + 3];
  const shift = ((Math.sin(now / (10 * minute)) + 1) / 2) * 0.9 - 0.45;

  const stockAlerts = updatesFeed.stockAlerts.map((s, i) => {
    const delta = Number((shift + (i - 1) * 0.18).toFixed(2));
    const change = Number((s.change + delta).toFixed(2));
    const color = change >= 0 ? "#34d399" : "#f87171";
    return { ...s, change, color };
  });

  return {
    ...updatesFeed,
    latestFinance: updatesFeed.latestFinance.map((x, i) => ({ ...x, time: `${since[i]}h ago` })),
    stockAlerts,
  };
}

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

export function fallbackReply(message = "", profile = {}, language = "en") {
  const q = message.toLowerCase();
  const income = Number(profile?.income || 0);
  const spending = Number(profile?.spending || 0);
  const loans = Number(profile?.loans || 0);
  const creditScore = Number(profile?.creditScore || 0);
  const savings = Math.max(0, income - spending);
  const emiRatio = income ? loans / income : 0;
  const variants = [
    "Use a monthly plan with clear limits for EMI, essentials, and investing.",
    "Prioritise cash-flow stability first, then increase long-term investing step by step.",
    "Keep a 3–6 month emergency cushion before taking additional market risk.",
  ];
  const seed = (q.length + (creditScore || 0)) % variants.length;
  const pre = variants[seed];

  if (language === "mr") {
    if (q.includes("financial health") || q.includes("health")) return `तुमची आर्थिक स्थिती: उत्पन्न ₹${income.toLocaleString("en-IN")}, बचत ₹${savings.toLocaleString("en-IN")}, EMI अनुपात ${Math.round(emiRatio * 100)}%, क्रेडिट स्कोअर ${creditScore}. EMI 35% खाली ठेवणे आणि अनावश्यक कर्ज टाळणे महत्त्वाचे आहे.`;
    if (q.includes("loan") || q.includes("emi")) return "EMI 35% च्या आसपास ठेवा आणि जास्त व्याजाचे कर्ज आधी फेडा.";
    if (q.includes("credit") || q.includes("score")) return "क्रेडिट स्कोअर वाढवण्यासाठी वेळेवर पेमेंट करा, उपयोग कमी ठेवा आणि वारंवार चौकशी टाळा.";
    if (q.includes("fraud") || q.includes("alert")) return "तत्काळ अलर्ट सुरू ठेवा, व्यवहार मर्यादा घट्ट ठेवा आणि OTP/PIN शेअर करू नका.";
    if (q.includes("stock") || q.includes("market") || q.includes("invest")) return "गुंतवणूक उद्दिष्टानुसार विभागा आणि एका थीममध्ये एकत्रित जोखीम टाळा.";
    return "तुमचे उत्पन्न, EMI आणि उद्दिष्टे सांगा; मी अधिक अचूक योजना देईन.";
  }
  if (language === "hi") {
    if (q.includes("financial health") || q.includes("health")) return `आपकी वित्तीय स्थिति: आय ₹${income.toLocaleString("en-IN")}, बचत ₹${savings.toLocaleString("en-IN")}, EMI अनुपात ${Math.round(emiRatio * 100)}%, क्रेडिट स्कोर ${creditScore}. EMI 35% से नीचे रखें।`;
    if (q.includes("loan") || q.includes("emi")) return "EMI को नियंत्रित रखें और उच्च ब्याज वाले कर्ज को पहले चुकाएँ।";
    if (q.includes("credit") || q.includes("score")) return "स्कोर सुधारने के लिए समय पर भुगतान करें, उपयोग कम रखें और नई पूछताछ कम करें।";
    if (q.includes("fraud") || q.includes("alert")) return "रीयल-टाइम अलर्ट चालू रखें और OTP/PIN कभी साझा न करें।";
    if (q.includes("stock") || q.includes("market") || q.includes("invest")) return "लक्ष्य-आधारित एसेट एलोकेशन अपनाएँ और एक ही थीम में अधिक निवेश न करें।";
    return "अपनी आय, EMI और लक्ष्य बताइए; मैं बेहतर योजना दूँगा।";
  }
  if (q.includes("financial health") || q.includes("health")) return `${pre} Current snapshot: income ₹${income.toLocaleString("en-IN") || "0"}, savings ₹${savings.toLocaleString("en-IN") || "0"}, EMI ratio ${Math.round(emiRatio * 100)}%, credit ${creditScore || "n/a"}. Focus on reducing EMI ratio below 35% and keeping credit utilisation controlled.`;
  if (q.includes("loan") || q.includes("emi")) return `${pre} Keep EMI ratio near or below 35%, and prepay highest-interest debt first.`;
  if (q.includes("credit") || q.includes("score")) return `${pre} Improve score with on-time payments, low utilization, and fewer fresh hard inquiries.`;
  if (q.includes("fraud") || q.includes("alert")) return `${pre} Enable real-time alerts, tighten transfer limits, and never share OTP/PIN.`;
  if (q.includes("stock") || q.includes("market") || q.includes("invest")) return `${pre} Split by goal horizon and avoid concentrated entries in a single asset/theme.`;
  if (language === "hi") return `${pre} अपने आय, खर्च और ईएमआई के आधार पर बताइए तो मैं और सटीक सलाह दूंगा।`;
  if (language === "mr") return `${pre} तुमचे उत्पन्न, खर्च आणि EMI दिल्यास मी अधिक अचूक सल्ला देईन.`;
  return `${pre} Share your exact income, EMI and goals, and I will give a sharper plan.`;
}
