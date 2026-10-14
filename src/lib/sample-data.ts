import type { PublicProduct, PublicSupplier } from '@/types/product';

// SAMPLE DATA ONLY. These are not real suppliers, prices, or transactions.
export const sampleSuppliers: PublicSupplier[] = [
  { id: 'sup-sample-1', name: 'Sample Hillside Farm', kind: 'individual', about: 'Example profile showing how a smallholder supplier presents their business.', categories: ['vegetables', 'tubers'], operatingArea: 'Musanze', verified: false, isSample: true },
  { id: 'sup-sample-2', name: 'Sample Cooperative', kind: 'group', about: 'Example cooperative profile. Real groups show members\' combined, confirmed stock only.', categories: ['grains', 'legumes'], operatingArea: 'Nyagatare', verified: false, isSample: true },
  { id: 'sup-sample-3', name: 'Sample Fresh Traders', kind: 'individual', about: 'Example trader profile covering fruit and dairy.', categories: ['fruits', 'dairy-eggs'], operatingArea: 'Kigali', verified: false, isSample: true },
];
const p = (id: string, name: string, category: PublicProduct['category'], unit: string, price: number | null, qty: number | null, availability: PublicProduct['availability'], district: string, supplierId: string, emoji: string, quality: string): PublicProduct => ({
  id, name, description: `${name}: example listing for demonstration. Real descriptions are written by suppliers.`, category, unit, indicativePriceRWF: price, availableQuantity: qty, availability, district, quality, supplierId, isSample: true, emoji,
});
export const sampleProducts: PublicProduct[] = [
  p('prd-1', 'Maize flour', 'grains', 'kg', 650, 2000, 'in-stock', 'Nyagatare', 'sup-sample-2', '🌽', 'Seller-stated: milled this month'),
  p('prd-2', 'Dry beans', 'legumes', 'kg', 900, 1500, 'in-stock', 'Nyagatare', 'sup-sample-2', '🫘', 'Seller-stated: sorted and cleaned'),
  p('prd-3', 'Irish potatoes', 'tubers', 'kg', 420, 3000, 'in-stock', 'Musanze', 'sup-sample-1', '🥔', 'Seller-stated: Grade A'),
  p('prd-4', 'Cabbage', 'vegetables', 'head', 300, 400, 'limited', 'Musanze', 'sup-sample-1', '🥬', 'Seller-stated: harvested weekly'),
  p('prd-5', 'Carrots', 'vegetables', 'kg', 550, 800, 'seasonal', 'Musanze', 'sup-sample-1', '🥕', 'Seller-stated'),
  p('prd-6', 'Bananas', 'fruits', 'bunch', 2500, 120, 'limited', 'Kigali', 'sup-sample-3', '🍌', 'Seller-stated'),
  p('prd-7', 'Fresh milk', 'dairy-eggs', 'litre', 500, null, 'in-stock', 'Kigali', 'sup-sample-3', '🥛', 'Seller-stated: chilled'),
  p('prd-8', 'Rice', 'grains', 'kg', 1100, 1200, 'in-stock', 'Nyagatare', 'sup-sample-2', '🍚', 'Seller-stated'),
];
export const CATEGORY_LABEL: Record<string, string> = {
  grains: 'Grains', legumes: 'Legumes', vegetables: 'Vegetables', fruits: 'Fruits', tubers: 'Tubers', 'dairy-eggs': 'Dairy & eggs', protein: 'Protein',
};
