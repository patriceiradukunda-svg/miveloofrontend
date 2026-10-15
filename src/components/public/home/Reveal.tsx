'use client';
import { useEffect, useRef, useState } from 'react';

/** Fades content up once as it scrolls into view. Visible by default (no-JS / reduced-motion safe). */
export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setHidden(true);
    const io = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) { setHidden(false); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`transition duration-700 ease-out ${hidden ? 'translate-y-6 opacity-0' : ''} ${className}`}>{children}</div>;
}
