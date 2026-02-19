import { getAuditLogs, maskValue, requireAuth } from "../_lib/security.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = requireAuth(req, res, ["user", "banker"]);
  if (!user) return;

  return res.status(200).json({
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
}
