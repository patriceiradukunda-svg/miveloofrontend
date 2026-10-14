import Link from 'next/link';
export const metadata = { title: 'Complete your profile' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Complete your profile</h1><p className="mb-5 text-ink-soft">Add the details we still need for your account type. You can finish later from Settings.</p><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
