"use client";

import { MotionConfig } from "framer-motion";

/** Semua animasi framer-motion otomatis mengikuti pengaturan "kurangi gerakan" dari perangkat. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
