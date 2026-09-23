"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_CONTENT } from "../../lib/defaultContent";
import { SECTION_SCHEMA } from "../../lib/sectionSchema";
import SectionForm from "../../components/SectionForm";

type SessionUser = { id: number; email: string; role: "admin" | "superadmin" };
type SectionState = { published: Record<string, unknown>; draft: Record<string, unknown> | null; draftAt: string | null };
type Work = {
  id: string; title: string; desc: string; idn: string; image: string;
  aspect: string; tone: string; order: number; published: boolean;
};

const TABS = ["Konten", "Karya", "Statistik", "Pengaturan", "Akun", "Log"] as const;
type Tab = (typeof TABS)[number];

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="toast-in glass fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold">
      {message}
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("Konten");
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null));
  }, []);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (user === undefined) return <div className="p-10 text-center">Memuat…</div>;
  if (user === null) {
    if (typeof window !== "undefined") router.push("/admin/login");
    return null;
  }

  const isSuper = user.role === "superadmin";
  const visibleTabs = TABS.filter((t) => (t === "Akun" || t === "Log" ? isSuper : true));

  return (
    <div className="min-h-dvh bg-cream">
      <header className="glass sticky top-0 z-40 flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl">Kelola Situs</h1>
          <p className="text-xs text-muted">{user.email} · {user.role === "superadmin" ? "Superadmin" : "Admin"}</p>
        </div>
        <button onClick={logout} className="btn btn-glass !min-h-9 !px-4 text-xs">Keluar</button>
      </header>

      <nav role="tablist" aria-label="Tab dashboard" className="flex flex-wrap gap-2 px-6 py-4">
        {visibleTabs.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === t ? "bg-berry text-cream" : "glass-soft"}`}
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="px-6 pb-24">
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0}>
          {tab === "Konten" && <ContentTab notify={notify} />}
          {tab === "Karya" && <WorksTab notify={notify} />}
          {tab === "Statistik" && <StatsTab />}
          {tab === "Pengaturan" && <SettingsTab isSuper={isSuper} notify={notify} />}
          {tab === "Akun" && isSuper && <AccountsTab notify={notify} currentUserId={user.id} />}
          {tab === "Log" && isSuper && <LogsTab />}
        </div>
      </main>

      <Toast message={toast} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Konten (dengan draft + preview pop-up sebelum publish)
// ---------------------------------------------------------------------------
function ContentTab({ notify }: { notify: (m: string) => void }) {
  const [sections, setSections] = useState<Record<string, SectionState> | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/content").then((r) => r.json()).then((d) => {
      setSections(d.sections);
      const initial: Record<string, Record<string, unknown>> = {};
      for (const k of Object.keys(d.sections)) {
        const src = d.sections[k].draft ?? d.sections[k].published;
        initial[k] = JSON.parse(JSON.stringify(src)) as Record<string, unknown>;
      }
      setDrafts(initial);
    });
  }, []);

  useEffect(() => { load(); }, [load]);

  async function saveDraftAndPreview(key: string) {
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, content: drafts[key] }),
    });
    const data = await res.json();
    if (!res.ok) { notify(data.error || "Gagal menyimpan draft."); return; }
    window.open(`/admin/preview/${key}`, "_blank", "noopener,noreferrer");
    notify("Draft tersimpan. Preview dibuka di tab baru.");
    load();
  }

  async function publish(key: string) {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, content: drafts[key] }),
    });
    const data = await res.json();
    if (!res.ok) { notify(data.error || "Gagal publish."); return; }
    notify(`Section "${key}" tayang di situs.`);
    load();
  }

  async function discardDraft(key: string) {
    const res = await fetch(`/api/admin/content?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    notify(res.ok ? "Draft dibuang." : data.error || "Gagal membuang draft.");
    load();
  }

  if (!sections) {
    return (
      <div className="space-y-3" aria-busy="true">
        <div className="h-4 w-2/3 animate-pulse rounded bg-blush/40" aria-hidden="true" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-blush/30" aria-hidden="true" />
        <div className="h-24 w-full animate-pulse rounded-2xl bg-blush/30" aria-hidden="true" />
        <span className="sr-only">Memuat konten…</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-sm text-muted">
        Isi form tiap section. Klik <strong>Simpan &amp; Preview</strong> untuk melihat
        tampilannya dulu sebelum tayang ke publik, baru klik <strong>Publish</strong> kalau sudah cocok.
      </p>
      {Object.keys(DEFAULT_CONTENT).map((key) => {
        const s = sections[key];
        const hasDraft = Boolean(s?.draft);
        const schema = SECTION_SCHEMA[key] ?? { title: key, fields: [] };
        return (
          <div key={key} className="glass-soft rounded-2xl p-4">
            <button
              className="flex w-full items-center justify-between text-left font-semibold"
              aria-expanded={activeKey === key}
              aria-controls={`section-${key}`}
              onClick={() => setActiveKey(activeKey === key ? null : key)}
            >
              <span>
                {schema.title} <span className="text-xs text-muted">({key})</span>
                {hasDraft && <span className="ml-2 rounded-full bg-butter px-2 py-0.5 text-xs">draft belum publish</span>}
              </span>
              <span aria-hidden="true">{activeKey === key ? "−" : "+"}</span>
              <span className="sr-only">{activeKey === key ? "Tutup" : "Buka"} form {schema.title}</span>
            </button>
            {activeKey === key && (
              <div id={`section-${key}`} className="mt-4 space-y-3">
                <SectionForm
                  schema={schema}
                  value={drafts[key] ?? {}}
                  onChange={(next) => setDrafts((d) => ({ ...d, [key]: next }))}
                />
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => saveDraftAndPreview(key)} className="btn btn-glass !min-h-9 !px-4 text-xs">
                    Simpan &amp; Preview
                  </button>
                  <button onClick={() => publish(key)} className="btn btn-primary !min-h-9 !px-4 text-xs">
                    Publish
                  </button>
                  {hasDraft && (
                    <button onClick={() => discardDraft(key)} className="btn !min-h-9 !bg-transparent !px-4 text-xs text-danger">
                      Buang draft
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Karya (works)
// ---------------------------------------------------------------------------
function emptyWork(order: number): Work {
  return { id: "", title: "", desc: "", idn: "", image: "", aspect: "aspect-[3/4]", tone: "from-mauve to-butter", order, published: true };
}

function WorksTab({ notify }: { notify: (m: string) => void }) {
  const [works, setWorks] = useState<Work[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/works").then((r) => r.json()).then((d) => setWorks(d.works ?? []));
  }, []);
  useEffect(() => { load(); }, [load]);

  function update(i: number, patch: Partial<Work>) {
    setWorks((ws) => ws.map((w, idx) => (idx === i ? { ...w, ...patch } : w)));
  }
  function move(i: number, dir: -1 | 1) {
    setWorks((ws) => {
      const arr = [...ws];
      const j = i + dir;
      if (j < 0 || j >= arr.length) return ws;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return arr.map((w, idx) => ({ ...w, order: idx + 1 }));
    });
  }
  function remove(i: number) {
    setWorks((ws) => ws.filter((_, idx) => idx !== i));
  }
  function add() {
    setWorks((ws) => [...ws, emptyWork(ws.length + 1)]);
  }

  async function uploadImage(i: number, file: File) {
    setUploading(i);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(null);
    if (!res.ok) { notify(data.error || "Upload gagal."); return; }
    update(i, { image: data.url });
  }

  async function saveAll() {
    const res = await fetch("/api/admin/works", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ works }),
    });
    const data = await res.json();
    if (!res.ok) { notify(data.error || "Gagal menyimpan."); return; }
    notify("Karya tersimpan.");
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={add} className="btn btn-glass !min-h-9 !px-4 text-xs">+ Tambah karya</button>
        <button onClick={saveAll} className="btn btn-primary !min-h-9 !px-4 text-xs">Simpan semua</button>
      </div>
      {works.map((w, i) => (
        <div key={i} className="glass-soft grid gap-2 rounded-2xl p-4 sm:grid-cols-2">
          <input className="field" placeholder="Judul" value={w.title} onChange={(e) => update(i, { title: e.target.value })} />
          <input className="field" placeholder="Kelas tone (contoh: from-mauve to-butter)" value={w.tone} onChange={(e) => update(i, { tone: e.target.value })} />
          <textarea className="field sm:col-span-2" placeholder="Deskripsi (ID)" value={w.idn} onChange={(e) => update(i, { idn: e.target.value })} />
          <textarea className="field sm:col-span-2" placeholder="Description (EN)" value={w.desc} onChange={(e) => update(i, { desc: e.target.value })} />
          <div className="sm:col-span-2 flex items-center gap-3">
            {w.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
            ) : null}
            <input
              type="file" accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadImage(i, e.target.files[0])}
              className="text-xs"
            />
            {uploading === i && <span className="text-xs text-muted">Mengunggah…</span>}
          </div>
            <div className="sm:col-span-2 flex flex-wrap gap-2">
              <button onClick={() => move(i, -1)} aria-label={`Pindahkan karya ${w.title || i + 1} ke atas`} className="btn btn-glass !min-h-8 !px-3 text-xs">↑</button>
              <button onClick={() => move(i, 1)} aria-label={`Pindahkan karya ${w.title || i + 1} ke bawah`} className="btn btn-glass !min-h-8 !px-3 text-xs">↓</button>
              <label className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={w.published} onChange={(e) => update(i, { published: e.target.checked })} />
                Tayang
              </label>
              <button onClick={() => remove(i)} aria-label={`Hapus karya ${w.title || i + 1}`} className="btn !min-h-8 !bg-transparent !px-3 text-xs text-danger">Hapus</button>
            </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Statistik
// ---------------------------------------------------------------------------
type StatsData = {
  totalViews?: number;
  viewsToday?: number;
  totalClicks?: number;
  topClicks?: { label: string; c: number }[];
};
type AdminRow = { id: number; email: string; role: string; is_active: number };
type LogRow = { id: number; ts: number; action: string; admin_email?: string; result?: string };

function StatsTab() {
  const [data, setData] = useState<StatsData | null>(null);
  useEffect(() => { fetch("/api/admin/stats").then((r) => r.json()).then(setData); }, []);
  if (!data) return <p>Memuat…</p>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-soft rounded-2xl p-4 text-center"><p className="text-2xl font-bold">{data.totalViews}</p><p className="text-xs text-muted">Total kunjungan</p></div>
        <div className="glass-soft rounded-2xl p-4 text-center"><p className="text-2xl font-bold">{data.viewsToday}</p><p className="text-xs text-muted">Hari ini</p></div>
        <div className="glass-soft rounded-2xl p-4 text-center"><p className="text-2xl font-bold">{data.totalClicks}</p><p className="text-xs text-muted">Total klik</p></div>
      </div>
      <div className="glass-soft rounded-2xl p-4">
        <h3 className="mb-2 font-semibold">Klik terpopuler</h3>
        <ul className="space-y-1 text-sm">
          {(data.topClicks ?? []).map((c, i) => (
            <li key={i} className="flex justify-between"><span>{c.label}</span><span className="text-muted">{c.c}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pengaturan
// ---------------------------------------------------------------------------
function SettingsTab({ isSuper, notify }: { isSuper: boolean; notify: (m: string) => void }) {
  const [siteName, setSiteName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => {
      setSiteName(d.siteName ?? ""); setOwnerEmail(d.ownerEmail ?? "");
    });
  }, []);
  async function save() {
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteName, ownerEmail }),
    });
    const data = await res.json();
    notify(res.ok ? "Pengaturan tersimpan." : data.error || "Gagal.");
  }
  return (
    <div className="max-w-md space-y-3">
      <input className="field" placeholder="Nama situs" value={siteName} onChange={(e) => setSiteName(e.target.value)} disabled={!isSuper} />
      <input className="field" placeholder="Email pemilik" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} disabled={!isSuper} />
      {isSuper ? (
        <button onClick={save} className="btn btn-primary">Simpan</button>
      ) : (
        <p className="text-xs text-muted">Hanya superadmin yang bisa mengubah pengaturan ini.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Akun (khusus superadmin)
// ---------------------------------------------------------------------------
function AccountsTab({ notify, currentUserId }: { notify: (m: string) => void; currentUserId: number }) {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "superadmin">("admin");

  const load = useCallback(() => {
    fetch("/api/admin/accounts").then((r) => r.json()).then((d) => setAdmins(d.admins ?? []));
  }, []);
  useEffect(() => { load(); }, [load]);

  async function create() {
    const res = await fetch("/api/admin/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) { notify(data.error || "Gagal."); return; }
    setEmail(""); setPassword("");
    notify("Akun dibuat.");
    load();
  }

  async function toggle(id: number, active: boolean) {
    await fetch("/api/admin/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <div className="glass-soft max-w-md space-y-3 rounded-2xl p-4">
        <h3 className="font-semibold">Buat akun baru</h3>
        <input className="field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="field" type="password" placeholder="Kata sandi (min 10 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select className="field" value={role} onChange={(e) => setRole(e.target.value as "admin" | "superadmin")}>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <button onClick={create} className="btn btn-primary">Buat akun</button>
      </div>
      <div className="space-y-2">
        {admins.map((a) => (
          <div key={a.id} className="glass-soft flex items-center justify-between rounded-2xl p-3 text-sm">
            <div>
              <p className="font-semibold">{a.email} <span className="text-xs text-muted">({a.role})</span></p>
              <p className="text-xs text-muted">{a.is_active ? "Aktif" : "Nonaktif"}</p>
            </div>
            {a.id !== currentUserId && (
              <button onClick={() => toggle(a.id, Boolean(a.is_active))} className="btn btn-glass !min-h-8 !px-3 text-xs">
                {a.is_active ? "Nonaktifkan" : "Aktifkan"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Log (khusus superadmin)
// ---------------------------------------------------------------------------
function LogsTab() {
  const [data, setData] = useState<{ total?: number; failed?: number; blocked?: number; list?: LogRow[] } | null>(null);
  useEffect(() => { fetch("/api/admin/logs").then((r) => r.json()).then(setData); }, []);
  if (!data) return <p>Memuat…</p>;
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">Total {data.total} · Gagal {data.failed} · Mencurigakan {data.blocked}</p>
      {(data.list ?? []).map((l) => (
        <div key={l.id} className="glass-soft flex justify-between rounded-xl px-4 py-2 text-xs">
          <span>{l.action} — {l.admin_email ?? "?"} — {l.result}</span>
          <span className="text-muted">{new Date(l.ts).toLocaleString("id-ID")}</span>
        </div>
      ))}
    </div>
  );
}
