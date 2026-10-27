import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'ok' | 'warn' | 'bad' | 'info' | 'neutral';
const TONES: Record<Tone, string> = {
  ok: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  warn: 'bg-amber-50 text-amber-900 ring-amber-600/25',
  bad: 'bg-red-50 text-red-800 ring-red-600/20',
  info: 'bg-sky-50 text-sky-800 ring-sky-600/20',
  neutral: 'bg-ink/5 text-ink/70 ring-ink/10',
};

/** Picks a colour for a status word. Colour is never the only signal: the word is always shown. */
export function toneFor(v: string): Tone {
  if (/overdue|reject|fail|expired|out of stock|cancel|disput|critical|denied|\blate\b|spoil|suspend|no-show|^over$|urgent|delay/i.test(v)) return 'bad';
  if (/pending|draft|review|scheduled|partial|\blow\b|\bopen\b|\bnew\b|watch|expiring|moderate|info requested|planned|screening|on leave|rework|submitted|paused|\bfull\b|needs inspection|offboarding|loading/i.test(v)) return 'warn';
  if (/paid|deliver|approv|verif|active|publish|receiv|in stock|passed|accepted|complete|closed|served|hired|success|on track|\bok\b|resolved|good|settled/i.test(v)) return 'ok';
  if (/transit|\bway\b|confirm|dispatch|prepar|cooking|interview|offer|shortlist|placed|sent|reserved|arrived|ordered/i.test(v)) return 'info';
  return 'neutral';
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cn('inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset', TONES[tone])}>{children}</span>;
}

export function StatCard({ label, value, hint, alert }: { label: string; value: string; hint: string; alert?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/60">{label}</p>
      <p className={cn('mt-1 truncate text-2xl font-extrabold', alert ? 'text-red-700' : 'text-ink')}>{value}</p>
      <p className="mt-1 text-xs text-ink/60">{hint}</p>
    </div>
  );
}

export function EmptyState({ title, hint, children }: { title: string; hint: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/20 bg-cream/60 px-6 py-12 text-center">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-ink/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13h5l2 3h4l2-3h5" /><path d="M5 5h14l2 8v6H3v-6z" />
      </svg>
      <p className="mt-3 font-bold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink/70">{hint}</p>
      {children}
    </div>
  );
}
