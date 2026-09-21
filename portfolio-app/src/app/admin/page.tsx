"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------- tipe data */

type Skill = { id: string; icon: string; emoji: string; title: string; en: string; idn: string };
type Org = { org: string; role: string; emoji: string };
type Song = { title: string; src: string };
type Work = {
  id: string;
  title: string;
  desc: string;
  idn: string;
  image: string;
  aspect: string;
  tone: string;
  order: number;
};

type Content = {
  name: string;
  shortName: string;
  motto: string[];
  heroBadge: string;
  heroTitle: string;
  heroIntro: string;
  aboutTitle: string;
  aboutSub: string;
  aboutRole: string;
  aboutPhoto: string;
  aboutParas: string[];
  skillsTitle: string;
  skillsSub: string;
  skills: Skill[];
  portfolioTitle: string;
  portfolioSub: string;
  currentLabel: string;
  currentSub: string;
  currentItems: string[];
  orgs: Org[];
  handmadeTitle: string;
  handmadeSub: string;
  handmadeParas: string[];
  music: Song[];
  contactTitle: string;
  contactDesc: string;
  instagram: string;
  instagramLabel: string;
  whatsapp: string;
  email: string;
  cv: string;
};

const EMPTY: Content = {
  name: "",
  shortName: "",
  motto: [],
  heroBadge: "",
  heroTitle: "",
  heroIntro: "",
  aboutTitle: "",
  aboutSub: "",
  aboutRole: "",
  aboutPhoto: "",
  aboutParas: [],
  skillsTitle: "",
  skillsSub: "",
  skills: [],
  portfolioTitle: "",
  portfolioSub: "",
  currentLabel: "",
  currentSub: "",
  currentItems: [],
  orgs: [],
  handmadeTitle: "",
  handmadeSub: "",
  handmadeParas: [],
  music: [],
  contactTitle: "",
  contactDesc: "",
  instagram: "",
  instagramLabel: "",
  whatsapp: "",
  email: "",
  cv: "",
};

const ICONS = [
  "palette",
  "pen",
  "camera",
  "video",
  "mic",
  "users",
  "book",
  "cooking",
  "handmade",
  "journal",
  "guitar",
  "pink",
  "movie",
  "music",
  "flower",
];

const ASPECTS = [
  { value: "aspect-[3/4]", label: "Potret (3:4)" },
  { value: "aspect-square", label: "Persegi (1:1)" },
  { value: "aspect-[4/5]", label: "Potret pendek (4:5)" },
  { value: "aspect-[4/3]", label: "Lanskap (4:3)" },
  { value: "aspect-[16/9]", label: "Lebar (16:9)" },
];

const TONES = [
  { value: "from-mauve to-butter", label: "Mauve → butter" },
  { value: "from-blush to-mauve", label: "Blush → mauve" },
  { value: "from-cream to-blush", label: "Cream → blush" },
  { value: "from-blush to-butter", label: "Blush → butter" },
];

const TABS = [
  { id: "beranda", label: "Beranda" },
  { id: "tentang", label: "Tentang" },
  { id: "suka", label: "Yang kusuka" },
  { id: "karya", label: "Karya" },
  { id: "sedang", label: "Sedang" },
  { id: "organisasi", label: "Organisasi" },
  { id: "handmade", label: "Handmade" },
  { id: "musik", label: "Musik" },
  { id: "kontak", label: "Kontak" },
  { id: "statistik", label: "Statistik" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ------------------------------------------------------------ bagian kecil */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#8B3A4D]">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-[#8B3A4D]/60">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[#F3C9D3] bg-white px-4 py-3 text-[#4A2430] outline-none transition focus:border-[#C4709A] focus:ring-4 focus:ring-[#FFC0CB]/40";

function Text({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      className={inputClass}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Area({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      className={`${inputClass} resize-y leading-relaxed`}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Card({ title, children, onRemove, onUp, onDown }: {
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
  onUp?: () => void;
  onDown?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-[#F3C9D3] bg-[#FFF8FA] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-[#8B3A4D]">{title}</h3>
        <div className="flex shrink-0 gap-1.5">
          {onUp && (
            <button type="button" onClick={onUp} aria-label="Pindah ke atas" className="h-9 w-9 rounded-full bg-white text-[#8B3A4D] transition hover:bg-[#FFE4EA]">
              ↑
            </button>
          )}
          {onDown && (
            <button type="button" onClick={onDown} aria-label="Pindah ke bawah" className="h-9 w-9 rounded-full bg-white text-[#8B3A4D] transition hover:bg-[#FFE4EA]">
              ↓
            </button>
          )}
          {onRemove && (
            <button type="button" onClick={onRemove} className="h-9 rounded-full bg-white px-3 text-sm font-semibold text-[#B24463] transition hover:bg-[#FFE4EA]">
              Hapus
            </button>
          )}
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-dashed border-[#F3C9D3] py-4 font-semibold text-[#8B3A4D] transition hover:border-[#C4709A] hover:bg-[#FFF1F4]"
    >
      {children}
    </button>
  );
}

/** Daftar teks sederhana (motto, paragraf, daftar kegiatan). */
function TextList({
  items,
  onChange,
  addLabel,
  multiline = false,
}: {
  items: string[];
  onChange: (v: string[]) => void;
  addLabel: string;
  multiline?: boolean;
}) {
  const set = (i: number, v: string) => onChange(items.map((it, k) => (k === i ? v : it)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            {multiline ? (
              <Area value={it} onChange={(v) => set(i, v)} rows={3} />
            ) : (
              <Text value={it} onChange={(v) => set(i, v)} />
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <button type="button" onClick={() => move(i, -1)} aria-label="Ke atas" className="h-8 w-8 rounded-full bg-white text-[#8B3A4D] hover:bg-[#FFE4EA]">↑</button>
            <button type="button" onClick={() => move(i, 1)} aria-label="Ke bawah" className="h-8 w-8 rounded-full bg-white text-[#8B3A4D] hover:bg-[#FFE4EA]">↓</button>
            <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Hapus" className="h-8 w-8 rounded-full bg-white text-[#B24463] hover:bg-[#FFE4EA]">×</button>
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ""])}>{addLabel}</AddButton>
    </div>
  );
}

/** Unggah berkas ke Vercel Blob lalu isi URL-nya ke field. */
function Upload({
  value,
  onChange,
  accept = "image/*",
  preview = true,
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  preview?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const send = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
const tk = sessionStorage.getItem("al_admin_token") || "";
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        headers: tk ? { Authorization: `Bearer ${tk}` } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        let msg = data.error || "Unggahan gagal.";
        if (res.status === 401) msg = "Sesi admin kadaluarsa. Muat ulang lalu masuk lagi.";
        throw new Error(msg);
      }
      onChange(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unggahan gagal.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <div className="grid gap-2">
      <Text value={value} onChange={onChange} placeholder="/images/nama-file.jpg atau URL" />
      <div className="flex items-center gap-3">
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) send(f);
          }}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="rounded-full bg-[#8B3A4D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B24463] disabled:opacity-50"
        >
          {busy ? "Mengunggah…" : "Pilih berkas"}
        </button>
        {value && preview && accept.startsWith("image") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-14 w-14 rounded-xl object-cover" />
        ) : null}
      </div>
      {err ? <p className="text-sm text-[#B24463]">{err}</p> : null}
    </div>
  );
}

/* ----------------------------------------------------------------- halaman */

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [tab, setTab] = useState<TabId>("beranda");
  const [content, setContent] = useState<Content>(EMPTY);
  const [works, setWorks] = useState<Work[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState<any>(null);

  const patch = useCallback(<K extends keyof Content>(key: K, value: Content[K]) => {
    setContent((c) => ({ ...c, [key]: value }));
    setDirty(true);
  }, []);

const loadAll = useCallback(async () => {
    const tk = sessionStorage.getItem("al_admin_token") || token;
    const res = await fetch("/api/content", {
      cache: "no-store",
      headers: tk ? { Authorization: `Bearer ${tk}` } : {},
    });
    if (!res.ok) return;
    const data = await res.json();
    setContent({ ...EMPTY, ...(data.content ?? {}) });
    setWorks(Array.isArray(data.works) ? data.works : []);
    setDirty(false);
  }, [token]);

  useEffect(() => {
    const tk = sessionStorage.getItem("al_admin_token") || "";
    if (tk) setToken(tk);
    (async () => {
      const res = await fetch(tk ? "/api/admin-auth" : "/api/admin-auth", { cache: "no-store", headers: tk ? { Authorization: `Bearer ${tk}` } : {} });
      const data = await res.json().catch(() => ({ ok: false }));
      if (data.ok) {
        setAuthed(true);
        await loadAll();
        return;
      }
      if (tk) {
        setAuthed(true);
        await loadAll();
      }
    })();
  }, [loadAll]);

  useEffect(() => {
    if (tab !== "statistik" || !authed) return;
    fetch("/api/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => {});
  }, [tab, authed]);

  // Peringatkan kalau menutup tab saat ada perubahan belum disimpan.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLoginErr(data.error || "Tidak bisa masuk.");
      return;
    }
    if (data.token) {
      sessionStorage.setItem("al_admin_token", data.token);
      setToken(data.token);
      setAuthed(true);
    } else {
      setAuthed(true);
    }
    setPassword("");
    await loadAll();
  };

  const logout = async () => {
    await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logout: true }),
    });
    setAuthed(false);
  };

  const save = async () => {
    setSaving(true);
    setStatus("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content, works: works.map((w, i) => ({ ...w, order: i + 1 })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan.");
      setDirty(false);
      setStatus("Tersimpan. Halaman utama ikut berubah dalam beberapa detik.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Gagal menyimpan.");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  const moveWork = (i: number, dir: -1 | 1) => {
    setWorks((list) => {
      const next = [...list];
      const j = i + dir;
      if (j < 0 || j >= next.length) return list;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setDirty(true);
  };

  /* ------------------------------------------------------------- tampilan */

  if (!ready) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#FFF5F7] text-[#8B3A4D]">Memuat…</main>
    );
  }

  if (!authed) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#FFF5F7] px-5">
        <form onSubmit={login} className="w-full max-w-sm rounded-[2rem] border border-[#F3C9D3] bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-semibold text-[#8B3A4D]">Masuk ke panel</h1>
          <p className="mt-2 text-sm text-[#8B3A4D]/70">
            Panel ini untuk mengubah isi situs. Tidak ada yang berubah sampai kamu menekan Simpan.
          </p>
          <div className="mt-6">
            <Field label="Kata sandi">
              <input
                type="password"
                autoFocus
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          </div>
          {loginErr ? <p className="mt-3 text-sm text-[#B24463]">{loginErr}</p> : null}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-[#8B3A4D] py-3.5 font-semibold text-white transition hover:bg-[#B24463]"
          >
            Masuk
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-[#FFF5F7] pb-32 text-[#4A2430]">
      <header className="sticky top-0 z-30 border-b border-[#F3C9D3] bg-[#FFF5F7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <h1 className="text-xl font-semibold text-[#8B3A4D]">Kelola isi situs</h1>
            <p className="text-sm text-[#8B3A4D]/60">
              {dirty ? "Ada perubahan yang belum disimpan" : "Semua perubahan tersimpan"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#8B3A4D] transition hover:bg-[#FFE4EA]"
            >
              Lihat situs
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#8B3A4D] transition hover:bg-[#FFE4EA]"
            >
              Keluar
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-5xl overflow-x-auto px-5 pb-3">
          <div className="flex gap-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t.id ? "bg-[#8B3A4D] text-white" : "bg-white text-[#8B3A4D] hover:bg-[#FFE4EA]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {tab === "beranda" && (
          <div className="grid gap-5">
            <Field label="Nama lengkap"><Text value={content.name} onChange={(v) => patch("name", v)} /></Field>
            <Field label="Nama panggilan" hint="Tampil di logo dan menu."><Text value={content.shortName} onChange={(v) => patch("shortName", v)} /></Field>
            <Field label="Sapaan kecil di atas judul"><Text value={content.heroBadge} onChange={(v) => patch("heroBadge", v)} /></Field>
            <Field label="Judul besar halaman depan"><Text value={content.heroTitle} onChange={(v) => patch("heroTitle", v)} /></Field>
            <Field label="Paragraf pembuka" hint="Tekan Enter untuk pindah baris.">
              <Area value={content.heroIntro} onChange={(v) => patch("heroIntro", v)} rows={4} />
            </Field>
            <Field label="Motto" hint="Muncul di hero, footer, dan pita berjalan.">
              <TextList items={content.motto} onChange={(v) => patch("motto", v)} addLabel="Tambah motto" />
            </Field>
          </div>
        )}

        {tab === "tentang" && (
          <div className="grid gap-5">
            <Field label="Judul bagian"><Text value={content.aboutTitle} onChange={(v) => patch("aboutTitle", v)} /></Field>
            <Field label="Subjudul"><Text value={content.aboutSub} onChange={(v) => patch("aboutSub", v)} /></Field>
            <Field label="Peran / status"><Text value={content.aboutRole} onChange={(v) => patch("aboutRole", v)} /></Field>
            <Field label="Foto"><Upload value={content.aboutPhoto} onChange={(v) => patch("aboutPhoto", v)} /></Field>
            <Field label="Paragraf cerita">
              <TextList items={content.aboutParas} onChange={(v) => patch("aboutParas", v)} addLabel="Tambah paragraf" multiline />
            </Field>
          </div>
        )}

        {tab === "suka" && (
          <div className="grid gap-5">
            <Field label="Judul bagian"><Text value={content.skillsTitle} onChange={(v) => patch("skillsTitle", v)} /></Field>
            <Field label="Subjudul"><Text value={content.skillsSub} onChange={(v) => patch("skillsSub", v)} /></Field>

            {content.skills.map((s, i) => {
              const set = (k: keyof Skill, v: string) =>
                patch("skills", content.skills.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
              const move = (dir: -1 | 1) => {
                const next = [...content.skills];
                const j = i + dir;
                if (j < 0 || j >= next.length) return;
                [next[i], next[j]] = [next[j], next[i]];
                patch("skills", next);
              };
              return (
                <Card
                  key={i}
                  title={s.title || `Item ${i + 1}`}
                  onUp={() => move(-1)}
                  onDown={() => move(1)}
                  onRemove={() => patch("skills", content.skills.filter((_, j) => j !== i))}
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Judul"><Text value={s.title} onChange={(v) => set("title", v)} /></Field>
                    <Field label="Emoji"><Text value={s.emoji} onChange={(v) => set("emoji", v)} /></Field>
                    <Field label="Ikon">
                      <select className={inputClass} value={s.icon} onChange={(e) => set("icon", e.target.value)}>
                        {ICONS.map((ic) => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Deskripsi (Inggris)"><Area value={s.en} onChange={(v) => set("en", v)} rows={2} /></Field>
                  <Field label="Deskripsi (Indonesia)"><Area value={s.idn} onChange={(v) => set("idn", v)} rows={2} /></Field>
                </Card>
              );
            })}

            <AddButton
              onClick={() =>
                patch("skills", [
                  ...content.skills,
                  { id: `s_${Date.now()}`, icon: "flower", emoji: "🌸", title: "", en: "", idn: "" },
                ])
              }
            >
              Tambah hal yang disukai
            </AddButton>
          </div>
        )}

        {tab === "karya" && (
          <div className="grid gap-5">
            <Field label="Judul bagian"><Text value={content.portfolioTitle} onChange={(v) => patch("portfolioTitle", v)} /></Field>
            <Field label="Subjudul"><Text value={content.portfolioSub} onChange={(v) => patch("portfolioSub", v)} /></Field>

            {works.map((w, i) => {
              const set = (k: keyof Work, v: string) => {
                setWorks((list) => list.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
                setDirty(true);
              };
              return (
                <Card
                  key={w.id || i}
                  title={w.title || `Karya ${i + 1}`}
                  onUp={() => moveWork(i, -1)}
                  onDown={() => moveWork(i, 1)}
                  onRemove={() => {
                    setWorks((list) => list.filter((_, j) => j !== i));
                    setDirty(true);
                  }}
                >
                  <Field label="Judul"><Text value={w.title} onChange={(v) => set("title", v)} /></Field>
                  <Field label="Keterangan (Inggris)"><Text value={w.desc} onChange={(v) => set("desc", v)} /></Field>
                  <Field label="Keterangan (Indonesia)"><Text value={w.idn} onChange={(v) => set("idn", v)} /></Field>
                  <Field label="Gambar"><Upload value={w.image} onChange={(v) => set("image", v)} /></Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Bentuk kartu">
                      <select className={inputClass} value={w.aspect} onChange={(e) => set("aspect", e.target.value)}>
                        {ASPECTS.map((a) => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Warna cadangan" hint="Dipakai kalau gambar gagal dimuat.">
                      <select className={inputClass} value={w.tone} onChange={(e) => set("tone", e.target.value)}>
                        {TONES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </Card>
              );
            })}

            <AddButton
              onClick={() => {
                setWorks((list) => [
                  ...list,
                  {
                    id: `w_${Date.now()}`,
                    title: "",
                    desc: "",
                    idn: "",
                    image: "",
                    aspect: "aspect-[3/4]",
                    tone: "from-mauve to-butter",
                    order: list.length + 1,
                  },
                ]);
                setDirty(true);
              }}
            >
              Tambah karya
            </AddButton>
          </div>
        )}

        {tab === "sedang" && (
          <div className="grid gap-5">
            <Field label="Judul bagian"><Text value={content.currentLabel} onChange={(v) => patch("currentLabel", v)} /></Field>
            <Field label="Subjudul"><Text value={content.currentSub} onChange={(v) => patch("currentSub", v)} /></Field>
            <Field label="Daftar kegiatan">
              <TextList items={content.currentItems} onChange={(v) => patch("currentItems", v)} addLabel="Tambah kegiatan" />
            </Field>
          </div>
        )}

        {tab === "organisasi" && (
          <div className="grid gap-5">
            {content.orgs.map((o, i) => {
              const set = (k: keyof Org, v: string) =>
                patch("orgs", content.orgs.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
              return (
                <Card
                  key={i}
                  title={o.org || `Organisasi ${i + 1}`}
                  onRemove={() => patch("orgs", content.orgs.filter((_, j) => j !== i))}
                >
                  <Field label="Nama organisasi"><Text value={o.org} onChange={(v) => set("org", v)} /></Field>
                  <Field label="Peran"><Text value={o.role} onChange={(v) => set("role", v)} /></Field>
                  <Field label="Emoji"><Text value={o.emoji} onChange={(v) => set("emoji", v)} /></Field>
                </Card>
              );
            })}
            <AddButton onClick={() => patch("orgs", [...content.orgs, { org: "", role: "", emoji: "⭐" }])}>
              Tambah organisasi
            </AddButton>
          </div>
        )}

        {tab === "handmade" && (
          <div className="grid gap-5">
            <Field label="Judul bagian"><Text value={content.handmadeTitle} onChange={(v) => patch("handmadeTitle", v)} /></Field>
            <Field label="Subjudul"><Text value={content.handmadeSub} onChange={(v) => patch("handmadeSub", v)} /></Field>
            <Field label="Paragraf">
              <TextList items={content.handmadeParas} onChange={(v) => patch("handmadeParas", v)} addLabel="Tambah paragraf" multiline />
            </Field>
          </div>
        )}

        {tab === "musik" && (
          <div className="grid gap-5">
            {content.music.map((m, i) => {
              const set = (k: keyof Song, v: string) =>
                patch("music", content.music.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
              return (
                <Card
                  key={i}
                  title={m.title || `Lagu ${i + 1}`}
                  onRemove={() => patch("music", content.music.filter((_, j) => j !== i))}
                >
                  <Field label="Judul lagu"><Text value={m.title} onChange={(v) => set("title", v)} /></Field>
                  <Field label="Berkas MP3">
                    <Upload value={m.src} onChange={(v) => set("src", v)} accept="audio/mpeg" preview={false} />
                  </Field>
                </Card>
              );
            })}
            <AddButton onClick={() => patch("music", [...content.music, { title: "", src: "" }])}>
              Tambah lagu
            </AddButton>
          </div>
        )}

        {tab === "kontak" && (
          <div className="grid gap-5">
            <Field label="Judul bagian"><Text value={content.contactTitle} onChange={(v) => patch("contactTitle", v)} /></Field>
            <Field label="Ajakan"><Area value={content.contactDesc} onChange={(v) => patch("contactDesc", v)} rows={3} /></Field>
            <Field label="Instagram" hint="Tanpa tanda @."><Text value={content.instagram} onChange={(v) => patch("instagram", v)} /></Field>
            <Field label="Keterangan Instagram"><Text value={content.instagramLabel} onChange={(v) => patch("instagramLabel", v)} /></Field>
            <Field label="WhatsApp" hint="Format 62812…"><Text value={content.whatsapp} onChange={(v) => patch("whatsapp", v)} /></Field>
            <Field label="Email"><Text value={content.email} onChange={(v) => patch("email", v)} /></Field>
            <Field label="Berkas CV">
              <Upload value={content.cv} onChange={(v) => patch("cv", v)} accept="application/pdf" preview={false} />
            </Field>
          </div>
        )}

        {tab === "statistik" && (
          <div className="grid gap-5">
            {!stats ? (
              <p className="text-[#8B3A4D]/70">Memuat data kunjungan…</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Kunjungan hari ini", stats.viewsToday],
                    ["Total kunjungan", stats.totalViews],
                    ["Total klik tombol", stats.totalClicks],
                  ].map(([label, value]) => (
                    <div key={String(label)} className="rounded-3xl border border-[#F3C9D3] bg-white p-6">
                      <p className="text-sm text-[#8B3A4D]/70">{label}</p>
                      <p className="mt-1 text-4xl font-semibold text-[#8B3A4D]">{String(value)}</p>
                    </div>
                  ))}
                </div>

                {stats.topClicks?.length > 0 && (
                  <div className="rounded-3xl border border-[#F3C9D3] bg-white p-6">
                    <h3 className="font-semibold text-[#8B3A4D]">Tombol yang paling sering ditekan</h3>
                    <ul className="mt-3 grid gap-2">
                      {stats.topClicks.map(([label, count]: [string, number]) => (
                        <li key={label} className="flex justify-between gap-4 text-sm">
                          <span className="truncate">{label}</span>
                          <span className="font-semibold text-[#8B3A4D]">{count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#F3C9D3] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
          <p className="text-sm text-[#8B3A4D]/80">{status || (dirty ? "Belum disimpan" : "Sudah tersimpan")}</p>
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="rounded-full bg-[#8B3A4D] px-8 py-3 font-semibold text-white transition hover:bg-[#B24463] disabled:opacity-40"
          >
            {saving ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </div>
      </div>
    </main>
  );
}
