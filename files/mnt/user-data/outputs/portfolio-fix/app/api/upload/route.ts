export const dynamic = "force-dynamic";

import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdmin } from "../../../lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "application/pdf", "audio/mpeg"];

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Perlu masuk." }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Tidak ada berkas yang dikirim." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Ukuran berkas maksimal 8 MB." }, { status: 413 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Format tidak didukung. Pakai JPG, PNG, WEBP, GIF, PDF, atau MP3." },
        { status: 415 },
      );
    }

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60);
    const { url } = await put(`uploads/${Date.now()}-${safe}`, file, {
      access: "public",
      contentType: file.type,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengunggah." },
      { status: 500 },
    );
  }
}
