/**
 * Konten default / cadangan.
 * Semua nilai di sini dipakai saat data dari admin belum ada atau gagal dimuat,
 * jadi halaman tidak pernah kosong. Edit sehari-hari dilakukan lewat /admin.
 */

export const site = {
  name: "Annisa Al Maghirah",
  shortName: "al",
  url: "https://annisaalmaghirah.vercel.app",
  description:
    "Portofolio Annisa Al Maghirah — public speaking, MC, bunga kawat bulu, desain, dan karya kecil lainnya.",
  motto: ["with passion", "with love", "with dreams"],
  intro:
    "just a little space about me, the things i love, the things i make, and the little things i'm learning along the way.",
  instagram: "nisaalmghrh",
  whatsapp: "6281234567890",
  email: "nisaalmaghirah@gmail.com",
  cv: "/cv/cv-annisa-al-maghirah.pdf",
} as const;

export const nav = [
  { id: "about", label: "Tentang" },
  { id: "skills", label: "Yang kusuka" },
  { id: "portfolio", label: "Karya" },
  { id: "projects", label: "Sedang" },
  { id: "organizations", label: "Organisasi" },
  { id: "testimonials", label: "Handmade" },
];

export const about = {
  title: "about me ♡",
  sub: "sedikit cerita tentang aku",
  paras: [
    "Halo! Aku Annisa Al Maghirah, biasa dipanggil Al. Mahasiswa Fakultas Kesehatan Masyarakat yang senang berada di depan mikrofon dan di belakang meja kerja penuh kawat bulu.",
    "Sehari-hari aku membawakan acara, menulis, mendesain, dan membuat bunga kawat bulu untuk orang-orang yang sedang merayakan sesuatu.",
    "Kalau sedang tidak mengerjakan apa pun, biasanya aku sedang membaca novel Tere Liye atau memutar lagu beabadoobee sambil menjurnal.",
  ],
};

/**
 * icon: kunci ikon di components/Skills.tsx.
 * Pilihan: palette, pen, camera, video, mic, users, book, cooking, handmade,
 * journal, guitar, pink, movie, music, flower
 */
export const skills = [
  {
    id: "design",
    icon: "palette",
    emoji: "🎨",
    title: "design",
    en: "playing with colors, layouts, and random ideas until they somehow become something.",
    idn: "bermain dengan warna dan tata letak sampai jadi sesuatu.",
  },
  {
    id: "writing",
    icon: "pen",
    emoji: "✍🏻",
    title: "writing",
    en: "i like writing stories, thoughts, and little things that come to mind.",
    idn: "menulis cerita, pikiran, dan hal-hal kecil yang terlintas.",
  },
  {
    id: "photography",
    icon: "camera",
    emoji: "📷",
    title: "photography",
    en: "capturing little moments that i don't want to forget.",
    idn: "mengabadikan momen kecil yang tak ingin kulupakan.",
  },
  {
    id: "videography",
    icon: "video",
    emoji: "🎥",
    title: "videography",
    en: "making little videos, editing them, and turning moments into stories.",
    idn: "membuat video kecil dan mengubah momen jadi cerita.",
  },
  {
    id: "hosting",
    icon: "mic",
    emoji: "🎤",
    title: "hosting",
    en: "i enjoy being behind the mic, hosting events, and keeping the conversation going.",
    idn: "membawakan dan memoderasi berbagai acara, dan aku menikmatinya.",
  },
  {
    id: "organization",
    icon: "users",
    emoji: "🫂",
    title: "organization",
    en: "learning, meeting people, doing things together, and growing through every experience.",
    idn: "belajar, bertemu orang, dan bertumbuh lewat setiap pengalaman.",
  },
  {
    id: "reading",
    icon: "book",
    emoji: "📚",
    title: "reading",
    en: "i love getting lost in novels, especially Tere Liye's stories.",
    idn: "tenggelam dalam novel, terutama cerita Tere Liye.",
  },
  {
    id: "cooking",
    icon: "cooking",
    emoji: "🧁",
    title: "cooking & baking",
    en: "trying recipes, making homemade food, and turning simple ingredients into something good.",
    idn: "mencoba resep dan mengolah bahan sederhana jadi sesuatu yang enak.",
  },
  {
    id: "handmade",
    icon: "handmade",
    emoji: "🧶",
    title: "handmade & small business",
    en: "making things by hand, creating little ideas, and turning them into something people can enjoy.",
    idn: "membuat sesuatu dengan tangan dan menjadikannya bisa dinikmati orang.",
  },
  {
    id: "journaling",
    icon: "journal",
    emoji: "📓",
    title: "journaling",
    en: "putting little thoughts, memories, and random moments onto paper.",
    idn: "menuangkan pikiran dan kenangan kecil ke atas kertas.",
  },
  {
    id: "guitar",
    icon: "guitar",
    emoji: "🎸",
    title: "guitar",
    en: "i can play a little guitar — still learning, still enjoying it.",
    idn: "bisa main gitar sedikit — masih belajar, masih menikmati.",
  },
  {
    id: "pink",
    icon: "pink",
    emoji: "🎀",
    title: "pink & colorful things",
    en: "anything pink, colorful, cute, or simply makes a space feel happier.",
    idn: "apa pun yang merah muda, berwarna, dan membuat ruang terasa lebih ceria.",
  },
  {
    id: "movies",
    icon: "movie",
    emoji: "🎬",
    title: "movies, anime & shows",
    en: "from Studio Ghibli and Barbie to Sofia the First, action movies, and Dr. Stone.",
    idn: "dari Ghibli dan Barbie sampai Sofia the First dan Dr. Stone.",
  },
  {
    id: "music",
    icon: "music",
    emoji: "🎧",
    title: "music",
    en: "a little bit of music always makes ordinary moments feel better. especially beabadoobee lately.",
    idn: "musik membuat momen biasa terasa lebih baik — belakangan beabadoobee.",
  },
];

export const works = [
  {
    id: "w1",
    title: "bunga kawat bulu",
    desc: "handmade bouquet for birthdays and graduations",
    idn: "buket kawat bulu untuk ulang tahun dan wisuda",
    image: "/images/karya-1.jpg",
    aspect: "aspect-[3/4]",
    tone: "from-mauve to-butter",
    order: 1,
  },
  {
    id: "w2",
    title: "poster & feed design",
    desc: "event posters and social media layouts",
    idn: "poster acara dan tata letak media sosial",
    image: "/images/karya-2.jpg",
    aspect: "aspect-square",
    tone: "from-blush to-mauve",
    order: 2,
  },
  {
    id: "w3",
    title: "hosting & MC",
    desc: "campus events, seminars, and celebrations",
    idn: "acara kampus, seminar, dan perayaan",
    image: "/images/karya-3.jpg",
    aspect: "aspect-[4/5]",
    tone: "from-cream to-blush",
    order: 3,
  },
];

export const projects = [
  "menyelesaikan studi di Fakultas Kesehatan Masyarakat",
  "menerima pesanan bunga kawat bulu",
  "belajar desain dan editing video",
  "membawakan acara kampus",
  "membaca satu novel setiap bulan",
];

export const orgs = [
  { org: "BEM Fakultas Kesehatan Masyarakat", role: "Anggota Divisi Humas", emoji: "🎓" },
  { org: "Komunitas Public Speaking", role: "MC & Moderator", emoji: "🎤" },
  { org: "Small Business — handmade flowers", role: "Founder", emoji: "🌷" },
];

export const testimonials = {
  title: "handmade with love ♡",
  sub: "setiap tangkai dibuat satu per satu",
  paras: [
    "Setiap bunga kawat bulu dibuat dengan tangan, satu kelopak setiap kali.",
    "Bukan sekadar hadiah — ini cara kecil untuk menitipkan perasaan pada seseorang.",
  ],
};

export const music = [
  { title: "RIPPLES — beabadoobee", src: "/music/RIPPLES.mp3" },
];
