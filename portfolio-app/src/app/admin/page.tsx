"use client";
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirebaseAuth } from '../../lib/firebaseConfig';

export default function Admin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      setLoggedIn(true);
      setError('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E1]/30 px-6 py-20">
        <div className="max-w-2xl mx-auto bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 shadow-2xl shadow-[#FFC0CB]/20 border border-white/30">
          <h1 className="font-playfair text-4xl text-[#8B3A4D] mb-8">Dashboard Admin</h1>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-[#8B3A4D] mb-2">Upload Foto Karya</label>
              <input type="file" accept="image/*" className="w-full px-4 py-3 rounded-2xl bg-white/50 border border-white/20" />
            </div>
            <button type="submit" className="w-full py-4 bg-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#E8A0BF] transition font-medium shadow-lg">
              Upload Foto
            </button>
          </form>
          <p className="mt-6 text-sm text-[#8B3A4D]/40">Upload foto karya desain atau produk bunga kawat bulu.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF5F7] to-[#FFE4E1]/30 px-6">
      <form onSubmit={handleLogin} className="w-full max-w-md bg-white/40 backdrop-blur-3xl rounded-[3rem] p-12 shadow-2xl shadow-[#FFC0CB]/20 border border-white/30 space-y-6">
        <h1 className="font-playfair text-4xl text-[#8B3A4D] mb-8 text-center">Login Admin</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#8B3A4D] mb-2">Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/30" placeholder="email@kamu.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#8B3A4D] mb-2">Password</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white/50 border border-white/20 focus:outline-none focus:ring-4 focus:ring-[#FFC0CB]/30" placeholder="Password" />
        </div>
        <button type="submit" className="w-full py-5 bg-[#FFC0CB] text-[#8B3A4D] rounded-full hover:bg-[#E8A0BF] transition font-medium text-lg shadow-xl shadow-[#FFC0CB]/30 hover:scale-[1.02] duration-300">
          Masuk
        </button>
      </form>
    </main>
  );
}
