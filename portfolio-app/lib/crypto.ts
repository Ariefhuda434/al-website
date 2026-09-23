import { randomBytes, createHash } from "crypto";

/** Token sesi acak yang aman, disimpan hash-nya saja di DB (bukan plaintext). */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** IP disimpan sebagai hash (privasi), bukan mentah. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || "portfolio-app-default-salt-change-me";
  return createHash("sha256").update(salt + ip).digest("hex");
}

export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for") || "";
  return fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "0.0.0.0";
}
