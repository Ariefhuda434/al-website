"use client";
import { useEffect } from "react";

function send(body: Record<string, unknown>) {
  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export default function Tracker() {
  useEffect(() => {
    send({ type: "view", path: window.location.pathname, referrer: document.referrer });
  }, []);
  return null;
}

/** Helper dipakai komponen lain buat lapor klik CTA. */
export function trackClick(label: string) {
  send({ type: "click", path: window.location.pathname, label });
}
