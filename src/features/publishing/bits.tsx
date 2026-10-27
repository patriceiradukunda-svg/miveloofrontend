import { regBadge, type Registration } from './shared';

export function SampleTag() { return <span className="rounded bg-gold/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">Sample</span>; }
export function Pill({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-teal-tint px-2.5 py-0.5 text-xs font-semibold text-teal-dark">{children}</span>; }
export function RegBadge({ reg }: { reg: Registration }) { const b = regBadge(reg); return b ? <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${b.cls}`}>{b.label}</span> : null; }
export function DateTile({ tile }: { tile: { day: string; month: string } | null }) {
  return (
    <span className="absolute left-4 top-4 w-16 rounded-xl bg-white px-2 py-2 text-center text-teal-dark shadow-card">
      <strong className="block text-2xl leading-none">{tile ? tile.day : 'TBA'}</strong>
      <span className="text-xs font-bold tracking-wider">{tile ? tile.month : 'DATE'}</span>
    </span>
  );
}
