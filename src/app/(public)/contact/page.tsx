import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactWizard } from '@/features/support/ContactWizard';
import { site } from '@/config/site';
export const metadata: Metadata = { title: 'Contact', alternates: { canonical: '/contact' } };
export default function Contact() {
  return <div className="container-page max-w-2xl py-14 space-y-8"><PageHeader title="Contact Miveloo" lead="Tell us how we can help. We only list contact details that are active." />
    {site.contact.email && <p>Email: <a className="font-bold underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a></p>}<ContactWizard /></div>;
}
