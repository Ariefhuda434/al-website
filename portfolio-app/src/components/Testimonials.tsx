"use client";

import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { useContent } from "./contentContext";
import { FlowerHead } from "./Flower";
import Reveal, { ease } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  const { site } = useContent();
  return (
    <Section id="testimonials">
      <SectionHeading title={site.handmadeTitle} sub={site.handmadeSub} />

      <Reveal className="mt-14" y={40}>
        <div className="glass relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-7 py-14 sm:px-14 sm:py-20">
          <FlowerHead
            tone="blush"
            petals={9}
            className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 animate-spin-slow opacity-70"
          />
          <Flower2 className="relative h-12 w-12 text-mauve" aria-hidden="true" />

          <div className="relative mt-6">
            {site.handmadeParas.map((para, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease, delay: i * 0.15 }}
                className={`mt-4 font-display italic leading-snug text-ink ${
                  i === 0 ? "text-3xl sm:text-4xl md:text-5xl" : "text-2xl text-muted sm:text-3xl"
                }`}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {site.instagram && (
            <a
              href={`https://instagram.com/${site.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-soft group mt-10 inline-flex min-h-14 items-center gap-3 rounded-full px-6 py-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/80"
            >
              <span className="text-2xl" aria-hidden="true">
                🌷
              </span>
              <span className="font-semibold text-ink">
                @{site.instagram}
              </span>
              <span className="text-sm text-berry transition-transform duration-300 group-hover:translate-x-1">
                open →
              </span>
            </a>
          )}
        </div>
      </Reveal>
    </Section>
  );
}