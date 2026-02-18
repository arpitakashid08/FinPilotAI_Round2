import { Router } from "express";

const router = Router();

router.post("/voice/reply", (req, res) => {
  const transcript = `${req.body?.transcript || ""}`.toLowerCase();
  let reply = "Current signal is balanced. Consider risk-adjusted exposure instead of concentrated entries.";

  if (transcript.includes("tesla") || transcript.includes("musk")) {
    reply = "Tesla signal: medium volatility, positive momentum, maintain staggered position sizing.";
  } else if (transcript.includes("microsoft") || transcript.includes("nadella")) {
    reply = "Microsoft signal: steady enterprise demand, watch cloud margin commentary for confirmation.";
  } else if (transcript.includes("google") || transcript.includes("pichai")) {
    reply = "Google signal: search monetization stable, AI capex remains the short-term pressure point.";
  }

  res.json({ transcript, reply });
});

export default router;
