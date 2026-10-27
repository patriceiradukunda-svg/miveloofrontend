import Link from 'next/link';
import { h2s, solid } from '@/components/public/kit';
import { Cover } from './Cover';
import { SampleTag } from './bits';
import { postMeta, type LPost } from './shared';

export function FeaturedPost({ post, href, label, cta }: { post: LPost; href: string; label: string; cta: string }) {
  return (
    <article className="grid overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card lg:grid-cols-[1.15fr_1fr]">
      <Link href={href} aria-label={post.title} className="relative block aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]"><Cover fill cover={post.cover} alt={post.cover_alt} label={post.category?.name ?? 'Miveloo'} seed={post.slug} /></Link>
      <div className="flex flex-col justify-center gap-4 p-8 sm:p-12">
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]"><span className="rounded-full bg-gold/30 px-3 py-1 text-ink">{label}</span>{post.category && <span className="text-teal">{post.category.name}</span>}{post.is_demo && <SampleTag />}</p>
        <h2 style={h2s} className="text-balance font-semibold leading-[1.1] text-teal-dark">{post.title}</h2>
        {post.summary && <p className="text-lg text-ink-soft">{post.summary}</p>}
        <p className="text-sm text-ink-soft">{post.author_name ? `${post.author_name} · ` : ''}{postMeta(post)}</p>
        <div><Link href={href} className={solid}>{cta} <span aria-hidden className="ml-2">→</span></Link></div>
      </div>
    </article>
  );
}
