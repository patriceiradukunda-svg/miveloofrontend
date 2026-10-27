import Link from 'next/link';
import { staffModule } from '@/config/staff-modules';
import { Badge, EmptyState } from '@/components/kit/Kit';

/** Ready-but-empty page for an admin module that is not built yet. */
export function StaffStub({ id }: { id: string }) {
  const m = staffModule(id);
  const features = m.features ?? [];
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-teal">Platform administration</p>
          <Badge tone="info">In development</Badge>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{m.title}</h1>
        {m.desc ? <p className="mt-1 max-w-2xl text-sm text-ink/70 sm:text-base">{m.desc}</p> : null}
      </header>
      {features.length > 0 ? (
        <section aria-label="What this page will do">
          <h2 className="text-sm font-extrabold">What you will be able to do here</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => <li key={f} className="rounded-2xl border border-ink/10 bg-white p-4 text-sm shadow-sm">{f}</li>)}
          </ul>
        </section>
      ) : null}
      <EmptyState title="Nothing here yet" hint="This workspace is ready. Records will appear as soon as the module goes live.">
        <Link href="/admin/dashboard" className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-ink/15 bg-white px-4 text-sm font-bold hover:bg-cream-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal">Back to dashboard</Link>
      </EmptyState>
    </div>
  );
}
