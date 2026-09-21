import { site } from "./content";

export type Channel = {
  kind: "whatsapp" | "instagram" | "email";
  label: string;
  handle: string;
  href: string;
};

/** Saluran kontak yang sudah diisi lewat environment variable. Yang kosong otomatis disembunyikan. */
export function getChannels(): Channel[] {
  const list: Channel[] = [];
  if (site.whatsapp) {
    list.push({
      kind: "whatsapp",
      label: "WhatsApp",
      handle: `+${site.whatsapp}`,
      href: `https://wa.me/${site.whatsapp}`,
    });
  }
  if (site.instagram) {
    list.push({
      kind: "instagram",
      label: "Instagram",
      handle: `@${site.instagram}`,
      href: `https://instagram.com/${site.instagram}`,
    });
  }
  if (site.email) {
    list.push({
      kind: "email",
      label: "Email",
      handle: site.email,
      href: `mailto:${site.email}`,
    });
  }
  return list;
}
