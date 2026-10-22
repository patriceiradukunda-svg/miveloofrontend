/* eslint-disable @typescript-eslint/ban-ts-comment, @next/next/no-html-link-for-pages, @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
// EDIT THIS FILE: every [bracketed] value is a placeholder shown highlighted until you replace it.
export const ORG = {
  name: "[Miveloo legal entity name]",
  address: "[Registered address]",
  privacyEmail: "[privacy contact email]",
  legalEmail: "[legal notices email]",
  supportEmail: "", // if set, shown as fallback when the support form fails
};
export const DRAFT_NOTICE = true; // set false after legal + product review
export const SUPPORT_ENDPOINT = "/api/support";   // must return JSON { reference: "..." } on success
export const FEEDBACK_ENDPOINT = "/api/feedback";
export const STATUS_URL = "";                       // only shown if a real status system exists
export const LANGS = ["en"];                        // add "rw" ONLY when Kinyarwanda content exists
export const MARKETING_USED = false;                // true only if advertising trackers really exist
export const VERSION = "0.1-draft";
export const EFFECTIVE = "[Effective date - set on publication]";
export const UPDATED = "22 October 2026";
// Fill from COOKIE_AUDIT.txt. Example row:
// {name:"session",provider:"Miveloo",purpose:"Keeps you signed in",category:"Strictly necessary",party:"First-party",duration:"Session",essential:"Essential",consent:"No"}
export const COOKIES = [];
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
