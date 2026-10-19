import type { Place } from '@/lib/places';

export type Availability = 'in-stock' | 'limited' | 'seasonal';
export type ListingStatus = 'draft' | 'published' | 'unpublished';
export interface MarketItem {
  id: string; name: string; category: string; price: number | null; unit: string; qty: number | null; minOrder?: number;
  photos: string[]; place: Place; supplier: { name: string; kind: 'individual' | 'group'; verified: boolean };
  description: string; quality: string[]; delivery: { mode: 'pickup' | 'deliver' | 'both'; radiusKm?: number }; leadDays?: number;
  listedDaysAgo: number; availability: Availability; isSample: boolean;
}
export interface SupplierListing extends MarketItem { status: ListingStatus }
