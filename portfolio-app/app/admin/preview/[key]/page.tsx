"use client";
import { use } from "react";
import Link from "next/link";
import { ContentProvider } from "../../../../components/ContentProvider";
import Navbar from "../../../../components/Navbar";
import Hero from "../../../../components/Hero";
import About from "../../../../components/About";
import Skills from "../../../../components/Skills";
import Portfolio from "../../../../components/Portfolio";
import Projects from "../../../../components/Projects";
import Organizations from "../../../../components/Organizations";
import Testimonials from "../../../../components/Testimonials";
import Contact from "../../../../components/Contact";
import Download from "../../../../components/Download";
import Footer from "../../../../components/Footer";

export default function PreviewPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);
  return (
    <ContentProvider previewEndpoint={`/api/admin/content/preview?key=${encodeURIComponent(key)}`}>
      <div className="glass sticky top-0 z-[90] flex items-center justify-between px-6 py-3">
        <p className="text-sm font-semibold text-berry">
          Mode Preview — section &quot;{key}&quot; (draft, belum tayang ke publik)
        </p>
        <Link href="/admin" className="btn btn-glass !min-h-9 !px-4 text-xs">Kembali ke dashboard</Link>
      </div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Portfolio />
        <Projects />
        <Organizations />
        <Testimonials />
        <Contact />
        <Download />
      </main>
      <Footer />
    </ContentProvider>
  );
}
