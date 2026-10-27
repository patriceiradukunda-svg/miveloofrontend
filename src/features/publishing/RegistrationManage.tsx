'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/miveloo-client';
import { whenText } from './shared';

type Reg = { reference: string; status: string; attendees: number; full_name: string; online_url?: string;
  event: { slug: string; title: string; starts_at: string | null; date_note: string | null; format: string; venue: string | null; city: string | null; address: string | null; contact_email: string | null } };
const LABEL: Record<string, string> = { confirmed: 'Confirmed', waitlisted: 'On the waiting list', interested: 'Interest recorded', cancelled: 'Cancelled', attended: 'Attended', no_show: 'Did not attend' };

export function RegistrationManage({ reference, token }: { reference: string; token: string }) {
  const [reg, setReg] = useState<Reg | null>(null); const [phase, setPhase] = useState<'loading' | 'ok' | 'missing' | 'error'>(token ? 'loading' : 'missing');
  const [ask, setAsk] = useState(false); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState('');
  useEffect(() => {
    if (!token) return;
    let live = true;
    fetch(`${API_BASE}/content/registrations/${encodeURIComponent(reference)}?token=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } })
      .then(async (r) => { if (!live) return; if (r.status === 404) return setPhase('missing'); if (!r.ok) return setPhase('error'); setReg((await r.json()) as Reg); setPhase('ok'); })
      .catch(() => live && setPhase('error'));
    return () => { live = false; };
  }, [reference, token]);
  async function cancel() {
    setBusy(true); setMsg('');
    try {
      const r = await fetch(`${API_BASE}/content/registrations/${encodeURIComponent(reference)}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
      if (!r.ok) throw new Error(String(r.status));
      setReg((await r.json()) as Reg); setAsk(false); setMsg('Your registration has been cancelled.');
    } catch { setMsg('We could not cancel your registration. Please try again.'); } finally { setBusy(false); }
  }
  if (phase === 'loading') return <p role="status" className="text-ink-soft">Loading your registration…</p>;
  if (phase === 'missing') return <div className="rounded-2xl bg-white p-8 shadow-card"><h1 className="font-display text-2xl font-semibold text-teal-dark">We could not find this registration</h1><p className="mt-2 text-ink-soft">Check that you opened the full link you saved when you registered.</p><Link href="/events" className="mt-4 inline-block font-bold text-teal underline">Browse events</Link></div>;
  if (phase === 'error' || !reg) return <p role="alert" className="rounded-2xl bg-red-tint p-5 font-semibold text-red-dark">We could not load your registration. Please try again in a moment.</p>;
  const ev = reg.event; const cancellable = !['cancelled', 'attended', 'no_show'].includes(reg.status);
  return (
    <div className="space-y-6 rounded-2xl bg-white p-8 shadow-card">
      <div><p className="text-sm font-bold uppercase tracking-wide text-teal">Your registration</p><h1 className="mt-1 font-display text-3xl font-semibold text-teal-dark">{ev.title}</h1></div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div><dt className="text-sm text-ink-soft">Status</dt><dd className="font-bold text-teal-dark">{LABEL[reg.status] ?? reg.status}</dd></div>
        <div><dt className="text-sm text-ink-soft">Reference</dt><dd className="font-bold">{reg.reference}</dd></div>
        <div><dt className="text-sm text-ink-soft">Name</dt><dd>{reg.full_name}</dd></div>
        <div><dt className="text-sm text-ink-soft">People</dt><dd>{reg.attendees}</dd></div>
        <div><dt className="text-sm text-ink-soft">When</dt><dd>{whenText({ starts_at: ev.starts_at, ends_at: null, date_note: ev.date_note })}</dd></div>
        <div><dt className="text-sm text-ink-soft">Where</dt><dd>{[ev.venue, ev.city].filter(Boolean).join(', ') || (ev.format === 'online' ? 'Online' : 'To be confirmed')}</dd></div>
      </dl>
      {reg.online_url && <p>Joining link: <a className="font-bold underline" href={reg.online_url} target="_blank" rel="noopener noreferrer">open the meeting</a></p>}
      {ev.contact_email && <p className="text-sm text-ink-soft">Questions? <a className="underline" href={`mailto:${ev.contact_email}`}>{ev.contact_email}</a></p>}
      {msg && <p role="status" className="rounded-xl bg-green-tint p-3 font-semibold">{msg}</p>}
      {cancellable && (ask ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-cream-deep p-4"><span className="font-semibold">Cancel this registration?</span>
          <button type="button" disabled={busy} onClick={cancel} className="inline-flex min-h-11 items-center rounded-full bg-red px-5 font-bold text-white disabled:opacity-60">{busy ? 'Cancelling…' : 'Yes, cancel it'}</button>
          <button type="button" onClick={() => setAsk(false)} className="inline-flex min-h-11 items-center rounded-full border-2 border-teal px-5 font-bold text-teal">Keep it</button></div>
      ) : <button type="button" onClick={() => setAsk(true)} className="inline-flex min-h-11 items-center rounded-full border-2 border-red px-5 font-bold text-red-dark hover:bg-red-tint">Cancel my registration</button>)}
      <p><Link href={`/events/${ev.slug}`} className="font-bold text-teal underline">Back to the event page</Link></p>
    </div>
  );
}
