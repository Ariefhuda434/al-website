export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";
import { PATHS, readJSON, writeJSON } from "../../../lib/blobStore";

type Work = Record<string, unknown> & { order?: number };

function s(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) return NextResponse.json({ error: "Perlu masuk." }, { status: 401 });
  const [content, works] = await Promise.all([
    readJSON<Record<string, unknown>>(PATHS.content, {}),
    readJSON<Work[]>(PATHS.works, []),
  ]);
  const list = arr<Work>(works).sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999));
  return NextResponse.json({ content, works: list });
}

export async function POST(request: Request) {
  if (!(await isAdmin(request))) return NextResponse.json({ error: "Perlu masuk." }, { status: 401 });

  try {
    const body = (await request.json()) as { content?: unknown; works?: unknown };

    if (body.content && typeof body.content === "object") {
      await writeJSON(PATHS.content, body.content);
    }

    if (Array.isArray(body.works)) {
      const clean = body.works.map((raw, i) => {
        const w = (raw ?? {}) as Record<string, unknown>;
        return {
          id: s(w.id, `w_${Date.now()}_${i}`),
          title: s(w.title).slice(0, 120),
          desc: s(w.desc).slice(0, 400),
          idn: s(w.idn).slice(0, 400),
          image: s(w.image).slice(0, 600),
          aspect: s(w.aspect, "aspect-[3/4]"),
          tone: s(w.tone, "from-mauve to-butter"),
          order: typeof w.order === "number" ? w.order : i + 1,
        };
      });
      await writeJSON(PATHS.works, clean);
    }

    return NextResponse.json({ ok: true, savedAt: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menyimpan." },
      { status: 500 },
    );
  }
}
