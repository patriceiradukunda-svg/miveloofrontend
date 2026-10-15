"use client";
import Link from 'next/link';
import { useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { api, hasBackend } from '@/lib/api-client';
import { friendlyError } from '@/lib/errors';
import { fieldErrors, registrationSchemas, type RegistrationType } from '../schemas/auth.schema';
import { useT } from '@/providers/LocaleProvider';
import { INFO } from '../registration-info';
import { LocationPicker } from '@/features/location/LocationPicker';

export function RegistrationForm({ type }: { type: RegistrationType }) {
  const { t } = useT(); const info = INFO[type];
  const [errors, setErrors] = useState<Record<string, string>>({}); const [formErr, setFormErr] = useState<string>(); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)); const r = registrationSchemas[type].safeParse(data);
    if (!r.success) { setErrors(fieldErrors(r.error)); setFormErr('Please fix the highlighted fields.'); return; }
    setErrors({}); setFormErr(undefined); setBusy(true);
    try { if (hasBackend) await api('/auth/register', { method: 'POST', body: JSON.stringify({ ...r.data, accountType: type }) }); setDone(true); }
    catch (err) { setFormErr(friendlyError(err)); } finally { setBusy(false); }
  }
  if (done) return <div role="status" className="rounded-2xl bg-green-tint p-6"><h2 className="text-2xl font-semibold">Check your email</h2><p className="mt-2">We sent a verification link. Registering does not unlock protected features by itself: we verify your identity and organisation first.</p><Link className="mt-3 inline-block font-bold underline" href="/resend-verification">Did not get it?</Link></div>;
  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <p className="rounded-xl bg-teal-tint p-3 text-sm">{info.note}</p>
      <FormError message={formErr} />
      <FormField label={t('auth.name')} error={errors.name} required>{(p) => <input {...p} name="name" autoComplete="name" />}</FormField>
      {info.org && <FormField label={info.org} error={errors.organisation} required={type !== 'supplier'}>{(p) => <input {...p} name="organisation" autoComplete="organization" />}</FormField>}
      <FormField label={t('auth.email')} error={errors.email} required>{(p) => <input {...p} name="email" type="email" autoComplete="email" inputMode="email" />}</FormField>
      <FormField label={t('auth.phone')} error={errors.phone} hint="Example: 0788 123 456" required>{(p) => <input {...p} name="phone" type="tel" autoComplete="tel" inputMode="tel" />}</FormField>
      <FormField label={t('auth.district')} error={errors.district} required>{(p) => <input {...p} name="district" />}</FormField>
      {type !== 'institution' && <LocationPicker errors={errors} />}
      <FormField label={t('auth.password')} error={errors.password} hint="At least 10 characters, with letters and numbers." required>{(p) => <input {...p} name="password" type="password" autoComplete="new-password" />}</FormField>
      <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="consent" className="mt-1 h-5 w-5 accent-teal" aria-invalid={!!errors.consent} /><span>I agree to the <Link className="underline" href="/privacy">privacy policy</Link> and <Link className="underline" href="/terms">terms</Link>.</span></label>{errors.consent && <p role="alert" className="mt-1 text-sm font-semibold text-red-dark">⚠ {errors.consent}</p>}</div>
      <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Creating…' : t('auth.submit')}</Button>
    </form>
  );
}
