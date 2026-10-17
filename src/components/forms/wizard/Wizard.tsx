'use client';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/forms/FormError';

export type Values = Record<string, string | boolean | string[]>;
export type Errors = Record<string, string>;
export interface Step { id: string; title: string; hint?: string; validate?: (v: Values) => Errors; content: React.ReactNode }
interface Ctx { v: Values; errors: Errors; set: (n: string, x: Values[string]) => void; setMany: (p: Values) => void; go: (i: number) => void }
const WizCtx = createContext<Ctx | null>(null);
export function useWiz(): Ctx { const c = useContext(WizCtx); if (!c) throw new Error('useWiz must be used inside <Wizard>'); return c; }

const DEFAULT_LABELS = { back: 'Back', next: 'Continue', step: 'Step', of: 'of', fix: 'Please complete the highlighted fields.' };

/** Multi-step form shell: progress, per-step validation, focus management, sticky action bar.
 *  variant "compact" = progress bar on top (good inside cards); "split" = step list beside the form on lg+. */
export function Wizard({ steps, initial, onSubmit, formatError, submitLabel = 'Submit', labels, variant = 'compact', done }: {
  steps: Step[]; initial: Values; onSubmit: (v: Values) => Promise<void>; formatError?: (e: unknown) => string;
  submitLabel?: string; labels?: Partial<typeof DEFAULT_LABELS>; variant?: 'compact' | 'split'; done: React.ReactNode;
}) {
  const L = { ...DEFAULT_LABELS, ...labels };
  const [i, setI] = useState(0); const [v, setV] = useState<Values>(initial); const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string>(); const [finished, setFinished] = useState(false);
  const head = useRef<HTMLHeadingElement>(null); const form = useRef<HTMLFormElement>(null); const first = useRef(true);
  const step = steps[i]; const last = i === steps.length - 1;

  const ctx = useMemo<Ctx>(() => ({
    v, errors,
    set: (n, x) => { setV((p) => ({ ...p, [n]: x })); setErrors((p) => { if (!(n in p)) return p; const q = { ...p }; delete q[n]; return q; }); },
    setMany: (p) => { setV((s) => ({ ...s, ...p })); setErrors((s) => { const q = { ...s }; Object.keys(p).forEach((k) => delete q[k]); return q; }); },
    go: (k) => { setErr(undefined); setI(Math.max(0, Math.min(steps.length - 1, k))); },
  }), [v, errors, steps.length]);

  useEffect(() => { if (first.current) { first.current = false; return; } head.current?.focus(); head.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, [i]);
  useEffect(() => { if (Object.keys(errors).length) form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(); }, [errors]);

  function next() {
    const e = step?.validate?.(v) ?? {};
    if (Object.keys(e).length) { setErrors(e); setErr(L.fix); return; }
    setErrors({}); setErr(undefined); setI((n) => n + 1);
  }
  async function submit() {
    for (let k = 0; k < steps.length; k++) {
      const e = steps[k]?.validate?.(v) ?? {};
      if (Object.keys(e).length) { setI(k); setErrors(e); setErr(L.fix); return; }
    }
    setBusy(true); setErr(undefined);
    try { await onSubmit(v); setFinished(true); }
    catch (e) { setErr(formatError ? formatError(e) : e instanceof Error ? e.message : 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  }
  if (finished) return <>{done}</>;
  if (!step) return null;

  return (
    <WizCtx.Provider value={ctx}>
      <form ref={form} noValidate onSubmit={(e) => { e.preventDefault(); if (busy) return; if (last) void submit(); else next(); }}
        className={variant === 'split' ? 'lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12' : ''}>
        {variant === 'split' && (
          <ol className="sticky top-24 hidden space-y-1 self-start lg:block">
            {steps.map((s, k) => (
              <li key={s.id}><button type="button" disabled={k > i} onClick={() => ctx.go(k)} aria-current={k === i ? 'step' : undefined}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left font-semibold enabled:hover:bg-teal-tint disabled:text-ink-soft">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold ${k < i ? 'bg-green text-white' : k === i ? 'bg-gold text-ink' : 'bg-ink/10 text-ink-soft'}`}>{k < i ? '✓' : k + 1}</span>{s.title}
              </button></li>
            ))}
          </ol>
        )}
        <div className="min-w-0">
          <div className={variant === 'split' ? 'lg:hidden' : ''}>
            <div className="flex gap-1.5" aria-hidden>{steps.map((s, k) => <span key={s.id} className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${k <= i ? 'bg-teal' : 'bg-ink/10'}`} />)}</div>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-teal">{L.step} {i + 1} {L.of} {steps.length}</p>
          </div>
          <p className="sr-only" aria-live="polite">{L.step} {i + 1} {L.of} {steps.length}: {step.title}</p>
          <h2 ref={head} tabIndex={-1} className="mt-3 scroll-mt-24 text-2xl font-semibold text-teal-dark outline-none">{step.title}</h2>
          {step.hint && <p className="mt-1 text-ink-soft">{step.hint}</p>}
          <div className="mt-4"><FormError message={err} /></div>
          <div className="mt-5 space-y-5">{step.content}</div>
          <div className="sticky bottom-0 z-10 mt-8 flex items-center justify-between gap-3 border-t border-ink/10 bg-white/90 py-4 backdrop-blur">
            {i > 0 ? <Button type="button" variant="ghost" onClick={() => ctx.go(i - 1)}>← {L.back}</Button> : <span />}
            <Button type="submit" variant={last ? 'gold' : 'primary'} disabled={busy}>{busy ? '…' : last ? submitLabel : `${L.next} →`}</Button>
          </div>
        </div>
      </form>
    </WizCtx.Provider>
  );
}
