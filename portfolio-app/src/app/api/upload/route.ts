import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: Boolean(process.env.BLOB_STORE_ID) });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get("filename") || "upload")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 120);

  const body = request.body;
  if (!body) {
    return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
  }

  try {
    const blob = await put(name, body, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}