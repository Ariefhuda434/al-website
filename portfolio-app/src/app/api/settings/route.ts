import { NextResponse } from "next/server";
import { readJSON, writeJSON } from "../../../lib/blobStore";

const OWNER = "nisaalmaghirah@gmail.com";
const PATH = "data/settings.json";

type Settings = {
  owner: string;
  allowedEmails: string[];
};

export async function GET() {
  const s = await readJSON<Settings>(PATH, { owner: OWNER, allowedEmails: [OWNER] });
  return NextResponse.json(s);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Partial<Settings>;
    const current = await readJSON<Settings>(PATH, { owner: OWNER, allowedEmails: [OWNER] });
    const next: Settings = {
      owner: typeof body.owner === "string" && body.owner ? body.owner : current.owner || OWNER,
      allowedEmails: Array.isArray(body.allowedEmails) ? body.allowedEmails : current.allowedEmails,
    };
    if (!next.allowedEmails.includes(next.owner)) next.allowedEmails.push(next.owner);
    await writeJSON(PATH, next);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal" },
      { status: 500 }
    );
  }
}