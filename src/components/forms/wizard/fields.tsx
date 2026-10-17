'use client';
import { FormField } from '@/components/forms/FormField';
import { useWiz } from './Wizard';

const str = (x: unknown) => (typeof x === 'string' ? x : '');
export interface Option { value: string; label: string }

export function Text({ name, label, hint, required, type = 'text', autoComplete, inputMode, placeholder, suggestions }: { suggestions?: string[]; name: string; label: string; hint?: string; required?: boolean; type?: string; autoComplete?: string; inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal'; placeholder?: string }) {
  const { v, set, errors } = useWiz();
  return <FormField label={label} hint={hint} error={errors[name]} required={required}>{(p) => <><input {...p} name={name} type={type} autoComplete={autoComplete} inputMode={inputMode} placeholder={placeholder} list={suggestions?.length ? `${p.id}-dl` : undefined} value={str(v[name])} onChange={(e) => set(name, e.target.value)} />{suggestions?.length ? <datalist id={`${p.id}-dl`}>{suggestions.map((x) => <option key={x} value={x} />)}</datalist> : null}</>}</FormField>;
}
export function Area({ name, label, hint, required, rows = 4 }: { name: string; label: string; hint?: string; required?: boolean; rows?: number }) {
  const { v, set, errors } = useWiz();
  return <FormField label={label} hint={hint} error={errors[name]} required={required}>{(p) => <textarea {...p} name={name} rows={rows} className={`${p.className} py-3`} value={str(v[name])} onChange={(e) => set(name, e.target.value)} />}</FormField>;
}
export function Select({ name, label, options, placeholder = 'Select…', hint, required, disabled, onPick }: { name: string; label: string; options: Option[]; placeholder?: string; hint?: string; required?: boolean; disabled?: boolean; onPick?: (value: string, label: string) => void }) {
  const { v, set, errors } = useWiz();
  return (
    <FormField label={label} hint={hint} error={errors[name]} required={required}>
      {(p) => <select {...p} name={name} disabled={disabled} value={str(v[name])} className={`${p.className} bg-white disabled:bg-ink/5 disabled:text-ink-soft`}
        onChange={(e) => { const o = options.find((x) => x.value === e.target.value); if (onPick) onPick(e.target.value, o?.label ?? ''); else set(name, e.target.value); }}>
        <option value="">{placeholder}</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>}
    </FormField>
  );
}
export function Check({ name, children }: { name: string; children: React.ReactNode }) {
  const { v, set, errors } = useWiz();
  return (
    <div><label className="flex items-start gap-3 text-sm"><input type="checkbox" name={name} checked={v[name] === true} onChange={(e) => set(name, e.target.checked)} aria-invalid={errors[name] ? true : undefined} className="mt-1 h-5 w-5 accent-teal" /><span>{children}</span></label>
      {errors[name] && <p role="alert" className="mt-1 text-sm font-semibold text-red-dark">⚠ {errors[name]}</p>}</div>
  );
}
/** Large radio cards. */
export function Choice({ name, label, options, required }: { name: string; label: string; required?: boolean; options: { value: string; title: string; desc?: string }[] }) {
  const { v, set, errors } = useWiz();
  return (
    <fieldset className="space-y-2"><legend className="text-sm font-bold">{label}{required && <span aria-hidden className="text-red"> *</span>}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{options.map((o) => (
        <label key={o.value} className={`cursor-pointer rounded-2xl border-2 p-4 transition focus-within:ring-2 focus-within:ring-gold ${v[name] === o.value ? 'border-teal bg-teal-tint' : 'border-ink/15 bg-white hover:border-teal/50'}`}>
          <input type="radio" className="sr-only" name={name} value={o.value} checked={v[name] === o.value} onChange={() => set(name, o.value)} />
          <span className="block font-bold">{o.title}</span>{o.desc && <span className="block text-sm text-ink-soft">{o.desc}</span>}
        </label>))}</div>
      {errors[name] && <p role="alert" className="text-sm font-semibold text-red-dark">⚠ {errors[name]}</p>}</fieldset>
  );
}
/** Multi-select chips. */
export function Chips({ name, label, options, hint }: { name: string; label: string; options: Option[]; hint?: string }) {
  const { v, set } = useWiz(); const cur = Array.isArray(v[name]) ? (v[name] as string[]) : [];
  return (
    <fieldset className="space-y-2"><legend className="text-sm font-bold">{label}</legend>{hint && <p className="text-sm text-ink-soft">{hint}</p>}
      <div className="flex flex-wrap gap-2">{options.map((o) => { const on = cur.includes(o.value); return (
        <label key={o.value} className={`cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition focus-within:ring-2 focus-within:ring-gold ${on ? 'border-teal bg-teal text-cream' : 'border-ink/15 bg-white hover:border-teal/50'}`}>
          <input type="checkbox" className="sr-only" checked={on} onChange={() => set(name, on ? cur.filter((x) => x !== o.value) : [...cur, o.value])} />{o.label}
        </label>); })}</div></fieldset>
  );
}
