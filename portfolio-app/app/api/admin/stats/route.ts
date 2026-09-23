export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole } from "../../../../lib/auth";
import { query, execute } from "../../../../lib/db";
import { assertSameOrigin } from "../../../../lib/csrf";

type ViewRow = { visit_date: string; c: number };
type ClickRow = { label: string | null; c: number };
type Totals = { views: number; clicks: number; today: number };

export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;

  const [totals] = await query<Totals>(
    `SELECT
       SUM(event_type='view') AS views,
       SUM(event_type='click') AS clicks,
       SUM(event_type='view' AND visit_date = CURDATE()) AS today
     FROM visit_stats`,
  );

  const daily = await query<ViewRow>(
    `SELECT visit_date, COUNT(*) AS c FROM visit_stats
     WHERE event_type = 'view' AND visit_date >= CURDATE() - INTERVAL 30 DAY
     GROUP BY visit_date ORDER BY visit_date ASC`,
  );

  const topClicks = await query<ClickRow>(
    `SELECT COALESCE(label, '(tanpa label)') AS label, COUNT(*) AS c
     FROM visit_stats WHERE event_type = 'click'
     GROUP BY label ORDER BY c DESC LIMIT 10`,
  );

  const recent = await query(
    `SELECT ts, visit_date, event_type, path, label FROM visit_stats ORDER BY id DESC LIMIT 40`,
  );

  return NextResponse.json({
    totalViews: totals?.views ?? 0,
    totalClicks: totals?.clicks ?? 0,
    viewsToday: totals?.today ?? 0,
    daily,
    topClicks,
    recent,
  });
}

export async function DELETE(request: Request) {
  const guard = await requireRole("superadmin"); // hapus statistik = aksi sensitif, khusus superadmin
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;
  await execute(`DELETE FROM visit_stats`);
  return NextResponse.json({ ok: true });
}
