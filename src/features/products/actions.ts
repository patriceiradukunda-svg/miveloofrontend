"use server";
import { ApiError, addLot, createListing, editListing, setListingImages, uploadImage } from '@/lib/miveloo-client';
import { messageOf, withBackendToken } from '@/lib/server/backend-session';

// The backend measures in these units; the form accepts friendly words and we translate.
const UNIT_MAP: Record<string, string> = { kg: 'kg', kilo: 'kg', kilogram: 'kg', g: 'g', gram: 'g', tonne: 'tonne', ton: 'tonne', l: 'l', litre: 'l', liter: 'l', ml: 'ml', piece: 'piece', pieces: 'piece', bunch: 'piece', head: 'piece', tray: 'piece', sack: 'piece', dozen: 'dozen' };
export const normalizeUnit = (u: string) => UNIT_MAP[u.trim().toLowerCase()];

export type SaveListingResult = { ok: true; listingId: string; status: string; photos: number } | { ok: false; error: string };

/**
 * Create or edit a listing and attach photos. FormData fields: listingId?, foodId, title, unit, price, minOrder?, quantity?, keepImageIds? (comma list), photos (files).
 * Everything is written to the backend database; photos are stored in the database by the backend.
 */
export async function saveListingAction(fd: FormData): Promise<SaveListingResult> {
  const listingId = String(fd.get('listingId') ?? '') || undefined;
  const foodId = String(fd.get('foodId') ?? '');
  const title = String(fd.get('title') ?? '').trim();
  const unit = normalizeUnit(String(fd.get('unit') ?? ''));
  const price = String(fd.get('price') ?? '').replace(/[,\s]/g, '');
  const minOrder = String(fd.get('minOrder') ?? '').replace(/[,\s]/g, '') || '1';
  const quantity = String(fd.get('quantity') ?? '').replace(/[,\s]/g, '');
  const keep = String(fd.get('keepImageIds') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const files = fd.getAll('photos').filter((f): f is File => typeof f !== 'string' && f.size > 0);

  if (!listingId && !foodId) return { ok: false, error: 'Choose the catalogue food this listing is for.' };
  if (title.length < 2) return { ok: false, error: 'Enter a product name.' };
  if (!unit) return { ok: false, error: 'Unit must be one of: kg, g, tonne, litre, ml, piece (bunch, head, tray), dozen.' };
  if (!price || !(Number(price) > 0)) return { ok: false, error: 'Enter a price greater than zero.' };
  if (files.some((f) => f.size > 1_500_000)) return { ok: false, error: 'Each photo must be under 1.5 MB. Please resize it first.' };

  try {
    return await withBackendToken(async (t) => {
      let id = listingId;
      let status = 'updated';
      if (id) {
        const l = await editListing(t, id, { title, unit_price: price, min_order_qty: minOrder });
        status = l.status;
      } else {
        const l = await createListing(t, { food_id: foodId, title, unit, unit_price: price, min_order_qty: minOrder });
        id = l.id; status = l.status;
        if (Number(quantity) > 0) await addLot(t, { food_id: foodId, listing_id: id, unit, quantity });
      }
      let photos = 0;
      if (files.length || fd.has('keepImageIds')) {
        const ids = [...keep];
        for (const f of files) { ids.push((await uploadImage(t, f)).id); photos += 1; }
        await setListingImages(t, id as string, ids);
      }
      return { ok: true as const, listingId: id as string, status, photos };
    });
  } catch (e) {
    return { ok: false, error: e instanceof ApiError && e.status === 422 ? e.message : messageOf(e) };
  }
}
