import { Router } from "express";
import { buildAstroReply } from "../data/mockDb.js";
import { generateAssistantReply } from "../services/llm.js";

const router = Router();

router.post("/ai/chat", async (req, res) => {
  const message = `${req.body?.message || ""}`;
  const prompt = `User question: ${message}\nContext: FinPilot personal finance assistant. Keep answer concise and actionable.`;
  const generated = await generateAssistantReply(prompt);
  const reply = generated.reply || buildAstroReply(message);
  return res.json({ reply, provider: generated.provider || "local" });
});

export default router;
