import { EmailOnlyForm } from '@/features/auth/components/EmailOnlyForm';
import Link from 'next/link';
export const metadata = { title: 'Resend verification email' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Resend verification email</h1><p className="mb-5 text-ink-soft">We will send a new verification link if the account is waiting for verification.</p><EmailOnlyForm endpoint="/auth/resend-verification" cta="Resend email" doneText="If that account needs verification, a new link is on its way." /><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
