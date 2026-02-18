import { getBody } from "../_lib/body.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const body = getBody(req);
  const email = `${body?.email || ""}`.trim();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  return res.status(200).json({ otpSent: true });
}
