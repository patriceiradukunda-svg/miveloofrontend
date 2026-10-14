import { Logo } from '@/components/layout/Logo';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream-deep">
      <header className="container-page flex items-center justify-between py-3"><Logo className="h-14 w-auto" priority /><LanguageSwitcher /></header>
      <main id="main" tabIndex={-1} className="container-page max-w-xl pb-16 pt-6"><div className="rise rounded-3xl bg-white p-6 shadow-card sm:p-8">{children}</div></main>
    </div>
  );
}
