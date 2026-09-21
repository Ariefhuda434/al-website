"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { projects } from "@/lib/content";
import Reveal, { ease } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

/**
 * Perjalanan proyek: garis di kiri "terisi" seiring halaman digulir,
 * dan tiap proyek muncul dari sisi kanan saat garis mencapainya.
 */
export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });

  return (
    <Section id="projects">
      <Reveal scale={0.97} y={48}>
        <div className="glass rounded-[2.75rem] p-7 sm:p-10 md:p-16">
          <SectionHeading title="currently... ♡" sub="with vision & purpose" />

          <div ref={ref} className="relative mt-14 pl-9 sm:pl-14">
            {/* Garis perjalanan */}
            <div aria-hidden="true" className="absolute bottom-3 left-[9px] top-3 w-0.5 rounded-full bg-berry/15 sm:left-[13px]" />
            <motion.div
              aria-hidden="true"
              style={{ scaleY: fill, transformOrigin: "50% 0%" }}
              className="absolute bottom-3 left-[9px] top-3 w-0.5 rounded-full bg-gradient-to-b from-mauve to-berry sm:left-[13px]"
            />

            <ol className="space-y-8">
              {projects.map((p, i) => (
                <li key={p.title} className="relative">
                  <motion.span
                    aria-hidden="true"
                    className="absolute -left-9 top-8 grid h-5 w-5 place-items-center rounded-full border-2 border-berry bg-cream sm:-left-14 sm:h-7 sm:w-7"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
                  >
                    <span className="h-2 w-2 rounded-full bg-berry sm:h-3 sm:w-3" />
                  </motion.span>

                  <motion.article
                    initial={{ opacity: 0, x: 48 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.8, ease, delay: i * 0.05 }}
                    className="rounded-[1.75rem] border border-white/80 bg-white/65 p-6 shadow-[0_18px_40px_-24px_rgba(139,58,77,0.45)] sm:p-8"
                  >
                    <span className="inline-flex rounded-full bg-blush/70 px-3 py-1 text-sm font-semibold text-ink">
                      {p.tag}
                    </span>
                    <h3 className="mt-4 text-3xl text-ink md:text-4xl">{p.title}</h3>
                    <p className="mt-2 max-w-xl text-lg text-berry">{p.desc}</p>
                  </motion.article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
