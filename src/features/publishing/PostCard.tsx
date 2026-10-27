import Link from 'next/link';
import { Cover } from './Cover';
import { Pill, SampleTag } from './bits';
import { postMeta, type LPost } from './shared';

export function PostCard({ post, href }: { post: LPost; href: string }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card transition hover:-translate-y-0.5">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden"><Cover fill cover={post.cover} alt={post.cover_alt} label={post.category?.name ?? 'Miveloo'} seed={post.slug} /></Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">{post.category && <Pill>{post.category.name}</Pill>}{post.is_demo && <SampleTag />}</div>
        <h3 className="mt-3 text-xl font-semibold leading-snug text-teal-dark"><Link href={href} className="hover:underline">{post.title}</Link></h3>
        {post.summary && <p className="mt-2 flex-1 text-ink-soft">{post.summary}</p>}
        <p className="mt-4 text-sm text-ink-soft">{postMeta(post)}</p>
      </div>
    </article>
  );
}
