import type { Point } from './BarChart';
export function LineChart({ data, unit = '' }: { data: Point[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value)); const min = Math.min(...data.map((d) => d.value));
  const x = (i: number) => 4 + (i / Math.max(data.length - 1, 1)) * 92; const y = (v: number) => 40 - ((v - min) / Math.max(max - min, 1)) * 32;
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.value)}`).join(' ');
  return (
    <>
      <svg viewBox="0 0 100 52" role="img" aria-label={`Trend: ${data.map((d) => `${d.label} ${d.value}${unit}`).join(', ')}`} className="h-44 w-full">
        <path d={path} fill="none" stroke="#00645F" strokeWidth="1.2" strokeLinejoin="round" />
        {data.map((d, i) => <g key={d.label}><circle cx={x(i)} cy={y(d.value)} r="1.4" fill="#F5A900" stroke="#00645F" strokeWidth=".5" /><text x={x(i)} y="50" textAnchor="middle" fontSize="3.2" fill="#44574F">{d.label}</text></g>)}
      </svg>
      <table className="sr-only"><tbody>{data.map((d) => <tr key={d.label}><th>{d.label}</th><td>{d.value}{unit}</td></tr>)}</tbody></table>
    </>
  );
}
