import { getData } from '../../lib/firestoreHelpers';

export default async function Portfolio() {
  const projects = await getData('projects');
  const portfolioItems = projects.length > 0 ? projects : [
    { title: 'Karya Desain 1', description: 'Karya desain kreatif dengan sentuhan feminin dan lembut.', imageUrl: '/images/portfolio-1.jpg' },
    { title: 'Karya Desain 2', description: 'Eksplorasi visual dengan palet pastel.', imageUrl: '/images/portfolio-2.jpg' },
    { title: 'Karya Desain 3', description: 'Proyek branding personal.', imageUrl: '/images/portfolio-3.jpg' },
  ];

  return (
    <main className="min-h-screen px-6 py-20 max-w-6xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl text-[#4A3F35] mb-12">Portofolio</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {portfolioItems.map((item: any, i: number) => (
          <div key={i} className="bg-white/60 rounded-3xl overflow-hidden shadow-sm border border-[#F4C2C2]/30 hover:shadow-xl transition">
            <img src={item.imageUrl || '/images/portfolio.jpg'} alt={item.title} className="w-full h-64 object-cover" />
            <div className="p-6">
              <h3 className="font-playfair text-xl text-[#4A3F35] mb-2">{item.title}</h3>
              <p className="text-sm text-[#4A3F35]/60">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
