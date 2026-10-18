'use client';
import { useState } from 'react';

/** Password field with Show/Hide, an optional leading icon and a Caps Lock warning. Accepts the props FormField hands to its input. */
export function PasswordInput({ className, leading, showLabel = 'Show', hideLabel = 'Hide', onKeyUp, onBlur, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { leading?: React.ReactNode; showLabel?: string; hideLabel?: string }) {
  const [show, setShow] = useState(false); const [caps, setCaps] = useState(false);
  return (
    <div>
      <div className="relative">
        {leading && <span aria-hidden className="pointer-events-none absolute inset-y-0 left-4 grid place-items-center text-ink-soft">{leading}</span>}
        <input {...rest} type={show ? 'text' : 'password'} className={`${className ?? ''} pr-20 ${leading ? 'pl-12' : ''}`}
          onKeyUp={(e) => { setCaps(e.getModifierState('CapsLock')); onKeyUp?.(e); }} onBlur={(e) => { setCaps(false); onBlur?.(e); }} />
        <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show} className="absolute inset-y-0 right-1.5 my-auto h-9 rounded-full px-3 text-sm font-bold text-teal hover:bg-teal-tint">{show ? hideLabel : showLabel}</button>
      </div>
      {caps && <p role="status" className="mt-1.5 text-sm font-semibold text-gold-dark">⇪ Caps Lock is on</p>}
    </div>
  );
}
