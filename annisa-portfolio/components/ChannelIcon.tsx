import { Mail, MessageCircle } from "lucide-react";
import type { Channel } from "@/lib/channels";

/** lucide-react versi baru tidak lagi menyertakan ikon merek, jadi Instagram digambar sendiri. */
export default function ChannelIcon({ kind, className }: { kind: Channel["kind"]; className?: string }) {
  if (kind === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
        focusable="false"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "email") return <Mail className={className} aria-hidden="true" />;
  return <MessageCircle className={className} aria-hidden="true" />;
}
