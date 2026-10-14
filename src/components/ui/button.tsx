import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger';
const styles: Record<Variant, string> = {
  primary: 'bg-teal text-cream hover:bg-teal-dark',
  secondary: 'border-2 border-teal text-teal hover:bg-teal-tint',
  gold: 'bg-gold text-ink hover:bg-gold-dark hover:text-white',
  ghost: 'text-teal hover:bg-teal-tint',
  danger: 'bg-red text-white hover:bg-red-dark',
};
const base = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

type Common = { variant?: Variant; className?: string; children: React.ReactNode };
export function Button({ variant = 'primary', className, ...p }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, styles[variant], className)} {...p} />;
}
export function ButtonLink({ variant = 'primary', className, href, children }: Common & { href: string }) {
  return <Link href={href} className={cn(base, styles[variant], className)}>{children}</Link>;
}
