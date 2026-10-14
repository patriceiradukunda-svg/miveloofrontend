import { RegistrationForm } from '@/features/auth/components/RegistrationForm';
import { registrationTitle } from '@/features/auth/registration-info';
export const metadata = { title: registrationTitle('cooperative') };
export default function Page() { return <><h1 className="mb-4 text-3xl font-semibold text-teal-dark">{registrationTitle('cooperative')}</h1><RegistrationForm type="cooperative" /></>; }
