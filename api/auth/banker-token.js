import { issueToken } from "../_lib/security.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const bankerToken = issueToken({ sub: "banker-1", email: "banker@finpilot.ai", role: "banker" });
  return res.status(200).json({ bankerToken });
}
