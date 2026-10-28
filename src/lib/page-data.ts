import type { Row } from '@/components/kit/types';
import { api, getFood, liveApi } from '@/lib/miveloo-client';
import { withBackendToken } from '@/lib/server/backend-session';

/**
 * The single place where designed pages get their records.
 * Return rows shaped like the page's columns in src/config/page-specs.ts (pipeline pages: { stage, title, sub, meta }).
 * A page that is not wired yet, or any API failure, returns an empty list and the page shows its designed empty state.
 */
const CAREERS_ADMIN = '/admin/careers';

type Raw = Record<string, unknown>;
const pick = (o: Raw, ...keys: string[]) => { for (const k of keys) { const v = o[k]; if (v !== undefined && v !== null && v !== '') return v; } return undefined; };
const day = (v: unknown) => (typeof v === 'string' ? v.slice(0, 10) : undefined);

function stageOf(status: unknown): string {
  const v = String(status ?? '').toLowerCase();
  if (/hire|accept|start/.test(v)) return 'Hired';
  if (/reject|declin|withdraw|not.?select|unsuccess/.test(v)) return 'Rejected';
  if (/offer/.test(v)) return 'Offer';
  if (/interview/.test(v)) return 'Interview';
  if (/screen|review|shortlist|assess|progress/.test(v)) return 'Screening';
  return 'New';
}

async function applications(): Promise<Raw[]> {
  const r = await withBackendToken((token) => api<{ items?: Raw[] }>(`${CAREERS_ADMIN}/applications?limit=100`, { token, cache: 'no-store' }));
  return Array.isArray(r?.items) ? r.items : [];
}

async function supplierStock(): Promise<Row[]> {
  const lots = await withBackendToken((token) => api<Raw[]>('/inventory/lots?limit=50', { token, cache: 'no-store' }));
  if (!Array.isArray(lots)) return [];
  const ids = [...new Set(lots.map((l) => String(l.food_id)))].slice(0, 50);
  const names = new Map<string, string>();
  (await Promise.allSettled(ids.map((id) => getFood(id)))).forEach((res, i) => { if (res.status === 'fulfilled') names.set(ids[i]!, res.value.name); });
  const soon = Date.now() + 7 * 864e5;
  return lots.map((l) => {
    const onHand = Number(l.on_hand) || 0, available = Number(l.available) || 0;
    const exp = typeof l.expires_on === 'string' ? Date.parse(l.expires_on) : NaN;
    const status = available <= 0 ? 'Out of stock' : !Number.isNaN(exp) && exp <= soon ? 'Expiring' : available < onHand * 0.2 ? 'Low' : 'In stock';
    return { product: names.get(String(l.food_id)) ?? 'Product', lot: String(l.id).slice(0, 8), onHand, reserved: Number(l.reserved) || 0, available, bestBefore: day(l.expires_on), status };
  });
}

async function ordersRaw(): Promise<Raw[]> {
  const r = await withBackendToken((token) => api<Raw[]>('/orders?limit=100', { token, cache: 'no-store' }));
  return Array.isArray(r) ? r : [];
}
// Exact backend order statuses first: `in_delivery` contains "deliver", which the loose matching below used to read as Delivered.
const ORDER_LABEL: Record<string, string> = { draft: 'Placed', placed: 'Placed', confirmed: 'Confirmed', in_delivery: 'In transit', delivered: 'Delivered', cancelled: 'Cancelled', disputed: 'Disputed' };
const SUPPLIER_STAGE: Record<string, string> = { draft: 'New', placed: 'New', confirmed: 'Confirmed', in_delivery: 'Dispatched', delivered: 'Delivered', disputed: 'Disputed' };
function orderStatus(s: unknown): string {
  const v = String(s ?? '').toLowerCase();
  const exact = ORDER_LABEL[v];
  if (exact) return exact;
  if (/cancel|reject|declin/.test(v)) return 'Cancelled';
  if (/disput/.test(v)) return 'Disputed';
  if (/deliver|receiv|complet|closed/.test(v)) return 'Delivered';
  if (/dispatch|transit|ship/.test(v)) return 'In transit';
  if (/confirm|accept/.test(v)) return 'Confirmed';
  if (/draft|place|submit|new/.test(v)) return 'Placed';
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Placed';
}
function supplierStage(s: unknown): string {
  const v = String(s ?? '').toLowerCase();
  const exact = SUPPLIER_STAGE[v];
  if (exact) return exact;
  if (/disput/.test(v)) return 'Disputed';
  if (/deliver|receiv|complet|closed/.test(v)) return 'Delivered';
  if (/dispatch|transit|ship/.test(v)) return 'Dispatched';
  if (/prepar|pack|process/.test(v)) return 'Preparing';
  if (/confirm|accept/.test(v)) return 'Confirmed';
  return 'New';
}

export async function loadRows(id: string): Promise<Row[]> {
  if (!liveApi) return [];
  try {
    switch (id) {
      case 'admin/careers/applications':
        return (await applications()).map((a) => ({
          stage: stageOf(a.status),
          title: String(pick(a, 'full_name', 'name') ?? 'Applicant'),
          sub: String(pick(a, 'job_title') ?? ''),
          meta: [pick(a, 'reference'), day(pick(a, 'created_at', 'applied_at'))].filter(Boolean).join(' · '),
        }));
      case 'admin/careers/candidates':
        return (await applications()).map((a) => ({
          name: String(pick(a, 'full_name', 'name') ?? 'Applicant'),
          role: String(pick(a, 'job_title') ?? ''),
          applied: day(pick(a, 'created_at', 'applied_at')),
          source: String(pick(a, 'source') ?? 'Website'),
          score: pick(a, 'rating') as number | undefined,
          stage: stageOf(a.status),
          location: String(pick(a, 'location') ?? ''),
        }));
      case 'supplier/inventory':
        return await supplierStock();
      case 'school/orders':
        return (await ordersRaw()).map((o) => ({ ref: String(o.id).slice(0, 8).toUpperCase(), total: Number(o.total_amount) || 0, status: orderStatus(o.status) }));
      case 'supplier/orders':
        return (await ordersRaw()).filter((o) => !/cancel|reject|declin/i.test(String(o.status))).map((o) => ({
          stage: supplierStage(o.status),
          title: 'Order ' + String(o.id).slice(0, 8).toUpperCase(),
          sub: `${(Number(o.total_amount) || 0).toLocaleString('en-GB')} ${String(o.currency ?? 'RWF')}`,
          meta: orderStatus(o.status),
        }));
      case 'admin/audit': {
        const r = await withBackendToken((token) => api<Raw[]>('/admin/audit?limit=100', { token, cache: 'no-store' }));
        return Array.isArray(r) ? r.map((e) => ({ time: day(e.at), actor: String(e.actor ?? '').slice(0, 8), action: String(e.action ?? ''), target: String(e.resource ?? ''), outcome: 'Success' })) : [];
      }
      default:
        return [];
    }
  } catch {
    return [];
  }
}
