"use client";
import { useRef, useState } from "react";
import { useContent } from "./ContentProvider";

export default function MusicPlayer() {
  const { content } = useContent();
  const music = (content as Record<string, { fileUrl?: string }>).music;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const url = music?.fileUrl;
  if (!url) return null;

  return (
    <div className="glass fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2">
      <audio ref={audioRef} src={url} loop />
      <button
        type="button"
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        onClick={() => {
          if (!audioRef.current) return;
          if (playing) audioRef.current.pause(); else audioRef.current.play().catch(() => {});
          setPlaying(!playing);
        }}
        className="btn btn-glass !min-h-9 !px-4 text-xs"
      >
        {playing ? "Jeda" : "Putar"} musik
      </button>
    </div>
  );
}
