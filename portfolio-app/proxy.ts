import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "site_admin_session";

/**
 * Gerbang cepat di edge: kalau tidak ada cookie sesi sama sekali, langsung
 * lempar ke /admin/login. Ini BUKAN validasi penuh (butuh DB) - validasi
 * peran/role & sesi valid tetap dilakukan ulang di setiap API route lewat
 * requireRole(). Middleware ini cuma mengurangi request sia-sia ke dashboard.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  if (!isAdminPage) return NextResponse.next();

  const hasSession = request.cookies.has(COOKIE_NAME);
  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
