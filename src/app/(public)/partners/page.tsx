import { ButtonLink } from '@/components/ui/button';

export const metadata = { title: 'Partners', description: 'Work with Miveloo to strengthen school feeding and local food supply in Rwanda.' };

const TYPES = [
  { title: 'Government & districts', text: 'Sector, district and national teams that need trusted food-price, supply and school-feeding indicators within their approved scope.', href: '/institutions', cta: 'Institutional access' },
  { title: 'NGOs & development partners', text: 'Programme teams supporting school feeding, nutrition and smallholder livelihoods who want evidence they can act on.', href: '/register/institution', cta: 'Register your organisation' },
  { title: 'Cooperatives & farmer groups', text: 'Producer organisations that want a fair route to schools and institutional buyers, and clearer planning of supply.', href: '/cooperatives', cta: 'For cooperatives' },
  { title: 'Technology, finance & logistics', text: 'Payment, mobile money, transport and data providers interested in integrating with Miveloo.', href: '/contact', cta: 'Talk to us' },
];

export default function PartnersPage() {
  return (
    <section className="container-page pb-32 pt-16">
      <p className="font-sans text-sm font-bold uppercase tracking-wider text-teal">Partners</p>
      <h1 className="mt-2 max-w-3xl text-3xl font-bold text-ink sm:text-4xl">Work with Miveloo</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">Miveloo connects schools, suppliers and cooperatives, and turns food-market data into planning tools. Partners help us reach more schools, more producers and better data.</p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {TYPES.map((t) => (
          <li key={t.title} className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
            <h2 className="text-xl font-bold text-ink">{t.title}</h2>
            <p className="mt-2 flex-1 text-ink-soft">{t.text}</p>
            <div className="mt-5"><ButtonLink href={t.href} variant="ghost">{t.cta} <span aria-hidden>→</span></ButtonLink></div>
          </li>
        ))}
      </ul>
      <div className="mt-12"><ButtonLink href="/contact" variant="gold" className="shadow-card">Start a conversation <span aria-hidden>→</span></ButtonLink></div>
    </section>
  );
}
