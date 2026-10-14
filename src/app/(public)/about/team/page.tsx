import type { Metadata } from 'next';
import Image from 'next/image';
import { team } from '@/config/team';
import { PageHeader } from '@/components/layout/PageHeader';
export const metadata: Metadata = { title: 'Team', alternates: { canonical: '/about/team' } };
export default function Team() {
  return <div className="container-page py-14 space-y-8"><PageHeader title="The team" lead="The people building Miveloo." />
    <ul className="grid gap-6 sm:grid-cols-3">{team.map((m) => <li key={m.name} className="overflow-hidden rounded-blob bg-white shadow-card"><Image src={m.photo} alt={`Portrait of ${m.name}`} width={480} height={480} className="aspect-square w-full object-cover" /><div className="p-4"><h2 className="text-xl font-semibold">{m.name}</h2><p className="text-ink-soft">{m.role}</p></div></li>)}</ul></div>;
}
