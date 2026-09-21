export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { COOKIE_NAME, adminPassword, isAdmin, makeToken } from "../../../lib/auth";
import { PATHS, readJSON, writeJSON } from "../../../lib/blobStore";

type Log = {
  ts: number;
  action: string;
  result?: string;
  detail?: string;
  ip?: string;
  ua?: string;
};

async function note(entry: Log) {
  try {
    const list = await readJSON<Log[]>(PATHS.log, []);
    const arr = Array.isArray(list) ? list : [];
    arr.push(entry);
    await writeJSON(PATHS.log, arr.slice(-500));
  } catch {
    /* log gagal tidak boleh menggagalkan login */
  }
}

/** Cek apakah sesi masih aktif. Dipakai halaman /admin saat dimuat. */
export async function GET() {
  return NextResponse.json({ ok: await isAdmin(), configured: Boolean(adminPassword()) });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string; logout?: boolean };
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
  const ua = (request.headers.get("user-agent") || "").slice(0, 200);

  if (body.logout) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
    return res;
  }

  const expected = adminPassword();
  if (!expected) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD belum diatur di Vercel. Tambahkan dulu lewat Settings → Environment Variables." },
      { status: 503 },
    );
  }
  if (typeof body.password !== "string" || body.password !== expected) {
    await note({ ts: Date.now(), action: "login", result: "failed", ip, ua });
    return NextResponse.json({ error: "Kata sandi salah." }, { status: 401 });
  }

  await note({ ts: Date.now(), action: "login", result: "success", ip, ua });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, makeToken(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
