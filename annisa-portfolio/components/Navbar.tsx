"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/lib/content";
import { FlowerHead } from "./Flower";
import { ease } from "./Reveal";

const trackedIds = [...nav.map((n) => n.id), "contact"];

export default function Navbar() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Bayangan lebih tegas setelah halaman mulai digulir
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tandai section yang sedang berada di tengah layar
  useEffect(() => {
    const els = trackedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const hero = document.getElementById("hero");
    const heroIo = new IntersectionObserver(([e]) => e.isIntersecting && setActive(""), {
      rootMargin: "-45% 0px -50% 0px",
    });
    if (hero) heroIo.observe(hero);
    return () => {
      io.disconnect();
      heroIo.disconnect();
    };
  }, []);

  // Menu mobile: kunci scroll, tombol Esc, perangkap fokus, kembalikan fokus saat ditutup
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = sheetRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([tabindex='-1'])");
      if (!items || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const menuBtn = menuBtnRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      menuBtn?.focus();
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4">
      <motion.nav
        aria-label="Navigasi utama"
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 17, delay: 0.35 }}
        className={`glass flex w-full max-w-5xl items-center justify-between rounded-full py-1.5 pl-4 pr-1.5 transition-shadow duration-500 ${
          scrolled ? "shadow-[0_18px_44px_-14px_rgba(139,58,77,0.45)]" : ""
        }`}
      >
        <a
          href="#hero"
          className="group flex min-h-11 items-center gap-2 rounded-full pr-3 font-display text-xl text-ink"
          aria-label={`${site.name}, kembali ke atas`}
        >
          <FlowerHead tone="mauve" petals={7} className="h-8 w-8 animate-spin-slow transition-transform duration-500 group-hover:scale-125" />
          {site.shortName}
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-berry hover:text-ink"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-white/85 shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{n.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        <a href="#contact" className="btn btn-primary btn-shine hidden !min-h-11 !px-5 !text-sm lg:inline-flex">
          Hubungi saya
        </a>

        <button
          ref={menuBtnRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-berry transition-transform duration-200 active:scale-90 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="Tutup menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            />
            <motion.div
              className="glass absolute inset-x-3 top-[max(0.75rem,env(safe-area-inset-top))] rounded-[2rem] p-4 sm:inset-x-4"
              initial={{ y: -28, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -18, scale: 0.98, opacity: 0, transition: { duration: 0.18 } }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="flex items-center justify-between pl-2">
                <span className="flex items-center gap-2 font-display text-xl text-ink">
                  <FlowerHead tone="mauve" petals={7} className="h-8 w-8 animate-spin-slow" />
                  {site.shortName}
                </span>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Tutup menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/70 text-berry transition-transform duration-200 active:scale-90"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-3 flex flex-col">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.id}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.08 + i * 0.05 }}
                  >
                    <a
                      href={`#${n.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === n.id ? "location" : undefined}
                      className={`flex min-h-14 items-center justify-between rounded-2xl px-4 font-display text-3xl transition-colors ${
                        active === n.id ? "bg-white/70 text-ink" : "text-berry active:bg-white/50"
                      }`}
                    >
                      {n.label}
                      {active === n.id && <span className="h-2.5 w-2.5 rounded-full bg-berry" aria-hidden="true" />}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-3 w-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.4 }}
              >
                Hubungi saya
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
