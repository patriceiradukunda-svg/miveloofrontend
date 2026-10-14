import { cn } from '@/lib/utils';
import type { FeatureStatus } from '@/config/plans';
import { STATUS_LABEL } from '@/config/plans';

const tone: Record<FeatureStatus, string> = {
  available: 'bg-green-tint text-green-dark',
  'in-development': 'bg-gold-tint text-gold-dark',
  planned: 'bg-teal-tint text-teal-dark',
  agreement: 'bg-red-tint text-red-dark',
};
const mark: Record<FeatureStatus, string> = { available: '●', 'in-development': '◐', planned: '○', agreement: '◆' };

/** Status never relies on colour alone: each has a distinct symbol and label. */
export function StatusBadge({ status }: { status: FeatureStatus }) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', tone[status])}><span aria-hidden>{mark[status]}</span>{STATUS_LABEL[status]}</span>;
}
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center rounded-full bg-cream-deep px-2.5 py-1 text-xs font-bold text-ink-soft', className)}>{children}</span>;
}
export function SampleBadge() {
  return <span className="inline-flex rounded-full border border-dashed border-ink/40 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-ink-soft">Sample data</span>;
}
