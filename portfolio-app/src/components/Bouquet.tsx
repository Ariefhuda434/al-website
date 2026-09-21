"use client";

import { motion } from "framer-motion";
import { FlowerStem, Sparkle, type Tone } from "./Flower";

type Stem = {
  angle: number;
  len: number;
  width: number;
  tone: Tone;
  petals: number;
  leaf: "left" | "right";
  dur: number;
  sway: number;
};

// Urutan = urutan gambar: yang paling belakang dulu, bunga tengah paling depan.
const stems: Stem[] = [
  { angle: -31, len: 290, width: 32, tone: "mauve", petals: 6, leaf: "left", dur: 6.8, sway: -1.2 },
  { angle: 33, len: 270, width: 30, tone: "cream", petals: 7, leaf: "right", dur: 7.4, sway: -3.1 },
  { angle: -14, len: 350, width: 33, tone: "cream", petals: 8, leaf: "left", dur: 6.2, sway: -2.2 },
  { angle: 17, len: 330, width: 33, tone: "rose", petals: 7, leaf: "right", dur: 7, sway: -0.6 },
  { angle: 1, len: 380, width: 38, tone: "blush", petals: 9, leaf: "left", dur: 6.6, sway: -4 },
];

const spark = [
  { cls: "left-[4%] top-[8%] w-6 text-butter", d: "0s" },
  { cls: "right-[2%] top-[20%] w-4 text-mauve", d: "-0.9s" },
  { cls: "left-[0%] top-[46%] w-4 text-blush", d: "-1.6s" },
  { cls: "right-[6%] top-[58%] w-6 text-butter", d: "-2.2s" },
  { cls: "left-[12%] top-[72%] w-3 text-mauve", d: "-0.4s" },
];

/** Karangan bunga kawat bulu: mekar satu per satu, lalu bergoyang pelan. */
export default function Bouquet() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[420px]" aria-hidden="true">
      {stems.map((s, i) => (
        <div
          key={i}
          className="absolute bottom-0 left-1/2"
          style={{
            width: `${s.width}%`,
            marginLeft: `-${s.width / 2}%`,
            aspectRatio: `120 / ${s.len}`,
            transform: `rotate(${s.angle}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <motion.div
            className="h-full w-full"
            style={{ transformOrigin: "50% 100%" }}
            initial={{ scale: 0, rotate: -14 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 11, delay: 0.9 + i * 0.16 }}
          >
            <div
              className="h-full w-full animate-sway will-change-transform"
              style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.sway}s`, transformOrigin: "50% 100%" }}
            >
              <FlowerStem tone={s.tone} petals={s.petals} length={s.len} leaf={s.leaf} />
            </div>
          </motion.div>
        </div>
      ))}

      {/* Pita pengikat */}
      <motion.svg
        viewBox="0 0 120 64"
        className="absolute bottom-[1%] left-1/2 w-[32%] -translate-x-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1.9 }}
        focusable="false"
      >
        <path d="M60 30 C 42 2, 4 6, 10 32 C 16 58, 46 56, 60 30 Z" fill="#E8A0BF" stroke="#C4709A" strokeWidth="3" strokeLinejoin="round" />
        <path d="M60 30 C 78 2, 116 6, 110 32 C 104 58, 74 56, 60 30 Z" fill="#E8A0BF" stroke="#C4709A" strokeWidth="3" strokeLinejoin="round" />
        <path d="M56 38 L42 62 M64 38 L78 62" stroke="#C4709A" strokeWidth="5" strokeLinecap="round" />
        <circle cx="60" cy="30" r="9" fill="#8B3A4D" />
      </motion.svg>

      {spark.map((s, i) => (
        <span key={i} className={`absolute block aspect-square animate-twinkle ${s.cls}`} style={{ animationDelay: s.d }}><Sparkle className="h-full w-full" /></span>
      ))}
    </div>
  );
}
