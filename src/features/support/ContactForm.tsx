"use client";
import { useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { api, hasBackend } from '@/lib/api-client';

export function ContactForm() {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string>(); const [done, setDone] = useState(false); const toast = useToast();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy) return; setBusy(true); setErr(undefined);
    const d = Object.fromEntries(new FormData(e.currentTarget));
    try { if (hasBackend) await api('/support/contact', { method: 'POST', body: JSON.stringify(d) }); setDone(true); toast('Message ready to send'); }
    catch { setErr('We could not send your message. Please try again.'); } finally { setBusy(false); }
  }
  if (done) return <p role="status" className="rounded-2xl bg-green-tint p-5 font-semibold">Thank you. {hasBackend ? 'We will reply by email.' : 'No backend is connected in this build, so nothing was sent.'}</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormError message={err} />
      <FormField label="Your name" required>{(p) => <input {...p} name="name" required autoComplete="name" />}</FormField>
      <FormField label="Email" required>{(p) => <input {...p} name="email" type="email" required autoComplete="email" />}</FormField>
      <FormField label="How can we help?" required>{(p) => <textarea {...p} name="message" rows={5} required />}</FormField>
      <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</Button>
    </form>
  );
}
