/**
 * Semua teks dan data website ada di file ini.
 * Cukup edit di sini, tampilan akan ikut berubah.
 */

export const site = {
  name: "Annisa Al Maghirah",
  shortName: "Annisa",
  motto: ["with passion", "with love", "with dreams"],
  roles: ["public speaker", "MC", "florist bunga kawat bulu", "desainer"],
  intro:
    "Mahasiswa FKM yang suka berbicara di depan umum, memandu acara, merangkai bunga kawat bulu, dan mendesain.",
  description:
    "Portofolio Annisa Al Maghirah, mahasiswa FKM yang berkarya di public speaking, MC, bunga kawat bulu, dan desain.",
  // NEXT_PUBLIC_* harus ditulis persis seperti ini agar terbaca saat build.
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsapp: (process.env.NEXT_PUBLIC_WA_NUMBER || "").replace(/\D/g, ""),
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  instagram: (process.env.NEXT_PUBLIC_INSTAGRAM || "").replace(/^@/, ""),
  cv: "/cv-annisa.pdf",
};

export const nav = [
  { id: "about", label: "Tentang" },
  { id: "skills", label: "Skill" },
  { id: "portfolio", label: "Karya" },
  { id: "projects", label: "Proyek" },
  { id: "testimonials", label: "Testimoni" },
] as const;

export const skills = [
  {
    id: "speaking",
    icon: "mic",
    title: "Public speaking",
    desc: "Berbicara di depan umum dengan percaya diri, tenang, dan penuh energi.",
  },
  {
    id: "mc",
    icon: "sparkles",
    title: "MC",
    desc: "Memandu acara dengan interaksi yang hangat, menyenangkan, dan profesional.",
  },
  {
    id: "flower",
    icon: "flower",
    title: "Usaha bunga",
    desc: "Membuat dan menjual bunga kawat bulu yang unik dan elegan.",
  },
  {
    id: "design",
    icon: "palette",
    title: "Desain",
    desc: "Merancang desain visual kreatif untuk berbagai kebutuhan.",
  },
] as const;

export const works = [
  {
    id: 1,
    title: "Karya desain 1",
    desc: "Karya kreatif dengan sentuhan feminin dan lembut.",
    image: "/images/portfolio-1.jpg",
    tone: "from-blush to-mauve",
  },
  {
    id: 2,
    title: "Karya desain 2",
    desc: "Karya kreatif dengan sentuhan feminin dan lembut.",
    image: "/images/portfolio-2.jpg",
    tone: "from-mauve to-butter",
  },
  {
    id: 3,
    title: "Karya desain 3",
    desc: "Karya kreatif dengan sentuhan feminin dan lembut.",
    image: "/images/portfolio-3.jpg",
    tone: "from-butter to-blush",
  },
];

export const projects = [
  {
    tag: "Usaha",
    title: "Bunga Kawat Bulu Series 1",
    desc: "Seri pertama usaha bunga kawat bulu dengan tema pastel.",
  },
  {
    tag: "Desain",
    title: "Desain poster acara",
    desc: "Poster untuk acara kampus dengan gaya modern minimalis.",
  },
  {
    tag: "Personal brand",
    title: "Branding pribadi",
    desc: "Pengembangan identitas visual untuk personal brand.",
  },
];

export const testimonials = [
  {
    name: "Klien A",
    text: "Karya desainnya sangat kreatif dan sesuai dengan visi kami!",
  },
  {
    name: "Klien B",
    text: "Pelayanan sangat ramah dan hasilnya memuaskan.",
  },
];
