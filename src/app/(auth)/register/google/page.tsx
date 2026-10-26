import { redirect } from 'next/navigation';

/** A Google sign-in with no account lands here. Supplier sign-up is the default and picks up the pending Google identity itself. */
export default function GoogleSignupPage() { redirect('/register/supplier'); }
