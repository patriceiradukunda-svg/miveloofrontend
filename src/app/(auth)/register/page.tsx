import { redirect } from 'next/navigation';

/** Supplier is the default account type. The full chooser lives at /register/choose. */
export default function Register() { redirect('/register/supplier'); }
