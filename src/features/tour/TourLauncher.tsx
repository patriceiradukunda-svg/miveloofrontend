"use client";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { PhotoKey } from '@/lib/photos';

const TourPlayer = dynamic(() => import('./TourPlayer').then((m) => m.TourPlayer), { ssr: false, loading: () => <p className="p-8">Loading tour…</p> });
/** Floating entry to the guided tour. Opens in a native modal <dialog> (focus trap + Esc included). */
export function TourLauncher({ photos }: { photos: Record<PhotoKey, string | null> }) {
  const ref = useRef<HTMLDialogElement>(null); const [open, setOpen] = useState(false); const path = usePathname();
  useEffect(() => { const d = ref.current; if (!d) return; if (open && !d.open) d.showModal(); if (!open && d.open) d.close(); }, [open]);
  if (path === '/tour' || path === '/') return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="fixed bottom-4 left-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-5 font-bold shadow-card hover:bg-gold-dark hover:text-white">
        <span aria-hidden>🧭</span><span>Take the tour</span>
      </button>
      <dialog ref={ref} onClose={() => setOpen(false)} aria-label="Guided tour" className="m-auto w-[min(60rem,96vw)] max-h-[94vh] overflow-y-auto rounded-3xl p-0 backdrop:bg-ink/60">
        {open && <TourPlayer photos={photos} compact onClose={() => setOpen(false)} />}
      </dialog>
    </>
  );
}
