import { Router } from "express";
import { content } from "../data/content.js";

const router = Router();

router.get("/content", (_req, res) => {
  res.json(content);
});

export default router;
