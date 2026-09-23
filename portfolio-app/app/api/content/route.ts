export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { DEFAULT_CONTENT } from "../../../lib/defaultContent";

type Row = { content_key: string; content_json: unknown };
type Work = {
  id: string; title: string; description: string; description_id: string;
  image_url: string; aspect_class: string; tone_class: string; sort_order: number;
};

/** Endpoint publik, dibaca oleh ContentProvider di sisi klien. Tanpa auth, read-only. */
export async function GET() {
  try {
    const rows = await query<Row>(`SELECT content_key, content_json FROM site_content`);
    const content: Record<string, unknown> = { ...DEFAULT_CONTENT };
    for (const r of rows) content[r.content_key] = r.content_json;

    const works = await query<Work>(
      `SELECT id, title, description, description_id, image_url, aspect_class, tone_class, sort_order
       FROM works WHERE is_published = 1 ORDER BY sort_order ASC`,
    );

    return NextResponse.json(
      { content, works },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch {
    // Kalau DB sedang down, situs publik tetap tampil dengan konten default
    // daripada menampilkan halaman error ke pengunjung.
    return NextResponse.json({ content: DEFAULT_CONTENT, works: [] });
  }
}
