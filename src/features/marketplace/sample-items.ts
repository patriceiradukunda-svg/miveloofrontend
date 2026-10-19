// SAMPLE listings. Not real suppliers, prices or stock. Photos are generic stock images, not the actual products.
import { PLACES, type PlaceKey } from './sample-places';
import type { MarketItem, SupplierListing, ListingStatus } from './types';

const PH = '/images/miveloo-photos/';
const photos = (...n: string[]) => n.map((x) => `${PH}${x}.jpg`);
type Seed = [id: string, name: string, cat: string, price: number | null, unit: string, qty: number | null, min: number, place: PlaceKey, who: string, kind: 'individual' | 'group', mode: 'pickup' | 'deliver' | 'both', radius: number, lead: number, ago: number, av: MarketItem['availability'], pics: string[], quality: string[], desc: string];
const SEEDS: Seed[] = [
  ['m-01', 'White maize flour', 'cereals', 650, 'kg', 2000, 50, 'abatuje', 'Sample Cooperative A', 'group', 'both', 40, 2, 0, 'in-stock', photos('10-grains-legumes-bowls', '12-produce-flatlay'), ['Freshly milled'], 'Fine white maize flour, milled this week.'],
  ['m-02', 'Climbing beans', 'pulses', 900, 'kg', 1500, 25, 'amariza', 'Sample Farm B', 'individual', 'pickup', 0, 1, 1, 'in-stock', photos('10-grains-legumes-bowls', '01-market-baskets-produce'), ['Sorted and cleaned'], 'Dry climbing beans, sorted by hand.'],
  ['m-03', 'Fresh tomatoes', 'vegetables', 700, 'kg', 300, 10, 'kibagabaga', 'Sample Farm C', 'individual', 'deliver', 15, 1, 0, 'limited', photos('11-tomatoes-closeup', '04-vendor-tomatoes-stall'), ['Harvested daily'], 'Ripe tomatoes picked that morning.'],
  ['m-04', 'Orange sweet potatoes', 'roots', 450, 'kg', 800, 20, 'nyagatovu', 'Sample Farm D', 'individual', 'both', 20, 2, 2, 'in-stock', photos('08-root-vegetables', '12-produce-flatlay'), ['Grade A'], 'Orange-fleshed sweet potatoes, washed.'],
  ['m-05', 'Irish potatoes', 'roots', 420, 'kg', 3000, 100, 'remera', 'Sample Cooperative E', 'group', 'deliver', 30, 3, 3, 'in-stock', photos('08-root-vegetables', '01-market-baskets-produce'), ['Grade A'], 'Table potatoes in 50 kg sacks.'],
  ['m-06', 'Cabbage', 'vegetables', 300, 'piece', 400, 20, 'gisozi', 'Sample Farm F', 'individual', 'both', 25, 1, 1, 'limited', photos('14-farmer-cabbage', '05-farmer-harvesting-greens'), ['Harvested weekly'], 'Firm green cabbages, trimmed.'],
  ['m-07', 'Hen eggs', 'eggs', 4500, 'tray (30 eggs)', 120, 5, 'kicukiro', 'Sample Poultry G', 'individual', 'deliver', 20, 1, 0, 'in-stock', [], ['Collected daily'], 'Brown hen eggs, graded by size.'],
  ['m-08', 'Bananas', 'bananas', 2500, 'bunch', 120, 5, 'kicukiro', 'Sample Farm H', 'individual', 'both', 20, 2, 4, 'limited', photos('09-bananas-plantains', '01-market-baskets-produce'), ['Seller-stated'], 'Cooking and eating bananas by the bunch.'],
  ['m-09', 'Carrots', 'roots', 550, 'kg', 800, 25, 'musanze', 'Sample Cooperative I', 'group', 'deliver', 150, 4, 5, 'seasonal', photos('08-root-vegetables', '05-farmer-harvesting-greens'), ['Grade A'], 'Crisp carrots from volcanic soil.'],
  ['m-10', 'Fresh milk', 'dairy', 500, 'litre', 600, 20, 'nyagatare', 'Sample Dairy J', 'group', 'deliver', 200, 1, 0, 'in-stock', [], ['Chilled'], 'Chilled fresh cow milk, delivered daily.'],
  ['m-11', 'Rice', 'cereals', 1100, 'kg', 1200, 50, 'nyagatare', 'Sample Cooperative K', 'group', 'deliver', 200, 5, 6, 'in-stock', photos('10-grains-legumes-bowls', '01-market-baskets-produce'), ['Milled this season'], 'Long-grain white rice in 50 kg bags.'],
  ['m-12', 'Green peas', 'pulses', 1200, 'kg', 200, 10, 'huye', 'Sample Farm L', 'individual', 'pickup', 0, 3, 7, 'limited', photos('05-farmer-harvesting-greens', '12-produce-flatlay'), ['Fresh'], 'Shelled green peas, packed the same day.'],
  ['m-13', 'Avocados', 'fruits', 800, 'kg', 300, 10, 'rubavu', 'Sample Farm M', 'individual', 'deliver', 100, 3, 8, 'seasonal', photos('12-produce-flatlay', '01-market-baskets-produce'), ['Seller-stated'], 'Creamy avocados, hand picked.'],
  ['m-14', 'Sorghum flour', 'cereals', 800, 'kg', 500, 25, 'huye', 'Sample Cooperative N', 'group', 'both', 80, 4, 9, 'in-stock', photos('10-grains-legumes-bowls', '12-produce-flatlay'), ['Stone ground'], 'Wholegrain sorghum flour for porridge.'],
];
export const MARKET_ITEMS: MarketItem[] = SEEDS.map(([id, name, category, price, unit, qty, minOrder, place, who, kind, mode, radiusKm, leadDays, listedDaysAgo, availability, pics, quality, description]) => ({
  id, name, category, price, unit, qty, minOrder, place: PLACES[place], photos: pics, supplier: { name: who, kind, verified: false }, description, quality,
  delivery: { mode, radiusKm: radiusKm || undefined }, leadDays, listedDaysAgo, availability, isSample: true,
}));

/** The signed-in supplier's own listings. Ids match the existing edit page (/supplier/products/[id]). */
const MINE: [string, string, string, number, string, number, ListingStatus, string[], number][] = [
  ['prd-1', 'Maize flour', 'cereals', 650, 'kg', 2000, 'published', photos('10-grains-legumes-bowls', '12-produce-flatlay'), 2],
  ['prd-2', 'Dry beans', 'pulses', 900, 'kg', 1500, 'published', photos('10-grains-legumes-bowls'), 5],
  ['prd-3', 'Irish potatoes', 'roots', 420, 'kg', 3000, 'published', photos('08-root-vegetables', '01-market-baskets-produce'), 6],
  ['prd-4', 'Cabbage', 'vegetables', 300, 'piece', 400, 'draft', photos('14-farmer-cabbage'), 0],
  ['prd-5', 'Carrots', 'roots', 550, 'kg', 800, 'unpublished', photos('08-root-vegetables', '05-farmer-harvesting-greens'), 20],
  ['prd-6', 'Bananas', 'bananas', 2500, 'bunch', 120, 'published', photos('09-bananas-plantains', '01-market-baskets-produce'), 9],
  ['prd-7', 'Fresh milk', 'dairy', 500, 'litre', 0, 'draft', [], 1],
  ['prd-8', 'Rice', 'cereals', 1100, 'kg', 1200, 'unpublished', photos('10-grains-legumes-bowls'), 30],
];
export const MY_LISTINGS: SupplierListing[] = MINE.map(([id, name, category, price, unit, qty, status, pics, ago]) => ({
  id, name, category, price, unit, qty, status, photos: pics, place: PLACES.amariza, supplier: { name: 'You', kind: 'individual', verified: false },
  description: `${name}: sample listing.`, quality: [], delivery: { mode: 'both', radiusKm: 30 }, listedDaysAgo: ago, availability: qty === 0 ? 'seasonal' : 'in-stock', isSample: true,
}));
