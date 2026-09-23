export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { requireRole, createAdmin, listAdmins, setAdminActive, logEvent } from "../../../../lib/auth";
import { assertSameOrigin } from "../../../../lib/csrf";
import { validateEmail, validatePassword } from "../../../../lib/validate";

/** Kelola akun admin lain. KHUSUS superadmin. */
export async function GET() {
  const guard = await requireRole("superadmin");
  if ("error" in guard) return guard.error;
  const admins = await listAdmins();
  return NextResponse.json({ admins });
}

export async function POST(request: Request) {
  const guard = await requireRole("superadmin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; role?: string };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Email wajib diisi & kata sandi minimal 10 karakter." }, { status: 400 });
  }
  const emailErr = validateEmail(body.email);
  const passErr = validatePassword(body.password);
  if (emailErr || passErr) {
    return NextResponse.json({ error: emailErr || passErr }, { status: 400 });
  }
  const role = body.role === "superadmin" ? "superadmin" : "admin";

  try {
    await createAdmin({ email: body.email, password: body.password, role, createdBy: guard.user.id });
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("Duplicate") ? "Email sudah terdaftar." : "Gagal membuat akun.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  await logEvent({ admin_id: guard.user.id, action: "admin_create", result: "success", detail: body.email, request });
  return NextResponse.json({ ok: true });
}

/** Nonaktifkan/aktifkan admin lain (bukan hapus, demi jejak audit). */
export async function PATCH(request: Request) {
  const guard = await requireRole("superadmin");
  if ("error" in guard) return guard.error;
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;

  const body = (await request.json().catch(() => ({}))) as { id?: number; active?: boolean };
  if (typeof body.id !== "number") {
    return NextResponse.json({ error: "id wajib diisi." }, { status: 400 });
  }
  if (body.id === guard.user.id) {
    return NextResponse.json({ error: "Tidak bisa menonaktifkan akun sendiri." }, { status: 400 });
  }
  await setAdminActive(body.id, body.active !== false);
  await logEvent({ admin_id: guard.user.id, action: "admin_toggle", result: "success", detail: String(body.id), request });
  return NextResponse.json({ ok: true });
}
