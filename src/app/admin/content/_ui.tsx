import type { ReactNode } from 'react';
import { lbl } from '../careers/_ui';
export * from '../careers/_ui';

export const ACTION_LABEL: Record<string, string> = { publish: 'Publish', unpublish: 'Unpublish', archive: 'Archive', restore: 'Restore', feature: 'Feature on the site', unfeature: 'Remove from featured', duplicate: 'Duplicate', cancel: 'Cancel event', reopen: 'Reopen event' };
/** Backend times are UTC; staff edit in Kigali time (UTC+2, no daylight saving). */
export const toLocalInput = (iso?: string | null) => (iso ? new Date(new Date(iso).getTime() + 7200000).toISOString().slice(0, 16) : '');
export function Fld({ label, hint, className = '', children }: { label: string; hint?: string; className?: string; children: ReactNode }) {
  return <label className={`block ${className}`}><span className={lbl}>{label}</span>{children}{hint ? <span className="mt-1 block text-xs text-ink-soft">{hint}</span> : null}</label>;
}
export function Hidden({ values }: { values: Record<string, string> }) {
  return <>{Object.entries(values).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}</>;
}
