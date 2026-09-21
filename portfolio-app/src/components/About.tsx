"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useContent } from "./contentContext";
import { FlowerHead } from "./Flower";
import Reveal, { Stagger, StaggerItem } from "./Reveal";
import SafeImage from "./SafeImage";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

/** Foto miring mengikuti arah mouse, seperti kartu yang dipegang. */
function TiltPhoto({ src, shortName, role }: { src: string; shortName: string; role: string }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 16 });

  return (
    <div className="relative mx-auto w-full max-w-md">
      <FlowerHead
        tone="mauve"
        petals={9}
        className="absolute -left-12 -top-12 z-0 h-40 w-40 animate-spin-slow opacity-90"
      />
      <FlowerHead
        tone="cream"
        petals={7}
        className="absolute -bottom-10 -right-8 z-0 h-28 w-28 animate-spin-slow opacity-90 [animation-direction:reverse]"
      />

      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        className="relative z-10 aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white/80 shadow-[0_30px_60px_-25px_rgba(139,58,77,0.55)]"
      >
        <SafeImage
          src={src}
          alt={`Foto ${shortName}`}
          sizes="(min-width: 768px) 28rem, 90vw"
          tone="from-blush to-mauve"
        />
      </motion.div>

      <div className="absolute -bottom-5 -right-2 z-20 animate-float sm:-right-5">
        <div className="glass rounded-2xl px-4 py-3">
          <p className="font-display text-xl leading-tight text-ink">{shortName}</p>
          <p className="text-xs font-medium text-berry">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { site, aboutParas } = useContent();
  return (
    <Section id="about">
      <Reveal scale={0.97} y={48}>
        <div className="glass rounded-[2.75rem] p-7 sm:p-10 md:p-16">
          <SectionHeading title={site.aboutTitle} sub={site.aboutSub} />
          <div className="mt-12 grid items-center gap-16 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <TiltPhoto src={site.aboutPhoto} shortName={site.shortName} role={site.aboutRole} />
            <Stagger className="space-y-6" gap={0.14}>
              {aboutParas.map((para, i) => (
                <StaggerItem key={i}>
                  <p
                    className={
                      i === 0
                        ? "max-w-[34rem] text-xl leading-loose text-ink md:text-2xl md:leading-[1.7]"
                        : "max-w-[34rem] text-lg leading-relaxed text-berry md:text-xl"
                    }
                  >
                    {para}
                  </p>
                </StaggerItem>
              ))}
              <StaggerItem>
                <a href="#skills" className="btn btn-primary btn-shine">
                  things i love ↓
                </a>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
