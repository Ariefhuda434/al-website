export default function Section({
  id,
  children,
  className = "",
  wide = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <section id={id} className={`scroll-mt-20 overflow-x-clip px-5 py-14 sm:px-8 md:py-20 ${className}`}>
      <div className={`mx-auto ${wide ? "max-w-7xl" : "max-w-6xl"}`}>{children}</div>
    </section>
  );
}
