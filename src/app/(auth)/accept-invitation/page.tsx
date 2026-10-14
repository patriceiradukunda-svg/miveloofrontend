import Link from 'next/link';
export const metadata = { title: 'Accept your invitation' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Accept your invitation</h1><p className="mb-5 text-ink-soft">Your organisation invited you to Miveloo. Open your invitation link to continue, then set a password and complete your profile.</p><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
