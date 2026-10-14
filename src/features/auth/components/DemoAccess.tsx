import { demoLogin } from '../actions';
import { Button } from '@/components/ui/button';
import { ROLES, ROLE_LABEL } from '@/config/roles';
import { site } from '@/config/site';
import { hasBackend } from '@/lib/api-client';

export function DemoAccess() {
  if (!site.demoMode || hasBackend) return null;
  return (
    <section aria-labelledby="demo" className="mt-8 rounded-2xl border-2 border-dashed border-gold-dark p-4">
      <h2 id="demo" className="font-sans text-base font-bold">Explore with sample data</h2>
      <p className="text-sm text-ink-soft">Demo mode only. No real account, no real data. Disabled in production.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{ROLES.map((r) => <form key={r} action={demoLogin.bind(null, r, 'verified')}><Button type="submit" variant="secondary" className="w-full text-sm">{ROLE_LABEL[r]}</Button></form>)}
        <form action={demoLogin.bind(null, 'school', 'pending')}><Button type="submit" variant="ghost" className="w-full text-sm">School (not yet verified)</Button></form></div>
    </section>
  );
}
