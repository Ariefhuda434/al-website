import Link from "next/link";
import { FlowerHead } from "@/components/Flower";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="glass max-w-lg rounded-[2.5rem] p-10 md:p-14">
        <FlowerHead tone="mauve" petals={8} className="mx-auto h-28 w-28 animate-spin-slow" />
        <h1 className="mt-6 text-5xl text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-4 text-lg text-berry">Alamat yang kamu buka tidak ada atau sudah dipindahkan.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
