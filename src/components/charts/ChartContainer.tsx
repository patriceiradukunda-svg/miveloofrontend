import { SampleBadge } from '@/components/ui/badge';
export function ChartContainer({ title, sample, children, caption }: { title: string; sample?: boolean; children: React.ReactNode; caption: string }) {
  return (
    <figure className="rounded-2xl border border-ink/10 bg-white p-5">
      <figcaption className="mb-3 flex items-center justify-between gap-2"><span className="font-bold">{title}</span>{sample && <SampleBadge />}</figcaption>
      {children}
      <p className="mt-2 text-xs text-ink-soft">{caption}</p>
    </figure>
  );
}
