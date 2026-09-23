import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import Backdrop from "../components/Backdrop";
import { ContentProvider } from "../components/ContentProvider";
import CursorTrail from "../components/CursorTrail";
import Providers from "../components/Providers";
import ScrollProgress from "../components/ScrollProgress";
import Tracker from "../components/Tracker";
import MusicPlayer from "../components/MusicPlayer";

export const metadata: Metadata = {
  title: { default: "Portofolio", template: "%s | Portofolio" },
  description: "Ganti deskripsi ini dari panel admin.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff5f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a
          href="#main"
          className="glass fixed left-4 top-4 z-[100] -translate-y-24 rounded-full px-5 py-3 font-semibold text-ink transition-transform focus:translate-y-0"
        >
          Lewati ke konten utama
        </a>
        <Providers>
          <ContentProvider>
            <Backdrop />
            <ScrollProgress />
            <CursorTrail />
            {children}
            <Tracker />
            <MusicPlayer />
          </ContentProvider>
        </Providers>
      </body>
    </html>
  );
}
