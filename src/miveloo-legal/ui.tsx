/* eslint-disable @typescript-eslint/ban-ts-comment, @next/next/no-html-link-for-pages */
// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { CSS } from "./styles";
import { ROUTES, DRAFT_NOTICE } from "./config";

export const clean = (t) => String(t ?? "").replace(/\s*\[[^\]]*\]/g, "").replace(/\s+([.,;:])/g, "$1").replace(/:\./g, ".").replace(/\s{2,}/g, " ").trim();
export const Rich = ({ t }) => <>{clean(t)}</>;

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 600); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  if (!show) return null;
  return <button type="button" className="mv-btn mv-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top">↑ Top</button>;
}

export function Shell({ title, intro, meta, children }) {
  const ICONS = [[/supplier/i, "🌾"], [/school/i, "🏫"], [/terms of service/i, "📜"], [/cookie/i, "🍪"], [/privacy/i, "🔒"], [/data/i, "🧠"], [/frequently/i, "❓"], [/help/i, "💬"]];
  const icon = (ICONS.find(([r]) => r.test(title)) || [0, "📄"])[1];
  return (
    <div className="mv">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="mv-hero"><div className="mv-wrap mv-hero-in">
        <div className="mv-hero-t">
          <nav className="mv-crumb" aria-label="Breadcrumb"><a href="/">Home</a> / <span>{title}</span></nav>
          <h1>{title}</h1>{intro && <p>{intro}</p>}{meta}
        </div>
        <div className="mv-hero-ic" aria-hidden="true">{icon}</div>
      </div></header>
      {children}
      <BackToTop />
    </div>
  );
}

export function Acc({ id, title, open, onToggle, children }) {
  return (
    <div className="mv-acc" id={id}>
      <h3><button type="button" aria-expanded={!!open} aria-controls={id + "-p"} onClick={onToggle}><span>{title}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button></h3>
      {open && <div className="mv-acc-p" id={id + "-p"} role="region">{children}</div>}
    </div>
  );
}

export function LegalFooterLinks() {
  return (<><style dangerouslySetInnerHTML={{ __html: CSS }} />
    <nav className="mv-flinks" aria-label="Legal and support">
      {ROUTES.map(r => <a key={r.href} href={r.href}>{r.label}</a>)}
      <a href="#cookie-settings" data-cookie-settings>Cookie settings</a>
    </nav></>);
}

// Generic validated form: loading / success / error states.
export function SubmitForm({ fields, endpoint, type, submitLabel = "Send", successTitle = "Thank you", mailto = "", initial = {} }) {
  const [v, setV] = useState(initial); const [err, setErr] = useState({}); const [st, setSt] = useState("idle"); const [ref, setRef] = useState("");
  const set = (n, x) => setV(p => ({ ...p, [n]: x }));
  const vis = f => !f.showIf || f.showIf(v);
  const validate = () => {
    const e = {};
    fields.filter(vis).forEach(f => {
      const x = v[f.name]; const empty = x === undefined || x === null || (typeof x === "string" && !x.trim());
      if (f.required && empty) e[f.name] = "This field is required.";
      else if (!empty && f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)) e[f.name] = "Enter a valid email address.";
      else if (!empty && f.min && String(x).trim().length < f.min) e[f.name] = "Please write at least " + f.min + " characters.";
      else if (f.type === "file" && x && x.size > 1.5 * 1024 * 1024) e[f.name] = "File must be smaller than 1.5 MB.";
    });
    return e;
  };
  const submit = async ev => {
    ev.preventDefault(); if (v._hp) return;
    const e = validate(); setErr(e); const first = Object.keys(e)[0];
    if (first) { document.getElementById("f-" + type + "-" + first)?.focus(); return; }
    setSt("loading");
    try {
      const fd = new FormData(); fd.append("type", type);
      fields.filter(vis).forEach(f => { const x = v[f.name]; if (x !== undefined && x !== "") fd.append(f.name, x); });
      const r = await fetch(endpoint, { method: "POST", body: fd });
      if (!r.ok) throw new Error(String(r.status));
      let j = {}; try { j = await r.json(); } catch {}
      setRef(j.reference || ""); setSt("done");
    } catch { setSt("error"); }
  };
  if (st === "done") return (
    <div className="mv-ok" role="status"><h3 style={{ margin: "0 0 6px" }}>{successTitle}</h3>
      <p style={{ margin: 0 }}>Your message has been received.{ref && <> Your reference number is <b>{ref}</b>. Please keep it.</>} We will reply by your chosen channel. We cannot promise a specific response time unless one is stated for your issue.</p></div>);
  return (
    <form className="mv-form" onSubmit={submit} noValidate>
      {st === "error" && <div className="mv-bad" role="alert"><b>We could not send your message.</b> Please check your connection and try again.{mailto && <> Or email <a href={"mailto:" + mailto}>{mailto}</a>.</>}</div>}
      <div className="mv-hp" aria-hidden="true"><label>Leave empty<input tabIndex={-1} autoComplete="off" value={v._hp || ""} onChange={e => set("_hp", e.target.value)} /></label></div>
      {fields.filter(vis).map(f => {
        const id = "f-" + type + "-" + f.name; const common = { id, "aria-invalid": !!err[f.name], "aria-describedby": err[f.name] ? id + "-e" : undefined, required: !!f.required };
        return (
          <div key={f.name}>
            <label htmlFor={id}>{f.label}{!f.required && <span className="mv-small"> (optional)</span>}</label>
            {f.type === "select" ? <select className="mv-sel" {...common} value={v[f.name] || ""} onChange={e => set(f.name, e.target.value)}><option value="">Select…</option>{f.options.map(o => <option key={o} value={o}>{o}</option>)}</select>
              : f.type === "textarea" ? <textarea className="mv-ta" {...common} value={v[f.name] || ""} onChange={e => set(f.name, e.target.value)} />
              : f.type === "file" ? <input type="file" className="mv-in" {...common} accept="image/*,.pdf" onChange={e => set(f.name, e.target.files?.[0])} />
              : <input className="mv-in" type={f.type || "text"} {...common} value={v[f.name] || ""} onChange={e => set(f.name, e.target.value)} autoComplete={f.auto} />}
            {f.help && <div className="mv-small">{f.help}</div>}
            {err[f.name] && <div className="mv-err" id={id + "-e"}>{err[f.name]}</div>}
          </div>);
      })}
      <div><button type="submit" className="mv-btn" disabled={st === "loading"}>{st === "loading" ? "Sending…" : submitLabel}</button></div>
    </form>
  );
}
