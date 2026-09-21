"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { works } from "../lib/content";
import { Stagger, StaggerItem, ease } from "./Reveal";
import SafeImage from "./SafeImage";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

function Lightbox({
  index,
  onClose,
  onChange,
}: {
  index: number;
  onClose: () => void;
  onChange: (i: number, dir: 1 | -1) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dirRef = useRef<1 | -1>(1);
  const work = works[index];

  const go = useCallback(
    (dir: 1 | -1) => {
      dirRef.current = dir;
      onChange((index + dir + works.length) % works.length, dir);
    },
    [index, onChange],
  );

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        // Fokus tetap di dalam dialog
        const items = document.querySelectorAll<HTMLElement>("#lightbox button");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <motion.div
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      className="fixed inset-0 z-[80] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.92, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0, transition: { duration: 0.18 } }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        className="glass relative w-full max-w-3xl overflow-hidden rounded-[2rem]"
      >
        <div className="relative h-[58dvh] w-full bg-white/40">
          <AnimatePresence mode="popLayout" initial={false} custom={dirRef.current}>
            <motion.div
              key={work.id}
              className="absolute inset-0"
              custom={dirRef.current}
              initial={{ opacity: 0, x: dirRef.current * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dirRef.current * -60 }}
              transition={{ duration: 0.4, ease }}
            >
              <SafeImage src={work.image} alt={work.title} sizes="(min-width: 768px) 48rem, 100vw" tone={work.tone} className="object-contain" />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h3 className="text-2xl text-ink">{work.title}</h3>
            <p className="text-berry">{work.desc}</p>
            <p className="mt-0.5 text-sm italic text-muted">{work.idn}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Karya sebelumnya"
              className="grid h-12 w-12 place-items-center rounded-full bg-white/80 text-berry transition active:scale-90 hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Karya berikutnya"
              className="grid h-12 w-12 place-items-center rounded-full bg-white/80 text-berry transition active:scale-90 hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/85 text-berry shadow-md transition active:scale-90 hover:bg-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [open, setOpen] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    // Kembalikan fokus ke kartu yang tadi dibuka
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <Section id="portfolio">
      <SectionHeading title="little things i've made ♡" sub="a little collection of things i've created, worked on, or simply had fun making." />
      <Stagger className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3" gap={0.12}>
        {works.map((w, i) => (
          <StaggerItem key={w.id} className="mb-6 break-inside-avoid">
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setOpen(i);
              }}
              aria-label={`Buka ${w.title}`}
              className="group block w-full text-left"
            >
              <div
                className={`relative overflow-hidden rounded-[2rem] shadow-[0_26px_50px_-26px_rgba(139,58,77,0.55)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-[-1deg] ${w.aspect}`}
              >
                <SafeImage
                  src={w.image}
                  alt={w.title}
                  sizes="(min-width: 768px) 30vw, 90vw"
                  tone={w.tone}
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <span className="glass-soft absolute bottom-4 right-4 inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ink">
                  Lihat
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
              <h3 className="mt-5 text-2xl text-ink md:text-3xl">{w.title}</h3>
              <p className="mt-1 max-w-xs text-berry">{w.desc}</p>
              <p className="mt-0.5 max-w-xs text-sm text-muted italic">{w.idn}</p>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      <AnimatePresence>
        {open !== null && <Lightbox index={open} onClose={close} onChange={(i) => setOpen(i)} />}
      </AnimatePresence>
    </Section>
  );
}
