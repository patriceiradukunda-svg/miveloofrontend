'use client';
import { useWiz } from './Wizard';

/** Review list with an Edit link per row. Each row: [label, value, step index to jump to]. */
export function ReviewRows({ rows }: { rows: [string, string, number][] }) {
  const { go } = useWiz();
  return (
    <dl className="divide-y divide-ink/10 rounded-2xl border border-ink/10">
      {rows.map(([k, val, step]) => (
        <div key={k} className="flex items-start justify-between gap-4 p-4">
          <div className="min-w-0"><dt className="text-xs font-bold uppercase tracking-wider text-ink-soft">{k}</dt><dd className="break-words font-semibold">{val || '—'}</dd></div>
          <button type="button" onClick={() => go(step)} className="shrink-0 text-sm font-bold text-teal underline">Edit</button>
        </div>
      ))}
    </dl>
  );
}
