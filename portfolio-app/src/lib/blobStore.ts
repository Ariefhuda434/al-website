import { del, get, put } from "@vercel/blob";

function norm(p: string): string {
  return p.replace(/^\/+/, "").replace(/\/+/g, "/");
}

export async function readJSON<T>(path: string, fallback: T | (() => T)): Promise<T> {
  const stored = () => (typeof fallback === "function" ? (fallback as () => T)() : fallback);
  try {
    const storeId = (process.env.BLOB_STORE_ID || "").replace(/^store_/i, "").toLowerCase();
    if (storeId) {
      const res = await fetch(`https://${storeId}.public.blob.vercel-storage.com/${norm(path)}`, { cache: "no-store" });
      if (res.ok) return (await res.json()) as T;
    }
  } catch {
    /* fallback below */
  }
  try {
    const res = await get(norm(path), { access: "public" });
    if (res && res.statusCode === 200 && res.stream) {
      const text = await new Response(res.stream).text();
      if (text) return JSON.parse(text) as T;
    }
  } catch {
    /* fallback */
  }
  return stored();
}

export async function writeJSON(path: string, data: unknown): Promise<string> {
  const blob = await put(norm(path), JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
  return blob.url;
}

export async function removeBlob(path: string): Promise<void> {
  try {
    await del(norm(path));
  } catch {
    /* ignore */
  }
}