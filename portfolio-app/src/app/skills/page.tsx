import { getData } from '../../lib/firestoreHelpers';

export default async function Skills() {
  const skillsData = await getData('skills');
  const skills = skillsData.length > 0 ? skillsData : [
    { title: 'Public Speaking', description: 'Pengalaman berbicara di depan umum dengan percaya diri.' },
    { title: 'MC', description: 'Memimpin acara dengan energi dan interaksi yang menyenangkan.' },
    { title: 'Usaha Bunga Kawat Bulu', description: 'Membuat dan menjual karya bunga kawat bulu yang unik.' },
    { title: 'Desain', description: 'Merancang desain visual untuk berbagai kebutuhan kreatif.' },
  ];

  return (
    <main className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl text-[#4A3F35] mb-12">Skill Saya</h1>
      <div className="grid md:grid-cols-2 gap-8">
        {skills.map((s: any, i: number) => (
          <div key={i} className="p-8 bg-white/60 rounded-3xl shadow-sm border border-[#F4C2C2]/30">
            <h3 className="font-playfair text-2xl text-[#4A3F35] mb-3">{s.title || s.name}</h3>
            <p className="text-[#4A3F35]/70">{s.description || s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
