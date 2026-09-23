import { DEFAULT_CONTENT } from "./defaultContent";

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function checkString(v: unknown, max: number, label: string): string | null {
  if (typeof v !== "string") return `${label} harus berupa teks.`;
  if (v.length > max) return `${label} maksimal ${max} karakter.`;
  return null;
}

function checkStringArray(v: unknown, maxItems: number, maxLen: number, label: string): string | null {
  if (!Array.isArray(v)) return `${label} harus berupa daftar.`;
  if (v.length > maxItems) return `${label} maksimal ${maxItems} item.`;
  for (let i = 0; i < v.length; i++) {
    const err = checkString(v[i], maxLen, `${label}[${i + 1}]`);
    if (err) return err;
  }
  return null;
}

function checkObjectArray(
  v: unknown,
  maxItems: number,
  fields: { name: string; max: number }[],
  label: string,
): string | null {
  if (!Array.isArray(v)) return `${label} harus berupa daftar.`;
  if (v.length > maxItems) return `${label} maksimal ${maxItems} item.`;
  for (let i = 0; i < v.length; i++) {
    const row = v[i];
    if (!isPlainObject(row)) return `${label}[${i + 1}] harus berupa objek.`;
    for (const f of fields) {
      const val = row[f.name];
      if (val === undefined || val === null) continue;
      const err = checkString(val, f.max, `${label}[${i + 1}].${f.name}`);
      if (err) return err;
    }
  }
  return null;
}

/** Validasi struktur section sebelum disimpan. Return pesan error atau null. */
export function validateSection(key: string, content: unknown): string | null {
  if (!(key in DEFAULT_CONTENT)) return "Section tidak dikenal.";
  if (!isPlainObject(content)) return "Content harus berupa objek.";

  // Tolak key yang tidak dikenal di dalam payload (strict).
  const allowed = Object.keys(DEFAULT_CONTENT[key] ?? {});
  for (const k of Object.keys(content)) {
    if (!allowed.includes(k)) return `Field tidak dikenal: ${k}`;
  }

  switch (key) {
    case "site":
      return (
        checkString(content.name ?? "", 120, "Nama situs") ??
        checkString(content.tagline ?? "", 200, "Tagline") ??
        checkString(content.description ?? "", 500, "Deskripsi") ??
        checkString(content.url ?? "", 300, "URL") ??
        null
      );
    case "hero":
      return (
        checkString(content.heading ?? "", 200, "Heading") ??
        checkString(content.subheading ?? "", 400, "Subheading") ??
        checkString(content.ctaLabel ?? "", 80, "Label CTA") ??
        checkString(content.ctaHref ?? "", 300, "Link CTA") ??
        null
      );
    case "about":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkString(content.body ?? "", 2000, "Isi") ??
        checkString(content.photoUrl ?? "", 600, "URL foto") ??
        null
      );
    case "skills":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkObjectArray(content.items ?? [], 60, [{ name: "name", max: 80 }, { name: "level", max: 60 }], "Skills") ??
        null
      );
    case "organizations":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkObjectArray(
          content.items ?? [],
          40,
          [{ name: "org", max: 160 }, { name: "role", max: 160 }, { name: "emoji", max: 8 }],
          "Organisasi",
        ) ?? null
      );
    case "testimonials":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkObjectArray(content.items ?? [], 40, [{ name: "quote", max: 500 }, { name: "name", max: 100 }], "Testimoni") ??
        null
      );
    case "contact":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkString(content.email ?? "", 190, "Email") ??
        checkString(content.phone ?? "", 40, "Telepon") ??
        checkString(content.instagram ?? "", 80, "Instagram") ??
        checkString(content.linkedin ?? "", 200, "LinkedIn") ??
        null
      );
    case "download":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkString(content.fileUrl ?? "", 600, "URL file") ??
        checkString(content.label ?? "", 80, "Label") ??
        null
      );
    case "projects":
      return (
        checkString(content.heading ?? "", 120, "Heading") ??
        checkString(content.sub ?? "", 300, "Sub") ??
        checkStringArray(content.items ?? [], 40, 200, "Item projects") ??
        null
      );
    default:
      return null;
  }
}

export function validateEmail(email: string): string | null {
  const e = email.trim();
  if (!e || e.length > 190) return "Email tidak valid.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Format email tidak valid.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 10) return "Kata sandi minimal 10 karakter.";
  if (password.length > 200) return "Kata sandi terlalu panjang.";
  return null;
}
