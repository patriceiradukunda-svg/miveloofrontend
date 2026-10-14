export type Category = 'grains' | 'legumes' | 'vegetables' | 'fruits' | 'tubers' | 'dairy-eggs' | 'protein';
export type Availability = 'in-stock' | 'limited' | 'seasonal';

/** Public shape: only fields a supplier has chosen to publish. No contact details, no school data. */
export interface PublicProduct {
  id: string; name: string; description: string; category: Category; unit: string;
  indicativePriceRWF: number | null; availableQuantity: number | null; availability: Availability;
  district: string; quality: string; supplierId: string; isSample: boolean; emoji: string;
}
export interface PublicSupplier {
  id: string; name: string; kind: 'individual' | 'group'; about: string; categories: Category[];
  operatingArea: string; verified: boolean; isSample: boolean;
}
