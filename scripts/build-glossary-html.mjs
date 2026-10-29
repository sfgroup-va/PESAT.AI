// Generate standalone HTML glossary (no server, no build) from lib/glossary-data.ts
// Run: node scripts/build-glossary-html.mjs [outDir]
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(process.argv[2] || resolve(root, "glossary-html"));
const backupDir = "F:/Zcode shenanigans/pesat-ai-backup/glossary-html";

const {
  GLOSSARY_CATEGORIES,
  GLOSSARY_TERMS,
  getAlphabeticalGroups,
  getRelatedTerms
} = await import(pathToFileURL(resolve(root, "lib/glossary-data.ts")).href);

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (s = "") => esc(s.replace(/\*\*/g, ""));
const bold = (s = "") =>
  esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

const CSS = `
*,*::before,*::after{box-sizing:border-box}
:root{
  --bg:#f8fafc;--card:#fff;--ink:#0f172a;--soft:#475569;--mute:#94a3b8;--line:#e2e8f0;
  --acc:#4f46e5;--acc2:#4338ca;--green:#059669;--amber:#b45309;--purple:#7e22ce;
  --header-bg:#0a0a14;
}
html[data-theme=dark]{
  --bg:#070710;--card:#0f111c;--ink:#f1f5f9;--soft:#cbd5e1;--mute:#64748b;--line:#1e293b;
  --acc:#818cf8;--acc2:#a5b4fc;--header-bg:#0a0a14;
}
*{margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--ink);line-height:1.65;-webkit-font-smoothing:antialiased}
a{color:var(--acc);text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:960px;margin:0 auto;padding:0 20px}

/* Pesat.AI Official Header Bar */
header.bar{
  position:sticky;top:0;z-index:40;
  background:#0a0a14;
  background-image:radial-gradient(circle at 50% 0%,rgba(99,102,241,0.22),transparent 30rem);
  backdrop-filter:blur(16px);
  border-bottom:1px solid rgba(255,255,255,0.1);
  color:#fff;
}
.bar-in{
  max-width:1120px;margin:0 auto;padding:12px 20px;
  display:flex;align-items:center;justify-content:space-between;gap:16px;
}
.brand{display:flex;align-items:baseline;gap:8px;text-decoration:none}
.brand-text{font-weight:800;font-size:1.15rem;color:#fff;letter-spacing:-.02em}
.brand-text span{color:#818cf8}
.brand-sub{font-size:.74rem;color:rgba(255,255,255,0.5);font-weight:600;padding:2px 7px;border-radius:999px;border:1px solid rgba(255,255,255,0.15)}
.bar nav{display:flex;align-items:center;gap:16px;font-size:.82rem;font-weight:600}
.bar nav a{color:rgba(255,255,255,0.7);transition:color .15s}
.bar nav a:hover{color:#fff;text-decoration:none}
.bar nav a.active{color:#fff;background:rgba(255,255,255,0.1);padding:4px 10px;border-radius:999px}
.bar-actions{display:flex;align-items:center;gap:10px}
.theme-btn{
  background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
  color:#fff;border-radius:999px;padding:6px 12px;cursor:pointer;font-size:.76rem;font-weight:600;
  transition:all .15s;
}
.theme-btn:hover{background:rgba(255,255,255,0.16);border-color:rgba(255,255,255,0.4)}
.btn-top{
  background:#fff;color:#0a0a14;padding:7px 16px;border-radius:999px;
  font-weight:700;font-size:.8rem;text-decoration:none;transition:transform .15s;
}
.btn-top:hover{text-decoration:none;opacity:.95;transform:translateY(-1px)}

main{padding:36px 0 72px}
.crumb{font-size:.75rem;color:var(--mute);margin-bottom:18px;display:flex;gap:6px;flex-wrap:wrap}
.crumb a{color:var(--acc)}
h1{font-size:2.2rem;line-height:1.2;letter-spacing:-.025em;font-weight:800}
h2{font-size:1.35rem;letter-spacing:-.015em;font-weight:700;margin:0 0 10px}
h3{font-size:1.05rem;font-weight:700}
.sub{color:var(--soft);font-size:1.02rem;margin-top:10px;max-width:72ch}
.badge{display:inline-flex;align-items:center;gap:6px;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,transparent);border:1px solid color-mix(in srgb,var(--acc) 22%,transparent);padding:5px 11px;border-radius:999px}
.box{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:22px 24px}
.lead{margin-top:22px;border-left:4px solid var(--acc);font-size:1.06rem;font-weight:500;line-height:1.7}
.takeaways{margin-top:22px;background:color-mix(in srgb,var(--green) 7%,transparent);border:1px solid color-mix(in srgb,var(--green) 22%,transparent);border-radius:16px;padding:20px 22px}
.takeaways .cap{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--green);margin-bottom:10px}
.takeaways ul{list-style:none;display:grid;gap:9px;font-size:.94rem;color:var(--soft)}
.takeaways li{display:flex;gap:9px}
.takeaways li b{color:var(--green)}
section.blk{margin-top:34px}
section.blk p{color:var(--soft);font-size:.97rem;margin-top:8px}
.warn{margin-top:34px;background:color-mix(in srgb,var(--purple) 7%,transparent);border:1px solid color-mix(in srgb,var(--purple) 24%,transparent);border-radius:16px;padding:20px 22px}
.warn .cap{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--purple);margin-bottom:8px}
.warn p{font-style:italic;color:var(--soft);font-size:.96rem}
table{width:100%;border-collapse:collapse;margin-top:12px;font-size:.9rem;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
th,td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top}
th{font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;color:var(--mute);background:color-mix(in srgb,var(--line) 40%,transparent)}
tr:last-child td{border-bottom:none}
details{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin-top:10px}
summary{cursor:pointer;font-weight:600;font-size:.95rem;list-style:none}
summary::-webkit-details-marker{display:none}
summary::after{content:"+";float:right;color:var(--acc);font-weight:400}
details[open] summary::after{content:"–"}
details p{margin-top:10px;padding-top:10px;border-top:1px solid var(--line);font-size:.92rem;color:var(--soft)}
.sources{margin-top:40px;padding-top:20px;border-top:1px solid var(--line);font-size:.82rem;color:var(--soft)}
.sources .cap{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:10px}
.sources ol{margin-left:18px;display:grid;gap:7px}
.cta{margin-top:44px;border-radius:22px;padding:30px 26px;color:#fff;background:linear-gradient(135deg,#312e81,#1e1b4b 55%,#0f172a);border:1px solid rgba(255,255,255,0.1)}
.cta h3{font-size:1.3rem;color:#fff}
.cta p{color:#c7d2fe;font-size:.94rem;margin-top:8px;max-width:65ch}
.cta .row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-top:20px}
.btn{background:#fff;color:#0f172a;padding:11px 22px;border-radius:999px;font-weight:700;font-size:.88rem;transition:opacity .15s}
.btn:hover{text-decoration:none;opacity:.9}
.ghost{color:#c7d2fe;font-size:.88rem;font-weight:600}
.related{margin-top:48px;padding-top:26px;border-top:1px solid var(--line)}
.related .cap{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--mute);margin-bottom:14px}
.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(270px,1fr))}
.card{display:block;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px 18px;transition:all .15s}
.card:hover{border-color:var(--acc);text-decoration:none;transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,0.04)}
.card .t{font-weight:700;font-size:.95rem;color:var(--ink)}
.card .d{font-size:.82rem;color:var(--soft);margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.5}
.card .m{font-size:.72rem;color:var(--mute);margin-top:12px;font-weight:600}
.search{position:relative;margin-top:28px}
.search input{width:100%;padding:14px 18px 14px 44px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--ink);font-size:.94rem;font-family:inherit;outline:none}
.search input:focus{border-color:var(--acc);box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 16%,transparent)}
.search svg{position:absolute;left:15px;top:50%;transform:translateY(-50%);width:18px;height:18px;stroke:var(--mute);fill:none;stroke-width:2}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.chip{background:var(--card);border:1px solid var(--line);color:var(--soft);padding:7px 14px;border-radius:999px;font-size:.78rem;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s}
.chip.on{background:var(--acc);border-color:var(--acc);color:#fff}
.az{display:flex;flex-wrap:wrap;gap:5px;margin-top:22px;font-size:.78rem;font-weight:700;position:sticky;top:58px;background:color-mix(in srgb,var(--bg) 95%,transparent);backdrop-filter:blur(10px);padding:10px 0;z-index:20;border-bottom:1px solid var(--line)}
.az a{border:1px solid var(--line);background:var(--card);color:var(--acc);width:30px;height:30px;display:grid;place-items:center;border-radius:8px;transition:all .15s}
.az a:hover{background:var(--acc);color:#fff;border-color:var(--acc);text-decoration:none}
.az span{color:var(--mute);opacity:.4;width:30px;height:30px;display:grid;place-items:center}
.group{margin-top:36px;scroll-margin-top:120px}
.group-h{display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:16px}
.group-h .L{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:var(--acc);color:#fff;font-weight:800;font-size:.95rem}
.group-h .n{font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--mute)}
.start{margin-top:28px;background:color-mix(in srgb,var(--amber) 8%,transparent);border:1px solid color-mix(in srgb,var(--amber) 25%,transparent);border-radius:18px;padding:22px 24px}
.start .cap{font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--amber);margin-bottom:6px}
.start p{font-size:.92rem;color:var(--soft);margin-bottom:14px}
.empty{display:none;text-align:center;padding:48px 20px;color:var(--mute);border:1px dashed var(--line);border-radius:16px;margin-top:24px}
.empty.on{display:block}

/* Pesat.AI Official Multi-column Footer */
footer.site-footer{
  border-top:1px solid rgba(255,255,255,0.1);
  background:#0a0a14;
  color:#fff;
  padding:56px 0 32px;
  margin-top:64px;
}
.footer-wrap{max-width:1120px;margin:0 auto;padding:0 20px}
.footer-grid{display:grid;gap:36px;grid-template-columns:1.4fr 1fr 1fr 1fr}
.footer-brand{font-size:1.3rem;font-weight:800;letter-spacing:-.02em}
.footer-brand span{color:#818cf8}
.footer-desc{margin-top:12px;max-width:280px;font-size:.84rem;line-height:1.7;color:rgba(255,255,255,0.6)}
.footer-btn{
  margin-top:20px;display:inline-flex;align-items:center;gap:8px;
  background:#fff;color:#0a0a14;padding:8px 18px;border-radius:999px;
  font-size:.82rem;font-weight:700;text-decoration:none;transition:transform .15s;
}
.footer-btn:hover{transform:translateY(-1px);text-decoration:none}
.footer-title{font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,0.4);margin-bottom:16px}
.footer-col ul{list-style:none;display:grid;gap:10px}
.footer-col a{font-size:.84rem;color:rgba(255,255,255,0.65);transition:color .15s}
.footer-col a:hover{color:#fff;text-decoration:none}
.footer-bottom{
  margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.1);
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;
  font-size:.76rem;color:rgba(255,255,255,0.4);
}
.footer-links{display:flex;align-items:center;gap:18px}
.footer-links a{color:rgba(255,255,255,0.6)}
.footer-links a:hover{color:#fff;text-decoration:none}

@media(max-width:860px){
  .footer-grid{grid-template-columns:1fr 1fr}
  .bar nav{display:none}
  h1{font-size:1.75rem}
}
@media(max-width:540px){
  .footer-grid{grid-template-columns:1fr}
}
`;

const THEME_JS = `(function(){try{var t=localStorage.getItem('gl-theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`;
const TOGGLE_JS = `
function glTheme(){var d=document.documentElement.getAttribute('data-theme')==='dark';document.documentElement.setAttribute('data-theme',d?'light':'dark');try{localStorage.setItem('gl-theme',d?'light':'dark')}catch(e){}}
function copyDef(btn, text){
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(function(){
      btn.innerText='✓ Tersalin';
      setTimeout(function(){btn.innerText='Salin Ringkasan';}, 2000);
    });
  }
}
window.addEventListener('scroll', function(){
  var bar = document.getElementById('readProgress');
  if(!bar) return;
  var top = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (max > 0 ? (top / max * 100) : 0) + '%';
}, { passive: true });
`;

function getContextualCta(term) {
  if (term.slug.includes("bottleneck")) {
    return {
      tag: "Audit Titik Macet Keputusan",
      title: "Seberapa Parah Titik Macet di Bisnis Anda?",
      desc: "Ketahui persis di mana alur keputusan terhambat dan berapa jam kerja yang bisa dihemat lewat automasi alur kerja. Uji lewat Mini Session 5 menit."
    };
  }
  if (term.slug.includes("geo") || term.slug.includes("dra") || term.slug.includes("brand")) {
    return {
      tag: "Strategi AI Search & Reputasi Digital",
      title: "Ingin Brand Anda Direkomendasikan AI Search?",
      desc: "Cari tahu apakah bisnis Anda sudah memiliki Digital Reputation Asset untuk dikutip oleh ChatGPT dan Perplexity. Konsultasikan arah solusi bersama tim kami."
    };
  }
  if (term.slug.includes("roi") || term.slug.includes("cost") || term.slug.includes("token")) {
    return {
      tag: "Kalkulasi Balik Modal AI",
      title: "Hitung Potensi Hemat Biaya & ROI Operasional",
      desc: "Jangan investasikan software sebelum tahu angka balik modalnya. Mini Session Pesat.AI memetakan penghematan biaya riil untuk alur kerja bisnis Anda."
    };
  }
  if (term.slug.includes("agent") || term.slug.includes("workflow") || term.slug.includes("zero-touch")) {
    return {
      tag: "Otomasi Alur Kerja Teruji",
      title: "Siap Mengeliminasi Kerjaan Manual Berulang?",
      desc: "Mulai dari alur kerja paling menyita waktu: rekonsiliasi faktur, follow up WhatsApp, atau routing data. Dapatkan blueprint rekomendasi dalam 5 menit."
    };
  }
  if (term.slug.includes("forecast") || term.slug.includes("demand") || term.slug.includes("predict")) {
    return {
      tag: "Prediksi Kas & Stok Akurat",
      title: "Stop Tebak-Tebak Arus Kas & Kebutuhan Stok",
      desc: "Lihat tren sebelum krisis likuiditas datang. Diagnosis kesiapan data operasional Anda dan temukan sistem prediksi terbaik lewat Mini Session gratis."
    };
  }
  return {
    tag: "Pesat.AI Menyelesaikan Ini",
    title: `Ingin Menerapkan Solusi ${term.shortName} di Bisnis Anda?`,
    desc: "Ketahui di mana biaya operasional bocor dan bagaimana AI praktis memangkas beban kerja tim hingga 70%. Sesi interaktif AI Business Coach 5 menit, tanpa kartu kredit."
  };
}

function shell({ title, body, homeHref = "https://pesat.ai/", showProgress = false }) {
  return `<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="Glosarium AI B2B &amp; Otomasi Operasional Pesat.AI">
<style>${CSS}
.lead-box{display:flex;flex-direction:column;gap:12px;position:relative}
@media(min-width:640px){.lead-box{flex-direction:row;justify-content:space-between;align-items:flex-start}}
.copy-btn{align-self:flex-start;background:var(--card);border:1px solid var(--line);color:var(--soft);border-radius:8px;padding:6px 12px;font-size:.76rem;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit;transition:all .15s}
.copy-btn:hover{color:var(--acc);border-color:var(--acc)}
.scroll-bar{position:fixed;top:54px;left:0;right:0;height:2px;background:transparent;z-index:40;pointer-events:none}
.scroll-progress{height:100%;background:linear-gradient(90deg,#6366f1,#818cf8);width:0%}
</style>
<script>${THEME_JS}</script>
</head>
<body>
${showProgress ? '<div class="scroll-bar"><div id="readProgress" class="scroll-progress"></div></div>' : ''}
<header class="bar"><div class="bar-in">
  <a class="brand" href="${homeHref}">
    <span class="brand-text">Pesat<span>.AI</span></span>
    <span class="brand-sub">Glosarium AI</span>
  </a>
  <nav>
    <a href="https://pesat.ai/">Beranda</a>
    <a href="https://pesat.ai/services">Layanan</a>
    <a href="index.html" class="active">Glosarium</a>
    <a href="https://pesat.ai/#pillars">6 Pilar Solusi</a>
    <a href="https://pesat.ai/#pricing">Harga</a>
    <a href="https://pesat.ai/#founder">Founder</a>
  </nav>
  <div class="bar-actions">
    <button class="theme-btn" onclick="glTheme()" aria-label="Ganti tema">Tema</button>
    <a class="btn-top" href="https://pesat.ai/">Buktikan Sendiri →</a>
  </div>
</div></header>
${body}
<footer class="site-footer">
  <div class="footer-wrap">
    <div class="footer-grid">
      <div class="footer-col brand-col">
        <div class="footer-brand">Pesat<span>.AI</span></div>
        <p class="footer-desc">AI Revenue System untuk bisnis Indonesia. Ubah masalah jadi solusi AI yang nyata, terukur, dan terpakai.</p>
        <a class="footer-btn" href="https://pesat.ai/">Buktikan Sendiri dalam 5 Menit</a>
      </div>
      <div class="footer-col">
        <p class="footer-title">Navigasi</p>
        <ul>
          <li><a href="https://pesat.ai/">Beranda</a></li>
          <li><a href="https://pesat.ai/services">Layanan</a></li>
          <li><a href="index.html">Glosarium AI</a></li>
          <li><a href="https://pesat.ai/#pillars">6 Pilar Solusi</a></li>
          <li><a href="https://pesat.ai/#how-it-works">Cara Kerja</a></li>
          <li><a href="https://pesat.ai/#pricing">Harga</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-title">Solusi</p>
        <ul>
          <li><a href="https://pesat.ai/#pillars">Revenue Engine</a></li>
          <li><a href="https://pesat.ai/#pillars">Cost Killer &amp; Ops</a></li>
          <li><a href="https://pesat.ai/#pillars">Predictive &amp; Forecasting</a></li>
          <li><a href="https://pesat.ai/#pillars">Brand Trust &amp; GEO</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <p class="footer-title">Perusahaan</p>
        <ul>
          <li><a href="https://pesat.ai/#founder">Founder</a></li>
          <li><a href="https://jetdigitalpro.com/" target="_blank" rel="noopener">JetDigitalPro ↗</a></li>
          <li><a href="https://jasa-seo.id/" target="_blank" rel="noopener">Jasa-SEO.id ↗</a></li>
          <li><a href="https://gcrindex.com/" target="_blank" rel="noopener">GCRIndex ↗</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Pesat.AI. All Rights Reserved.</p>
      <div class="footer-links">
        <a href="https://wa.me/6281290401240" target="_blank" rel="noopener">WhatsApp ↗</a>
        <a href="https://pesat.ai/#pricing">Harga</a>
        <a href="https://pesat.ai/#founder">Tentang</a>
      </div>
    </div>
  </div>
</footer>
<script>${TOGGLE_JS}</script>
</body></html>`;
}

const catName = (id) => GLOSSARY_CATEGORIES.find((c) => c.id === id)?.name || "";

function termPage(term) {
  const related = getRelatedTerms(term.relatedSlugs);
  const cat = catName(term.categoryId);
  const cta = getContextualCta(term);

  const relatedHtml = related.length
    ? `<div class="related"><div class="cap">Istilah Terkait (Internal Knowledge Mesh)</div><div class="grid">${related
        .map(
          (r) =>
            `<a class="card" href="${r.slug}.html"><div class="t">${esc(r.term)}</div><div class="d">${plain(
              r.leadDefinition
            )}</div><div class="m">${esc(r.readTime)} baca</div></a>`
        )
        .join("")}</div></div>`
    : "";

  const tableHtml = term.comparisonTable
    ? `<section class="blk"><h2>${esc(term.comparisonTable.title)}</h2><table><thead><tr><th>Parameter</th><th>${esc(
        term.comparisonTable.col1Header
      )}</th><th>${esc(term.comparisonTable.col2Header)}</th></tr></thead><tbody>${term.comparisonTable.rows
        .map(
          (r) =>
            `<tr><td><strong>${esc(r.feature)}</strong></td><td>${esc(r.col1)}</td><td>${esc(r.col2)}</td></tr>`
        )
        .join("")}</tbody></table></section>`
    : "";

  const copyText = esc(`${term.shortName} — ${term.leadDefinition.replace(/\*\*/g, "")} (Sumber: https://pesat.ai/glossary/${term.slug})`);

  const body = `<main><div class="wrap">
<div class="crumb"><a href="https://pesat.ai/">Beranda</a> / <a href="index.html">Glosarium</a> / <span>${esc(cat)}</span> / <strong>${esc(
    term.shortName
  )}</strong></div>
<h1>Apa Itu ${esc(term.shortName)}?</h1>
<p class="sub" style="font-size:.78rem;color:var(--mute);margin-top:10px">Ditinjau Tim Solusi Pesat.AI · Diperbarui ${
    esc(term.dateModified)
  } · ${esc(term.readTime)} baca</p>
<div class="box lead">
  <div class="lead-box">
    <div>${bold(term.leadDefinition)}</div>
    <button class="copy-btn" onclick="copyDef(this, '${copyText.replace(/'/g, "\\'")}')">Salin Ringkasan</button>
  </div>
</div>
<div class="takeaways"><div class="cap">Poin Kunci (Key Takeaways)</div><ul>${term.keyTakeaways
    .map((k) => `<li><b>→</b><span>${esc(k)}</span></li>`)
    .join("")}</ul></div>
<section class="blk"><h2>Cara Kerja ${esc(term.shortName)}</h2><p>${esc(term.howItWorks)}</p></section>
<section class="blk"><h2>Dampak Nyata pada P&amp;L dan Operasional Bisnis</h2><p>${esc(term.businessImpact)}</p></section>
<section class="blk"><h2>Contoh Penerapan Nyata di Lapangan</h2><p>${esc(term.realWorldExample)}</p></section>
<div class="warn"><div class="cap">Kekeliruan Umum di Kalangan Pemilik Bisnis</div><p>&ldquo;${esc(term.whatPeopleGetWrong)}&rdquo;</p></div>
${tableHtml}
<section class="blk"><h2>Pertanyaan yang Sering Diajukan (FAQ)</h2>${term.faqs
    .map((f) => `<details><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`)
    .join("")}</section>
<section class="blk"><h2>Kesimpulan Praktis</h2><p>Memahami ${esc(
    term.shortName
  )} bukan tentang mempelajari sintaks kode rumit, melainkan tentang mengenali di mana titik gesekan operasional perusahaan Anda bisa dialihkan ke sistem cerdas. Langkah awal terbaik adalah mengidentifikasi satu alur kerja yang paling banyak menyita jam kerja tim Anda setiap minggunya.</p></section>
${
  term.sources.length
    ? `<div class="sources"><div class="cap">Sumber &amp; Referensi Terpercaya</div><ol>${term.sources
        .map(
          (s) =>
            `<li><a href="${esc(s.url)}" target="_blank" rel="noopener nofollow">${esc(s.title)}</a> — ${esc(
              s.publisher
            )}</li>`
        )
        .join("")}</ol></div>`
    : ""
}
<div class="cta">
  <span style="display:inline-block;background:rgba(99,102,241,0.25);padding:3px 10px;border-radius:999px;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#c7d2fe;margin-bottom:8px">${esc(cta.tag)}</span>
  <h3>${esc(cta.title)}</h3>
  <p>${esc(cta.desc)}</p>
  <div class="row"><a class="btn" href="https://pesat.ai/">Uji Mini Session</a><a class="ghost" href="https://wa.me/6281290401240">Diskusi Solusi via WhatsApp →</a></div>
</div>
${relatedHtml}
</div></main>`;

  return shell({ title: `Apa Itu ${term.shortName}? Definisi, Cara Kerja & Contoh B2B | Pesat.AI`, body, showProgress: true });
}

function indexPage() {
  const groups = getAlphabeticalGroups();
  const active = new Set(groups.map((g) => g.letter));
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const featured = [
    "ai-agent",
    "geo-generative-engine-optimization",
    "rag-retrieval-augmented-generation",
    "workflow-automation",
    "decision-bottleneck",
    "diagnostic-mini-session"
  ]
    .map((s) => GLOSSARY_TERMS.find((t) => t.slug === s))
    .filter(Boolean);

  const chips = [
    `<button class="chip on" data-cat="all">Semua (${GLOSSARY_TERMS.length})</button>`,
    ...GLOSSARY_CATEGORIES.map(
      (c) =>
        `<button class="chip" data-cat="${c.id}">${esc(c.name)} (${
          GLOSSARY_TERMS.filter((t) => t.categoryId === c.id).length
        })</button>`
    )
  ].join("");

  const az = letters
    .map((L) =>
      active.has(L)
        ? `<a href="#L-${L}">${L}</a>`
        : `<span>${L}</span>`
    )
    .join("");

  const groupHtml = groups
    .map(
      (g) => `<section class="group" id="L-${g.letter}">
<div class="group-h"><div class="L">${g.letter}</div><div class="n">${g.terms.length} istilah</div></div>
<div class="grid">${g.terms
        .map(
          (t) => `<a class="card" href="${t.slug}.html" data-search="${esc(
            (t.term + " " + t.leadDefinition + " " + t.keyTakeaways.join(" ")).toLowerCase()
          )}" data-cat="${t.categoryId}"><div class="t">${esc(t.term)}</div><div class="d">${plain(
            t.leadDefinition
          )}</div><div class="m">${esc(catName(t.categoryId))} · ${esc(t.readTime)}</div></a>`
        )
        .join("")}</div></section>`
    )
    .join("");

  const body = `<main><div class="wrap">
<div class="crumb"><a href="https://pesat.ai/">Beranda</a> / <strong>Glosarium</strong></div>
<span class="badge">Referensi Praktis B2B AI &amp; Otomasi</span>
<h1 style="margin-top:14px">Glosarium AI &amp; Otomasi Bisnis</h1>
<p class="sub">Definisi lugas, bebas jargon rumit, berorientasi hasil operasional. Untuk pemilik bisnis, direktur operasional, dan manajer yang ingin mengeliminasi pekerjaan repetitif dan memvalidasi ROI kecerdasan buatan.</p>

<div class="start">
  <div class="cap">Mulai Dari Sini (Paling Sering Digunakan di Lapangan)</div>
  <p>6 konsep fundamental yang paling sering mengubah operasional perusahaan klien Pesat.AI:</p>
  <div class="grid">${featured
    .map(
      (t) => `<a class="card" href="${t.slug}.html"><div class="t">${esc(t.term)}</div><div class="d">${plain(
        t.leadDefinition
      )}</div><div class="m">${esc(t.readTime)} baca</div></a>`
    )
    .join("")}</div>
</div>

<div class="search">
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>
  <input id="q" type="search" placeholder="Cari istilah, teknologi, atau konsep (contoh: GEO, RAG, Agent, Bottleneck, Token)...">
</div>
<div class="chips" id="chips">${chips}</div>
<div class="az">${az}</div>
<div class="empty" id="empty">Tidak ada istilah yang cocok. <a href="#" onclick="resetAll();return false;">Reset</a></div>
${groupHtml}
</div></main>
<script>
var q=document.getElementById('q'), chips=document.getElementById('chips'), empty=document.getElementById('empty'), cat='all';
function apply(){
  var s=(q.value||'').trim().toLowerCase(), shown=0;
  document.querySelectorAll('.card[data-search]').forEach(function(c){
    var okS=!s||c.getAttribute('data-search').indexOf(s)>-1;
    var okC=cat==='all'||c.getAttribute('data-cat')===cat;
    c.style.display=(okS&&okC)?'':'none'; if(okS&&okC)shown++;
  });
  document.querySelectorAll('.group').forEach(function(g){
    var any=g.querySelectorAll('.card[data-search]:not([style*="none"])').length>0;
    g.style.display=any?'':'none';
  });
  empty.classList.toggle('on',shown===0);
}
function resetAll(){q.value='';cat='all';chips.querySelectorAll('.chip').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-cat')==='all')});apply();}
q.addEventListener('input',apply);
chips.addEventListener('click',function(e){
  var b=e.target.closest('.chip'); if(!b)return;
  cat=b.getAttribute('data-cat');
  chips.querySelectorAll('.chip').forEach(function(x){x.classList.toggle('on',x===b)});
  apply();
});
</script>`;

  return shell({ title: "Glosarium AI B2B & Otomasi Operasional | Pesat.AI", body, homeHref: "https://pesat.ai/" });
}

// Generate to main outDir (glossary-html/)
await mkdir(outDir, { recursive: true });
await writeFile(resolve(outDir, "index.html"), indexPage(), "utf8");
for (const term of GLOSSARY_TERMS) {
  await writeFile(resolve(outDir, `${term.slug}.html`), termPage(term), "utf8");
}

// Also sync to backupDir if accessible
let syncedToBackup = false;
try {
  await access(dirname(backupDir));
  await mkdir(backupDir, { recursive: true });
  await writeFile(resolve(backupDir, "index.html"), indexPage(), "utf8");
  for (const term of GLOSSARY_TERMS) {
    await writeFile(resolve(backupDir, `${term.slug}.html`), termPage(term), "utf8");
  }
  syncedToBackup = true;
} catch {
  // Ignore if backup path is not mounted
}

console.log(
  JSON.stringify({
    ok: true,
    out: outDir,
    syncedToBackup,
    backupDir,
    pages: GLOSSARY_TERMS.length + 1,
    terms: GLOSSARY_TERMS.length
  })
);
