"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Scene } from '@/components/media/Scenes';
import { startPaths, tourSteps } from '@/config/tour';
import { founder } from '@/config/founder';
import { useT } from '@/providers/LocaleProvider';
import type { PhotoKey } from '@/lib/photos';
import { cn } from '@/lib/utils';

const KEY = 'mv_tour_step';
export function TourPlayer({ photos, compact, onClose }: { photos: Record<PhotoKey, string | null>; compact?: boolean; onClose?: () => void }) {
  const { locale } = useT(); const [i, setI] = useState(0); const last = tourSteps.length - 1;
  useEffect(() => { try { const s = Number(localStorage.getItem(KEY)); if (s > 0 && s <= last) setI(s); } catch { /* storage unavailable */ } }, [last]);
  const go = useCallback((n: number) => { const c = Math.max(0, Math.min(last, n)); setI(c); try { localStorage.setItem(KEY, String(c)); } catch { /* ignore */ } }, [last]);
  useEffect(() => { const f = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }; addEventListener('keydown', f); return () => removeEventListener('keydown', f); }, [i, go]);
  const s = tourSteps[i]!; const photo = s.photo ? photos[s.photo] : null; const title = s.title[locale] ?? s.title.en;
  return (
    <section aria-roledescription="guided tour" aria-label="Guided tour with the founder" className={cn('overflow-hidden rounded-3xl bg-white shadow-card', compact ? '' : 'border border-ink/10')}>
      <div className="h-2 bg-cream-deep" role="progressbar" aria-valuemin={1} aria-valuemax={tourSteps.length} aria-valuenow={i + 1} aria-label={`Step ${i + 1} of ${tourSteps.length}`}><div className="h-full bg-gold transition-all" style={{ width: `${((i + 1) / tourSteps.length) * 100}%` }} /></div>
      <div key={s.id} className={cn('rise grid gap-6 p-5 sm:p-8', compact ? 'md:grid-cols-[1fr_1fr]' : 'lg:grid-cols-[1.05fr_1fr]')}>
        <div className="order-2 space-y-4 lg:order-1">
          <div className="flex items-center gap-3">
            <Image src={founder.photo} alt={`${founder.name}, ${founder.title}`} width={56} height={56} className="h-14 w-14 rounded-full border-2 border-gold object-cover" />
            <p className="text-sm"><strong className="block text-base">{founder.name}</strong><span className="text-ink-soft">{founder.title} · step {i + 1} of {tourSteps.length}</span></p>
          </div>
          <h2 className="text-3xl font-semibold text-balance text-teal-dark sm:text-4xl">{title}</h2>
          <blockquote className="relative rounded-2xl rounded-tl-sm bg-cream p-4 text-lg leading-relaxed"><span aria-hidden className="absolute -top-3 left-3 font-display text-5xl leading-none text-gold">“</span>{s.say}</blockquote>
          {s.points.length > 0 && <ul className="space-y-1.5">{s.points.map((p) => <li key={p} className="flex gap-2"><span aria-hidden className="text-green">✔</span>{p}</li>)}</ul>}
          {s.id === 'start' && <div className="grid gap-2 sm:grid-cols-2">{startPaths.map((p) => <Link key={p.href} href={p.href} className="inline-flex min-h-12 items-center justify-center rounded-full bg-teal px-4 text-center font-bold text-cream hover:bg-teal-dark">{p.label}</Link>)}</div>}
          {s.id !== 'start' && <Link href={s.href} className="inline-flex min-h-11 items-center font-bold text-teal underline underline-offset-4">{s.cta} →</Link>}
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream-deep">
            {photo ? <Image src={photo} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" /> : <Scene name={s.scene} className="h-full w-full" />}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 bg-cream/60 px-5 py-3">
        <button type="button" onClick={() => go(i - 1)} disabled={i === 0} className="min-h-11 rounded-full px-5 font-bold text-teal hover:bg-teal-tint disabled:opacity-40">← Back</button>
        <ol className="flex gap-1.5" aria-label="Tour steps">{tourSteps.map((t, n) => <li key={t.id}><button type="button" aria-label={`Go to step ${n + 1}: ${t.title.en}`} aria-current={n === i ? 'step' : undefined} onClick={() => go(n)} className={cn('h-3 w-3 rounded-full', n === i ? 'bg-teal ring-2 ring-gold' : n < i ? 'bg-green' : 'bg-ink/20')} /></li>)}</ol>
        <div className="flex gap-2">
          {onClose && <button type="button" onClick={onClose} className="min-h-11 rounded-full px-4 font-bold text-ink-soft hover:bg-cream-deep">Skip tour</button>}
          {i < last ? <button type="button" onClick={() => go(i + 1)} className="min-h-11 rounded-full bg-gold px-6 font-bold hover:bg-gold-dark hover:text-white">Next →</button> : <button type="button" onClick={() => go(0)} className="min-h-11 rounded-full border-2 border-teal px-5 font-bold text-teal">Restart</button>}
        </div>
      </div>
    </section>
  );
}
