"use client";
import { useContent } from "./ContentProvider";

export default function About() {
  const { content, loading } = useContent();
  const about = content.about as { heading?: string; body?: string; photoUrl?: string };
  if (loading) {
    return (
      <section id="about" aria-busy="true" className="mx-auto max-w-4xl px-6 py-20">
        <div className="mb-6 h-9 w-44 animate-pulse rounded-lg bg-blush/50" aria-hidden="true" />
        <div className="glass-soft rounded-3xl p-8" aria-hidden="true">
          <div className="mb-6 h-40 w-40 animate-pulse rounded-full bg-blush/35" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-blush/30" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-blush/30" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-blush/30" />
          </div>
        </div>
        <span className="sr-only">Memuat tentan saya…</span>
      </section>
    );
  }
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-6 text-3xl">{about.heading || "Tentang Saya"}</h2>
      <div className="glass-soft rounded-3xl p-8">
        {about.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={about.photoUrl} alt="" className="mb-6 h-40 w-40 rounded-full object-cover" />
        ) : null}
        <p className="whitespace-pre-line">{about.body || "Tulis cerita singkat tentang dirimu di panel admin."}</p>
      </div>
    </section>
  );
}
