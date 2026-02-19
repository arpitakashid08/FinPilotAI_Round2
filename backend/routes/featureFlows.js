import { Router } from "express";
import { buildCustomerProfile, recommendProducts, rmDecision } from "../utils/featureEngine.js";
import { getAuditLogs, maskValue, requireAuth, writeAudit } from "../utils/security.js";

const router = Router();

router.post("/cross-sell/recommend", (req, res) => {
  const user = requireAuth(req, res, ["user", "banker"]);
  if (!user) return;

  const result = recommendProducts(req.body || {});
  writeAudit({
    actor: user.email,
    role: user.role,
    action: "cross_sell_recommend",
    result: `returned_${result.recommendations.length}`,
  });

  return res.json({
    recommendations: result.recommendations,
    reasoningOutput: result.recommendations[0]?.reason || "No suitable safe product found.",
    confidenceTop: result.recommendations[0]?.confidence || 0,
    profile: result.profile,
    filteredUnsafe: result.filteredUnsafe,
  });
});

router.get("/rm/customer-summary", (req, res) => {
  const user = requireAuth(req, res, ["banker"]);
  if (!user) return;

  const customer = {
    customerId: "CUST-7721",
    name: "Priya Mehta",
    phone: "9876543210",
    income: 92000,
    spending: 51000,
    loans: 24000,
    creditScore: 734,
    riskLevel: "medium",
  };

  const profile = buildCustomerProfile(customer);
  const flags = [
    { label: "EMI Burden", value: `${Math.round(profile.emiBurden * 100)}%`, color: profile.emiBurden > 0.45 ? "red" : profile.emiBurden > 0.3 ? "yellow" : "green" },
    { label: "Credit Score", value: `${profile.creditScore}`, color: profile.creditScore < 650 ? "red" : profile.creditScore < 720 ? "yellow" : "green" },
    { label: "Risk Score", value: `${profile.riskScore}`, color: profile.riskScore > 74 ? "red" : profile.riskScore > 55 ? "yellow" : "green" },
  ];

  writeAudit({ actor: user.email, role: user.role, action: "rm_customer_summary", result: "ok" });

  return res.json({
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
});

router.post("/rm/product-decision", (req, res) => {
  const user = requireAuth(req, res, ["banker"]);
  if (!user) return;

  const decision = rmDecision(req.body || {});
  writeAudit({
    actor: user.email,
    role: user.role,
    action: "rm_product_decision",
    result: decision.allowed ? "allowed" : "blocked",
  });

  return res.json(decision);
});

router.get("/compliance/status", (req, res) => {
  const user = requireAuth(req, res, ["user", "banker"]);
  if (!user) return;

  return res.json({
    role: user.role,
    consentStatus: "Active",
    dataUsed: ["Income", "Spending trend", "Loan burden", "Credit score", "Risk profile"],
    decisionExplainer: "The system approves or blocks products based on affordability, repayment burden, and policy guardrails.",
    badges: ["RBI-minded controls", "Data minimization", "Audit-ready", "Role-based access"],
    maskedPreview: {
      email: maskValue(user.email),
      account: "AC****72",
      mobile: "98****10",
    },
    auditLogs: getAuditLogs().slice(0, 8),
  });
});

export default router;
