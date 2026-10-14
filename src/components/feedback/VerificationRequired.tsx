import { ButtonLink } from '@/components/ui/button';
export function VerificationRequired() {
  return <div className="mx-auto max-w-xl rounded-2xl bg-gold-tint p-8 text-center"><p aria-hidden className="text-4xl">🔒</p><h1 className="mt-2 text-2xl font-semibold">Verification needed</h1><p className="mt-2 text-ink-soft">Your school must be verified before you can use purchasing tools. Public browsing is always open.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><ButtonLink href="/school/profile">Check verification status</ButtonLink><ButtonLink variant="secondary" href="/marketplace">Browse public listings</ButtonLink></div></div>;
}
