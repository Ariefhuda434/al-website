"use client";
import { useContent } from "./ContentProvider";

export default function Projects() {
  const { content, loading } = useContent();
  const p = content.projects as { heading?: string; sub?: string; items?: string[] };
  const items = p.items ?? [];

  if (loading) {
    return (
      <section id="projects" aria-busy="true" className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-6 h-9 w-40 animate-pulse rounded-lg bg-blush/50" aria-hidden="true" />
        <div className="glass rounded-[2.75rem] p-7 sm:p-10">
          <div className="space-y-4" aria-hidden="true">
            <div className="h-5 w-2/3 animate-pulse rounded bg-blush/40" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-blush/30" />
            <div className="h-5 w-3/5 animate-pulse rounded bg-blush/30" />
          </div>
          <span className="sr-only">Memuat section Sedang…</span>
        </div>
      </section>
    );
  }
  if (items.length === 0 && !p.heading) return null;

  return (
    <section id="projects" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-2 text-3xl">{p.heading || "Sedang"}</h2>
      {p.sub ? <p className="mb-8 text-muted">{p.sub}</p> : null}
      <div className="glass rounded-[2.75rem] p-7 sm:p-10">
        {items.length === 0 ? (
          <p className="text-sm text-muted">Belum ada item untuk section ini.</p>
        ) : (
          <div className="relative pl-9 sm:pl-14">
            <div
              aria-hidden="true"
              className="absolute bottom-3 left-[9px] top-3 w-0.5 rounded-full bg-gradient-to-b from-mauve to-berry sm:left-[13px]"
            />
            <ol className="space-y-6">
              {items.map((item, i) => (
                <li key={`${i}-${item.slice(0, 24)}`} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-9 top-6 grid h-5 w-5 place-items-center rounded-full border-2 border-berry bg-cream sm:-left-14 sm:h-7 sm:w-7"
                  >
                    <span className="h-2 w-2 rounded-full bg-berry sm:h-3 sm:w-3" />
                  </span>
                  <article className="flex items-center gap-4 rounded-[1.75rem] border border-white/80 bg-white/65 p-6 shadow-[0_18px_40px_-24px_rgba(139,58,77,0.45)] sm:p-7">
                    <h3 className="text-xl text-ink md:text-2xl">{item}</h3>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

