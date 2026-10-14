export function usePagination(total: number, pageSize: number, page: number) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return { pages, hasPrev: page > 1, hasNext: page < pages, offset: (page - 1) * pageSize };
}
