import { RegistrationWizard } from '@/features/auth/components/RegistrationWizard';
import { registrationTitle } from '@/features/auth/registration-info';
export const metadata = { title: registrationTitle('institution') };
export default function Page() { return <><h1 className="mb-4 text-3xl font-semibold text-teal-dark">{registrationTitle('institution')}</h1><RegistrationWizard type="institution" /></>; }
