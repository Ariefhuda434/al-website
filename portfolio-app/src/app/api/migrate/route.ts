import { NextResponse } from "next/server";
import { writeJSON } from "../../../lib/blobStore";

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;

function v(node: any): any {
  if (node == null) return null;
  if ("stringValue" in node) return node.stringValue;
  if ("integerValue" in node) return Number(node.integerValue);
  if ("doubleValue" in node) return Number(node.doubleValue);
  if ("booleanValue" in node) return node.booleanValue;
  if ("timestampValue" in node) return node.timestampValue;
  if ("arrayValue" in node) return (node.arrayValue?.values ?? []).map(v);
  if ("mapValue" in node) return fieldsToObj(node.mapValue?.fields ?? {});
  return null;
}
function fieldsToObj(fields: any): any {
  const o: any = {};
  for (const k of Object.keys(fields || {})) o[k] = v(fields[k]);
  return o;
}

async function readDoc(path: string): Promise<Record<string, any>> {
  const r = await fetch(`${BASE}/${path}?key=${KEY}`, { cache: "no-store" });
  if (!r.ok) return {};
  const j = await r.json();
  const d = j.fields ?? j.document?.fields ?? null;
  return d ? fieldsToObj(d) : {};
}

async function readCol(collection: string): Promise<any[]> {
  const r = await fetch(`${BASE}/${collection}?key=${KEY}`, { cache: "no-store" });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.documents ?? []).map((d: any) => ({ id: d.name.split("/").pop(), ...fieldsToObj(d.fields) }));
}

export async function GET() {
  if (!PROJECT || !KEY) return NextResponse.json({ error: "env Firebase kurang" }, { status: 400 });
  try {
    const [content, works, stats, logs] = await Promise.all([
      readDoc("content/main"),
      readCol("works"),
      readCol("visits"),
      readCol("adminLogs"),
    ]);
    await writeJSON("data/content.json", content);
    await writeJSON(
      "data/works.json",
      works.map((w) => ({
        id: String(w.id),
        title: String(w.title ?? ""),
        desc: String(w.desc ?? ""),
        idn: String(w.idn ?? ""),
        image: String(w.image ?? ""),
        aspect: String(w.aspect ?? "aspect-[3/4]"),
        tone: String(w.tone ?? "from-mauve to-butter"),
        order: Number(w.order ?? 999),
      }))
    );
    await writeJSON(
      "data/stats.json",
      stats.map((s) => ({
        ts: Number(s.ts?.seconds ? s.ts.seconds * 1000 : s.ts ?? Date.now()),
        date: String(s.date ?? ""),
        type: s.type === "click" ? "click" : "view",
        path: String(s.path ?? "/"),
        label: s.label ? String(s.label) : undefined,
        ip: s.ip ? String(s.ip) : undefined,
        ua: s.ua ? String(s.ua) : undefined,
      }))
    );
    await writeJSON(
      "data/log.json",
      logs.map((l) => ({
        ts: Number(l.ts?.seconds ? l.ts.seconds * 1000 : l.ts ?? Date.now()),
        action: String(l.action ?? "event"),
        email: l.email ? String(l.email) : undefined,
        result: l.result ? String(l.result) : undefined,
        detail: l.detail ? String(l.detail) : undefined,
        suspicious: Boolean(l.suspicious),
        level: String(l.level ?? "info"),
        ip: l.ip ? String(l.ip) : undefined,
        ua: l.ua ? String(l.ua) : undefined,
      }))
    );
    return NextResponse.json({
      ok: true,
      migrated: { content: Object.keys(content).length, works: works.length, stats: stats.length, logs: logs.length },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Gagal migrasi" },
      { status: 500 }
    );
  }
}