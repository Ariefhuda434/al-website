import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

const QUOTA = 1024 * 1024 * 1024; // 1 GB (plan gratis)

export async function GET() {
  try {
    let usedBytes = 0;
    let count = 0;
    let cursor: string | undefined;
    do {
      const page = await list({ limit: 1000, cursor });
      for (const b of page.blobs) usedBytes += b.size;
      count += page.blobs.length;
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    return NextResponse.json({
      ok: true,
      usedBytes,
      count,
      quota: QUOTA,
      usedMB: +(usedBytes / (1024 * 1024)).toFixed(2),
      quotaMB: 1024,
      percent: Math.min(100, +((usedBytes / QUOTA) * 100).toFixed(2)),
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, usedBytes: 0, count: 0, quota: QUOTA, error: e instanceof Error ? e.message : "err" },
      { status: 400 },
    );
  }
}