import Link from 'next/link';
export const metadata = { title: 'Access denied' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Access denied</h1><p className="mb-5 text-ink-soft">Your account does not have permission to open that page. If you think this is a mistake, contact support.</p><a href="/app" className="font-bold underline">Go to your workspace</a><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
