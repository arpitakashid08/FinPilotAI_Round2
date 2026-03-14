import { getBody } from "./_lib/body.js";
import { fallbackReply, featureModules, getLiveUpdatesFeed, mockUser } from "./_lib/data.js";
import { buildCustomerProfile, recommendProducts, rmDecision } from "./_lib/featureEngine.js";
import { generateAssistantReply } from "./_lib/llm.js";
import { getAuditLogs, getTokenFromReq, issueToken, maskValue, requireAuth, verifyToken, writeAudit } from "./_lib/security.js";

function methodNotAllowed(res) {
  return res.status(405).json({ message: "Method not allowed" });
}

function nameFromEmail(email = "") {
  const base = `${email}`.split("@")[0].replace(/[._-]+/g, " ").trim();
  if (!base) return "FinPilot User";
  return base
    .split(" ")
    .filter(Boolean)
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");
}

function looksLatinHeavy(text = "") {
  const latin = (`${text}`.match(/[A-Za-z]/g) || []).length;
  const devanagari = (`${text}`.match(/[\u0900-\u097F]/g) || []).length;
  return latin > 20 && latin > devanagari;
}

function strictLanguageInstruction(language) {
  if (language === "mr") return "Respond only in Marathi (Devanagari). Avoid English unless unavoidable for proper nouns.";
  if (language === "hi") return "Respond only in Hindi (Devanagari). Avoid English unless unavoidable for proper nouns.";
  return "Respond in English.";
}

function fmtINR(n = 0) {
  const v = Math.round(Number(n || 0));
  return `₹${v.toLocaleString("en-IN")}`;
}

function buildLocalPathfinderInsights(scenarios = []) {
  const byId = Object.fromEntries(scenarios.map((s) => [s.id, s]));
  const base = byId.corporate || scenarios[0];
  const out = {};
  for (const s of scenarios) {
    if (!s?.id) continue;
    if (!base || s.id === base.id) {
      out[s.id] = "Stable compounding with predictable goal timelines and moderate risk.";
      continue;
    }
    const parts = [];
    if (Number.isFinite(base.houseAge) && Number.isFinite(s.houseAge)) {
      const d = s.houseAge - base.houseAge;
      if (Math.abs(d) >= 0.9) parts.push(`House goal ${d > 0 ? "delays" : "accelerates"} by ~${Math.abs(Math.round(d))} years vs corporate.`);
    }
    const nwDelta = (s.netWorthAtRetirement || 0) - (base.netWorthAtRetirement || 0);
    parts.push(`Retirement net worth ${nwDelta >= 0 ? "increases" : "decreases"} by ~${fmtINR(Math.abs(nwDelta))}.`);
    if ((s.maxDebt || 0) > (base.maxDebt || 0) + 1) parts.push(`Peak debt is higher (max ~${fmtINR(s.maxDebt || 0)}).`);
    out[s.id] = parts.join(" ");
  }
  return out;
}

export default async function handler(req, res) {
  const url = new URL(req.url || "", "http://localhost");
  const path = url.pathname || "";

  // Health
  if (path === "/api/health") {
    if (req.method !== "GET") return methodNotAllowed(res);
    return res.status(200).json({ status: "ok" });
  }

  // Auth
  if (path === "/api/auth/login") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const body = getBody(req);
    const email = `${body?.email || ""}`.trim();
    if (!email) return res.status(400).json({ message: "Email is required" });
    return res.status(200).json({ otpSent: true });
  }

  if (path === "/api/auth/signup") {
    if (req.method !== "POST") return methodNotAllowed(res);
    return res.status(200).json({ success: true });
  }

  if (path === "/api/auth/verify-otp") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const body = getBody(req);
    const otp = `${body?.otp || ""}`.trim();
    const email = `${body?.email || "user@finpilot.ai"}`.trim() || "user@finpilot.ai";
    if (otp !== "123456") {
      return res.status(401).json({ success: false, message: "Wrong OTP — try 123456" });
    }
    const token = issueToken({ sub: "user-1", email, role: "user" });
    const bankerToken = issueToken({ sub: "banker-1", email: "banker@finpilot.ai", role: "banker" });
    return res.status(200).json({ success: true, token, bankerToken });
  }

  if (path === "/api/auth/profile") {
    if (req.method !== "GET") return methodNotAllowed(res);
    const token = getTokenFromReq(req);
    const claims = verifyToken(token);
    const email = claims?.email || mockUser.email;
    return res.status(200).json({
      ...mockUser,
      email,
      name: nameFromEmail(email),
    });
  }

  if (path === "/api/auth/banker-token") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const bankerToken = issueToken({ sub: "banker-1", email: "banker@finpilot.ai", role: "banker" });
    return res.status(200).json({ bankerToken });
  }

  // AI
  if (path === "/api/ai/chat") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const body = getBody(req);
    const message = `${body?.message || ""}`;
    const language = "en";
    const langLabel = "English";
    const profile = body?.profile || {};
    const prompt = `User question (${langLabel}): ${message}
Customer context:
- name: ${profile?.name || "Unknown"}
- income: ${profile?.income || "n/a"}
- spending: ${profile?.spending || "n/a"}
- loans: ${profile?.loans || "n/a"}
- creditScore: ${profile?.creditScore || "n/a"}
- riskLevel: ${profile?.riskLevel || "n/a"}
Instructions: Analyse loans, overall financial health, and provide a tailored investment/debt strategy when relevant. ${strictLanguageInstruction(language)} Do not repeat canned lines.`;
    const generated = await generateAssistantReply(prompt);
    let reply = generated.reply || fallbackReply(message, profile, language);
    return res.status(200).json({ reply, provider: generated.provider || "local" });
  }

  if (path === "/api/ai/pathfinder-explain") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const body = getBody(req);
    const inputs = body?.inputs || {};
    const scenarios = Array.isArray(body?.scenarios) ? body.scenarios.slice(0, 8) : [];

    const scenarioList = scenarios
      .map((s) => `- ${s.id} (${s.label}): retirementNW ${s.netWorthAtRetirement}, target ${s.retirementTarget}, gap ${s.retirementGap}; emergencyAge ${s.emergencyFundAge}; houseAge ${s.houseAge}; carAge ${s.carAge}; travelAge ${s.travelAge}; peakDebt ${s.maxDebt}; interestPaid ${s.interestPaid}`)
      .join("\n");

    const prompt = `You are Astro, a concise financial copilot. Write one crisp, concrete trade-off insight per scenario.
User inputs: age ${inputs.age}, retirementAge ${inputs.retirementAge}, income ${inputs.monthlyIncome}/mo, expenses ${inputs.monthlyExpenses}/mo, savings ${inputs.currentSavings}, investRate ${inputs.investmentRate}, salaryGrowth ${inputs.salaryGrowth}, inflation ${inputs.inflation}, riskTolerance ${inputs.riskTolerance}.
Scenario summaries:
${scenarioList}
Output EXACTLY one line per scenario, in this format:
<id>: <one sentence insight mentioning at least one timeline impact (house/car/travel/emergency) AND one wealth impact (retirement net worth).
No markdown, no bullets, no extra lines.`;

    const generated = await generateAssistantReply(prompt);
    const text = `${generated.reply || ""}`.trim();
    const insights = {};
    if (text) {
      for (const line of text.split(/\r?\n/)) {
        const m = line.match(/^([a-z0-9_-]+)\s*:\s*(.+)$/i);
        if (!m) continue;
        insights[m[1]] = m[2].trim();
      }
    }
    const finalInsights = Object.keys(insights).length ? insights : buildLocalPathfinderInsights(scenarios);
    return res.status(200).json({ insights: finalInsights, provider: generated.provider || "local" });
  }

  // Voice
  if (path === "/api/voice/reply") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const body = getBody(req);
    const transcript = `${body?.transcript || ""}`;
    const profile = body?.profile || {};
    const language = "en";
    const langLabel = "English";
    const prompt = `User asked by voice (${langLabel}): ${transcript}
Customer context: income ${profile?.income || "n/a"}, spending ${profile?.spending || "n/a"}, loans ${profile?.loans || "n/a"}, creditScore ${profile?.creditScore || "n/a"}.
Reply quickly with direct action-oriented guidance. ${strictLanguageInstruction(language)}`;
    const generated = await generateAssistantReply(prompt);
    let reply = generated.reply || fallbackReply(transcript, profile, language);
    return res.status(200).json({ transcript, reply, provider: generated.provider || "local" });
  }

  // Features
  if (path === "/api/features/modules") {
    if (req.method !== "GET") return methodNotAllowed(res);
    return res.status(200).json(featureModules);
  }

  // RM tools (banker role)
  if (path === "/api/rm/customer-summary") {
    if (req.method !== "GET") return methodNotAllowed(res);
    const user = requireAuth(req, res, ["banker"]);
    if (!user) return;

    const defaults = {
      customerId: "CUST-7721",
      name: "Arjun Sharma",
      phone: "9876543210",
      income: 92000,
      spending: 51000,
      loans: 24000,
      creditScore: 734,
      riskLevel: "medium",
    };
    const qp = url.searchParams;
    const customer = {
      ...defaults,
      ...(qp.get("customerId") ? { customerId: qp.get("customerId") } : {}),
      ...(qp.get("name") ? { name: qp.get("name") } : {}),
      ...(qp.get("phone") ? { phone: qp.get("phone") } : {}),
      ...(qp.get("income") ? { income: Number(qp.get("income")) || defaults.income } : {}),
      ...(qp.get("spending") ? { spending: Number(qp.get("spending")) || defaults.spending } : {}),
      ...(qp.get("loans") ? { loans: Number(qp.get("loans")) || defaults.loans } : {}),
      ...(qp.get("creditScore") ? { creditScore: Number(qp.get("creditScore")) || defaults.creditScore } : {}),
      ...(qp.get("riskLevel") ? { riskLevel: qp.get("riskLevel") } : {}),
    };

    const profile = buildCustomerProfile(customer);
    const flags = [
      {
        label: "EMI Burden",
        value: `${Math.round(profile.emiBurden * 100)}%`,
        color: profile.emiBurden > 0.45 ? "red" : profile.emiBurden > 0.3 ? "yellow" : "green",
      },
      {
        label: "Credit Score",
        value: `${profile.creditScore}`,
        color: profile.creditScore < 650 ? "red" : profile.creditScore < 720 ? "yellow" : "green",
      },
      {
        label: "Risk Score",
        value: `${profile.riskScore}`,
        color: profile.riskScore > 74 ? "red" : profile.riskScore > 55 ? "yellow" : "green",
      },
    ];

    writeAudit({ actor: user.email, role: user.role, action: "rm_customer_summary", result: "ok" });

    return res.status(200).json({
      customer: {
        customerId: customer.customerId,
        name: customer.name,
        phoneMasked: maskValue(customer.phone),
        income: customer.income,
        spending: customer.spending,
        loans: customer.loans,
        creditScore: customer.creditScore,
        riskLevel: customer.riskLevel,
      },
      flags,
      recommendation: "Eligible for secured credit card. Avoid unsecured top-up loan this month.",
      reason: "Moderate EMI burden and healthy score suggest controlled product exposure.",
    });
  }

  if (path === "/api/rm/product-decision") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const user = requireAuth(req, res, ["banker"]);
    if (!user) return;

    const body = getBody(req);
    const decision = rmDecision(body);

    writeAudit({
      actor: user.email,
      role: user.role,
      action: "rm_product_decision",
      result: decision.allowed ? "allowed" : "blocked",
    });

    return res.status(200).json(decision);
  }

  // Cross-sell
  if (path === "/api/cross-sell/recommend") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const user = requireAuth(req, res, ["user", "banker"]);
    if (!user) return;

    const body = getBody(req);
    const result = recommendProducts(body);
    writeAudit({
      actor: user.email,
      role: user.role,
      action: "cross_sell_recommend",
      result: `returned_${result.recommendations.length}`,
    });

    return res.status(200).json({
      recommendations: result.recommendations,
      reasoningOutput: result.recommendations[0]?.reason || "No suitable safe product found.",
      confidenceTop: result.recommendations[0]?.confidence || 0,
      profile: result.profile,
      filteredUnsafe: result.filteredUnsafe,
    });
  }

  // Compliance
  if (path === "/api/compliance/status") {
    if (req.method !== "GET") return methodNotAllowed(res);
    const user = requireAuth(req, res, ["user", "banker"]);
    if (!user) return;

    return res.status(200).json({
      role: user.role,
      consentStatus: "Active",
      dataUsed: ["Income", "Spending trend", "Loan burden", "Credit score", "Risk profile"],
      decisionExplainer:
        "The system approves or blocks products based on affordability, repayment burden, and policy guardrails.",
      badges: ["RBI-minded controls", "Data minimization", "Audit-ready", "Role-based access"],
      maskedPreview: {
        email: maskValue(user.email),
        account: "AC****72",
        mobile: "98****10",
      },
      auditLogs: getAuditLogs().slice(0, 8),
    });
  }

  // Updates feed
  if (path === "/api/updates") {
    if (req.method !== "GET") return methodNotAllowed(res);
    return res.status(200).json(getLiveUpdatesFeed());
  }

  return res.status(404).json({ message: "Not found" });
}
