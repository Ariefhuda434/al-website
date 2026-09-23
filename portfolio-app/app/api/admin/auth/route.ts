export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { login, logout, getSessionUser } from "../../../../lib/auth";
import { assertSameOrigin } from "../../../../lib/csrf";
import { validateEmail } from "../../../../lib/validate";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user });
}

export async function POST(request: Request) {
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;
  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  if (typeof body.email !== "string" || typeof body.password !== "string" || !body.email || !body.password) {
    return NextResponse.json({ error: "Email dan kata sandi wajib diisi." }, { status: 400 });
  }
  if (validateEmail(body.email) || body.password.length > 200) {
    return NextResponse.json({ error: "Email atau kata sandi tidak valid." }, { status: 400 });
  }
  const user = await login(body.email, body.password, request);
  if (!user) {
    return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user });
}

export async function DELETE(request: Request) {
  const csrf = assertSameOrigin(request);
  if (csrf) return csrf;
  await logout();
  return NextResponse.json({ ok: true });
}
