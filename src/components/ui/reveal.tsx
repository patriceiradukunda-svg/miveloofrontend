"use client";
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
/** Fades content in as it scrolls into view. Content is visible without JS and under reduced motion. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add('in'); io.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={cn('reveal', className)}>{children}</div>;
}
