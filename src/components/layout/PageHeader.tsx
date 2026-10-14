import { StatusBadge } from '@/components/ui/badge';
import type { FeatureStatus } from '@/config/plans';
export function PageHeader({ eyebrow, title, lead, status, children }: { eyebrow?: string; title: string; lead?: string; status?: FeatureStatus; children?: React.ReactNode }) {
  return (
    <div className="rise space-y-3">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-fluid-h2 font-semibold text-teal-dark">{title}</h1>
      {status && <StatusBadge status={status} />}
      {lead && <p className="max-w-2xl text-lg text-ink-soft">{lead}</p>}
      {children}
    </div>
  );
}
