import Link from 'next/link';
export const metadata = { title: 'Two-step verification' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Two-step verification</h1><p className="mb-5 text-ink-soft">Two-step verification is in development. When enabled for your account, you will enter a code here.</p><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
