import { Router } from "express";
import { featureModules } from "../data/mockDb.js";

const router = Router();

router.get("/features/modules", (_req, res) => {
  return res.json(featureModules);
});

export default router;
