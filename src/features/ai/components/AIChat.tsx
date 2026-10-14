"use client";
import { useState } from 'react';
import { askAssistant, type AIReply } from '../services/ai.service';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const SUGGEST = ['How did my purchasing change this term?', 'Which products are often short in my area?', 'Explain this price trend'];
type Msg = { from: 'me' | 'ai'; text: string; meta?: AIReply };
export function AIChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]); const [q, setQ] = useState(''); const [busy, setBusy] = useState(false);
  async function send(text: string) {
    if (!text.trim() || busy) return; setMsgs((m) => [...m, { from: 'me', text }]); setQ(''); setBusy(true);
    try { const r = await askAssistant(text); setMsgs((m) => [...m, { from: 'ai', text: r.text, meta: r }]); }
    catch { setMsgs((m) => [...m, { from: 'ai', text: 'Sorry, I could not answer just now. Please try again.' }]); } finally { setBusy(false); }
  }
  return (
    <div className="max-w-2xl space-y-4">
      <p className="rounded-xl bg-gold-tint p-3 text-sm">AI answers are estimates based on data you are allowed to see. They are not confirmed facts.</p>
      <div aria-live="polite" className="min-h-40 space-y-3">{msgs.map((m, i) => <p key={i} className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.from === 'me' ? 'ml-auto bg-teal text-cream' : 'bg-white shadow-card'}`}>{m.text}{m.meta?.assumptions && <span className="mt-1 block text-xs">Assumptions: {m.meta.assumptions.join('; ')}</span>}</p>)}{busy && <Spinner label="Thinking" />}</div>
      <div className="flex flex-wrap gap-2">{SUGGEST.map((s) => <button key={s} type="button" onClick={() => send(s)} className="min-h-11 rounded-full border border-ink/20 bg-white px-4 text-sm font-semibold hover:bg-cream-deep">{s}</button>)}</div>
      <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="flex gap-2"><label className="sr-only" htmlFor="ai-q">Your question</label><input id="ai-q" className="field" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about your data…" /><Button type="submit" disabled={busy}>Ask</Button></form>
    </div>
  );
}
