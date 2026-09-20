import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import MusicPlayer from '../components/MusicPlayer';
import Navbar from '../components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Portfolio Kreatif',
  description: 'Portfolio pribadi mahasiswa FKM — Public Speaking, MC, Usaha Bunga Kawat Bulu, Desain.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FDF6F0] text-[#4A3F35] font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <MusicPlayer />
      </body>
    </html>
  );
}
