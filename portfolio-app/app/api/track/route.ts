export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { execute } from "../../../lib/db";
import { getClientIp, hashIp } from "../../../lib/crypto";

/** Dipanggil oleh komponen Tracker di sisi klien. Publik, dibatasi ukurannya. */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      type?: string; path?: string; label?: string; referrer?: string;
    };
    const ip = getClientIp(request);
    const type = body.type === "click" ? "click" : "view";
    await execute(
      `INSERT INTO visit_stats (ts, visit_date, event_type, path, label, referrer, ip_hash, user_agent)
       VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?)`,
      [
        Date.now(),
        type,
        String(body.path ?? "/").slice(0, 160),
        body.label ? String(body.label).slice(0, 160) : null,
        body.referrer ? String(body.referrer).slice(0, 300) : null,
        hashIp(ip),
        (request.headers.get("user-agent") || "").slice(0, 300),
      ],
    );
    return NextResponse.json({ ok: true });
  } catch {
    // Statistik tidak boleh mengganggu pengunjung kalau gagal.
    return NextResponse.json({ ok: false });
  }
}
