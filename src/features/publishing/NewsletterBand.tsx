'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/miveloo-client';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterBand({ source, language }: { source: string; language: 'en' | 'rw' }) {
  const [email, setEmail] = useState(''); const [name, setName] = useState(''); const [consent, setConsent] = useState(false); const [bot, setBot] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle'); const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr('');
    if (!EMAIL.test(email.trim())) return setErr('Enter a valid email address.');
    if (!consent) return setErr('Please tick the box to agree.');
    setState('sending');
    try {
      const r = await fetch(`${API_BASE}/content/subscribe`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), name: name.trim() || null, language, consent: true, source, website: bot || null }) });
      if (!r.ok) throw new Error(String(r.status));
      setState('done');
    } catch { setState('error'); setErr('We could not save your address. Please try again.'); }
  }
  return (
    <section className="mt-24 bg-teal py-16 text-cream" aria-labelledby="nl-h">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div><h2 id="nl-h" className="font-display text-3xl font-semibold md:text-4xl">Stay close to Miveloo.</h2><p className="mt-3 text-cream/90">Get new stories, news and events. We use your email only for Miveloo updates, and you can ask us to remove it at any time.</p></div>
        {state === 'done' ? <p role="status" className="rounded-2xl bg-cream/15 p-5 font-semibold">Thank you. Your address is saved for Miveloo updates.</p> : (
          <form onSubmit={submit} noValidate className="space-y-3">
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave empty<input tabIndex={-1} autoComplete="off" value={bot} onChange={(e) => setBot(e.target.value)} /></label></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">Name (optional)<input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} className="mt-1 min-h-11 w-full rounded-xl border-0 px-3 text-base text-ink" /></label>
              <label className="block text-sm font-semibold">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" maxLength={254} className="mt-1 min-h-11 w-full rounded-xl border-0 px-3 text-base text-ink" /></label>
            </div>
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 accent-gold" /><span>I agree to receive Miveloo updates by email.</span></label>
            {err && <p role="alert" className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-dark">{err}</p>}
            <button type="submit" disabled={state === 'sending'} className="inline-flex min-h-12 items-center rounded-full bg-gold px-7 font-bold text-ink hover:bg-cream disabled:opacity-60">{state === 'sending' ? 'Saving…' : 'Subscribe'}</button>
          </form>)}
      </div>
    </section>
  );
}
