import { Router } from "express";
import { mockUser } from "../data/mockDb.js";
import { issueToken, verifyToken } from "../utils/security.js";

const router = Router();

router.post("/auth/login", (req, res) => {
  const email = `${req.body?.email || ""}`.trim();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  return res.json({ otpSent: true });
});

router.post("/auth/verify-otp", (req, res) => {
  const otp = `${req.body?.otp || ""}`.trim();
  const email = `${req.body?.email || "user@finpilot.ai"}`.trim() || "user@finpilot.ai";
  if (otp !== "123456") {
    return res.status(401).json({ success: false, message: "Wrong OTP — try 123456" });
  }
  const token = issueToken({ sub: "user-1", email, role: "user" });
  const bankerToken = issueToken({ sub: "banker-1", email: "banker@finpilot.ai", role: "banker" });
  return res.json({ success: true, token, bankerToken });
});

router.post("/auth/banker-token", (_req, res) => {
  const bankerToken = issueToken({ sub: "banker-1", email: "banker@finpilot.ai", role: "banker" });
  return res.json({ bankerToken });
});

router.post("/auth/signup", (_req, res) => {
  return res.json({ success: true });
});

router.get("/auth/profile", (_req, res) => {
  const auth = _req.headers?.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const claims = verifyToken(token);
  const email = claims?.email || mockUser.email;
  const name = `${email}`.split("@")[0].replace(/[._-]+/g, " ").trim().split(" ").filter(Boolean).map((x) => x.charAt(0).toUpperCase() + x.slice(1)).join(" ") || "FinPilot User";
  return res.json({ ...mockUser, email, name });
});

export default router;
