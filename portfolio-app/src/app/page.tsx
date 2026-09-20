import Link from 'next/link';
import ScrollAnimation from '../components/ScrollAnimation';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF5F7] via-[#FFE4E1]/30 to-[#FFF5F7]">
      {/* Hero iOS Glass */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
        <div className="absolute top-16 left-8 w-40 h-40 bg-[#FFC0CB]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-8 w-48 h-48 bg-[#E8A0BF]/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 bg-white/30 backdrop-blur-3xl rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-[#FFC0CB]/20 border border-white/30 max-w-5xl mx-auto">
          <h1 className="font-playfair text-7xl md:text-9xl text-[#8B3A4D] mb-6 tracking-tight leading-[0.85] drop-shadow-sm">
            Annisa Al Maghirah
          </h1>
          <p className="text-xl md:text-2xl text-[#8B3A4D]/60 font-light mb-3 tracking-widest uppercase">with passion</p>
          <p className="text-lg md:text-xl text-[#8B3A4D]/50 mb-10 tracking-wide italic">with love · with dreams</p>
          <p className="text-base md:text-lg text-[#8B3A4D]/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            Mahasiswa FKM — Public Speaking · MC · Bunga Kawat Bulu · Desain
          </p>
          <a href="#about" className="inline-flex items-center gap-3 px-10 py-5 bg-white/40 backdrop-blur-xl text-[#8B3A4D] rounded-full hover:bg-white/60 transition font-semibold text-lg shadow-xl shadow-[#FFC0CB]/20 border border-white/30 hover:scale-[1.03] duration-300">
            Lihat Karya & Skill
            <span className="text-2xl">↓</span>
          </a>
        </div>
      </section>

      {/* About */}
      <ScrollAnimation>
        <section id="about" className="py-28 px-6 max-w-6xl mx-auto">
          <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-[#FFC0CB]/10 border border-white/30">
            <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-4">Tentang Saya</h2>
            <p className="text-[#8B3A4D]/40 text-sm uppercase tracking-[0.3em] mb-10">with passion for creativity</p>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="relative">
                <img src="/images/profile.jpg" alt="Annisa Al Maghirah" className="w-full h-[32rem] object-cover rounded-[2.5rem] shadow-xl shadow-[#FFC0CB]/20" />
                <div className="absolute -bottom-4 -right-4 bg-[#FFC0CB]/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/20">
                  <p className="text-[#8B3A4D] font-playfair text-xl">Annisa</p>
                  <p className="text-[#8B3A4D]/60 text-xs">Mahasiswa FKM</p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-xl leading-loose text-[#8B3A4D]/80">
                  Saya adalah mahasiswa FKM yang memiliki minat besar dalam public speaking, menjadi MC, menjalankan usaha bunga kawat bulu, serta mengeksplorasi desain.
                </p>
                <p className="text-lg text-[#8B3A4D]/60 leading-relaxed">
                  Melalui portfolio ini, saya ingin berbagi perjalanan kreatif dan karya-karya yang telah saya hasilkan — <span className="italic text-[#8B3A4D]/40">with passion, with love, with dreams.</span>
                </p>
                <a href="#skills" className="inline-block px-8 py-4 bg-[#FFC0CB]/60 backdrop-blur-md text-[#8B3A4D] rounded-2xl hover:bg-[#FFC0CB] transition font-semibold shadow-lg shadow-[#FFC0CB]/20 border border-white/20 hover:scale-[1.02] duration-300">
                  Lihat Skill →
                </a>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Skills */}
      <ScrollAnimation delay={100}>
        <section id="skills" className="py-28 px-6">
          <div className="max-w-6xl mx-auto bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-[#FFC0CB]/10 border border-white/30">
            <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-2">Skill Saya</h2>
            <p className="text-[#8B3A4D]/40 text-sm uppercase tracking-[0.3em] mb-16">with dedication & practice</p>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { title: 'Public Speaking', desc: 'Pengalaman berbicara di depan umum dengan percaya diri dan energi.' },
                { title: 'MC', desc: 'Memimpin acara dengan interaksi menyenangkan dan profesional.' },
                { title: 'Usaha Bunga', desc: 'Membuat dan menjual karya bunga kawat bulu yang unik dan elegan.' },
                { title: 'Desain', desc: 'Merancang desain visual kreatif untuk berbagai kebutuhan.' },
              ].map((s) => (
                <div key={s.title} className="bg-white/50 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 shadow-lg shadow-[#FFC0CB]/10 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                  <h3 className="font-playfair text-2xl text-[#8B3A4D] mb-3">{s.title}</h3>
                  <p className="text-[#8B3A4D]/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Portfolio */}
      <ScrollAnimation delay={150}>
        <section id="portfolio" className="py-28 px-6 max-w-7xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-2">Portofolio</h2>
          <p className="text-[#8B3A4D]/40 text-sm uppercase tracking-[0.3em] mb-14">with creativity & care</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <a key={i} href="#" className="group block bg-white/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-xl shadow-[#FFC0CB]/10 border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                <div className="overflow-hidden">
                  <img src={`/images/portfolio-${i}.jpg`} alt={`Karya ${i}`} className="w-full h-72 object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-8">
                  <h3 className="font-playfair text-2xl text-[#8B3A4D] mb-2">Karya Desain {i}</h3>
                  <p className="text-sm text-[#8B3A4D]/50">Karya kreatif dengan sentuhan feminin dan lembut.</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      {/* Projects */}
      <ScrollAnimation delay={200}>
        <section id="projects" className="py-28 px-6">
          <div className="max-w-6xl mx-auto bg-white/40 backdrop-blur-2xl rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-[#FFC0CB]/10 border border-white/30">
            <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-2">Proyek</h2>
            <p className="text-[#8B3A4D]/40 text-sm uppercase tracking-[0.3em] mb-14">with vision & purpose</p>
            <div className="space-y-6">
              {[
                { title: 'Bunga Kawat Bulu Series 1', desc: 'Seri pertama usaha bunga kawat bulu dengan tema pastel.' },
                { title: 'Desain Poster Acara', desc: 'Poster untuk acara kampus dengan gaya modern minimalis.' },
                { title: 'Branding Pribadi', desc: 'Pengembangan identitas visual untuk personal brand.' },
              ].map((p) => (
                <div key={p.title} className="p-8 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/20 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                  <h3 className="font-playfair text-2xl text-[#8B3A4D] mb-2">{p.title}</h3>
                  <p className="text-[#8B3A4D]/60">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimation>

      {/* Testimonials */}
      <ScrollAnimation delay={250}>
        <section id="testimonials" className="py-28 px-6 max-w-6xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-2">Testimoni</h2>
          <p className="text-[#8B3A4D]/40 text-sm uppercase tracking-[0.3em] mb-14">with gratitude</p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: 'Klien A', text: 'Karya desainnya sangat kreatif dan sesuai dengan visi kami!' },
              { name: 'Klien B', text: 'Pelayanan sangat ramah dan hasilnya memuaskan.' },
            ].map((t) => (
              <blockquote key={t.name} className="p-10 bg-white/50 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-[#FFC0CB]/20 border border-white/20 hover:shadow-2xl hover:-translate-y-2 transition duration-300">
                <p className="italic text-2xl text-[#8B3A4D]/80 mb-6 leading-relaxed">"{t.text}"</p>
                <cite className="font-semibold text-[#8B3A4D] text-lg not-italic">— {t.name}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      </ScrollAnimation>

      {/* Contact */}
      <ScrollAnimation delay={300}>
        <section id="contact" className="py-28 px-6 max-w-4xl mx-auto">
          <h2 className="font-playfair text-5xl md:text-7xl text-[#8B3A4D] mb-2">Kontak</h2>
          <p className="text-[#8B3A4D]/40 text-sm uppercase tracking-[0.3em] mb-14">with openness</p>
          <form className="bg-white/40 backdrop-blur-3xl p-12 rounded-[3rem] shadow-2xl shadow-[#FFC0CB]/20 border border-white/30 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#8B3A4D] mb-2">Nama</label>
              <input id="name" type="text" className="w-full px-6 py-5 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/40 text-[#8B3A4D] text-lg" placeholder="Nama kamu" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#8B3A4D] mb-2">Email</label>
              <input id="email" type="email" className="w-full px-6 py-5 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/40 text-[#8B3A4D] text-lg" placeholder="email@kamu.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#8B3A4D] mb-2">Pesan</label>
              <textarea id="message" rows={4} className="w-full px-6 py-5 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/40 text-[#8B3A4D] text-lg resize-none" placeholder="Tulis pesanmu..." />
            </div>
            <button type="submit" className="w-full py-5 bg-[#FFC0CB]/80 text-[#8B3A4D] rounded-full hover:bg-[#FFC0CB] transition font-medium text-xl shadow-xl shadow-[#FFC0CB]/30 hover:scale-[1.02] duration-300 backdrop-blur-md">
              Kirim Pesan
            </button>
          </form>
        </section>
      </ScrollAnimation>

      {/* Download */}
      <ScrollAnimation delay={350}>
        <section id="download" className="py-28 px-6 text-center bg-gradient-to-br from-[#8B3A4D] to-[#FFC0CB]/20 text-[#FFF5F7]">
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/20 shadow-2xl">
            <h2 className="font-playfair text-5xl md:text-7xl mb-6">Download CV / Portfolio</h2>
            <p className="text-xl text-[#FFF5F7]/80 mb-10">Dapatkan ringkasan lengkap tentang profil dan karya saya dalam format PDF.</p>
            <a href="#" className="inline-block px-12 py-6 bg-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#E8A0BF] transition font-medium text-xl shadow-2xl shadow-[#FFC0CB]/30 hover:scale-105 duration-300 backdrop-blur-sm">
              Download PDF
            </a>
          </div>
        </section>
      </ScrollAnimation>

      {/* Footer */}
      <footer className="py-16 px-6 text-center text-[#8B3A4D]/30 text-sm">
        <p className="font-playfair text-xl mb-2">© 2026 — Annisa Al Maghirah · with passion, with love, with dreams.</p>
        <p className="text-xs">iOS Style Design · Glassmorphism · Pink Girly Theme</p>
      </footer>
    </main>
  );
}
