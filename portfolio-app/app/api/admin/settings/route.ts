export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole, logEvent } from "../../../../lib/auth";
import { queryOne, execute } from "../../../../lib/db";
import { assertSameOrigin } from "../../../../lib/csrf";

type Row = { setting_value: unknown };

export async function GET() {
  const guard = await requireRole("admin");
  if ("error" in guard) return guard.error;
  const row = await queryOne<Row>(`SELECT setting_value FROM site_settings WHERE setting_key = 'general'`);
  return NextResponse.json(row?.setting_value ?? { siteName: "", ownerEmail: "" });
}

/** Hanya superadmin yang boleh ubah pengaturan situs (mis. owner email). */
export async function POST(request: Request) {
  const guard = await requireRole("superadmin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as { siteName?: unknown; ownerEmail?: unknown };
  if (body.siteName !== undefined && (typeof body.siteName !== "string" || body.siteName.length > 120)) {
    return NextResponse.json({ error: "Nama situs tidak valid." }, { status: 400 });
  }
  if (body.ownerEmail !== undefined && (typeof body.ownerEmail !== "string" || body.ownerEmail.length > 190)) {
    return NextResponse.json({ error: "Email pemilik tidak valid." }, { status: 400 });
  }
  await execute(
    `INSERT INTO site_settings (setting_key, setting_value) VALUES ('general', ?)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    [JSON.stringify(body)],
  );
  await logEvent({ admin_id: guard.user.id, action: "settings_update", result: "success", request });
  return NextResponse.json({ ok: true });
}
