'use client';
import { useState } from 'react';

export function CopyButton({ text, label = 'Copy link' }: { text?: string; label?: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    const value = text ?? window.location.href;
    try { await navigator.clipboard.writeText(value); }
    catch { const t = document.createElement('textarea'); t.value = value; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    setDone(true); setTimeout(() => setDone(false), 2000);
  }
  return <button type="button" onClick={copy} className="inline-flex min-h-11 items-center rounded-full border-2 border-teal px-5 text-sm font-bold text-teal hover:bg-teal-tint">{done ? 'Copied ✓' : label}</button>;
}
