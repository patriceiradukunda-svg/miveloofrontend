"use client";
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { I } from './icons';

export interface CardAction { key: string; label: string; icon: readonly string[]; onClick?: () => void; href?: string; pressed?: boolean; disabled?: boolean }
interface Props {
  name: string; price: React.ReactNode; meta: React.ReactNode; photo?: string; emoji: string; actions: CardAction[]; onOpen: () => void;
  featured?: boolean; compact?: boolean; ribbon?: React.ReactNode; dim?: boolean; dashed?: boolean; priority?: boolean;
}
const btn = 'group/btn relative grid h-11 w-11 place-items-center rounded-full bg-white text-teal-dark shadow-lg transition hover:scale-110 hover:bg-gold focus-visible:scale-110 disabled:opacity-40 aria-pressed:bg-gold';
/** One framed piece in the gallery: big image, name and price, one meta line. Actions appear on hover or focus (always visible on touch). */
export function GalleryCard({ name, price, meta, photo, emoji, actions, onOpen, featured, compact, ribbon, dim, dashed, priority }: Props) {
  return (
    <figure className="group relative flex flex-col">
      <div className={cn('relative overflow-hidden rounded-2xl bg-cream-deep shadow-card ring-1 ring-ink/10 transition-shadow duration-300 group-hover:shadow-xl', featured ? 'aspect-[16/10]' : compact ? 'aspect-square' : 'aspect-[4/5]', dim && 'opacity-70 saturate-50', dashed && 'outline outline-2 -outline-offset-4 outline-dashed outline-ink/30')}>
        {photo
          ? <Image src={photo} alt="" fill priority={priority} sizes={featured ? '(min-width:1280px) 45vw, 100vw' : '(min-width:1280px) 22vw, (min-width:640px) 45vw, 100vw'} className="object-cover transition-transform duration-700 group-hover:scale-105" />
          : <div className="grid h-full w-full place-items-center bg-gradient-to-br from-green-tint via-gold-tint to-teal-tint text-7xl" aria-hidden>{emoji}</div>}
        <button type="button" tabIndex={-1} aria-hidden onClick={onOpen} className="absolute inset-0 cursor-zoom-in" />
        {ribbon && <div className="pointer-events-none absolute left-3 top-3 z-[1]">{ribbon}</div>}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-3 bg-gradient-to-t from-ink/65 via-ink/25 to-transparent px-4 pb-4 pt-16 opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          {actions.map((a) => {
            const tip = <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-semibold text-cream opacity-0 transition group-hover/btn:opacity-100 group-focus-visible/btn:opacity-100 [@media(hover:none)]:hidden">{a.label}</span>;
            return a.href
              ? <Link key={a.key} href={a.href} aria-label={a.label} className={cn(btn, 'pointer-events-auto')}><I d={a.icon} />{tip}</Link>
              : <button key={a.key} type="button" aria-label={a.label} aria-pressed={a.pressed} disabled={a.disabled} onClick={a.onClick} className={cn(btn, 'pointer-events-auto')}><I d={a.icon} />{tip}</button>;
          })}
        </div>
      </div>
      <figcaption className="mt-3 space-y-1 px-1">
        <div className="flex items-baseline justify-between gap-3"><h3 className={cn('font-display font-semibold leading-tight text-teal-dark', compact ? 'text-base' : 'text-xl')}>{name}</h3><p className={cn('shrink-0 font-bold', compact && 'text-sm')}>{price}</p></div>
        <p className="flex flex-wrap items-center gap-x-1.5 text-sm text-ink-soft">{meta}</p>
      </figcaption>
    </figure>
  );
}
