'use client';
import { useEffect, useState } from 'react';

/** Sticky glass header that firms up (and the logo shrinks, via group-data) once the page scrolls. */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const f = () => setS(window.scrollY > 24);
    f(); window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <header data-scrolled={s} className={`group sticky top-0 z-40 border-b backdrop-blur-xl transition-all duration-300 ${s ? 'border-ink/10 bg-cream/90 shadow-card' : 'border-transparent bg-cream/70'}`}>
      {children}
    </header>
  );
}
