"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_CONTENT } from "../lib/defaultContent";

export type Work = {
  id: string; title: string; description: string; description_id: string;
  image_url: string; aspect_class: string; tone_class: string; sort_order: number;
};

type ContentShape = Record<string, Record<string, unknown>>;
type Ctx = { content: ContentShape; works: Work[]; loading: boolean; isPreview: boolean };

const ContentContext = createContext<Ctx>({ content: DEFAULT_CONTENT, works: [], loading: true, isPreview: false });

export function useContent() {
  return useContext(ContentContext);
}

/**
 * Ambil konten dari /api/content (publik). Kalau `previewEndpoint` diisi
 * (dipakai halaman /admin/preview/[key]), fetch dari situ sebagai gantinya
 * supaya draft yang belum tayang bisa dilihat dulu sebelum publish.
 */
export function ContentProvider({ children, previewEndpoint }: { children: ReactNode; previewEndpoint?: string }) {
  const [state, setState] = useState<Ctx>({ content: DEFAULT_CONTENT, works: [], loading: true, isPreview: Boolean(previewEndpoint) });

  useEffect(() => {
    let cancelled = false;
    fetch(previewEndpoint ?? "/api/content", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setState({
          content: { ...DEFAULT_CONTENT, ...data.content },
          works: Array.isArray(data.works) ? data.works : [],
          loading: false,
          isPreview: Boolean(data.isPreview),
        });
      })
      .catch(() => {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      });
    return () => { cancelled = true; };
  }, [previewEndpoint]);

  return <ContentContext.Provider value={state}>{children}</ContentContext.Provider>;
}
