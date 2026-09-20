import { getData } from '../../lib/firestoreHelpers';

export default async function About() {
  const profiles = await getData('profiles');
  const profile: any = profiles[0] || { name: 'Nama Pacar Kamu', bio: 'Bio belum diisi.', profileImageUrl: '/images/profile.jpg' };

  return (
    <main className="min-h-screen px-6 py-20 max-w-4xl mx-auto">
      <h1 className="font-playfair text-4xl md:text-5xl text-[#4A3F35] mb-8">Tentang Saya</h1>
      <p className="text-lg leading-relaxed text-[#4A3F35]/80 mb-6">{profile.bio}</p>
      <img src={profile.profileImageUrl} alt="Foto profil" className="w-64 h-64 object-cover rounded-3xl shadow-xl mb-6" />
    </main>
  );
}
