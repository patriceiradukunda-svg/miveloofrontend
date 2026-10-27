import Link from 'next/link';
import type { ReactNode } from 'react';

// A deliberately small, safe subset: ## / ### headings, - lists, 1. lists, **bold**, [text](https://…) and [text](/path). Everything is rendered as React text, never raw HTML.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;
const linkCls = 'font-semibold text-teal underline underline-offset-4';

function inline(text: string, k: string): ReactNode[] {
  const out: ReactNode[] = []; let last = 0; let n = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0; const tok = m[0];
    if (at > last) out.push(text.slice(last, at));
    if (tok.startsWith('**')) out.push(<strong key={`${k}-${n}`}>{tok.slice(2, -2)}</strong>);
    else {
      const l = LINK.exec(tok); const label = l?.[1] ?? tok; const href = l?.[2] ?? '';
      if (href.startsWith('//')) out.push(label);
      else if (href.startsWith('/')) out.push(<Link key={`${k}-${n}`} href={href} className={linkCls}>{label}</Link>);
      else out.push(<a key={`${k}-${n}`} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>{label}</a>);
    }
    last = at + tok.length; n++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r\n/g, '\n').replace(/^(#{2,3} .*)$/gm, '\n$1\n').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-ink">
      {blocks.map((b, i) => {
        const lines = b.split('\n'); const first = lines[0] ?? '';
        if (first.startsWith('### ')) return <h3 key={i} className="pt-2 text-xl font-semibold text-teal-dark">{inline(first.slice(4), `h${i}`)}</h3>;
        if (first.startsWith('## ')) return <h2 key={i} className="pt-4 font-display text-2xl font-semibold text-teal-dark">{inline(first.slice(3), `h${i}`)}</h2>;
        if (lines.every((l) => /^[-*] /.test(l))) return <ul key={i} className="list-disc space-y-2 pl-6">{lines.map((l, j) => <li key={j}>{inline(l.slice(2), `u${i}-${j}`)}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l))) return <ol key={i} className="list-decimal space-y-2 pl-6">{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ''), `o${i}-${j}`)}</li>)}</ol>;
        return <p key={i}>{inline(lines.join(' '), `p${i}`)}</p>;
      })}
    </div>
  );
}
