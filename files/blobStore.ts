import { list, put } from "@vercel/blob";

const token = process.env.BLOB_READ_WRITE_TOKEN;

/** Cache URL blob supaya tidak memanggil list() berulang kali. */
const urlCache = new Map<string, string>();

async function resolveUrl(path: string): Promise<string | null> {
  const cached = urlCache.get(path);
  if (cached) return cached;
  try {
    const { blobs } = await list({ prefix: path, limit: 1, token });
    const hit = blobs.find((b) => b.pathname === path) ?? blobs[0];
    if (!hit) return null;
    urlCache.set(path, hit.url);
    return hit.url;
  } catch {
    return null;
  }
}

export async function readJSON<T>(path: string, fallback: T): Promise<T> {
  if (!token) return fallback;
  try {
    const url = await resolveUrl(path);
    if (!url) return fallback;
    const res = await fetch(`${url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) {
      urlCache.delete(path);
      return fallback;
    }
    const data = (await res.json()) as T;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

export async function writeJSON<T>(path: string, data: T): Promise<void> {
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN belum diset di environment Vercel.");
  const { url } = await put(path, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
    token,
  });
  urlCache.set(path, url);
}

export const PATHS = {
  content: "data/content.json",
  works: "data/works.json",
  stats: "data/stats.json",
  log: "data/log.json",
  settings: "data/settings.json",
} as const;
