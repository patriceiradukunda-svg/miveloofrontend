import Link from 'next/link';
export const metadata = { title: 'Your session expired' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Your session expired</h1><p className="mb-5 text-ink-soft">For your security you were signed out. Please sign in again to continue.</p><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
