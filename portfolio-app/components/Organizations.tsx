"use client";
import { useContent } from "./ContentProvider";

export default function Organizations() {
  const { content, loading } = useContent();
  const org = content.organizations as { heading?: string; items?: { org?: string; name?: string; role?: string; emoji?: string }[] };
  const items = org.items ?? [];
  if (loading) {
    return (
      <section aria-busy="true" className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-6 h-9 w-40 animate-pulse rounded-lg bg-blush/50" aria-hidden="true" />
        <div className="space-y-3" aria-hidden="true">
          <div className="h-12 animate-pulse rounded-2xl bg-blush/30" />
          <div className="h-12 animate-pulse rounded-2xl bg-blush/30" />
        </div>
        <span className="sr-only">Memuat organisasi…</span>
      </section>
    );
  }
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-6 text-3xl">{org.heading || "Organisasi"}</h2>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="glass-soft rounded-2xl px-5 py-3">
            {it.emoji ? <span aria-hidden="true" className="mr-2">{it.emoji}</span> : null}
            <span className="font-semibold">{it.org || it.name}</span>
            {it.role ? <span className="text-muted"> — {it.role}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
