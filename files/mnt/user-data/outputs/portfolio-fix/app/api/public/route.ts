export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { PATHS, readJSON } from "../../../lib/blobStore";

type Work = Record<string, unknown> & { order?: number };

/** Dibaca oleh ContentProvider di sisi klien. Tidak butuh autentikasi. */
export async function GET() {
  const [content, works] = await Promise.all([
    readJSON<Record<string, unknown>>(PATHS.content, {}),
    readJSON<Work[]>(PATHS.works, []),
  ]);

  const list = Array.isArray(works) ? works : [];
  list.sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999));

  return NextResponse.json(
    { content, works: list },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
