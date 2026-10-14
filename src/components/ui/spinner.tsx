export function Spinner({ label = 'Loading' }: { label?: string }) {
  return <span role="status" className="inline-flex items-center gap-2 text-sm"><span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-teal border-t-transparent" />{label}</span>;
}
