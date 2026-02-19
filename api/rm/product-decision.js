import { getBody } from "../_lib/body.js";
import { rmDecision } from "../_lib/featureEngine.js";
import { requireAuth, writeAudit } from "../_lib/security.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
