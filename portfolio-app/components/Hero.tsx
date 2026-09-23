"use client";
import { useContent } from "./ContentProvider";
import { trackClick } from "./Tracker";

export default function Hero() {
  const { content, loading } = useContent();
  const hero = content.hero as { heading?: string; subheading?: string; ctaLabel?: string; ctaHref?: string };
  if (loading) {
    return (
      <section aria-busy="true" className="flex min-h-[90dvh] flex-col items-center justify-center gap-6 px-6 pt-28 text-center">
        <div className="h-14 w-3/4 max-w-3xl animate-pulse rounded-xl bg-blush/40" aria-hidden="true" />
        <div className="h-6 w-1/2 max-w-xl animate-pulse rounded-lg bg-blush/30" aria-hidden="true" />
        <div className="h-12 w-40 animate-pulse rounded-full bg-mauve/40" aria-hidden="true" />
        <span className="sr-only">Memuat…</span>
      </section>
    );
  }
  return (
    <section className="flex min-h-[90dvh] flex-col items-center justify-center gap-6 px-6 pt-28 text-center">
      <h1 className="max-w-3xl text-4xl sm:text-6xl">{hero.heading || "Halo, saya [Nama]"}</h1>
      <p className="max-w-xl text-lg text-muted">{hero.subheading || "Subjudul singkat tentang dirimu."}</p>
      <a
        href={hero.ctaHref || "#contact"}
        onClick={() => trackClick("hero_cta")}
        className="btn btn-primary btn-shine"
      >
        {hero.ctaLabel || "Hubungi saya"}
      </a>
    </section>
  );
}
