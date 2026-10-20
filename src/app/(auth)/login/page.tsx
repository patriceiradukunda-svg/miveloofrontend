import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { GoogleLogin } from '@/features/auth/components/GoogleLogin';
import { DemoAccess } from '@/features/auth/components/DemoAccess';
import { ButtonLink } from '@/components/ui/button';
import { getT } from '@/i18n/server';
export const metadata: Metadata = { title: 'Sign in' };
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams; const { t } = await getT();
  return (
    <>
      <p className="inline-flex items-center gap-2 rounded-full bg-gold-tint px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-gold-dark"><span aria-hidden className="h-2 w-2 rounded-full bg-gold" />{t('auth.welcomeTag', 'Welcome back')}</p>
      <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight text-teal-dark">{t('auth.signIn')}</h1>
      <p className="mb-7 mt-2 text-ink-soft">{t('auth.welcome', 'Sign in to your workspace.')}</p>
      <GoogleLogin next={next} />
      <LoginForm next={next} />
      <div className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-ink-soft"><span aria-hidden className="h-px flex-1 bg-ink/15" />{t('auth.noAccount')}<span aria-hidden className="h-px flex-1 bg-ink/15" /></div>
      <ButtonLink href="/register" variant="secondary" className="mt-4 w-full">{t('auth.create')}</ButtonLink>
      <DemoAccess />
    </>
  );
}
