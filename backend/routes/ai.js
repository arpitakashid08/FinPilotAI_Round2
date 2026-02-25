import { Router } from "express";
import { buildAstroReply } from "../data/mockDb.js";
import { generateAssistantReply } from "../services/llm.js";

const router = Router();

router.post("/ai/chat", async (req, res) => {
  const message = `${req.body?.message || ""}`;
  const language = `${req.body?.language || "en"}`;
  const langLabel = language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English";
  const profile = req.body?.profile || {};
  const prompt = `User question (${langLabel}): ${message}
Customer context: name ${profile?.name || "Unknown"}, income ${profile?.income || "n/a"}, spending ${profile?.spending || "n/a"}, loans ${profile?.loans || "n/a"}, creditScore ${profile?.creditScore || "n/a"}, riskLevel ${profile?.riskLevel || "n/a"}.
Give tailored financial-health guidance and investment/debt strategy when relevant. Respond in ${langLabel}.`;
  const generated = await generateAssistantReply(prompt);
  const reply = generated.reply || buildAstroReply(message, profile);
  return res.json({ reply, provider: generated.provider || "local" });
});

export default router;
