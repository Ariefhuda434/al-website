"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { site } from "@/lib/content";
import { FlowerHead } from "./Flower";
import Reveal, { Stagger, StaggerItem } from "./Reveal";
import SafeImage from "./SafeImage";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

function TiltPhoto() {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 140, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 16 });

  return (
    <div className="relative mx-auto w-full max-w-md">
      <FlowerHead tone="mauve" petals={9} className="absolute -left-12 -top-12 z-0 h-40 w-40 animate-spin-slow opacity-90" />
      <FlowerHead tone="cream" petals={7} className="absolute -bottom-10 -right-8 z-0 h-28 w-28 animate-spin-slow opacity-90 [animation-direction:reverse]" />
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { px.set(0); py.set(0); }}
        className="relative z-10 aspect-[4/5] overflow-hidden rounded-[2.5rem] border-4 border-white/80 shadow-[0_30px_60px_-25px_rgba(139,58,77,0.55)]"
      >
        <SafeImage src="/images/profile.jpg" alt={`Foto ${site.shortName}`} sizes="(min-width: 768px) 28rem, 90vw" tone="from-blush to-mauve" />
      </motion.div>
      <div className="absolute -bottom-5 -right-2 z-20 animate-float sm:-right-5">
        <div className="glass rounded-2xl px-4 py-3">
          <p className="font-display text-xl leading-tight text-ink">{site.shortName}</p>
          <p className="text-xs font-medium text-berry">Mahasiswa FKM</p>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <Section id="about">
      <Reveal scale={0.97} y={48}>
        <div className="glass rounded-[2.75rem] p-7 sm:p-10 md:p-16">
          <SectionHeading title="Tentang saya" sub="a little about al" />
          <div className="mt-12 grid items-center gap-16 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            <TiltPhoto />
            <Stagger className="space-y-6" gap={0.14}>
              <StaggerItem>
                <p className="max-w-[34rem] text-xl leading-loose text-ink md:text-2xl md:leading-[1.7]">
                  i’m al, a public health student who somehow enjoys doing a little bit of everything.
                </p>
                <p className="max-w-[34rem] text-lg leading-relaxed text-berry mt-4">
                  i like designing things, writing stories, taking photos, making videos, joining organizations, and sometimes being in front of people as an MC or moderator.
                </p>
                <p className="max-w-[34rem] text-lg leading-relaxed text-berry mt-4 italic">
                  i’m still figuring things out, trying new things, and learning along the way.
                </p>
              </StaggerItem>
              <StaggerItem>
                <p className="max-w-[34rem] text-lg leading-relaxed text-berry">
                  Aku suka berbicara di depan umum, memandu acara, merangkai bunga kawat bulu, dan mendesain. Lewat portofolio ini, aku ingin berbagi perjalanan kreatif dan karya-karya yang sudah aku hasilkan, <span className="font-display italic">with passion, with love, with dreams.</span>
                </p>
              </StaggerItem>
              <StaggerItem>
                <a href="#skills" className="btn btn-primary btn-shine">Lihat skill saya</a>
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
