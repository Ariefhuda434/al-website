"use client";
import { useContent } from "./ContentProvider";
import { trackClick } from "./Tracker";

export default function Contact() {
  const { content } = useContent();
  const c = content.contact as { heading?: string; email?: string; phone?: string; instagram?: string; linkedin?: string };
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="mb-6 text-3xl">{c.heading || "Kontak"}</h2>
      <div className="flex flex-wrap justify-center gap-3">
        {c.email ? (
          <a href={`mailto:${c.email}`} onClick={() => trackClick("contact_email")} className="btn btn-glass">Email</a>
        ) : null}
        {c.phone ? (
          <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}`} onClick={() => trackClick("contact_wa")} className="btn btn-glass">WhatsApp</a>
        ) : null}
        {c.instagram ? (
          <a href={c.instagram} onClick={() => trackClick("contact_ig")} className="btn btn-glass">Instagram</a>
        ) : null}
        {c.linkedin ? (
          <a href={c.linkedin} onClick={() => trackClick("contact_li")} className="btn btn-glass">LinkedIn</a>
        ) : null}
      </div>
    </section>
  );
}
