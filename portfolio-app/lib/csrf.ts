/**
 * CSRF sederhana untuk route admin: pastikan Origin/Referer (kalau ada)
 * menunjuk ke host yang sama dengan request. Cegah form POST lintas origin.
 */
export function assertSameOrigin(request: Request): Response | null {
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    if (origin === "null") {
      return Response.json({ error: "Origin tidak valid." }, { status: 403 });
    }
    try {
      if (new URL(origin).host !== host) {
        return Response.json({ error: "Origin tidak diizinkan." }, { status: 403 });
      }
    } catch {
      return Response.json({ error: "Origin tidak valid." }, { status: 403 });
    }
    return null;
  }

  if (referer) {
    try {
      if (new URL(referer).host !== host) {
        return Response.json({ error: "Referer tidak diizinkan." }, { status: 403 });
      }
    } catch {
      return Response.json({ error: "Referer tidak valid." }, { status: 403 });
    }
  }

  // Tanpa Origin & Referer: bisa jadi curl/server-to-server.
  // Untuk mutasi admin kita izinkan hanya jika user sudah login (requireRole sudah jalan).
  return null;
}
