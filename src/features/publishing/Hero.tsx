import type { ComponentProps } from 'react';
import { Bg, h1s, shadow, wide } from '@/components/public/kit';

export function Hero({ photo, eyebrow, title, lead, extra }: { photo: ComponentProps<typeof Bg>['n']; eyebrow: string; title: string; lead: string; extra?: React.ReactNode }) {
  return (
    <Bg n={photo} pos="50% 45%" overlay="bg-gradient-to-r from-ink/90 via-ink/65 to-ink/25" className="py-24 md:py-32">
      <div className={`${wide} space-y-5`}>
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-gold"><span aria-hidden className="h-px w-8 bg-current" />{eyebrow}</p>
        <h1 style={h1s} className={`max-w-4xl text-balance font-semibold leading-[1.05] tracking-tight text-cream ${shadow}`}>{title}</h1>
        <p className="max-w-2xl text-lg text-cream/90 md:text-xl">{lead}</p>
        {extra}
      </div>
    </Bg>
  );
}
