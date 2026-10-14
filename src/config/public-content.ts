import type { FeatureStatus } from './plans';
export interface PublicPage { title: string; lead: string; status: FeatureStatus | null; sections: [string, string[]][] }
export const publicContent: Record<string, PublicPage> = {
 "how-it-works": {
  "title": "How Miveloo works",
  "lead": "Four steps connect a school kitchen to the people who grow the food.",
  "status": "available",
  "sections": [
   [
    "1. Suppliers publish",
    [
     "Farmers, traders, distributors and cooperatives register, then list what they have: quantity, unit, price and general location.",
     "Only the details a supplier chooses to publish become public."
    ]
   ],
   [
    "2. Schools get verified",
    [
     "Schools register and are verified before they can order. Choosing \"School\" at sign-up does not grant buying access by itself."
    ]
   ],
   [
    "3. Schools order, suppliers respond",
    [
     "Verified schools compare offers and submit purchase orders. Suppliers accept, prepare and dispatch. Every change is recorded."
    ]
   ],
   [
    "4. Receive, record, learn",
    [
     "Schools confirm what arrived and record issues. Historical data in your own dashboard is free; advanced insights are optional."
    ]
   ]
  ]
 },
 "schools": {
  "title": "For schools",
  "lead": "Plan, buy and receive school food with a clear record of every decision.",
  "status": "available",
  "sections": [
   [
    "Available in the core marketplace",
    [
     "Private school marketplace (verified schools only)",
     "Purchase orders, status tracking and delivery confirmation",
     "Supplier directory and order history"
    ]
   ],
   [
    "Being built next",
    [
     "Meal and demand planning",
     "Procurement approvals and budgets",
     "Food inventory, wastage and replenishment",
     "School-to-school surplus exchange"
    ]
   ]
  ]
 },
 "institutions": {
  "title": "For institutions, NGOs and government partners",
  "lead": "Aggregated insight for programme monitoring, where data and agreements allow.",
  "status": "agreement",
  "sections": [
   [
    "What this will offer",
    [
     "Aggregated regional views, price analysis and supply-gap analysis",
     "Programme monitoring, custom reports and authorised exports",
     "Audit trail for sensitive activity"
    ]
   ],
   [
    "What we will always show",
    [
     "Data sources, coverage period, last update time, definitions and limitations.",
     "Miveloo will not claim to represent the whole Rwandan school food market unless coverage supports it."
    ]
   ],
   [
    "How to start",
    [
     "Institutional access needs organisation verification and a data-sharing agreement. Use the contact page to begin."
    ]
   ]
  ]
 },
 "ai-intelligence": {
  "title": "AI and data intelligence",
  "lead": "One shared intelligence layer, honest about what is working today and what is not.",
  "status": "in-development",
  "sections": [
   [
    "Status of capabilities",
    [
     "Historical price and order records in your dashboard: available when data exists",
     "Demand forecasts, shortage alerts, procurement suggestions: in development",
     "Conversational assistant: in development",
     "Institutional forecasting and scenario planning: planned, needs agreement"
    ]
   ],
   [
    "Principles",
    [
     "Predictions are estimates, never confirmed facts.",
     "The assistant explains its assumptions and says when data is insufficient.",
     "It never invents prices, quantities, suppliers, transactions or statistics.",
     "It respects your role, plan, organisation and data-access rights on every request.",
     "Features are evaluated for accuracy, fairness, privacy and harm before being presented as dependable."
    ]
   ]
  ]
 },
 "about": {
  "title": "About Miveloo",
  "lead": "A school food marketplace and food-system intelligence platform, starting in Rwanda.",
  "status": null,
  "sections": [
   [
    "Why we exist",
    [
     "School feeding depends on food reaching kitchens reliably. Miveloo helps schools find food, helps suppliers reach dependable markets, and uses data to reduce avoidable inefficiency."
    ]
   ]
  ]
 },
 "about/mission": {
  "title": "Mission",
  "lead": "Make school feeding more reliable.",
  "status": null,
  "sections": [
   [
    "Our commitments",
    [
     "Help schools access the food they need.",
     "Help suppliers reach reliable markets.",
     "Reduce avoidable inefficiency in purchasing and distribution.",
     "Support better-informed school-feeding decisions with honest data."
    ]
   ]
  ]
 },
 "impact": {
  "title": "Mission and impact",
  "lead": "We publish measured impact only when we have evidence.",
  "status": null,
  "sections": [
   [
    "Current status",
    [
     "Miveloo has no published impact figures yet. When we do, each number will show its source, period and method.",
     "Anything shown elsewhere labelled \"Sample data\" is illustrative and not a real transaction."
    ]
   ]
  ]
 },
 "help": {
  "title": "Help and support",
  "lead": "Guides to get started.",
  "status": null,
  "sections": [
   [
    "Getting started",
    [
     "Suppliers: register, complete verification, publish a listing.",
     "Schools: register, complete verification, then use the school marketplace.",
     "Forgot your password? Use the reset link on the sign-in page."
    ]
   ],
   [
    "Need a person?",
    [
     "Signed-in users can open support tickets from their workspace. Others can use the contact page."
    ]
   ]
  ]
 },
 "privacy": {
  "title": "Privacy policy",
  "lead": "Draft. Requires legal review before launch.",
  "status": "in-development",
  "sections": [
   [
    "Principles",
    [
     "We collect only what each account type needs.",
     "Public pages show only what suppliers choose to publish.",
     "School-level data is never public.",
     "Final policy text to be supplied by Miveloo legal counsel."
    ]
   ]
  ]
 },
 "terms": {
  "title": "Terms of service",
  "lead": "Draft. Requires legal review before launch.",
  "status": "in-development",
  "sections": [
   [
    "Placeholder",
    [
     "Final terms to be supplied by Miveloo legal counsel."
    ]
   ]
  ]
 },
 "cookies": {
  "title": "Cookie policy",
  "lead": "Draft. Requires legal review before launch.",
  "status": "in-development",
  "sections": [
   [
    "What we set",
    [
     "A language preference cookie and, when signed in, a session cookie. No advertising cookies. Analytics, if enabled, will be listed here."
    ]
   ]
  ]
 },
 "supplier-terms": {
  "title": "Supplier terms",
  "lead": "Draft. Requires legal review before launch.",
  "status": "in-development",
  "sections": [
   [
    "Placeholder",
    [
     "Final terms to be supplied by Miveloo legal counsel."
    ]
   ]
  ]
 },
 "school-terms": {
  "title": "School terms",
  "lead": "Draft. Requires legal review before launch.",
  "status": "in-development",
  "sections": [
   [
    "Placeholder",
    [
     "Final terms to be supplied by Miveloo legal counsel."
    ]
   ]
  ]
 },
 "data-ai-policy": {
  "title": "Data and AI policy",
  "lead": "Draft. Requires legal review before launch.",
  "status": "in-development",
  "sections": [
   [
    "Principles",
    [
     "Aggregated or anonymised views wherever possible.",
     "Sensitive data only for authorised users under agreement.",
     "AI output is labelled as estimate or recommendation."
    ]
   ]
  ]
 }
};
