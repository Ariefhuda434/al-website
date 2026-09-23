# Portfolio App v2 — MySQL (Aiven) + Admin/Superadmin + Live Preview

Rebuild dari versi lama (Vercel Blob JSON) ke MySQL (Aiven), dengan sistem
role admin/superadmin, draft + preview sebelum publish, dan hardening keamanan.

## 1. Setup database (Aiven MySQL)

1. Di dashboard Aiven, ambil **Service URI**, host, port, user, password, dan
   **CA certificate** (tombol "Show"/"Download").
2. Jalankan skema:
   ```bash
   mysql --host=<host> --port=<port> --user=avnadmin -p \
         --ssl-mode=REQUIRED --ssl-ca=ca.pem defaultdb < db/schema.sql
   ```
   (atau paste isi `db/schema.sql` lewat Aiven Console → Query editor)

## 2. Environment variables

Copy `.env.example` → `.env.local` (lokal) atau isi di Vercel → Settings →
Environment Variables (production). **Jangan pernah commit password ke git.**

- `DATABASE_URL` — `mysql://avnadmin:PASSWORD@host:port/defaultdb`
- `DATABASE_CA_CERT_BASE64` — isi file `ca.pem` dari Aiven, di-encode base64:
  `base64 -w0 ca.pem` (Linux) atau `base64 -i ca.pem` (Mac), lalu paste hasilnya.
  Ini penting supaya koneksi TLS benar-benar diverifikasi (bukan cuma dienkripsi).
- `BLOB_READ_WRITE_TOKEN` — tetap dari Vercel Blob, dipakai khusus upload gambar/pdf/audio.
- `IP_HASH_SALT` — string acak sembarang, buat hash IP pengunjung (privasi).
- `SESSION_COOKIE_NAME`, `SESSION_TTL_DAYS` — opsional, ada default.

## 3. Buat akun superadmin pertama

```bash
npm install
DATABASE_URL="mysql://..." DATABASE_CA_CERT_BASE64="..." \
  node scripts/create-superadmin.mjs kamu@email.com "PasswordKuatMinimal10Karakter"
```

## 4. Jalankan

```bash
npm run dev
```

- Situs publik: `/`
- Login admin: `/admin/login`
- Dashboard: `/admin` (tab Konten, Karya, Statistik, Pengaturan, dan khusus
  superadmin: Akun & Log)

## Alur edit konten (dengan preview)

1. Admin buka tab **Konten**, edit section (JSON), klik **Simpan & Preview**.
2. Draft tersimpan (belum tayang), tab baru terbuka menampilkan seluruh situs
   dengan section itu memakai versi draft — sisanya tetap versi live.
3. Kalau sudah cocok, kembali ke dashboard, klik **Publish** → draft jadi
   konten resmi & tercatat di riwayat (`site_content_history`).
4. Kalau tidak jadi, klik **Buang draft**.

## Role

- **admin**: edit konten, works, lihat statistik, lihat pengaturan (read-only).
- **superadmin**: semua hak admin + kelola akun admin lain (buat/nonaktifkan),
  ubah pengaturan situs, lihat log audit, hapus data statistik.

## Keamanan yang sudah ditangani

- Password admin di-hash bcrypt (cost 12), tidak pernah disimpan/ditampilkan plaintext.
- Sesi login: token acak 32-byte, disimpan **hash**-nya saja di DB (`sessions`),
  bisa expire & di-revoke, bukan token statis seperti versi lama.
- Rate limit login (6 percobaan/10 menit per IP+email) + dicatat sebagai `suspicious` di log.
- IP pengunjung/disimpan sebagai **hash**, bukan mentah — mengurangi risiko privasi kalau data bocor.
- Endpoint sensitif (`/api/admin/*`) semua di-guard `requireRole()`, dipisah admin vs superadmin.
- `/admin/*` diberi header `noindex, nofollow` + `Cache-Control: no-store`.
- Middleware edge menolak akses ke halaman admin tanpa cookie sesi sama sekali
  (validasi penuh tetap di server lewat DB).
- Upload dibatasi tipe file & ukuran (8MB), nama file disanitasi.
- `next.config.ts` tidak lagi izinkan `hostname: "**"` untuk gambar remote (versi
  lama membuka SEMUA domain gambar — sudah dipersempit ke domain Blob saja).

## Yang masih perlu kamu isi manual

- Teks asli tiap section (hero, about, dst) — isi lewat panel admin, bukan hardcode.
- Font & warna sudah dibawa dari versi lama (`globals.css`) — sesuaikan lagi kalau perlu.
- Komponen `Projects.tsx` sengaja kosong (placeholder) — kasih tau kalau section
  ini beda dari "Karya/Portfolio" supaya saya buatkan strukturnya.
- Kalau ada komponen/fitur versi lama yang belum sempat saya lihat isinya
  (CursorTrail custom, efek animasi spesifik, dll), kirim filenya, saya sesuaikan.
