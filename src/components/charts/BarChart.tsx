export interface Point { label: string; value: number }
/** Pure SVG, no chart library. A visually-hidden table gives screen readers the same data. */
export function BarChart({ data, unit = '' }: { data: Point[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1); const w = 100 / data.length;
  return (
    <>
      <svg viewBox="0 0 100 52" role="img" aria-label={data.map((d) => `${d.label} ${d.value}${unit}`).join(', ')} className="h-44 w-full">
        {data.map((d, i) => { const h = (d.value / max) * 40; return (
          <g key={d.label}><rect x={i * w + w * 0.18} y={44 - h} width={w * 0.64} height={h} rx="1.2" fill={i % 2 ? '#F5A900' : '#138D3B'} />
          <text x={i * w + w / 2} y="50" textAnchor="middle" fontSize="3.2" fill="#44574F">{d.label}</text></g>); })}
      </svg>
      <table className="sr-only"><tbody>{data.map((d) => <tr key={d.label}><th>{d.label}</th><td>{d.value}{unit}</td></tr>)}</tbody></table>
    </>
  );
}
