"use client";

import { useEffect, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "../lib/firebaseConfig";

let viewWritten = false;
let interactionCount = 0;
const MAX_INTERACTIONS = 30;

async function record(kind: "view" | "click", label?: string) {
  if (!isFirebaseConfigured) return;
  try {
    const db = getFirebaseDb();
    let meta: { ip?: string; browser?: string; os?: string; device?: string; ua?: string } = {};
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      if (res.ok) meta = await res.json();
    } catch {
      // gagal ambil IP/UA server — tetap kirim dari sisi klien
      const ua = navigator.userAgent;
      const dv = /tablet|ipad/i.test(ua) ? "tablet" : /mobile|iphone|android/i.test(ua) ? "mobile" : "desktop";
      meta = { device: dv, ua };
    }
    await addDoc(collection(db, "visits"), {
      kind,
      label: label || null,
      path: window.location.pathname,
      ref: document.referrer || null,
      screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
      date: new Date().toISOString().slice(0, 10),
      ts: serverTimestamp(),
      ...meta,
    });
  } catch {
    // catat saat offline / Firestore diblokir — jangan ganggu UX
  }
}

/** Mencatat kunjungan unik per halaman dan interaksi (klik tautan/tombol), disimpan ke Firestore. */
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