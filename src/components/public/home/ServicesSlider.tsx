'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { FeatureStatus } from '@/config/plans';

export interface ServiceSlide {
  id: string;
  plan: string;
  kind: 'free' | 'optional' | 'agreement';
  kindLabel: string;
  title: string;
  status: FeatureStatus;
  statusLabel: string;
  price: string;
  audience: string;
  icon: string[];
  bg: string;
  photo?: { src: string; alt: string };
}
export interface SliderLabels { region: string; prev: string; next: string; pause: string; play: string; goTo: string; slide: string; forWho: string }

const INTERVAL = 5000;
const GAP = '1.25rem';
const SIZES = '(min-width:1280px) 24vw, (min-width:1024px) 32vw, (min-width:640px) 48vw, 90vw';
const ring = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';
const statusTone: Record<FeatureStatus, string> = {
  available: 'bg-green-tint text-green-dark',
  'in-development': 'bg-gold-tint text-gold-dark',
  planned: 'bg-teal-tint text-teal-dark',
  agreement: 'bg-red-tint text-red-dark',
};
const statusMark: Record<FeatureStatus, string> = { available: '●', 'in-development': '◐', planned: '○', agreement: '◆' };
const kindTone: Record<ServiceSlide['kind'], string> = { free: 'bg-green-dark text-white', optional: 'bg-gold text-ink', agreement: 'bg-cream text-teal-dark' };

/**
 * Services carousel. Shows 1 card on phones, 2 on tablets, 3 on laptops and 4 on wide screens.
 * Moves one card every 5 seconds, then fades back to the first card (first → last → first, on repeat).
 * Pauses on hover and keyboard focus, has a pause button, supports swipe and arrow keys, and never autoplays
 * when the visitor prefers reduced motion.
 */
export function ServicesSlider({ slides, labels }: { slides: ServiceSlide[]; labels: SliderLabels }) {
  const total = slides.length;
  const viewport = useRef<HTMLDivElement>(null);
  const x0 = useRef<number | null>(null);
  const wrapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [n, setN] = useState(1);
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'out' | 'jump'>('idle');
  const [hover, setHover] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reduced, setReduced] = useState(true); // no autoplay until the preference is known
  const max = Math.max(0, total - n);
  const idx = Math.min(i, max);
  const halted = hover || stopped;
  const playing = !halted && !reduced && max > 0;

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setReduced(m.matches);
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const read = () => { const v = parseInt(getComputedStyle(el).getPropertyValue('--n'), 10); setN(Number.isFinite(v) && v > 0 ? v : 1); };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => () => { if (wrapTimer.current) clearTimeout(wrapTimer.current); }, []);

  const wrap = useCallback((target: number) => {
    if (wrapTimer.current) clearTimeout(wrapTimer.current);
    setPhase('out');
    wrapTimer.current = setTimeout(() => {
      setPhase('jump');
      setI(target);
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase('idle')));
    }, 320);
  }, []);
  const go = useCallback((k: number) => {
    if (max === 0) return;
    if (k < 0) { wrap(max); return; }
    if (k > max) { wrap(0); return; }
    setI(k);
    setTick((v) => v + 1);
  }, [max, wrap]);

  useEffect(() => {
    if (!playing || phase !== 'idle') return;
    const id = setTimeout(() => go(idx + 1), INTERVAL);
    return () => clearTimeout(id);
  }, [playing, phase, idx, tick, go]);

  const trackMotion = phase === 'idle' ? 'opacity-100 transition-[transform,opacity] duration-700 ease-out' : phase === 'out' ? 'opacity-0 transition-opacity duration-300' : 'opacity-0 transition-none';

  return (
    <div
      role="region" aria-roledescription="carousel" aria-label={labels.region}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHover(false); }}
      onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(idx - 1); if (e.key === 'ArrowRight') go(idx + 1); }}
      onPointerDown={(e) => { x0.current = e.clientX; }}
      onPointerUp={(e) => { if (x0.current !== null) { const d = e.clientX - x0.current; if (Math.abs(d) > 50) go(idx + (d < 0 ? 1 : -1)); x0.current = null; } }}
      className="touch-pan-y"
    >
      <style>{'@keyframes svcbar{from{width:0}to{width:100%}}'}</style>
      <div ref={viewport} className="-my-4 overflow-hidden py-4 [--n:1] sm:[--n:2] lg:[--n:3] xl:[--n:4]">
        <ul
          aria-live={playing ? 'off' : 'polite'}
          className={`flex ${trackMotion}`}
          style={{ gap: GAP, transform: `translateX(calc(${idx} * -1 * (100% + ${GAP}) / var(--n)))` }}
        >
          {slides.map((s, k) => (
            <li
              key={s.id} role="group" aria-roledescription="slide" aria-label={labels.slide.replace('{n}', String(k + 1)).replace('{total}', String(total))}
              aria-hidden={k < idx || k >= idx + n} className="shrink-0"
              style={{ flexBasis: `calc((100% - (var(--n) - 1) * ${GAP}) / var(--n))` }}
            >
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card">
                <div className="relative aspect-[16/10] overflow-hidden bg-teal-dark">
                  {s.photo ? (
                    <Image src={s.photo.src} alt={s.photo.alt} fill sizes={SIZES} className="object-cover" />
                  ) : (
                    <>
                      <Image src={`/images/miveloo-photos/${s.bg}.jpg`} alt="" fill sizes={SIZES} className="object-cover" />
                      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-teal-dark/90 via-teal/80 to-teal-dark/95" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="grid h-20 w-20 place-items-center rounded-full bg-gold text-ink shadow-card">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-9 w-9" aria-hidden>{s.icon.map((d) => <path key={d} d={d} />)}</svg>
                        </span>
                      </span>
                    </>
                  )}
                  <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${kindTone[s.kind]}`}>{s.kindLabel}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal">{s.plan}</p>
                  <h3 className="mt-2 text-balance font-display text-xl font-semibold text-teal-dark">{s.title}</h3>
                  <p className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[s.status]}`}><span aria-hidden>{statusMark[s.status]}</span>{s.statusLabel}</p>
                  <div className="mt-auto border-t border-ink/10 pt-4 text-sm text-ink-soft">
                    <p className="font-bold text-ink">{s.price}</p>
                    <p>{labels.forWho}: {s.audience}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center">
          {Array.from({ length: max + 1 }, (_, k) => (
            <button key={k} type="button" aria-label={`${labels.goTo} ${k + 1}`} aria-current={k === idx} onClick={() => go(k)} className={`grid h-11 w-6 place-items-center ${ring}`}>
              <span className={`h-2 rounded-full transition-all ${k === idx ? 'w-6 bg-teal' : 'w-2 bg-ink/25'}`} />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {!reduced && max > 0 && (
            <button type="button" aria-pressed={stopped} aria-label={stopped ? labels.play : labels.pause} onClick={() => setStopped((v) => !v)} className={`grid h-11 w-11 place-items-center rounded-full border-2 border-teal text-teal hover:bg-teal-tint ${ring}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>{stopped ? <path d="M8 5v14l11-7z" /> : <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>}</svg>
            </button>
          )}
          <button type="button" aria-label={labels.prev} onClick={() => go(idx - 1)} className={`grid h-11 w-11 place-items-center rounded-full bg-teal text-lg font-bold text-cream hover:bg-teal-dark ${ring}`}><span aria-hidden>←</span></button>
          <button type="button" aria-label={labels.next} onClick={() => go(idx + 1)} className={`grid h-11 w-11 place-items-center rounded-full bg-teal text-lg font-bold text-cream hover:bg-teal-dark ${ring}`}><span aria-hidden>→</span></button>
        </div>
      </div>
      {!reduced && max > 0 && (
        <div aria-hidden className="mt-4 h-1 overflow-hidden rounded-full bg-ink/10">
          <span key={`${idx}-${tick}-${phase}`} className="block h-full bg-gold" style={{ animation: `svcbar ${INTERVAL}ms linear forwards`, animationPlayState: halted || phase !== 'idle' ? 'paused' : 'running' }} />
        </div>
      )}
    </div>
  );
}
