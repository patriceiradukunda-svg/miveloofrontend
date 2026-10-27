import { getT } from '@/i18n/server';
import { EmptyState } from '@/components/ui/empty-state';
import { wide } from '@/components/public/kit';
import { Hero } from './Hero';
import { FeaturedEvent } from './FeaturedEvent';
import { EventsBrowser } from './EventsBrowser';
import { NewsletterBand } from './NewsletterBand';
import { getEvents, getLocale } from './server';
import { localize } from './shared';

export async function EventsPage() {
  const { t } = await getT(); const locale = await getLocale(); const res = await getEvents();
  const items = res.status === 'ok' ? res.data.items.map((e) => localize(e, locale)) : [];
  const upcoming = items.filter((e) => !e.is_past && e.status !== 'cancelled');
  const featured = upcoming.find((e) => e.is_featured) ?? upcoming[0];
  return (
    <>
      <Hero photo="10-grains-legumes-bowls" eyebrow={t('pub.evEyebrow', 'The Miveloo community')} title={t('pub.evTitle', 'Where ideas meet action.')} lead={t('pub.evLead', 'Events that bring together schools, farmers, suppliers, researchers, cooperatives and partners to build a more connected food system.')}
        extra={<p className="text-sm font-bold tracking-wide text-gold">{t('pub.evNote', 'Meet people. Share knowledge. Build solutions.')}</p>} />
      <div className={`${wide} pt-16`}>
        {res.status === 'error' && <EmptyState title="This page is temporarily unavailable" body="We could not load the events. Please try again in a few minutes." />}
        {res.status === 'ok' && !items.length && <EmptyState title="No events published yet" body="Workshops, supplier and school meetups and partner gatherings will be listed here once they are confirmed. Get in touch if you would like to host one." />}
        {featured && <FeaturedEvent ev={featured} href={`/events/${featured.slug}`} label={t('pub.featuredEvent', 'Featured gathering')} />}
        <EventsBrowser items={items} hideId={featured?.id} />
      </div>
      <NewsletterBand source="events" language={locale} />
    </>
  );
}
