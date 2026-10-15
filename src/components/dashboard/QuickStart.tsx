import Link from 'next/link';
import { guides } from '@/config/guides';
import type { Role } from '@/config/roles';
import { Checklist } from './Checklist';

export function QuickStart({ role }: { role: Role }) {
  const g = guides[role];
  return (
    <section aria-label="Quick start" className="grid gap-5 rounded-3xl bg-teal p-5 text-cream md:grid-cols-[1.2fr_1fr]">
      <div className="flex gap-4">
        <span aria-hidden className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold text-3xl">🧭</span>
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Quick start</p><p className="mt-1 text-lg leading-snug">{g.tip}</p><Link href="/tour" className="mt-2 inline-flex min-h-11 items-center font-bold text-gold underline underline-offset-4">Replay the guided tour →</Link></div>
      </div>
      <Checklist role={role} steps={g.steps} />
    </section>
  );
}
