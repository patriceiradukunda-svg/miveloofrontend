import Link from 'next/link';
import { hasBackend } from '@/lib/api-client';

export function DemoAccess() {
  if (hasBackend) return null;

  return (
    <p role="status" className="mt-8 rounded-2xl bg-gold-tint p-4 text-sm">
      Demo sign-in is disabled. You can still{' '}
      <Link className="font-bold underline" href="/marketplace">
        browse the marketplace
      </Link>
      .
    </p>
  );
}
