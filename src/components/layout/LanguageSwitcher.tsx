"use client";
import { useRouter } from 'next/navigation';
import { LOCALE_NAMES, locales } from '@/i18n/config';
import { LOCALE_COOKIE } from '@/lib/constants';
import { useT } from '@/providers/LocaleProvider';
import { cn } from '@/lib/utils';

/** Compact two-way toggle: EN | RW. */
export function LanguageSwitcher() {
  const { locale, t } = useT(); const router = useRouter();
  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{t('footer.language')}</span>
      <select className="min-h-11 cursor-pointer rounded-full border border-ink/15 bg-white/70 px-3 text-sm font-semibold hover:bg-white" value={locale}
        onChange={(e) => { document.cookie = `${LOCALE_COOKIE}=${e.target.value as Locale}; path=/; max-age=31536000; samesite=lax`; router.refresh(); }}>
        {locales.map((l) => <option key={l} value={l} lang={l}>{LOCALE_NAMES[l]}</option>)}
      </select>
    </label>
  );
}
