"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Bouquet from "./Bouquet";
import { useContent } from "./contentContext";
import { ease } from "./Reveal";

/** Nama tampil huruf demi huruf, naik dari balik topeng dengan pegas. */
function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  let n = 0;
  return (
    <span className="block" aria-hidden="true">
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((ch) => {
              const i = n++;
              return (
                <span key={i} className="-my-[0.18em] inline-block overflow-hidden py-[0.18em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "110%", rotate: 7 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 110, damping: 15, delay: delay + i * 0.04 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              );
            })}
          </span>
          {wi < arr.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { site } = useContent();
  const introLines = site.heroIntro.split("\n");
  const heroTitle = site.heroTitle || `hi, i'm ${site.shortName} ♡`;
  const headline = heroTitle.replace(/\s*[♡♥]+\s*$/u, "").trim();
  // Parallax halus mengikuti mouse (hanya di perangkat dengan mouse)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 18 });
  const sy = useSpring(my, { stiffness: 55, damping: 18 });
  const bouquetX = useTransform(sx, (v) => v * -26);
  const bouquetY = useTransform(sy, (v) => v * -18);
  const discX = useTransform(sx, (v) => v * 22);
  const discY = useTransform(sy, (v) => v * 16);

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center overflow-x-clip px-5 pb-24 pt-28 sm:px-8"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.5 }}
            className="glass-soft mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-berry"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mauve opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-berry" />
            </span>
            {site.heroBadge}
          </motion.p>

          <h1
            aria-label={site.name}
            className="flex flex-wrap items-center justify-center gap-[0.08em] text-[clamp(3.6rem,12vw,8.6rem)] leading-[0.92] tracking-[-0.03em] text-ink"
          >
            <Letters text={headline} delay={0.6} />
            <motion.img
              src="/images/kartun lucu.png"
              alt="♥"
              className="inline-block h-[0.55em] w-[0.55em] translate-y-[0.06em] rounded-[0.28em] object-cover"
              initial={{ opacity: 0, scale: 0, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease, delay: 1.9 }}
            />
          </h1>

          <motion.div
            className="mt-7"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.5 }}
          >
            <p className="max-w-2xl text-lg leading-relaxed text-berry md:text-xl">
              {introLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < introLines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </motion.div>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 1.7 }}
          >
            <a href="#portfolio" className="btn btn-primary btn-shine">
              Lihat karya
            </a>
            <a href="#contact" className="btn btn-glass" data-track="cta-contact-hero">
              Hubungi saya
            </a>
          </motion.div>

          <motion.p
            className="mt-10 font-display text-xl italic text-muted md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 2.1 }}
          >
            {site.motto.join(", ")}.
          </motion.p>
        </div>

        {/* Karangan bunga */}
        <div className="relative mx-auto w-full max-w-[460px]">
          <motion.div
            aria-hidden="true"
            style={{ x: discX, y: discY }}
            className="absolute inset-[-6%] rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.85)_0%,rgb(255_192_203/0.4)_52%,transparent_72%)]"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease, delay: 0.4 }}
          />
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute inset-[-10%] h-[120%] w-[120%] animate-spin-slow text-berry/25"
            focusable="false"
          >
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1.2 2.6" strokeLinecap="round" />
          </svg>
          <motion.div style={{ x: bouquetX, y: bouquetY }} className="relative">
            <Bouquet />
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Gulir ke bagian tentang saya"
        className="glass-soft absolute bottom-7 left-1/2 hidden h-12 w-12 -translate-x-1/2 place-items-center rounded-full text-berry sm:grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.4 }}
      >
        <ArrowDown className="h-5 w-5 animate-nudge" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
