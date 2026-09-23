/**
 * Sekali jalan: isi dummy konten awal ke MySQL (Aiven).
 * Jalankan: node scripts/seed-dummy.mjs
 */
import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envText = readFileSync(resolve(root, ".env.local"), "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);

if (!env.DATABASE_URL) {
  console.error("DATABASE_URL tidak ditemukan di .env.local");
  process.exit(1);
}

const conn = await mysql.createConnection(env.DATABASE_URL);

try {
  const [[{ c: ac }]] = await conn.query("SELECT COUNT(*) c FROM admins");
  if (Number(ac) === 0) {
    console.warn("⚠ Belum ada admin. Buat superadmin dulu (lihat README).");
  }

  // site_content dari default yang sama dengan lib/defaultContent.ts
  const defaults = {
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

  let sc = 0;
  for (const [key, val] of Object.entries(defaults)) {
    const [r] = await conn.execute(
      `INSERT INTO site_content (content_key, content_json) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content_key = content_key`,
      [key, JSON.stringify(val)],
    );
    sc += r.affectedRows;
  }
  console.log(`✔ site_content: ${sc} baris`);

  const [[{ c: wc }]] = await conn.query("SELECT COUNT(*) c FROM works");
  if (Number(wc) === 0) {
    const works = [
      {
        id: "w1",
        title: "MC Acara Kampus",
        description: "Membawakan acara wisuda fakultas",
        description_id: "Membawakan acara wisuda fakultas",
        image_url: "",
        aspect_class: "aspect-[3/4]",
        tone_class: "from-mauve to-butter",
        sort_order: 1,
      },
      {
        id: "w2",
        title: "Desain Poster Event",
        description: "Poster untuk event komunitas",
        description_id: "Poster untuk event komunitas",
        image_url: "",
        aspect_class: "aspect-[3/4]",
        tone_class: "from-sage to-mist",
        sort_order: 2,
      },
      {
        id: "w3",
        title: "Bunga Kawat Bulu",
        description: "Karya kraft — pesanan bunga kawat bulu",
        description_id: "Karya kraft — pesanan bunga kawat bulu",
        image_url: "",
        aspect_class: "aspect-[3/4]",
        tone_class: "from-butter to-mauve",
        sort_order: 3,
      },
    ];
    for (const w of works) {
      await conn.execute(
        `INSERT INTO works (id, title, description, description_id, image_url, aspect_class, tone_class, sort_order, is_published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [w.id, w.title, w.description, w.description_id, w.image_url, w.aspect_class, w.tone_class, w.sort_order],
      );
    }
    console.log(`✔ works: ${works.length} baris dummy`);
  } else {
    console.log(`ℹ works sudah ada (${wc} baris), skip`);
  }

  const [[{ c: wc2 }]] = await conn.query("SELECT COUNT(*) c FROM works");
  const [[{ c: sc2 }]] = await conn.query("SELECT COUNT(*) c FROM site_content");
  console.log(`Selesai. site_content=${sc2}, works=${wc2}`);
} finally {
  await conn.end();
}
