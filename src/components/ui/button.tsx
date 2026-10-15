import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger';
type Size = 'md' | 'sm';
const styles: Record<Variant, string> = {
  primary: 'bg-teal text-cream hover:bg-teal-dark',
  secondary: 'border-2 border-teal text-teal hover:bg-teal-tint',
  gold: 'bg-gold text-ink hover:bg-gold-dark hover:text-white',
  ghost: 'text-teal hover:bg-teal-tint',
  danger: 'bg-red text-white hover:bg-red-dark',
};
const sizes: Record<Size, string> = { md: 'min-h-12 px-6 text-[0.95rem]', sm: 'min-h-11 px-4 text-sm' };
const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

type Common = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };
export function Button({ variant = 'primary', size = 'md', className, ...p }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(base, sizes[size], styles[variant], className)} {...p} />;
}
export function ButtonLink({ variant = 'primary', size = 'md', className, href, children }: Common & { href: string }) {
  return <Link href={href} className={cn(base, sizes[size], styles[variant], className)}>{children}</Link>;
}
