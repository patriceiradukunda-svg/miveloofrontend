import { ComingSoon } from '@/components/public/ComingSoon';

export const metadata = { title: 'Events', robots: { index: false } };

export default function EventsPage() {
  return <ComingSoon eyebrow="Events" title="Events are coming soon" text="Workshops, supplier and school meetups, and partner convenings will be listed here once dates are confirmed. Get in touch if you would like to host or join one." />;
}
