"use client";
import { useContent } from "./ContentProvider";

export default function Portfolio() {
  const { works, loading } = useContent();
  if (loading) {
    return (
      <section aria-busy="true" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-8 h-9 w-28 animate-pulse rounded-lg bg-blush/50" aria-hidden="true" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl bg-blush/30" aria-hidden="true" />
          ))}
        </div>
        <span className="sr-only">Memuat karya…</span>
      </section>
    );
  }
  if (works.length === 0) return null;
  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-8 text-3xl">Karya</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {works.map((w) => (
          <article key={w.id} className={`glass rounded-3xl p-4 ${w.aspect_class}`}>
            {w.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.image_url} alt={w.title} className="mb-3 h-40 w-full rounded-2xl object-cover" />
            ) : null}
            <h3 className="text-lg font-semibold">{w.title}</h3>
            <p className="text-sm text-muted">{w.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
