export const site = {
  name: "Annisa Al Maghirah",
  shortName: "al",
  motto: ["with passion", "with love", "with dreams"],
  roles: ["public speaker", "MC", "florist bunga kawat bulu", "desainer"],
  intro:
    "Mahasiswa FKM yang suka berbicara di depan umum, memandu acara, merangkai bunga kawat bulu, dan mendesain.",
  description:
    "Portofolio alvsmitsuri — mahasiswa FKM yang berkarya di public speaking, MC, bunga kawat bulu, dan desain.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://alvsmitsuri.vercel.app",
  whatsapp: "",
  email: "",
  instagram: "@alvsmitsuri",
  cv: "/cv-al.pdf",
};

export const nav = [
  { id: "about", label: "Tentang" },
  { id: "skills", label: "Skill" },
  { id: "portfolio", label: "Karya" },
  { id: "projects", label: "Proyek" },
  { id: "testimonials", label: "Testimoni" },
  { id: "contact", label: "Hubungi" },
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
    title: "IMM Journal",
    desc: "Salah satu proyek desain kecilku.",
    image: "/images/portfolio-1.jpg",
    tone: "from-blush to-mauve",
  },
  {
    id: 2,
    title: "Little moments",
    desc: "Beberapa foto yang aku ambil sepanjang perjalanan.",
    image: "/images/portfolio-2.jpg",
    tone: "from-mauve to-butter",
  },
  {
    id: 3,
    title: "Little videos",
    desc: "Video-video random, editan, dan momen yang ingin aku simpan.",
    image: "/images/portfolio-3.jpg",
    tone: "from-butter to-blush",
  },
] as const;

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
] as const;

export const testimonials = [
  {
    name: "Teman",
    text: "Desainnya kreatif dan sesuai dengan visi yang diinginkan!",
  },
  {
    name: "Klien",
    text: "Pelayanan sangat ramah dan hasilnya memuaskan.",
  },
];
