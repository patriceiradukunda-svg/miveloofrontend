import type { Metadata } from 'next';
import { AccountTypeSelector } from '@/features/auth/components/AccountTypeSelector';
import { getT } from '@/i18n/server';
export const metadata: Metadata = { title: 'Create an account' };
export default async function Register() {
  const { t } = await getT();
  return <><h1 className="mb-2 text-3xl font-semibold text-teal-dark">{t('auth.chooseType')}</h1><p className="mb-5 text-ink-soft">Selecting a type starts a request. Access is granted only after verification.</p><AccountTypeSelector /></>;
}
