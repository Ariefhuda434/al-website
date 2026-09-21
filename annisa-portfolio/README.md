# Portofolio Annisa Al Maghirah

Next.js (App Router) + Tailwind v4 + framer-motion.

## Jalankan lokal
```bash
npm install
cp .env.example .env.local   # lalu isi nilainya
npm run dev                  # http://localhost:3000
```

## Yang perlu kamu isi
- `public/images/profile.jpg`, `portfolio-1.jpg`, `portfolio-2.jpg`, `portfolio-3.jpg` (kalau belum ada, tampil placeholder bunga)
- `public/cv-annisa.pdf` untuk tombol unduh CV
- `.env.local`: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WA_NUMBER` (mis. 6281234567890), `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_INSTAGRAM`
- Semua teks (nama, skill, proyek, testimoni) ada di `lib/content.ts`

## Deploy ke Vercel
1. Upload proyek ke GitHub.
2. Di vercel.com pilih **Add New > Project**, impor repo tadi.
3. Buka **Settings > Environment Variables**, isi 4 variabel di atas, lalu **Redeploy**.

Cek build produksi sebelum deploy: `npm run build && npm start`.
