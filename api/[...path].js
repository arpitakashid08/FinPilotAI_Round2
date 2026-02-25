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
    const language = `${body?.language || "en"}`;
    const langLabel = language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English";
    const profile = body?.profile || {};
    const prompt = `User question (${langLabel}): ${message}
Customer context:
- name: ${profile?.name || "Unknown"}
- income: ${profile?.income || "n/a"}
- spending: ${profile?.spending || "n/a"}
- loans: ${profile?.loans || "n/a"}
- creditScore: ${profile?.creditScore || "n/a"}
- riskLevel: ${profile?.riskLevel || "n/a"}
Instructions: Analyse loans, overall financial health, and provide a tailored investment/debt strategy when relevant. Respond in ${langLabel}. Do not repeat canned lines.`;
    const generated = await generateAssistantReply(prompt);
    const reply = generated.reply || fallbackReply(message);
    return res.status(200).json({ reply, provider: generated.provider || "local" });
  }

  // Voice
  if (path === "/api/voice/reply") {
    if (req.method !== "POST") return methodNotAllowed(res);
    const body = getBody(req);
    const transcript = `${body?.transcript || ""}`;
    const profile = body?.profile || {};
    const language = `${body?.language || "en"}`;
    const langLabel = language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English";
    const prompt = `User asked by voice (${langLabel}): ${transcript}
Customer context: income ${profile?.income || "n/a"}, spending ${profile?.spending || "n/a"}, loans ${profile?.loans || "n/a"}, creditScore ${profile?.creditScore || "n/a"}.
Reply quickly in ${langLabel} with direct action-oriented guidance.`;
    const generated = await generateAssistantReply(prompt);
    const reply = generated.reply || fallbackReply(transcript);
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
