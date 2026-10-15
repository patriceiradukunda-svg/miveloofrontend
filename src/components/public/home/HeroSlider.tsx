'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface Slide { src: string; alt: string; pos?: string }
interface Labels { region: string; prev: string; next: string; goTo: string }
const INTERVAL = 5500;

/** Full-screen background slider with a progress dot. Children (headline, CTAs) sit on top. */
export function HeroSlider({ slides, labels, children }: { slides: Slide[]; labels: Labels; children: React.ReactNode }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // restarts the progress bar whenever autoplay (re)starts
  const [reduced, setReduced] = useState(true); // no autoplay until the preference is known
  const x0 = useRef<number | null>(null);
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setReduced(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  useEffect(() => {
    if (paused || reduced) return;
    setTick((v) => v + 1);
    const id = setInterval(() => setI((k) => (k + 1) % n), INTERVAL);
    return () => clearInterval(id);
  }, [paused, reduced, n, i]);

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label={labels.region}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); }}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { if (x0.current !== null) { const d = e.clientX - x0.current; if (Math.abs(d) > 60) go(i + (d < 0 ? 1 : -1)); x0.current = null; } }}
      className="relative isolate flex min-h-[calc(100svh-5rem)] touch-pan-y flex-col justify-end overflow-hidden bg-ink text-cream"
    >
      <style>{'@keyframes hbar{from{width:0}to{width:100%}}'}</style>
      <div aria-live={paused || reduced ? 'polite' : 'off'} className="absolute inset-0 -z-10">
        {slides.map((s, k) => (
          <div key={s.src} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${n}`} aria-hidden={k !== i}
            className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? 'opacity-100' : 'opacity-0'}`}>
            <Image src={s.src} alt={s.alt} fill priority={k === 0} sizes="100vw" className="object-cover" style={{ objectPosition: s.pos }} />
          </div>
        ))}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/60 via-ink/10 to-transparent" />
      {children}
      <div className="absolute bottom-6 right-4 z-10 flex items-center gap-0.5 sm:right-8">
        {slides.map((s, k) => (
          <button key={s.src} type="button" aria-label={`${labels.goTo} ${k + 1}`} aria-current={k === i} onClick={() => go(k)} className="grid h-8 w-7 place-items-center">
            <span className={`relative h-2 overflow-hidden rounded-full transition-all ${k === i ? `w-8 ${reduced ? 'bg-gold' : 'bg-cream/40'}` : 'w-2 bg-cream/70'}`}>
              {k === i && !reduced && <span key={`${i}-${tick}`} className="absolute inset-y-0 left-0 bg-gold" style={{ animation: `hbar ${INTERVAL}ms linear forwards`, animationPlayState: paused ? 'paused' : 'running' }} />}
            </span>
          </button>
        ))}
        <button type="button" aria-label={labels.prev} onClick={() => go(i - 1)} className="ml-2 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-lg font-bold text-teal-dark hover:bg-gold"><span aria-hidden>←</span></button>
        <button type="button" aria-label={labels.next} onClick={() => go(i + 1)} className="ml-1 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-lg font-bold text-teal-dark hover:bg-gold"><span aria-hidden>→</span></button>
      </div>
    </div>
  );
}
