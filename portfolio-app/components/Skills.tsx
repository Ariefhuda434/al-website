"use client";
import { useContent } from "./ContentProvider";

export default function Skills() {
  const { content, loading } = useContent();
  const skills = content.skills as { heading?: string; items?: { name: string; level?: string }[] };
  const items = skills.items ?? [];
  if (loading) {
    return (
      <section aria-busy="true" className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-6 h-9 w-36 animate-pulse rounded-lg bg-blush/50" aria-hidden="true" />
        <div className="flex flex-wrap gap-3" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-blush/35" />
          ))}
        </div>
        <span className="sr-only">Memuat keahlian…</span>
      </section>
    );
  }
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-6 text-3xl">{skills.heading || "Keahlian"}</h2>
      <ul className="flex flex-wrap gap-3">
        {items.map((it, i) => (
          <li key={i} className="glass-soft rounded-full px-5 py-2 text-sm font-semibold">
            {it.name}{it.level ? ` · ${it.level}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
