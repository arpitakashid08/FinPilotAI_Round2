import crypto from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET || "finpilot-demo-secret";
const auditLogs = [];

function b64(input) {
  return Buffer.from(input).toString("base64url");
}

function unb64(input) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function issueToken({ sub, email, role = "user", ttlSec = 60 * 60 * 8 }) {
  const header = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadObj = {
    sub,
    email,
    role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + ttlSec,
  };
  const payload = b64(JSON.stringify(payloadObj));
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const data = `${header}.${payload}`;
  const expected = crypto.createHmac("sha256", JWT_SECRET).update(data).digest("base64url");
  if (sig !== expected) return null;
  const parsed = JSON.parse(unb64(payload));
  if (!parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
  return parsed;
}

export function getTokenFromReq(req) {
  const auth = req.headers?.authorization || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : "";
}

export function requireAuth(req, res, roles = []) {
  const token = getTokenFromReq(req);
  const user = verifyToken(token);
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  if (roles.length && !roles.includes(user.role)) {
    res.status(403).json({ message: "Forbidden: insufficient role" });
    return null;
  }
  return user;
}

export function maskValue(value = "") {
  const s = `${value}`;
  if (s.length <= 4) return "****";
  return `${s.slice(0, 2)}****${s.slice(-2)}`;
}

export function writeAudit(entry) {
  auditLogs.unshift({ ts: new Date().toISOString(), ...entry });
  if (auditLogs.length > 50) auditLogs.pop();
}

export function getAuditLogs() {
  return auditLogs;
}
