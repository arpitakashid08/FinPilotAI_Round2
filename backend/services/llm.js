const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";

function clean(text = "") {
  return `${text}`.trim().replace(/\s+/g, " ");
}

async function askOpenAI(prompt) {
  if (!OPENAI_API_KEY) return "";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are Astro, a concise fintech copilot. Respond in plain English with direct, practical advice." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 220,
    }),
  });

  if (!res.ok) throw new Error(`openai_${res.status}`);
  const data = await res.json();
  return clean(data?.choices?.[0]?.message?.content || "");
}

async function askGemini(prompt) {
  if (!GEMINI_API_KEY) return "";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 220,
      },
    }),
  });

  if (!res.ok) throw new Error(`gemini_${res.status}`);
  const data = await res.json();
  return clean(data?.candidates?.[0]?.content?.parts?.[0]?.text || "");
}

export async function generateAssistantReply(prompt) {
  try {
    const openaiReply = await askOpenAI(prompt);
    if (openaiReply) return { reply: openaiReply, provider: "openai" };
  } catch {
    // fall through to Gemini/local fallback
  }

  try {
    const geminiReply = await askGemini(prompt);
    if (geminiReply) return { reply: geminiReply, provider: "gemini" };
  } catch {
    // local fallback is handled by caller
  }

  return { reply: "", provider: "local" };
}
