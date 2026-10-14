import en from './en.json';
import rw from './rw.json';
import type { Locale } from '@/lib/formatters';

export const locales: Locale[] = ['en', 'rw'];
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', rw: 'Kinyarwanda' };
export const messages: Record<Locale, Record<string, string>> = { en, rw };

/** Falls back to English, then to the provided default, then to the key. */
export function translate(locale: Locale, key: string, fallback?: string): string {
  return messages[locale][key] ?? messages.en[key] ?? fallback ?? key;
}
