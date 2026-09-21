export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "../../../lib/blobStore";
import { works as worksDefaults } from "../../../lib/content";

const CONTENT_PATH = "data/content.json";
const WORKS_PATH = "data/works.json";

type WorkRow = {
  id: string;
  title: string;
  desc: string;
  idn: string;
  image: string;
  aspect: string;
  tone: string;
  order?: number;
};

export async function GET() {
  const content = await readJSON<Record<string, unknown>>(CONTENT_PATH, {});
  const works = await readJSON<WorkRow[]>(WORKS_PATH, () =>
    worksDefaults.map((w, i) => ({
      id: String(w.id ?? `w_${i}`),
      title: w.title,
      desc: w.desc,
      idn: (w as { idn?: string }).idn ?? "",
      image: w.image,
      aspect: (w as { aspect?: string }).aspect ?? "aspect-[3/4]",
      tone: w.tone,
      order: i,
    }))
  );
  return NextResponse.json({ content, works: Array.isArray(works) ? works : [] });
}

export async function POST(request: Request) {
  try {
    const { file, data } = await request.json();
    if (file === "content") {
      await writeJSON(CONTENT_PATH, data ?? {});
      return NextResponse.json({ ok: true, file: "content" });
    }
    if (file === "works") {
      await writeJSON(WORKS_PATH, Array.isArray(data) ? data : []);
      return NextResponse.json({ ok: true, file: "works" });
    }
    return NextResponse.json({ error: "file harus 'content' atau 'works'" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menyimpan" },
      { status: 500 }
    );
  }
}