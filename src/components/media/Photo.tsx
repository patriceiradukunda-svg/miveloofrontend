import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PHOTO_CREDITS, photoSrc, type PhotoKey } from '@/lib/photos';

/** Renders the real photo when it exists; otherwise the supplied illustration. Credit is always shown. */
export function Photo({ k, alt, className, sizes, priority, fallback }: { k: PhotoKey; alt: string; className?: string; sizes?: string; priority?: boolean; fallback: React.ReactNode }) {
  const src = photoSrc(k);
  if (!src) return <>{fallback}</>;
  return (
    <figure className={cn('relative overflow-hidden', className)}>
      <Image src={src} alt={alt} fill sizes={sizes ?? '(min-width:1024px) 50vw, 100vw'} priority={priority} className="object-cover" />
      <figcaption className="absolute bottom-0 right-0 rounded-tl-lg bg-ink/70 px-2 py-0.5 text-[10px] text-cream">Photo: {PHOTO_CREDITS[k]}</figcaption>
    </figure>
  );
}
