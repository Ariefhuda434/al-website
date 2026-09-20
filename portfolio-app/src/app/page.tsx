import Link from 'next/link';
import ScrollAnimation from '../components/ScrollAnimation';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden bg-gradient-to-br from-[#FFC0CB]/20 via-[#FFE4E1] to-[#FFF5F7]">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FFC0CB]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#E8A0BF]/30 rounded-full blur-3xl animate-pulse" />
        <div className="max-w-4xl z-10">
          <h1 className="font-playfair text-6xl md:text-9xl text-[#8B3A4D] mb-6 tracking-tight leading-tight drop-shadow-lg">
            Nama Pacar Kamu
          </h1>
          <p className="text-2xl md:text-3xl text-[#8B3A4D]/70 font-light mb-12 tracking-wide">
            Mahasiswa FKM — Public Speaking · MC · Bunga Kawat Bulu · Desain
          </p>
          <a href="#about" className="inline-block px-10 py-5 bg-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#E8A0BF] transition font-medium text-lg shadow-xl shadow-[#FFC0CB]/40 hover:scale-105 duration-300">
            Lihat Karya & Skill ↓
          </a>
        </div>
      </section>

      {/* About */}
      <ScrollAnimation>
        <section id="about" className="py-32 px-6 max-w-6xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-12">Tentang Saya</h2>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <img src="/images/profile.jpg" alt="Foto profil" className="w-full h-[28rem] object-cover rounded-3xl shadow-2xl shadow-[#FFC0CB]/30 hover:scale-[1.02] transition duration-500" />
            <div>
              <p className="text-xl leading-relaxed text-[#8B3A4D]/80 mb-8">
                Saya adalah mahasiswa FKM yang memiliki minat besar dalam public speaking, menjadi MC, menjalankan usaha bunga kawat bulu, serta mengeksplorasi desain. Melalui portfolio ini, saya ingin berbagi perjalanan kreatif dan karya-karya yang telah saya hasilkan.
              </p>
              <a href="#skills" className="inline-block px-8 py-4 border-2 border-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#FFC0CB] transition font-medium hover:scale-105 duration-300">Lihat Skill →</a>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Skills */}
      <ScrollAnimation delay={100}>
        <section id="skills" className="py-32 px-6 bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E1]/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-4">Skill Saya</h2>
            <p className="text-[#8B3A4D]/60 mb-16 text-xl max-w-xl">Keahlian yang saya kembangkan selama perjalanan kreatif saya.</p>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: 'Public Speaking', desc: 'Pengalaman berbicara di depan umum dengan percaya diri.' },
                { title: 'MC', desc: 'Memimpin acara dengan energi dan interaksi menyenangkan.' },
                { title: 'Usaha Bunga', desc: 'Membuat dan menjual karya bunga kawat bulu yang unik.' },
                { title: 'Desain', desc: 'Merancang desain visual untuk berbagai kebutuhan kreatif.' },
              ].map((s) => (
                <div key={s.title} className="p-8 bg-white/70 rounded-3xl shadow-lg shadow-[#FFC0CB]/20 border border-[#FFC0CB]/30 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                  <h3 className="font-playfair text-3xl text-[#8B3A4D] mb-4">{s.title}</h3>
                  <p className="text-[#8B3A4D]/60 text-base leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Portfolio */}
      <ScrollAnimation delay={150}>
        <section id="portfolio" className="py-32 px-6 max-w-7xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-4">Portofolio</h2>
          <p className="text-[#8B3A4D]/60 mb-16 text-xl max-w-xl">Karya desain dan produk kreatif yang saya hasilkan.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <a key={i} href="#" className="group block bg-white rounded-3xl overflow-hidden shadow-lg shadow-[#FFC0CB]/20 border border-[#FFC0CB]/20 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                <div className="overflow-hidden">
                  <img src={`/images/portfolio-${i}.jpg`} alt={`Karya ${i}`} className="w-full h-80 object-cover group-hover:scale-110 transition duration-700" />
                </div>
                <div className="p-10">
                  <h3 className="font-playfair text-2xl text-[#8B3A4D] mb-3">Karya Desain {i}</h3>
                  <p className="text-sm text-[#8B3A4D]/60">Karya desain kreatif dengan sentuhan feminin dan lembut.</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      {/* Projects */}
      <ScrollAnimation delay={200}>
        <section id="projects" className="py-32 px-6 bg-gradient-to-b from-[#FFE4E1]/50 to-[#FFF5F7]">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-4">Proyek</h2>
            <p className="text-[#8B3A4D]/60 mb-16 text-xl max-w-xl">Beberapa proyek yang sudah saya kerjakan.</p>
            <div className="space-y-8">
              {[
                { title: 'Bunga Kawat Bulu Series 1', desc: 'Seri pertama usaha bunga kawat bulu dengan tema pastel.' },
                { title: 'Desain Poster Acara', desc: 'Poster untuk acara kampus dengan gaya modern minimalis.' },
                { title: 'Branding Pribadi', desc: 'Pengembangan identitas visual untuk personal brand.' },
              ].map((p) => (
                <div key={p.title} className="p-10 bg-white rounded-3xl shadow-lg shadow-[#FFC0CB]/10 border border-[#FFC0CB]/20 hover:shadow-2xl hover:-translate-y-1 transition duration-300">
                  <h3 className="font-playfair text-3xl text-[#8B3A4D] mb-3">{p.title}</h3>
                  <p className="text-[#8B3A4D]/60 text-lg">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Testimonials */}
      <ScrollAnimation delay={250}>
        <section id="testimonials" className="py-32 px-6 max-w-6xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-4">Testimoni</h2>
          <p className="text-[#8B3A4D]/60 mb-16 text-xl max-w-xl">Apa kata mereka tentang karya saya.</p>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              { name: 'Klien A', text: 'Karya desainnya sangat kreatif dan sesuai dengan visi kami!' },
              { name: 'Klien B', text: 'Pelayanan sangat ramah dan hasilnya memuaskan.' },
            ].map((t) => (
              <blockquote key={t.name} className="p-12 bg-white rounded-3xl shadow-xl shadow-[#FFC0CB]/20 border border-[#FFC0CB]/20 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                <p className="italic text-2xl text-[#8B3A4D]/80 mb-8 leading-relaxed">"{t.text}"</p>
                <cite className="font-semibold text-[#8B3A4D] text-xl not-italic">— {t.name}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      {/* Contact */}
      <ScrollAnimation delay={300}>
        <section id="contact" className="py-32 px-6 max-w-4xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-4">Kontak</h2>
          <p className="text-[#8B3A4D]/60 mb-14 text-xl">Mari berkolaborasi atau sekadar menyapa.</p>
          <form className="space-y-6 bg-white/80 backdrop-blur-md p-12 rounded-3xl shadow-2xl shadow-[#FFC0CB]/20 border border-[#FFC0CB]/20">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#8B3A4D] mb-2">Nama</label>
              <input id="name" type="text" className="w-full px-6 py-5 rounded-2xl bg-[#FFF5F7] border border-[#FFC0CB]/30 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/40 text-[#8B3A4D] text-lg" placeholder="Nama kamu" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#8B3A4D] mb-2">Email</label>
              <input id="email" type="email" className="w-full px-6 py-5 rounded-2xl bg-[#FFF5F7] border border-[#FFC0CB]/30 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/40 text-[#8B3A4D] text-lg" placeholder="email@kamu.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#8B3A4D] mb-2">Pesan</label>
              <textarea id="message" rows={4} className="w-full px-6 py-5 rounded-2xl bg-[#FFF5F7] border border-[#FFC0CB]/30 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/40 text-[#8B3A4D] text-lg resize-none" placeholder="Tulis pesanmu..." />
            </div>
            <button type="submit" className="w-full py-5 bg-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#E8A0BF] transition font-medium text-xl shadow-xl shadow-[#FFC0CB]/30 hover:scale-[1.02] duration-300">
              Kirim Pesan
            </button>
          </form>
        </section>
      </ScrollAnimation>

      {/* Download */}
      <ScrollAnimation delay={350}>
        <section id="download" className="py-32 px-6 text-center bg-gradient-to-br from-[#8B3A4D] to-[#FFC0CB]/20 text-[#FFF5F7]">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-playfair text-5xl md:text-7xl mb-6">Download CV / Portfolio</h2>
            <p className="text-xl text-[#FFF5F7]/80 mb-12">Dapatkan ringkasan lengkap tentang profil dan karya saya dalam format PDF.</p>
            <a href="#" className="inline-block px-12 py-6 bg-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#E8A0BF] transition font-medium text-xl shadow-2xl shadow-[#FFC0CB]/30 hover:scale-105 duration-300">
              Download PDF
            </a>
          </div>
        </section>
      </ScrollAnimation>

      {/* Footer */}
      <footer className="py-16 px-6 text-center text-[#8B3A4D]/30 text-sm">
        <p className="font-playfair text-xl mb-2">© 2026 — Dibuat dengan cinta untuk pacar tercinta.</p>
        <p className="text-xs">Tema Pink Girly · Animasi Scroll · Musik Gratis</p>
      </footer>
    </main>
  );
}
