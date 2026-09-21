"use client";

import { motion } from "framer-motion";
import { Flower2 } from "lucide-react";
import { testimonials } from "../lib/content";
import { FlowerHead } from "./Flower";
import Reveal, { ease } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

export default function Testimonials() {
  return (
    <Section id="testimonials">
      <SectionHeading title={testimonials.title} sub={testimonials.sub} />

      <Reveal className="mt-14" y={40}>
        <div className="glass relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] px-7 py-14 sm:px-14 sm:py-20">
          <FlowerHead
            tone="blush"
            petals={9}
            className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 animate-spin-slow opacity-70"
          />
          <Flower2 className="relative h-12 w-12 text-mauve" aria-hidden="true" />

          <div className="relative mt-6">
            {testimonials.paras.map((para, i) => (
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
        </div>
      </Reveal>
    </Section>
  );
}