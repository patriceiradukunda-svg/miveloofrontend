/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
const SYN = { login:["sign","password","account","access"], signin:["login","password"], password:["account","recovery","security"], refund:["billing","subscription","cancel"], invoice:["billing","subscription"], pay:["billing","payment"], price:["pricing","billing"], forecast:["ai","prediction","estimate"], predict:["ai","forecast"], delete:["data","privacy"], erase:["data","privacy"], hack:["security","compromise"], stolen:["security"], late:["delivery"], broken:["damaged","delivery"], missing:["delivery"], verify:["verification","account"], supplier:["seller","listing"], seller:["supplier","listing"], buy:["request","order","school"], kinyarwanda:["language"] };
const norm = s => String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const stem = w => w.replace(/(ing|ed|es|s)$/, "");
const toks = s => norm(s).split(/[^a-z0-9]+/).filter(w => w.length > 1).map(stem);
export function rank(items, query) {
  const qt = toks(query); if (!qt.length) return items;
  const exp = new Set(qt); qt.forEach(t => (SYN[t] || []).forEach(x => exp.add(stem(x))));
  return items.map(it => {
    const ti = [...new Set(toks(it.title))], bo = [...new Set(toks(it.text || ""))]; let s = 0;
    qt.forEach(t => { if (ti.includes(t)) s += 5; else if (ti.some(x => x.startsWith(t))) s += 3; if (bo.includes(t)) s += 2; else if (bo.some(x => x.startsWith(t))) s += 1; });
    exp.forEach(t => { if (!qt.includes(t)) { if (ti.includes(t)) s += 1; if (bo.includes(t)) s += .5; } });
    return { it, s };
  }).filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.it);
}
