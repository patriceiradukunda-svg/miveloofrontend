"use client";
import { useRef } from 'react';
import { Button } from './button';

/** Native <dialog>: focus trap, Esc to close and screen-reader semantics come built in. */
export function ConfirmDialog({ trigger, title, body, confirmLabel, onConfirm }: { trigger: string; title: string; body: string; confirmLabel: string; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <Button variant="danger" onClick={() => ref.current?.showModal()}>{trigger}</Button>
      <dialog ref={ref} aria-labelledby="cd-title" className="max-w-md rounded-2xl p-6 backdrop:bg-ink/50">
        <h2 id="cd-title" className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-ink-soft">{body}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => ref.current?.close()}>Cancel</Button>
          <Button variant="danger" onClick={() => { onConfirm(); ref.current?.close(); }}>{confirmLabel}</Button>
        </div>
      </dialog>
    </>
  );
}
