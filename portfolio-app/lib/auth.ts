import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { query, queryOne, execute } from "./db";
import { generateToken, hashToken, hashIp, getClientIp } from "./crypto";

export type Role = "admin" | "superadmin";

export type AdminRow = {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
  is_active: number;
};

export type SessionUser = { id: number; email: string; role: Role };

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "site_admin_session";
const TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 7);

// ---- Rate limiting login (tabel MySQL — konsisten antar instance serverless) ----
const MAX_ATTEMPTS = 6;
const WINDOW_MINUTES = 10;

async function isRateLimited(key: string): Promise<boolean> {
  const rows = await query<{ c: number }>(
    `SELECT COUNT(*) AS c FROM login_attempts
     WHERE rate_key = ? AND attempted_at > NOW() - INTERVAL ? MINUTE`,
    [key, WINDOW_MINUTES],
  );
  return (rows[0]?.c ?? 0) >= MAX_ATTEMPTS;
}
async function bumpAttempt(key: string) {
  await execute(`INSERT INTO login_attempts (rate_key) VALUES (?)`, [key]);
}

async function logEvent(entry: {
  admin_id?: number | null;
  action: string;
  result?: string;
  detail?: string;
  level?: string;
  suspicious?: boolean;
  request?: Request;
}) {
  const ip = entry.request ? getClientIp(entry.request) : "";
  const ua = entry.request ? (entry.request.headers.get("user-agent") || "") : "";
  await execute(
    `INSERT INTO admin_logs (ts, admin_id, action, result, detail, level, suspicious, ip_hash, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      Date.now(),
      entry.admin_id ?? null,
      entry.action.slice(0, 60),
      (entry.result ?? "").slice(0, 30),
      (entry.detail ?? "").slice(0, 500),
      entry.level ?? "info",
      entry.suspicious ? 1 : 0,
      ip ? hashIp(ip) : null,
      ua.slice(0, 300),
    ],
  );
}

/** Login. Return SessionUser jika sukses, null jika gagal (password salah / tidak ada / nonaktif). */
export async function login(email: string, password: string, request: Request): Promise<SessionUser | null> {
  const rateKey = `login:${getClientIp(request)}:${email.toLowerCase().trim().slice(0, 190)}`;
  if (await isRateLimited(rateKey)) {
    await logEvent({ action: "login", result: "rate_limited", suspicious: true, request, detail: email.slice(0, 60) });
    return null;
  }

  const admin = await queryOne<AdminRow>(
    `SELECT id, email, password_hash, role, is_active FROM admins WHERE email = ? LIMIT 1`,
    [email.toLowerCase().trim().slice(0, 190)],
  );

  if (!admin || !admin.is_active) {
    await bumpAttempt(rateKey);
    await logEvent({ action: "login", result: "failed", request, detail: email.slice(0, 60) });
    return null;
  }

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) {
    await bumpAttempt(rateKey);
    await logEvent({ admin_id: admin.id, action: "login", result: "failed", request, detail: email.slice(0, 60) });
    return null;
  }

  await execute(`DELETE FROM login_attempts WHERE rate_key = ?`, [rateKey]);

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000);
  await execute(
    `INSERT INTO sessions (id, admin_id, ip, user_agent, expires_at) VALUES (?, ?, ?, ?, ?)`,
    [hashToken(token), admin.id, getClientIp(request), (request.headers.get("user-agent") || "").slice(0, 300), expiresAt],
  );
  await execute(`UPDATE admins SET last_login_at = NOW() WHERE id = ?`, [admin.id]);
  await logEvent({ admin_id: admin.id, action: "login", result: "success", request });

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: TTL_DAYS * 24 * 60 * 60,
  });

  return { id: admin.id, email: admin.email, role: admin.role };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await execute(`UPDATE sessions SET revoked_at = NOW() WHERE id = ?`, [hashToken(token)]);
  }
  jar.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/** Cek sesi dari cookie request saat ini. Dipakai di semua route admin. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const row = await queryOne<{ admin_id: number; email: string; role: Role }>(
    `SELECT s.admin_id, a.email, a.role
     FROM sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.id = ? AND s.revoked_at IS NULL AND s.expires_at > NOW() AND a.is_active = 1
     LIMIT 1`,
    [hashToken(token)],
  );
  if (!row) return null;
  return { id: row.admin_id, email: row.email, role: row.role };
}

/** Guard untuk route API. Lempar Response 401/403 kalau tidak memenuhi syarat. */
export async function requireRole(minRole: Role): Promise<{ user: SessionUser } | { error: Response }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: Response.json({ error: "Perlu masuk." }, { status: 401 }) };
  }
  if (minRole === "superadmin" && user.role !== "superadmin") {
    return { error: Response.json({ error: "Hanya superadmin yang boleh melakukan ini." }, { status: 403 }) };
  }
  return { user };
}

export async function createAdmin(params: { email: string; password: string; role: Role; createdBy: number }) {
  const hash = await bcrypt.hash(params.password, 12);
  await execute(
    `INSERT INTO admins (email, password_hash, role, created_by) VALUES (?, ?, ?, ?)`,
    [params.email.toLowerCase().trim(), hash, params.role, params.createdBy],
  );
}

export async function listAdmins() {
  return query<{ id: number; email: string; role: Role; is_active: number; created_at: string; last_login_at: string | null }>(
    `SELECT id, email, role, is_active, created_at, last_login_at FROM admins ORDER BY created_at ASC`,
  );
}

export async function setAdminActive(id: number, active: boolean) {
  await execute(`UPDATE admins SET is_active = ? WHERE id = ?`, [active ? 1 : 0, id]);
}

export { logEvent };
