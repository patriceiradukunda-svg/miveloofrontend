export type Kind = 'text' | 'status' | 'money' | 'date' | 'qty';
export interface Col { key: string; label: string; kind: Kind }
export interface Filter { key: string; label: string; options: string[] }
export type Row = Record<string, string | number | null | undefined>;

export function formatCell(v: unknown, kind: Kind): string {
  if (v === null || v === undefined || v === '') return '—';
  if (kind === 'money' || kind === 'qty') {
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return kind === 'money' ? `${n.toLocaleString('en-GB')} RWF` : n.toLocaleString('en-GB');
  }
  if (kind === 'date') {
    const d = new Date(String(v));
    return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return String(v);
}
