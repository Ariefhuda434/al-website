# alvsmitsuri ♡ — Personal Portfolio

Landing page portfolio pribadi bergaya iOS (glassmorphism, pink lembut) dengan musik latar.

## Struktur

- `portfolio-app/` — Aplikasi Next.js (App Router) + Tailwind CSS v4. Satu-satunya aplikasi.

## Tech Stack

- **Frontend:** Next.js + React + Tailwind CSS
- **Database:** Firebase Firestore (konten & data disimpan di koleksi `content/main`, `works`, `visits`, `adminLogs`)
- **Storage:** Firebase Storage (foto profil, foto karya, MP3 lagu)
- **Auth:** Firebase Authentication (Email/Password) untuk `/admin`
- **Hosting / Deploy:** Vercel (auto-deploy dari branch `main`), project `alvmitsuri`, root directory `portfolio-app`

## Setup Lokal

```bash
cd portfolio-app
cp .env.example .env.local   # isi kredensial Firebase
npm install
npm run dev                  # http://localhost:3000
```

## Dashboard Admin

`/admin` — login Firebase (super admin: hanya email yang ada di `adminSettings/main.allowedEmails` + `owner`). Fitur:

- Tab per bagian: Hero · About · Things I Love · Currently · Orgs · Handmade · Kontak · Musik · Karya · Statistik
- Karya: CRUD + drag-and-drop urutan (preview kartu)
- Statistik: pengunjung harian, perangkat, IP, interaksi + log keamanan admin
- Upload foto & MP3 ke Firebase Storage (path tersimpan di Firestore)

## Keamanan

- Login wajib (Firebase Auth) + allowlist super admin
- Semua percobaan login & akses `/admin` dicatat ke `adminLogs` (IP, user-agent, hasil) dengan deteksi pola SQL injection/script
- `firestore.rules` (lihat file) untuk mengetatkan aturan produksi