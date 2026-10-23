/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Shell, Acc, Rich, SubmitForm } from "./ui";
import { rank } from "./search";
import { FAQS } from "./faq";
import { ORG, ROUTES, SUPPORT_ENDPOINT, FEEDBACK_ENDPOINT, STATUS_URL, LANGS, UPDATED } from "./config";

const PATHS = [
 { id: "schools", t: "For schools", d: "Verification, school profiles, authorised staff, finding food, requests, orders, deliveries, stock, meal planning, subscriptions and reports." },
 { id: "suppliers", t: "For suppliers", d: "Registration, verification, listings, photos, prices, quantities, stock, orders, delivery, payment records and Pro services." },
 { id: "orgs", t: "For cooperatives and organisations", d: "Organisation registration, members, representatives, collective supply, permissions, reporting and analytics." },
 { id: "tech", t: "Technical and account issues", d: "Login, recovery, permissions, suspicious activity, data corrections, errors and privacy concerns." },
];
const A = (id, title, summary, cat, aud, steps, related) => ({ id, title, summary, cat, aud, steps, related, updated: UPDATED });
const ARTICLES = [
 A("create-account", "How to create and verify a Miveloo account", "Register and complete verification so you can access the right features.", "Accounts", ["schools", "suppliers", "orgs", "tech"], ["Choose Sign up and select your account type.", "Enter your details and accept the applicable terms.", "Submit the verification information requested for your organisation.", "Wait for review. Until it is approved, protected features stay locked. You can correct and resubmit if something is missing."], ["school-access", "publish-listing"]),
 A("school-access", "How schools access the food marketplace", "Only verified schools and authorised accounts can browse the marketplace.", "Schools", ["schools"], ["Complete school verification.", "Ask your administrator to give you a role with marketplace access.", "Open the marketplace and search by food type or nearest location.", "Compare price, unit, quantity and delivery details before you send a request."], ["request-order", "create-account"]),
 A("publish-listing", "How to publish, edit, pause or remove a food listing", "Keep listings accurate so schools can plan with confidence.", "Suppliers", ["suppliers", "orgs"], ["Add product details, photo, unit, price, quantity and location.", "Save as draft, check it, then publish.", "Update quantities as stock changes, or pause the listing if you cannot supply.", "Remove discontinued products."], ["manage-stock", "create-account"]),
 A("request-order", "How to request food and manage an order", "A request is not yet a confirmed order.", "Schools", ["schools", "suppliers"], ["Send a request from a listing, stating quantity and delivery needs.", "Wait for the supplier's response and clarify any questions.", "Confirm through the approved process. [Describe the exact step that confirms an order.]", "Track delivery and record the outcome."], ["report-delivery", "school-access"]),
 A("report-delivery", "How to report missing, damaged or incorrect deliveries", "Record evidence and tell the supplier promptly.", "Disputes", ["schools", "suppliers"], ["Check the delivery against your order.", "Take photos and note quantities and condition.", "Report the problem on the order record.", "If unresolved, contact support with your order reference."], ["request-order"]),
 A("manage-stock", "How to manage stock and food availability", "Keep an accurate record of what you have and what you can supply.", "Stock", ["schools", "suppliers"], ["Record stock received, used and wasted.", "Do regular physical counts and correct the record.", "Remember that forecasts are estimates, not counts."], ["ai-forecasts"]),
 A("pro-subscription", "How Miveloo Pro works and how to manage a subscription", "Core marketplace use is free; Pro adds advanced tools.", "Billing", ["schools", "suppliers", "orgs"], ["Open your organisation settings and choose Plans.", "Select a plan available for your role.", "Manage renewal or cancellation in the same place. [Match to real billing screens.]", "If a plan ends, paid tools switch off but your data stays yours."], ["ai-forecasts"]),
 A("ai-forecasts", "How to understand AI forecasts and confidence levels", "Forecasts are estimates, not facts.", "AI", ["schools", "suppliers", "orgs"], ["Look for the label: record, current observation or forecast.", "Check the date, horizon and any uncertainty range.", "Compare with real stock and current prices before deciding.", "Report anything that looks wrong."], ["manage-stock"]),
 A("data-request", "How to request a copy of your personal data", "Use the privacy route to access, correct or delete data.", "Privacy", ["tech", "schools", "suppliers", "orgs"], ["Contact the privacy address in the Privacy Policy, or open a request from support.", "Say what you need: access, correction or deletion.", "We may verify your identity first.", "We will explain anything we must keep for legal reasons."], ["report-security"]),
 A("report-security", "How to report a security or privacy concern", "Report suspected compromise or misuse straight away.", "Security", ["tech", "schools", "suppliers", "orgs"], ["Use the contact form below and choose Security or privacy concern.", "Never include passwords or card details.", "Change your password if you suspect compromise.", "We investigate and take action and notify affected people where required."], ["data-request"]),
];

const CATEGORIES = ["Account or verification", "Finding or listing food", "Orders and deliveries", "Order dispute", "Billing or Pro plan", "AI forecasts or reports", "Technical error", "Misleading information", "Urgent: suspected account compromise", "Urgent: unauthorised access", "Urgent: fraudulent listing", "Urgent: unsafe food concern", "Urgent: privacy incident", "Other"];
const SUPPORT_FIELDS = [
 { name: "userType", label: "I am a", type: "select", required: true, options: ["Public visitor", "School", "Supplier", "Cooperative or organisation", "Institutional partner", "Other"] },
 { name: "organisation", label: "Organisation", showIf: v => v.userType && v.userType !== "Public visitor", auto: "organization" },
 { name: "name", label: "Your name", required: true, auto: "name" },
 { name: "email", label: "Email", type: "email", required: true, auto: "email" },
 { name: "channel", label: "Preferred response channel", type: "select", options: ["Email", "Phone"] },
 { name: "phone", label: "Phone number", type: "tel", required: true, showIf: v => v.channel === "Phone", auto: "tel" },
 { name: "category", label: "Category", type: "select", required: true, options: CATEGORIES },
 { name: "reference", label: "Order or listing reference" },
 { name: "subject", label: "Subject", required: true },
 { name: "description", label: "What happened?", type: "textarea", required: true, min: 20, help: "Never include passwords, card details or unnecessary personal documents." },
 { name: "attachment", label: "Screenshot or attachment", type: "file", help: "Images or PDF, up to 1.5 MB." },
];
const FB_FIELDS = [
 { name: "area", label: "Area", type: "select", options: ["Marketplace", "Help pages", "Pro plans", "AI features", "Other"] },
 { name: "message", label: "Your suggestion", type: "textarea", required: true, min: 10 },
 { name: "email", label: "Email (only if you want a reply)", type: "email" },
];

export function HelpPage() {
  const [q, setQ] = useState(""); const [aud, setAud] = useState("all"); const [open, setOpen] = useState({}); const [initial, setInitial] = useState({});
  useEffect(() => {
    const p = new URLSearchParams(location.search).get("report"); if (p) setInitial({ category: "Misleading information", subject: "Outdated or incorrect FAQ: " + p });
    const h = location.hash.slice(1); if (h.startsWith("a-")) { setOpen({ [h.slice(2)]: true }); setTimeout(() => document.getElementById(h)?.scrollIntoView(), 60); }
  }, []);
  const pool = useMemo(() => [...ARTICLES.map(a => ({ kind: "article", id: a.id, title: a.title, text: a.summary + " " + a.cat + " " + a.steps.join(" ") })), ...FAQS.map(f => ({ kind: "faq", id: f.id, title: f.q, text: f.a + " " + f.cat }))], []);
  const res = q.trim() ? rank(pool, q).slice(0, 12) : null;
  const arts = ARTICLES.filter(a => aud === "all" || a.aud.includes(aud));
  const choose = id => { setAud(id); setTimeout(() => document.getElementById("articles")?.scrollIntoView(), 30); };
  return (
    <Shell title="How can we help you?" intro="Miveloo is here to help you buy and sell school food more easily and manage your operations."
      meta={<div className="mv-search" role="search"><input className="mv-in" type="search" aria-label="Search help" placeholder="Search help, e.g. verify account, refund, forecast" value={q} onChange={e => setQ(e.target.value)} /></div>}>
      {res && <section className="mv-sec"><div className="mv-wrap" aria-live="polite">
        <h2>Search results</h2>
        {res.length ? <ul className="mv-res">{res.map(r => <li key={r.kind + r.id}><a className="mv-card" href={r.kind === "faq" ? "/faq#" + r.id : "#a-" + r.id} onClick={() => { if (r.kind === "article") { setQ(""); setOpen({ [r.id]: true }); } }}><span className="mv-tag">{r.kind === "faq" ? "FAQ" : "Guide"}</span><b>{r.title}</b></a></li>)}</ul> :
          <div className="mv-info"><b>Nothing matched “{q}”.</b> Try simpler words such as “account”, “order”, “billing” or “delivery”, choose a topic below, or <a href="#contact">contact support</a>.</div>}
      </div></section>}
      <section className="mv-sec alt"><div className="mv-wrap">
        <h2>Choose your situation</h2><p className="mv-lead">Each card opens the guides that fit you.</p>
        <div className="mv-grid">{PATHS.map(p => <button key={p.id} className="mv-card" aria-pressed={aud === p.id} onClick={() => choose(p.id)}><span className="mv-ico">{({ schools: "🏫", suppliers: "🌾", orgs: "🤝", tech: "🛠️" })[p.id]}</span><h3>{p.t}</h3><p>{p.d}</p></button>)}</div>
      </div></section>
      <section className="mv-sec" id="articles"><div className="mv-wrap">
        <h2>{aud === "all" ? "Popular help articles" : PATHS.find(p => p.id === aud).t}</h2>
        {aud !== "all" && <button className="mv-chip" onClick={() => setAud("all")} style={{ marginBottom: 12 }}>Show all articles</button>}
        {arts.map(a => <Acc key={a.id} id={"a-" + a.id} title={a.title} open={open[a.id]} onToggle={() => setOpen(p => ({ ...p, [a.id]: !p[a.id] }))}>
          <p><span className="mv-tag">{a.cat}</span> {a.summary}</p>
          <ol>{a.steps.map((s, i) => <li key={i}><Rich t={s} /></li>)}</ol>
          <p className="mv-small">Last updated: {a.updated}</p>
          <p className="mv-small">Related: {a.related.map(r => { const x = ARTICLES.find(z => z.id === r); return <a key={r} href={"#a-" + r} onClick={() => setOpen({ [r]: true })} style={{ marginRight: 10 }}>{x.title}</a>; })}</p>
        </Acc>)}
      </div></section>
      <section className="mv-sec alt" id="contact"><div className="mv-wrap">
        <h2>Contact support</h2>
        <div className="mv-info"><b>Urgent matters.</b> For suspected account compromise, unauthorised access, fraudulent listings, unsafe food or privacy incidents, choose a category starting with “Urgent”. We do not promise 24/7 assistance or fixed response times unless stated. Privacy contact: {ORG.privacyEmail}.</div>
        <SubmitForm key={JSON.stringify(initial)} type="support" fields={SUPPORT_FIELDS} endpoint={SUPPORT_ENDPOINT} submitLabel="Send request" successTitle="Request received" mailto={ORG.supportEmail} initial={initial} />
      </div></section>
      <section className="mv-sec"><div className="mv-wrap">
        <div className="mv-grid">
          <div><h2>Report a problem</h2><p>Errors or misleading information? Use the contact form and choose “Technical error” or “Misleading information”.</p></div>
          {STATUS_URL && <div><h2>System status</h2><p><a href={STATUS_URL} rel="noopener">View current platform status</a></p></div>}
          {LANGS.length > 1 && <div><h2>Language</h2><p>English and Kinyarwanda content is available.</p></div>}
        </div>
        <h2 style={{ marginTop: 28 }}>Give feedback</h2><p className="mv-lead">Suggestions are kept separate from support tickets.</p>
        <SubmitForm type="feedback" fields={FB_FIELDS} endpoint={FEEDBACK_ENDPOINT} submitLabel="Send feedback" successTitle="Thanks for your feedback" />
      </div></section>
      <section className="mv-sec alt"><div className="mv-wrap">
        <h2>Related pages</h2>
        <div className="mv-grid">{ROUTES.filter(r => r.href !== "/help").map(r => <a key={r.href} className="mv-card" href={r.href}><h3>{r.label}</h3></a>)}</div>
        <p style={{ marginTop: 24 }}>Still need help? <a href="#contact">Contact support</a>.</p>
      </div></section>
    </Shell>
  );
}
