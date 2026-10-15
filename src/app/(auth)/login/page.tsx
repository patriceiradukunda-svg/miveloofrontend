import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { DemoAccess } from '@/features/auth/components/DemoAccess';
import { getT } from '@/i18n/server';
export const metadata: Metadata = { title: 'Sign in' };
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams; const { t } = await getT();
  return (
    <>
      <h1 className="text-3xl font-semibold text-teal-dark">{t('auth.signIn')}</h1>
      <p className="mb-6 mt-2 text-ink-soft">{t('auth.welcome', 'Welcome back. Sign in to your workspace.')}</p>
      <LoginForm next={next} />
      <p className="mt-6 text-center text-sm">{t('auth.noAccount')} <Link className="font-bold text-teal underline" href="/register">{t('auth.create')}</Link></p>
      <DemoAccess />
    </>
  );
}
