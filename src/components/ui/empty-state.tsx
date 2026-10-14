import { ButtonLink } from './button';
export function EmptyState({ title, body, action }: { title: string; body: string; action?: { href: string; label: string } }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-white/60 p-8 text-center">
      <p aria-hidden className="text-3xl">🌱</p>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-ink-soft">{body}</p>
      {action && <div className="mt-4"><ButtonLink href={action.href} variant="secondary">{action.label}</ButtonLink></div>}
    </div>
  );
}
