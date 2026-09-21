import { NextResponse } from "next/server";

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
  const o: Record<string, any> = {};
  for (const k of Object.keys(fields || {})) {
    try {
      o[k] = v(fields[k]);
    } catch {
      o[k] = null;
    }
  }
  return o;
}

export async function GET() {
  if (!PROJECT || !KEY) return NextResponse.json({ content: null, works: [] });
  try {
    const [cres, wres] = await Promise.all([
      fetch(`${BASE}/content/main?key=${encodeURIComponent(KEY)}`, { cache: "no-store" }),
      fetch(`${BASE}/works?key=${encodeURIComponent(KEY)}`, { cache: "no-store" }),
    ]);

    let content: Record<string, any> = {};
    if (cres.ok) {
      const j = await cres.json();
      const d = j.fields ?? j.document?.fields ?? j.documents?.[0]?.fields ?? {};
      content = fieldsToObj(d);
    }

    const works: any[] = [];
    if (wres.ok) {
      const wj = await wres.json();
      for (const d of wj.documents ?? []) {
        works.push({ id: d.name.split("/").pop(), ...fieldsToObj(d.fields) });
      }
      works.sort((a, b) => Number(a.order ?? 9999) - Number(b.order ?? 9999));
    }

    return NextResponse.json({ content, works }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json({ content: null, works: [] });
  }
}