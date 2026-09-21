"use client";

import { useEffect, useRef } from "react";

let viewWritten = false;
let interactionCount = 0;
const MAX_INTERACTIONS = 30;

async function record(kind: "view" | "click", label?: string) {
  try {
    await fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: kind,
        label,
        path: window.location.pathname,
        referrer: document.referrer || "",
      }),
    });
  } catch {
    /* jangan ganggu UX */
  }
}

/** Mencatat kunjungan unik per halaman + interaksi (klik tautan/tombol), disimpan ke Vercel Blob. */
export default function Tracker() {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const pathKey = `vpath:${window.location.pathname}`;
    let seen = false;
    try {
      seen = sessionStorage.getItem(pathKey) === "1";
    } catch {
      /* private mode */
    }
    if (!seen && !viewWritten) {
      viewWritten = true;
      record("view");
      try {
        sessionStorage.setItem(pathKey, "1");
      } catch {
        /* ignore */
      }
    }

    const onClick = (e: MouseEvent) => {
      if (interactionCount >= MAX_INTERACTIONS) return;
      const el = (e.target as HTMLElement)?.closest?.("[data-track]");
      if (!el) return;
      const label = el.getAttribute("data-track") || el.getAttribute("aria-label") || el.textContent?.trim();
      if (!label) return;
      interactionCount += 1;
      record("click", label.slice(0, 120));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}