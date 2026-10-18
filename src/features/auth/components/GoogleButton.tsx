'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/providers/LocaleProvider';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
interface GIS { accounts: { id: { initialize: (c: unknown) => void; renderButton: (el: HTMLElement, o: unknown) => void } } }
declare global { interface Window { google?: GIS } }

/** Google's own sign-in button (keeps Google's branding rules). Renders nothing until NEXT_PUBLIC_GOOGLE_CLIENT_ID is set. */
export function GoogleButton({ onCredential, text = 'continue_with' }: { onCredential: (credential: string) => void; text?: 'signin_with' | 'signup_with' | 'continue_with' }) {
  const { locale } = useT();
  const box = useRef<HTMLDivElement>(null); const cb = useRef(onCredential); const [ready, setReady] = useState(false);
  useEffect(() => { cb.current = onCredential; }, [onCredential]);
  useEffect(() => { if (typeof window !== 'undefined' && window.google) setReady(true); }, []);
  useEffect(() => {
    const g = window.google; const el = box.current;
    if (!ready || !CLIENT_ID || !g || !el) return;
    g.accounts.id.initialize({ client_id: CLIENT_ID, callback: (r: { credential?: string }) => { if (r.credential) cb.current(r.credential); }, auto_select: false, cancel_on_tap_outside: true });
    g.accounts.id.renderButton(el, { type: 'standard', theme: 'outline', size: 'large', shape: 'pill', text, logo_alignment: 'left', width: Math.min(400, Math.max(200, el.clientWidth)), locale: locale === 'rw' ? 'rw' : 'en' });
  }, [ready, text, locale]);
  if (!CLIENT_ID) return null;
  return (<><Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setReady(true)} onReady={() => setReady(true)} /><div ref={box} className="flex min-h-11 w-full justify-center" /></>);
}

/** Google button plus an "or" divider. Hidden entirely when Google is not configured. */
export function GoogleBlock({ onCredential, text, label = 'or use your email' }: { onCredential: (c: string) => void; text?: 'signin_with' | 'signup_with' | 'continue_with'; label?: string }) {
  if (!CLIENT_ID) return null;
  return (
    <div className="space-y-4">
      <GoogleButton onCredential={onCredential} text={text} />
      <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"><span aria-hidden className="h-px flex-1 bg-ink/15" />{label}<span aria-hidden className="h-px flex-1 bg-ink/15" /></div>
    </div>
  );
}
export const googleConfigured = !!CLIENT_ID;
