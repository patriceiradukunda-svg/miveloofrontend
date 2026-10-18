'use client';
import { useRef, useState } from 'react';
import { useWiz } from '@/components/forms/wizard/Wizard';
import type { CarLabels } from './labels';
import { ACCEPT, checkFile, formatSize } from './files';

/** One document per step. The File itself lives in the parent; the wizard value only holds the file name so
 *  validation, the review step and error clearing work like every other field. */
export function DocUpload({ name, label, hint, required, file, onFile, T }: {
  name: string; label: string; hint?: string; required: boolean; file: File | null; onFile: (f: File | null) => void; T: CarLabels['up'];
}) {
  const { errors, set } = useWiz();
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string>();
  const [over, setOver] = useState(false);
  const err = errors[name] ?? msg;

  function pick(list: FileList | null) {
    const f = list?.[0];
    if (!f) return;
    const bad = checkFile(f);
    if (bad) { setMsg(bad === 'size' ? T.errSize : T.errType); return; }
    setMsg(undefined);
    onFile(f);
    set(name, f.name);
    if (input.current) input.current.value = '';
  }
  function clear() {
    setMsg(undefined);
    onFile(null);
    set(name, '');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${required ? 'bg-gold-tint text-ink' : 'bg-teal-tint text-teal-dark'}`}>{required ? T.required : T.optional}</span>
        {hint && <p className="text-ink-soft">{hint}</p>}
      </div>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}
          className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${err ? 'border-red bg-red-tint' : over ? 'border-teal bg-teal-tint' : 'border-teal/40 bg-cream/60'}`}
        >
          <p className="font-semibold">{T.drag}</p>
          <button type="button" onClick={() => input.current?.click()} className="mt-3 inline-flex min-h-12 items-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">{T.choose}</button>
          <p className="mt-3 text-sm text-ink-soft">{T.accepted}</p>
          {!required && <p className="mt-1 text-sm text-ink-soft">{T.skip}</p>}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-card">
          <div className="flex min-w-0 items-center gap-3">
            <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-green text-lg font-bold text-white">✓</span>
            <div className="min-w-0"><p className="break-words font-semibold">{file.name}</p><p className="text-sm text-ink-soft">{formatSize(file.size)}</p></div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => input.current?.click()} className="min-h-11 rounded-full px-4 text-sm font-bold text-teal underline hover:bg-teal-tint">{T.replace}</button>
            <button type="button" onClick={clear} aria-label={`${T.remove}: ${file.name}`} className="min-h-11 rounded-full px-4 text-sm font-bold text-red-dark underline hover:bg-red-tint">{T.remove}</button>
          </div>
        </div>
      )}
      <input ref={input} type="file" accept={ACCEPT} tabIndex={-1} className="sr-only" aria-label={label} onChange={(e) => pick(e.target.files)} />
      {err && <p role="alert" className="text-sm font-semibold text-red-dark">⚠ {err}</p>}
    </div>
  );
}
