"use client";
import { createContext, useContext, useMemo } from 'react';
import { translate } from '@/i18n/config';
import type { Locale } from '@/lib/formatters';

const Ctx = createContext<{ locale: Locale; t: (k: string, f?: string) => string }>({ locale: 'en', t: (k, f) => f ?? k });
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const value = useMemo(() => ({ locale, t: (k: string, f?: string) => translate(locale, k, f) }), [locale]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useT = () => useContext(Ctx);
