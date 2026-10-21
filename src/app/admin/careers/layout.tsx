import Link from 'next/link';
import { headers } from 'next/headers';

const tabs = [['/admin/careers', 'Dashboard'], ['/admin/careers/jobs', 'Jobs'], ['/admin/careers/applications', 'Applications'],
  ['/admin/careers/templates', 'Reply templates'], ['/admin/careers/activity', 'Activity log']] as const;

export default async function CareersLayout({ children }: { children: React.ReactNode }) {
  const path = (await headers()).get('x-pathname') ?? '';
  return (
    <div className="space-y-6">
      <nav aria-label="Careers admin" className="flex flex-wrap gap-2">
        {tabs.map(([h, l]) => {
          const on = h === '/admin/careers' ? path === h : path.startsWith(h);
          return <Link key={h} href={h} aria-current={on ? 'page' : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold ${on ? 'bg-teal text-cream' : 'border border-ink/15 bg-white text-teal-dark hover:bg-cream-deep'}`}>{l}</Link>;
        })}
      </nav>
      {children}
    </div>
  );
}
