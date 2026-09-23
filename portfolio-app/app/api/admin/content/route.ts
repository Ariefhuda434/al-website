export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole, logEvent } from "../../../../lib/auth";
import { query, execute } from "../../../../lib/db";
import { DEFAULT_CONTENT } from "../../../../lib/defaultContent";
import { assertSameOrigin } from "../../../../lib/csrf";
import { validateSection } from "../../../../lib/validate";

type Row = { content_key: string; content_json: unknown; draft_json: unknown; draft_at: string | null };

/** Semua konten + draft (kalau ada), untuk ditampilkan di editor admin. */
export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const rows = await query<Row>(`SELECT content_key, content_json, draft_json, draft_at FROM site_content`);
  const byKey = new Map(rows.map((r) => [r.content_key, r]));

  const result: Record<string, { published: unknown; draft: unknown | null; draftAt: string | null }> = {};
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const row = byKey.get(key);
    result[key] = {
      published: row?.content_json ?? DEFAULT_CONTENT[key],
      draft: row?.draft_json ?? null,
      draftAt: row?.draft_at ?? null,
    };
  }
  return NextResponse.json({ sections: result });
}

/** Simpan DRAFT (dipakai live-preview & autosave, belum tayang ke publik). */
export async function PUT(request: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as { key?: string; content?: unknown };
  if (!body.key || typeof body.content !== "object" || body.content === null) {
    return NextResponse.json({ error: "key dan content wajib diisi." }, { status: 400 });
  }
  if (!(body.key in DEFAULT_CONTENT)) {
    return NextResponse.json({ error: "Section tidak dikenal." }, { status: 400 });
  }
  const invalid = validateSection(body.key, body.content);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  await execute(
    `INSERT INTO site_content (content_key, content_json, draft_json, draft_by, draft_at)
     VALUES (?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE draft_json = VALUES(draft_json), draft_by = VALUES(draft_by), draft_at = NOW()`,
    [body.key, JSON.stringify(DEFAULT_CONTENT[body.key]), JSON.stringify(body.content), guard.user.id],
  );

  return NextResponse.json({ ok: true, previewUrl: `/admin/preview/${body.key}` });
}

/** Publish: draft jadi konten resmi yang tayang di situs. */
export async function POST(request: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as { key?: string; content?: unknown };
  if (!body.key || !(body.key in DEFAULT_CONTENT)) {
    return NextResponse.json({ error: "Section tidak dikenal." }, { status: 400 });
  }
  // Kalau content dikirim langsung, publish itu; kalau tidak, publish draft yang tersimpan.
  let toPublish = body.content;
  if (toPublish === undefined) {
    const row = await query<Row>(`SELECT draft_json FROM site_content WHERE content_key = ?`, [body.key]);
    toPublish = row[0]?.draft_json ?? null;
    if (toPublish === null) {
      return NextResponse.json({ error: "Tidak ada draft untuk di-publish." }, { status: 400 });
    }
  }
  const invalid = validateSection(body.key, toPublish);
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 });
  }

  await execute(
    `INSERT INTO site_content (content_key, content_json, updated_by)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), updated_by = VALUES(updated_by),
       draft_json = NULL, draft_by = NULL, draft_at = NULL`,
    [body.key, JSON.stringify(toPublish), guard.user.id],
  );
  await execute(
    `INSERT INTO site_content_history (content_key, content_json, saved_by) VALUES (?, ?, ?)`,
    [body.key, JSON.stringify(toPublish), guard.user.id],
  );
  await logEvent({ admin_id: guard.user.id, action: "content_publish", result: "success", detail: body.key, request });

  return NextResponse.json({ ok: true });
}

/** Buang draft tanpa publish. */
export async function DELETE(request: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const key = new URL(request.url).searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key wajib diisi." }, { status: 400 });
  if (!(key in DEFAULT_CONTENT)) {
    return NextResponse.json({ error: "Section tidak dikenal." }, { status: 400 });
  }

  await execute(`UPDATE site_content SET draft_json = NULL, draft_by = NULL, draft_at = NULL WHERE content_key = ?`, [key]);
  return NextResponse.json({ ok: true });
}
