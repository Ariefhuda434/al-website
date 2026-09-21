"use client";

import { ArrowUp, Heart } from "lucide-react";
import { getChannels } from "@/lib/channels";
import { nav, site } from "@/lib/content";
import ChannelIcon from "./ChannelIcon";
import { FlowerHead } from "./Flower";

/** Pita teks berjalan pelan. Dekoratif, jadi disembunyikan dari pembaca layar. */
function MottoBand() {
  const half = (
    <div className="flex shrink-0 items-center">
      {[0, 1].map((r) =>
        site.motto.map((m) => (
          <span key={`${r}-${m}`} className="flex items-center">
            <span className="px-6 md:px-9">{m}</span>
            <FlowerHead tone="mauve" petals={7} className="h-9 w-9 animate-spin-slow md:h-12 md:w-12" />
          </span>
        )),
      )}
    </div>
  );
  return (
    <div aria-hidden="true" className="overflow-hidden py-6">
      <div className="-rotate-1 scale-[1.04] border-y border-white/80 bg-blush/60 py-4 backdrop-blur-sm">
        <div className="flex w-max animate-marquee whitespace-nowrap font-display text-4xl italic text-ink md:text-6xl">
          {half}
          {half}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const channels = getChannels();
  return (
    <footer className="relative overflow-x-clip pt-10">
      <MottoBand />

      <div className="px-5 pb-10 pt-12 sm:px-8"><div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <a href="#hero" className="inline-flex items-center gap-3 font-display text-3xl text-ink">
              <FlowerHead tone="mauve" petals={8} className="h-11 w-11 animate-spin-slow" />
              {site.name}
            </a>
            <p className="mt-4 max-w-xs font-display text-xl italic text-muted">{site.motto.join(", ")}.</p>
          </div>

          <nav aria-label="Jelajahi">
            <h2 className="text-xl text-ink">Jelajahi</h2>
            <ul className="mt-3">
              {nav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="group inline-flex min-h-11 items-center text-berry transition-colors hover:text-ink"
                  >
                    <span className="h-0.5 w-0 rounded-full bg-berry transition-all duration-300 group-hover:mr-2 group-hover:w-4" aria-hidden="true" />
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="group inline-flex min-h-11 items-center text-berry transition-colors hover:text-ink">
                  <span className="h-0.5 w-0 rounded-full bg-berry transition-all duration-300 group-hover:mr-2 group-hover:w-4" aria-hidden="true" />
                  Kontak
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xl text-ink">Terhubung</h2>
            {channels.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-3">
                {channels.map((c) => (
                  <li key={c.kind}>
                    <a
                      href={c.href}
                      target={c.kind === "email" ? undefined : "_blank"}
                      rel={c.kind === "email" ? undefined : "noopener noreferrer"}
                      aria-label={`${c.label}: ${c.handle}`}
                      className="glass-soft grid h-12 w-12 place-items-center rounded-full text-berry transition duration-300 hover:-translate-y-1 hover:bg-berry hover:text-cream"
                    >
                      <ChannelIcon kind={c.kind} className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-berry">Kirim pesan lewat form di bagian kontak.</p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-berry/15 pt-8 sm:flex-row">
          <p className="flex flex-wrap items-center justify-center gap-x-2 text-center text-berry">
            <span>
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {site.name}.
            </span>
            <span className="inline-flex items-center gap-1.5">
              Dibuat dengan
              <Heart className="h-4 w-4 animate-heartbeat fill-berry text-berry" aria-label="cinta" role="img" />
            </span>
          </p>
          <a
            href="#hero"
            aria-label="Kembali ke atas"
            className="glass group grid h-12 w-12 place-items-center rounded-full text-berry transition duration-300 hover:-translate-y-1 hover:bg-berry hover:text-cream"
          >
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
}
