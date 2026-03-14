import { Router } from "express";

const router = Router();

let upiState = {
  connected: false,
  provider: "",
  vpa: "",
  balance: 0,
  lastSync: null,
};

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n));
}

function nowIso() {
  return new Date().toISOString();
}

function stableSeed(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function jitterBalance(current, vpa) {
  const seed = stableSeed(`${vpa}:${new Date().toISOString().slice(0, 16)}`); // changes per minute
  const driftPct = ((seed % 81) - 40) / 10000; // -0.40%..+0.40%
  const next = Math.round(current * (1 + driftPct));
  // Keep it sensible
  return clamp(next, 0, 5_00_00_000);
}

router.get("/upi/status", (_req, res) => {
  return res.json(upiState);
});

router.post("/upi/connect", (req, res) => {
  const provider = `${req.body?.provider || ""}`.trim();
  const vpa = `${req.body?.vpa || ""}`.trim();
  if (!provider) return res.status(400).json({ message: "provider_required" });
  if (!vpa || !vpa.includes("@")) return res.status(400).json({ message: "vpa_invalid" });

  const seed = stableSeed(`${provider}:${vpa}`);
  const base = 12_000 + (seed % 2_50_000); // 12k..262k
  upiState = {
    connected: true,
    provider,
    vpa,
    balance: base,
    lastSync: nowIso(),
  };
  return res.json(upiState);
});

router.post("/upi/refresh", (_req, res) => {
  if (!upiState.connected) return res.status(200).json(upiState);
  upiState = {
    ...upiState,
    balance: jitterBalance(upiState.balance, upiState.vpa),
    lastSync: nowIso(),
  };
  return res.json(upiState);
});

router.post("/upi/disconnect", (_req, res) => {
  upiState = { connected: false, provider: "", vpa: "", balance: 0, lastSync: nowIso() };
  return res.json(upiState);
});

export default router;

