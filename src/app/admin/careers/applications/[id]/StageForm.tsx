'use client';
import { useState } from 'react';
import { changeStatus } from './actions';

const field = 'w-full rounded-xl border border-ink/20 bg-white px-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal';
const lbl = 'mb-1 block text-sm font-semibold';

export function StageForm({ id, current, statuses }: { id: string; current: string; statuses: string[] }) {
  const [next, setNext] = useState(current);
  const closing = next === 'rejected' || next === 'withdrawn';
  const name = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <form action={changeStatus} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <div>
        <label htmlFor="stage" className={lbl}>Move to</label>
        <select id="stage" name="status" value={next} onChange={(e) => setNext(e.target.value)} className={`${field} min-h-11`}>
          {statuses.map((s) => <option key={s} value={s}>{name(s)}{s === current ? ' (current)' : ''}</option>)}
        </select>
      </div>
      {closing ? (
        <div>
          <label htmlFor="reason" className={lbl}>Reason (required)</label>
          <textarea id="reason" name="reason" required rows={2} maxLength={500} className={`${field} py-2`} placeholder="Why is this application closing? This is kept on the record." />
          <p className="mt-1 text-xs text-ink/60">After saving you will be offered a reply so the candidate hears from you.</p>
        </div>
      ) : null}
      <div>
        <label htmlFor="stage-note" className={lbl}>Note (optional)</label>
        <textarea id="stage-note" name="note" rows={2} maxLength={1000} className={`${field} py-2`} />
      </div>
      <button type="submit" disabled={next === current} className="inline-flex min-h-11 items-center rounded-xl bg-teal px-4 text-sm font-bold text-cream hover:bg-teal-dark disabled:opacity-50">Save stage</button>
    </form>
  );
}
