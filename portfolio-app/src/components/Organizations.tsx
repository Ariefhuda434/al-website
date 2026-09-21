"use client";

import { useContent } from "./contentContext";
import Reveal from "./Reveal";
import Section from "./Section";
import SectionHeading from "./SectionHeading";

export default function Organizations() {
  const { site } = useContent();
  return (
    <Section id="organizations">
      <Reveal>
        <div className="glass rounded-[2.75rem] p-7 sm:p-10 md:p-16">
          <SectionHeading title="organizations ♡" sub="pengalaman organisasi selama berkuliah & berproses" />

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {site.orgs.map((o, i) => (
              <li
                key={o.org + i}
                className="group rounded-3xl border border-white/80 bg-white/55 p-6 shadow-[0_18px_40px_-28px_rgba(139,58,77,0.5)] transition duration-300 hover:-translate-y-1 hover:bg-white/75 sm:p-7"
              >
                <span className="text-3xl" aria-hidden="true">
                  {o.emoji}
                </span>
                <h3 className="mt-3 font-display text-3xl text-ink transition-colors group-hover:text-berry sm:text-4xl">
                  {o.org}
                </h3>
                <p className="mt-2 text-berry/80">{o.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}