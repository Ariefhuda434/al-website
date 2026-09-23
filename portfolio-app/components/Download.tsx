"use client";
import { useContent } from "./ContentProvider";
import { trackClick } from "./Tracker";

export default function Download() {
  const { content } = useContent();
  const d = content.download as { heading?: string; fileUrl?: string; label?: string };
  if (!d.fileUrl) return null;
  return (
    <section className="px-6 py-16 text-center">
      <h2 className="mb-4 text-2xl">{d.heading || "Unduh CV"}</h2>
      <a href={d.fileUrl} onClick={() => trackClick("download_cv")} className="btn btn-primary" download>
        {d.label || "Download CV"}
      </a>
    </section>
  );
}
