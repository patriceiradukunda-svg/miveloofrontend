import { getT } from '@/i18n/server';
import { ButtonLink } from '@/components/ui/button';

/** The cycle motif from the logo: farm -> delivery -> school, orbiting a harvest bowl. */
function Cycle() {
  const node = (cx: number, cy: number, fill: string, icon: string, label: string) => (
    <g><circle cx={cx} cy={cy} r="34" fill={fill} /><text x={cx} y={cy + 12} textAnchor="middle" fontSize="34" aria-hidden>{icon}</text><title>{label}</title></g>
  );
  return (
    <svg viewBox="0 0 320 320" role="img" aria-label="Cycle: farms supply food, trucks deliver it, schools receive it" className="mx-auto w-full max-w-sm">
      <circle cx="160" cy="160" r="112" fill="none" stroke="#138D3B" strokeWidth="6" strokeDasharray="150 40" className="orbit" />
      <circle cx="160" cy="160" r="112" fill="none" stroke="#F5A900" strokeWidth="6" strokeDasharray="60 300" strokeLinecap="round" className="orbit" style={{ animationDirection: 'reverse' }} />
      <circle cx="160" cy="160" r="70" fill="#00645F" /><text x="160" y="185" textAnchor="middle" fontSize="72" aria-hidden>🥗</text>
      {node(160, 48, '#138D3B', '🏫', 'School')}{node(62, 216, '#E3F4E8', '🌱', 'Farm')}{node(258, 216, '#F5A900', '🚚', 'Delivery')}
    </svg>
  );
}
export async function HeroSection() {
  const { t } = await getT();
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/25 blur-3xl" />
      <div className="container-page relative grid items-center gap-10 py-14 md:grid-cols-[1.2fr_1fr] md:py-24">
        <div className="rise space-y-6">
          <p className="eyebrow">{t('home.eyebrow')}</p>
          <h1 className="text-fluid-hero font-semibold text-teal-dark">{t('home.title')}</h1>
          <p className="max-w-xl text-lg text-ink-soft">{t('home.lead')}</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/sell" variant="gold">{t('home.ctaSell')}</ButtonLink>
            <ButtonLink href="/marketplace" variant="secondary">{t('home.ctaBrowse')}</ButtonLink>
            <ButtonLink href="/register/school" variant="ghost">{t('home.ctaSchool')}</ButtonLink>
          </div>
        </div>
        <Cycle />
      </div>
    </section>
  );
}
