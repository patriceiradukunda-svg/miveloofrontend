import 'server-only';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE } from '@/lib/constants';
import { translate } from './config';
import type { Locale } from '@/lib/formatters';

export async function getLocale(): Promise<Locale> {
  const v = (await cookies()).get(LOCALE_COOKIE)?.value;
  return v === 'rw' ? 'rw' : 'en';
}
export async function getT() {
  const locale = await getLocale();
  return { locale, t: (key: string, fallback?: string) => translate(locale, key, fallback) };
}
