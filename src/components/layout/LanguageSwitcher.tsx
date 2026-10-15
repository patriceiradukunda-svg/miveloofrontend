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
    <div role="group" aria-label={t('footer.language')} className="inline-flex rounded-full border border-ink/20 bg-white p-0.5 text-sm font-bold">
      {locales.map((l) => (
        <button key={l} type="button" lang={l} aria-pressed={l === locale} aria-label={LOCALE_NAMES[l]} title={LOCALE_NAMES[l]}
          onClick={() => { document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`; router.refresh(); }}
          className={cn('min-h-10 min-w-11 rounded-full px-3 transition-colors', l === locale ? 'bg-teal text-cream' : 'text-ink-soft hover:bg-cream-deep')}>{l.toUpperCase()}</button>))}
    </div>
  );
}
