'use client';
import { useState } from 'react';
import { GoogleBlock, googleConfigured } from './GoogleButton';
import { googleLoginAction } from '../google-login';

/** "Continue with Google" for the sign-in page. Hidden until NEXT_PUBLIC_GOOGLE_CLIENT_ID is set. */
export function GoogleLogin({ next }: { next?: string }) {
  const [err, setErr] = useState<string>(); const [busy, setBusy] = useState(false);
  async function go(credential: string) {
    setBusy(true); setErr(undefined);
    const r = await googleLoginAction(credential, next); // redirects on success, or when there is no account yet
    if (r?.error) { setErr(r.error); setBusy(false); }
  }
  if (!googleConfigured) return null;
  return (
    <div className="mb-6 space-y-3" aria-busy={busy}>
      <GoogleBlock onCredential={(c) => void go(c)} text="signin_with" label="or use your email" />
      {busy && <p role="status" className="text-center text-sm text-ink-soft">Signing you in…</p>}
      {err && <p role="alert" className="rounded-xl bg-red-tint px-4 py-3 text-sm font-semibold text-red-dark">⚠ {err}</p>}
    </div>
  );
}
