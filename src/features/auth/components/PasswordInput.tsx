'use client';
import { useState } from 'react';

/** Password field with a Show/Hide toggle. Accepts the props FormField hands to its input. */
export function PasswordInput({ className, showLabel = 'Show', hideLabel = 'Hide', ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { showLabel?: string; hideLabel?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input {...rest} type={show ? 'text' : 'password'} className={`${className ?? ''} pr-20`} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} className="absolute inset-y-0 right-1.5 my-auto h-9 rounded-full px-3 text-sm font-bold text-teal hover:bg-teal-tint">{show ? hideLabel : showLabel}</button>
    </div>
  );
}
