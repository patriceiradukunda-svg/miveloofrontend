import { PaymentWizard } from '@/features/billing/BillingWizard';
export const metadata = { title: 'Make a payment' };
export default async function Page({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  const { ref } = await searchParams;
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-semibold text-teal-dark">Make a payment</h1>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8"><PaymentWizard reference={ref ?? ''} /></div>
    </div>
  );
}
