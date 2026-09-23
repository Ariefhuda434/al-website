"use client";
import type { ReactNode } from "react";

/** Titik gabung untuk provider global lain kalau nanti perlu (theme, dsb). */
export default function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
