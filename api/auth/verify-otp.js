import { getBody } from "../_lib/body.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const body = getBody(req);
  const otp = `${body?.otp || ""}`.trim();
  if (otp !== "123456") {
    return res.status(401).json({ success: false, message: "Wrong OTP — try 123456" });
  }
  return res.status(200).json({ success: true, token: "fp-session-token" });
}
