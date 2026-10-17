import type { Metadata } from 'next';
import { RequestWizard } from '@/features/orders/components/RequestWizard';
export const metadata: Metadata = { title: 'Request food' };
export default function NewRequest() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold text-teal-dark">Request food</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">Tell us what your school needs. We keep your request on file and can tell you when a matching product is listed.</p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8"><RequestWizard /></div>
    </div>
  );
}
