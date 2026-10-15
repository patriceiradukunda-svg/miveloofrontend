import Link from 'next/link';
import { StatusBadge } from '@/components/ui/badge';
import type { FeatureStatus } from '@/config/plans';
/** Premium or not-yet-live capability: shows the benefit and the honest state, never a fake preview. */
export function LockedFeature({ title, benefit, status }: { title: string; benefit: string; status: FeatureStatus }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-white p-4">
      <div className="flex items-start justify-between gap-2"><h3 className="font-sans text-base font-bold"><span aria-hidden>🔒 </span>{title}</h3><StatusBadge status={status} /></div>
      <p className="mt-1 text-sm text-ink-soft">{benefit}</p>
      <Link href="/app/billing" className="mt-2 inline-flex min-h-11 items-center text-sm font-bold text-teal underline underline-offset-4">Plans and terms →</Link>
    </div>
  );
}
