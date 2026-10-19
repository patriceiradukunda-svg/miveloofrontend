import type { Place } from '@/lib/places';

export type Availability = 'in-stock' | 'limited' | 'seasonal';
export type ListingStatus = 'draft' | 'published' | 'unpublished' | 'unknown';

export interface MarketItem {
  id: string;
  supplierId: string;
  name: string;
  category: string;
  price: number | null;
  unit: string;
  qty: number | null;
  minOrder?: number;
  photos: string[];
  place: Place | null;
  supplier: {
    name: string | null;
    kind: 'individual' | 'group' | null;
    verified: boolean | null;
  };
  description: string | null;
  quality: string[];
  delivery: { mode: 'pickup' | 'deliver' | 'both'; radiusKm?: number } | null;
  leadDays: number | null;
  listedDaysAgo: number | null;
  availability: Availability | null;
  isSample: boolean;
}

export interface SupplierListing extends MarketItem {
  status: ListingStatus;
}
