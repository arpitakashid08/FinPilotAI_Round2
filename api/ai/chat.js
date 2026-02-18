import { getBody } from "../_lib/body.js";
import { fallbackReply } from "../_lib/data.js";
import { generateAssistantReply } from "../_lib/llm.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = getBody(req);
  const message = `${body?.message || ""}`;
  const prompt = `User question: ${message}\nContext: FinPilot personal finance assistant. Keep answer concise and actionable.`;
  const generated = await generateAssistantReply(prompt);
  const reply = generated.reply || fallbackReply(message);
  return res.status(200).json({ reply, provider: generated.provider || "local" });
}
