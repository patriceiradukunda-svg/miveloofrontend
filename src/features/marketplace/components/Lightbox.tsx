"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { I, ICON } from './icons';
import { Sheet } from './Sheet';

export function Lightbox({ name, photos, emoji, open, start = 0, onClose, sample = true }: { name: string; photos: string[]; emoji: string; open: boolean; start?: number; onClose: () => void; sample?: boolean }) {
  const [i, setI] = useState(start); const n = photos.length;
  useEffect(() => { if (open) setI(start); }, [open, start]);
  useEffect(() => {
    if (!open || n < 2) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') setI((x) => (x + 1) % n); if (e.key === 'ArrowLeft') setI((x) => (x - 1 + n) % n); };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k);
  }, [open, n]);
  const nav = 'absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-gold';
  return (
    <Sheet open={open} onClose={onClose} label={`Photos of ${name}`} side="stage">
      <div className="p-4 sm:p-6">
        <p className="pr-14 font-display text-2xl font-semibold">{name}</p>
        <div className="relative mt-4 h-[56vh] overflow-hidden rounded-2xl bg-black/30">
          {n ? <Image key={photos[i]} src={photos[i]!} alt={`${name}, photo ${i + 1} of ${n}`} fill sizes="90vw" className="rise object-contain" />
            : <div className="grid h-full place-items-center text-center"><div><p aria-hidden className="text-7xl">{emoji}</p><p className="mt-3 text-cream/80">No photos yet</p></div></div>}
          {n > 1 && <><button type="button" aria-label="Previous photo" onClick={() => setI((i - 1 + n) % n)} className={cn(nav, 'left-3')}><I d={ICON.left} /></button><button type="button" aria-label="Next photo" onClick={() => setI((i + 1) % n)} className={cn(nav, 'right-3')}><I d={ICON.right} /></button></>}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Choose photo">{photos.map((p, k) => <button key={p + k} type="button" aria-label={`Photo ${k + 1}`} aria-current={k === i} onClick={() => setI(k)} className={cn('relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2', k === i ? 'ring-gold' : 'ring-transparent opacity-70 hover:opacity-100')}><Image src={p} alt="" fill sizes="64px" className="object-cover" /></button>)}</div>
          <p className="shrink-0 text-sm text-cream/80" aria-live="polite">{n ? `${i + 1} / ${n}` : ''}{sample && n ? ' · sample photos' : ''}</p>
        </div>
      </div>
    </Sheet>
  );
}
