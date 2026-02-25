import { Router } from "express";
import { getLiveUpdatesFeed } from "../data/mockDb.js";

const router = Router();

router.get("/updates", (_req, res) => {
  return res.json(getLiveUpdatesFeed());
});

export default router;
