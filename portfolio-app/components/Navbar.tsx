"use client";
import { useContent } from "./ContentProvider";

export default function Navbar() {
  const { content } = useContent();
  const site = content.site as { name?: string };
  return (
    <header className="glass fixed inset-x-4 top-4 z-50 flex items-center justify-between rounded-full px-5 py-3">
      <a href="#main" className="font-display text-lg font-semibold text-berry">
        {site.name || "Nama Kamu"}
      </a>
      <nav className="hidden gap-6 text-sm font-semibold sm:flex">
        <a href="#about" className="hover:text-berry">Tentang</a>
        <a href="#portfolio" className="hover:text-berry">Karya</a>
        <a href="#contact" className="hover:text-berry">Kontak</a>
      </nav>
    </header>
  );
}
