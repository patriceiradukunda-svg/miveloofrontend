import { LocaleProvider } from './LocaleProvider';
import { ToastProvider } from '@/components/ui/toast';
import type { Locale } from '@/lib/formatters';
export function AppProviders({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleProvider locale={locale}><ToastProvider>{children}</ToastProvider></LocaleProvider>;
}
