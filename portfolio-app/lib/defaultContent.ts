/**
 * Konten default/fallback. Dipakai kalau tabel site_content belum diisi admin.
 * Semua field ini yang nanti diedit lewat panel admin (bukan hardcode di komponen).
 */
export const DEFAULT_CONTENT: Record<string, Record<string, unknown>> = {
  site: {
    name: "Nama Kamu",
    tagline: "Public speaker · MC · Desainer",
    description: "Ganti deskripsi ini dari panel admin.",
    url: "https://example.com",
  },
  hero: {
    heading: "Halo, saya [Nama]",
    subheading: "Isi ini dari panel admin → Konten → Hero.",
    ctaLabel: "Hubungi saya",
    ctaHref: "#contact",
  },
  about: {
    heading: "Tentang Saya",
    body: "Tulis cerita singkat tentang dirimu di sini.",
    photoUrl: "",
  },
  skills: { heading: "Keahlian", items: [] },
  organizations: { heading: "Organisasi", items: [] },
  testimonials: { heading: "Testimoni", items: [] },
  projects: {
    heading: "Sedang",
    sub: "yang sedang aku kerjakan belakangan ini",
    items: [
      "menyelesaikan studi di Fakultas Kesehatan Masyarakat",
      "menerima pesanan bunga kawat bulu",
      "belajar desain dan editing video",
      "membawakan acara kampus",
      "membaca satu novel setiap bulan",
    ],
  },
  contact: {
    heading: "Kontak",
    email: "",
    phone: "",
    instagram: "",
    linkedin: "",
  },
  download: { heading: "Unduh CV", fileUrl: "", label: "Download CV" },
};

export const CONTENT_KEYS = Object.keys(DEFAULT_CONTENT);
