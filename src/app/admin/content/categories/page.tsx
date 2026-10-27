import { PageHeader } from '@/components/layout/PageHeader';
import { asList, content, safe, type Category } from '@/lib/server/content-admin';
import { deleteCategory, saveCategory } from '../actions';
import { Flash, Hidden, Section, btn, btnDanger, btnGhost, field } from '../_ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Categories' };
const KINDS = [['blog', 'Blog'], ['news', 'News'], ['event', 'Events']] as const;
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const { data, error } = await safe(content<unknown>('/categories'));
  const cats = asList<Category>(data); const back = '/admin/content/categories';
  return (
    <div className="space-y-6">
      <PageHeader title="Categories" lead="Every post and event needs a category before it can be published." />
      <Flash ok={sp.ok} error={error ?? sp.error} />
      {KINDS.map(([kind, label]) => (
        <Section key={kind} title={label}>
          <ul className="space-y-2">{cats.filter((c) => c.kind === kind).map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-2">
              <form action={saveCategory} className="flex flex-wrap items-center gap-2"><Hidden values={{ id: c.id, back }} />
                <input name="name" defaultValue={c.name} required aria-label="Name" className={`${field} max-w-56`} />
                <input name="name_rw" defaultValue={c.name_rw ?? ''} placeholder="Kinyarwanda" aria-label="Name in Kinyarwanda" className={`${field} max-w-56`} />
                <input name="sort_order" defaultValue={c.sort_order} inputMode="numeric" aria-label="Order" className={`${field} w-20`} />
                <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="active" defaultChecked={c.active} /> Active</label>
                <button className={btnGhost}>Save</button></form>
              <form action={deleteCategory}><Hidden values={{ id: c.id, back }} /><button className={btnDanger}>Delete</button></form>
            </li>))}</ul>
          <form action={saveCategory} className="mt-4 flex flex-wrap items-center gap-2"><Hidden values={{ kind, back }} />
            <input name="name" required placeholder="New category name" aria-label="New category name" className={`${field} max-w-56`} />
            <input name="name_rw" placeholder="Kinyarwanda (optional)" aria-label="Kinyarwanda name" className={`${field} max-w-56`} />
            <button className={btn}>Add</button></form>
        </Section>
      ))}
    </div>
  );
}
