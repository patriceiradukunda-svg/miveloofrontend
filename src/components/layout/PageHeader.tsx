import { StatusBadge } from '@/components/ui/badge';
import type { FeatureStatus } from '@/config/plans';
export function PageHeader({ eyebrow, title, lead, status, children }: { eyebrow?: string; title: string; lead?: string; status?: FeatureStatus; children?: React.ReactNode }) {
  return (
    <div className="rise space-y-3">
      {eyebrow && <p className="eyebrow flex items-center gap-2"><span aria-hidden className="h-0.5 w-8 bg-gold" />{eyebrow}</p>}
      <h1 className="text-fluid-h2 font-semibold text-balance text-teal-dark">{title}</h1>
      <span aria-hidden className="block h-1.5 w-16 rounded-full bg-gold" />
      {status && <StatusBadge status={status} />}
      {lead && <p className="max-w-2xl text-lg text-ink-soft">{lead}</p>}
      {children}
    </div>
  );
}
