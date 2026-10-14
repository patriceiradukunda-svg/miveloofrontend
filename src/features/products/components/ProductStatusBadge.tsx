const S = { draft: '✎ Draft', published: '● Published', paused: '⏸ Paused', archived: '⊘ Archived' } as const;
export function ProductStatusBadge({ status }: { status: keyof typeof S }) { return <span className="rounded-full bg-cream-deep px-2.5 py-1 text-xs font-bold">{S[status]}</span>; }
