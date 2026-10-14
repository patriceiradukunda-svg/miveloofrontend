"use client";
import { useRouter } from 'next/navigation';
import { LOCALE_NAMES, locales } from '@/i18n/config';
import { LOCALE_COOKIE } from '@/lib/constants';
import { useT } from '@/providers/LocaleProvider';
import type { Locale } from '@/lib/formatters';

export function LanguageSwitcher() {
  const { locale, t } = useT(); const router = useRouter();
  return (
    <label className="inline-flex items-center gap-2 text-sm font-semibold">
      <span className="sr-only md:not-sr-only">{t('footer.language')}</span>
      <select className="min-h-11 rounded-full border border-ink/25 bg-white px-3" value={locale}
        onChange={(e) => { document.cookie = `${LOCALE_COOKIE}=${e.target.value as Locale}; path=/; max-age=31536000; samesite=lax`; router.refresh(); }}>
        {locales.map((l) => <option key={l} value={l} lang={l}>{LOCALE_NAMES[l]}</option>)}
      </select>
    </label>
  );
}
