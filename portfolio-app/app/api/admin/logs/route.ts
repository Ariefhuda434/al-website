export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { query } from "../../../../lib/db";

type LogRow = {
  id: number; ts: number; admin_id: number | null; action: string;
  result: string | null; detail: string | null; level: string; suspicious: number;
};

export async function GET() {
  // Log berisi jejak aktivitas admin lain -> hanya superadmin yang boleh lihat semua.
  const guard = await requireRole("superadmin");
  if ("error" in guard) return guard.error;

  const list = await query<LogRow>(
    `SELECT l.id, l.ts, l.admin_id, a.email AS admin_email, l.action, l.result, l.detail, l.level, l.suspicious
     FROM admin_logs l LEFT JOIN admins a ON a.id = l.admin_id
     ORDER BY l.id DESC LIMIT 200`,
  );
  const blocked = list.filter((l) => l.suspicious || l.level === "blocked").length;
  const failed = list.filter((l) => l.result === "failed").length;

  return NextResponse.json({ total: list.length, blocked, failed, list });
}
