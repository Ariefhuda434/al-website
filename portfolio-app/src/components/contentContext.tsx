"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "../lib/firebaseConfig";
import { about as aboutDef, site as siteDef, works as worksDef } from "../lib/content";

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

export type SiteContent = {
  name: string;
  shortName: string;
  motto: string[];
  intro: string;
  heroBadge: string;
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
  portfolioSub:
    "a little collection of things i've created, worked on, or simply had fun making.",
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
  works: worksDef.map((d) => ({ ...d, aspect: "aspect-[3/4]", tone: "from-mauve to-butter", id: String(d.id) })),
};

const ContentCtx = createContext<ContentState>(defaults);

export function useContent() {
  return useContext(ContentCtx);
}

function mergeSite(data: Record<string, unknown>): SiteContent {
  const d = data as Record<string, any>;
  return {
    name: typeof d.name === "string" ? d.name : siteDefaults.name,
    shortName: typeof d.shortName === "string" ? d.shortName : siteDefaults.shortName,
    motto: Array.isArray(d.motto) ? d.motto.map(String) : siteDefaults.motto,
    intro: typeof d.intro === "string" ? d.intro : siteDefaults.intro,
    heroBadge: typeof d.heroBadge === "string" ? d.heroBadge : siteDefaults.heroBadge,
    heroIntro: typeof d.heroIntro === "string" ? d.heroIntro : siteDefaults.heroIntro,
    aboutTitle: typeof d.aboutTitle === "string" ? d.aboutTitle : siteDefaults.aboutTitle,
    aboutSub: typeof d.aboutSub === "string" ? d.aboutSub : siteDefaults.aboutSub,
    aboutRole: typeof d.aboutRole === "string" ? d.aboutRole : siteDefaults.aboutRole,
    aboutPhoto: typeof d.aboutPhoto === "string" ? d.aboutPhoto : siteDefaults.aboutPhoto,
    instagram: typeof d.instagram === "string" ? d.instagram.replace("@", "") : siteDefaults.instagram,
    instagramLabel:
      typeof d.instagramLabel === "string" ? d.instagramLabel : siteDefaults.instagramLabel,
    contactTitle: typeof d.contactTitle === "string" ? d.contactTitle : siteDefaults.contactTitle,
    contactDesc: typeof d.contactDesc === "string" ? d.contactDesc : siteDefaults.contactDesc,
    portfolioTitle:
      typeof d.portfolioTitle === "string" ? d.portfolioTitle : siteDefaults.portfolioTitle,
    portfolioSub: typeof d.portfolioSub === "string" ? d.portfolioSub : siteDefaults.portfolioSub,
    cv: typeof d.cv === "string" ? d.cv : siteDefaults.cv,
    whatsapp: typeof d.whatsapp === "string" ? d.whatsapp : siteDefaults.whatsapp,
    email: typeof d.email === "string" ? d.email : siteDefaults.email,
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
              title: String(w.title ?? ""),
              desc: String(w.desc ?? ""),
              idn: String(w.idn ?? ""),
              image: String(w.image ?? ""),
              aspect: String(w.aspect ?? "aspect-[3/4]"),
              tone: String(w.tone ?? "from-mauve to-butter"),
              createdAt: typeof w.createdAt === "number" ? w.createdAt : undefined,
            });
          });
          setContent((c) => ({ ...c, works: list }));
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