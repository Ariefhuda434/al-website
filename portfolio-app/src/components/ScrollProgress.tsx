"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Garis tipis di atas layar yang menunjukkan sejauh mana halaman sudah digulir. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed inset-x-0 top-0 z-[70] h-1 bg-gradient-to-r from-blush via-mauve to-berry"
    />
  );
}
