import express from "express";
import cors from "cors";
import contentRoutes from "./routes/content.js";
import voiceRoutes from "./routes/voice.js";
import authRoutes from "./routes/auth.js";
import updatesRoutes from "./routes/updates.js";
import aiRoutes from "./routes/ai.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", contentRoutes);
app.use("/api", voiceRoutes);
app.use("/api", authRoutes);
app.use("/api", updatesRoutes);
app.use("/api", aiRoutes);

app.listen(PORT, () => {
  console.log(`FinPilot backend listening on http://localhost:${PORT}`);
});
