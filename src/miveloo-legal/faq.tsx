/* eslint-disable @typescript-eslint/ban-ts-comment, @next/next/no-html-link-for-pages, @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Shell, Acc, Rich } from "./ui";
import { rank } from "./search";
import { FEEDBACK_ENDPOINT, UPDATED } from "./config";

export const CATS = ["General", "Accounts and verification", "Marketplace and listings", "School purchasing and orders", "Suppliers and cooperatives", "Deliveries, quality and disputes", "Pro plans, pricing and billing", "Stock and meal planning", "AI, forecasts and analytics", "Privacy, security and data", "Technical support"];
const R = UPDATED;
export const FAQS = [
 { id: "what-is-miveloo", cat: "General", q: "What is Miveloo?", a: "Miveloo connects the school food ecosystem. It helps schools find food suppliers and helps suppliers reach authorised school buyers, and supports better procurement, supply planning and institutional decisions." },
 { id: "who-can-use", cat: "General", q: "Who can use Miveloo?", a: "Public visitors can read our public pages. Schools and other authorised institutions need verification to access the buying marketplace. Suppliers and cooperatives register and complete verification before publishing. Institutional partners have access only within their agreements. [Confirm exact requirements.]", link: ["/terms", "Terms of Service"] },
 { id: "browse-buy", cat: "General", q: "Can anyone browse and buy food?", a: "No. The purchasing marketplace and private supplier listings are only available to verified schools and other explicitly authorised accounts. Public visitors cannot see them." },
 { id: "sells-food", cat: "General", q: "Does Miveloo sell food itself?", a: "[State the real model, e.g. Miveloo is a platform connecting buyers and suppliers.] We do not own, inspect, store or deliver listed products unless that is actually part of our service.", link: ["/terms", "Terms of Service"] },
 { id: "why-verify", cat: "Accounts and verification", q: "Why must schools verify their accounts?", a: "Verification protects the institutional marketplace and helps make sure purchasing access goes to authorised organisations.", rev: R },
 { id: "multi-role", cat: "Accounts and verification", q: "Can one account have multiple roles?", a: "Where permitted, one person can hold several assigned roles. Each role has its own permissions and access scope.", link: ["/school-terms", "School Terms"] },
 { id: "verify-fails", cat: "Accounts and verification", q: "What if verification fails or my details change?", a: "You can correct and resubmit your information or contact support. To change organisation details, [describe the process]. Reviews of rejected applications are handled through Help & Support.", link: ["/help", "Help & Support"], rev: R },
 { id: "nearby-food", cat: "Marketplace and listings", q: "How do schools find nearby food?", a: "Listings can be ordered nearest-first using location information. Distances and availability are estimates and depend on what suppliers and schools have entered." },
 { id: "publish-products", cat: "Marketplace and listings", q: "How do suppliers publish products?", a: "Add product details, images, price, unit, quantity, availability and location. Listings can be saved as drafts and only become visible to eligible buyers once published. Publishing requires completed verification.", link: ["/supplier-terms", "Supplier Terms"] },
 { id: "request-vs-order", cat: "School purchasing and orders", q: "Does submitting a request guarantee an order?", a: "No. A request or inquiry is not an accepted order. An order becomes confirmed only when [describe the exact confirming action in the implemented workflow, e.g. supplier acceptance and any school approval].", link: ["/terms", "Terms of Service"] },
 { id: "coop-members", cat: "Suppliers and cooperatives", q: "Can a cooperative manage its members' products?", a: "Cooperatives can [describe implemented capability]. Collective availability is only as accurate as the stock information provided, and forecasts are not guaranteed member-level stock.", link: ["/supplier-terms", "Supplier Terms"] },
 { id: "quality-responsibility", cat: "Deliveries, quality and disputes", q: "Who is responsible for food quality and delivery?", a: "The supplier is responsible for the goods and agreed delivery; the school is responsible for checking what it receives and reporting problems promptly. Miveloo does not guarantee food quality unless a real guarantee exists.", link: ["/supplier-terms", "Supplier Terms"] },
 { id: "wrong-delivery", cat: "Deliveries, quality and disputes", q: "What if a delivery is missing, damaged or wrong?", a: "Record what happened with photos and notes, tell the supplier promptly, and use the dispute process. You can also contact support.", link: ["/school-terms", "School Terms"] },
 { id: "is-free", cat: "Pro plans, pricing and billing", q: "Is Miveloo free?", a: "Core marketplace buying and selling is free, subject to verification, permissions and platform rules. Some advanced tools need a paid plan.", rev: R },
 { id: "pro-offer", cat: "Pro plans, pricing and billing", q: "What does Miveloo Pro offer?", a: "Optional tools such as demand forecasts, purchasing recommendations, inventory tools, operational planning, automation, advanced analytics and reports. Exact features depend on your role and plan. [Link to pricing page.]", rev: R },
 { id: "cancel-refund", cat: "Pro plans, pricing and billing", q: "Can I cancel a subscription or request a refund?", a: "[Describe the real cancellation, renewal, refund and access-ending rules.] When a subscription ends, paid features are switched off but your data remains yours and eligible records can be exported.", link: ["/terms", "Terms of Service"], rev: R },
 { id: "stock-tools", cat: "Stock and meal planning", q: "Can Miveloo manage my school's stock and menus?", a: "School tools can help record stock and plan food needs. An AI estimate is not a physical count, and you remain responsible for verifying stock and for nutrition and budget decisions. [State which tools are available, in development or planned.]", link: ["/school-terms", "School Terms"], planned: false },
 { id: "uses-ai", cat: "AI, forecasts and analytics", q: "Does Miveloo use AI?", a: "AI can analyse authorised information, estimate future demand, highlight price or supply trends and suggest operational improvements. [Say which features are live.]", link: ["/data-ai-policy", "Data & AI Policy"], rev: R },
 { id: "ai-accurate", cat: "AI, forecasts and analytics", q: "Are AI predictions always accurate?", a: "No. Forecasts are estimates and can be incomplete or wrong. Check them against real stock, current prices, budgets, local conditions and human judgement. AI never approves purchases for you.", link: ["/data-ai-policy", "Data & AI Policy"], rev: R },
 { id: "sell-data", cat: "Privacy, security and data", q: "Does Miveloo sell personal data?", a: "[Insert the verified statement that exactly matches the Privacy Policy section on sharing.]", link: ["/privacy", "Privacy Policy"] },
 { id: "data-delete", cat: "Privacy, security and data", q: "How can I request my data or delete my account?", a: "Use your account controls or contact the privacy contact in the Privacy Policy. We may verify your identity, and some records must be kept for legal, financial or security reasons.", link: ["/privacy", "Privacy Policy"] },
 { id: "cant-login", cat: "Technical support", q: "I cannot log in. What should I do?", a: "Try account recovery first. If that fails, or you suspect someone else has accessed your account, contact support and choose the security category.", link: ["/help", "Help & Support"] },
];

function Vote({ id }) {
  const [v, setV] = useState("");
  const send = x => { setV(x); try { fetch(FEEDBACK_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "faq-vote", id, helpful: x === "yes" }) }).catch(() => {}); } catch (_) {} };
  if (v) return <p className="mv-small" role="status">Thanks for your feedback.</p>;
  return <p className="mv-small">Was this helpful? <button className="mv-chip" onClick={() => send("yes")}>Yes</button> <button className="mv-chip" onClick={() => send("no")}>No</button></p>;
}

export function FaqPage() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all"); const [open, setOpen] = useState({}); const [more, setMore] = useState({});
  useEffect(() => { const h = decodeURIComponent(location.hash.slice(1)); const it = FAQS.find(f => f.id === h); if (it) { setOpen({ [h]: true }); setMore({ [it.cat]: true }); setTimeout(() => document.getElementById(h)?.scrollIntoView(), 60); } }, []);
  const toggle = id => { const o = !open[id]; setOpen(p => ({ ...p, [id]: o })); if (o) try { history.replaceState(null, "", "#" + id); } catch (_) {} };
  const items = useMemo(() => FAQS.map(f => ({ ...f, title: f.q, text: f.a + " " + f.cat })), []);
  const results = q.trim() ? rank(items, q) : null;
  const item = f => (
    <Acc key={f.id} id={f.id} title={f.q} open={open[f.id]} onToggle={() => toggle(f.id)}>
      <p><Rich t={f.a} /></p>
      {f.planned && <p><span className="mv-tag">Planned feature</span> Not yet available.</p>}
      {f.link && <p><a href={f.link[0]}>Read more: {f.link[1]}</a></p>}
      {f.rev && <p className="mv-small">Last reviewed: {f.rev}</p>}
      <Vote id={f.id} />
      <p className="mv-small"><a href={"/faq#" + f.id}>Link to this answer</a> · <a href={"/help?report=" + f.id + "#contact"}>Report outdated or incorrect answer</a></p>
    </Acc>);
  return (
    <Shell title="Frequently Asked Questions" intro="Find answers about the marketplace, accounts, ordering, selling, subscriptions, AI and data protection.">
      <section className="mv-sec"><div className="mv-wrap">
        <label htmlFor="faq-q" className="mv-small">Search questions</label>
        <input id="faq-q" className="mv-in" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search, e.g. refund, verification, AI" style={{ maxWidth: 640, marginBottom: 16 }} />
        <div className="mv-chips" role="group" aria-label="Categories">
          {["all", ...CATS].map(c => <button key={c} className="mv-chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c === "all" ? "All" : c}</button>)}
        </div>
        <div aria-live="polite">
          {results ? (results.length ? <><p className="mv-small">{results.length} result{results.length > 1 ? "s" : ""}</p>{results.filter(f => cat === "all" || f.cat === cat).map(item)}</> :
            <div className="mv-info"><b>No answers found.</b> Try different words (for example “billing”, “account”, “delivery”), pick a category, or <a href="/help#contact">contact support</a>.</div>) :
            CATS.filter(c => cat === "all" || c === cat).map(c => {
              const list = FAQS.filter(f => f.cat === c); if (!list.length) return null;
              const show = cat !== "all" || more[c] ? list : list.slice(0, 3);
              return <div key={c} style={{ marginBottom: 28 }}><h2 style={{ fontSize: "1.2rem" }}>{c}</h2>{show.map(item)}
                {cat === "all" && list.length > 3 && !more[c] && <button className="mv-chip" onClick={() => setMore({ ...more, [c]: true })}>Show all {list.length}</button>}</div>;
            })}
        </div>
        <div className="mv-info">Still need help? <a href="/help#contact">Contact support</a>.</div>
      </div></section>
    </Shell>
  );
}
