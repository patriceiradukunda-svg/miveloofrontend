'use client';
import { useEffect, useRef, useState } from 'react';
import { useWiz } from '@/components/forms/wizard/Wizard';
import { GoogleBlock } from './GoogleButton';
import { verifyGoogleCredential } from '../google';
import { readPendingGoogle } from '../google-login';

export interface GoogleIdentity { credential: string; email: string; name: string }

/** First step of sign-up: Google fills in name and email, then the user carries on with the rest of the details.
 *  Nothing is created here. The account is only created when the user submits the last step.
 *  Also picks up a Google identity saved by a sign-in attempt that found no account. */
export function GoogleStart({ identity, onIdentity }: { identity: GoogleIdentity | null; onIdentity: (g: GoogleIdentity | null) => void }) {
  const { setMany } = useWiz(); const [err, setErr] = useState<string>(); const [busy, setBusy] = useState(false);
  const applied = useRef<string | undefined>(undefined); const asked = useRef(false);
  useEffect(() => { if (identity || asked.current) return; asked.current = true; void readPendingGoogle().then((r) => { if (r) onIdentity(r); }); }, [identity, onIdentity]);
  useEffect(() => {
    if (!identity || applied.current === identity.credential) return;
    applied.current = identity.credential; setMany({ name: identity.name, email: identity.email });
    setTimeout(() => document.querySelector<HTMLInputElement>('input[name="phone"]')?.focus(), 50);
  }, [identity, setMany]);
  async function handle(credential: string) {
    setBusy(true); setErr(undefined);
    const r = await verifyGoogleCredential(credential); setBusy(false);
    if (!r.ok) { setErr(r.error); return; }
    onIdentity({ credential, email: r.email, name: r.name });
  }
  if (identity) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-2xl border border-green/30 bg-green-tint p-4">
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-blob bg-green font-bold text-white">✓</span>
        <div className="min-w-0 flex-1"><p className="font-bold">Google account connected</p><p className="break-words text-sm text-ink-soft">{identity.email}. Now tell us a few more details. Your account is created only when you finish.</p>
          <button type="button" className="mt-1 text-sm font-bold text-teal underline" onClick={() => { applied.current = undefined; onIdentity(null); setMany({ name: '', email: '' }); }}>Use a different account</button></div>
      </div>
    );
  }
  return (
    <div className="space-y-3" aria-busy={busy}>
      <GoogleBlock onCredential={(c) => void handle(c)} text="signup_with" label="or fill in the form" />
      {busy && <p role="status" className="text-center text-sm text-ink-soft">Checking your Google account…</p>}
      {err && <p role="alert" className="rounded-xl bg-red-tint px-4 py-3 text-sm font-semibold text-red-dark">⚠ {err}</p>}
    </div>
  );
}
