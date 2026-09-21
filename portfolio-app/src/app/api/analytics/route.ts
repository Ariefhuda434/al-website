import { type NextRequest, NextResponse } from "next/server";

type VisitMeta = {
  ip: string;
  ua: string;
  browser: string;
  os: string;
  device: "mobile" | "tablet" | "desktop";
};

function parseUa(ua: string): Pick<VisitMeta, "browser" | "os" | "device"> {
  const u = ua.toLowerCase();
  let browser = "Lainnya";
  if (/edg\//.test(u)) browser = "Edge";
  else if (/opr\//.test(u)) browser = "Opera";
  else if (/chrome\//.test(u)) browser = "Chrome";
  else if (/firefox\//.test(u)) browser = "Firefox";
  else if (/safari\//.test(u)) browser = "Safari";

  let os = "Lainnya";
  if (/android/.test(u)) os = "Android";
  else if (/iphone|ipad|ipod/.test(u)) os = "iOS";
  else if (/windows/.test(u)) os = "Windows";
  else if (/mac os x|macintosh/.test(u)) os = "macOS";
  else if (/linux/.test(u)) os = "Linux";

  const device: VisitMeta["device"] = /tablet|ipad/.test(u)
    ? "tablet"
    : /mobile|iphone|android/.test(u)
      ? "mobile"
      : "desktop";

  return { browser, os, device };
}

export async function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const fwd = request.headers.get("x-forwarded-for") || "";
  const ip = fwd.split(",")[0].trim() || request.headers.get("x-real-ip") || "::1";
  const parsed = parseUa(ua);

  return NextResponse.json({ ip, ua, ...parsed, ts: Date.now() });
}