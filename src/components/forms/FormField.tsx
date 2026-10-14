import { useId } from 'react';
import { cn } from '@/lib/utils';

type Props = { label: string; error?: string; hint?: string; required?: boolean; children: (a: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean; className: string }) => React.ReactNode };
export function FormField({ label, error, hint, required, children }: Props) {
  const id = useId(); const descId = `${id}-d`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-bold">{label}{required && <span aria-hidden className="text-red"> *</span>}</label>
      {children({ id, className: 'field', 'aria-invalid': error ? true : undefined, 'aria-describedby': error || hint ? descId : undefined })}
      {(error || hint) && <p id={descId} role={error ? 'alert' : undefined} className={cn('text-sm', error ? 'font-semibold text-red-dark' : 'text-ink-soft')}>{error ? `⚠ ${error}` : hint}</p>}
    </div>
  );
}
