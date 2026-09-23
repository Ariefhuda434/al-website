export const dynamic = "force-dynamic";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireRole, logEvent } from "../../../../lib/auth";
import { execute } from "../../../../lib/db";
import { assertSameOrigin } from "../../../../lib/csrf";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "application/pdf", "audio/mpeg"];

/** File biner (gambar/pdf/audio) tetap disimpan di Vercel Blob; MySQL cuma catat metadatanya. */
export async function POST(request: Request) {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Tidak ada berkas yang dikirim." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Ukuran berkas maksimal 8 MB." }, { status: 413 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Format tidak didukung." }, { status: 415 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "BLOB_READ_WRITE_TOKEN belum diatur di server." }, { status: 503 });
  }

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60);
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const { url } = await put(`uploads/${id}-${safe}`, file, {
    access: "public",
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  await execute(
    `INSERT INTO uploads (id, url, original_name, content_type, size_bytes, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, url, safe, file.type, file.size, guard.user.id],
  );
  await logEvent({ admin_id: guard.user.id, action: "upload", result: "success", detail: safe, request });

  return NextResponse.json({ ok: true, url });
}
