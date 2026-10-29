import Link from "next/link";
import type { ReactNode } from "react";

export type SupplierLink = { label: string; href: string };

export type SupplierPageProps = {
  title: string;
  description: string;
  group: string;
  kpis?: string[];
  columns?: string[];
  actions?: SupplierLink[];
  related?: SupplierLink[];
  emptyMessage?: string;
  children?: ReactNode;
};

export function SupplierPage({
  title,
  description,
  group,
  kpis = [],
  columns = [],
  actions = [],
  related = [],
  emptyMessage = "Nothing here yet.",
  children,
}: SupplierPageProps) {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-dark">{group}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-teal-dark">{title}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{description}</p>
        </div>
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((a, i) => (
              <Link
                key={a.href}
                href={a.href}
                className={
                  i === 0
                    ? "inline-flex min-h-11 items-center rounded-full bg-gold px-5 font-bold hover:bg-gold-dark hover:text-white"
                    : "inline-flex min-h-11 items-center rounded-full border-2 border-teal px-5 font-bold text-teal hover:bg-teal-tint"
                }
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {kpis.length > 0 && (
        <section aria-label="Key figures" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div key={k} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-ink-soft">{k}</p>
              <p className="mt-2 text-3xl font-bold" aria-label="No data yet">
                &mdash;
              </p>
            </div>
          ))}
        </section>
      )}

      {columns.length > 0 && (
        <section aria-label={`${title} records`} className="overflow-x-auto rounded-2xl border border-ink/10 bg-white shadow-card">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="bg-cream-deep text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                {columns.map((c) => (
                  <th key={c} scope="col" className="px-4 py-3 font-bold">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-ink-soft">
                  <span aria-hidden className="block text-3xl">
                    🌱
                  </span>
                  {emptyMessage}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      )}

      {children}

      {related.length > 0 && (
        <nav aria-label="Related pages">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-soft">Related</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-flex min-h-10 items-center rounded-full bg-cream-deep px-4 text-sm font-semibold hover:bg-gold-tint"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p role="status" className="rounded-xl bg-gold-tint px-4 py-3 text-sm font-semibold">
        Live data for this page is not connected yet. Figures show a dash until the backend endpoint is wired in.
      </p>
    </div>
  );
}
