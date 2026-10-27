import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getT } from '@/i18n/server';
import { EmptyState } from '@/components/ui/empty-state';
import { wide } from '@/components/public/kit';
import { Cover } from './Cover';
import { Markdown } from './Markdown';
import { PostCard } from './PostCard';
import { NewsletterBand } from './NewsletterBand';
import { CopyButton } from './CopyButton';
import { Pill, SampleTag } from './bits';
import { getLocale, getPost } from './server';
import { localize, postMeta } from './shared';

const BASE = { blog: '/insights', news: '/news' } as const;

export async function postMetadata(kind: 'blog' | 'news', slug: string): Promise<Metadata> {
  const r = await getPost(kind, slug);
  if (r.status !== 'ok') return { title: kind === 'blog' ? 'Article' : 'News', robots: { index: false } };
  const p = r.data; const title = p.seo_title || p.title; const description = p.seo_description || p.summary || undefined;
  return { title, description, alternates: { canonical: `${BASE[kind]}/${p.slug}` }, robots: p.is_demo ? { index: false, follow: true } : undefined, openGraph: { title, description, type: 'article' } };
}

export async function PostDetail({ kind, slug }: { kind: 'blog' | 'news'; slug: string }) {
  const { t } = await getT(); const locale = await getLocale(); const r = await getPost(kind, slug);
  if (r.status === 'missing') notFound();
  if (r.status !== 'ok') return <div className={`${wide} py-24`}><EmptyState title="This page is temporarily unavailable" body="We could not load this article. Please try again in a few minutes." /></div>;
  const post = localize(r.data, locale); const related = (r.data.related ?? []).map((x) => localize(x, locale)); const base = BASE[kind];
  return (
    <>
      <header className="bg-cream-deep pb-10 pt-16">
        <div className="mx-auto max-w-3xl space-y-4 px-5 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm text-ink-soft"><Link href="/" className="underline">Home</Link> / <Link href={base} className="underline">{kind === 'blog' ? 'Blog' : 'News'}</Link></nav>
          <div className="flex flex-wrap items-center gap-2">{post.category && <Pill>{post.category.name}</Pill>}{post.is_demo && <SampleTag />}</div>
          <h1 className="text-balance font-display text-4xl font-semibold leading-tight text-teal-dark md:text-5xl">{post.title}</h1>
          {post.summary && <p className="text-xl text-ink-soft">{post.summary}</p>}
          <p className="text-sm text-ink-soft">{post.author_name ? `${post.author_name} · ` : ''}{postMeta(post)}</p>
        </div>
      </header>
      <article className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:px-6">
        {post.is_demo && <p className="rounded-xl bg-gold/20 p-4 text-sm font-semibold">This is sample content created to show how the page works.</p>}
        {locale === 'rw' && !post.translated && <p className="rounded-xl bg-teal-tint p-4 text-sm font-semibold">{t('pub.englishOnly', 'This article is available in English only.')}</p>}
        {(post.cover) && <div className="relative aspect-[16/9] overflow-hidden rounded-2xl"><Cover fill cover={post.cover} alt={post.cover_alt} label={post.category?.name ?? 'Miveloo'} seed={post.slug} /></div>}
        <Markdown text={post.body ?? ''} />
        {post.tags.length > 0 && <ul className="flex flex-wrap gap-2">{post.tags.map((g) => <li key={g} className="rounded-full border border-ink/15 px-3 py-1 text-sm text-ink-soft">#{g}</li>)}</ul>}
        <div className="flex flex-wrap items-center gap-3 border-t border-ink/10 pt-6"><CopyButton /><Link href={base} className="font-bold text-teal underline">Back to all {kind === 'blog' ? 'articles' : 'news'}</Link></div>
      </article>
      {related.length > 0 && <section className={`${wide} mt-8`}><h2 className="font-display text-3xl font-semibold text-teal-dark">Keep reading</h2><ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((x) => <li key={x.id}><PostCard post={x} href={`${base}/${x.slug}`} /></li>)}</ul></section>}
      <NewsletterBand source={`${kind}-article`} language={locale} />
    </>
  );
}
