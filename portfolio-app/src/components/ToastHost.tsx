"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; msg: string; type: "ok" | "err" | "info" };

let listeners: ((t: Toast) => void)[] = [];

export function toast(msg: string, type: Toast["type"] = "ok") {
  listeners.forEach((l) => l({ id: Date.now() + Math.random(), msg, type }));
}

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3600);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-28 right-4 z-[120] flex w-72 flex-col items-end gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-in w-full rounded-2xl border px-4 py-3 text-sm font-semibold shadow-xl backdrop-blur-xl ${
            t.type === "ok"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
              : t.type === "err"
                ? "border-red-200 bg-red-50/95 text-red-600"
                : "border-[#FFC0CB] bg-white/95 text-[#8B3A4D]"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}