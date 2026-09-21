export const OWNER_EMAIL = "nisaalmaghirah@gmail.com";

const SUS_RE =
  /(\b(union|select|insert|update|delete|drop|alter|create|exec|xp_|sleep\(|waitfor|information_schema|where|or\s+1=1)\b|--|;|\/\*|\*\/(\s|$)|['"]\s*(or|and)\s*['"]\d|<\s*script|javascript:\s*)/i;

export function isSuspiciousInput(...inputs: (string | null | undefined)[]): boolean {
  return inputs.some((i) => typeof i === "string" && SUS_RE.test(i));
}

type SS = {
  owner?: string;
  allowedEmails?: string[];
};

let cachedSettings: SS | null = null;

// Super admin: hanya email tertentu yang boleh masuk (di Vercel Blob /api/settings).
export async function isAllowedAdmin(email: string): Promise<boolean> {
  try {
    if (!cachedSettings) {
      const r = await fetch("/api/settings", { cache: "no-store" });
      if (r.ok) cachedSettings = (await r.json()) as SS;
    }
    const s = cachedSettings ?? {};
    const owner = s.owner || OWNER_EMAIL;
    const list = Array.isArray(s.allowedEmails) ? s.allowedEmails : [];
    return email === owner || list.includes(email);
  } catch {
    return email === OWNER_EMAIL;
  }
}

export async function logAdmin(entry: {
  action: string;
  email?: string;
  result?: "success" | "failed" | "denied" | "attempt";
  detail?: string;
  suspicious?: boolean;
  level?: "info" | "warn" | "blocked";
}): Promise<void> {
  try {
    const payload: Record<string, unknown> = {
      action: entry.action,
      email: entry.email ?? undefined,
      result: entry.result ?? "attempt",
      detail: String(entry.detail ?? "").slice(0, 500),
      suspicious: Boolean(entry.suspicious),
      level: entry.level ?? "info",
    };
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* logging never breaks the app */
  }
}