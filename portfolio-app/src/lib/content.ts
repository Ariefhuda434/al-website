/**
 * Semua teks dan data website ada di file ini.
 * Cukup edit di sini, tampilan akan ikut berubah.
 */

export const site = {
  name: "alvsmitsuri",
  shortName: "al",
  motto: ["with passion", "with love", "with dreams"],
  roles: ["designing things", "writing stories", "taking photos", "making videos", "being an MC", "learning new stuff"],
  intro: "a public health student who somehow enjoys doing a little bit of everything.",
  description:
    "Just a little space about me — the things i love, the things i make, and the little things i'm learning along the way.",
  // NEXT_PUBLIC_* harus ditulis persis seperti ini agar terbaca saat build.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alvmitsuri.vercel.app",
  whatsapp: (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  instagram: "al_icacraft",
  cv: "/images/CV_Annisa Al Maghirah.pdf",
};

export const nav = [
  { id: "about", label: "about" },
  { id: "skills", label: "i love" },
  { id: "portfolio", label: "i made" },
  { id: "contact", label: "say hi" },
] as const;

export const about = {
  title: "a little about al ♡",
  sub: "just a little space about me",
  paras: [
    "i'm al, a public health student who somehow enjoys doing a little bit of everything.",
    "i like designing things, writing stories, taking photos, making videos, joining organizations, and sometimes being in front of people as an MC or moderator.",
    "i'm still figuring things out, trying new things, and learning along the way.",
  ],
};

export const skills = [
  {
    id: "design",
    icon: "palette",
    emoji: "🎨",
    title: "design",
    en: "playing with colors, layouts, and random ideas until they somehow become something.",
    idn: "Bermain dengan warna, layout, dan ide-ide random sampai akhirnya jadi sesuatu.",
  },
  {
    id: "writing",
    icon: "pen",
    emoji: "✍🏻",
    title: "writing",
    en: "i like writing stories, thoughts, and little things that come to mind.",
    idn: "Aku suka menulis cerita, pikiran, dan hal-hal kecil yang tiba-tiba muncul di kepala.",
  },
  {
    id: "photography",
    icon: "camera",
    emoji: "📸",
    title: "photography",
    en: "capturing little moments that i don't want to forget.",
    idn: "Mengabadikan momen-momen kecil yang nggak mau aku lupakan.",
  },
  {
    id: "videography",
    icon: "video",
    emoji: "🎥",
    title: "videography",
    en: "making little videos, editing them, and turning moments into stories.",
    idn: "Membuat video-video kecil, mengeditnya, dan mengubah momen menjadi cerita.",
  },
  {
    id: "mc",
    icon: "mic",
    emoji: "🎤",
    title: "MC & moderator",
    en: "i've had the chance to host and moderate several events, and honestly, i enjoy it.",
    idn: "Aku beberapa kali mendapat kesempatan menjadi MC dan moderator, dan jujur, aku menikmatinya.",
  },
  {
    id: "organization",
    icon: "users",
    emoji: "🤝",
    title: "organization",
    en: "learning, meeting people, doing things together, and growing through every experience.",
    idn: "Belajar, bertemu orang-orang, melakukan sesuatu bersama, dan berkembang dari setiap pengalaman.",
  },
  {
    id: "littlebusiness",
    icon: "flower",
    emoji: "🌷",
    title: "little business",
    en: "i also have a small handmade project with my friend.",
    idn: "Aku juga punya bisnis handmade kecil bersama temanku.",
  },
];

export const works = [
  {
    id: 2,
    title: "design experiments",
    desc: "playing with colors, layouts, and random ideas.",
    idn: "Bermain dengan warna, layout, dan ide-ide random.",
    image: "/images/design2.png",
    aspect: "aspect-[3/1]",
    tone: "from-mauve to-butter",
  },
  {
    id: 3,
    title: "MC & moderator",
    desc: "hosting events and enjoying every moment on stage.",
    idn: "MC di kegiatan Pengabdian Masyarakat — 'Cerdas Mengenal dan Mencegah Penyakit Menular (TBC)' di SMA Darussalam Medan.",
    image: "/images/mc.png",
    aspect: "aspect-[3/4]",
    tone: "from-butter to-blush",
  },
  {
    id: 4,
    title: "PEMA",
    desc: "learning, meeting people, and growing together.",
    idn: "Penyuluhan Pencegahan Kenakalan Remaja di Madrasah Tsanawiyah Amal Shaleh.",
    image: "/images/pema.png",
    aspect: "aspect-[9/16]",
    tone: "from-blush to-butter",
  },
  {
    id: 5,
    title: "penilaian status gizi",
    desc: "measuring, learning, and helping along the way.",
    idn: "Penilaian status gizi, pengukuran IMT/U anak usia 5–18 tahun.",
    image: "/images/penilaian status gizi.png",
    aspect: "aspect-[16/9]",
    tone: "from-blush to-mauve",
  },
  {
    id: 7,
    title: "teaching & outreach",
    desc: "sharing and learning together.",
    idn: "Mengajar di kelas dan menimbang anak kecil di sekolah.",
    image: "/images/mengajar di kelas.png",
    aspect: "aspect-[16/9]",
    tone: "from-butter to-mauve",
  },
  {
    id: 9,
    title: "weighing little ones",
    desc: "care, one measurement at a time.",
    idn: "Menimbang anak kecil di sekolah.",
    image: "/images/menimbang anak kecil di sekolah.png",
    aspect: "aspect-[9/16]",
    tone: "from-mauve to-butter",
  },
  {
    id: 10,
    title: "turlap",
    desc: "observing, auditing, learning.",
    idn: "Observasi Audit SMK3.",
    image: "/images/Observasi Audit SMK3.png",
    aspect: "aspect-[9/16]",
    tone: "from-butter to-blush",
  },
  {
    id: 11,
    title: "handmade things",
    desc: "some little things i made with my hands.",
    idn: "Beberapa hal kecil yang aku buat dengan tanganku sendiri.",
    image: "/images/al_icacraft.png",
    aspect: "aspect-[9/19]",
    tone: "from-blush to-mauve",
  },
];

export const projects = [
  "studying Public Health",
  "creating things",
  "learning new stuff",
  "being active in organizations",
  "growing a little business",
  "occasionally holding a mic",
  "taking pictures whenever i feel like it",
];

export const testimonials = {
  title: "a little something i made ♡",
  sub: "handmade with love",
  paras: [
    "somewhere along the way, i started making little handmade things with my friend.",
    "flowers, gifts, cute little things, and whatever we feel like creating.",
  ],
};