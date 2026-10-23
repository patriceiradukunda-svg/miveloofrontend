/* eslint-disable @typescript-eslint/ban-ts-comment, @next/next/no-html-link-for-pages, @typescript-eslint/no-unused-vars */
// @ts-nocheck
"use client";
export const CSS = `
.mv{--b:#F5A900;--bs:color-mix(in srgb,var(--b) 9%,#fff);--bd:color-mix(in srgb,var(--b) 78%,#000);--ink:#18221c;--mut:#566159;--line:#e1e7e0;--bg:#f6f8f5;color:var(--ink);font-family:inherit;line-height:1.65;background:#fff;-webkit-text-size-adjust:100%;overflow-x:clip}
.mv *,.mv *::before,.mv *::after{box-sizing:border-box}
.mv a{color:var(--bd)}
.mv img{max-width:100%;height:auto}
.mv-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.mv-hero{background:var(--bs);border-bottom:1px solid var(--line);padding:clamp(28px,6vw,56px) 0 clamp(24px,4vw,36px)}
.mv-crumb{font-size:.85rem;color:var(--mut);margin-bottom:10px}
.mv-hero h1{font-size:clamp(1.75rem,4.5vw,2.7rem);line-height:1.15;margin:0 0 12px;letter-spacing:-.01em}
.mv-hero p{margin:0;max-width:680px;color:var(--mut);font-size:clamp(1rem,2vw,1.1rem)}
.mv-meta{display:flex;flex-wrap:wrap;gap:6px 20px;margin:18px 0 0;padding:0;list-style:none;font-size:.875rem;color:var(--mut)}
.mv-meta b{color:var(--ink)}
.mv-sec{padding:clamp(28px,5vw,48px) 0}
.mv-sec.alt{background:var(--bg)}
.mv-sec h2{font-size:clamp(1.3rem,3vw,1.75rem);margin:0 0 8px;line-height:1.25}
.mv-lead{color:var(--mut);margin:0 0 20px}
.mv-grid{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))}
.mv-card{border:1px solid var(--line);border-radius:14px;padding:18px;background:#fff;text-align:left;font:inherit;color:inherit;width:100%;display:block;text-decoration:none}
button.mv-card{cursor:pointer}
button.mv-card:hover,button.mv-card[aria-pressed=true]{border-color:var(--b);background:var(--bs)}
.mv-card h3{margin:0 0 6px;font-size:1.05rem}
.mv-card p{margin:0;color:var(--mut);font-size:.92rem}
.mv-in,.mv-sel,.mv-ta{width:100%;font:inherit;font-size:16px;padding:12px 14px;border:1px solid #b9c4bb;border-radius:10px;background:#fff;color:var(--ink);min-height:44px}
.mv-ta{min-height:130px;resize:vertical}
.mv :focus-visible{outline:3px solid color-mix(in srgb,var(--b) 55%,#fff);outline-offset:2px}
.mv-search{display:flex;gap:8px;max-width:640px;margin-top:22px}
.mv-btn{font:inherit;font-weight:600;min-height:44px;padding:10px 18px;border-radius:10px;border:1px solid var(--b);background:var(--b);color:#fff;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}
.mv .mv-btn{color:#fff}
.mv-btn:hover{background:var(--bd)}
.mv-btn.o,.mv .mv-btn.o{background:#fff;color:var(--bd)}
.mv-btn.o:hover{background:var(--bs)}
.mv-btn[disabled]{opacity:.6;cursor:wait}
.mv-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 20px}
.mv-chip{font:inherit;font-size:.9rem;min-height:40px;padding:6px 14px;border-radius:999px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--ink)}
.mv-chip[aria-pressed=true]{background:var(--b);border-color:var(--b);color:#fff}
.mv-acc{border:1px solid var(--line);border-radius:12px;margin:0 0 10px;background:#fff;scroll-margin-top:16px}
.mv-acc h3{margin:0;font-size:1rem}
.mv-acc button{all:unset;box-sizing:border-box;width:100%;display:flex;justify-content:space-between;gap:12px;align-items:center;padding:14px 16px;cursor:pointer;font-weight:600;min-height:48px}
.mv-acc button:focus-visible{outline:3px solid color-mix(in srgb,var(--b) 55%,#fff)}
.mv-acc-p{padding:0 16px 16px;color:var(--ink)}
.mv-acc-p p{margin:.4rem 0}
.mv-small{font-size:.85rem;color:var(--mut)}
.mv-tag{display:inline-block;font-size:.75rem;padding:2px 8px;border-radius:999px;background:var(--bs);color:var(--bd);margin-right:6px}
.mv-notice{border:1px solid #e6cf8a;background:#fff8e1;border-radius:12px;padding:12px 16px;margin:0 0 20px;font-size:.92rem}
.mv-info{border:1px solid var(--line);background:var(--bs);border-radius:12px;padding:14px 16px;margin:16px 0}
.mv-ph{background:#fff3b0;color:inherit;padding:0 3px;border-radius:3px}
.mv-doc{display:grid;grid-template-columns:260px minmax(0,1fr);gap:40px;padding:32px 0 64px}
.mv-toc{position:sticky;top:16px;align-self:start;max-height:calc(100vh - 32px);overflow:auto;font-size:.9rem}
.mv-toc strong{display:block;margin-bottom:8px}
.mv-toc a{display:block;padding:6px 10px;border-left:2px solid var(--line);text-decoration:none;color:var(--mut)}
.mv-toc a:hover{border-color:var(--b);color:var(--ink)}
.mv-tocm{display:none}
.mv-art section{scroll-margin-top:72px;margin-bottom:34px}
.mv-art h2{font-size:clamp(1.25rem,3vw,1.6rem);margin:0 0 10px;line-height:1.25}
.mv-art h3{font-size:1.05rem;margin:18px 0 6px}
.mv-art p,.mv-art li{max-width:75ch}
.mv-art ul{padding-left:1.2rem}
.mv-tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;margin:12px 0}
.mv-tablewrap table{border-collapse:collapse;width:100%;min-width:560px;font-size:.9rem}
.mv-tablewrap th,.mv-tablewrap td{padding:10px 12px;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
.mv-tablewrap th{background:var(--bg)}
.mv-form{display:grid;gap:16px;max-width:720px}
.mv-form label{display:block;font-weight:600;margin-bottom:6px}
.mv-err{color:#b3261e;font-size:.85rem;margin-top:4px}
.mv-form [aria-invalid=true]{border-color:#b3261e}
.mv-ok{border:1px solid #9bd0ac;background:#effaf2;border-radius:12px;padding:16px}
.mv-bad{border:1px solid #e8aaa5;background:#fdf0ef;border-radius:12px;padding:16px}
.mv-hp{position:absolute;left:-9999px;height:0;overflow:hidden}
.mv-top{position:fixed;right:16px;bottom:16px;z-index:50;box-shadow:0 4px 14px rgba(0,0,0,.2)}
.mv-res{list-style:none;padding:0;margin:0;display:grid;gap:10px}
.mv-flinks{display:flex;flex-wrap:wrap;gap:8px 18px}
.mv-flinks a{color:inherit}
.mv-cb{position:fixed;left:0;right:0;bottom:0;z-index:9999;border-top:1px solid var(--line);box-shadow:0 -6px 24px rgba(0,0,0,.12);padding:16px 0;max-height:92vh;overflow:auto}
.mv-cb .mv-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.mv-cb .mv-row .mv-btn{flex:1 1 150px}
.mv-cb label{display:flex;gap:10px;align-items:flex-start;padding:8px 0}
.mv-cb input[type=checkbox],.mv-prefs input[type=checkbox]{width:22px;height:22px;margin-top:2px;accent-color:var(--b)}
.mv-prefs label{display:flex;gap:10px;align-items:flex-start;padding:8px 0}
@media(max-width:860px){
 .mv-doc{grid-template-columns:1fr;gap:12px;padding-top:16px}
 .mv-toc{display:none}
 .mv-tocm{display:block;position:sticky;top:0;z-index:20;background:#fff;border:1px solid var(--line);border-radius:12px;padding:4px 12px}
 .mv-tocm summary{cursor:pointer;font-weight:600;min-height:44px;display:flex;align-items:center}
 .mv-tocm a{display:block;padding:10px 4px;text-decoration:none;border-top:1px solid var(--line)}
 .mv-tocm div{max-height:60vh;overflow:auto}
}
@media(max-width:520px){.mv-search{flex-direction:column}.mv-btn{width:100%}.mv-top{width:auto}}
@media(prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}

/* brand-override */
.mv{--b:#00645F;--bd:#004744;--bs:#DCEFEE;--ink:#12261F;--mut:#44574F;--line:#E4DCC6;--bg:#FFF8E8;font-family:"Plus Jakarta Sans Variable",system-ui,sans-serif}
.mv h1,.mv h2,.mv-art h2{font-family:"Fraunces Variable",Georgia,serif}
.mv-hero{background:#FFF8E8;border-bottom:4px solid #F5A900}
.mv-tag{background:#FFF0C9;color:#12261F}
.mv-ph{background:#FFF0C9}

/* design-v2 */
.mv{background:#FFFBF1}
.mv-hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#00645F 0%,#004744 100%);color:#fff;border-bottom:6px solid #F5A900;padding:clamp(36px,7vw,84px) 0 clamp(32px,5vw,60px)}
.mv-hero::before{content:"";position:absolute;right:-120px;top:-150px;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,rgba(245,169,0,.38),transparent 70%)}
.mv-hero::after{content:"";position:absolute;left:-90px;bottom:-170px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(19,141,59,.5),transparent 70%)}
.mv-hero-in{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:32px}
.mv-hero-t{min-width:0}
.mv-hero h1{color:#fff;font-size:clamp(2rem,5.2vw,3.4rem)}
.mv-hero p{color:#DCEFEE}
.mv-crumb,.mv-crumb a{color:#BFE3DF}
.mv-meta li{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);padding:4px 12px;border-radius:999px;color:#fff}
.mv-meta b{color:#FFD468}
.mv-hero-ic{flex:none;width:clamp(88px,14vw,150px);aspect-ratio:1;border-radius:32% 12% 32% 12%;background:#F5A900;display:grid;place-items:center;font-size:clamp(2.6rem,6vw,4.8rem);box-shadow:0 18px 40px -16px rgba(0,0,0,.55);transform:rotate(-4deg)}
.mv-search .mv-in{height:56px;border:0;border-radius:999px;padding:0 24px;box-shadow:0 12px 30px -14px rgba(0,0,0,.6)}
.mv-prog{position:fixed;top:0;left:0;height:4px;background:#F5A900;z-index:60;transition:width .1s linear}
.mv-sec.alt{background:#FFF8E8}
.mv-art section{background:#fff;border:1px solid var(--line);border-left:6px solid #F5A900;border-radius:18px;padding:clamp(18px,3vw,32px);box-shadow:0 1px 0 rgba(18,38,31,.05),0 14px 30px -22px rgba(0,100,95,.45)}
.mv-art h2{color:#004744}
.mv-art h3{color:#00645F}
.mv-toc a.on,.mv-tocm a.on{border-color:#F5A900;background:#FFF0C9;color:#12261F;font-weight:600}
.mv-card{border-radius:18px;transition:transform .15s,box-shadow .15s,border-color .15s}
a.mv-card:hover,button.mv-card:hover{transform:translateY(-3px);box-shadow:0 16px 30px -20px rgba(0,100,95,.6);border-color:#00645F}
.mv-ico{display:grid;place-items:center;width:52px;height:52px;border-radius:16px;background:#FFF0C9;font-size:1.6rem;margin-bottom:12px}
.mv-acc{border-radius:14px;box-shadow:0 8px 20px -18px rgba(0,100,95,.5)}
.mv-acc button:hover{background:#FFF8E8;border-radius:14px}
.mv-chip[aria-pressed=true]{background:#00645F;border-color:#00645F}
.mv .mv-btn.gold{background:#F5A900;border-color:#F5A900;color:#12261F}
.mv .mv-btn.gold:hover{background:#FFC83D}
.mv-rel{margin-top:8px}
.mv-cta{display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#00645F,#004744);color:#fff;border-radius:22px;padding:26px 30px;margin-top:32px}
.mv-cta h3{color:#fff;margin:0}
.mv-cta p{margin:4px 0 0;color:#DCEFEE}
@media(max-width:860px){.mv-hero-ic{display:none}.mv-art section{border-left-width:4px}}

/* cookies-responsive */
.mv-art p,.mv-art li,.mv-art h2,.mv-art h3{overflow-wrap:anywhere}
.mv-prefs{padding:clamp(12px,3vw,20px)}
.mv-prefs > div .mv-btn{flex:1 1 150px}
@media(max-width:1100px){
 .mv-cktable{overflow:visible;border:0;border-radius:0;margin:12px 0}
 .mv-cktable table{display:block;min-width:0;width:100%}
 .mv-cktable thead{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
 .mv-cktable tbody,.mv-cktable tr,.mv-cktable td{display:block;width:100%}
 .mv-cktable tr{background:#fff;border:1px solid var(--line);border-left:5px solid #F5A900;border-radius:14px;padding:4px 14px;margin:0 0 12px}
 .mv-cktable td{display:grid;grid-template-columns:minmax(92px,36%) minmax(0,1fr);gap:10px;padding:9px 0;border-bottom:1px solid var(--line);overflow-wrap:anywhere}
 .mv-cktable td:last-child{border-bottom:0}
 .mv-cktable td::before{content:attr(data-label);font-weight:700;font-size:.78rem;color:#00645F;text-transform:uppercase;letter-spacing:.03em}
 .mv-cktable td:first-child{font-weight:700;color:#004744;font-size:1rem}
}
@media(min-width:641px) and (max-width:1100px){
 .mv-cktable tbody{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
 .mv-cktable tr{margin:0}
}
@media(max-width:640px){
 .mv-hero{padding-top:28px;padding-bottom:24px}
 .mv-art section{padding:16px}
 .mv-cb{padding:14px 0 calc(14px + env(safe-area-inset-bottom,0px));max-height:85vh}
 .mv-cb .mv-row{flex-direction:column}
 .mv-cb .mv-row .mv-btn{flex:none;width:100%}
 .mv-prefs > div .mv-btn{flex:1 1 100%}
 .mv-cta{padding:20px;flex-direction:column;align-items:flex-start}
 .mv-cta .mv-btn{width:100%}
}
@media(max-width:360px){.mv-wrap{padding:0 14px}.mv-cktable td{grid-template-columns:1fr;gap:2px}}
`;
