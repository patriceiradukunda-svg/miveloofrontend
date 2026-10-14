import Image from 'next/image';
import Link from 'next/link';
export function Logo({ className = 'h-12 w-auto', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label="Miveloo home" className="inline-flex shrink-0">
      <Image src="/logo.png" alt="Miveloo" width={640} height={546} priority={priority} className={className} />
    </Link>
  );
}
