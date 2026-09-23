"use client";
import { useContent } from "./ContentProvider";

export default function Testimonials() {
  const { content, loading } = useContent();
  const t = content.testimonials as { heading?: string; items?: { quote: string; name?: string }[] };
  const items = t.items ?? [];
  if (loading) {
    return (
      <section aria-busy="true" className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-6 h-9 w-40 animate-pulse rounded-lg bg-blush/50" aria-hidden="true" />
        <div className="grid gap-4 sm:grid-cols-2" aria-hidden="true">
          <div className="h-32 animate-pulse rounded-3xl bg-blush/30" />
          <div className="h-32 animate-pulse rounded-3xl bg-blush/30" />
        </div>
        <span className="sr-only">Memuat testimoni…</span>
      </section>
    );
  }
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-6 text-3xl">{t.heading || "Testimoni"}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <blockquote key={i} className="glass-soft rounded-3xl p-6 italic">
            &quot;{it.quote}&quot;
            {it.name ? <footer className="mt-3 not-italic font-semibold">— {it.name}</footer> : null}
          </blockquote>
        ))}
      </div>
    </section>
  );
}
