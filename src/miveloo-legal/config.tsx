/* eslint-disable @typescript-eslint/ban-ts-comment, @next/next/no-html-link-for-pages, @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
import { site } from "@/config/site";
// EDIT THIS FILE: every [bracketed] value is a placeholder shown highlighted until you replace it.
export const ORG = {
  name: "Miveloo",
  address: "[Registered address]",
  privacyEmail: site.contact.email || "our privacy team via the Help & Support page",
  legalEmail: site.contact.email || "our team via the Contact page",
  supportEmail: site.contact.email || "", // if set, shown as fallback when the support form fails
};
export const DRAFT_NOTICE = false; // set false after legal + product review
const API = process.env.NEXT_PUBLIC_API_URL ?? "";
export const SUPPORT_ENDPOINT = API + "/api/v1/help/support";
export const FEEDBACK_ENDPOINT = API + "/api/v1/help/feedback";
export const VOTE_ENDPOINT = API + "/api/v1/help/faq-votes";
export const STATUS_URL = "";                       // only shown if a real status system exists
export const LANGS = ["en"];                        // add "rw" ONLY when Kinyarwanda content exists
export const MARKETING_USED = false;                // true only if advertising trackers really exist
export const VERSION = "1.0";
export const EFFECTIVE = "22 October 2026";
export const UPDATED = "22 October 2026";
// Fill from COOKIE_AUDIT.txt. Example row:
// {name:"session",provider:"Miveloo",purpose:"Keeps you signed in",category:"Strictly necessary",party:"First-party",duration:"Session",essential:"Essential",consent:"No"}
export const COOKIES = [
  {name:"mv_session",provider:"Miveloo",purpose:"Keeps you signed in",category:"Strictly necessary",party:"First-party",duration:"Up to 8 hours",essential:"Essential",consent:"No"},
  {name:"mv_access",provider:"Miveloo",purpose:"Authorises your requests while you are signed in",category:"Strictly necessary",party:"First-party",duration:"Set at sign-in",essential:"Essential",consent:"No"},
  {name:"mv_refresh",provider:"Miveloo",purpose:"Renews your sign-in securely",category:"Strictly necessary",party:"First-party",duration:"Set at sign-in",essential:"Essential",consent:"No"},
  {name:"mv_google_pending",provider:"Miveloo",purpose:"Completes Google sign-in",category:"Strictly necessary",party:"First-party",duration:"10 minutes",essential:"Essential",consent:"No"},
  {name:"miveloo_consent (local storage)",provider:"Miveloo",purpose:"Remembers your cookie choices",category:"Strictly necessary",party:"First-party",duration:"Up to 12 months",essential:"Essential",consent:"No"},
  {name:"mv_locale",provider:"Miveloo",purpose:"Remembers the language you choose",category:"Functional",party:"First-party",duration:"12 months",essential:"Optional",consent:"No - set only when you choose a language"},
  {name:"mv_basket (local storage)",provider:"Miveloo",purpose:"Keeps items in your basket on this device",category:"Functional",party:"First-party",duration:"Until you clear it",essential:"Optional",consent:"No - used only when you use the basket"},
  {name:"mv_tour_step (local storage)",provider:"Miveloo",purpose:"Remembers your place in the site tour",category:"Functional",party:"First-party",duration:"Until you clear it",essential:"Optional",consent:"No - used only during the tour"},
  {name:"mv_check_[role] (local storage)",provider:"Miveloo",purpose:"Remembers completed dashboard checklist items",category:"Functional",party:"First-party",duration:"Until you clear it",essential:"Optional",consent:"No - used only in your dashboard"},
];
export const ROUTES = [
  { href: "/help", label: "Help & Support" },
  { href: "/faq", label: "FAQs" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/supplier-terms", label: "Supplier Terms" },
  { href: "/school-terms", label: "School Terms" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/data-ai-policy", label: "Data & AI Policy" },
];
