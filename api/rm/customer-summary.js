import { requireAuth, writeAudit, maskValue } from "../_lib/security.js";
import { buildCustomerProfile } from "../_lib/featureEngine.js";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
