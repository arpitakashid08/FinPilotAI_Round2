import { Router } from "express";
import { mockUser } from "../data/mockDb.js";

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
  if (otp !== "123456") {
    return res.status(401).json({ success: false, message: "Wrong OTP — try 123456" });
  }
  return res.json({ success: true, token: "fp-session-token" });
});

router.post("/auth/signup", (_req, res) => {
  return res.json({ success: true });
});

router.get("/auth/profile", (_req, res) => {
  return res.json(mockUser);
});

export default router;
