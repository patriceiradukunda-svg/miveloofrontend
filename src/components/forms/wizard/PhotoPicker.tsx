'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

/** Resizes a photo to at most `max` px on its longest side and re-encodes it as JPEG (keeps uploads small on slow networks). */
async function shrink(file: File, max = 1600): Promise<File> {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d')?.drawImage(bmp, 0, 0, c.width, c.height); bmp.close();
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.82));
  return blob ? new File([blob], `${file.name.replace(/\.\w+$/, '')}.jpg`, { type: 'image/jpeg' }) : file;
}

export function PhotoPicker({ files, onChange, max = 6, error }: { files: File[]; onChange: (f: File[]) => void; max?: number; error?: string }) {
  const input = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState<string>();
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => urls.forEach((u) => URL.revokeObjectURL(u)), [urls]);

  async function add(list: FileList | null) {
    if (!list) return; setBusy(true); setMsg(undefined);
    const out: File[] = []; let skipped = 0;
    for (const f of Array.from(list)) {
      if (files.length + out.length >= max) { skipped++; continue; }
      if (!f.type.startsWith('image/') || f.size > 15 * 1024 * 1024) { skipped++; continue; }
      try { out.push(await shrink(f)); } catch { skipped++; }
    }
    if (out.length) onChange([...files, ...out]);
    if (skipped) setMsg(`${skipped} file${skipped > 1 ? 's were' : ' was'} skipped: only images under 15 MB, up to ${max} photos.`);
    setBusy(false); if (input.current) input.current.value = '';
  }
  return (
    <div className="space-y-4">
      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void add(e.dataTransfer.files); }}
        className={`rounded-2xl border-2 border-dashed p-6 text-center ${error ? 'border-red bg-red-tint' : 'border-teal/40 bg-cream/60'}`}>
        <p className="font-semibold">Drag photos here, or</p>
        <button type="button" onClick={() => input.current?.click()} disabled={busy || files.length >= max} className="mt-3 inline-flex min-h-12 items-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark disabled:opacity-50">{busy ? 'Preparing…' : files.length >= max ? 'Photo limit reached' : 'Choose or take photos'}</button>
        <input ref={input} type="file" accept="image/*" multiple className="sr-only" aria-label="Add photos" onChange={(e) => void add(e.target.files)} />
        <p className="mt-3 text-sm text-ink-soft">{files.length} of {max} added. The first photo is the cover.</p>
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-red-dark">⚠ {error}</p>}
      {msg && <p role="status" className="rounded-xl bg-gold-tint p-3 text-sm">{msg}</p>}
      {files.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {files.map((f, k) => (
            <li key={`${f.name}-${k}`} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
              <div className="relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={urls[k]} alt={`Photo ${k + 1}`} className="h-full w-full object-cover" />
                {k === 0 && <span className="absolute left-2 top-2 rounded-full bg-gold px-3 py-1 text-xs font-bold">Cover</span>}</div>
              <div className="flex items-center justify-between gap-1 p-2">
                {k > 0 ? <button type="button" onClick={() => onChange([f, ...files.filter((_, i) => i !== k)])} className="min-h-11 px-2 text-sm font-bold text-teal underline">Make cover</button> : <span />}
                <button type="button" onClick={() => onChange(files.filter((_, i) => i !== k))} aria-label={`Remove photo ${k + 1}`} className="min-h-11 px-2 text-sm font-bold text-red-dark underline">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
