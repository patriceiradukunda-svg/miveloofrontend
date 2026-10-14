export class ApiError extends Error {
  constructor(public status: number, message: string, public fieldErrors?: Record<string, string>) {
    super(message);
  }
}
export function friendlyError(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 401) return 'Your session has ended. Please sign in again.';
    if (e.status === 403) return 'You do not have permission to do that.';
    if (e.status >= 500) return 'Something went wrong on our side. Please try again in a moment.';
    return e.message;
  }
  return 'We could not reach Miveloo. Check your connection and try again.';
}
