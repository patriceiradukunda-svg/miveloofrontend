import { notFound } from 'next/navigation';

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  // Sample order IDs are not real records. Do not render fabricated order details.
  if (orderId.startsWith('ORD-SAMPLE-')) notFound();

  // A real authenticated order-detail endpoint is not wired to this page yet.
  notFound();
}
