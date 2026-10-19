export const ICON = {
  eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z', 'M12 15a3 3 0 100-6 3 3 0 000 6z'],
  eyeOff: ['M17.9 17.9A10.1 10.1 0 0112 20c-7 0-11-8-11-8a18.5 18.5 0 015.1-5.9', 'M9.9 4.2A9.1 9.1 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.2 3.2', 'M1 1l22 22', 'M14.1 14.1a3 3 0 11-4.2-4.2'],
  cart: ['M6 6h15l-1.5 9h-12z', 'M6 6L5 3H2', 'M9 20h.01', 'M18 20h.01'],
  image: ['M3 3h18v18H3z', 'M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M21 15l-5-5L5 21'],
  pin: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', 'M12 13a3 3 0 100-6 3 3 0 000 6z'],
  search: ['M21 21l-4.3-4.3', 'M11 18a7 7 0 100-14 7 7 0 000 14'],
  tag: ['M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0L2 12V2h10l8.6 8.6a2 2 0 010 2.8z', 'M7 7h.01'],
  check: ['M22 11.1V12a10 10 0 11-5.9-9.1', 'M22 4L12 14l-3-3'],
  ruler: ['M3 17L17 3l4 4L7 21z', 'M7 13l2 2', 'M10 10l2 2', 'M13 7l2 2'],
  clock: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 6v6l4 2'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  rows: ['M3 5h18', 'M3 12h18', 'M3 19h18'],
  plus: ['M12 5v14', 'M5 12h14'],
  pencil: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z'],
  heart: ['M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
  left: ['M15 18l-6-6 6-6'], right: ['M9 18l6-6-6-6'],
  clip: ['M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2', 'M9 2h6v4H9z', 'M9 12h6', 'M9 16h4'],
  box: ['M21 8l-9-5-9 5 9 5z', 'M3 8v8l9 5 9-5V8', 'M12 13v8'],
  truck: ['M1 4h13v12H1z', 'M14 8h4l3 3v5h-7z', 'M5 19.5h.01', 'M17 19.5h.01'],
  sort: ['M3 6h18', 'M6 12h12', 'M10 18h4'],
  minus: ['M5 12h14'],
  alert: ['M12 9v4', 'M12 17h.01', 'M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z'],
} as const;
export function I({ d, className = 'h-5 w-5' }: { d: readonly string[]; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>{d.map((p) => <path key={p} d={p} />)}</svg>;
}
