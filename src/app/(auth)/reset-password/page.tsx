import Link from 'next/link';
export const metadata = { title: 'Choose a new password' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Choose a new password</h1><p className="mb-5 text-ink-soft">Open the link from your email to set a new password. The link works once and expires.</p><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
