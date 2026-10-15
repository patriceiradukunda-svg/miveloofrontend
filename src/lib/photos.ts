import manifest from '@/generated/photos.json';

export const PHOTO_FILES = {
  schoolMeal: '01_school_children_school_meal.jpg', womenHarvest: '02_rwanda_women_harvesting_vegetables.jpg',
  digitalFarmer: '03_farmer_smartphone_digital_agriculture.jpg', coopMaize: '04_rwanda_cooperative_maize_farming.jpg',
  agritech: '05_rwanda_farmers_agritech_iot.png', market: '06_kigali_market_fresh_produce.jpg',
  logistics: '07_rwanda_produce_delivery_logistics.jpg', storage: '08_rwanda_grain_storage_warehouse.jpg',
  womenCoop: '09_rwanda_women_cooperative_farmers.jpg', hills: '10_rwanda_hills_agricultural_landscape.jpg',
  schoolKitchen: '11_rwanda_school_kitchen_food_preparation.jpg', trainingKitchen: '12_rwanda_school_culinary_kitchen.jpg',
} as const;
export type PhotoKey = keyof typeof PHOTO_FILES;

export const PHOTO_CREDITS: Record<PhotoKey, string> = {
  schoolMeal: 'Rwanda Ministry of Education / RISA', womenHarvest: 'Africa-Press Rwanda', digitalFarmer: 'We Are Tech Africa',
  coopMaize: 'Food4Transformation', agritech: 'Faminga', market: 'Africa-Press Rwanda', logistics: 'Vision Media Rwanda',
  storage: 'Africa-Press Rwanda', womenCoop: 'Sucafina', hills: 'Unique Rwanda Vacation Experts',
  schoolKitchen: 'World Food Programme', trainingKitchen: 'Singita',
};
const present = new Set<string>(manifest as string[]);
export function photoSrc(k: PhotoKey): string | null {
  const f = PHOTO_FILES[k]; return present.has(f) ? `/images/photos/${f}` : null;
}
export function getPhotoMap(): Record<PhotoKey, string | null> {
  return Object.fromEntries((Object.keys(PHOTO_FILES) as PhotoKey[]).map((k) => [k, photoSrc(k)])) as Record<PhotoKey, string | null>;
}
