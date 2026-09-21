/** Latar tetap: mesh gradient + tiga gumpalan warna yang bergerak pelan di belakang panel kaca. */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="mesh absolute inset-0" />
      <div className="absolute -left-24 top-24 h-80 w-80 animate-blob rounded-full bg-blush/45 blur-3xl" />
      <div className="absolute -right-28 top-1/2 h-96 w-96 animate-blob rounded-full bg-mauve/30 blur-3xl [animation-delay:-7s]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 animate-blob rounded-full bg-butter/35 blur-3xl [animation-delay:-14s]" />
    </div>
  );
}
