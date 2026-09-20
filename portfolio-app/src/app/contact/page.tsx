export default function Contact() {
  return (
    <main className="min-h-screen px-6 py-20 max-w-3xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl text-[#4A3F35] mb-12">Kontak</h1>
      <form className="space-y-6 bg-white/60 p-8 rounded-3xl shadow-sm border border-[#F4C2C2]/30">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#4A3F35] mb-1">Nama</label>
          <input id="name" type="text" className="w-full px-4 py-3 rounded-xl bg-[#FDF6F0] border border-[#EDE3D5] focus:outline-none focus:ring-2 focus:ring-[#F4C2C2]" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#4A3F35] mb-1">Email</label>
          <input id="email" type="email" className="w-full px-4 py-3 rounded-xl bg-[#FDF6F0] border border-[#EDE3D5] focus:outline-none focus:ring-2 focus:ring-[#F4C2C2]" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-[#4A3F35] mb-1">Pesan</label>
          <textarea id="message" rows={4} className="w-full px-4 py-3 rounded-xl bg-[#FDF6F0] border border-[#EDE3D5] focus:outline-none focus:ring-2 focus:ring-[#F4C2C2]"></textarea>
        </div>
        <button type="submit" className="w-full py-3 bg-[#F4C2C2] text-[#4A3F35] rounded-full hover:bg-[#EDE3D5] transition font-medium">Kirim Pesan</button>
      </form>
    </main>
  );
}
