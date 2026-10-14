"use client";
import { useState } from 'react';
import { FormField } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import { api, hasBackend } from '@/lib/api-client';
import { resetSchema, fieldErrors } from '../schemas/auth.schema';

/** Used for forgot-password and resend-verification. Always shows the same result to avoid revealing which emails exist. */
export function EmailOnlyForm({ endpoint, cta, doneText }: { endpoint: string; cta: string; doneText: string }) {
  const [err, setErr] = useState<string>(); const [done, setDone] = useState(false); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const r = resetSchema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    if (!r.success) return setErr(fieldErrors(r.error).email); setErr(undefined); setBusy(true);
    try { if (hasBackend) await api(endpoint, { method: 'POST', body: JSON.stringify(r.data) }); } catch { /* same response either way */ } finally { setBusy(false); setDone(true); }
  }
  if (done) return <p role="status" className="rounded-2xl bg-green-tint p-4 font-semibold">{doneText}</p>;
  return <form onSubmit={submit} noValidate className="space-y-4"><FormField label="Email address" error={err} required>{(p) => <input {...p} name="email" type="email" autoComplete="email" inputMode="email" />}</FormField><Button type="submit" disabled={busy}>{cta}</Button></form>;
}
