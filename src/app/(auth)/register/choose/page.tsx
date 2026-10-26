import type { Metadata } from 'next';
import Link from 'next/link';
import { RoleCards } from '@/features/auth/components/RoleCards';
import { getT } from '@/i18n/server';
export const metadata: Metadata = { title: 'Choose an account type' };
export default async function ChooseAccountType() {
  const { t } = await getT();
  return (
    <>
      <h1 className="text-3xl font-semibold text-teal-dark">{t('auth.chooseType')}</h1>
      <p className="mb-6 mt-2 text-ink-soft">Selecting a type starts a request. Access is granted only after verification.</p>
      <RoleCards />
      <p className="mt-6 text-center text-sm">{t('auth.haveAccount', 'Already have an account?')} <Link className="font-bold text-teal underline" href="/login">{t('auth.signIn')}</Link></p>
    </>
  );
}
