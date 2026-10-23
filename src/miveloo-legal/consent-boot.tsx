/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
import { CSS } from "./styles";
import { MARKETING_USED } from "./config";
const KEY = "miveloo_consent", VERSION = 1, MAX_AGE = 365 * 24 * 3600 * 1000;
function read() { try { const j = JSON.parse(localStorage.getItem(KEY) || "null"); if (j && j.v === VERSION && Date.now() - j.ts < MAX_AGE) return j; } catch {} return null; }
function init() {
  if (typeof window === "undefined" || window.mivelooConsent) return;
  const subs = new Set(); let el = null;
  const api = {
    get: read,
    has: c => c === "necessary" ? true : !!(read() && read()[c]),   // third-party scripts MUST call has("analytics") before loading
    save(c) { const rec = { v: VERSION, functional: !!c.functional, analytics: !!c.analytics, marketing: MARKETING_USED && !!c.marketing, ts: Date.now() };
      try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch {}
      if (!rec.functional) { /* clear optional functional keys here if you add any */ }
      close(); subs.forEach(f => f(rec)); window.dispatchEvent(new CustomEvent("miveloo:consent", { detail: rec })); },
    acceptAll() { api.save({ functional: true, analytics: true, marketing: true }); },
    rejectOptional() { api.save({}); },
    subscribe(f) { subs.add(f); return () => subs.delete(f); },
    open: () => show(true),
  };
  window.mivelooConsent = api;
  function close() { if (el) { el.remove(); el = null; } }
  function show(custom) {
    close(); if (!document.getElementById("mv-css")) { const s = document.createElement("style"); s.id = "mv-css"; s.textContent = CSS; document.head.appendChild(s); }
    const cur = read() || {}; el = document.createElement("div"); el.className = "mv mv-cb"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", "Cookie preferences");
    const row = (id, t, d, checked, disabled) => '<label><input type="checkbox" id="' + id + '"' + (checked ? " checked" : "") + (disabled ? " disabled" : "") + '><span><b>' + t + '</b><br><span class="mv-small">' + d + "</span></span></label>";
    el.innerHTML = '<div class="mv-wrap"><b>Your cookie choices</b><p style="margin:6px 0 0">We use essential technologies to run and secure Miveloo. Optional ones are off unless you allow them. See our <a href="/cookies">Cookie Policy</a>.</p>' +
      '<div id="mv-more" ' + (custom ? "" : "hidden") + ">" + row("c-n", "Strictly necessary", "Security, sign-in and saving this choice. Always active.", true, true) + row("c-f", "Functional", "Optional preferences such as language.", !!cur.functional) + row("c-a", "Analytics", "Optional usage and performance measurement.", !!cur.analytics) + (MARKETING_USED ? row("c-m", "Marketing", "Optional advertising-related technologies.", !!cur.marketing) : "") + "</div>" +
      '<div class="mv-row"><button class="mv-btn o" data-a="all">Accept all</button><button class="mv-btn o" data-a="none">Reject optional</button><button class="mv-btn o" data-a="custom">' + (custom ? "Save my choices" : "Customise") + "</button></div></div>";
    el.addEventListener("click", e => { const a = e.target.getAttribute && e.target.getAttribute("data-a"); if (!a) return;
      if (a === "all") api.acceptAll(); else if (a === "none") api.rejectOptional();
      else if (el.querySelector("#mv-more").hidden) { el.querySelector("#mv-more").hidden = false; e.target.textContent = "Save my choices"; }
      else api.save({ functional: el.querySelector("#c-f").checked, analytics: el.querySelector("#c-a").checked, marketing: !!el.querySelector("#c-m") && el.querySelector("#c-m").checked }); });
    document.body.appendChild(el);
  }
  document.addEventListener("click", e => { const t = e.target.closest && e.target.closest("[data-cookie-settings],a[href='#cookie-settings']"); if (t) { e.preventDefault(); show(true); } });
  const go = () => { if (!read()) show(false); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
}
init();
