import type { ReactNode } from 'react';

export const card = 'rounded-2xl border border-ink/10 bg-white p-5 shadow-card';
export const field = 'w-full rounded-xl border border-ink/20 bg-white px-3 py-2 text-sm text-ink';
export const lbl = 'mb-1 block text-sm font-semibold text-teal-dark';
const b = 'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition';
export const btn = `${b} bg-teal text-cream hover:bg-teal-dark`;
export const btnGold = `${b} bg-gold text-ink hover:bg-cream`;
export const btnGhost = `${b} border border-ink/20 text-teal-dark hover:bg-cream-deep`;
export const btnDanger = `${b} border border-red-300 text-red-700 hover:bg-red-50`;
export const th = 'px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-teal-dark';
export const td = 'px-3 py-2 align-top text-sm';

export function Flash({ ok, error }: { ok?: string | null; error?: string | null }) {
  if (!ok && !error) return null;
  return <p role={error ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-800' : 'bg-green-tint text-teal-dark'}`}>{error ?? ok}</p>;
}
const TONE: Record<string, string> = { published: 'bg-green-tint text-teal-dark', hired: 'bg-green-tint text-teal-dark', offer: 'bg-green-tint text-teal-dark',
  draft: 'bg-cream-deep text-ink-soft', new: 'bg-teal-tint text-teal-dark', rejected: 'bg-red-50 text-red-800', closed: 'bg-ink/10 text-ink-soft', archived: 'bg-ink/10 text-ink-soft' };
export function StatusPill({ status }: { status: string }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TONE[status] ?? 'bg-cream-deep text-teal-dark'}`}>{status.replace('_', ' ')}</span>;
}
export function Demo() { return <span className="ml-2 rounded bg-gold/30 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink">demo</span>; }
export const when = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Kigali' }) : '—');
export const day = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium', timeZone: 'Africa/Kigali' }) : '—');
export const stars = (n: number | null) => (n ? '★'.repeat(n) + '☆'.repeat(5 - n) : '—');
export function href(base: string, sp: Record<string, string | undefined>, over: Record<string, string | undefined> = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...sp, ...over })) if (v && k !== 'ok' && k !== 'error') p.set(k, v);
  const t = p.toString(); return t ? `${base}?${t}` : base;
}
export function Pager({ base, sp, page, total, limit }: { base: string; sp: Record<string, string | undefined>; page: number; total: number; limit: number }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between text-sm text-ink-soft">
      <span>{total} result{total === 1 ? '' : 's'} · page {page} of {pages}</span>
      <span className="flex gap-2">
        {page > 1 && <a className={btnGhost} href={href(base, sp, { p: String(page - 1) })}>Previous</a>}
        {page < pages && <a className={btnGhost} href={href(base, sp, { p: String(page + 1) })}>Next</a>}
      </span>
    </nav>
  );
}
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className={card}><h2 className="mb-3 text-lg font-semibold text-teal-dark">{title}</h2>{children}</section>;
}
