import { ButtonLink } from '@/components/ui/button';
export default function NotFound() {
  return <div className="container-page py-24 text-center"><p aria-hidden className="text-5xl">🥕</p><h1 className="mt-2 text-3xl font-semibold">We could not find that page</h1><p className="mt-2 text-ink-soft">It may have moved, or the link may be wrong.</p><div className="mt-6 flex justify-center gap-3"><ButtonLink href="/">Go home</ButtonLink><ButtonLink href="/marketplace" variant="secondary">Browse marketplace</ButtonLink></div></div>;
}
