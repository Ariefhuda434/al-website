/**
 * Deskripsi field per section → dipakai SectionForm di panel admin.
 * Tipe field: text | textarea | url | list (string[]) | listObject (objek bersub-field)
 */

export type ListObjectField = { name: string; label: string; max?: number };

export type FieldDesc =
  | { name: string; label: string; type: "text" | "textarea" | "url"; max?: number }
  | { name: string; label: string; type: "list"; maxItems?: number; maxLen?: number }
  | { name: string; label: string; type: "listObject"; maxItems?: number; fields: ListObjectField[] };

export type SectionSchema = {
  title: string;
  fields: FieldDesc[];
};

export const SECTION_SCHEMA: Record<string, SectionSchema> = {
  site: {
    title: "Info situs",
    fields: [
      { name: "name", label: "Nama", type: "text", max: 120 },
      { name: "tagline", label: "Tagline", type: "text", max: 200 },
      { name: "description", label: "Deskripsi", type: "textarea", max: 500 },
      { name: "url", label: "URL", type: "url", max: 300 },
    ],
  },
  hero: {
    title: "Hero",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 200 },
      { name: "subheading", label: "Subjudul", type: "textarea", max: 400 },
      { name: "ctaLabel", label: "Teks tombol", type: "text", max: 80 },
      { name: "ctaHref", label: "Link tombol", type: "url", max: 300 },
    ],
  },
  about: {
    title: "Tentang",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      { name: "body", label: "Cerita", type: "textarea", max: 2000 },
      { name: "photoUrl", label: "URL foto", type: "url", max: 600 },
    ],
  },
  skills: {
    title: "Keahlian",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      {
        name: "items",
        label: "Daftar keahlian",
        type: "listObject",
        maxItems: 60,
        fields: [
          { name: "name", label: "Nama", max: 80 },
          { name: "level", label: "Level (opsional)", max: 60 },
        ],
      },
    ],
  },
  organizations: {
    title: "Organisasi",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      {
        name: "items",
        label: "Daftar organisasi",
        type: "listObject",
        maxItems: 40,
        fields: [
          { name: "org", label: "Organisasi", max: 160 },
          { name: "role", label: "Peran", max: 160 },
          { name: "emoji", label: "Emoji", max: 8 },
        ],
      },
    ],
  },
  testimonials: {
    title: "Testimoni",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      {
        name: "items",
        label: "Daftar testimoni",
        type: "listObject",
        maxItems: 40,
        fields: [
          { name: "quote", label: "Kutipan", max: 500 },
          { name: "name", label: "Nama", max: 100 },
        ],
      },
    ],
  },
  projects: {
    title: "Sedang",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      { name: "sub", label: "Subjudul", type: "text", max: 300 },
      { name: "items", label: "Daftar kegiatan", type: "list", maxItems: 40, maxLen: 200 },
    ],
  },
  contact: {
    title: "Kontak",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      { name: "email", label: "Email", type: "text", max: 190 },
      { name: "phone", label: "Telepon", type: "text", max: 40 },
      { name: "instagram", label: "Instagram", type: "text", max: 80 },
      { name: "linkedin", label: "LinkedIn", type: "url", max: 200 },
    ],
  },
  download: {
    title: "Unduh CV",
    fields: [
      { name: "heading", label: "Judul", type: "text", max: 120 },
      { name: "fileUrl", label: "URL file", type: "url", max: 600 },
      { name: "label", label: "Teks tombol", type: "text", max: 80 },
    ],
  },
};
