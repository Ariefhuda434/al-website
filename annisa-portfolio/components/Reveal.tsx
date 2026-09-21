"use client";

import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  /** Jeda dalam milidetik */
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  className?: string;
  amount?: number;
};

/** Muncul saat masuk layar (sekali saja). */
export default function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  scale = 1,
  className,
  amount = 0.2,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.85, delay: delay / 1000, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Wadah yang memunculkan anaknya satu per satu. Pasangkan dengan <StaggerItem>. */
export function Stagger({
  children,
  className,
  gap = 0.09,
  delay = 0,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 30,
  x = 0,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  x?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y, x },
        show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}
