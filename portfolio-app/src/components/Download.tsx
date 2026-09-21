"use client";

import { motion } from "framer-motion";
import { Download as DownloadIcon } from "lucide-react";
import { site } from "../lib/content";
import { FlowerHead } from "./Flower";
import Reveal, { ease } from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

export default function Download() {
  return (
    <Section id="download">
      <Reveal scale={0.96} y={48}>
        <div className="relative overflow-hidden rounded-[2.75rem] bg-gradient-to-br from-ink via-berry to-[#a34a63] px-7 py-16 text-center text-cream shadow-[0_40px_80px_-30px_rgba(94,34,51,0.8)] sm:px-12 md:py-24">
          <FlowerHead tone="mauve" petals={9} className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 animate-spin-slow opacity-40" />
          <FlowerHead tone="blush" petals={8} className="pointer-events-none absolute -bottom-20 -right-14 h-64 w-64 animate-spin-slow opacity-35 [animation-direction:reverse]" />

          <div className="relative mx-auto max-w-2xl">
            <SectionHeading center light title="Unduh CV" sub="dan ringkasan portofolio" />
            <motion.p
              className="mx-auto mt-8 max-w-lg text-xl text-cream/90"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
            >
              Dapatkan ringkasan lengkap tentang profil dan karya saya dalam format PDF.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
            >
              <a
                href={site.cv}
                download
                className="btn btn-light btn-shine group mt-10 !min-h-14 !px-9 text-lg focus-visible:outline-cream"
              >
                <DownloadIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
                Unduh PDF
              </a>
            </motion.div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
