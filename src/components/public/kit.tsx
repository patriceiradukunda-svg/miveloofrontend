import Image from 'next/image';

/** Shared design kit for the redesigned public pages (server-safe, no client code). */
export const P = '/images/miveloo-photos/';
export const wide = 'mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10';
const btn = 'inline-flex min-h-12 items-center justify-center rounded-full px-6 text-[0.95rem] font-bold transition-all duration-300';
export const gold = `${btn} bg-gold text-ink hover:-translate-y-0.5 hover:bg-cream hover:shadow-card`;
export const light = `${btn} border-2 border-cream/70 text-cream hover:bg-cream/10`;
export const solid = `${btn} bg-teal text-cream hover:-translate-y-0.5 hover:bg-teal-dark`;
export const h1s = { fontSize: 'clamp(2.1rem, 0.9rem + 4.4vw, 5rem)' } as const;
export const h2s = { fontSize: 'clamp(1.7rem, 1rem + 2.6vw, 3rem)' } as const;
export const shadow = '[text-shadow:0_2px_24px_rgba(0,0,0,0.35)]';
export const lrOverlay = 'bg-gradient-to-r from-ink/90 via-ink/65 to-ink/15';

export function Eyebrow({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={`flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] ${dark ? 'text-gold' : 'text-teal'}`}><span aria-hidden className="h-px w-8 bg-current" />{children}</p>;
}
/** Full-bleed photo section: the image is the background; the overlay keeps text readable. */
export function Bg({ n, pos = 'center', overlay = lrOverlay, className = '', children }: { n: string; pos?: string; overlay?: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={`relative isolate overflow-hidden text-cream ${className}`}>
      <Image src={`${P}${n}.jpg`} alt="" fill sizes="100vw" className="-z-20 object-cover" style={{ objectPosition: pos }} />
      <div aria-hidden className={`absolute inset-0 -z-10 ${overlay}`} />
      {children}
    </section>
  );
}
export const Icon = ({ d }: { d: string[] }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>{d.map((p) => <path key={p} d={p} />)}</svg>
);
