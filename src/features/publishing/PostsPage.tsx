import { getT } from '@/i18n/server';
import { EmptyState } from '@/components/ui/empty-state';
import { wide } from '@/components/public/kit';
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
  return (
    <>
      <h1 className="sr-only">{kind === 'blog' ? t('pub.blogTitle', 'Ideas for a better school food system.') : t('pub.newsTitle', 'News and updates from Miveloo.')}</h1>
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
