import { SubscriptionWizard } from '@/features/billing/BillingWizard';
export const metadata = { title: 'Choose a plan' };
export default function Page() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold text-teal-dark">Choose a plan</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">The core marketplace has no platform access fee. Advanced services are optional and clearly labelled.</p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8"><SubscriptionWizard /></div>
    </div>
  );
}
