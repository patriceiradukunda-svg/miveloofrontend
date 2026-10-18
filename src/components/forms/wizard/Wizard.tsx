'use client';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormError } from '@/components/forms/FormError';

export type Values = Record<string, string | boolean | string[]>;
export type Errors = Record<string, string>;
/** summary: one short line shown in the progress rail once the step is done ("what you have done"). */
export interface Step { id: string; title: string; hint?: string; summary?: (v: Values) => string; validate?: (v: Values) => Errors; content: React.ReactNode }
interface Ctx { v: Values; errors: Errors; set: (n: string, x: Values[string]) => void; setMany: (p: Values) => void; go: (i: number) => void }
const WizCtx = createContext<Ctx | null>(null);
export function useWiz(): Ctx { const c = useContext(WizCtx); if (!c) throw new Error('useWiz must be used inside <Wizard>'); return c; }

const DEFAULT_LABELS = { back: 'Back', next: 'Continue', step: 'Step', of: 'of', fix: 'Please complete the highlighted fields.', progress: 'Your progress', done: 'Done', now: 'In progress', soon: 'Up next', edit: 'Edit', left: 'left', complete: 'complete', about: 'about', min: 'min' };
type Labels = typeof DEFAULT_LABELS;
type NodeState = 'done' | 'now' | 'next';

/** Leaf-shaped step marker (uses the brand blob radius): ✓ when done, gold when current, outlined when upcoming. */
function Node({ state, n, dark = false }: { state: NodeState; n: number; dark?: boolean }) {
  const base = 'grid h-9 w-9 shrink-0 place-items-center rounded-blob text-sm font-bold transition-all duration-500';
  if (state === 'done') return <span aria-hidden className={`${base} bg-green text-white`}>✓</span>;
  if (state === 'now') return <span aria-hidden className={`${base} bg-gold text-ink shadow-[0_0_0_6px_rgba(245,169,0,0.28)]`}>{n}</span>;
  return <span aria-hidden className={`${base} border-2 ${dark ? 'border-cream/30 text-cream/60' : 'border-ink/15 bg-white text-ink-soft'}`}>{n}</span>;
}
function Ring({ pct }: { pct: number }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
      <circle cx="32" cy="32" r={r} fill="none" stroke="currentColor" strokeOpacity=".2" strokeWidth="6" />
      <circle cx="32" cy="32" r={r} fill="none" stroke="#F5A900" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} className="transition-[stroke-dashoffset] duration-700" />
    </svg>
  );
}

/** Horizontal "vine" for phones, tablets and narrow cards: leaves along a line that fills as you go. */
function VineBar({ steps, i, go, pct, mins, L }: { steps: Step[]; i: number; go: (k: number) => void; pct: number; mins: number; L: Labels }) {
  const frac = steps.length > 1 ? i / (steps.length - 1) : 0;
  return (
    <nav aria-label={L.progress}>
      <ol className="relative flex items-center justify-between">
        <span aria-hidden className="absolute inset-x-[18px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink/10" />
        <span aria-hidden className="absolute left-[18px] top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-green to-gold transition-[width] duration-700" style={{ width: `calc((100% - 36px) * ${frac})` }} />
        {steps.map((s, k) => (
          <li key={s.id} className="relative">
            <button type="button" disabled={k > i} onClick={() => go(k)} aria-current={k === i ? 'step' : undefined} aria-label={`${L.step} ${k + 1}: ${s.title}`} className="block rounded-blob enabled:hover:scale-110 disabled:cursor-default">
              <Node state={k < i ? 'done' : k === i ? 'now' : 'next'} n={k + 1} />
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-3 flex flex-wrap items-center justify-between gap-x-3 text-xs font-bold uppercase tracking-[0.12em] text-teal"><span>{L.step} {i + 1} {L.of} {steps.length}</span><span>{pct}% {L.complete} · {L.about} {mins} {L.min} {L.left}</span></p>
    </nav>
  );
}

/** Desktop progress rail: what you have done (with a summary), where you are, what is next. */
function Rail({ steps, i, v, go, pct, mins, L }: { steps: Step[]; i: number; v: Values; go: (k: number) => void; pct: number; mins: number; L: Labels }) {
  const left = steps.length - i;
  return (
    <aside aria-label={L.progress} className="sticky top-24 hidden self-start overflow-hidden rounded-3xl bg-teal-dark p-6 text-cream shadow-card lg:block">
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green/40 blur-3xl" />
      <div className="relative flex items-center gap-4">
        <div className="relative text-cream"><Ring pct={pct} /><span className="absolute inset-0 grid place-items-center text-sm font-bold">{pct}%</span></div>
        <div><p className="font-display text-xl font-semibold">{L.progress}</p><p className="text-sm text-cream/80">{left} {left === 1 ? 'step' : 'steps'} {L.left} · {L.about} {mins} {L.min}</p></div>
      </div>
      <ol className="relative mt-6 space-y-1">
        {steps.map((s, k) => {
          const state: NodeState = k < i ? 'done' : k === i ? 'now' : 'next';
          const sub = state === 'done' ? (s.summary?.(v) || L.done) : state === 'now' ? L.now : L.soon;
          return (
            <li key={s.id} className="relative">
              {k < steps.length - 1 && <span aria-hidden className={`absolute -bottom-1 left-6 top-11 w-1 rounded-full transition-colors duration-500 ${k < i ? 'bg-green' : 'bg-cream/15'}`} />}
              <button type="button" disabled={k > i} onClick={() => go(k)} aria-current={state === 'now' ? 'step' : undefined}
                className={`flex w-full items-start gap-3 rounded-2xl p-2 text-left transition-colors disabled:cursor-default enabled:hover:bg-cream/10 ${state === 'now' ? 'bg-cream/10' : ''}`}>
                <Node state={state} n={k + 1} dark />
                <span className="min-w-0 flex-1 pt-0.5"><span className={`block font-semibold ${state === 'next' ? 'text-cream/60' : ''}`}>{s.title}</span><span className={`block truncate text-sm ${state === 'done' ? 'text-gold' : 'text-cream/60'}`}>{sub}</span></span>
                {state === 'done' && <span className="pt-1 text-xs font-bold text-cream/70 underline">{L.edit}</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}

/** Multi-step form shell. variant "compact": leaf progress line on top (good inside narrow cards).
 *  variant "split": a progress rail beside the form on large screens, the same leaf line on small ones. */
export function Wizard({ steps, initial, onSubmit, formatError, submitLabel = 'Submit', labels, variant = 'compact', done }: {
  steps: Step[]; initial: Values; onSubmit: (v: Values) => Promise<void>; formatError?: (e: unknown) => string;
  submitLabel?: string; labels?: Partial<Labels>; variant?: 'compact' | 'split'; done: React.ReactNode;
}) {
  const L: Labels = { ...DEFAULT_LABELS, ...labels };
  const [i, setI] = useState(0); const [v, setV] = useState<Values>(initial); const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string>(); const [finished, setFinished] = useState(false);
  const head = useRef<HTMLHeadingElement>(null); const form = useRef<HTMLFormElement>(null); const first = useRef(true);
  const step = steps[i]; const last = i === steps.length - 1;
  const pct = Math.round((i / steps.length) * 100); const mins = Math.max(1, Math.round((steps.length - i) * 0.8));

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
  if (finished) return <div className="rise"><span aria-hidden className="mb-4 grid h-14 w-14 place-items-center rounded-blob bg-green text-2xl font-bold text-white">✓</span>{done}</div>;
  if (!step) return null;

  return (
    <WizCtx.Provider value={ctx}>
      <form ref={form} noValidate onSubmit={(e) => { e.preventDefault(); if (busy) return; if (last) void submit(); else next(); }}
        className={variant === 'split' ? 'lg:grid lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-10' : ''}>
        {variant === 'split' && <Rail steps={steps} i={i} v={v} go={ctx.go} pct={pct} mins={mins} L={L} />}
        <div className="min-w-0">
          <div className={variant === 'split' ? 'lg:hidden' : ''}><VineBar steps={steps} i={i} go={ctx.go} pct={pct} mins={mins} L={L} /></div>
          <p className="sr-only" aria-live="polite">{L.step} {i + 1} {L.of} {steps.length}: {step.title}</p>
          <h2 ref={head} tabIndex={-1} className="mt-6 scroll-mt-24 text-2xl font-semibold text-teal-dark outline-none sm:text-3xl lg:mt-0">{step.title}</h2>
          {step.hint && <p className="mt-1 text-ink-soft">{step.hint}</p>}
          <div className="mt-4"><FormError message={err} /></div>
          <div key={step.id} className="rise mt-5 space-y-5">{step.content}</div>
          <div className="sticky bottom-0 z-10 mt-8 flex items-center justify-between gap-3 border-t border-ink/10 bg-white/90 py-4 backdrop-blur">
            {i > 0 ? <Button type="button" variant="ghost" onClick={() => ctx.go(i - 1)}>← {L.back}</Button> : <span />}
            <p aria-hidden className="hidden text-sm font-semibold text-ink-soft md:block">{pct}% {L.complete}</p>
            <Button type="submit" variant={last ? 'gold' : 'primary'} disabled={busy}>{busy ? '…' : last ? submitLabel : `${L.next} →`}</Button>
          </div>
        </div>
      </form>
    </WizCtx.Provider>
  );
}
