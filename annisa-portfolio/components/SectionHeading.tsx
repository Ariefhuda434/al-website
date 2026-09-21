"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ease } from "./Reveal";

/**
 * Judul section: tiap kata naik dari balik "topeng" saat masuk layar.
 * Pemicu (whileInView) dipasang di elemen induk yang tidak ikut bergeser.
 * Kalau dipasang di kata yang tersembunyi di balik topeng, elemennya tidak pernah
 * dianggap terlihat sehingga judul tidak akan muncul.
 */
export default function SectionHeading({
  title,
  sub,
  className = "",
  light = false,
  center = false,
}: {
  title: string;
  sub?: string;
  className?: string;
  light?: boolean;
  center?: boolean;
}) {
  const words = title.split(" ");
  return (
    <motion.div
      className={`${center ? "text-center" : ""} ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      <h2
        aria-label={title}
        className={`text-5xl leading-[1.05] md:text-7xl ${light ? "text-cream" : "text-ink"}`}
      >
        {words.map((w, i) => (
          <Fragment key={i}>
            <span aria-hidden="true" className="-my-[0.2em] inline-block overflow-hidden py-[0.2em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: "115%" }, show: { y: 0, transition: { duration: 0.85, ease } } }}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h2>
      {sub ? (
        <motion.p
          className={`mt-3 font-display text-xl italic md:text-2xl ${light ? "text-blush" : "text-muted"}`}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.2 } },
          }}
        >
          {sub}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
