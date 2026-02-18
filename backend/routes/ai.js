import { Router } from "express";
import { buildAstroReply } from "../data/mockDb.js";

const router = Router();

router.post("/ai/chat", (req, res) => {
  const message = `${req.body?.message || ""}`;
  const reply = buildAstroReply(message);
  return res.json({ reply });
});

export default router;
