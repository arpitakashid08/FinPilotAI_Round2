import { Router } from "express";
import { generateAssistantReply } from "../services/llm.js";

const router = Router();

router.post("/voice/reply", async (req, res) => {
  const transcript = `${req.body?.transcript || ""}`.toLowerCase();
  const language = `${req.body?.language || "en"}`;
  const langLabel = language === "mr" ? "Marathi" : language === "hi" ? "Hindi" : "English";
  const profile = req.body?.profile || {};
  let reply = "Current signal is balanced. Consider risk-adjusted exposure instead of concentrated entries.";

  const prompt = `User asked by voice (${langLabel}): ${transcript}
Customer context: income ${profile?.income || "n/a"}, spending ${profile?.spending || "n/a"}, loans ${profile?.loans || "n/a"}, creditScore ${profile?.creditScore || "n/a"}.
Reply in ${langLabel} with concise and practical fintech guidance.`;
  const generated = await generateAssistantReply(prompt);
  if (generated.reply) {
    reply = generated.reply;
  } else if (transcript.includes("tesla") || transcript.includes("musk")) {
    reply = "Tesla signal: medium volatility, positive momentum, maintain staggered position sizing.";
  } else if (transcript.includes("microsoft") || transcript.includes("nadella")) {
    reply = "Microsoft signal: steady enterprise demand, watch cloud margin commentary for confirmation.";
  } else if (transcript.includes("google") || transcript.includes("pichai")) {
    reply = "Google signal: search monetization stable, AI capex remains the short-term pressure point.";
  }

  res.json({ transcript, reply, provider: generated.provider || "local" });
});

export default router;
