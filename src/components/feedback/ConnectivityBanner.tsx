"use client";
import { useEffect, useState } from 'react';
/** Tells people when their connection drops so they know why things are not loading. */
export function ConnectivityBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const f = () => setOnline(navigator.onLine); f();
    addEventListener('online', f); addEventListener('offline', f); return () => { removeEventListener('online', f); removeEventListener('offline', f); };
  }, []);
  if (online) return null;
  return <p role="status" className="sticky top-0 z-[60] bg-red px-4 py-2 text-center text-sm font-bold text-white">⚠ You are offline. Pages you already opened still work; new data will load when you reconnect.</p>;
}
