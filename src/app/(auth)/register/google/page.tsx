import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { readPendingGoogle } from '@/features/auth/google-login';
import { getT } from '@/i18n/server';
export const metadata: Metadata = { title: 'Finish your account' };

const ROLES = [
  ['/register/school', 'School', 'Find food, compare offers, order and track deliveries.'],
  ['/register/supplier', 'Supplier', 'List your produce and reach school buyers.'],
  ['/register/cooperative', 'Cooperative or group', 'Combine member stock and fulfil bigger orders.'],
  ['/register/institution', 'Institution or partner', 'Aggregated insight for programmes and policy.'],
] as const;

/** Where a Google sign-in lands when no Miveloo account exists yet: pick a type, then complete the details. Nothing is created yet. */
export default async function GoogleSignupPage() {
  const g = await readPendingGoogle(); const { t } = await getT();
  if (!g) redirect('/register');
  const first = g.name.split(' ')[0] || g.name;
  return (
    <>
      <p className="inline-flex items-center gap-2 rounded-full bg-green-tint px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-green-dark"><span aria-hidden>✓</span>{t('auth.googleOk', 'Google account connected')}</p>
      <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-teal-dark">{t('auth.welcomeName', 'Welcome')}, {first}</h1>
      <p className="mb-6 mt-2 text-ink-soft">We could not find a Miveloo account for <strong className="break-all">{g.email}</strong>. Choose what you are and tell us a little more. <strong>Nothing is created until you finish.</strong></p>
      <ul className="space-y-3">{ROLES.map(([href, title, body]) => (
        <li key={href}><Link href={href} className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal hover:bg-white hover:shadow-card">
          <span className="flex-1"><span className="block text-lg font-semibold">{title}</span><span className="block text-sm text-ink-soft">{body}</span></span>
          <span aria-hidden className="text-xl font-bold text-teal transition-transform group-hover:translate-x-1">→</span></Link></li>))}</ul>
      <p className="mt-6 text-center text-sm"><Link className="font-bold text-teal underline" href="/login">{t('auth.otherGoogle', 'Use a different account')}</Link></p>
    </>
  );
}
