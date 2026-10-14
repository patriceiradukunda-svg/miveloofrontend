import type { FeatureStatus } from './plans';
export interface ModuleSpec { title: string; desc: string; status: FeatureStatus; features: string[]; metrics: string[][] | null; notes: string[] }
export const modules: Record<string, ModuleSpec> = {
 "school/dashboard": {
  "title": "School dashboard",
  "desc": "Orders, deliveries, spend and alerts at a glance.",
  "status": "available",
  "features": [],
  "metrics": [
   [
    "Active orders",
    "3"
   ],
   [
    "Pending requests",
    "2"
   ],
   [
    "Expected deliveries",
    "1"
   ],
   [
    "Month spend (RWF)",
    "1,250,000"
   ]
  ],
  "notes": [
   "Figures are sample data for design review."
  ]
 },
 "school/meal-planning": {
  "title": "Meal and demand planning",
  "desc": "Enter student numbers, menus and ingredient needs.",
  "status": "in-development",
  "features": [
   "Expected student numbers and meal schedules",
   "Planned menus and ingredient requirements",
   "Demand estimates (shown as estimates)"
  ],
  "metrics": null,
  "notes": []
 },
 "school/procurement": {
  "title": "Procurement",
  "desc": "Purchase requests, quotations and approvals.",
  "status": "in-development",
  "features": [
   "Prepare purchase requests",
   "Compare quotations",
   "Internal approvals and decision records"
  ],
  "metrics": null,
  "notes": []
 },
 "school/budgets": {
  "title": "Budgets",
  "desc": "Set budgets and track spending.",
  "status": "in-development",
  "features": [
   "Budget by period and category",
   "Spend versus budget"
  ],
  "metrics": null,
  "notes": []
 },
 "school/inventory": {
  "title": "Food inventory",
  "desc": "Stock, wastage, expiry and replenishment.",
  "status": "in-development",
  "features": [
   "Record stock received and consumed",
   "Low-stock and expiry alerts",
   "Replenishment estimates"
  ],
  "metrics": null,
  "notes": []
 },
 "school/suppliers": {
  "title": "Supplier directory",
  "desc": "Find and manage supplier relationships.",
  "status": "available",
  "features": [
   "Saved preferred suppliers",
   "Supplier history"
  ],
  "metrics": null,
  "notes": []
 },
 "school/exchange": {
  "title": "School-to-school exchange",
  "desc": "Offer surplus food and request food from other schools.",
  "status": "planned",
  "features": [
   "Offer surplus",
   "Request food",
   "Record transfer outcomes (subject to food-safety rules)"
  ],
  "metrics": null,
  "notes": []
 },
 "school/deliveries": {
  "title": "Deliveries and receiving",
  "desc": "Confirm what arrived and record discrepancies.",
  "status": "available",
  "features": [
   "Expected deliveries",
   "Record quantities received",
   "Report issues"
  ],
  "metrics": null,
  "notes": []
 },
 "school/finances": {
  "title": "Finance and transactions",
  "desc": "Invoices, receipts and balances where supported.",
  "status": "planned",
  "features": [
   "Invoices and receipts",
   "Outstanding balances"
  ],
  "metrics": null,
  "notes": []
 },
 "school/price-history": {
  "title": "Food price history",
  "desc": "Historical prices available to your school.",
  "status": "available",
  "features": [],
  "metrics": null,
  "notes": [
   "Historical data in your own dashboard is free.",
   "Chart below is sample data."
  ]
 },
 "school/reports": {
  "title": "School reports",
  "desc": "Purchasing, inventory, supplier and meal-planning summaries.",
  "status": "in-development",
  "features": [
   "Date-range filters",
   "Downloadable exports where authorised"
  ],
  "metrics": null,
  "notes": []
 },
 "school/profile": {
  "title": "School profile",
  "desc": "Organisation details, verification and team.",
  "status": "available",
  "features": [
   "Verification status",
   "Staff and permissions"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/dashboard": {
  "title": "Supplier dashboard",
  "desc": "Listings, orders, stock and sales.",
  "status": "available",
  "features": [],
  "metrics": [
   [
    "Active listings",
    "5"
   ],
   [
    "Incoming orders",
    "2"
   ],
   [
    "Stock alerts",
    "1"
   ],
   [
    "Month sales (RWF)",
    "840,000"
   ]
  ],
  "notes": [
   "Figures are sample data for design review."
  ]
 },
 "supplier/orders": {
  "title": "Incoming orders",
  "desc": "Accept, reject and fulfil school orders.",
  "status": "available",
  "features": [
   "Accept or reject",
   "Confirm quantities",
   "Update preparation and delivery status"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/buyers": {
  "title": "Buyers",
  "desc": "Authorised buyer activity.",
  "status": "in-development",
  "features": [
   "Buyer activity",
   "Customer feedback where enabled"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/inventory": {
  "title": "Inventory",
  "desc": "Keep available quantities accurate.",
  "status": "available",
  "features": [
   "Update quantities",
   "Low-stock alerts"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/deliveries": {
  "title": "Deliveries",
  "desc": "Delivery tasks and status.",
  "status": "in-development",
  "features": [
   "Delivery tasks",
   "Status updates"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/finances": {
  "title": "Sales and transactions",
  "desc": "Transaction and sales records.",
  "status": "in-development",
  "features": [
   "Sales records",
   "Payment status"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/analytics": {
  "title": "Analytics",
  "desc": "Historical sales and product activity.",
  "status": "available",
  "features": [
   "Order volumes",
   "Product performance"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/ai-insights": {
  "title": "AI insights",
  "desc": "Demand estimates, pricing insights and product matching.",
  "status": "in-development",
  "features": [
   "Demand estimates",
   "Pricing insights",
   "Matching with school needs"
  ],
  "metrics": null,
  "notes": [
   "Insights are estimates, not guarantees. Advanced tools may be a paid upgrade."
  ]
 },
 "supplier/performance": {
  "title": "Performance",
  "desc": "Fulfilment and feedback.",
  "status": "in-development",
  "features": [
   "Fulfilment rate",
   "Delivery performance"
  ],
  "metrics": null,
  "notes": []
 },
 "supplier/verification": {
  "title": "Verification",
  "desc": "Identity, business and product verification.",
  "status": "available",
  "features": [
   "Upload documents",
   "See verification status"
  ],
  "metrics": null,
  "notes": []
 },
 "group/dashboard": {
  "title": "Group dashboard",
  "desc": "Members, stock, orders and fulfilment.",
  "status": "in-development",
  "features": [],
  "metrics": [
   [
    "Members",
    "8"
   ],
   [
    "Open orders",
    "2"
   ],
   [
    "Confirmed stock (kg)",
    "1,800"
   ],
   [
    "Estimated capacity (kg)",
    "4,000"
   ]
  ],
  "notes": [
   "Estimated capacity is never shown as confirmed stock. Sample figures."
  ]
 },
 "group/members": {
  "title": "Members",
  "desc": "Registration, roles and permissions.",
  "status": "in-development",
  "features": [
   "Member registry",
   "Roles and permissions",
   "Member financial data visible to authorised managers only"
  ],
  "metrics": null,
  "notes": []
 },
 "group/inventory": {
  "title": "Aggregated inventory",
  "desc": "Confirmed versus estimated supply.",
  "status": "in-development",
  "features": [
   "Confirmed stock per member",
   "Estimated capacity, labelled separately"
  ],
  "metrics": null,
  "notes": [
   "A group must never appear to promise food it cannot supply."
  ]
 },
 "group/products": {
  "title": "Combined listings",
  "desc": "Combine member quantities into listings.",
  "status": "in-development",
  "features": [
   "Combine quantities",
   "Choose which members supply what"
  ],
  "metrics": null,
  "notes": []
 },
 "group/orders": {
  "title": "Bulk orders",
  "desc": "Allocate confirmed orders to members.",
  "status": "in-development",
  "features": [
   "Order allocation",
   "Fulfilment monitoring",
   "Shortage warnings"
  ],
  "metrics": null,
  "notes": []
 },
 "group/supply-planning": {
  "title": "Supply planning",
  "desc": "Plan supply against demand.",
  "status": "planned",
  "features": [
   "Seasonal planning",
   "Shortage identification"
  ],
  "metrics": null,
  "notes": []
 },
 "group/logistics": {
  "title": "Collection and delivery",
  "desc": "Collection points and delivery coordination.",
  "status": "planned",
  "features": [
   "Collection points",
   "Delivery coordination"
  ],
  "metrics": null,
  "notes": []
 },
 "group/payments": {
  "title": "Payments and contributions",
  "desc": "Payment records and member contributions.",
  "status": "planned",
  "features": [
   "Payment records",
   "Contribution tracking"
  ],
  "metrics": null,
  "notes": []
 },
 "group/ai-insights": {
  "title": "Group AI insights",
  "desc": "Group-level estimates and alerts.",
  "status": "planned",
  "features": [
   "Demand estimates",
   "Shortage alerts"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/dashboard": {
  "title": "Institutional dashboard",
  "desc": "Programme and regional overview.",
  "status": "agreement",
  "features": [],
  "metrics": [
   [
    "Schools in coverage",
    "—"
   ],
   [
    "Coverage period",
    "—"
   ],
   [
    "Last data update",
    "—"
   ],
   [
    "Data sources",
    "—"
   ]
  ],
  "notes": [
   "No data loaded. Coverage will be shown here and never assumed to be national."
  ]
 },
 "institution/intelligence": {
  "title": "Regional intelligence",
  "desc": "Aggregated regional insight.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/schools": {
  "title": "Participating schools",
  "desc": "Directory where authorised.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/programs": {
  "title": "Programme monitoring",
  "desc": "School-feeding programme tracking.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/forecasting": {
  "title": "Forecasting and scenarios",
  "desc": "Forecasts and scenario planning.",
  "status": "planned",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/supply-gaps": {
  "title": "Supply gaps",
  "desc": "Demand versus supply analysis.",
  "status": "planned",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/price-intelligence": {
  "title": "Price intelligence",
  "desc": "Historical price analysis.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/supplier-network": {
  "title": "Supplier network",
  "desc": "Supplier availability overview.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/reports": {
  "title": "Custom reports and exports",
  "desc": "Authorised data exports.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/interventions": {
  "title": "Interventions",
  "desc": "Track interventions.",
  "status": "planned",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/data-access": {
  "title": "Data access",
  "desc": "Agreements and data-access settings.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "institution/billing": {
  "title": "Contract and billing",
  "desc": "Contract and billing information.",
  "status": "agreement",
  "features": [
   "Aggregated or anonymised views",
   "Sources, coverage, update times and definitions shown on every view"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/dashboard": {
  "title": "Admin overview",
  "desc": "Platform health and queues.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/users": {
  "title": "Users",
  "desc": "User management.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/organizations": {
  "title": "Organisations",
  "desc": "Organisation management.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/schools": {
  "title": "School verification",
  "desc": "Review and verify schools.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/suppliers": {
  "title": "Supplier verification",
  "desc": "Review and verify suppliers.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/products": {
  "title": "Product moderation",
  "desc": "Review listings.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/marketplace": {
  "title": "Marketplace monitoring",
  "desc": "Monitor marketplace activity.",
  "status": "in-development",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/orders": {
  "title": "Orders and disputes",
  "desc": "Order and dispute oversight.",
  "status": "available",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/billing": {
  "title": "Subscriptions and payments",
  "desc": "Subscription administration and payment status.",
  "status": "planned",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/ai-monitoring": {
  "title": "AI monitoring",
  "desc": "AI performance and quality.",
  "status": "planned",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/data": {
  "title": "Data imports and quality",
  "desc": "Imports and data-quality checks.",
  "status": "in-development",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/analytics": {
  "title": "Platform analytics",
  "desc": "Platform-wide analytics.",
  "status": "in-development",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/support": {
  "title": "Support tickets",
  "desc": "Ticket management.",
  "status": "in-development",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/security": {
  "title": "Security and access control",
  "desc": "Access control management.",
  "status": "in-development",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "admin/settings": {
  "title": "Platform configuration",
  "desc": "Configuration.",
  "status": "in-development",
  "features": [
   "Permission-controlled",
   "Every sensitive action is recorded in the audit log"
  ],
  "metrics": null,
  "notes": []
 },
 "app/messages": {
  "title": "Messages",
  "desc": "Buyer and seller messaging.",
  "status": "in-development",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/notifications": {
  "title": "Notifications",
  "desc": "Choose what to hear about, and how.",
  "status": "in-development",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/analytics": {
  "title": "Analytics",
  "desc": "Historical metrics, kept separate from forecasts.",
  "status": "available",
  "features": [],
  "metrics": null,
  "notes": [
   "Historical records, current observations and forecasts are always labelled separately."
  ]
 },
 "app/reports": {
  "title": "Reports",
  "desc": "Role-appropriate reports and exports.",
  "status": "in-development",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/support": {
  "title": "Support",
  "desc": "Help, tickets and issue reports. You only see your own tickets.",
  "status": "in-development",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/settings/profile": {
  "title": "Profile",
  "desc": "Your personal details.",
  "status": "available",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/settings/organization": {
  "title": "Organisation",
  "desc": "Organisation information.",
  "status": "available",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/settings/team": {
  "title": "Team",
  "desc": "Staff, roles and invitations.",
  "status": "in-development",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/settings/security": {
  "title": "Security",
  "desc": "Password and sign-in security.",
  "status": "available",
  "features": [],
  "metrics": null,
  "notes": []
 },
 "app/settings/preferences": {
  "title": "Preferences",
  "desc": "Language, display and notifications.",
  "status": "available",
  "features": [],
  "metrics": null,
  "notes": []
 }
};
