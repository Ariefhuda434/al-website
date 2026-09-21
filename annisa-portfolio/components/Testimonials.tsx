"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/content";
import { FlowerHead } from "./Flower";
import Reveal, { ease } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  const reduce = useReducedMotion();
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const total = testimonials.length;
  const playing = !reduce && !paused && total > 1;

  const go = (next: number, d: 1 | -1) => setState([(next + total) % total, d]);

  // Geser otomatis tiap 6 detik. Berhenti saat disorot, difokus, atau "kurangi gerakan" aktif.
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setState(([i]) => [(i + 1) % total, 1]), 6000);
    return () => clearInterval(t);
  }, [playing, total]);

  const t = testimonials[index];

  return (
    <Section id="testimonials">
      <SectionHeading title="a little something i made ♡" sub="with gratitude" />

      <Reveal className="mt-14" y={40}>
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="Testimoni klien"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="glass relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-7 py-12 sm:px-14 sm:py-16"
        >
          <FlowerHead
            tone="blush"
            petals={9}
            className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 animate-spin-slow opacity-70"
          />
          <Quote className="relative h-12 w-12 text-mauve" aria-hidden="true" />

          <div aria-live={playing ? "off" : "polite"} className="relative mt-4 min-h-[13rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                initial={{ opacity: 0, x: dir * 56 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -56, transition: { duration: 0.22 } }}
                transition={{ duration: 0.5, ease }}
                aria-label={`Testimoni ${index + 1} dari ${total}`}
              >
                <blockquote className="font-display text-3xl italic leading-snug text-ink sm:text-4xl md:text-[2.6rem]">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-7 text-lg font-semibold text-berry">{t.name}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {total > 1 && (
            <div className="relative mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center" role="group" aria-label="Pilih testimoni">
                {testimonials.map((x, i) => (
                  <button
                    key={x.name}
                    type="button"
                    aria-current={i === index ? "true" : undefined}
                    aria-label={`Testimoni ${i + 1}: ${x.name}`}
                    onClick={() => go(i, i > index ? 1 : -1)}
                    className="grid h-11 w-9 place-items-center"
                  >
                    <span
                      className={`block h-2.5 rounded-full transition-all duration-500 ${
                        i === index ? "w-8 bg-berry" : "w-2.5 bg-berry/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(index - 1, -1)}
                  aria-label="Testimoni sebelumnya"
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/80 text-berry transition active:scale-90 hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(index + 1, 1)}
                  aria-label="Testimoni berikutnya"
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/80 text-berry transition active:scale-90 hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
