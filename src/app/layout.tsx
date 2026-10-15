import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/config/site';
import { getT } from '@/i18n/server';
import { AppProviders } from '@/providers/AppProviders';
import { ConnectivityBanner } from '@/components/feedback/ConnectivityBanner';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Miveloo | School food marketplace for Rwanda', template: '%s | Miveloo' },
  description: 'Miveloo connects schools with farmers, suppliers and cooperatives, and uses data to support better school-feeding decisions.',
  openGraph: { images: ['/og-image.png'], siteName: 'Miveloo', type: 'website' },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/icon-192.png' },
};
export const viewport: Viewport = { themeColor: '#00645F', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getT();
  return (
    <html lang={locale === 'rw' ? 'rw' : 'en'}>
      <head><noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript></head>
      <body>
        <ConnectivityBanner />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-bold">{t('nav.skip')}</a>
        <AppProviders locale={locale}>{children}</AppProviders>
      </body>
    </html>
  );
}
