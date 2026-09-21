import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const alt = `${site.name} | Portofolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Gambar yang muncul saat link dibagikan di WhatsApp, Instagram, dan lainnya.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #FFF5F7 0%, #FFC0CB 60%, #E8A0BF 100%)",
          color: "#5E2233",
        }}
      >
        <div style={{ fontSize: 30, color: "#8B3A4D", display: "flex" }}>Portofolio</div>
        <div style={{ fontSize: 112, lineHeight: 1.02, fontWeight: 700, marginTop: 14, display: "flex", flexWrap: "wrap" }}>
          {site.name}
        </div>
        <div style={{ fontSize: 38, marginTop: 30, color: "#8B3A4D", display: "flex" }}>
          Public speaker, MC, bunga kawat bulu, desain
        </div>
        <div style={{ fontSize: 30, marginTop: 44, fontStyle: "italic", color: "#9C5468", display: "flex" }}>
          {site.motto.join(", ")}
        </div>
      </div>
    ),
    { ...size },
  );
}
