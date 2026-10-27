import { Badge, toneFor } from './Kit';
import type { Row } from './types';

/** Board of stages. Rows need a `stage` matching a stage name, plus `title` and optionally `sub` and `meta`. */
export function Pipeline({ stages, rows }: { stages: [string, string][]; rows: Row[] }) {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0" role="list" aria-label="Pipeline stages">
      {stages.map(([name, hint]) => {
        const items = rows.filter((r) => r.stage === name);
        return (
          <section key={name} role="listitem" aria-label={`${name}, ${items.length} items`} className="min-w-[16.5rem] flex-1 snap-start rounded-2xl border border-ink/10 bg-cream-deep/60 p-3">
            <header className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold">{name}</h3>
              <Badge tone={items.length ? toneFor(name) : 'neutral'}>{items.length}</Badge>
            </header>
            <p className="mt-0.5 text-xs text-ink/60">{hint}</p>
            <ul className="mt-3 space-y-2">
              {items.map((r, i) => (
                <li key={i} className="rounded-xl border border-ink/10 bg-white p-3 text-sm shadow-sm">
                  <p className="font-bold">{String(r.title ?? '')}</p>
                  {r.sub ? <p className="text-xs text-ink/70">{String(r.sub)}</p> : null}
                  {r.meta ? <p className="mt-1 text-xs text-ink/50">{String(r.meta)}</p> : null}
                </li>))}
              {items.length === 0 ? <li className="rounded-xl border border-dashed border-ink/20 p-4 text-center text-xs text-ink/50">Nothing in {name}</li> : null}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
