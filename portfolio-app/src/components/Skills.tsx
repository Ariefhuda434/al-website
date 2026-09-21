"use client";

import { motion } from "framer-motion";
import { Flower2, Mic, Palette, Sparkles, type LucideIcon } from "lucide-react";
import { skills } from "../lib/content";
import { FlowerHead, Sparkle } from "./Flower";
import { Stagger, StaggerItem } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const icons: Record<(typeof skills)[number]["icon"], LucideIcon> = {
  mic: Mic,
  sparkles: Sparkles,
  flower: Flower2,
  palette: Palette,
};

/** Visual kecil untuk tiap kartu. Semuanya dekoratif (aria-hidden). */
function Equalizer() {
  return (
    <div aria-hidden="true" className="flex h-28 items-end gap-1.5 md:gap-2">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="h-full w-2 origin-bottom animate-eq rounded-full bg-gradient-to-t from-berry to-mauve md:w-2.5"
          style={{
            animationDelay: `${-((i * 0.37) % 1.1).toFixed(2)}s`,
            animationDuration: `${(0.8 + ((i * 7) % 6) * 0.14).toFixed(2)}s`,
          }}
        />
      ))}
    </div>
  );
}

function Twinkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-6 top-6 flex items-end gap-2">
      {[
        ["h-8 w-8 text-butter", "0s"],
        ["h-5 w-5 text-mauve", "-1.1s"],
        ["h-6 w-6 text-blush", "-0.5s"],
      ].map(([c, d], i) => (
        <span key={i} className={`animate-twinkle ${c}`} style={{ animationDelay: d }}>
          <Sparkle className="h-full w-full" />
        </span>
      ))}
    </div>
  );
}

function Swatches() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute -bottom-3 -right-3 flex">
      {["bg-blush", "bg-mauve", "bg-butter"].map((c, i) => (
        <span
          key={c}
          className={`-ml-4 h-14 w-14 animate-float rounded-full ${c} opacity-90 mix-blend-multiply`}
          style={{ animationDelay: `${-i * 1.2}s` }}
        />
      ))}
    </div>
  );
}

export default function Skills() {
  const layout: Record<string, string> = {
    speaking: "md:col-span-2 md:row-span-2",
    mc: "md:col-span-2",
    flower: "",
    design: "",
  };

  return (
    <Section id="skills">
      <SectionHeading title="things i love ♡" sub="with passion, with love, with dreams" />
      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 md:grid-cols-4" gap={0.1}>
        {skills.map((s) => {
          const Icon = icons[s.icon];
          const big = s.id === "speaking";
          return (
            <StaggerItem key={s.id} className={layout[s.id]}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`glass group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] p-7 ${
                  big ? "min-h-[22rem] md:p-10" : "min-h-[12rem]"
                }`}
              >
                <div>
                  <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/80 text-berry shadow-sm transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className={`text-ink ${big ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{s.title}</h3>
                  <p className={`mt-3 text-berry ${big ? "max-w-sm text-lg" : "max-w-[22rem] pr-6"}`}>{s.desc}</p>
                </div>

                {s.id === "speaking" && (
                  <div className="mt-8">
                    <Equalizer />
                  </div>
                )}
                {s.id === "mc" && <Twinkles />}
                {s.id === "flower" && (
                  <FlowerHead
                    tone="blush"
                    petals={8}
                    className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 animate-spin-slow opacity-80"
                  />
                )}
                {s.id === "design" && <Swatches />}
              </motion.article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
