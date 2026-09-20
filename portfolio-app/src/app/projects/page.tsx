import { getData } from '../../lib/firestoreHelpers';

export default async function Projects() {
  const projectsData = await getData('projects');
  const projects = projectsData.length > 0 ? projectsData : [
    { title: 'Bunga Kawat Bulu Series 1', description: 'Seri pertama usaha bunga kawat bulu dengan tema pastel.' },
    { title: 'Desain Poster Acara', description: 'Poster untuk acara kampus dengan gaya modern minimalis.' },
    { title: 'Branding Pribadi', description: 'Pengembangan identitas visual untuk personal brand.' },
  ];

  return (
    <main className="min-h-screen px-6 py-20 max-w-5xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl text-[#4A3F35] mb-12">Proyek</h1>
      <div className="space-y-8">
        {projects.map((p: any, i: number) => (
          <div key={i} className="p-8 bg-white/60 rounded-3xl shadow-sm border border-[#F4C2C2]/30">
            <h3 className="font-playfair text-2xl text-[#4A3F35] mb-3">{p.title}</h3>
            <p className="text-[#4A3F35]/70">{p.description || p.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
