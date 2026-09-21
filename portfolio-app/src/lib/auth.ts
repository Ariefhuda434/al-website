import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "al_admin";
const SECRET = process.env.ADMIN_SECRET || "ganti-secret-ini-di-vercel";

/** Kata sandi admin. Set ADMIN_PASSWORD di Vercel sebelum dipakai serius. */
export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return createHmac("sha256", SECRET).update(value).digest("hex");
}

export function makeToken() {
  const issued = String(Date.now());
  return `${issued}.${sign(issued)}`;
}

/** Token berlaku 7 hari. */
export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  const expected = sign(issued);
  if (sig.length !== expected.length) return false;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const age = Date.now() - Number(issued);
  return Number.isFinite(age) && age >= 0 && age < 7 * 24 * 60 * 60 * 1000;
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(COOKIE)?.value);
}

export const COOKIE_NAME = COOKIE;
