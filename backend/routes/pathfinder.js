import { Router } from "express";
import { connectDB } from "../../config/db.js";
import UserFinancialProfile from "../../models/UserFinancialProfile.js";
import SimulationScenario from "../../models/SimulationScenario.js";

const router = Router();

function asRiskLabel(value) {
  if (typeof value === "string") return value;
  const n = Number(value);
  if (!Number.isFinite(n)) return "medium";
  if (n < 35) return "low";
  if (n < 70) return "medium";
  return "high";
}

async function ensureDB(res) {
  try {
    await connectDB();
    return true;
  } catch (e) {
    const msg = `${e?.message || e}`;
    const code = msg.includes("MONGO_URI_missing") ? 503 : 500;
    res.status(code).json({ message: "db_unavailable", detail: msg });
    return false;
  }
}

router.post("/pathfinder/profile", async (req, res) => {
  if (!(await ensureDB(res))) return;
  const body = req.body || {};
  const userId = body.userId || body.email || body.sub;
  if (!userId) return res.status(400).json({ message: "userId_required" });

  const doc = await UserFinancialProfile.create({
    userId,
    age: Number(body.age ?? 0),
    monthlyIncome: Number(body.monthlyIncome ?? 0),
    monthlyExpenses: Number(body.monthlyExpenses ?? 0),
    currentSavings: Number(body.currentSavings ?? 0),
    investmentRate: Number(body.investmentRate ?? 0),
    salaryGrowthRate: Number(body.salaryGrowthRate ?? body.salaryGrowth ?? 0),
    inflationRate: Number(body.inflationRate ?? body.inflation ?? 0),
    riskTolerance: asRiskLabel(body.riskTolerance),
    goals: Array.isArray(body.goals) ? body.goals.map(String) : [],
  });

  return res.status(200).json({ profileId: doc._id, createdAt: doc.createdAt });
});

router.post("/pathfinder/simulate", async (req, res) => {
  if (!(await ensureDB(res))) return;
  const body = req.body || {};
  const scenarioName = String(body.scenarioName || "").trim();
  if (!scenarioName) return res.status(400).json({ message: "scenarioName_required" });

  let profileId = body.profileId;
  if (!profileId) {
    const userId = body.userId || body.email || body.sub;
    if (!userId) return res.status(400).json({ message: "userId_or_profileId_required" });
    const latest = await UserFinancialProfile.findOne({ userId }).sort({ createdAt: -1 }).lean();
    if (!latest?._id) return res.status(404).json({ message: "profile_not_found" });
    profileId = latest._id;
  }

  const doc = await SimulationScenario.create({
    userId: profileId,
    scenarioName,
    projectedNetWorth: Number(body.projectedNetWorth ?? 0),
    yearlyProjection: Array.isArray(body.yearlyProjection) ? body.yearlyProjection : [],
    debtImpact: Number(body.debtImpact ?? 0),
    goalTimeline: Array.isArray(body.goalTimeline) ? body.goalTimeline : [],
  });

  return res.status(200).json({ scenarioId: doc._id, createdAt: doc.createdAt });
});

router.get("/pathfinder/results/:userId", async (req, res) => {
  if (!(await ensureDB(res))) return;
  const userId = String(req.params.userId || "").trim();
  if (!userId) return res.status(400).json({ message: "userId_required" });

  const profile = await UserFinancialProfile.findOne({ userId }).sort({ createdAt: -1 }).lean();
  if (!profile?._id) return res.status(404).json({ message: "profile_not_found" });

  const scenarios = await SimulationScenario.find({ userId: profile._id }).sort({ createdAt: -1 }).lean();
  return res.status(200).json({ profile, scenarios });
});

export default router;

