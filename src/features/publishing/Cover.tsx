/* eslint-disable @next/next/no-img-element */
import { coverSrc, hash, type CoverInfo } from './shared';

const TONES = [
  { bg: 'from-teal to-teal-dark', fg: 'text-cream' }, { bg: 'from-green to-teal', fg: 'text-cream' },
  { bg: 'from-gold to-gold-dark', fg: 'text-ink' }, { bg: 'from-teal-dark to-ink', fg: 'text-cream' },
] as const;

/** The editor's cover image, or a brand-coloured panel with the category name when there is no image yet. */
export function Cover({ cover, alt, label, seed, fill = false }: { cover: CoverInfo; alt: string | null; label: string; seed: string; fill?: boolean }) {
  const src = coverSrc(cover);
  const pos = fill ? 'absolute inset-0 h-full w-full' : 'relative h-full w-full';
  if (src) return <img src={src} alt={alt ?? ''} loading="lazy" className={`${pos} object-cover`} />;
  const tone = TONES[hash(seed) % TONES.length] ?? TONES[0];
  return (
    <div role="img" aria-label={label} className={`${pos} grid place-items-center overflow-hidden bg-gradient-to-br ${tone.bg}`}>
      <span aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <span aria-hidden className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full bg-white/10" />
      <span className={`relative px-6 text-center font-display text-xl font-semibold leading-tight opacity-90 ${tone.fg}`}>{label}</span>
    </div>
  );
}
