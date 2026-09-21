import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "../../../lib/blobStore";

const PATH = "data/log.json";
const MAX = 1000;

type Log = {
  ts: number;
  action: string;
  email?: string;
  result?: string;
  detail?: string;
  suspicious?: boolean;
  level?: string;
  ip?: string;
  ua?: string;
};

export async function GET() {
  const logs = await readJSON<Log[]>(PATH, []);
  const list = (Array.isArray(logs) ? logs : []).slice().reverse();
  const blocked = list.filter((l) => l.suspicious || l.level === "blocked").length;
  const failed = list.filter((l) => l.result === "failed").length;
  const denied = list.filter((l) => l.result === "denied").length;
  const success = list.filter((l) => l.result === "success").length;
  return NextResponse.json({
    total: list.length,
    blocked,
    failed,
    denied,
    success,
    list: list.slice(0, 150),
  });
}

export async function POST(request: Request) {
  try {
    const fwd = request.headers.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "";
    const ua = request.headers.get("user-agent") || "";
    const body = (await request.json().catch(() => ({}))) as Partial<Log>;
    const db = await readJSON<Log[]>(PATH, []);
    const list = Array.isArray(db) ? db : [];
    const entry: Log = {
      ts: Date.now(),
      action: String(body.action ?? "event").slice(0, 60),
      email: typeof body.email === "string" ? body.email.slice(0, 120) : undefined,
      result: typeof body.result === "string" ? body.result.slice(0, 30) : undefined,
      detail: typeof body.detail === "string" ? body.detail.slice(0, 500) : undefined,
      suspicious: Boolean(body.suspicious),
      level: typeof body.level === "string" ? body.level.slice(0, 20) : "info",
      ip: ip || undefined,
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