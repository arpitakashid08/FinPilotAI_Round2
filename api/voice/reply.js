import { getBody } from "../_lib/body.js";
import { fallbackReply } from "../_lib/data.js";
import { generateAssistantReply } from "../_lib/llm.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const body = getBody(req);
  const transcript = `${body?.transcript || ""}`;
  const prompt = `User asked by voice: ${transcript}\nReply in 1-2 short sentences with practical fintech guidance.`;
  const generated = await generateAssistantReply(prompt);
  const reply = generated.reply || fallbackReply(transcript);
  return res.status(200).json({ transcript, reply, provider: generated.provider || "local" });
}
