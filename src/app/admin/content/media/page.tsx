import { PageHeader } from '@/components/layout/PageHeader';
import { API_ORIGIN } from '@/lib/miveloo-client';
import { content, safe, type MediaItem } from '@/lib/server/content-admin';
import { deleteMedia, patchMedia, uploadMedia } from '../actions';
import { Flash, Hidden, Section, btn, btnDanger, btnGhost, card, field } from '../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Media library' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { data, error } = await safe(content<{ items: MediaItem[] }>('/media?limit=100'));
  const back = '/admin/content/media';
  return (
    <div className="space-y-6">
      <PageHeader title="Media library" lead="Images used by posts and events. Describe every image for people who cannot see it." />
      <Flash ok={sp.ok} error={error ?? sp.error} />
      <Section title="Upload an image">
        <form action={uploadMedia} className="grid gap-3 sm:grid-cols-4">
          <Hidden values={{ back }} />
          <input type="file" name="file" accept="image/*" required aria-label="Image file" className={field} />
          <input name="alt" placeholder="Description (alt text)" aria-label="Description" className={field} />
          <input name="credit" placeholder="Credit" aria-label="Credit" className={field} />
          <button className={btn}>Upload</button>
        </form>
      </Section>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.items ?? []).map((m) => (
          <li key={m.id} className={card}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${API_ORIGIN}${m.url}`} alt={m.alt ?? ''} className="mb-3 h-40 w-full rounded-xl object-cover" />
            <p className="truncate text-sm font-semibold">{m.filename}</p>
            <form action={patchMedia} className="mt-2 space-y-2"><Hidden values={{ id: m.id, back }} />
              <input name="alt" defaultValue={m.alt ?? ''} placeholder="Description (alt text)" aria-label="Description" className={field} />
              <input name="credit" defaultValue={m.credit ?? ''} placeholder="Credit" aria-label="Credit" className={field} />
              <button className={btnGhost}>Save</button></form>
            <form action={deleteMedia} className="mt-2"><Hidden values={{ id: m.id, back }} /><button className={btnDanger}>Delete</button></form>
          </li>
        ))}
        {data && !data.items.length && <li className="text-sm text-ink-soft">No images yet.</li>}
      </ul>
    </div>
  );
}
