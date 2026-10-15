import Link from 'next/link';
import { Photo } from '@/components/media/Photo';
import { Scene, type SceneName } from '@/components/media/Scenes';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/layout/SectionHeading';
import type { PhotoKey } from '@/lib/photos';

const A: { t: string; d: string; learn: string; reg: string; scene: SceneName; photo: PhotoKey }[] = [
  { t: 'Schools', d: 'Find food, compare offers, order and track deliveries.', learn: '/schools', reg: '/register/school', scene: 'school', photo: 'schoolKitchen' },
  { t: 'Individual suppliers', d: 'List your produce and reach school buyers.', learn: '/sell', reg: '/register/supplier', scene: 'farm', photo: 'womenHarvest' },
  { t: 'Cooperatives & groups', d: 'Combine member stock and fulfil bigger orders.', learn: '/cooperatives', reg: '/register/cooperative', scene: 'coop', photo: 'coopMaize' },
  { t: 'Institutions & partners', d: 'Aggregated insight for programmes and policy.', learn: '/institutions', reg: '/register/institution', scene: 'data', photo: 'agritech' },
];
export function AudienceCards() {
  return (
    <section className="container-page py-16">
      <SectionHeading eyebrow="Who it is for" title="One platform, built around the people in the school food chain" />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{A.map((a, i) => (
        <li key={a.t}><Reveal delay={i * 80} className="h-full"><article className="flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card transition-transform hover:-translate-y-1">
          <div className="aspect-[4/3] overflow-hidden bg-cream-deep"><Photo k={a.photo} alt="" className="h-full w-full" sizes="(min-width:1024px) 25vw, 50vw" fallback={<Scene name={a.scene} />} /></div>
          <div className="flex flex-1 flex-col gap-2 p-5"><h3 className="text-xl font-semibold text-teal-dark">{a.t}</h3><p className="text-ink-soft">{a.d}</p>
            <div className="mt-auto flex gap-4 pt-3 text-sm font-bold"><Link className="underline underline-offset-4" href={a.learn}>Learn more</Link><Link className="text-teal underline underline-offset-4" href={a.reg}>Register</Link></div></div>
        </article></Reveal></li>))}</ul>
    </section>
  );
}
