export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { DEFAULT_CONTENT } from "../../../../../lib/defaultContent";

type Row = { content_key: string; content_json: unknown; draft_json: unknown };
type Work = { id: string; title: string; description: string; description_id: string; image_url: string; aspect_class: string; tone_class: string; sort_order: number };

/**
 * Preview gabungan: semua section pakai versi TAYANG, kecuali `key`
 * yang dipakai versi DRAFT-nya. Dipakai oleh /admin/preview/[key].
 */
export async function GET(request: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const key = new URL(request.url).searchParams.get("key");
  const rows = await query<Row>(`SELECT content_key, content_json, draft_json FROM site_content`);
  const byKey = new Map(rows.map((r) => [r.content_key, r]));

  const content: Record<string, unknown> = { ...DEFAULT_CONTENT };
  for (const k of Object.keys(DEFAULT_CONTENT)) {
    const row = byKey.get(k);
    content[k] = row?.content_json ?? DEFAULT_CONTENT[k];
  }
  if (key && byKey.get(key)?.draft_json) {
    content[key] = byKey.get(key)!.draft_json;
  }

  const works = await query<Work>(
    `SELECT id, title, description, description_id, image_url, aspect_class, tone_class, sort_order
     FROM works WHERE is_published = 1 ORDER BY sort_order ASC`,
  );

  return NextResponse.json({ content, works, isPreview: true, previewKey: key });
}
