import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "../../../lib/blobStore";

const PATH = "data/stats.json";

type Visit = {
  ts: number;
  date: string;
  type: "view" | "click";
  path: string;
  label?: string;
  ip?: string;
  ua?: string;
};

const MAX = 4000;

export async function GET() {
  const visits = await readJSON<Visit[]>(PATH, []);
  const list = (Array.isArray(visits) ? visits : []).slice().reverse();
  const today = new Date().toISOString().slice(0, 10);
  const last7 = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  const oneDay = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const uniqIP = new Set(list.map((v) => v.ip).filter(Boolean)).size;
  const uniqTodayIP = new Set(
    list.filter((v) => v.date === today).map((v) => v.ip).filter(Boolean)
  ).size;
  const device = {} as Record<string, number>;
  const browser = {} as Record<string, number>;
  for (const v of list) {
    const { dev, br } = parseUA(v.ua || "");
    if (dev) device[dev] = (device[dev] || 0) + 1;
    if (br) browser[br] = (browser[br] || 0) + 1;
  }
  return NextResponse.json({
    total: list.length,
    today: list.filter((v) => v.date === today).length,
    yesterday: list.filter((v) => v.date === oneDay).length,
    last7: list.filter((v) => v.date >= last7).length,
    uniqIP,
    uniqTodayIP,
    views: list.filter((v) => v.type === "view").length,
    clicks: list.filter((v) => v.type === "click").length,
    device: top(device),
    browser: top(browser),
    recent: list.slice(0, 80),
  });
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fwd = request.headers.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "";
    const ua = request.headers.get("user-agent") || "";
    const body = (await request.json().catch(() => ({}))) as Partial<Visit>;
    const db = await readJSON<Visit[]>(PATH, []);
    const list = Array.isArray(db) ? db : [];
    const entry: Visit = {
      ts: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: body.type === "click" ? "click" : "view",
      path: String(body.path ?? "/").slice(0, 120),
      label: typeof body.label === "string" ? body.label.slice(0, 120) : undefined,
      ip: searchParams.get("ip") === "0" ? undefined : ip || undefined,
      ua: ua.slice(0, 300),
    };
    if (list.length >= MAX) list.splice(0, list.length - MAX + 1);
    list.push(entry);
    await writeJSON(PATH, list);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal" },
      { status: 500 }
    );
  }
}

function parseUA(ua: string) {
  const dev =
    /iPad|Tablet/i.test(ua)
      ? "tablet"
      : /iPhone|Android|Mobile/i.test(ua)
        ? "mobile"
        : /(Windows|Macintosh|Linux)|Mobi/i.test(ua)
          ? "desktop"
          : "unknown";
  const br = /Edg/i.test(ua)
    ? "Edge"
    : /Chrome/i.test(ua)
      ? "Chrome"
      : /Firefox/i.test(ua)
        ? "Firefox"
        : /Safari/i.test(ua)
          ? "Safari"
          : /SamsungBrowser/i.test(ua)
            ? "Samsung"
            : "Lainnya";
  return { dev, br };
}

function top(map: Record<string, number>) {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, v]) => ({ name: k, count: v }));
}