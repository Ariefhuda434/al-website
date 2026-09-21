export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { PATHS, readJSON, writeJSON } from "../../../lib/blobStore";

type Stat = {
  ts: number;
  date: string;
  type: "view" | "click";
  path: string;
  label?: string;
  referrer?: string;
  ip?: string;
  ua?: string;
};

const MAX = 5000;

/** Ringkasan untuk dasbor admin. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Perlu masuk." }, { status: 401 });

  const raw = await readJSON<Stat[]>(PATHS.stats, []);
  const list = Array.isArray(raw) ? raw : [];
  const views = list.filter((s) => s.type === "view");
  const clicks = list.filter((s) => s.type === "click");

  const byDay = new Map<string, number>();
  for (const v of views) byDay.set(v.date, (byDay.get(v.date) ?? 0) + 1);

  const topClicks = new Map<string, number>();
  for (const c of clicks) {
    const key = c.label || "(tanpa label)";
    topClicks.set(key, (topClicks.get(key) ?? 0) + 1);
  }

  const today = new Date().toISOString().slice(0, 10);

  return NextResponse.json({
    totalViews: views.length,
    totalClicks: clicks.length,
    viewsToday: byDay.get(today) ?? 0,
    daily: [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-30),
    topClicks: [...topClicks.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
    recent: list.slice(-40).reverse(),
  });
}

/** Ditulis oleh komponen Tracker. Terbuka untuk publik, tapi isinya dibatasi. */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<Stat>;
    const fwd = request.headers.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0].trim() || undefined;

    const entry: Stat = {
      ts: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: body.type === "click" ? "click" : "view",
      path: String(body.path ?? "/").slice(0, 120),
      label: typeof body.label === "string" ? body.label.slice(0, 120) : undefined,
      referrer: typeof body.referrer === "string" ? body.referrer.slice(0, 200) : undefined,
      ip,
      ua: (request.headers.get("user-agent") || "").slice(0, 200),
    };

    const raw = await readJSON<Stat[]>(PATHS.stats, []);
    const list = Array.isArray(raw) ? raw : [];
    list.push(entry);
    await writeJSON(PATHS.stats, list.slice(-MAX));

    return NextResponse.json({ ok: true });
  } catch {
    // Statistik tidak boleh mengganggu pengunjung.
    return NextResponse.json({ ok: false });
  }
}

export async function DELETE() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Perlu masuk." }, { status: 401 });
  await writeJSON(PATHS.stats, []);
  return NextResponse.json({ ok: true });
}
