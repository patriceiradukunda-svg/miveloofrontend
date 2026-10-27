'use client';
import { useState } from 'react';
import { API_BASE } from '@/lib/miveloo-client';
import { buildIcs } from './shared';
import { CopyButton } from './CopyButton';

type Result = { reference: string; status: 'confirmed' | 'waitlisted' | 'interested'; attendees: number; cancel_token: string; online_url?: string };
type Props = { slug: string; title: string; mode: 'interest' | 'required'; state: 'open' | 'waitlist'; seatsLeft: number | null; note: string | null; startsAt: string | null; endsAt: string | null; place: string };
const init = { name: '', email: '', phone: '', org: '', role: '', attendees: '1', needs: '', message: '', consent: false, website: '' };
type F = typeof init;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const input = 'w-full rounded-xl border border-ink/20 bg-white px-3 py-2.5 text-base text-ink focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30';
const lbl = 'mb-1 block text-sm font-semibold text-teal-dark';
const ROLES: [string, string][] = [['school', 'School'], ['supplier', 'Supplier or farmer'], ['cooperative', 'Cooperative or group'], ['institution', 'Institution or partner'], ['other', 'Someone else']];

function message(j: unknown, status: number): string {
  const o = j as { error?: { message?: unknown }; detail?: unknown } | null;
  const m = o?.error?.message ?? o?.detail;
  if (status === 429) return 'Too many attempts. Please try again in a little while.';
  if ((status === 409 || status === 422) && typeof m === 'string') return m;
  return 'We could not complete your registration. Please check your details and try again.';
}

export function RegisterForm(p: Props) {
  const [v, setV] = useState<F>(init); const [errs, setErrs] = useState<Partial<Record<keyof F, string>>>({});
  const [phase, setPhase] = useState<'idle' | 'sending' | 'done'>('idle'); const [fail, setFail] = useState(''); const [done, setDone] = useState<Result | null>(null);
  const set = <K extends keyof F>(k: K, x: F[K]) => setV((s) => ({ ...s, [k]: x }));
  const maxN = p.state === 'open' && p.seatsLeft !== null ? Math.max(1, Math.min(10, p.seatsLeft)) : 10;
  const cta = p.mode === 'interest' ? 'Express interest' : p.state === 'waitlist' ? 'Join the waiting list' : 'Register';

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setFail('');
    const er: Partial<Record<keyof F, string>> = {};
    if (v.name.trim().length < 2) er.name = 'Enter your name.';
    if (!EMAIL.test(v.email.trim())) er.email = 'Enter a valid email address.';
    if (v.phone.trim() && v.phone.replace(/\D/g, '').length < 9) er.phone = 'Enter a valid phone number, or leave it empty.';
    if (!v.consent) er.consent = 'Please agree so we can contact you about this event.';
    setErrs(er); const first = Object.keys(er)[0];
    if (first) { document.getElementById(`rg-${first}`)?.focus(); return; }
    setPhase('sending');
    try {
      const r = await fetch(`${API_BASE}/content/events/${encodeURIComponent(p.slug)}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ full_name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() || null, organisation: v.org.trim() || null, role_type: v.role || null,
          attendees: p.mode === 'required' ? Number(v.attendees) : 1, message: v.message.trim() || null, needs: v.needs.trim() || null, consent: true, website: v.website || null }) });
      const j = await r.json().catch(() => null);
      if (!r.ok) { setFail(message(j, r.status)); setPhase('idle'); return; }
      setDone(j as Result); setPhase('done');
      setTimeout(() => document.getElementById('rg-done')?.focus(), 50);
    } catch { setFail('We could not reach the server. Please check your connection and try again.'); setPhase('idle'); }
  }

  if (phase === 'done' && done) {
    const manage = `${window.location.origin}/events/registration/${done.reference}?token=${encodeURIComponent(done.cancel_token)}`;
    const ics = () => {
      if (!p.startsAt) return;
      const url = URL.createObjectURL(new Blob([buildIcs({ uid: done.reference, title: p.title, startsAt: p.startsAt, endsAt: p.endsAt, location: p.place, url: window.location.href.split('#')[0] })], { type: 'text/calendar' }));
      const a = document.createElement('a'); a.href = url; a.download = `${p.slug}.ics`; a.click(); URL.revokeObjectURL(url);
    };
    return (
      <div id="rg-done" tabIndex={-1} role="status" className="space-y-4 rounded-2xl bg-green-tint p-5 outline-none">
        <h3 className="text-xl font-semibold text-teal-dark">{done.status === 'confirmed' ? 'You are registered.' : done.status === 'waitlisted' ? 'You are on the waiting list.' : 'Thank you. Your interest is recorded.'}</h3>
        <p>Your reference is <b>{done.reference}</b>{done.status !== 'interested' && <> for {done.attendees} {done.attendees === 1 ? 'person' : 'people'}</>}.</p>
        {done.status === 'waitlisted' && <p>The event team can move you to a confirmed seat if one becomes free. Keep your link to check your status.</p>}
        {done.online_url && <p>Joining link: <a className="font-bold underline" href={done.online_url} target="_blank" rel="noopener noreferrer">open the meeting</a></p>}
        <p className="rounded-xl bg-white p-3 text-sm"><b>Save your link.</b> We do not send confirmation emails yet. This link is the only way to check or cancel your registration.</p>
        <div className="flex flex-wrap gap-2"><CopyButton text={manage} label="Copy my link" />{done.status === 'confirmed' && p.startsAt && <button type="button" onClick={ics} className="inline-flex min-h-11 items-center rounded-full border-2 border-teal px-5 text-sm font-bold text-teal hover:bg-teal-tint">Add to calendar</button>}</div>
        <p className="text-sm"><a className="font-bold underline" href={manage}>Open my registration page</a></p>
      </div>
    );
  }

  const row = (k: keyof F, label: string, node: React.ReactNode, optional = false) => (
    <div><label htmlFor={`rg-${k}`} className={lbl}>{label}{optional && <span className="font-normal text-ink-soft"> (optional)</span>}</label>{node}{errs[k] && <p id={`rg-${k}-e`} className="mt-1 text-sm font-semibold text-red-dark">{errs[k]}</p>}</div>
  );
  const common = (k: keyof F) => ({ id: `rg-${k}`, 'aria-invalid': !!errs[k], 'aria-describedby': errs[k] ? `rg-${k}-e` : undefined });
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {p.note && <p className="rounded-xl bg-cream-deep p-3 text-sm">{p.note}</p>}
      {p.state === 'waitlist' && <p className="rounded-xl bg-gold/30 p-3 text-sm font-semibold">This event is full. You can join the waiting list.</p>}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave empty<input tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set('website', e.target.value)} /></label></div>
      {row('name', 'Full name', <input {...common('name')} className={input} value={v.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={200} />)}
      {row('email', 'Email', <input {...common('email')} type="email" className={input} value={v.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" inputMode="email" maxLength={254} />)}
      {row('phone', 'Phone', <input {...common('phone')} type="tel" className={input} value={v.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" inputMode="tel" maxLength={40} />, true)}
      {row('org', 'Organisation', <input {...common('org')} className={input} value={v.org} onChange={(e) => set('org', e.target.value)} autoComplete="organization" maxLength={200} />, true)}
      {row('role', 'I am', <select {...common('role')} className={input} value={v.role} onChange={(e) => set('role', e.target.value)}><option value="">Choose…</option>{ROLES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>, true)}
      {p.mode === 'required' && row('attendees', 'Number of people', <select {...common('attendees')} className={input} value={v.attendees} onChange={(e) => set('attendees', e.target.value)}>{Array.from({ length: maxN }, (_, i) => <option key={i + 1} value={String(i + 1)}>{i + 1}</option>)}</select>)}
      {p.mode === 'required' && row('needs', 'Accessibility or dietary needs', <input {...common('needs')} className={input} value={v.needs} onChange={(e) => set('needs', e.target.value)} maxLength={300} />, true)}
      {row('message', p.mode === 'interest' ? 'What would you like from this event?' : 'Message for the organisers', <textarea {...common('message')} rows={3} className={input} value={v.message} onChange={(e) => set('message', e.target.value)} maxLength={1000} />, true)}
      <div><label className="flex items-start gap-3 text-sm"><input id="rg-consent" type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 h-5 w-5 accent-teal" aria-invalid={!!errs.consent} /><span>I agree that Miveloo may use these details to run this event and contact me about it. See the <a className="underline" href="/privacy">Privacy Policy</a>.</span></label>{errs.consent && <p className="mt-1 text-sm font-semibold text-red-dark">{errs.consent}</p>}</div>
      {fail && <p role="alert" className="rounded-xl bg-red-tint p-3 text-sm font-semibold text-red-dark">{fail}</p>}
      <button type="submit" disabled={phase === 'sending'} className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-teal px-6 font-bold text-cream hover:bg-teal-dark disabled:opacity-60">{phase === 'sending' ? 'Sending…' : cta}</button>
    </form>
  );
}
