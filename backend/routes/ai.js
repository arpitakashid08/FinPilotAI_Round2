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

function fmtINR(n = 0) {
  const v = Math.round(Number(n || 0));
  return `₹${v.toLocaleString("en-IN")}`;
}

function buildLocalPathfinderInsights(scenarios = []) {
  const byId = Object.fromEntries(scenarios.map((s) => [s.id, s]));
  const base = byId.corporate || scenarios[0];
  const out = {};
  for (const s of scenarios) {
    if (!s?.id) continue;
    if (!base || s.id === base.id) {
      out[s.id] = "Stable compounding with predictable goal timelines and moderate risk.";
      continue;
    }
    const parts = [];
    if (Number.isFinite(base.houseAge) && Number.isFinite(s.houseAge)) {
      const d = s.houseAge - base.houseAge;
      if (Math.abs(d) >= 0.9) parts.push(`House goal ${d > 0 ? "delays" : "accelerates"} by ~${Math.abs(Math.round(d))} years vs corporate.`);
    }
    const nwDelta = (s.netWorthAtRetirement || 0) - (base.netWorthAtRetirement || 0);
    parts.push(`Retirement net worth ${nwDelta >= 0 ? "increases" : "decreases"} by ~${fmtINR(Math.abs(nwDelta))}.`);
    if ((s.maxDebt || 0) > (base.maxDebt || 0) + 1) parts.push(`Peak debt is higher (max ~${fmtINR(s.maxDebt || 0)}).`);
    out[s.id] = parts.join(" ");
  }
  return out;
}

router.post("/ai/pathfinder-explain", async (req, res) => {
  const inputs = req.body?.inputs || {};
  const scenarios = Array.isArray(req.body?.scenarios) ? req.body.scenarios.slice(0, 8) : [];

  const scenarioList = scenarios
    .map((s) => `- ${s.id} (${s.label}): retirementNW ${s.netWorthAtRetirement}, target ${s.retirementTarget}, gap ${s.retirementGap}; emergencyAge ${s.emergencyFundAge}; houseAge ${s.houseAge}; carAge ${s.carAge}; travelAge ${s.travelAge}; peakDebt ${s.maxDebt}; interestPaid ${s.interestPaid}`)
    .join("\n");

  const prompt = `You are Astro, a concise financial copilot. Write one crisp, concrete trade-off insight per scenario.
User inputs: age ${inputs.age}, retirementAge ${inputs.retirementAge}, income ${inputs.monthlyIncome}/mo, expenses ${inputs.monthlyExpenses}/mo, savings ${inputs.currentSavings}, investRate ${inputs.investmentRate}, salaryGrowth ${inputs.salaryGrowth}, inflation ${inputs.inflation}, riskTolerance ${inputs.riskTolerance}.
Scenario summaries:
${scenarioList}
Output EXACTLY one line per scenario, in this format:
<id>: <one sentence insight mentioning at least one timeline impact (house/car/travel/emergency) AND one wealth impact (retirement net worth).
No markdown, no bullets, no extra lines.`;

  const generated = await generateAssistantReply(prompt);
  const text = `${generated.reply || ""}`.trim();
  const insights = {};

  if (text) {
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^([a-z0-9_-]+)\s*:\s*(.+)$/i);
      if (!m) continue;
      insights[m[1]] = m[2].trim();
    }
  }

  const finalInsights = Object.keys(insights).length ? insights : buildLocalPathfinderInsights(scenarios);
  return res.json({ insights: finalInsights, provider: generated.provider || "local" });
});

export default router;
