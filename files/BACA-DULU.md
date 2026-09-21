# Paket perbaikan — portfolio-app

Semua berkas di folder ini ditempel ke project sesuai jalurnya (timpa yang lama).

```
lib/content.ts                 ← konten default + 14 item "things i love"
lib/blobStore.ts               ← baca/tulis JSON ke Vercel Blob
lib/auth.ts                    ← sesi admin (cookie bertanda tangan)
components/Skills.tsx          ← peta ikon diperluas untuk 14 item
app/admin/page.tsx             ← panel kelola isi situs
app/admin/layout.tsx
app/api/public/route.ts        ← dibaca pengunjung (tanpa login)
app/api/content/route.ts       ← baca & simpan dari panel
app/api/upload/route.ts        ← unggah foto, PDF, MP3
app/api/stats/route.ts         ← catat & tampilkan kunjungan
app/api/admin-auth/route.ts    ← masuk / keluar
```

## 1. Environment variable di Vercel

Settings → Environment Variables, lalu redeploy:

| Nama | Isi |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | otomatis ada setelah Storage → Blob dihubungkan |
| `ADMIN_PASSWORD` | kata sandi pilihan kalian |
| `ADMIN_SECRET` | teks acak panjang, bebas |

Tanpa `ADMIN_PASSWORD`, halaman masuk menolak semua percobaan — ini disengaja.

## 2. Cara pakai panel

Buka `namasitus.vercel.app/admin`, masukkan kata sandi. Semua bagian situs ada tabnya:
beranda, tentang, yang kusuka, karya, sedang, organisasi, handmade, musik, kontak, statistik.
Foto dan MP3 tinggal diunggah dari panel — tidak perlu menaruh berkas ke folder `public` lagi.
Perubahan baru berlaku setelah menekan Simpan, dan halaman utama menyusul dalam ±20 detik.

## 3. Yang diperbaiki di paket ini

- **Data hilang setelah deploy.** `readJSON` lama tidak bisa menemukan berkas blob yang sudah ditulis. Sekarang URL blob dicari lewat `list()` dan di-cache, dan `put` memakai `allowOverwrite` + `cacheControlMaxAge: 0`.
- **`/api/public` dan `/api/stats` tidak ada** padahal `contentContext.tsx` dan `Tracker.tsx` memanggilnya. Keduanya sekarang ada.
- **Panel admin tanpa kunci.** Route penyimpanan kini mengecek cookie bertanda tangan HMAC, dan `/admin` diberi `robots: noindex`.
- **Kunci Firebase di route migrasi.** `NEXT_PUBLIC_FIREBASE_API_KEY` terbaca di sisi klien. Kalau migrasi dari Firestore sudah selesai, hapus `app/api/migrate/route.ts` dan aturan Firestore/Storage.
- **Skill hanya 7 ikon.** Peta ikon diperluas ke 15 nama, dan trik `i === 6` untuk melebarkan kartu diganti aturan yang ikut jumlah item.
- **Dua route hampir identik** (`ip` dan meta pengunjung) — cukup pakai satu, hapus yang lain.
- **Unggahan tanpa batas.** Route unggah membatasi 8 MB dan hanya menerima JPG, PNG, WEBP, GIF, AVIF, PDF, MP3.

## 4. Yang sebaiknya kamu rapikan sendiri

- `MusicPlayer.tsx` memutar lagu otomatis begitu halaman dibuka. Banyak peramban memblokirnya, dan pengunjung umumnya tidak suka. Saran: mulai dalam keadaan jeda.
- `ToastHost` diekspor sebagai named export tapi biasanya dipanggil sebagai default import — samakan salah satu.
- `contentContext.tsx` memanggil `/api/public` setiap 20 detik. Untuk situs portofolio, 5 menit sudah lebih dari cukup dan hemat kuota.
- `Hero.tsx` memakai `<img>` biasa untuk `/images/kartun lucu.png`. Nama berkas dengan spasi rawan bermasalah — ganti jadi `kartun-lucu.png`.
- Tambahkan `app/robots.ts` dan `app/sitemap.ts` sebelum dianggap siap produksi.
