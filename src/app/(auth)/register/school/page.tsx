import { RegistrationForm } from '@/features/auth/components/RegistrationForm';
import { registrationTitle } from '@/features/auth/registration-info';
export const metadata = { title: registrationTitle('school') };
export default function Page() { return <><h1 className="mb-4 text-3xl font-semibold text-teal-dark">{registrationTitle('school')}</h1><RegistrationForm type="school" /></>; }
