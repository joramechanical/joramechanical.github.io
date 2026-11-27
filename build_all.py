# -*- coding: utf-8 -*-
"""Builds the whole Jora Mechanical Systems website:
     /                 province chooser (GTA / Saskatchewan / Calgary)
     /gta/             Ontario site            (generator/)
     /saskatchewan/    Saskatchewan site       (generator-sk/)
   plus redirects from the old GTA addresses, a sitemap index, robots.txt and llms.txt.

   python3 build_all.py prod    OUTDIR   -> live site (GitHub Pages)
   python3 build_all.py preview OUTDIR   -> private preview (noindex, links end in index.html)"""
import os, sys, subprocess, shutil, json, datetime, html

HERE = os.path.dirname(os.path.abspath(__file__))
MODE = sys.argv[1] if len(sys.argv) > 1 else "prod"
OUT = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else "site-out")
BASE = os.environ.get("BASE_URL", "https://joramechanicalsystems.com/")
PHONE, TEL, EMAIL = "905-667-2823", "tel:+19056672823", "info@joramechanicalsystems.com"
IDX = "index.html" if MODE != "prod" else ""
TODAY = datetime.date.today().isoformat()

shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)
for gen, sub in (("generator", "gta"), ("generator-sk", "saskatchewan")):
    env = dict(os.environ, SITE_URL=BASE + sub + "/")
    subprocess.run([sys.executable, os.path.join(HERE, gen, "build_site.py"), MODE, os.path.join(OUT, sub)], check=True, env=env)
    for f in ("robots.txt",):
        p = os.path.join(OUT, sub, f)
        if os.path.exists(p): os.remove(p)
os.makedirs(OUT + "/assets", exist_ok=True)
shutil.copy(OUT + "/gta/assets/logo.png", OUT + "/assets/logo.png")
NOINDEX = MODE != "prod"

CSP = ("default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; "
       "img-src 'self' data: https:; connect-src 'self' https://get.geojs.io https://ipwho.is; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests")

def esc(s): return html.escape(s, quote=True)

ART = {
 "gta": ('<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'
   '<linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1d3d"/><stop offset=".55" stop-color="#3a3f74"/><stop offset=".8" stop-color="#d9764a"/><stop offset="1" stop-color="#f4b16b"/></linearGradient>'
   '<linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b3a66"/><stop offset="1" stop-color="#0e1730"/></linearGradient></defs>'
   '<rect width="400" height="250" fill="url(#gs)"/><g fill="#fff" opacity=".7"><circle cx="40" cy="30" r="1"/><circle cx="120" cy="18" r="1.2"/><circle cx="300" cy="26" r="1"/><circle cx="350" cy="50" r="1.1"/><circle cx="210" cy="40" r=".9"/></g>'
   '<circle cx="330" cy="62" r="14" fill="#ffe2a8" opacity=".9"/>'
   '<g fill="#0b142b"><rect x="20" y="132" width="26" height="60"/><rect x="50" y="110" width="22" height="82"/><rect x="76" y="140" width="18" height="52"/><rect x="98" y="96" width="28" height="96"/><rect x="130" y="124" width="20" height="68"/>'
   '<rect x="200" y="104" width="26" height="88"/><rect x="230" y="128" width="22" height="64"/><rect x="256" y="88" width="30" height="104"/><rect x="290" y="134" width="20" height="58"/><rect x="314" y="116" width="24" height="76"/><rect x="342" y="140" width="40" height="52"/>'
   '<path d="M166 192V70h4l2-6 2 6h4v122z"/><ellipse cx="172" cy="86" rx="11" ry="6"/><rect x="171" y="22" width="2.4" height="44"/><path d="M168 100h8l-1 4h-6z"/></g>'
   '<g fill="#ffd27a" opacity=".85"><rect x="56" y="118" width="3" height="3"/><rect x="64" y="130" width="3" height="3"/><rect x="104" y="106" width="3" height="3"/><rect x="114" y="122" width="3" height="3"/><rect x="104" y="150" width="3" height="3"/><rect x="262" y="98" width="3" height="3"/><rect x="274" y="114" width="3" height="3"/><rect x="262" y="140" width="3" height="3"/><rect x="206" y="116" width="3" height="3"/><rect x="320" y="126" width="3" height="3"/><rect x="236" y="140" width="3" height="3"/></g>'
   '<rect y="192" width="400" height="58" fill="url(#gw)"/><g fill="#ffd27a" opacity=".35"><rect x="300" y="198" width="40" height="2"/><rect x="306" y="206" width="28" height="2"/><rect x="312" y="214" width="16" height="2"/><rect x="168" y="200" width="8" height="2"/><rect x="100" y="204" width="20" height="1.5"/></g></svg>'),
 "sk": ('<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'
   '<linearGradient id="ss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f78c8"/><stop offset=".7" stop-color="#9fd0f2"/><stop offset="1" stop-color="#e9f3f8"/></linearGradient>'
   '<linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c35a"/><stop offset="1" stop-color="#c88a26"/></linearGradient></defs>'
   '<rect width="400" height="250" fill="url(#ss)"/><circle cx="72" cy="58" r="22" fill="#fff6cf"/><circle cx="72" cy="58" r="34" fill="#fff6cf" opacity=".25"/>'
   '<g fill="#fff" opacity=".9"><ellipse cx="230" cy="52" rx="44" ry="11"/><ellipse cx="258" cy="44" rx="26" ry="11"/><ellipse cx="340" cy="78" rx="30" ry="8"/></g>'
   '<path d="M0 170c80-6 160 4 240-2s120-6 160-2v84H0z" fill="#7aa35a"/>'
   '<path d="M0 182c90-8 190 4 280-2s90-4 120-2v72H0z" fill="url(#sf)"/>'
   '<g stroke="#b97d22" stroke-width="2" opacity=".55" fill="none"><path d="M0 204c120-8 260 2 400-4"/><path d="M0 222c120-8 260 2 400-4"/><path d="M0 240c120-8 260 2 400-4"/></g>'
   '<g><rect x="262" y="96" width="38" height="82" fill="#b8322a"/><path d="M258 98l23-30 23 30z" fill="#8c231d"/><rect x="300" y="120" width="26" height="58" fill="#a22b24"/><path d="M298 122l15-12 15 12z" fill="#7a1f1a"/>'
   '<rect x="272" y="110" width="18" height="14" fill="#f3e2c2"/><text x="281" y="121" text-anchor="middle" font-family="Arial" font-weight="900" font-size="8" fill="#8c231d">SK</text><rect x="276" y="150" width="10" height="28" fill="#6e1a15"/></g>'
   '<g fill="#cfd6dc"><rect x="180" y="140" width="26" height="38" rx="2"/><path d="M178 140l15-12 15 12z"/><rect x="210" y="146" width="22" height="32" rx="2"/><path d="M208 146l13-10 13 10z"/></g>'
   '<g stroke="#e9c06a" stroke-width="2" stroke-linecap="round"><path d="M30 250v-26M38 250v-30M46 250v-24M360 250v-28M368 250v-24M376 250v-30"/></g></svg>'),
 "ab": ('<svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'
   '<linearGradient id="as" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa7d6"/><stop offset="1" stop-color="#e3edf7"/></linearGradient></defs>'
   '<rect width="400" height="250" fill="url(#as)"/>'
   '<path d="M0 170L60 90l30 34 50-74 46 62 30-34 64 80 40-42 80 54v80H0z" fill="#6f86a3"/>'
   '<path d="M140 50l14 20-10-4-8 10-6-8-6 4zM60 90l10 12-8-2-6 6-4-4zM216 90l10 12-8-2-6 5-4-5z" fill="#fff"/>'
   '<path d="M0 196c70-14 150-10 220-4s120 2 180-6v64H0z" fill="#8fb36a"/>'
   '<g fill="#2b3b55"><rect x="250" y="150" width="14" height="50"/><rect x="268" y="134" width="18" height="66"/><rect x="290" y="158" width="12" height="42"/><path d="M308 200v-62l6-10 6 10v62z"/><rect x="326" y="146" width="16" height="54"/><rect x="346" y="164" width="14" height="36"/></g>'
   '<path d="M0 214c80-6 180 4 400-6v42H0z" fill="#79a058"/></svg>'),
}
FLAGSVG = ('<svg class="flag" viewBox="0 0 9600 4800" role="img" aria-label="Flag of Canada"><path fill="#d52b1e" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"/>'
           '<path fill="#fff" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/></svg>')
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'

ICO = {
 "gta": '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 108h104"/><path d="M60 8v22M56 30h8l2 18h-12z"/><ellipse cx="60" cy="52" rx="10" ry="5"/><path d="M57 57l-3 51M63 57l3 51"/><path d="M14 108V70h14v38M32 108V56h14v52M74 108V62h14v46M92 108V78h14v30"/><path d="M19 78h4M19 88h4M37 66h4M37 76h4M79 72h4M79 82h4M97 86h4"/></svg>',
 "sk": '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 108h104"/><path d="M40 108V44l14-18 14 18v64"/><path d="M68 108V60h18v48"/><path d="M40 44h28M47 56h14v12H47zM50 108V88h8v20"/><path d="M96 108c0-14 0-28 0-40M96 74c-6-2-8-6-8-10 6 1 8 5 8 10zM96 84c6-2 8-6 8-10-6 1-8 5-8 10zM96 94c-6-2-8-6-8-10 6 1 8 5 8 10z"/><path d="M14 108V76a8 8 0 0 1 16 0v32"/></svg>',
 "ab": '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 108h104"/><path d="M8 92l26-38 14 18 22-34 24 34 18-12"/><path d="M62 50l8-12 8 12M28 62l6-8 6 8"/><path d="M70 108V80h10v28M84 108V70h8v38M96 108V84h10v24M88 70v-8"/></svg>',
}
def card(key, href, prov, city, btn, soon=False):
    inner = ('<span class="p-bg">%s</span><span class="p-in"><span class="p-ic">%s</span><small>%s</small><b>%s</b><em>%s</em></span>') % (
        ICO[key], ICO[key], esc(prov), esc(city), "Coming soon" if soon else ('Enter ' + ARROW))
    if soon: return '<div class="panel soon" data-prov="%s" aria-disabled="true">%s</div>' % (key, inner)
    return '<a class="panel" data-prov="%s" href="%s" aria-label="%s — %s">%s</a>' % (key, href, esc(city), esc(prov), inner)

page = """<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="%(csp)s"><meta name="referrer" content="strict-origin-when-cross-origin">
<title>Jora Mechanical Systems | Furnaces, AC, Heat Pumps &amp; Water Heaters — GTA &amp; Saskatchewan</title>
<meta name="description" content="Jora Mechanical Systems: furnaces, air conditioners, heat pumps, garage heaters and tankless water heaters. Choose your region — GTA (Ontario) or Saskatchewan (Saskatoon). Calgary coming soon.">
<link rel="canonical" href="%(base)s"><meta name="robots" content="%(robots)s">
<meta property="og:type" content="website"><meta property="og:site_name" content="Jora Mechanical Systems"><meta property="og:title" content="Jora Mechanical Systems — choose your region"><meta property="og:description" content="Heating, cooling and hot water in the GTA and Saskatchewan. Calgary coming soon."><meta property="og:url" content="%(base)s"><meta property="og:image" content="%(base)sassets/logo.png"><meta property="og:locale" content="en_CA">
<meta name="theme-color" content="#0c0d10"><link rel="icon" href="assets/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
%(ld)s
<style>
:root{--or:#F96302;--hd:"Roboto Condensed",Arial,sans-serif}
*{box-sizing:border-box}html,body{margin:0;height:100%%}
body{background:#0c0d10;color:#fff;font:400 16px/1.4 Roboto,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;overflow:hidden}
h1{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.bar{position:fixed;left:0;right:0;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;padding:20px 28px;pointer-events:none;background:linear-gradient(180deg,rgba(12,13,16,.75),rgba(12,13,16,0))}
.bar>*{pointer-events:auto}
.brand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#fff}
.brand img{width:44px;height:44px;border-radius:10px}
.brand b{font:800 18px/1.05 var(--hd);text-transform:uppercase;letter-spacing:.04em}
.flag{width:30px;height:15px;border-radius:2px;margin-left:4px;box-shadow:0 0 0 1px rgba(255,255,255,.25)}
.call{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;padding:10px 16px;border-radius:999px;color:#fff;text-decoration:none;font-weight:700;font-size:15px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.25);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
.call svg{width:16px;height:16px;color:var(--or)}
.split{display:flex;height:100vh;height:100dvh}
.seo{position:fixed;left:0;right:0;bottom:0;z-index:6;padding:7px 14px;font-size:11.5px;line-height:1.6;text-align:center;color:rgba(255,255,255,.55);background:linear-gradient(transparent,rgba(0,0,0,.55) 40%%)}.seo a{color:rgba(255,255,255,.75);text-decoration:none}.seo a:hover{color:#fff;text-decoration:underline}.seo b{color:rgba(255,255,255,.8);font-weight:700}
@media(max-width:700px){.seo{font-size:10.5px;padding:4px 10px}.seo .sk{display:none}}
.panel{position:relative;flex:1;overflow:hidden;text-decoration:none;color:#fff;transition:flex .7s cubic-bezier(.2,.8,.2,1),background .6s;border-right:1px solid rgba(255,255,255,.07)}
.panel:last-child{border-right:0}
.panel[data-prov=gta]{background:radial-gradient(120%% 80%% at 30%% 100%%,#2b3570 0%%,#141a33 55%%,#0c0d14 100%%)}
.panel[data-prov=sk]{background:radial-gradient(120%% 80%% at 30%% 100%%,#6b4313 0%%,#2a1d10 55%%,#0e0c0a 100%%)}
.panel[data-prov=ab]{background:radial-gradient(120%% 80%% at 30%% 100%%,#2e3b46 0%%,#161b20 55%%,#0c0d10 100%%)}
.p-bg{position:absolute;right:-12%%;top:12%%;width:min(78%%,520px);color:#fff;opacity:.05;transition:opacity .7s,transform 1.2s cubic-bezier(.2,.8,.2,1)}
.p-bg svg{width:100%%;height:auto;display:block}
.p-in{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:0 clamp(24px,3vw,44px) clamp(36px,7vh,64px)}
.p-ic{display:block;width:64px;height:64px;color:var(--or);margin-bottom:22px}
.p-ic svg{width:100%%;height:100%%}
.p-in small{display:block;font-weight:700;font-size:12.5px;letter-spacing:.26em;text-transform:uppercase;color:rgba(255,255,255,.6)}
.p-in b{display:block;font:800 clamp(30px,3vw,54px)/.95 var(--hd);text-transform:uppercase;margin:10px 0 26px;letter-spacing:.01em;white-space:nowrap}
.p-in em{display:inline-flex;align-items:center;gap:10px;font-style:normal;font-weight:700;font-size:15.5px;padding:13px 22px;border-radius:999px;border:1.5px solid rgba(255,255,255,.35);color:#fff;transition:background .3s,border-color .3s}
.p-in em svg{width:18px;height:18px;transition:transform .3s}
a.panel:hover,a.panel:focus-visible{flex:1.2}
a.panel:hover .p-bg,a.panel:focus-visible .p-bg{opacity:.1;transform:translateY(-10px)}
a.panel:hover em,a.panel:focus-visible em{background:var(--or);border-color:var(--or)}a.panel:hover em svg{transform:translateX(4px)}
a.panel:focus-visible{outline:3px solid var(--or);outline-offset:-3px}
.soon{cursor:default}.soon .p-ic{color:rgba(255,255,255,.35)}.soon b{color:rgba(255,255,255,.55)}.soon em{border-style:dashed;color:rgba(255,255,255,.55)}
.near{position:absolute;left:clamp(24px,3vw,44px);top:110px;z-index:3;padding:6px 12px;border-radius:999px;background:var(--or);color:#fff;font-size:12px;font-weight:800;letter-spacing:.06em}
@media(max-width:800px){body{overflow:auto}.bar{position:absolute;padding:14px 16px;background:none}.brand b{font-size:13px}.flag{display:none}.brand img{width:38px;height:38px}.call span{display:none}.call{padding:9px 13px;font-size:14px}
  .split{flex-direction:column;height:auto}.panel{flex:none;min-height:33.4vh;min-height:33.4dvh;border-right:0;border-bottom:1px solid rgba(255,255,255,.07)}
  .panel:first-child{min-height:calc(33.4dvh + 50px)}a.panel:hover,a.panel:focus-visible{flex:none}
  .p-in{padding:0 20px 22px;display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto auto;column-gap:14px;align-items:end}
  .p-ic{grid-row:1/3;width:46px;height:46px;margin:0}.p-in small{grid-column:2;font-size:11px}.p-in b{grid-column:2;font-size:clamp(22px,6.6vw,32px);margin:4px 0 0;min-width:0}
  .p-in em{grid-column:3;grid-row:1/3;width:48px;height:48px;padding:0;justify-content:center;font-size:0;gap:0;background:var(--or);border-color:var(--or)}.p-in em svg{width:20px;height:20px}.soon em{width:auto;height:auto;padding:8px 12px;font-size:12px;background:none;border-color:rgba(255,255,255,.3)}
  .p-bg{width:60%%;right:-8%%;top:8%%}.near{top:auto;bottom:96px;left:20px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body>
<header class="bar"><a class="brand" href="./%(idx)s"><img src="assets/logo.png" alt="" width="44" height="44"><b>Jora Mechanical<br>Systems</b>%(flag)s</a>
<a class="call" href="%(tel)s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>%(phone)s<span>&nbsp;· 24/7</span></a></header>
<h1>Jora Mechanical Systems — choose your region: GTA, Saskatchewan or Calgary</h1>
<main class="split">
%(cards)s
</main>
<nav class="seo" aria-label="Popular pages"><b>GTA:</b> <a href="gta/furnaces/">Furnaces</a> · <a href="gta/air-conditioners/">Air conditioners</a> · <a href="gta/heat-pumps/">Heat pumps</a> · <a href="gta/tankless-water-heaters/">Tankless water heaters</a> · <a href="gta/hvac-repair/">24/7 repair</a> · <a href="gta/rebates/">Rebates</a> · <a href="gta/free-quote/">Free quote</a> · <a href="gta/contact/">Contact</a>
 <span class="sk"><span class="sep">|</span> <b>Saskatchewan:</b> <a href="saskatchewan/furnaces/">Furnace installation Saskatoon</a> · <a href="saskatchewan/garage-heaters/">Garage heaters</a> · <a href="saskatchewan/air-conditioners/">Air conditioners</a> · <a href="saskatchewan/heat-pumps/">Heat pumps</a> · <a href="saskatchewan/hvac-repair/">Furnace repair</a> · <a href="saskatchewan/rebates/">SaskEnergy rebates</a> · <a href="saskatchewan/service-areas/saskatoon/">Saskatoon</a> · <a href="saskatchewan/free-quote/">Free quote</a></span></nav>
<script>
(function(){function mark(p){if(!p)return;var el=document.querySelector('.panel[data-prov="'+p+'"]');if(!el||el.classList.contains("soon"))return;var b=document.createElement("span");b.className="near";b.textContent="📍 Near you";el.appendChild(b)}
 try{var c=sessionStorage.getItem("jora_prov");if(c!==null){mark(JSON.parse(c));return}}catch(e){}
 fetch("https://get.geojs.io/v1/ip/geo.json").then(function(r){return r.json()}).then(function(g){var p=g.region==="Saskatchewan"?"sk":g.region==="Ontario"?"gta":null;try{sessionStorage.setItem("jora_prov",JSON.stringify(p))}catch(e){}mark(p)}).catch(function(){})})();
</script>
</body></html>"""
LD = [{"@context": "https://schema.org", "@type": "Organization", "@id": BASE + "#org", "name": "Jora Mechanical Systems", "url": BASE,
       "logo": BASE + "assets/logo.png", "email": EMAIL, "telephone": "+1-905-667-2823",
       "contactPoint": {"@type": "ContactPoint", "telephone": "+1-905-667-2823", "contactType": "customer service", "areaServed": "CA", "availableLanguage": ["English"]},
       "subOrganization": [{"@type": "HVACBusiness", "name": "Jora Mechanical Systems — GTA, Ontario", "url": BASE + "gta/", "telephone": "+1-905-667-2823", "areaServed": {"@type": "State", "name": "Ontario"}},
                           {"@type": "HVACBusiness", "name": "Jora Mechanical Systems — Saskatchewan", "url": BASE + "saskatchewan/", "telephone": "+1-905-667-2823", "areaServed": {"@type": "State", "name": "Saskatchewan"}}]},
      {"@context": "https://schema.org", "@type": "WebSite", "name": "Jora Mechanical Systems", "url": BASE, "inLanguage": "en-CA"}]


cards = "\n".join([
    card("gta", "gta/" + IDX, "Ontario", "GTA", "Enter GTA site"),
    card("sk", "saskatchewan/" + IDX, "Saskatoon & surrounding areas", "Saskatchewan", "Enter Saskatchewan site"),
    card("ab", "", "Alberta", "Calgary", "Coming soon", soon=True)])
open(OUT + "/index.html", "w").write(page % dict(csp=CSP, base=BASE, robots="noindex,nofollow" if NOINDEX else "index,follow,max-image-preview:large",
    ld="".join('<script type="application/ld+json">%s</script>' % json.dumps(x, ensure_ascii=False) for x in LD), flag=FLAGSVG, idx=IDX,
    email=EMAIL, tel=TEL, phone=PHONE, cards=cards, year=datetime.date.today().year))

# ---------- redirects from the old GTA addresses (site used to live at the root) ----------
def stub(path):
    target = BASE + "gta/" + path
    rel = "../" * path.count("/") + "gta/" + path + IDX
    return ('<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><title>Moved — Jora Mechanical Systems</title><link rel="canonical" href="%s">'
            '<meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0; url=%s"><script>location.replace(%s+location.hash)</script></head>'
            '<body><p>This page moved to <a href="%s">%s</a>.</p></body></html>') % (target, rel, json.dumps(rel), rel, target)
n = 0
for root, dirs, files in os.walk(OUT + "/gta"):
    if "index.html" in files:
        path = os.path.relpath(root, OUT + "/gta").replace(os.sep, "/")
        if path in (".", "assets") or path.startswith("assets"): continue
        path += "/"
        dest = os.path.join(OUT, path)
        if os.path.exists(dest + "index.html"): continue
        os.makedirs(dest, exist_ok=True)
        open(dest + "index.html", "w").write(stub(path)); n += 1

# ---------- the first Jora website (.html addresses) -> matching new pages, so old Google links keep working ----------
OLD = {"services/furnace.html": "gta/furnaces/", "services/boiler.html": "gta/boilers/", "services/air-conditioner.html": "gta/air-conditioners/",
       "services/heat-pump.html": "gta/heat-pumps/", "services/water-heater.html": "gta/water-heaters/", "services/plumbing.html": "gta/plumbing/",
       "services/duct-work.html": "gta/ductwork/", "services/hvac-repair.html": "gta/hvac-repair/", "services/commercial-hvac.html": "gta/commercial-hvac/",
       "services/humidifier-air-quality.html": "gta/indoor-air-quality/", "services/smart-home.html": "gta/smart-thermostats/",
       "services/accessories.html": "gta/home-solutions/", "about.html": "gta/about/", "plans.html": "gta/hvac-maintenance/", "offers.html": "gta/rebates/",
       "financing.html": "gta/rebates/", "contact.html": "gta/contact/", "privacy-policy.html": "gta/privacy/", "terms.html": "gta/terms/",
       "areas/index.html": "gta/service-areas/"}
for d, reg in ((OUT + "/gta/service-areas", "gta"), (OUT + "/saskatchewan/service-areas", "saskatchewan")):
    for c in os.listdir(d):
        if os.path.isdir(os.path.join(d, c)): OLD.setdefault("areas/%s.html" % c, "%s/service-areas/%s/" % (reg, c))
for old, new in OLD.items():
    if not os.path.exists(OUT + "/" + new.rstrip("/") + "/index.html"): continue
    rel = "../" * old.count("/") + new + IDX
    os.makedirs(os.path.dirname(OUT + "/" + old) or OUT, exist_ok=True)
    open(OUT + "/" + old, "w").write(('<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><title>Moved — Jora Mechanical Systems</title><link rel="canonical" href="%s">'
        '<meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0; url=%s"><script>location.replace(%s+location.hash)</script></head>'
        '<body><p>This page moved to <a href="%s">%s</a>.</p></body></html>') % (BASE + new, rel, json.dumps(rel), rel, BASE + new)); n += 1

# root 404: old deep links go to the GTA site, anything else gets a friendly page
open(OUT + "/404.html", "w").write(("<!doctype html><html lang=\"en-CA\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Page not found | Jora Mechanical Systems</title><meta name=\"robots\" content=\"noindex\">"
    "<script>(function(){var p=location.pathname;if(!/^\\/(gta|saskatchewan|assets)\\//.test(p)&&p!==\"/\"){location.replace(\"/gta\"+p+location.search+location.hash)}})();</script>"
    "<style>body{font:16px/1.5 Arial,sans-serif;max-width:640px;margin:60px auto;padding:0 18px;color:#222}a{color:#D52B1E;font-weight:700}</style></head><body>"
    "<h1>Page not found</h1><p>Choose your region:</p><p><a href=\"/gta/\">GTA, Ontario</a> · <a href=\"/saskatchewan/\">Saskatchewan</a> · <a href=\"/\">All regions</a></p><p>Or call %s, 24/7.</p></body></html>") % PHONE)

# ---------- sitemaps, robots, llms ----------
open(OUT + "/sitemap-root.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>%s</loc><lastmod>%s</lastmod></url>\n</urlset>\n' % (BASE, TODAY))
open(OUT + "/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
    "<sitemap><loc>%s%s</loc><lastmod>%s</lastmod></sitemap>\n" % (BASE, s, TODAY) for s in ("sitemap-root.xml", "gta/sitemap.xml", "saskatchewan/sitemap.xml")) + "</sitemapindex>\n")
BOTS = ["Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Applebot", "Applebot-Extended", "DuckDuckBot"]
open(OUT + "/robots.txt", "w").write("User-agent: *\nDisallow: /\n" if NOINDEX else "".join("User-agent: %s\nAllow: /\nDisallow: /admin/\nDisallow: /account/\nDisallow: /quote/\n\n" % b for b in BOTS) + "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /account/\nDisallow: /quote/\n\nSitemap: %ssitemap.xml\nSitemap: %sgta/sitemap.xml\nSitemap: %ssaskatchewan/sitemap.xml\n" % (BASE, BASE, BASE))
gta_llms = open(OUT + "/gta/llms.txt").read(); sk_llms = open(OUT + "/saskatchewan/llms.txt").read()
open(OUT + "/llms.txt", "w").write("# Jora Mechanical Systems\n\n> Canadian heating, cooling and hot water contractor. Phone %s (24/7), email %s.\n> Regional sites: GTA, Ontario — %sgta/ ; Saskatchewan (Saskatoon) — %ssaskatchewan/ ; Calgary, Alberta — coming soon.\n\n## GTA, Ontario\n\n%s\n\n## Saskatchewan\n\n%s" % (
    PHONE, EMAIL, BASE, BASE, gta_llms.split("\n", 2)[2] if gta_llms.count("\n") > 2 else gta_llms, sk_llms.split("\n", 2)[2] if sk_llms.count("\n") > 2 else sk_llms))
open(OUT + "/.nojekyll", "w").write("")
if MODE == "prod" and "github.io" not in BASE: open(OUT + "/CNAME", "w").write(BASE.split("//")[1].strip("/") + "\n")
print("root chooser + %d redirects ->" % n, OUT)

# office panel, customer accounts, quotation pages
import app_build
app_build.build(OUT, MODE)
print("office panel + account + quote pages ->", OUT)

# publishing robot: turns office-panel articles and pages into real HTML pages (runs on GitHub)
if MODE == "prod":
    import shutil as _sh
    _gh = os.path.join(OUT, ".github")
    os.makedirs(os.path.join(_gh, "workflows"), exist_ok=True); os.makedirs(os.path.join(_gh, "publisher"), exist_ok=True)
    _sh.copy(os.path.join(HERE, "tools", "publisher", "publish.yml"), os.path.join(_gh, "workflows", "publish.yml"))
    _sh.copy(os.path.join(HERE, "tools", "publisher", "publish.mjs"), os.path.join(_gh, "publisher", "publish.mjs"))
    _sh.copy(os.path.join(HERE, "shared", "md.js"), os.path.join(_gh, "publisher", "md.js"))

# favicons Google can show in search results (square, multiples of 48px, at the site root) + bigger logo for Google
if MODE == "prod":
    import re as _re, glob as _gl
    from PIL import Image as _Im
    _src = _Im.open(OUT + "/assets/logo.png").convert("RGBA")
    def _sq(n, pad=0.0):
        bg = _Im.new("RGBA", (n, n), (255, 255, 255, 0) if not pad else (249, 99, 2, 255))
        s = int(n * (1 - pad)); im = _src.resize((s, s), _Im.LANCZOS); bg.paste(im, ((n - s) // 2, (n - s) // 2), im); return bg
    for n in (48, 96, 192, 512): _sq(n).save(OUT + "/favicon-%d.png" % n)
    _sq(180).convert("RGB").save(OUT + "/apple-touch-icon.png")
    _sq(48).save(OUT + "/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    _sq(512).convert("RGB").save(OUT + "/assets/logo-512.png")
    _ICONS = ('<link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" type="image/png" sizes="96x96" href="/favicon-96.png">'
              '<link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">')
    _n = 0
    for _f in _gl.glob(OUT + "/**/*.html", recursive=True):
        _h = open(_f, encoding="utf-8").read()
        _h2 = _re.sub(r'<link rel="icon" href="[^"]*logo\.png">', _ICONS, _h, count=1)
        _h2 = _h2.replace('"logo": "https://joramechanicalsystems.com/assets/logo.png"', '"logo": "https://joramechanicalsystems.com/assets/logo-512.png"')
        if _h2 != _h: open(_f, "w", encoding="utf-8").write(_h2); _n += 1
    print("favicons added to", _n, "pages")

# Google Search Console ownership file (keep it — removing it un-verifies the site)
if MODE == "prod":
    open(OUT + "/googlee93da1d97fb62119.html", "w").write("google-site-verification: googlee93da1d97fb62119.html")


# pages added directly to the live site by another session (keep them on every deploy)
import shutil as _sh2, json
_ov = os.path.join(HERE, "overlay")
if os.path.isdir(_ov):
    for _r, _d, _fs in os.walk(_ov):
        for _f in _fs:
            _src = os.path.join(_r, _f); _dst = os.path.join(OUT, os.path.relpath(_src, _ov))
            os.makedirs(os.path.dirname(_dst), exist_ok=True)
            # index files are MERGED (generated entries kept, overlay-only entries added), never overwritten
            if os.path.exists(_dst) and _f == "sitemap.xml":
                import re as _re
                _g = open(_dst).read(); _have = set(_re.findall(r"<loc>([^<]+)</loc>", _g))
                _add = [u for u in _re.findall(r"<url>.*?</url>", open(_src).read(), _re.S) if _re.search(r"<loc>([^<]+)</loc>", u).group(1) not in _have]
                open(_dst, "w").write(_g.replace("</urlset>", "".join(_add) + "</urlset>")); continue
            if os.path.exists(_dst) and _f == "pages.json":
                _g = json.load(open(_dst)); _have = {x.get("path") for x in _g}
                _g += [x for x in json.load(open(_src)) if x.get("path") not in _have]
                open(_dst, "w").write(json.dumps(_g, ensure_ascii=False)); continue
            if os.path.exists(_dst) and _f == "llms.txt":
                _g = open(_dst).read(); _have = set(_g.splitlines())
                _extra = [l for l in open(_src).read().splitlines() if l.strip() and l not in _have and l.startswith("- ")]
                open(_dst, "w").write(_g.rstrip("\n") + ("\n" + "\n".join(_extra) if _extra else "") + "\n"); continue
            _sh2.copy(_src, _dst)
