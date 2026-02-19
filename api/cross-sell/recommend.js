import { getBody } from "../_lib/body.js";
import { recommendProducts } from "../_lib/featureEngine.js";
import { requireAuth, writeAudit } from "../_lib/security.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
