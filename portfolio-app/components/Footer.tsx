"use client";
import { useContent } from "./ContentProvider";

export default function Footer() {
  const { content } = useContent();
  const site = content.site as { name?: string };
  return (
    <footer className="px-6 py-10 text-center text-sm text-muted">
      © {new Date().getFullYear()} {site.name || "Nama Kamu"}. Semua hak dilindungi.
    </footer>
  );
}
