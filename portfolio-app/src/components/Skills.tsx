"use client";

import { motion } from "framer-motion";
import { Camera, Clapperboard, Flower2, Mic, Palette, PenLine, Users, type LucideIcon } from "lucide-react";
import { skills } from "../lib/content";
import { FlowerHead } from "./Flower";
import { Stagger, StaggerItem } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

const icons: Record<string, LucideIcon> = {
  palette: Palette,
  pen: PenLine,
  camera: Camera,
  video: Clapperboard,
  mic: Mic,
  users: Users,
  flower: Flower2,
};

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading title="things i love ♡" sub="with passion, with love, with dreams" />
      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
        {skills.map((s, i) => {
          const Icon = icons[s.icon] ?? Flower2;
          return (
            <StaggerItem key={s.id} className={i === 6 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass group relative flex h-full min-h-[13rem] flex-col overflow-hidden rounded-[2rem] p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/80 text-berry shadow-sm transition-transform duration-500 group-hover:rotate-[-10deg] group-hover:scale-110">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <span className="text-3xl" aria-hidden="true">
                    {s.emoji}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl text-ink md:text-3xl">{s.title}</h3>
                <p className="mt-2 text-berry">{s.en}</p>
                <p className="mt-1 text-sm text-muted italic">{s.idn}</p>
                {s.id === "flower" && (
                  <FlowerHead
                    tone="blush"
                    petals={8}
                    className="pointer-events-none absolute -bottom-10 -right-10 h-24 w-24 animate-spin-slow opacity-70"
                  />
                )}
              </motion.article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}