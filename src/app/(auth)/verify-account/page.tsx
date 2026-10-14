import Link from 'next/link';
export const metadata = { title: 'Verify your account' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Verify your account</h1><p className="mb-5 text-ink-soft">Open the verification link we emailed you. Verifying your email is the first step; schools, suppliers and institutions may also need organisation checks.</p><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
