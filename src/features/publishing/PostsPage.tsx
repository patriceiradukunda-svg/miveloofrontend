import { getT } from '@/i18n/server';
import { EmptyState } from '@/components/ui/empty-state';
import { wide } from '@/components/public/kit';
import { Hero } from './Hero';
import { FeaturedPost } from './FeaturedPost';
import { PostsBrowser } from './PostsBrowser';
import { NewsletterBand } from './NewsletterBand';
import { getLocale, getPosts } from './server';
import { localize } from './shared';

export async function PostsPage({ kind }: { kind: 'blog' | 'news' }) {
  const { t } = await getT(); const locale = await getLocale(); const res = await getPosts(kind);
  const base = kind === 'blog' ? '/insights' : '/news';
  const items = res.status === 'ok' ? res.data.items.map((p) => localize(p, locale)) : [];
  const featured = items.find((p) => p.is_featured) ?? items[0];
  const tagline = <p className="text-sm font-bold tracking-wide text-gold">{t('brand.tagline', 'No More Struggles. All Solutions Within Reach.')}</p>;
  return (
    <>
      {kind === 'blog'
        ? <Hero photo="06-school-kitchen-cooks" eyebrow={t('pub.blogEyebrow', 'The Miveloo Journal')} title={t('pub.blogTitle', 'Ideas for a better school food system.')} lead={t('pub.blogLead', 'Stories, knowledge and fresh perspectives on school feeding, food supply, intelligent planning and the people building a better food future.')} extra={tagline} />
        : <Hero photo="05-farmer-harvesting-greens" eyebrow={t('pub.newsEyebrow', 'News and updates')} title={t('pub.newsTitle', 'News and updates from Miveloo.')} lead={t('pub.newsLead', 'Announcements, product updates and stories about school feeding, local agriculture, food markets and nutrition.')} />}
      <div className={`${wide} pt-16`}>
        {res.status === 'error' && <EmptyState title="This page is temporarily unavailable" body="We could not load the latest stories. Please try again in a few minutes." />}
        {res.status === 'ok' && !items.length && <EmptyState title={kind === 'blog' ? 'No articles published yet' : 'No news published yet'} body="New stories will appear here as soon as they are published." />}
        {featured && <FeaturedPost post={featured} href={`${base}/${featured.slug}`} label={kind === 'blog' ? t('pub.featuredBlog', 'Featured perspective') : t('pub.featuredNews', 'Top story')} cta={t('pub.readStory', 'Read the story')} />}
        <PostsBrowser items={items} basePath={base} hideId={featured?.id} heading={kind === 'blog' ? t('pub.blogHeading', 'Stories that move us forward') : t('pub.newsHeading', 'Latest news')} lead={kind === 'blog' ? t('pub.blogSub', 'Practical ideas for everyone working to strengthen the school food system.') : t('pub.newsSub', 'What is happening at Miveloo and across the school food system.')} />
      </div>
      <NewsletterBand source={kind} language={locale} />
    </>
  );
}
