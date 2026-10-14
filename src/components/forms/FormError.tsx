export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p role="alert" className="rounded-xl bg-red-tint px-4 py-3 text-sm font-semibold text-red-dark">⚠ {message}</p>;
}
