import { cn } from '@/lib/utils';
export function SectionHeading({ eyebrow, title, lead, center, as: H = 'h2' }: { eyebrow?: string; title: React.ReactNode; lead?: string; center?: boolean; as?: 'h1' | 'h2' }) {
  return (
    <header className={cn('max-w-3xl space-y-3', center && 'mx-auto text-center')}>
      {eyebrow && <p className={cn('eyebrow flex items-center gap-2', center && 'justify-center')}><span aria-hidden className="h-0.5 w-8 bg-gold" />{eyebrow}</p>}
      <H className="text-fluid-h2 font-semibold text-balance text-teal-dark">{title}</H>
      {lead && <p className="text-lg text-ink-soft">{lead}</p>}
    </header>
  );
}
