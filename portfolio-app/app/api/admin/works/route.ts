export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole, logEvent } from "../../../../lib/auth";
import { query, withTransaction } from "../../../../lib/db";
import { assertSameOrigin } from "../../../../lib/csrf";

type WorkInput = {
  id?: string; title?: string; desc?: string; idn?: string; image?: string;
  aspect?: string; tone?: string; order?: number; published?: boolean;
};

function s(v: unknown, max: number, fallback = ""): string {
  return typeof v === "string" ? v.slice(0, max) : fallback;
}

export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const works = await query(
    `SELECT id, title, description AS 'desc', description_id AS idn, image_url AS image,
            aspect_class AS aspect, tone_class AS tone, sort_order AS \`order\`, is_published AS published
     FROM works ORDER BY sort_order ASC`,
  );
  return NextResponse.json({ works });
}

/** Ganti seluruh daftar karya sekaligus (drag-reorder di admin kirim array utuh). */
export async function POST(request: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as { works?: WorkInput[] };
  if (!Array.isArray(body.works)) {
    return NextResponse.json({ error: "works wajib berupa array." }, { status: 400 });
  }
  if (body.works.length > 200) {
    return NextResponse.json({ error: "Terlalu banyak karya (maks 200)." }, { status: 400 });
  }
  for (const w of body.works) {
    if (typeof w !== "object" || w === null) {
      return NextResponse.json({ error: "Item karya tidak valid." }, { status: 400 });
    }
  }

  await withTransaction(async (conn) => {
    await conn.execute(`DELETE FROM works`);
    let i = 0;
    for (const raw of body.works!) {
      i += 1;
      await conn.execute(
        `INSERT INTO works (id, title, description, description_id, image_url, aspect_class, tone_class, sort_order, is_published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s(raw.id, 64) || `w_${Date.now()}_${i}`,
          s(raw.title, 120),
          s(raw.desc, 400),
          s(raw.idn, 400),
          s(raw.image, 600),
          s(raw.aspect, 60, "aspect-[3/4]"),
          s(raw.tone, 80, "from-mauve to-butter"),
          typeof raw.order === "number" ? raw.order : i,
          raw.published === false ? 0 : 1,
        ],
      );
    }
  });

  await logEvent({ admin_id: guard.user.id, action: "works_save", result: "success", detail: `${body.works.length} item`, request });
  return NextResponse.json({ ok: true, savedAt: Date.now() });
}
