"use client";
import { useEffect, useRef, useState } from 'react';
import { site } from '../lib/content';

const songs = [
  { title: "RIPPLES — beabadoobee", src: "/music/RIPPLES.mp3", startAt: 10 },
];

export default function MusicPlayer() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const tryAutoplay = () =>
      a.play().then(() => setPlaying(true)).catch(() => {});
    tryAutoplay();
    const onVisibility = () => {
      if (!document.hidden && !a.paused) a.currentTime = songs[current].startAt;
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [current]);

  const playFrom = (t: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (a.currentTime < t) a.currentTime = t;
    a.play().then(() => setPlaying(true)).catch(() => {});
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      playFrom(songs[current].startAt);
    }
  };

  const changeSong = (index: number) => {
    setCurrent(index);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#FFC0CB]/90 backdrop-blur-3xl rounded-[2.5rem] px-5 py-4 shadow-2xl shadow-[#FFC0CB]/30 border border-white/20 flex items-center gap-4">
      <audio ref={audioRef} src={songs[current].src} preload="auto" />
      
      {/* Vinyl Spinning Record */}
      <div className={`relative w-14 h-14 flex items-center justify-center ${playing ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
        <div className="absolute w-14 h-14 rounded-full bg-gradient-to-br from-[#8B3A4D] via-[#FFC0CB] to-[#E8A0BF] shadow-lg shadow-[#8B3A4D]/30" />
        <div className="absolute w-5 h-5 rounded-full bg-[#8B3A4D] border-2 border-[#FFC0CB]" />
        <div className="absolute w-2 h-2 rounded-full bg-[#FFC0CB] opacity-50" />
      </div>
      
      <button onClick={toggle} className="text-[#8B3A4D] hover:scale-110 transition text-xl font-bold">
        {playing ? "⏸" : "▶"}
      </button>
      
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#8B3A4D]">{songs[current].title}</span>
        <span className="text-xs text-[#8B3A4D]/50">{site.shortName}</span>
      </div>
      
      <div className="flex gap-2">
        {songs.map((_, i) => (
          <button key={i} onClick={() => changeSong(i)} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === current ? 'bg-[#8B3A4D] scale-125' : 'bg-[#FFC0CB]/50 hover:bg-[#FFC0CB]'}`} />
        ))}
      </div>
    </div>
  );
}
