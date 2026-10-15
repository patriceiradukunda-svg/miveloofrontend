export type SceneName = 'farm' | 'school' | 'delivery' | 'coop' | 'exchange' | 'data' | 'trust' | 'cycle';
const C = { g: '#138D3B', t: '#00645F', d: '#F5A900', r: '#E94532', c: '#FFF8E8', p: '#F6EBCF', l: '#7CC67E', i: '#12261F' };

const Base = ({ children, sky = C.p }: { children: React.ReactNode; sky?: string }) => (
  <>
    <rect width="400" height="300" fill={sky} />
    <circle cx="320" cy="62" r="34" fill={C.d} opacity=".9" />
    <path d="M0 210 Q90 150 200 200 T400 180 V300 H0Z" fill={C.l} opacity=".55" />
    <path d="M0 240 Q120 190 230 235 T400 220 V300 H0Z" fill={C.g} opacity=".75" />
    {children}
  </>
);
const Building = ({ x, y, color = C.t, label }: { x: number; y: number; color?: string; label?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="0" y="22" width="86" height="54" rx="4" fill={color} /><path d="M-6 24 L43 0 L92 24Z" fill={C.i} opacity=".85" />
    <rect x="35" y="48" width="16" height="28" fill={C.c} />{[10, 62].map((wx) => <rect key={wx} x={wx} y="34" width="14" height="12" fill={C.d} />)}
    <path d="M43 0V-16" stroke={C.i} strokeWidth="2" /><path d="M43 -16 L58 -11 L43 -6Z" fill={C.r} />{label && <title>{label}</title>}
  </g>
);
const Crate = ({ x, y }: { x: number; y: number }) => <g transform={`translate(${x} ${y})`}><rect width="26" height="20" rx="3" fill={C.d} /><path d="M0 7H26M0 14H26" stroke={C.i} strokeWidth="1.5" opacity=".5" /></g>;

function Inner({ name }: { name: SceneName }) {
  switch (name) {
    case 'farm':
      return (<Base>{[0, 1, 2, 3].map((r) => (<g key={r} transform={`translate(0 ${r * 14})`}>{Array.from({ length: 11 }, (_, i) => <g key={i} transform={`translate(${24 + i * 32 + r * 6} 236)`}><path d="M0 12V-2" stroke={C.t} strokeWidth="2" /><ellipse cx="-5" cy="-3" rx="6" ry="3" fill={C.c} opacity=".9" /><ellipse cx="5" cy="-6" rx="6" ry="3" fill={C.c} opacity=".9" /></g>)}</g>))}
        <g transform="translate(70 118)"><ellipse cx="46" cy="64" rx="52" ry="12" fill={C.t} /><path d="M0 40 Q46 100 92 40Z" fill={C.t} /><path d="M0 40 Q46 62 92 40" fill="none" stroke={C.c} strokeWidth="3" /></g>
        <text x="86" y="140" fontSize="38">🌽</text><text x="120" y="146" fontSize="34">🥬</text><text x="150" y="140" fontSize="36">🍅</text></Base>);
    case 'school':
      return (<Base><Building x={60} y={120} label="School" />
        <g transform="translate(220 150)"><ellipse cx="60" cy="86" rx="64" ry="12" fill={C.i} opacity=".2" /><path d="M10 40H110V70Q110 96 60 96T10 70Z" fill={C.t} /><rect x="2" y="34" width="116" height="9" rx="4" fill={C.i} />
          {[34, 60, 86].map((sx) => <path key={sx} d={`M${sx} 28 q-8 -12 0 -22 q8 -10 0 -22`} fill="none" stroke={C.c} strokeWidth="3" strokeLinecap="round" opacity=".9" />)}</g></Base>);
    case 'delivery':
      return (<Base><rect y="238" width="400" height="26" fill={C.i} opacity=".8" /><path d="M0 251H400" stroke={C.c} strokeDasharray="22 16" strokeWidth="3" />
        <g transform="translate(110 168)"><rect width="120" height="68" rx="6" fill={C.c} stroke={C.t} strokeWidth="3" /><Crate x={12} y={22} /><Crate x={44} y={22} /><Crate x={76} y={22} /><Crate x={28} y={2} /><Crate x={60} y={2} />
          <path d="M120 20H158L180 46V68H120Z" fill={C.d} /><rect x="136" y="26" width="20" height="16" fill={C.c} /><circle cx="36" cy="72" r="14" fill={C.i} /><circle cx="150" cy="72" r="14" fill={C.i} /><circle cx="36" cy="72" r="5" fill={C.c} /><circle cx="150" cy="72" r="5" fill={C.c} /></g>
        {[0, 1, 2].map((i) => <path key={i} d={`M${40 + i * 6} ${190 + i * 14}H${90 - i * 6}`} stroke={C.t} strokeWidth="3" strokeLinecap="round" />)}</Base>);
    case 'coop':
      return (<Base><g transform="translate(130 130)"><rect y="28" width="140" height="70" fill={C.d} /><path d="M-10 30 L70 -6 L150 30Z" fill={C.t} /><rect x="52" y="52" width="36" height="46" fill={C.c} />{[0, 1, 2].map((i) => <rect key={i} x={10 + i * 40} y="74" width="30" height="24" rx="8" fill={C.p} stroke={C.i} strokeWidth="1.5" />)}</g>
        {[[50, 214], [60, 160], [340, 200], [330, 150]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y} L200 200`} stroke={C.t} strokeDasharray="5 6" strokeWidth="2" /><circle cx={x} cy={y} r="11" fill={C.g} /><circle cx={x} cy={y} r="4" fill={C.c} /></g>)}</Base>);
    case 'exchange':
      return (<Base><Building x={20} y={130} /><Building x={294} y={130} color={C.g} />
        <path d="M120 150 Q200 90 290 150" fill="none" stroke={C.r} strokeWidth="4" strokeLinecap="round" /><path d="M290 150 l-14 -2 l8 -12Z" fill={C.r} />
        <path d="M290 190 Q200 250 120 190" fill="none" stroke={C.t} strokeWidth="4" strokeLinecap="round" /><path d="M120 190 l14 2 l-8 12Z" fill={C.t} /><Crate x={187} y={104} /><Crate x={187} y={226} /></Base>);
    case 'data':
      return (<Base sky={C.c}><rect x="40" y="40" width="320" height="200" rx="14" fill="#fff" stroke={C.t} strokeWidth="3" />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={64 + i * 34} y={190 - [40, 62, 54, 88, 76][i]!} width="22" height={[40, 62, 54, 88, 76][i]} rx="4" fill={C.g} />)}
        <path d="M232 112 L280 98 L330 84 V132 L280 138 L232 118Z" fill={C.d} opacity=".35" /><path d="M232 114 L280 118 L330 108" fill="none" stroke={C.d} strokeWidth="3" strokeDasharray="6 5" />
        <circle cx="62" cy="214" r="5" fill={C.g} /><circle cx="170" cy="214" r="5" fill={C.d} /></Base>);
    case 'trust':
      return (<Base sky={C.c}><path d="M200 40 L290 74 V150 Q290 220 200 258 Q110 220 110 150 V74Z" fill={C.t} /><path d="M155 150 L190 185 L250 115" fill="none" stroke={C.c} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        {[[80, 90, C.d], [330, 110, C.g], [320, 220, C.r], [74, 210, C.l]].map(([x, y, f], i) => <circle key={i} cx={x as number} cy={y as number} r="16" fill={f as string} opacity=".9" />)}</Base>);
    default:
      return (<Base sky={C.c}><circle cx="200" cy="150" r="96" fill="none" stroke={C.g} strokeWidth="8" strokeDasharray="150 40" /><circle cx="200" cy="150" r="96" fill="none" stroke={C.d} strokeWidth="8" strokeDasharray="60 300" strokeLinecap="round" />
        <circle cx="200" cy="150" r="52" fill={C.t} /><text x="200" y="172" textAnchor="middle" fontSize="54">🥗</text>
        {[[200, 54, C.g, '🏫'], [118, 206, C.l, '🌱'], [282, 206, C.d, '🚚']].map(([x, y, f, e], i) => <g key={i}><circle cx={x as number} cy={y as number} r="30" fill={f as string} /><text x={x as number} y={(y as number) + 11} textAnchor="middle" fontSize="30">{e as string}</text></g>)}</Base>);
  }
}
/** Original illustrations in the brand palette. Decorative unless a label is given. */
export function Scene({ name, label, className = 'h-auto w-full' }: { name: SceneName; label?: string; className?: string }) {
  return <svg viewBox="0 0 400 300" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} preserveAspectRatio="xMidYMid slice"><Inner name={name} /></svg>;
}
