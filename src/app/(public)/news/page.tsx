import { ComingSoon } from '@/components/public/ComingSoon';

export const metadata = { title: 'News', robots: { index: false } };

export default function NewsPage() {
  return <ComingSoon eyebrow="News" title="Miveloo news is coming soon" text="Announcements, product updates and programme news will be published here. Until then, our insights cover the latest thinking on school feeding and local food supply." />;
}
