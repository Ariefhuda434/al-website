import { getData } from '../../lib/firestoreHelpers';

export default async function Testimonials() {
  const testimonialsData = await getData('testimonials');
  const testimonials = testimonialsData.length > 0 ? testimonialsData : [
    { name: 'Klien A', text: 'Karya desainnya sangat kreatif dan sesuai dengan visi kami!' },
    { name: 'Klien B', text: 'Pelayanan sangat ramah dan hasilnya memuaskan.' },
  ];

  return (
    <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl text-[#4A3F35] mb-12">Testimoni</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((t: any, i: number) => (
          <div key={i} className="p-8 bg-white/60 rounded-3xl shadow-sm border border-[#F4C2C2]/30">
            <p className="italic text-lg text-[#4A3F35]/80 mb-4">"{t.text}"</p>
            <p className="font-semibold text-[#4A3F35]">— {t.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
