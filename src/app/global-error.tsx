"use client";
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return <html lang="en"><body style={{ fontFamily: 'system-ui', padding: '4rem 1rem', textAlign: 'center', background: '#FFF8E8' }}><h1>Miveloo is having trouble</h1><p>Please reload the page.</p><button onClick={reset}>Reload</button></body></html>;
}
