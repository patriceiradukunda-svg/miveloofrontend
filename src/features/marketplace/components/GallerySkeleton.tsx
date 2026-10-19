import { Skeleton } from '@/components/ui/skeleton';
export function GallerySkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading">
      <div className="flex items-end justify-between"><Skeleton className="h-12 w-64" /><Skeleton className="h-12 w-40 rounded-full" /></div>
      <Skeleton className="h-12 w-full rounded-full" />
      <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className="space-y-3"><Skeleton className="aspect-[4/5] w-full" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>)}</div>
    </div>
  );
}
