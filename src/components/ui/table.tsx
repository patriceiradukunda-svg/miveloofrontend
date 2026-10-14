import { cn } from '@/lib/utils';
/** Scrolls inside its own container so the page never scrolls sideways on phones. */
export function Table({ caption, className, children }: { caption: string; className?: string; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white" tabIndex={0} role="region" aria-label={caption}>
      <table className={cn('w-full min-w-[34rem] text-left text-sm', className)}>
        <caption className="sr-only">{caption}</caption>{children}
      </table>
    </div>
  );
}
export const Th = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => <th scope="col" className="bg-cream-deep px-4 py-3 font-bold" {...p} />;
export const Td = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => <td className="border-t border-ink/10 px-4 py-3" {...p} />;
