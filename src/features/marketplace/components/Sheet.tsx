"use client";
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { I, ICON } from './icons';

/** Native <dialog> as a side sheet or centred stage: focus trap, Esc and screen-reader semantics come built in. */
export function Sheet({ open, onClose, label, side = 'right', children }: { open: boolean; onClose: () => void; label: string; side?: 'right' | 'stage'; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); if (!open && d.open) d.close(); }, [open]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <dialog ref={ref} aria-label={label} onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={cn('p-0 backdrop:bg-ink/60 backdrop:backdrop-blur-[2px]', side === 'right' ? 'm-0 ml-auto h-full max-h-none w-[min(30rem,100vw)] rounded-none bg-cream' : 'm-auto w-[min(70rem,96vw)] max-w-none rounded-3xl bg-ink text-cream')}>
      {open && (
        <div className="relative flex h-full max-h-[100dvh] flex-col">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow hover:bg-gold"><I d={ICON.x} /></button>
          {children}
        </div>
      )}
    </dialog>
  );
}
