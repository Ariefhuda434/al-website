import { useId } from "react";

const palettes = {
  blush: { petal: "#FFC0CB", edge: "#F08FA8", core: "#F8DDA4" },
  mauve: { petal: "#E8A0BF", edge: "#C4709A", core: "#FFF1C9" },
  rose: { petal: "#E27A97", edge: "#B24463", core: "#F8DDA4" },
  cream: { petal: "#FFE4EA", edge: "#F2B1C3", core: "#F2C46D" },
} as const;

export type Tone = keyof typeof palettes;

/** Filter turbulensi kecil supaya tepi kelopak terlihat berbulu seperti pipe cleaner. */
function FuzzFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
}

function Petals({ petals, tone, filterId }: { petals: number; tone: Tone; filterId: string }) {
  const p = palettes[tone];
  return (
    <g filter={`url(#${filterId})`}>
      {Array.from({ length: petals }).map((_, i) => (
        <g key={i} transform={`rotate(${(360 / petals) * i})`}>
          <path
            d="M0 0 C -19 -12 -21 -46 0 -60 C 21 -46 19 -12 0 0 Z"
            fill={p.petal}
            fillOpacity="0.72"
            stroke={p.edge}
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d="M0 -9 C -8 -17 -9 -35 0 -45 C 9 -35 8 -17 0 -9 Z"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.55"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ))}
      <circle r="12" fill={p.core} stroke={p.edge} strokeWidth="3" />
      <circle r="4.5" fill="#fff" fillOpacity="0.6" />
    </g>
  );
}

function useSafeId() {
  return useId().replace(/[^a-zA-Z0-9]/g, "");
}

/** Kepala bunga saja. Dipakai sebagai logo, ornamen, dan placeholder gambar. */
export function FlowerHead({
  tone = "blush",
  petals = 8,
  className,
}: {
  tone?: Tone;
  petals?: number;
  className?: string;
}) {
  const id = `fz${useSafeId()}`;
  return (
    <svg viewBox="-70 -70 140 140" className={className} aria-hidden="true" focusable="false">
      <defs>
        <FuzzFilter id={id} />
      </defs>
      <Petals petals={petals} tone={tone} filterId={id} />
    </svg>
  );
}

/** Bunga lengkap dengan tangkai dan daun. Lebar viewBox tetap 120, tinggi = length. */
export function FlowerStem({
  tone = "blush",
  petals = 7,
  length = 340,
  leaf = "left",
}: {
  tone?: Tone;
  petals?: number;
  length?: number;
  leaf?: "left" | "right";
}) {
  const id = `fz${useSafeId()}`;
  const H = length;
  const ly = H * 0.62;
  const ly2 = H * 0.42;
  const stem = `M60 ${H} C 68 ${H * 0.72}, 50 ${H * 0.42}, 60 66`;
  const leafPath = (y: number) =>
    `M60 ${y} C 34 ${y - 6}, 20 ${y - 30}, 26 ${y - 48} C 52 ${y - 42}, 64 ${y - 18}, 60 ${y} Z`;

  return (
    <svg
      viewBox={`0 0 120 ${H}`}
      className="h-full w-full overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <FuzzFilter id={id} />
      </defs>
      <path d={stem} fill="none" stroke="#7FA085" strokeWidth="4" strokeLinecap="round" />
      <path d={stem} fill="none" stroke="#B9D0BC" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.9" />
      <g transform={leaf === "left" ? undefined : "translate(120 0) scale(-1 1)"}>
        <path d={leafPath(ly)} fill="#A9C4AC" stroke="#7FA085" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform={leaf === "left" ? "translate(120 0) scale(-1 1)" : undefined}>
        <path d={leafPath(ly2)} fill="#B9D0BC" stroke="#7FA085" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g transform="translate(60 66)">
        <Petals petals={petals} tone={tone} filterId={id} />
      </g>
    </svg>
  );
}

/** Bintang kecil 4 sudut untuk kilau dekoratif. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="M12 0 C 13 8, 16 11, 24 12 C 16 13, 13 16, 12 24 C 11 16, 8 13, 0 12 C 8 11, 11 8, 12 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}
