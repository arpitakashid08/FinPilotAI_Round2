import { getBody } from "../_lib/body.js";
import { issueToken } from "../_lib/security.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
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
