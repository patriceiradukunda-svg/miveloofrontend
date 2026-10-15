import Link from 'next/link';
import { Icon } from '@/components/public/kit';
import { getT } from '@/i18n/server';

/** Role picker: each card goes to the existing /register/<role> form. */
export async function RoleCards() {
  const { t } = await getT();
  const roles = [
    { href: '/register/school', d: ['M3 10l9-6 9 6', 'M5 10v9h14v-9', 'M10 19v-5h4v5'], h: t('role.school', 'School'), b: t('role.schoolB', 'Find food, compare offers, order and track deliveries.') },
    { href: '/register/supplier', d: ['M12 21v-9', 'M12 12c0-4 3-6 7-6 0 4-3 6-7 6z', 'M12 14c0-3-2-5-6-5 0 3 2 5 6 5z'], h: t('role.supplier', 'Supplier'), b: t('role.supplierB', 'List your produce and reach school buyers.') },
    { href: '/register/cooperative', d: ['M9 11a3 3 0 100-6 3 3 0 000 6z', 'M17 11a3 3 0 100-6 3 3 0 000 6z', 'M3 20v-1a4 4 0 014-4h4a4 4 0 014 4v1', 'M16 15h2a4 4 0 013 4v1'], h: t('role.coop', 'Cooperative or group'), b: t('role.coopB', 'Combine member stock and fulfil bigger orders.') },
    { href: '/register/institution', d: ['M3 21h18', 'M5 21V9l7-5 7 5v12', 'M9 21v-6h6v6'], h: t('role.inst', 'Institution or partner'), b: t('role.instB', 'Aggregated insight for programmes and policy.') },
  ];
  return (
    <ul className="space-y-3">
      {roles.map((r) => (
        <li key={r.href}>
          <Link href={r.href} className="group flex items-center gap-4 rounded-2xl border border-ink/10 bg-cream/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-teal hover:bg-white hover:shadow-card">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal text-cream"><Icon d={r.d} /></span>
            <span className="flex-1"><span className="block text-lg font-semibold">{r.h}</span><span className="block text-sm text-ink-soft">{r.b}</span></span>
            <span aria-hidden className="text-xl font-bold text-teal transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
