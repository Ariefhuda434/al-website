"use client";
import { useEffect, useRef } from 'react';

export default function ScrollAnimation({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            if (ref.current) {
              ref.current.style.opacity = '1';
              ref.current.style.transform = 'translateY(0)';
            }
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
      ref.current.style.opacity = '0';
      ref.current.style.transform = 'translateY(30px)';
      ref.current.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    }

    return () => observer.disconnect();
  }, [delay]);

  return <div ref={ref}>{children}</div>;
}
