"use client";
import { useState, useRef } from 'react';

const songs = [
  { title: "Pink Dreams", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Soft Heart", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Girly Vibes", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const changeSong = (index: number) => {
    setCurrent(index);
    setPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#FFC0CB]/90 backdrop-blur-md rounded-full px-4 py-3 shadow-xl border border-[#FFC0CB]/30 flex items-center gap-3">
      <audio ref={audioRef} src={songs[current].src} preload="auto" />
      <button onClick={toggle} className="text-[#8B3A4D] hover:scale-110 transition">
        {playing ? "⏸" : "▶"}
      </button>
      <span className="text-sm font-medium text-[#8B3A4D]">{songs[current].title}</span>
      <div className="flex gap-1">
        {songs.map((_, i) => (
          <button key={i} onClick={() => changeSong(i)} className={`w-2 h-2 rounded-full ${i === current ? 'bg-[#8B3A4D]' : 'bg-[#FFC0CB]'}`} />
        ))}
      </div>
    </div>
  );
}
