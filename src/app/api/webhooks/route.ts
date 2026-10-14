// Payment/provider webhooks MUST verify the provider's signature server-side before acting.
export async function POST() {
  return Response.json({ message: 'Webhook handling not configured' }, { status: 501 });
}
