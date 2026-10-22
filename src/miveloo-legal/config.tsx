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
export const SUPPORT_ENDPOINT = "/api/support";   // must return JSON { reference: "..." } on success
export const FEEDBACK_ENDPOINT = "/api/feedback";
export const STATUS_URL = "";                       // only shown if a real status system exists
export const LANGS = ["en"];                        // add "rw" ONLY when Kinyarwanda content exists
export const MARKETING_USED = false;                // true only if advertising trackers really exist
export const VERSION = "1.0";
export const EFFECTIVE = "22 October 2026";
export const UPDATED = "22 October 2026";
// Fill from COOKIE_AUDIT.txt. Example row:
// {name:"session",provider:"Miveloo",purpose:"Keeps you signed in",category:"Strictly necessary",party:"First-party",duration:"Session",essential:"Essential",consent:"No"}
export const COOKIES = [
  {name:"miveloo_consent",provider:"Miveloo",purpose:"Remembers your cookie choices",category:"Strictly necessary",party:"First-party",duration:"Up to 12 months",essential:"Essential",consent:"No"},
  {name:"Sign-in session",provider:"Miveloo",purpose:"Keeps you signed in and protects your account",category:"Strictly necessary",party:"First-party",duration:"Session or as set at sign-in",essential:"Essential",consent:"No"},
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
