"use client";

import Reveal from "./Reveal";

/** Pengganti langsung untuk ScrollAnimation lama (props sama: children, delay dalam ms). */
export default function ScrollAnimation({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return <Reveal delay={delay}>{children}</Reveal>;
}
