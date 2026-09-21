"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, limit } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  ArrowLeft,
  BarChart3,
  ExternalLink,
  ImagePlus,
  KeyRound,
  LayoutDashboard,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  GripVertical,
  Trash2,
  Upload,
} from "lucide-react";
import { getFirebaseAuth, getFirebaseDb, getFirebaseStorage, isFirebaseConfigured } from "../../lib/firebaseConfig";

const ASPECTS = [
  "aspect-[3/1]",
  "aspect-[16/9]",
  "aspect-[4/5]",
  "aspect-[1/1]",
  "aspect-[3/4]",
  "aspect-[9/16]",
  "aspect-[9/19]",
];
const TONES = [
  "from-mauve to-butter",
  "from-butter to-blush",
  "from-blush to-butter",
  "from-blush to-mauve",
  "from-butter to-mauve",
  "from-mauve to-blush",
];
const CONTENT_FIELDS = [
  "name",
  "shortName",
  "heroBadge",
  "heroIntro",
  "motto",
  "aboutTitle",
  "aboutSub",
  "aboutParas",
  "aboutRole",
  "aboutPhoto",
  "instagram",
  "instagramLabel",
  "contactTitle",
  "contactDesc",
  "portfolioTitle",
  "portfolioSub",
  "whatsapp",
  "email",
  "cv",
] as const;

type ContentData = Partial<Record<(typeof CONTENT_FIELDS)[number], any>>;
type WorkRow = { id: string; title: string; desc: string; idn: string; image: string; aspect: string; tone: string; order: number };
type Visit = { id: string; ip?: string; browser?: string; os?: string; device?: string; path?: string; screen?: string; ref?: string; label?: string; kind?: string; ts?: { seconds?: number }; date?: string };

function toDate(ts?: Visit["ts"]) {
  if (!ts?.seconds) return "";
  return new Date(ts.seconds * 1000).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

const emptyWork = (order: number): Omit<WorkRow, "id"> => ({ title: "", desc: "", idn: "", image: "", aspect: "aspect-[3/4]", tone: "from-mauve to-butter", order });

async function uploadImage(file: File, path: string): Promise<string> {
  const storage = getFirebaseStorage();
  const refPath = ref(storage, `${path}${path.endsWith("/") ? "" : "/"}${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
  await uploadBytes(refPath, file);
  return getDownloadURL(refPath);
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-[2rem] p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-[#8B3A4D]">
      {children}
      {hint ? <span className="ml-2 font-normal text-[#8B3A4D]/50">{hint}</span> : null}
    </label>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-[#FFC0CB] text-[#8B3A4D] shadow-lg shadow-[#FFC0CB]/40" : "text-[#8B3A4D]/70 hover:bg-white/60"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function UploadField({ label, onUrl, value }: { label: string; onUrl: (url: string) => void; value: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={value}
          onChange={(e) => onUrl(e.target.value)}
          placeholder="Tulis path lokal seperti /images/foto al.png — atau upload"
          className="field"
        />
        <label className="btn btn-glass inline-flex cursor-pointer items-center justify-center gap-2 !min-h-12 !rounded-2xl sm:shrink-0">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try {
                onUrl(await uploadImage(f, "images"));
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      {value ? (
        <div className="mt-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Pratinjau" className="h-28 w-28 rounded-2xl border border-white/40 object-cover shadow" />
        </div>
      ) : null}
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5 text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFC0CB]/60 text-[#8B3A4D]">
        {icon}
      </div>
      <p className="text-3xl font-bold text-[#8B3A4D]">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#8B3A4D]/60">{label}</p>
    </div>
  );
}

function Breakdown({ title, rows }: { title: string; rows: [string, number][] }) {
  if (!rows.length) return null;
  const max = Math.max(...rows.map(([, n]) => n));
  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-[#8B3A4D]">{title}</h3>
      <ul className="space-y-2">
        {rows.map(([name, n]) => (
          <li key={name}>
            <div className="flex items-center justify-between text-sm text-[#8B3A4D]">
              <span className="truncate pr-3">{name || "—"}</span>
              <span className="font-semibold">{n}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#FFC0CB]/30">
              <div className="h-full rounded-full bg-gradient-to-r from-[#E8A0BF] to-[#FFC0CB]" style={{ width: `${(n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ContentTab() {
  const [data, setData] = useState<ContentData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const db = getFirebaseDb();
    const unsub = onSnapshot(
      doc(db, "content", "main"),
      (snap) => {
        const d = snap.data();
        setData(
          d
            ? {
                name: (d.name ?? "") as string,
                shortName: (d.shortName ?? "") as string,
                heroBadge: (d.heroBadge ?? "") as string,
                heroIntro: (d.heroIntro ?? "") as string,
                motto: Array.isArray(d.motto) ? (d.motto as string[]).join(", ") : "",
                aboutTitle: (d.aboutTitle ?? "") as string,
                aboutSub: (d.aboutSub ?? "") as string,
                aboutParas: Array.isArray(d.aboutParas) ? (d.aboutParas as string[]).join("\n") : "",
                aboutRole: (d.aboutRole ?? "") as string,
                aboutPhoto: (d.aboutPhoto ?? "") as string,
                instagram: (d.instagram ?? "") as string,
                instagramLabel: (d.instagramLabel ?? "") as string,
                contactTitle: (d.contactTitle ?? "") as string,
                contactDesc: (d.contactDesc ?? "") as string,
                portfolioTitle: (d.portfolioTitle ?? "") as string,
                portfolioSub: (d.portfolioSub ?? "") as string,
                whatsapp: (d.whatsapp ?? "") as string,
                email: (d.email ?? "") as string,
                cv: (d.cv ?? "") as string,
              }
            : {},
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  const set = (key: (typeof CONTENT_FIELDS)[number]) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setData((d) => ({ ...d, [key]: e.target.value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const db = getFirebaseDb();
      const patch: Record<string, unknown> = {};
      for (const k of CONTENT_FIELDS) {
        const v = String(data[k] ?? "");
        if (k === "motto") patch[k] = v.split(",").map((s) => s.trim());
        else if (k === "aboutParas") patch[k] = v.split("\n").map((s) => s.trim()).filter(Boolean);
        else patch[k] = v;
      }
      await setDoc(doc(db, "content", "main"), patch, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Card>Membaca konten dari Firestore…</Card>;

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Nama display (navbar/footer)</Label>
              <input className="field" value={data.name ?? ""} onChange={set("name")} />
            </div>
            <div>
              <Label>Panggilan (shortName)</Label>
              <input className="field" value={data.shortName ?? ""} onChange={set("shortName")} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Badge hero</Label>
              <input className="field" value={data.heroBadge ?? ""} onChange={set("heroBadge")} />
            </div>
            <div>
              <Label>Motto <span className="font-normal text-[#8B3A4D]/50">(pisah koma)</span></Label>
              <input className="field" value={data.motto ?? ""} onChange={set("motto")} placeholder="with passion, with love, with dreams" />
            </div>
          </div>
          <div>
            <Label>Intro hero <span className="font-normal text-[#8B3A4D]/50">(enter = baris baru)</span></Label>
            <textarea rows={4} className="field resize-none" value={data.heroIntro ?? ""} onChange={set("heroIntro")} />
          </div>

          <hr className="border-[#8B3A4D]/15" />
          <h3 className="text-lg font-semibold text-[#8B3A4D]">Bagian About</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Judul about</Label>
              <input className="field" value={data.aboutTitle ?? ""} onChange={set("aboutTitle")} />
            </div>
            <div>
              <Label>Subjudul about</Label>
              <input className="field" value={data.aboutSub ?? ""} onChange={set("aboutSub")} />
            </div>
            <div>
              <Label>Role / label foto</Label>
              <input className="field" value={data.aboutRole ?? ""} onChange={set("aboutRole")} />
            </div>
            <div>
              <Label>Foto about</Label>
              <UploadField
                label=""
                value={data.aboutPhoto ?? ""}
                onUrl={(url) => setData((d) => ({ ...d!, aboutPhoto: url }))}
              />
            </div>
          </div>
          <div>
            <Label>Paragraf about <span className="font-normal text-[#8B3A4D]/50">(enter = paragraf baru)</span></Label>
            <textarea rows={5} className="field resize-none" value={data.aboutParas ?? ""} onChange={set("aboutParas")} />
          </div>

          <hr className="border-[#8B3A4D]/15" />
          <h3 className="text-lg font-semibold text-[#8B3A4D]">Judul Section</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Judul portfolio</Label>
              <input className="field" value={data.portfolioTitle ?? ""} onChange={set("portfolioTitle")} />
            </div>
            <div>
              <Label>Subjudul portfolio</Label>
              <input className="field" value={data.portfolioSub ?? ""} onChange={set("portfolioSub")} />
            </div>
            <div>
              <Label>Judul kontak</Label>
              <input className="field" value={data.contactTitle ?? ""} onChange={set("contactTitle")} />
            </div>
            <div>
              <Label>Deskripsi kontak</Label>
              <input className="field" value={data.contactDesc ?? ""} onChange={set("contactDesc")} />
            </div>
          </div>

          <hr className="border-[#8B3A4D]/15" />
          <h3 className="text-lg font-semibold text-[#8B3A4D]">Kontak & Media</h3>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label>Instagram</Label>
              <input className="field" value={data.instagram ?? ""} onChange={set("instagram")} placeholder="al_icacraft" />
            </div>
            <div>
              <Label>WhatsApp <span className="font-normal text-[#8B3A4D]/50">(62…)</span></Label>
              <input className="field" value={data.whatsapp ?? ""} onChange={set("whatsapp")} />
            </div>
            <div>
              <Label>Email</Label>
              <input className="field" value={data.email ?? ""} onChange={set("email")} />
            </div>
          </div>
          <div>
            <Label>Deskripsi kartu Instagram</Label>
            <input className="field" value={data.instagramLabel ?? ""} onChange={set("instagramLabel")} />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn btn-primary">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Simpan konten
          </button>
          {saved && <span className="text-sm font-medium text-[#3a9d5d]">Tersimpan! Situs langsung ikut berubah.</span>}
        </div>
      </Card>
    </div>
  );
}

function WorkForm({ initial, onSave, onCancel }: { initial: Omit<WorkRow, "id">; onSave: (w: Omit<WorkRow, "id">) => void; onCancel: () => void }) {
  const [w, setW] = useState(initial);
  const set = (k: keyof Omit<WorkRow, "id">) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setW((x) => ({ ...x, [k]: e.target.value }));

  return (
    <div className="rounded-2xl border border-[#FFC0CB]/40 bg-white/50 p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Judul</Label>
          <input className="field" value={w.title} onChange={set("title")} />
        </div>
        <div>
          <Label>Urutan <span className="font-normal text-[#8B3A4D]/50">(kecil = dulu)</span></Label>
          <input type="number" className="field" value={w.order} onChange={set("order")} />
        </div>
        <div>
          <Label>Caption (EN)</Label>
          <input className="field" value={w.desc} onChange={set("desc")} />
        </div>
        <div>
          <Label>Caption (IDN)</Label>
          <input className="field" value={w.idn} onChange={set("idn")} />
        </div>
        <div>
          <Label>Rasio frame</Label>
          <select className="field" value={w.aspect} onChange={set("aspect")}>
            {ASPECTS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Warna cadangan</Label>
          <select className="field" value={w.tone} onChange={set("tone")}>
            {TONES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <UploadField label="Gambar karya" value={w.image} onUrl={(url) => setW((x) => ({ ...x, image: url }))} />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={() => onSave(w)}
          className="btn btn-primary"
        >
          <Save className="h-5 w-5" /> Simpan
        </button>
        <button onClick={onCancel} className="btn btn-glass">Batal</button>
      </div>
    </div>
  );
}

function PortfolioTab() {
  const [rows, setRows] = useState<WorkRow[]>([]);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<WorkRow, "id">>(emptyWork(0));
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => {
    const db = getFirebaseDb();
    const q = query(collection(db, "works"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const list: WorkRow[] = [];
      snap.forEach((s) => {
        const d = s.data() as Record<string, any>;
        list.push({ id: s.id, title: String(d.title ?? ""), desc: String(d.desc ?? ""), idn: String(d.idn ?? ""), image: String(d.image ?? ""), aspect: String(d.aspect ?? "aspect-[3/4]"), tone: String(d.tone ?? "from-mauve to-butter"), order: Number(d.order ?? 0) });
      });
      setRows(list);
    });
    return unsub;
  }, []);

  const save = async (w: Omit<WorkRow, "id">) => {
    const db = getFirebaseDb();
    if (editing === "new") {
      await addDoc(collection(db, "works"), { ...w, createdAt: Date.now() });
    } else if (editing) {
      await setDoc(doc(db, "works", editing), w, { merge: true });
    }
    setEditing(null);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Hapus karya ini?")) return;
    await deleteDoc(doc(getFirebaseDb(), "works", id));
  };

  const startNew = () => {
    setDraft(emptyWork(rows.length));
    setEditing("new");
  };

  const onDropRow = (fromId: string, toId: string) => {
    const from = rows.findIndex((r) => r.id === fromId);
    const to = rows.findIndex((r) => r.id === toId);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const final = next.map((r, i) => ({ ...r, order: i }));
    setRows(final);
    setDragId(null);
    const db = getFirebaseDb();
    final.forEach((r) => {
      setDoc(doc(db, "works", r.id), { order: r.order }, { merge: true });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#8B3A4D]">Portfolio — little things i've made ♡</h2>
        <button onClick={startNew} className="btn btn-primary">
          <Plus className="h-5 w-5" /> Tambah karya
        </button>
      </div>

      {editing === "new" && (
        <WorkForm initial={draft} onSave={save} onCancel={() => setEditing(null)} />
      )}

      <Card className="overflow-x-auto !p-0">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-[#8B3A4D]/15 text-xs uppercase tracking-wide text-[#8B3A4D]/60">
              <th className="px-5 py-3">Seret</th>
              <th className="px-5 py-3">Karya (caption EN)</th>
              <th className="px-5 py-3">Caption IDN</th>
              <th className="px-5 py-3">Rasio</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <FragmentRow
                key={row.id}
                index={i}
                row={row}
                editing={editing === row.id}
                dragging={dragId === row.id}
                dragSource={dragId}
                onEdit={() => { setDraft(row); setEditing(row.id); }}
                onRemove={() => remove(row.id)}
                onCancel={() => setEditing(null)}
                onSave={(w) => save(w)}
                onDragStart={() => setDragId(row.id)}
                onDragOver={() => {}}
                onDropped={onDropRow}
              />
            ))}
          </tbody>
        </table>
        <p className="border-t border-[#8B3A4D]/10 px-5 py-3 text-xs text-[#8B3A4D]/50">
          Tahan lalu seret baris untuk mengubah urutan — urutan tersimpan otomatis. Ukuran/frame diatur lewat kolom Rasio.
        </p>
        {!rows.length && <p className="px-5 py-8 text-center text-[#8B3A4D]/60">Belum ada karya. Klik "Tambah karya".</p>}
      </Card>
    </div>
  );
}

function FragmentRow({ index, row, editing, dragging, dragSource, onEdit, onRemove, onCancel, onSave, onDragStart, onDragOver, onDropped }: { index: number; row: WorkRow; editing: boolean; dragging?: boolean; dragSource?: string | null; onEdit: () => void; onRemove: () => void; onCancel: () => void; onSave: (w: Omit<WorkRow, "id">) => void; onDragStart?: () => void; onDragOver?: () => void; onDropped?: (fromId: string, toId: string) => void }) {
  if (editing) {
    return (
      <tr>
        <td colSpan={6} className="px-3 py-3">
          <WorkForm initial={row} onSave={onSave} onCancel={onCancel} />
        </td>
      </tr>
    );
  }
  return (
    <tr
      draggable
      onDragStart={onDragStart}
      onDragEnd={() => undefined}
      onDragOver={(e) => { e.preventDefault(); onDragOver?.(); }}
      onDrop={(e) => { e.preventDefault(); if (onDropped && dragSource && dragSource !== row.id) onDropped(dragSource, row.id); }}
      className={`border-b border-[#8B3A4D]/10 last:border-0 ${dragging ? "opacity-40" : ""} cursor-grab active:cursor-grabbing`}
      aria-label={`Urutkan: ${row.title}`}
    >
      <td className="px-5 py-3 text-[#8B3A4D]/60">
        <GripVertical className="inline h-5 w-5" />
        <span className="ml-1 text-xs">{index + 1}</span>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center gap-3">
          <div className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br ${row.tone}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {row.image && <img src={row.image} alt="" className="h-full w-full object-cover" />}
          </div>
          <span className="font-semibold text-[#8B3A4D]">{row.title || "(tanpa judul)"}</span>
        </div>
      </td>
      <td className="px-5 py-3 text-[#8B3A4D]/80">{row.idn || "—"}</td>
      <td className="px-5 py-3 text-xs text-[#8B3A4D]/60">{row.aspect}</td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-2">
          <button onClick={onEdit} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-full bg-white/60 text-[#8B3A4D] transition hover:bg-[#FFC0CB]/60">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={onRemove} aria-label="Hapus" className="grid h-9 w-9 place-items-center rounded-full bg-white/60 text-danger transition hover:bg-danger/15">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatsTab() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const db = getFirebaseDb();
      const q = query(collection(db, "visits"), orderBy("ts", "desc"), limit(1500));
      const snap = await getDocs(q);
      const list: Visit[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Visit, "id">) }));
      setVisits(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const views = visits.filter((v) => v.kind !== "click");
    const clicks = visits.filter((v) => v.kind === "click");
    const today = new Date().toISOString().slice(0, 10);
    const todayCount = views.filter((v) => v.date === today).length;
    const weekAgo = Date.now() - 7 * 864e5;
    const weekCount = views.filter((v) => v.ts && v.ts.seconds && v.ts.seconds * 1000 >= weekAgo).length;
    const uniqueIp = new Set(views.map((v) => v.ip).filter(Boolean)).size;

    const daily = new Map<string, number>();
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
      daily.set(d, 0);
    }
    views.forEach((v) => {
      if (v.date && daily.has(v.date)) daily.set(v.date, (daily.get(v.date) ?? 0) + 1);
    });

    const bins = (key: "browser" | "os" | "device") =>
      [...views.reduce((m, v) => m.set(v[key] ?? "—", (m.get(v[key] ?? "—") ?? 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]).slice(0, 6);

    const pages = [...views.reduce((m, v) => m.set(v.path ?? "/", (m.get(v.path ?? "/") ?? 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]).slice(0, 5);

    const ipRows = [...views.reduce((m, v) => {
      const k = v.ip ?? "—";
      const cur = m.get(k) ?? { count: 0, devices: new Set<string>(), os: new Set<string>(), last: 0 };
      cur.count += 1;
      if (v.device) cur.devices.add(v.device);
      if (v.os) cur.os.add(v.os);
      if (v.ts?.seconds) cur.last = Math.max(cur.last, v.ts.seconds * 1000);
      return m.set(k, cur);
    }, new Map<string, { count: number; devices: Set<string>; os: Set<string>; last: number }>())]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20);

    const interactions = [...clicks.reduce((m, v) => m.set(v.label ?? "—", (m.get(v.label ?? "—") ?? 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]).slice(0, 10);

    return { views: views.length, clicks: clicks.length, todayCount, weekCount, uniqueIp, daily, bins, pages, ipRows, interactions };
  }, [visits]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-[#8B3A4D]">Statistik pengunjung</h2>
        <button onClick={load} className="btn btn-glass" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Muat ulang
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatBox label="Kunjungan" value={stats.views} icon={<BarChart3 className="h-5 w-5" />} />
        <StatBox label="Hari ini" value={stats.todayCount} />
        <StatBox label="7 hari" value={stats.weekCount} />
        <StatBox label="IP unik" value={stats.uniqueIp} />
        <StatBox label="Interaksi" value={stats.clicks} icon={<Pencil className="h-5 w-5" />} />
      </div>

      <Card>
        <h3 className="mb-4 text-lg font-semibold text-[#8B3A4D]">Pengunjung 14 hari terakhir</h3>
        <div className="flex h-32 items-end gap-1.5">
          {[...stats.daily.entries()].map(([d, n]) => (
            <div key={d} className="flex flex-1 flex-col items-center gap-1" title={`${d}: ${n}`}>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-[#E8A0BF] to-[#FFC0CB]"
                style={{ height: `${Math.max((n / Math.max(1, ...stats.daily.values())) * 100, 4)}%` }}
              />
              <span className="rotate-45 text-[9px] text-[#8B3A4D]/50">{d.slice(8)}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Breakdown title="Perangkat" rows={stats.bins("device")} />
        <Breakdown title="Browser" rows={stats.bins("browser")} />
        <Breakdown title="Sistem operasi" rows={stats.bins("os")} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-[#8B3A4D]">Halaman teratas</h3>
          <ul className="space-y-2 text-sm text-[#8B3A4D]">
            {stats.pages.map(([p, n]) => (
              <li key={p} className="flex justify-between">
                <span className="truncate pr-3">{p}</span>
                <span className="font-semibold">{n}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-[#8B3A4D]">Interaksi teratas</h3>
          <ul className="space-y-2 text-sm text-[#8B3A4D]">
            {stats.interactions.map(([l, n]) => (
              <li key={l} className="flex justify-between">
                <span className="truncate pr-3">{l}</span>
                <span className="font-semibold">{n}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="overflow-x-auto !p-0">
        <h3 className="px-6 pt-6 text-lg font-semibold text-[#8B3A4D]">Peta pengunjung (IP & perangkat)</h3>
        <table className="mt-3 w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#8B3A4D]/15 text-xs uppercase tracking-wide text-[#8B3A4D]/60">
              <th className="px-6 py-3">IP</th>
              <th className="px-6 py-3">Jumlah</th>
              <th className="px-6 py-3">Perangkat</th>
              <th className="px-6 py-3">OS</th>
              <th className="px-6 py-3">Terakhir</th>
            </tr>
          </thead>
          <tbody>
            {stats.ipRows.map(([ip, r]) => (
              <tr key={ip} className="border-b border-[#8B3A4D]/10 last:border-0">
                <td className="px-6 py-2.5 font-mono text-[#8B3A4D]">{ip}</td>
                <td className="px-6 py-2.5 font-semibold text-[#8B3A4D]">{r.count}</td>
                <td className="px-6 py-2.5 text-[#8B3A4D]/80">{[...r.devices].join(", ")}</td>
                <td className="px-6 py-2.5 text-[#8B3A4D]/80">{[...r.os].join(", ")}</td>
                <td className="px-6 py-2.5 text-[#8B3A4D]/60">{new Date(r.last).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card className="overflow-x-auto !p-0">
        <h3 className="px-6 pt-6 text-lg font-semibold text-[#8B3A4D]">Aktivitas terbaru</h3>
        <table className="mt-3 w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-[#8B3A4D]/15 text-xs uppercase tracking-wide text-[#8B3A4D]/60">
              <th className="px-6 py-3">Waktu</th>
              <th className="px-6 py-3">Jenis</th>
              <th className="px-6 py-3">IP</th>
              <th className="px-6 py-3">Perangkat</th>
              <th className="px-6 py-3">Browser</th>
              <th className="px-6 py-3">Halaman</th>
            </tr>
          </thead>
          <tbody>
            {visits.slice(0, 25).map((v) => (
              <tr key={v.id} className="border-b border-[#8B3A4D]/10 last:border-0">
                <td className="px-6 py-2.5 text-[#8B3A4D]/70">{toDate(v.ts)}</td>
                <td className="px-6 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v.kind === "click" ? "bg-[#E8A0BF]/40 text-[#8B3A4D]" : "bg-[#FFC0CB]/40 text-[#8B3A4D]"}`}>
                    {v.kind === "click" ? v.label || "klik" : "kunjungan"}
                  </span>
                </td>
                <td className="px-6 py-2.5 font-mono text-[#8B3A4D]">{v.ip ?? "—"}</td>
                <td className="px-6 py-2.5 text-[#8B3A4D]/80">{v.device ?? "—"} {v.screen ? `· ${v.screen}` : ""}</td>
                <td className="px-6 py-2.5 text-[#8B3A4D]/80">{v.browser ?? "—"}</td>
                <td className="px-6 py-2.5 text-[#8B3A4D]/80">{v.path ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function Admin() {
  const [user, setUser] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"konten" | "portfolio" | "stats">("konten");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => setUser(Boolean(u)));
    return unsub;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (err: any) {
      const code = err?.code ?? "";
      if (code === "auth/configuration-not-found") {
        setError("Authentication belum diaktifkan di Firebase Console (Build → Authentication → Sign-in method → Email/Password → Enable).");
      } else {
        setError(err.message || "Gagal masuk. Periksa email & password.");
      }
    }
  };

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E1]/30 px-6">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 rounded-[3rem] border border-white/30 bg-white/40 p-12 shadow-2xl shadow-[#FFC0CB]/20 backdrop-blur-3xl">
          <div className="text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-3xl bg-[#FFC0CB]/60 text-[#8B3A4D]">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="font-playfair text-4xl text-[#8B3A4D]">Login Admin</h1>
            <p className="mt-2 text-sm text-[#8B3A4D]/60">Masuk untuk mengelola konten & statistik.</p>
          </div>
          {error && <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{error}</p>}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#8B3A4D]">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field" placeholder="email@kamu.com" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#8B3A4D]">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field" placeholder="Password" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary btn-shine w-full !min-h-14 text-lg">Masuk</button>
          <p className="text-center text-xs text-[#8B3A4D]/50">
            Masuk dengan akun Firebase (email & password) yang dibuat di Firebase Console → Authentication → Add user.
            Lupa password? Reset di console → Authentication → user → Reset password.
          </p>
          <a href="/" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#8B3A4D]/60 hover:text-[#8B3A4D]">
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </a>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E1]/30 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-playfair text-4xl text-[#8B3A4D] md:text-5xl">Dashboard Admin</h1>
            <p className="mt-1 text-[#8B3A4D]/60">Kelola konten, karya, dan lihat siapa saja yang mampir ♡</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-glass">
              <ExternalLink className="h-4 w-4" /> Buka situs
            </a>
            <button type="button" onClick={() => signOut(getFirebaseAuth())} className="btn btn-glass text-danger">
              Keluar
            </button>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          <TabButton active={tab === "konten"} onClick={() => setTab("konten")} icon={<LayoutDashboard className="h-4 w-4" />}>
            Konten
          </TabButton>
          <TabButton active={tab === "portfolio"} onClick={() => setTab("portfolio")} icon={<ImagePlus className="h-4 w-4" />}>
            Portfolio
          </TabButton>
          <TabButton active={tab === "stats"} onClick={() => setTab("stats")} icon={<BarChart3 className="h-4 w-4" />}>
            Statistik
          </TabButton>
        </nav>

        {tab === "konten" && <ContentTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "stats" && <StatsTab />}
      </div>
    </main>
  );
}