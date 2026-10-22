import type { FeatureStatus } from './plans';

/**
 * Public pricing page data. Edit prices and features here; nothing else needs to change.
 *
 * STATUS = what is honestly true today, shown as a badge on every feature:
 *   'available'      works now
 *   'in-development' being built
 *   'planned'        not built yet
 *   'agreement'      needs a data-sharing agreement
 * When a feature goes live, change its status here (for example move a plan's list from 'planned' to 'available').
 *
 * Yearly price = monthly price x YEARLY_MONTHS (pay for 10 months, get 12). The saving is calculated, never typed.
 * Text is English; the page translates it with the keys below (price.<tier>.name, .for, .f1, .f2, ...).
 */
export const CURRENCY = '$';
export const YEARLY_MONTHS = 10;

export type TierId = 'free' | 'supplier' | 'school' | 'coop' | 'sector' | 'district' | 'national';
export type TierGroup = 'free' | 'suppliers' | 'schools' | 'groups' | 'institutions';
export interface Txt { key: string; en: string }
export interface TierFeature { id: string; text: Txt; status: FeatureStatus }
export interface Tier { id: TierId; group: TierGroup; name: Txt; forWho: Txt; monthly: number; features: TierFeature[] }

const list = (tier: TierId, status: FeatureStatus, items: string[]): TierFeature[] =>
  items.map((en, i) => ({ id: `f${i + 1}`, text: { key: `price.${tier}.f${i + 1}`, en }, status }));
const head = (tier: TierId, name: string, forWho: string): Pick<Tier, 'name' | 'forWho'> =>
  ({ name: { key: `price.${tier}.name`, en: name }, forWho: { key: `price.${tier}.for`, en: forWho } });

export const TIERS: Tier[] = [
  {
    id: 'free', group: 'free', monthly: 0, ...head('free', 'Free', 'For all users'),
    features: list('free', 'available', [
      'Browse, buy, and sell food',
      'List products and manage orders',
      'View order history',
      'Access basic historical dashboard data',
      'Manage basic product information',
    ]),
  },
  {
    id: 'supplier', group: 'suppliers', monthly: 5, ...head('supplier', 'Individual Supplier Pro', 'Farmers, producers, and traders'),
    features: list('supplier', 'planned', [
      'Everything in Free',
      'AI-assisted price recommendations',
      'Seasonal demand and price insights',
      'Stock and replenishment alerts',
      'Sales and business performance analytics',
      'Personalised business recommendations',
    ]),
  },
  {
    id: 'school', group: 'schools', monthly: 10, ...head('school', 'School Pro', 'Schools and school-feeding teams'),
    features: list('school', 'planned', [
      'Intelligent stock and expiry management',
      'Daily, weekly, and monthly meal planning',
      'Ingredient quantities based on learner numbers',
      'Food budget and cost-per-meal tracking',
      'Stock-out prediction and reorder recommendations',
      'Smart shopping lists and supplier comparisons',
      'Food waste monitoring and reduction insights',
      'Attendance-based meal-demand forecasting',
      'Procurement tracking and approval workflows',
      'Reports for stock, spending, meals, and suppliers',
    ]),
  },
  {
    id: 'coop', group: 'groups', monthly: 10, ...head('coop', 'Cooperative Pro', 'Agricultural cooperatives and supplier groups'),
    features: list('coop', 'planned', [
      'Member and production management',
      'Intelligent warehouse and stock tracking',
      'Harvest and supply forecasting',
      'Buyer demand and order management',
      'Market-price and selling-price insights',
      'Member supply aggregation and allocation',
      'Delivery planning and logistics cost estimates',
      'Spoilage, loss, and stock-discrepancy alerts',
      'Sales, costs, margins, and member payment tracking',
      'Buyer matching and cooperative performance reports',
    ]),
  },
  {
    id: 'sector', group: 'institutions', monthly: 25, ...head('sector', 'Sector Intelligence', 'Sector-level institutions'),
    features: list('sector', 'agreement', [
      'Aggregated food-market insights',
      'Local price and availability trends',
      'Supply-demand monitoring',
      'Early-warning alerts',
      'Sector-level reports and forecasts',
    ]),
  },
  {
    id: 'district', group: 'institutions', monthly: 45, ...head('district', 'District Intelligence', 'District authorities and development partners'),
    features: list('district', 'agreement', [
      'Cross-sector food intelligence',
      'Food price and supply risk alerts',
      'Demand and availability forecasts',
      'District analytics and reports',
      'Food-system planning support',
    ]),
  },
  {
    id: 'national', group: 'institutions', monthly: 100, ...head('national', 'National & Partner Intelligence', 'MINEDUC, government agencies, NGOs, and national partners'),
    features: list('national', 'agreement', [
      'National food-system dashboard',
      'Province-to-village analysis where data supports it',
      'National and regional forecasting',
      'Food-security and school-feeding indicators',
      'Advanced reports and scenario analysis',
      'Organisational access and customised services',
    ]),
  },
];

export const yearlyPrice = (monthly: number) => monthly * YEARLY_MONTHS;
export const yearlySaving = (monthly: number) => monthly * 12 - yearlyPrice(monthly);
export const freeMonths = 12 - YEARLY_MONTHS;
