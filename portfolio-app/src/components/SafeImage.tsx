"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { FlowerHead } from "./Flower";

type Props = Omit<ImageProps, "fill" | "width" | "height"> & {
  /** Kelas gradasi Tailwind untuk latar cadangan, mis. "from-blush to-mauve" */
  tone?: string;
};

/**
 * Gambar yang mengisi wadah induk (induk harus relative + punya aspect ratio).
 * Kalau file gambar belum ada atau gagal dimuat, tampil ornamen bunga sebagai cadangan
 * sehingga halaman tidak pernah terlihat rusak.
 */
export default function SafeImage({ tone = "from-blush to-mauve", alt, className = "", ...props }: Props) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // onError bisa terlewat kalau gambar gagal sebelum React aktif (hydration), jadi cek manual.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br ${tone}`}
      >
        <FlowerHead tone="cream" petals={9} className="h-2/5 w-2/5 animate-spin-slow opacity-90" />
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      fill
      alt={alt}
      className={className.includes("object-") ? className : `object-cover ${className}`}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
