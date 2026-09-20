import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF6F0]/80 backdrop-blur-md border-b border-[#F4C2C2]/20 px-6 py-4 flex justify-center gap-6 md:gap-10 text-sm md:text-base font-medium text-[#4A3F35]/70">
      <a href="#hero" className="hover:text-[#4A3F35] transition">Home</a>
      <a href="#about" className="hover:text-[#4A3F35] transition">Tentang</a>
      <a href="#skills" className="hover:text-[#4A3F35] transition">Skill</a>
      <a href="#portfolio" className="hover:text-[#4A3F35] transition">Portofolio</a>
      <a href="#projects" className="hover:text-[#4A3F35] transition">Proyek</a>
      <a href="#testimonials" className="hover:text-[#4A3F35] transition">Testimoni</a>
      <a href="#contact" className="hover:text-[#4A3F35] transition">Kontak</a>
      <a href="#download" className="hover:text-[#4A3F35] transition">Download</a>
    </nav>
  );
}
