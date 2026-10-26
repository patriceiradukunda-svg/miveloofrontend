import Link from 'next/link';
import { staffModule } from '@/config/staff-modules';
import { roleStaffModules } from '@/config/role-modules';

/** Empty-but-ready page for an admin module that is not built yet. */
export function StaffStub({ id }: { id: string }) {
  const m = roleStaffModules[id] ?? staffModule(id);
  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wide opacity-60">Platform administration</p>
        <h1 className="text-2xl font-semibold">{m.title}</h1>
        {m.desc ? <p className="mt-1 text-sm opacity-80">{m.desc}</p> : null}
      </header>
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="font-medium">Nothing here yet</p>
        <p className="mt-1 text-sm opacity-70">This page is ready. Records will appear here once the module is connected.</p>
      </div>
      {m.features.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold">Planned</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-80">{m.features.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      ) : null}
      <Link href="/admin/dashboard" className="text-sm underline">Back to dashboard</Link>
    </section>
  );
}
