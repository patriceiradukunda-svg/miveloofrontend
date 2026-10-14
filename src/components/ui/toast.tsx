"use client";
import { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: number; text: string; tone: 'ok' | 'error' };
const Ctx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast['tone'] = 'ok') => {
    const id = Date.now() + Math.random();
    setItems((s) => [...s, { id, text, tone }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 6000);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:items-end">
        {items.map((t) => (
          <p key={t.id} role={t.tone === 'error' ? 'alert' : 'status'} className={`rise max-w-sm rounded-xl px-4 py-3 text-sm font-semibold shadow-card ${t.tone === 'error' ? 'bg-red text-white' : 'bg-teal text-cream'}`}>
            {t.tone === 'error' ? '⚠ ' : '✓ '}{t.text}
          </p>
        ))}
      </div>
    </Ctx.Provider>
  );
}
