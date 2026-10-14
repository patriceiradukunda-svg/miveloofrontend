import { EmailOnlyForm } from '@/features/auth/components/EmailOnlyForm';
import Link from 'next/link';
export const metadata = { title: 'Forgot your password?' };
export default function Page() { return <><h1 className="mb-3 text-3xl font-semibold text-teal-dark">Forgot your password?</h1><p className="mb-5 text-ink-soft">Enter your email and, if an account exists, we will send a reset link.</p><EmailOnlyForm endpoint="/auth/forgot-password" cta="Send reset link" doneText="If an account exists for that email, a reset link is on its way." /><p className="mt-6 text-sm"><Link className="underline" href="/login">Back to sign in</Link></p></>; }
