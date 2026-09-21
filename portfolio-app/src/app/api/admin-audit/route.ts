import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const fwd = request.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "::1";

  return NextResponse.json({ ip, ua, ts: Date.now() });
}