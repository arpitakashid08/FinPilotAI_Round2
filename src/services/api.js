const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function parse(res) {
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchDashboardData() {
  const res = await fetch(`${API_BASE}/content`);
  return parse(res);
}

export async function fetchVoiceReply(transcript) {
  const res = await fetch(`${API_BASE}/voice/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript }),
  });
  return parse(res);
}
