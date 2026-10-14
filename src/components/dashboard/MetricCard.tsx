import { Card } from '@/components/ui/card';
export function MetricCard({ label, value }: { label: string; value: string }) {
  return <Card><p className="text-sm font-semibold text-ink-soft">{label}</p><p className="mt-1 font-display text-3xl font-semibold text-teal-dark">{value}</p></Card>;
}
