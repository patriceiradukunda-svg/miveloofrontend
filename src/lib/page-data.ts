import type { Row } from '@/components/kit/types';

/**
 * The single place where designed pages get their records.
 * Return rows shaped like the page's columns in src/config/page-specs.ts (pipeline pages: { stage, title, sub, meta }).
 * Until a module is wired to the backend this returns an empty list and the page shows its designed empty state.
 */
export async function loadRows(id: string): Promise<Row[]> {
  void id;
  return [];
}
