"use client";
import Link from 'next/link';
import { useState } from 'react';
import { Wizard, useWiz, type Errors, type Step, type Values } from '@/components/forms/wizard/Wizard';
import { Check, Text } from '@/components/forms/wizard/fields';
import { LocationFields, locationSummary, validateLocation } from '@/components/forms/wizard/LocationFields';
import { FormField } from '@/components/forms/FormField';
import { PasswordInput } from './PasswordInput';
import { GoogleStart, type GoogleIdentity } from './GoogleStart';
import { registerWithGoogle } from '../google-register';
import { ApiError } from '@/lib/errors';
import { api, hasBackend } from '@/lib/api-client';
import { friendlyError } from '@/lib/errors';
import type { RegistrationType } from '../schemas/auth.schema';
import { INFO } from '../registration-info';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function strength(p: string) {
  const s = [p.length >= 10, /[a-z]/.test(p) && /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  return { s, label: ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][s] ?? '' };
}
function Passwords({ google = false }: { google?: boolean }) {
  const { v, set, errors } = useWiz(); const st = strength(str(v.password));
  return (
    <>
      {google ? <p className="rounded-xl bg-green-tint p-3 text-sm font-semibold">✓ You are using your Google account, so no password is needed.</p> : (<>
        <FormField label="Password" error={errors.password} hint="At least 10 characters, with letters and numbers." required>{(p) => <PasswordInput {...p} name="password" autoComplete="new-password" value={str(v.password)} onChange={(e) => set('password', e.target.value)} />}</FormField>
        {str(v.password) && <div aria-hidden className="-mt-2 flex items-center gap-2"><div className="flex flex-1 gap-1">{[1, 2, 3, 4].map((k) => <span key={k} className={`h-1.5 flex-1 rounded-full ${k <= st.s ? (st.s < 3 ? 'bg-gold' : 'bg-green') : 'bg-ink/10'}`} />)}</div><span className="text-xs font-bold text-ink-soft">{st.label}</span></div>}
        <FormField label="Confirm password" error={errors.confirm} required>{(p) => <PasswordInput {...p} name="confirm" autoComplete="new-password" value={str(v.confirm)} onChange={(e) => set('confirm', e.target.value)} />}</FormField>
      </>)}
      <Check name="consent">I agree to the <Link className="underline" href="/privacy">privacy policy</Link> and <Link className="underline" href="/terms">terms</Link>.</Check>
    </>
  );
}
function Review({ type, org, ids, google }: { type: RegistrationType; org?: string | null; ids: Record<string, number>; google: boolean }) {
  const { v, go } = useWiz();
  const rows: [string, string, string][] = [['Sign-in', google ? 'Google (email verified)' : 'Email and password', 'you'], ['Name', str(v.name), 'you'], ['Email', str(v.email), 'you'], ['Phone', str(v.phone), 'you'], ...(org ? [[org, str(v.organisation) || '—', 'org'] as [string, string, string]] : []), ['Location', locationSummary(v) || '—', 'where'], ['Coordinates', str(v.lat) ? `${str(v.lat)}, ${str(v.lng)}` : 'Not added', 'where']];
  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-teal-tint p-3 text-sm">{INFO[type].note}</p>
      <dl className="divide-y divide-ink/10 rounded-2xl border border-ink/10">{rows.map(([k, val, step]) => (
        <div key={k} className="flex items-start justify-between gap-4 p-4"><div className="min-w-0"><dt className="text-xs font-bold uppercase tracking-wider text-ink-soft">{k}</dt><dd className="break-words font-semibold">{val}</dd></div>
          <button type="button" onClick={() => go(ids[step] ?? 0)} className="shrink-0 text-sm font-bold text-teal underline">Edit</button></div>))}</dl>
    </div>
  );
}

export function RegistrationWizard({ type }: { type: RegistrationType }) {
  const [g, setG] = useState<GoogleIdentity | null>(null);
  const info = INFO[type]; const org = info.org ?? undefined;
  const ids: Record<string, number> = { you: 0, org: 1, where: org ? 2 : 1 };
  const steps: Step[] = [
    { id: 'you', summary: (v: Values) => `${str(v.name)} · ${str(v.email)}`, title: 'About you', hint: 'How we can reach you.', content: <><GoogleStart identity={g} onIdentity={setG} /><Text name="name" label="Full name" required autoComplete="name" /><Text name="email" label="Email" type="email" required autoComplete="email" inputMode="email" readOnly={!!g} hint={g ? 'Verified by Google' : undefined} /><Text name="phone" label="Phone" type="tel" required autoComplete="tel" inputMode="tel" hint="Example: 0788 123 456" /></>,
      validate: (v: Values) => { const e: Errors = {}; if (str(v.name).trim().length < 2) e.name = 'Enter your full name.'; if (!EMAIL.test(str(v.email).trim())) e.email = 'Enter a valid email address.'; const d = str(v.phone).replace(/[^\d]/g, ''); if (d.length < 9 || d.length > 15) e.phone = 'Enter a valid phone number.'; return e; } },
    ...(org ? [{ id: 'org', summary: (v: Values) => str(v.organisation) || 'Added', title: org, hint: 'The organisation you are registering for.', content: <Text name="organisation" label={org} required={type !== 'supplier'} autoComplete="organization" />,
      validate: (v: Values): Errors => (type !== 'supplier' && str(v.organisation).trim().length < 2 ? { organisation: `Enter your ${org.toLowerCase()}.` } : {}) } satisfies Step] : []),
    { id: 'where', summary: (v: Values) => locationSummary(v), title: 'Where you are based', hint: 'Choose your country. In Rwanda we ask down to your village, so deliveries and verification are accurate.', content: <LocationFields />, validate: (v: Values) => validateLocation(v) },
    { id: 'secure', summary: (v: Values) => v.consent === true ? 'Password set, terms accepted' : '', title: g ? 'Terms and consent' : 'Secure your account', content: <Passwords google={!!g} />,
      validate: (v: Values) => { const e: Errors = {}; const p = str(v.password); if (!g) { if (p.length < 10 || !/[A-Za-z]/.test(p) || !/\d/.test(p)) e.password = 'Use at least 10 characters, with letters and numbers.'; if (str(v.confirm) !== p) e.confirm = 'The passwords do not match.'; } if (v.consent !== true) e.consent = 'Please accept the privacy policy and terms to continue.'; return e; } },
    { id: 'review', title: 'Review and create', hint: 'Check your details before you submit.', content: <Review type={type} org={org} ids={ids} google={!!g} /> },
  ];
  async function onSubmit(v: Values) {
    const rw = (str(v.country) || 'RW') === 'RW';
    const payload = { accountType: type, name: str(v.name).trim(), email: str(v.email).trim(), phone: str(v.phone).trim(), organisation: str(v.organisation).trim(), password: g ? undefined : str(v.password), googleCredential: g?.credential, authProvider: g ? 'google' : 'password', consent: true,
      country: str(v.country) || 'RW', province: rw ? str(v.provinceName) : '', district: rw ? str(v.districtName) : str(v.city), sector: str(v.sectorName), cell: str(v.cellName), village: str(v.villageName), address: str(v.address),
      latitude: str(v.lat) ? Number(v.lat) : undefined, longitude: str(v.lng) ? Number(v.lng) : undefined };
    if (hasBackend) {
      if (g) {
        // Google sign-up: the server creates the account and the organisation, then signs the user in.
        const r = await registerWithGoogle({ credential: g.credential, accountType: String(type), name: payload.name, phone: payload.phone, organisation: payload.organisation });
        if (r.error || !r.to) throw new ApiError(400, r.error ?? 'Sign-up did not complete. Please try again.');
        window.location.assign(r.to);
        return new Promise<void>(() => {}); // keep the form busy until the browser navigates
      }
      await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
    }
  }
  return (
    <Wizard steps={steps} initial={{ country: 'RW', countryName: 'Rwanda', consent: false }} onSubmit={onSubmit} formatError={friendlyError} submitLabel="Create account"
      done={<div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold">Check your email</h2><p className="mt-2">We sent a verification link. Registering does not unlock protected features by itself: we verify your identity and organisation first.</p><Link className="mt-3 inline-block font-bold underline" href="/resend-verification">Did not get it?</Link></div>} />
  );
}
