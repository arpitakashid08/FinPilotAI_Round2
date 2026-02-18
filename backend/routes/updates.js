import { Router } from "express";
import { updatesFeed } from "../data/mockDb.js";

const router = Router();

router.get("/updates", (_req, res) => {
  return res.json(updatesFeed);
});

export default router;
