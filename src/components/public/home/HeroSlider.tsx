'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

/** pos = focal point on large screens (text over photo); posSm = focal point when the photo is shown on its own (below lg). */
export interface Slide { src: string; alt: string; pos?: string; posSm?: string }
interface Labels { region: string; prev: string; next: string; goTo: string; pause?: string; play?: string }
const INTERVAL = 5500;
const ring = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

/**
 * Hero slider.
 * - Below lg: the photo sits on top (nothing is cropped away behind text) and the headline and buttons follow on a solid dark band.
 * - From lg up: full-screen photo background with the text on top, as before.
 * Autoplay pauses on hover/focus, has an explicit pause button, and stays off under reduced motion.
 */
export function HeroSlider({ slides, labels, children }: { slides: Slide[]; labels: Labels; children: React.ReactNode }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false); // hover / keyboard focus
  const [stopped, setStopped] = useState(false); // pause button
  const [tick, setTick] = useState(0); // restarts the progress bar whenever autoplay (re)starts
  const [reduced, setReduced] = useState(true); // no autoplay until the preference is known
  const x0 = useRef<number | null>(null);
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n]);
  const halted = paused || stopped;

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setReduced(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  useEffect(() => {
    if (halted || reduced) return;
    setTick((v) => v + 1);
    const id = setInterval(() => setI((k) => (k + 1) % n), INTERVAL);
    return () => clearInterval(id);
  }, [halted, reduced, n, i]);

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label={labels.region}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); }}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { if (x0.current !== null) { const d = e.clientX - x0.current; if (Math.abs(d) > 60) go(i + (d < 0 ? 1 : -1)); x0.current = null; } }}
      className="relative isolate flex touch-pan-y flex-col overflow-hidden bg-ink text-cream lg:min-h-[calc(100svh-5rem)] lg:justify-end"
    >
      <style>{'@keyframes hbar{from{width:0}to{width:100%}}'}</style>

      <div className="relative lg:static">
        <div aria-live={halted || reduced ? 'polite' : 'off'} className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:absolute lg:inset-0 lg:-z-10 lg:aspect-auto">
          {slides.map((s, k) => (
            <div key={s.src} role="group" aria-roledescription="slide" aria-label={`${k + 1} / ${n}`} aria-hidden={k !== i}
              className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? 'opacity-100' : 'opacity-0'}`}>
              <Image
                src={s.src} alt={s.alt} fill priority={k === 0} sizes="100vw"
                className="object-cover [object-position:var(--pos-sm)] lg:[object-position:var(--pos)]"
                style={{ '--pos': s.pos ?? 'center', '--pos-sm': s.posSm ?? s.pos ?? 'center' } as React.CSSProperties}
              />
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-0.5 max-lg:rounded-full max-lg:bg-ink/65 max-lg:px-2 max-lg:py-0.5 lg:bottom-6 lg:right-8">
          {slides.map((s, k) => (
            <button key={s.src} type="button" aria-label={`${labels.goTo} ${k + 1}`} aria-current={k === i} onClick={() => go(k)} className={`grid h-11 w-6 place-items-center sm:w-7 ${ring}`}>
              <span className={`relative h-2 overflow-hidden rounded-full transition-all ${k === i ? `w-6 sm:w-8 ${reduced ? 'bg-gold' : 'bg-cream/40'}` : 'w-2 bg-cream/70'}`}>
                {k === i && !reduced && <span key={`${i}-${tick}`} className="absolute inset-y-0 left-0 bg-gold" style={{ animation: `hbar ${INTERVAL}ms linear forwards`, animationPlayState: halted ? 'paused' : 'running' }} />}
              </span>
            </button>
          ))}
          {!reduced && (
            <button type="button" aria-pressed={stopped} aria-label={stopped ? (labels.play ?? 'Play photo rotation') : (labels.pause ?? 'Pause photo rotation')} onClick={() => setStopped((v) => !v)} className={`ml-1 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-teal-dark hover:bg-gold ${ring}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>{stopped ? <path d="M8 5v14l11-7z" /> : <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>}</svg>
            </button>
          )}
          <button type="button" aria-label={labels.prev} onClick={() => go(i - 1)} className={`ml-1 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-lg font-bold text-teal-dark hover:bg-gold ${ring}`}><span aria-hidden>←</span></button>
          <button type="button" aria-label={labels.next} onClick={() => go(i + 1)} className={`ml-1 grid h-11 w-11 place-items-center rounded-full bg-cream/90 text-lg font-bold text-teal-dark hover:bg-gold ${ring}`}><span aria-hidden>→</span></button>
        </div>
      </div>

      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10 lg:block" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-ink/60 via-ink/10 to-transparent lg:block" />
      {children}
    </div>
  );
}
