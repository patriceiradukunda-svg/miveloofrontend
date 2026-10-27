import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { asList, content, safe, type AdminPost, type Category, type MediaItem } from '@/lib/server/content-admin';
import { deletePost, postAction, savePost, schedulePost } from '@/app/admin/content/actions';
import { ACTION_LABEL, Demo, Flash, Fld, Hidden, Section, StatusPill, btnDanger, btnGhost, btnGold, field, when } from '@/app/admin/content/_ui';

const ACTIONS: Record<string, string[]> = { draft: ['publish', 'archive'], scheduled: ['publish', 'unpublish', 'archive'], published: ['unpublish', 'archive'], archived: ['restore', 'publish'] };

export async function PostEditor({ kind, id, sp }: { kind: 'blog' | 'news'; id: string; sp: Record<string, string | undefined> }) {
  const isNew = id === 'new';
  const path = `/admin/content/${kind}/${id}`;
  const post = isNew ? { data: null as AdminPost | null, error: null as string | null } : await safe(content<AdminPost>(`/posts/${encodeURIComponent(id)}`));
  const [cats, media] = await Promise.all([safe(content<unknown>(`/categories?kind=${kind}`)), safe(content<{ items: MediaItem[] }>('/media?limit=100'))]);
  const p = post.data;
  if (!isNew && !p) return <div className="space-y-4"><Flash error={post.error ?? 'Not found.'} /><Link href={`/admin/content/${kind}`} className={btnGhost}>Back to the list</Link></div>;
  const categories = asList<Category>(cats.data).filter((c) => c.active !== false);
  const images = media.data?.items ?? [];
  const hid = { id: isNew ? '' : id, kind, back: path };
  return (
    <div className="space-y-6">
      <PageHeader title={isNew ? `New ${kind === 'blog' ? 'blog post' : 'news item'}` : p?.title ?? ''} lead="Save as often as you like. The post stays private until you publish it.">
        <Link href={`/admin/content/${kind}`} className={btnGhost}>All {kind === 'blog' ? 'posts' : 'news'}</Link>
      </PageHeader>
      <Flash ok={sp.ok} error={post.error ?? sp.error} />
      {p?.is_demo && <p className="rounded-xl bg-gold/30 px-4 py-3 text-sm">This is sample content <Demo />. Replace it with real writing, or unpublish and archive it, before launch.</p>}
      <form action={savePost} className="space-y-5">
        <Hidden values={hid} />
        <Section title="Content">
          <div className="grid gap-4">
            <Fld label="Title"><input name="title" required maxLength={200} defaultValue={p?.title ?? ''} className={field} /></Fld>
            <Fld label="Summary" hint="At least 20 characters. Shown on cards and in search results."><textarea name="summary" rows={2} maxLength={400} defaultValue={p?.summary ?? ''} className={field} /></Fld>
            <Fld label="Body" hint="Markdown is supported. At least 100 characters to publish."><textarea name="body" rows={14} maxLength={20000} defaultValue={p?.body ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <Section title="Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Fld label="Category" hint="Required to publish."><select name="category_id" defaultValue={p?.category_id ?? ''} className={field}><option value="">Choose a category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Fld>
            <Fld label="Author name"><input name="author_name" maxLength={120} defaultValue={p?.author_name ?? ''} className={field} /></Fld>
            <Fld label="Tags" hint="Separate with commas."><input name="tags" defaultValue={(p?.tags ?? []).join(', ')} className={field} /></Fld>
            <Fld label="Web address" hint="Lowercase letters, numbers and hyphens. Leave empty to create it from the title."><input name="slug" maxLength={120} defaultValue={p?.slug ?? ''} className={field} /></Fld>
            <Fld label="Cover image" hint="Choose from the media library."><select name="cover_media_id" defaultValue={p?.cover_media_id ?? ''} className={field}><option value="">No change / none</option>{images.map((m) => <option key={m.id} value={m.id}>{m.filename}</option>)}</select></Fld>
            <Fld label="Cover description (alt text)"><input name="cover_alt" maxLength={300} defaultValue={p?.cover_alt ?? ''} className={field} /></Fld>
            <Fld label="Cover image address" hint="Optional: use instead of the library (must start with / or https://)." className="sm:col-span-2"><input name="cover_url" maxLength={500} defaultValue={p?.cover_url ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <Section title="Search appearance (optional)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Fld label="Search title"><input name="seo_title" maxLength={120} defaultValue={p?.seo_title ?? ''} className={field} /></Fld>
            <Fld label="Search description"><input name="seo_description" maxLength={200} defaultValue={p?.seo_description ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <Section title="Kinyarwanda (optional)">
          <div className="grid gap-4">
            <Fld label="Title"><input name="rw_title" defaultValue={p?.rw?.title ?? ''} className={field} /></Fld>
            <Fld label="Summary"><textarea name="rw_summary" rows={2} defaultValue={p?.rw?.summary ?? ''} className={field} /></Fld>
            <Fld label="Body"><textarea name="rw_body" rows={8} defaultValue={p?.rw?.body ?? ''} className={field} /></Fld>
          </div>
        </Section>
        <button className={btnGold}>{isNew ? 'Create draft' : 'Save changes'}</button>
      </form>
      {p && (
        <Section title="Status and publishing">
          <p className="mb-3 flex flex-wrap items-center gap-2 text-sm"><StatusPill status={p.status} />{p.live ? 'Visible on the public site.' : 'Not visible on the public site.'} Updated {when(p.updated_at)}.{p.scheduled_for && p.status === 'scheduled' ? ` Goes live ${when(p.scheduled_for)}.` : ''}</p>
          {p.publish_problems.length > 0 && <ul className="mb-3 list-disc pl-5 text-sm text-ink-soft">{p.publish_problems.map((x) => <li key={x}>{x}</li>)}</ul>}
          <div className="flex flex-wrap gap-2">
            {[...(ACTIONS[p.status] ?? []), p.is_featured ? 'unfeature' : 'feature', 'duplicate'].map((a) => (
              <form key={a} action={postAction}><Hidden values={{ ...hid, action: a }} /><button className={a === 'publish' ? btnGold : btnGhost}>{ACTION_LABEL[a] ?? a}</button></form>
            ))}
          </div>
          {p.status !== 'archived' && (
            <form action={schedulePost} className="mt-4 flex flex-wrap items-end gap-2">
              <Hidden values={hid} />
              <Fld label="Publish automatically at (Kigali time)"><input type="datetime-local" name="scheduled_for" required className={field} /></Fld>
              <button className={btnGhost}>Schedule</button>
            </form>
          )}
          <form action={deletePost} className="mt-4"><Hidden values={hid} /><button className={btnDanger}>Delete permanently</button></form>
        </Section>
      )}
    </div>
  );
}
