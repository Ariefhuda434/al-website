"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "../lib/firebaseConfig";
import {
  about as aboutDef,
  music as musicDef,
  orgs as orgsDef,
  projects as currentDef,
  site as siteDef,
  skills as skillsDef,
  testimonials as handmadeDef,
  works as worksDef,
} from "../lib/content";

export type Work = {
  id: string;
  title: string;
  desc: string;
  idn: string;
  image: string;
  aspect: string;
  tone: string;
  createdAt?: number;
};

export type Skill = { id: string; icon: string; emoji: string; title: string; en: string; idn: string };
export type Org = { org: string; role: string; emoji: string };
export type Song = { title: string; src: string };

export type SiteContent = {
  name: string;
  shortName: string;
  motto: string[];
  intro: string;
  heroBadge: string;
  heroTitle: string;
  heroIntro: string;
  aboutTitle: string;
  aboutSub: string;
  aboutRole: string;
  aboutPhoto: string;
  instagram: string;
  instagramLabel: string;
  contactTitle: string;
  contactDesc: string;
  portfolioTitle: string;
  portfolioSub: string;
  skillsTitle: string;
  skillsSub: string;
  skills: Skill[];
  currentLabel: string;
  currentSub: string;
  currentItems: string[];
  orgs: Org[];
  handmadeTitle: string;
  handmadeSub: string;
  handmadeParas: string[];
  music: Song[];
  cv: string;
  whatsapp: string;
  email: string;
};

const siteDefaults: SiteContent = {
  name: siteDef.name,
  shortName: siteDef.shortName,
  motto: [...siteDef.motto],
  intro: siteDef.intro,
  heroBadge: "Halo, senang kamu mampir",
  heroTitle: "hi, i'm al ♡",
  heroIntro:
    "just a little space about me,\nthe things i love, the things i make,\nand the little things i'm learning along the way.",
  aboutTitle: aboutDef.title,
  aboutSub: aboutDef.sub,
  aboutRole: "Mahasiswa FKM",
  aboutPhoto: "/images/foto al.png",
  instagram: siteDef.instagram,
  instagramLabel: "Little handmade project — flowers, gifts & cute things",
  contactTitle: "say hello ♡",
  contactDesc:
    "Hanya sekadar menyapa, ingin bertanya, atau cerita hal kecil? Kirim pesan — aku senang membaca dan membalasnya.",
  portfolioTitle: "little things i've made ♡",
  portfolioSub: "a little collection of things i've created, worked on, or simply had fun making.",
  skillsTitle: "things i love ♡",
  skillsSub: "with passion, with love, with dreams",
  skills: skillsDef.map((s) => ({ ...s })),
  currentLabel: "currently... ♡",
  currentSub: "and probably trying something new again soon",
  currentItems: [...currentDef],
  orgs: orgsDef.map((o) => ({ ...o })),
  handmadeTitle: handmadeDef.title,
  handmadeSub: handmadeDef.sub,
  handmadeParas: [...handmadeDef.paras],
  music: musicDef.map((m) => ({ ...m })),
  cv: siteDef.cv,
  whatsapp: siteDef.whatsapp,
  email: siteDef.email,
};

export type ContentState = {
  site: SiteContent;
  aboutParas: string[];
  works: Work[];
};

const defaults: ContentState = {
  site: siteDefaults,
  aboutParas: [...aboutDef.paras],
  works: worksDef.map((d) => ({
    ...d,
    aspect: (d as any).aspect ?? "aspect-[3/4]",
    tone: (d as any).tone ?? "from-mauve to-butter",
    id: String(d.id),
  })),
};

const ContentCtx = createContext<ContentState>(defaults);

export function useContent() {
  return useContext(ContentCtx);
}

function strOr(v: any, fallback: string) {
  return typeof v === "string" ? v : fallback;
}

function mapSkills(v: unknown, fallback: Skill[]): Skill[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((it, i) => {
    const o = (it ?? {}) as Record<string, any>;
    return {
      id: strOr(o.id, `s_${i}`),
      icon: strOr(o.icon, "flower"),
      emoji: strOr(o.emoji, "🌸"),
      title: strOr(o.title, ""),
      en: strOr(o.en, ""),
      idn: strOr(o.idn, ""),
    };
  });
}

function mapOrgs(v: unknown, fallback: Org[]): Org[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((it, i) => {
    const o = (it ?? {}) as Record<string, any>;
    return { org: strOr(o.org, ""), role: strOr(o.role, ""), emoji: strOr(o.emoji, "⭐") };
  });
}

function mapSongs(v: unknown, fallback: Song[]): Song[] {
  if (!Array.isArray(v) || v.length === 0) return fallback;
  return v.map((it, i) => {
    const o = (it ?? {}) as Record<string, any>;
    return { title: strOr(o.title, `Lagu ${i + 1}`), src: strOr(o.src, "/music/RIPPLES.mp3") };
  });
}

function mergeSite(data: Record<string, unknown>): SiteContent {
  const d = data as Record<string, any>;
  return {
    name: strOr(d.name, siteDefaults.name),
    shortName: strOr(d.shortName, siteDefaults.shortName),
    motto: Array.isArray(d.motto) ? d.motto.map(String) : siteDefaults.motto,
    intro: strOr(d.intro, siteDefaults.intro),
    heroBadge: strOr(d.heroBadge, siteDefaults.heroBadge),
    heroTitle: strOr(d.heroTitle, siteDefaults.heroTitle),
    heroIntro: strOr(d.heroIntro, siteDefaults.heroIntro),
    aboutTitle: strOr(d.aboutTitle, siteDefaults.aboutTitle),
    aboutSub: strOr(d.aboutSub, siteDefaults.aboutSub),
    aboutRole: strOr(d.aboutRole, siteDefaults.aboutRole),
    aboutPhoto: strOr(d.aboutPhoto, siteDefaults.aboutPhoto),
    instagram: strOr(d.instagram, siteDefaults.instagram).replace("@", ""),
    instagramLabel: strOr(d.instagramLabel, siteDefaults.instagramLabel),
    contactTitle: strOr(d.contactTitle, siteDefaults.contactTitle),
    contactDesc: strOr(d.contactDesc, siteDefaults.contactDesc),
    portfolioTitle: strOr(d.portfolioTitle, siteDefaults.portfolioTitle),
    portfolioSub: strOr(d.portfolioSub, siteDefaults.portfolioSub),
    skillsTitle: strOr(d.skillsTitle, siteDefaults.skillsTitle),
    skillsSub: strOr(d.skillsSub, siteDefaults.skillsSub),
    skills: mapSkills(d.skills, siteDefaults.skills),
    currentLabel: strOr(d.currentLabel, siteDefaults.currentLabel),
    currentSub: strOr(d.currentSub, siteDefaults.currentSub),
    currentItems: Array.isArray(d.currentItems)
      ? d.currentItems.map(String)
      : siteDefaults.currentItems,
    orgs: mapOrgs(d.orgs, siteDefaults.orgs),
    handmadeTitle: strOr(d.handmadeTitle, siteDefaults.handmadeTitle),
    handmadeSub: strOr(d.handmadeSub, siteDefaults.handmadeSub),
    handmadeParas: Array.isArray(d.handmadeParas)
      ? d.handmadeParas.map(String)
      : siteDefaults.handmadeParas,
    music: mapSongs(d.music, siteDefaults.music),
    cv: strOr(d.cv, siteDefaults.cv),
    whatsapp: strOr(d.whatsapp, siteDefaults.whatsapp),
    email: strOr(d.email, siteDefaults.email),
  };
}

/** Konten situs: ambil dari Firestore (content/main + works) dan otomatis mengikuti perubahan. */
export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentState>(defaults);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    try {
      const db = getFirebaseDb();

      const unsubContent = onSnapshot(
        doc(db, "content", "main"),
        (snap) => {
          const data = snap.data();
          if (!data) return;
          setContent((c) => ({
            ...c,
            site: mergeSite(data),
            aboutParas: Array.isArray(data.aboutParas)
              ? data.aboutParas.map(String)
              : c.aboutParas,
          }));
        },
        () => {},
      );

      const qWorks = query(collection(db, "works"), orderBy("order", "asc"));
      const unsubWorks = onSnapshot(
        qWorks,
        (snap) => {
          const list: Work[] = [];
          snap.forEach((d) => {
            const w = d.data() as Record<string, any>;
            list.push({
              id: d.id,
              title: strOr(w.title, ""),
              desc: strOr(w.desc, ""),
              idn: strOr(w.idn, ""),
              image: strOr(w.image, ""),
              aspect: strOr(w.aspect, "aspect-[3/4]"),
              tone: strOr(w.tone, "from-mauve to-butter"),
              createdAt: typeof w.createdAt === "number" ? w.createdAt : undefined,
            });
          });
          if (list.length > 0) setContent((c) => ({ ...c, works: list }));
        },
        () => {},
      );

      return () => {
        unsubContent();
        unsubWorks();
      };
    } catch {
      return;
    }
  }, []);

  return <ContentCtx.Provider value={content}>{children}</ContentCtx.Provider>;
}