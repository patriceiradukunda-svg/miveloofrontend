/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { Shell, Rich, clean } from "./ui";
import { DOCS } from "./policies";
import { ROUTES, VERSION, EFFECTIVE, UPDATED, COOKIES, MARKETING_USED } from "./config";
import "./consent-boot";

function Block({ b, components }) {
  if (typeof b === "string") { const c = clean(b); return c ? <p>{c}</p> : null; }
  if (Array.isArray(b)) return <ul>{b.filter(x => clean(x)).map((x, i) => <li key={i}>{clean(x)}</li>)}</ul>;
  if (b.h) return <h3>{b.h}</h3>;
  if (b.table) return <div className="mv-tablewrap" tabIndex={0}><table><thead><tr>{b.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{b.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><Rich t={c} /></td>)}</tr>)}</tbody></table></div>;
  if (b.component) { const C = components[b.component]; return C ? <C /> : null; }
  return null;
}

export function PolicyDoc({ doc, components = {} }) {
  const [tocOpen, setTocOpen] = useState(false);
  const [act, setAct] = useState(""); const [pct, setPct] = useState(0);
  useEffect(() => {
    const ids = doc.sections.map(s => s.id);
    const onScroll = () => {
      const h = document.documentElement; const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
      let cur = ids[0];
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= 140) cur = id; }
      setAct(cur);
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [doc]);
  const links = doc.sections.map(s => <a key={s.id} className={act === s.id ? "on" : undefined} href={"#" + s.id} onClick={() => setTocOpen(false)}>{s.title}</a>);
  const related = doc.related.map(h => ROUTES.find(r => r.href === h)).filter(Boolean);
  return (
    <Shell title={doc.title} intro={doc.intro} meta={
      <ul className="mv-meta"><li><b>Version:</b> {VERSION}</li><li><b>Effective:</b> <Rich t={EFFECTIVE} /></li><li><b>Last updated:</b> {UPDATED}</li></ul>}>
      <div className="mv-prog" style={{ width: pct + "%" }} aria-hidden="true" />
      <div className="mv-wrap mv-doc">
        <details className="mv-tocm" open={tocOpen} onToggle={e => setTocOpen(e.currentTarget.open)}><summary>Contents</summary><div>{links}</div></details>
        <nav className="mv-toc" aria-label="Contents"><strong>Contents</strong>{links}</nav>
        <article className="mv-art">
          {doc.sections.map(s => <section key={s.id} id={s.id}><h2>{s.title}</h2>{s.blocks.map((b, i) => <Block key={i} b={b} components={components} />)}</section>)}
          <div className="mv-rel"><h2>Related pages</h2><div className="mv-grid">{related.map(r => <a key={r.href} className="mv-card" href={r.href}><h3>{r.label}</h3><p>Read more →</p></a>)}</div></div>
          <div className="mv-cta"><div><h3>Still have a question?</h3><p>Our support team is happy to help.</p></div><a className="mv-btn gold" href="/help#contact">Contact support</a></div>
        </article>
      </div>
    </Shell>
  );
}

function Inventory() {
  if (!COOKIES.length) return <div className="mv-info">No cookies are currently listed.</div>;
  const cols = ["name", "provider", "purpose", "category", "party", "duration", "essential", "consent"];
  const head = ["Name", "Provider", "Purpose", "Category", "Party", "Duration", "Essential?", "Consent needed?"];
  return <div className="mv-tablewrap mv-cktable"><table><thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{COOKIES.map((c, i) => <tr key={i}>{cols.map((k, j) => <td key={k} data-label={head[j]}>{c[k]}</td>)}</tr>)}</tbody></table></div>;
}

function Prefs() {
  const [s, setS] = useState({ functional: false, analytics: false, marketing: false });
  const [rec, setRec] = useState(null); const [ready, setReady] = useState(true);
  useEffect(() => {
    const c = window.mivelooConsent; if (!c) { setReady(false); return; }
    const sync = () => { const g = c.get(); setRec(g); if (g) setS({ functional: !!g.functional, analytics: !!g.analytics, marketing: !!g.marketing }); };
    sync(); return c.subscribe(sync);
  }, []);
  if (!ready) return <div className="mv-bad">Consent manager not loaded. Import consent-boot in your app root.</div>;
  const opt = (k, t, d) => <label><input type="checkbox" checked={s[k]} onChange={e => setS({ ...s, [k]: e.target.checked })} /><span><b>{t}</b><br /><span className="mv-small">{d}</span></span></label>;
  return (
    <div className="mv-prefs mv-info">
      <label><input type="checkbox" checked disabled /><span><b>Strictly necessary</b> <span className="mv-tag">Always active</span><br /><span className="mv-small">Security, sessions and essential functionality.</span></span></label>
      {opt("functional", "Functional", "Optional preferences and convenience features.")}
      {opt("analytics", "Analytics", "Optional usage and performance measurement.")}
      {MARKETING_USED && opt("marketing", "Marketing", "Optional advertising-related technologies.")}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        <button className="mv-btn o" onClick={() => window.mivelooConsent.acceptAll()}>Accept all</button>
        <button className="mv-btn o" onClick={() => window.mivelooConsent.rejectOptional()}>Reject optional</button>
        <button className="mv-btn o" onClick={() => window.mivelooConsent.save(s)}>Save my choices</button>
      </div>
      <p className="mv-small" role="status">{rec ? "Saved on " + new Date(rec.ts).toLocaleDateString() + " (consent version " + rec.v + ")." : "No choice saved yet."}</p>
    </div>
  );
}

export const PrivacyPage = () => <PolicyDoc doc={DOCS.privacy} />;
export const TermsPage = () => <PolicyDoc doc={DOCS.terms} />;
export const SupplierTermsPage = () => <PolicyDoc doc={DOCS.supplier} />;
export const SchoolTermsPage = () => <PolicyDoc doc={DOCS.school} />;
export const DataAiPage = () => <PolicyDoc doc={DOCS.dataai} />;
export const CookiePage = () => <PolicyDoc doc={DOCS.cookie} components={{ inventory: Inventory, prefs: Prefs }} />;
