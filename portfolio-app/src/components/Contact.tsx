"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, Send } from "lucide-react";
import { useContent } from "./contentContext";
import ChannelIcon from "./ChannelIcon";
import { Stagger, StaggerItem, ease } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = { name: "", email: "", message: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Tulis nama kamu, minimal 2 huruf.";
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    e.email = "Format email belum benar. Contoh: nama@email.com";
  }
  if (v.message.trim().length < 10) e.message = "Tulis pesan minimal 10 karakter.";
  return e;
}

function FieldError({ id, text }: { id: string; text?: string }) {
  return (
    <AnimatePresence initial={false}>
      {text && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="flex items-start gap-1.5 overflow-hidden pt-2 text-sm font-medium text-danger"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default function Contact() {
  const { site } = useContent();
  const channels = [
    ...(site.whatsapp
      ? [
          {
            kind: "whatsapp" as const,
            label: "WhatsApp",
            handle: `+${site.whatsapp.replace(/\D/g, "")}`,
            href: `https://wa.me/${site.whatsapp.replace(/\D/g, "")}`,
          },
        ]
      : []),
    ...(site.instagram
      ? [
          {
            kind: "instagram" as const,
            label: "Instagram",
            handle: `@${site.instagram.replace("@", "")}`,
            href: `https://instagram.com/${site.instagram.replace("@", "")}`,
          },
        ]
      : []),
    ...(site.email ? [{ kind: "email" as const, label: "Email", handle: site.email, href: `mailto:${site.email}` }] : []),
  ];
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent" | "unconfigured">("idle");
  const [via, setVia] = useState<"whatsapp" | "email">("whatsapp");

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    const firstBad = (["name", "email", "message"] as const).find((k) => errs[k]);
    if (firstBad) {
      document.getElementById(firstBad)?.focus();
      return;
    }

    const name = values.name.trim();
    const email = values.email.trim();
    const text = `Halo ${site.shortName}, saya ${name}${email ? ` (${email})` : ""}.\n\n${values.message.trim()}`;

    if (site.whatsapp) {
      window.open(`https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
      setVia("whatsapp");
      setStatus("sent");
    } else if (site.email) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Pesan dari ${name}`)}&body=${encodeURIComponent(text)}`;
      setVia("email");
      setStatus("sent");
    } else {
      setStatus("unconfigured");
    }
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setStatus("idle");
  };

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
<SectionHeading title={site.contactTitle} sub="with passion, with love, with dreams" />
          <p className="mt-8 max-w-md text-xl leading-relaxed text-berry">{site.contactDesc}</p>

          {channels.length > 0 && (
            <Stagger className="mt-9 flex flex-col gap-3" gap={0.1}>
              {channels.map((c) => (
                <StaggerItem key={c.kind} x={-24} y={0}>
                  <a
                    href={c.href}
                    target={c.kind === "email" ? undefined : "_blank"}
                    rel={c.kind === "email" ? undefined : "noopener noreferrer"}
                    data-track={`channel-${c.kind}`}
                    className="glass-soft group flex min-h-16 items-center gap-4 rounded-2xl px-5 py-3 transition duration-300 hover:-translate-y-0.5 hover:bg-white/80"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-berry text-cream transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                      <ChannelIcon kind={c.kind} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{c.label}</span>
                      <span className="block truncate text-berry">{c.handle}</span>
                    </span>
                  </a>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease }}
          className="glass min-h-[30rem] rounded-[2.5rem] p-7 sm:p-10"
        >
          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <motion.div
                key="sent"
                role="status"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="flex min-h-[26rem] flex-col items-center justify-center text-center"
              >
                <svg viewBox="0 0 52 52" className="h-24 w-24" aria-hidden="true" focusable="false">
                  <motion.circle
                    cx="26" cy="26" r="23" fill="rgb(255 192 203 / 0.5)" stroke="#8B3A4D" strokeWidth="2.5"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease }}
                  />
                  <motion.path
                    d="M15 27 l8 8 l14 -16" fill="none" stroke="#8B3A4D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease, delay: 0.5 }}
                  />
                </svg>
                <h3 className="mt-6 text-4xl text-ink">Pesan siap dikirim</h3>
                <p className="mt-3 max-w-sm text-lg text-berry">
                  {via === "whatsapp"
                    ? "WhatsApp terbuka di tab baru. Tekan kirim di sana untuk menyampaikan pesanmu."
                    : "Aplikasi email kamu terbuka dengan pesan yang sudah terisi. Tekan kirim di sana."}
                </p>
                <button type="button" onClick={reset} className="btn btn-glass mt-8">
                  Tulis pesan lain
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="mb-2 block font-semibold text-ink">
                    Nama
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={set("name")}
                    className="field"
                    placeholder="Nama kamu"
                    aria-required="true"
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  <FieldError id="name-error" text={errors.name} />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block font-semibold text-ink">
                    Email <span className="font-normal text-muted">(boleh dikosongkan)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={values.email}
                    onChange={set("email")}
                    className="field"
                    placeholder="email@kamu.com"
                    aria-invalid={errors.email ? "true" : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  <FieldError id="email-error" text={errors.email} />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block font-semibold text-ink">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={values.message}
                    onChange={set("message")}
                    className="field resize-none"
                    placeholder="Tulis pesan atau cerita kecilmu di sini"
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  <FieldError id="message-error" text={errors.message} />
                </div>

                <AnimatePresence>
                  {status === "unconfigured" && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-2 overflow-hidden rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
                    >
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      Tujuan pesan belum diatur. Isi NEXT_PUBLIC_WA_NUMBER atau NEXT_PUBLIC_EMAIL di environment variable.
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" className="btn btn-primary btn-shine group w-full !min-h-14 text-lg">
                  Kirim pesan
                  <Send
                    className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}
