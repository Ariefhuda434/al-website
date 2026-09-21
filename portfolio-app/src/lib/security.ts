import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "./firebaseConfig";

export const OWNER_EMAIL = "nisaalmaghirah@gmail.com";

const SUS_RE =
  /(\b(union|select|insert|update|delete|drop|alter|create|exec|xp_|sleep\s*\(|waitfor\s+delay|information_schema)\b|\btable\b|\bwhere\b|or\s+['"]?\d+\s*=\s*\d+|--|;|\/\*|\*\/|<\s*script|javascript\s*:\s*)/i;

export function isSuspiciousInput(...inputs: (string | null | undefined)[]) {
  return inputs.some((i) => typeof i === "string" && SUS_RE.test(i));
}

export async function auditMeta(): Promise<{ ip: string; ua: string }> {
  try {
    const r = await fetch("/api/admin-audit");
    const j = await r.json();
    return { ip: String(j?.ip ?? "?"), ua: String(j?.ua ?? "") };
  } catch {
    return { ip: "?", ua: typeof navigator !== "undefined" ? navigator.userAgent : "" };
  }
}

type LogEntry = {
  action: string;
  email?: string;
  result?: "success" | "failed" | "denied" | "attempt";
  detail?: string;
  suspicious?: boolean;
  level?: "info" | "warn" | "blocked";
};

export async function logAdmin(entry: LogEntry) {
  try {
    if (!isFirebaseConfigured) return;
    const db = getFirebaseDb();
    const { ip, ua } = await auditMeta();
    await addDoc(collection(db, "adminLogs"), {
      ts: serverTimestamp(),
      date: new Date().toISOString().slice(0, 10),
      action: entry.action,
      email: entry.email ?? null,
      result: entry.result ?? "attempt",
      detail: String(entry.detail ?? "").slice(0, 600),
      suspicious: Boolean(entry.suspicious ?? false),
      level: entry.level ?? "info",
      ip: ip || null,
      ua: ua.slice(0, 300),
    });
  } catch {
    /* logging must never break the app */
  }
}

export async function isAllowedAdmin(email: string): Promise<boolean> {
  if (!isFirebaseConfigured) return false;
  try {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, "adminSettings", "main"));
    const data = snap.data();
    if (!data) return email === OWNER_EMAIL;
    const list = Array.isArray(data.allowedEmails) ? data.allowedEmails : [];
    const owner = String(data.owner ?? OWNER_EMAIL);
    return email === owner || list.includes(email);
  } catch {
    return false;
  }
}