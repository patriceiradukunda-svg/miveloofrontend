import Image from 'next/image';
import Link from 'next/link';
import { founder } from '@/config/founder';
import { guides } from '@/config/guides';
import type { Role } from '@/config/roles';
import { Checklist } from './Checklist';

export function FounderTip({ role }: { role: Role }) {
  const g = guides[role];
  return (
    <section aria-label="Founder's guidance" className="grid gap-5 rounded-3xl bg-teal p-5 text-cream md:grid-cols-[1.2fr_1fr]">
      <div className="flex gap-4">
        <Image src={founder.photo} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full border-2 border-gold object-cover" />
        <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-gold">A note from {founder.name}</p><p className="mt-1 text-lg leading-snug">{g.tip}</p><Link href="/tour" className="mt-2 inline-flex min-h-11 items-center font-bold text-gold underline underline-offset-4">Replay the guided tour →</Link></div>
      </div>
      <Checklist role={role} steps={g.steps} />
    </section>
  );
}
