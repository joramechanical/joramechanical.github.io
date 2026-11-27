# -*- coding: utf-8 -*-
"""Builds the multi-page Jora Mechanical website.
   python3 build_site.py prod  OUTDIR   -> clean URLs (GitHub Pages / custom domain)
   python3 build_site.py preview OUTDIR -> links end in index.html, noindex (private preview)"""
import json, re, os, sys, base64, html, shutil, glob, datetime
sys.path.insert(0, os.path.dirname(__file__))
from content import *

MODE = sys.argv[1] if len(sys.argv) > 1 else "prod"
OUT = sys.argv[2] if len(sys.argv) > 2 else "out"
HERE = os.path.dirname(os.path.abspath(__file__))
S = os.path.dirname(HERE) + "/"

# ---------------------------------------------------------------- settings
SITE_URL = os.environ.get("SITE_URL", "https://joramechanicalsystems.com/gta/")   # change to your own domain later, e.g. https://joramechanical.ca/
GA4_ID = ""            # Google Analytics 4, e.g. "G-XXXXXXX"
ADS_ID = ""            # Google Ads, e.g. "AW-XXXXXXXXX"
GSC_VERIFY = ""        # Google Search Console verification code
NOINDEX = MODE != "prod"

import subprocess
subprocess.run(["node", "-e", "const fs=require('fs');eval(fs.readFileSync(process.argv[1],'utf8')+';global.D={JORA,BRANDS,CATS,BCOL,PRODUCTS,ICONS,SERVICES,STEPS,CITIES,POSTS,REBATES,SOLUTIONS,PROJECTS,WORK_CATS,STANDARDS,CHAT}');fs.writeFileSync(process.argv[2],JSON.stringify(D))", HERE + "/data.js", HERE + "/data.json"], check=True)
D = json.load(open(HERE + "/data.json"))
J, BRANDS, CATS, PRODUCTS, SERVICES = D["JORA"], D["BRANDS"], D["CATS"], D["PRODUCTS"], D["SERVICES"]
ICONS, POSTS, CITIES, STEPS, REBATES = D["ICONS"], D["POSTS"], D["CITIES"], D["STEPS"], D["REBATES"]
PHONE, TEL = J["phone"], "tel:+19056672823"
EMAIL = J.get("email", "info@joramechanicalsystems.com"); MAILTO = "mailto:" + EMAIL
TODAY = datetime.date.today().isoformat()

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import solpages
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'shared'))
import mnav as mnav_mod
import blogmd
from nhpr import *
import header as header_mod
REGION = "gta"
SOL_SLUGS = {v["slug"] for v in SOL_PAGES.values()}
def esc(s): return html.escape(str(s if s is not None else ""), quote=True)
def slug(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
def ic(k): return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS.get(k, ICONS["home"]) + '</svg>'

# posts: give the data.js posts slugs, then add the extra posts
POST_SLUGS = ["furnace-or-heat-pump", "tankless-vs-tank-water-heater", "hrv-or-erv"]
for p, sl in zip(POSTS, POST_SLUGS): p["slug"] = sl
POSTS = POSTS + EXTRA_POSTS

ALL_BRANDS = []
for k in BRANDS:
    for b in BRANDS[k]:
        if b not in ALL_BRANDS: ALL_BRANDS.append(b)
BRAND_PAGES = [b for b in ALL_BRANDS if any(p["brand"] == b for p in PRODUCTS)]

# ---------------------------------------------------------------- site map of paths
LINKS = {"cat": {k: CAT_SLUG[k] + "/" for k in CATS},
         "product": {p["id"]: "products/" + p["id"] + "/" for p in PRODUCTS},
         "brand": {b: "brands/" + slug(b) + "/" for b in BRAND_PAGES},
         "svc": {k: v + "/" for k, v in SVC_SLUG.items()},
         "post": ["blog/" + p["slug"] + "/" for p in POSTS],
         "page": {"rebates": "rebates/", "area": "service-areas/", "work": "our-work/", "solutions": "commercial-hvac/", "about": "about/",
                  "contact": "contact/", "blog": "blog/", "quote": "free-quote/", "home": ""},
         "idx": "index.html" if MODE != "prod" else ""}
CITY_SLUGS = {c[0]: "service-areas/" + slug(c[0]) + "/" for c in CITY_PAGES}

CUR = {"path": ""}
def u(path):
    """relative link from the current page to a site path"""
    depth = CUR["path"].count("/")
    rel = "../" * depth + path
    if MODE != "prod" and (path == "" or path.endswith("/")): rel += "index.html"
    if rel == "": rel = "./"
    return rel
def asset(p): return "../" * CUR["path"].count("/") + "assets/" + p

PAGES_OUT = []
PAGE_INDEX = []   # (path, lastmod)
# security policy (GitHub Pages can't send headers, so it goes in a meta tag)
CSP = ("default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://maps.gstatic.com https://www.googletagmanager.com; "
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; "
       "connect-src 'self' https://firestore.googleapis.com https://api.web3forms.com https://api.emailjs.com https://get.geojs.io https://ipwho.is https://api.open-meteo.com https://ipapi.co https://wttr.in https://maps.googleapis.com https://www.google-analytics.com https://*.google-analytics.com; "
       "frame-src https://www.google.com https://maps.google.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self' " + '/'.join(SITE_URL.split('/')[:3]) + "; form-action 'self' mailto:; upgrade-insecure-requests")

# ---------------------------------------------------------------- assets
def build_assets():
    A = OUT + "/assets/"
    for d in ["img", "logos"]: os.makedirs(A + d, exist_ok=True)
    for f in glob.glob(os.path.dirname(HERE) + "/images/scenes/*.webp"): shutil.copy(f, A + "img/" + os.path.basename(f))
    for f in glob.glob(os.path.dirname(HERE) + "/images/cert-logos/*.webp"): shutil.copy(f, A + "img/cert-" + os.path.basename(f))
    for f in glob.glob(os.path.dirname(HERE) + "/images/product-cutouts/*.webp"):
        n = os.path.basename(f)
        if n in ("airmax.webp", "lennox-hp.webp"): continue
        shutil.copy(f, A + "img/" + n)
    logos = json.load(open(HERE + "/logos.json"))
    LOGOF = {}
    for b, uri in logos.items():
        ext = uri.split(";")[0].split("/")[1]
        fn = slug(b) + "." + ext
        open(A + "logos/" + fn, "wb").write(base64.b64decode(uri.split(",", 1)[1]))
        LOGOF[b] = fn
    src = open(HERE + "/map-source.html").read()
    luri = re.search(r'class="j-brand"[^>]*><img alt="[^"]*" src="(data:image/([a-z]+);base64,([^"]+))"', src)
    open(A + "logo." + luri.group(2), "wb").write(base64.b64decode(luri.group(3)))
    a = src.index('<!-- ============ SERVICE-AREA MAP START'); e = src.index('SERVICE-AREA MAP END'); b = src.index('-->', e) + 3
    css = ""
    for f in ["head.html", "extra.css", "more.css", "pages.css", "../shared/header.css", "../shared/hero.css", "../shared/weather.css", "../shared/perf.css"]:
        t = open(HERE + "/" + f).read()
        css += "\n".join(re.findall(r"<style>(.*?)</style>", t, re.S)) + "\n"
    open(A + "site.css", "w").write(css)
    imgs = sorted(os.path.basename(f)[:-5] for f in glob.glob(A + "img/*.webp"))
    data = open(HERE + "/data.js").read()
    data = data.replace("var PROJECTS = [];", "var PROJECTS = typeof PROJECTS_DATA!=='undefined'?PROJECTS_DATA:[];")
    BK = json.load(open(os.path.dirname(HERE) + "/backend-config.json"))
    head = ("var REGION=\"%s\";var BACKEND=" % REGION + json.dumps({"firebase": BK.get("firebase"), "web3formsKey": BK.get("web3formsKey", ""), "emailjs": ({k: (BK.get("emailjs") or {}).get(k) for k in ("publicKey", "teamService", "alertTemplate")} if BK.get("emailjs") else None)}) + ";\n"
            "var IMG={};" + json.dumps(imgs) + ".forEach(function(n){IMG[n]=ROOT+'assets/img/'+n+'.webp'});\n"
            "var LOGO={};(function(m){for(var k in m)LOGO[k]=ROOT+'assets/logos/'+m[k]})(" + json.dumps(LOGOF) + ");\n"
            "var LINKS=" + json.dumps(LINKS) + ";\n")
    open(A + "data.js", "w").write(head + data)
    app = open(HERE + "/app.js").read().rstrip()
    assert app.endswith("})();")
    open(A + "app.js", "w").write(app[:-5] + "\n" + open(HERE + "/more.js").read() + "\n" + open(HERE + "/pages.js").read() + "\n" + open(os.path.dirname(HERE) + "/shared/live.js").read() + "\n" + open(os.path.dirname(HERE) + "/shared/md.js").read() + "\n" + open(os.path.dirname(HERE) + "/shared/live-pages.js").read() + "\n})();\n")
    return src[a:b], "logo." + luri.group(2), LOGOF

MAP, LOGO_FILE, LOGOF = build_assets()
import hashlib
VER = {k: hashlib.md5(open(OUT + "/assets/" + f, "rb").read()).hexdigest()[:8] for k, f in (("css", "site.css"), ("data", "data.js"), ("app", "app.js"))}
ICONS["user"] = '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>'
ICONS["mail"] = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'


def logo_img(b, cls="bm bm-card"):
    if b in LOGOF: return '<img class="%s%s" src="%s" alt="%s" loading="lazy">' % (cls, " dark" if b == "Kepler" else "", asset("logos/" + LOGOF[b]), esc(b))
    return '<span class="bmt">' + esc(b) + '</span>'
def pimg(p, cls="", eager=False):
    if p.get("img"):
        return '<img%s src="%s" alt="%s"%s>' % (' class="' + cls + '"' if cls else "", asset("img/" + p["img"] + ".webp"), esc(p["name"]), "" if eager else ' loading="lazy"')
    return '<div class="ill" data-ill="%s" data-brand="%s" role="img" aria-label="%s"></div>' % (p["cat"], esc(p["brand"]), esc(p["name"]))

def card(p):
    return ('<article class="pc" data-product="%s" data-brand="%s"><div class="pim">%s%s</div><div class="pb"><div class="pbr">%s</div>'
            '<h3><a href="%s">%s</a></h3><div class="kv">%s</div><div class="pr">Installed price: free quote<small>Equipment, labour &amp; permits in writing</small></div>'
            '<div class="row"><a class="btn o sm" href="%s">Details</a><button class="btn sm" type="button" data-quote-product="%s">Get quote</button></div></div></article>') % (
        esc(p["id"]), esc(p["brand"]), ('<span class="flag%s">%s</span>' % (" red" if p.get("flagRed") else "", esc(p["flag"])) if p.get("flag") else ""),
        pimg(p), logo_img(p["brand"]), u(LINKS["product"][p["id"]]), esc(p["name"]), "".join("<span>" + esc(f) + "</span>" for f in p.get("feats3", [])),
        u(LINKS["product"][p["id"]]), esc(p["id"]))

# ---------------------------------------------------------------- shell
BODY = open(HERE + "/body.html").read()
def between(s, a, b): i = s.index(a); return s[i:s.index(b, i) + len(b)]
OVERLAYS = BODY[BODY.index("<!-- overlays -->"):]
OVERLAYS = re.sub(r'<!-- OUR WORK full page -->.*?</div></div>\n\n', '', OVERLAYS, flags=re.S)
WX = '<div id="wxpage" aria-hidden="true"><div class="wx-tint"></div><div class="wx-sunball"></div><div class="wx-rays"></div><div class="wx-clouds"><i></i><i></i><i></i><i></i></div></div><canvas id="wxfx" aria-hidden="true"></canvas><div class="wx-flash" aria-hidden="true"></div>'

NAV = [("Furnaces", "furnaces/"), ("Air Conditioners", "air-conditioners/"), ("Heat Pumps", "heat-pumps/"), ("Tankless", "tankless-water-heaters/"),
       ("Air Handlers", "air-handlers/"), ("Duct Work", "ductwork/"), ("Sheet Metal", "sheet-metal/"), ("HRV / ERV", "hrv-erv/"), ("Plumbing", "plumbing/"), ("Repairs 24/7", "hvac-repair/")]

def ACCT():
    return "../" * (CUR["path"].count("/") + 1) + "account/" + ("index.html" if MODE != "prod" else "") + "?r=gta"

def header():
    up = "../" * (CUR["path"].count("/") + 1)
    search = between(BODY, '<div class="search" role="search">', '</div>\n    <div class="acts">').replace('\n    <div class="acts">', '')
    return header_mod.build(dict(region=REGION, u=u, asset=asset, ic=ic, logo_file=LOGO_FILE, acct=ACCT(), root_up=up,
        idx="index.html" if MODE != "prod" else "", cur=CUR["path"], cats=CATS, cat_slug=CAT_SLUG, products=PRODUCTS,
        img_ok=lambda pr: bool(pr.get("img")) and os.path.exists(OUT + "/assets/img/" + pr["img"] + ".webp"), search_html=search, phone=PHONE, tel=TEL))

def _header():
    CATP = {v + "/": k for k, v in CAT_SLUG.items()}
    def li(t, p):
        cur = ' aria-current="page"' if CUR["path"].startswith(p) and p else ""
        if p in CATP:
            return '<li><button type="button" class="mm-b" data-mega="%s" aria-expanded="false" aria-controls="mega-%s"%s>%s<i aria-hidden="true"></i></button></li>' % (CATP[p], CATP[p], ' data-cur="1"' if cur else "", t)
        return '<li><a href="%s"%s%s>%s</a></li>' % (u(p), ' class="rbl"' if t == "Rebates" else ' class="hot"' if t.startswith("Repairs") else "", cur, t)
    nav = "".join(li(t, p) for t, p in NAV)
    megas = ""
    for k in CATS:
        prods = [p for p in PRODUCTS if p["cat"] == k]
        brands = []
        for p in prods:
            if p["brand"] not in brands: brands.append(p["brand"])
        cp = CAT_SLUG[k] + "/"
        megas += ('<div class="mega" id="mega-%s" hidden><div class="wrap mega-g"><div class="mega-l"><b class="mega-t">%s</b><small>%s</small>'
                  '<span class="mega-h">Shop by brand</span><div class="mega-brands">%s</div>'
                  '<div class="mega-ctas"><a class="btn" href="%s">See all %s ›</a><button class="btn o" type="button" data-svc="%s">Get a free quote</button></div></div>'
                  '<div class="mega-r"><span class="mega-h">%d models</span><div class="mega-ps">%s</div></div></div></div>') % (
            k, esc(CATS[k]["name"]), esc(CATS[k]["sub"]),
            "".join('<a href="%s#brand=%s">%s</a>' % (u(cp), esc(b.replace(" ", "+")), logo_img(b, "bm bm-chip")) for b in brands),
            u(cp), esc(CATS[k]["name"].lower()), "tankless" if k == "water" else k, len(prods),
            "".join('<a class="mega-p" href="%s"><span>%s</span><b>%s</b><small>%s</small></a>' % (u(LINKS["product"][p["id"]]), pimg(p), esc(p["model"]), esc(p["brand"])) for p in prods))
    return ('<div class="strip"><div class="wrap"><span><a class="regsw" href="%s" title="Choose your province">%s GTA, Ontario <small>change</small></a> Serving the <b>GTA &amp; all of Ontario</b> · TSSA-registered · Free estimates</span>'
            '<span class="strip-r">{ACCT}<a class="smail" href="%s">%s</a><span class="pill-r"><i></i>24/7 Emergency · <a href="%s">%s</a></span></span></div></div>' % ("../" * (CUR["path"].count("/") + 1) + ("index.html" if MODE != "prod" else ""), ic("home"), MAILTO, EMAIL, TEL, PHONE) +
            '<header class="hdr" id="hdr"><div class="wrap bar"><a class="logo" href="%s" aria-label="Jora Mechanical Systems home">'
            '<span class="l3d" aria-hidden="true"><span class="slab"><span class="bk"></span><span class="lt"></span><span class="rt"></span><span class="tp"></span><span class="bt"></span><span class="f"><img alt="" src="%s"></span></span></span>'
            '<span><b>Jora Mechanical<br>Systems</b><small>Heating · Cooling · Plumbing</small></span></a>' % (u(""), asset(LOGO_FILE)) +
            between(BODY, '<div class="search" role="search">', '</div>\n    <div class="acts">').replace('\n    <div class="acts">', '') +
            '<div class="acts"><a class="call" href="%s"><small>Call us 24/7</small><b>%s</b></a>' % (TEL, PHONE) +
            '<a class="btn rb" href="%s">%s<span>Rebates</span></a>' % (u("rebates/"), ic("rebate")) +
            '<a class="btn o acct-b" href="%s" aria-label="Sign in or open my account">%s</a>' % (ACCT(), ic("user")) +
            '<button class="btn" type="button" data-open="quote">%s<span>Free Quote</span></button></div></div>' % ic("doc") +
            '<nav class="nav" aria-label="Main"><div class="wrap"><ul>' + nav + '</ul></div>' + megas + '</nav></header>')

def certband():
    L = [("tssa", "TSSA — Technical Standards &amp; Safety Authority", "TSSA registered contractor"),
         ("hrai", "HRAI — Heating, Refrigeration and Air Conditioning Institute of Canada", "HRAI member"),
         ("wsib", "WSIB Ontario", "WSIB covered")]
    return ('<section class="certband" aria-label="Licensed and insured"><div class="wrap"><h3>Licensed, registered &amp; insured</h3><div class="cb-row">'
            + "".join('<figure><img src="%s" alt="%s" loading="lazy" width="180" height="90"><figcaption>%s</figcaption></figure>' % (asset("img/cert-%s.webp" % k), alt, cap) for k, alt, cap in L)
            + '</div></div></section>')

def footer():
    return certband() + _footer().replace("{ACCT}", ACCT()).replace("{STAFF}", "../" * (CUR["path"].count("/") + 1) + "admin/" + ("index.html" if MODE != "prod" else "")).replace("{REGIONS}", "../" * (CUR["path"].count("/") + 1) + ("index.html" if MODE != "prod" else ""))

def _footer():
    svc = [(s["name"], LINKS["svc"][s["id"]]) for s in SERVICES if s["id"] != "erv"]
    col = lambda items: "<ul>" + "".join('<li><a href="%s">%s</a></li>' % (u(p), esc(t)) for t, p in items) + "</ul>"
    return ('<footer class="foot"><div class="wrap fg fg5">'
            '<div><h4>Jora Mechanical Systems</h4><p style="margin:0">Heating, cooling, hot water, indoor air quality and plumbing for homes and businesses.</p>'
            '<a class="ph" href="%s">%s</a><p style="margin:0">Emergency service 24/7</p><a class="fmail" href="mailto:info@joramechanicalsystems.com">info@joramechanicalsystems.com</a>'
            '<p style="margin:10px 0 0"><a href="%s">About us</a> · <a href="%s">Contact</a> · <a href="%s">Blog</a> · <a href="%s">FAQ</a> · <a href="%s">Privacy policy</a></p></div>' % (TEL, PHONE, u("about/"), u("contact/"), u("blog/"), u("faq/"), u("privacy/")) +
            '<div><h4>Services</h4>' + col(svc[:11]) + '</div><div><h4>More services</h4>' + col(svc[11:] + [("Rebates", "rebates/"), ("Our work", "our-work/"), ("Free quote", "free-quote/")]) + '</div>'
            '<div><h4>Brands</h4>' + col([(b, LINKS["brand"][b]) for b in BRAND_PAGES]) + '</div>'
            '<div><h4>Service areas</h4>' + col([(c[0], CITY_SLUGS[c[0]]) for c in CITY_PAGES[:14]] + [("All service areas", "service-areas/")]) + '</div>'
            '</div><div class="wrap fbadges" aria-label="Licences and certifications">%s</div>' % "".join(
                '<div class="fb"><span class="fb-i">%s</span><b>%s</b><small>%s</small></div>' % (ic(i_), esc(a_), esc(s_)) for a_, s_, i_ in BADGES) +
            '<div class="wrap flegal"><nav aria-label="Legal"><a href="%s">Privacy Policy</a><a href="%s">Terms and Conditions</a><a href="%s">Accessibility Policy</a><a href="%s">WSIB Clearance</a><a href="%s">Legal Notices</a><a href="%s">Sitemap</a><a href="{ACCT}">My account</a><a href="{STAFF}">Staff login</a><a href="{REGIONS}">Other regions</a></nav>'
            '<p class="tmnote">Jora Mechanical Systems is an independent contractor and is not affiliated with or endorsed by the manufacturers listed. All trademarks belong to their owners.</p><p>© %s Jora Mechanical Systems. All rights reserved.</p></div><button class="totop" type="button" aria-label="Back to top">%s</button></footer>' % (
                u("privacy/"), u("terms/"), u("accessibility/"), u("wsib-clearance/"), u("legal-notices/"), u("sitemap/"), datetime.date.today().year,
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 15l7-7 7 7"/></svg>') +
            header_mod.DOCK + header_mod.FDOCK +
            '<button class="btn k adm-fab" id="admFab" type="button">Admin</button>')

BUSINESS = {"@context": "https://schema.org", "@type": "HVACBusiness", "@id": SITE_URL + "#business", "name": J["company"], "url": SITE_URL,
            "telephone": "+1-905-667-2823", "email": EMAIL, "logo": SITE_URL + "assets/" + LOGO_FILE, "image": SITE_URL + "assets/" + LOGO_FILE,
            "openingHours": "Mo-Su 00:00-23:59", "areaServed": [{"@type": "City", "name": c} for c in [c[0] for c in CITY_PAGES]],
            "slogan": "Heating, cooling, hot water and plumbing — installed right.",
            "contactPoint": {"@type": "ContactPoint", "telephone": "+1-905-667-2823", "contactType": "customer service", "email": EMAIL, "areaServed": "CA", "availableLanguage": ["English"], "hoursAvailable": {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "00:00", "closes": "23:59"}},
            "hasOfferCatalog": {"@type": "OfferCatalog", "name": "HVAC and plumbing services", "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": PAGES[s]["h1"], "url": SITE_URL + s + "/"}} for s in PAGES]},
            "brand": [{"@type": "Brand", "name": b} for b in ALL_BRANDS],
            "knowsAbout": ["Furnace installation", "Air conditioner installation", "Heat pumps", "Tankless water heaters", "Ductwork", "HRV and ERV", "Plumbing", "Commercial HVAC"]}

def crumbs_html(cr):
    if not cr: return ""
    return '<nav class="crumbs" aria-label="Breadcrumb"><ol>' + "".join(
        ('<li><a href="%s">%s</a></li>' % (u(p), esc(t)) if p is not None else '<li aria-current="page">%s</li>' % esc(t)) for t, p in cr) + '</ol></nav>'
def crumbs_ld(cr):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": t, "item": SITE_URL + (p if p is not None else CUR["path"])} for i, (t, p) in enumerate(cr)]}

def page(path, title, desc, main, ld=None, crumbs=None, attrs="", og_img=None, map_=False, out_file=None, base=None):
    CUR["path"] = path
    if len(desc) > 158: desc = desc[:155].rsplit(" ", 1)[0].rstrip(",.;:—-") + "…"
    if len(title) > 70: title = title.replace(" | Jora Mechanical Systems", " | Jora").replace(" | Jora Mechanical", " | Jora")
    main = main() if callable(main) else main
    lds = [BUSINESS] + (ld or []) + ([crumbs_ld(crumbs)] if crumbs else [])
    canon = SITE_URL + path
    track = ""
    if GA4_ID or ADS_ID:
        first = GA4_ID or ADS_ID
        track = ('<script async src="https://www.googletagmanager.com/gtag/js?id=%s"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());%s%s</script>' %
                 (first, 'gtag("config","%s");' % GA4_ID if GA4_ID else "", 'gtag("config","%s");' % ADS_ID if ADS_ID else ""))
    h = ['<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
         '<meta http-equiv="Content-Security-Policy" content="%s"><meta name="referrer" content="strict-origin-when-cross-origin">' % CSP,
         '<title>%s</title><meta name="description" content="%s">' % (esc(title), esc(desc)),
         '<link rel="canonical" href="%s">' % canon,
         '<meta name="robots" content="%s">' % ("noindex,nofollow" if NOINDEX or "data-noindex" in attrs else "index,follow,max-image-preview:large"),
         '<meta property="og:type" content="website"><meta property="og:site_name" content="Jora Mechanical Systems"><meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s"><meta property="og:image" content="%s"><meta property="og:locale" content="en_CA"><meta name="twitter:card" content="summary_large_image">' % (
             esc(title), esc(desc), canon, SITE_URL + "assets/" + (og_img or LOGO_FILE)),
         ('<base href="%s">' % base) if base else "",
         '<meta name="geo.region" content="CA-ON"><meta name="geo.placename" content="Greater Toronto Area">',
         '<meta name="theme-color" content="#F96302"><link rel="icon" href="%s">' % asset(LOGO_FILE),
         ('<meta name="google-site-verification" content="%s">' % GSC_VERIFY) if GSC_VERIFY else "",
         '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;800&family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">',
         '<link rel="stylesheet" href="%s?v=%s">' % (asset("site.css"), VER["css"]), track,
         "".join('<script type="application/ld+json">%s</script>' % json.dumps(x, ensure_ascii=False).replace("</", "<\\/") for x in lds),
         '</head><body%s><div id="site">' % ((" " + attrs) if attrs else ""), WX, header(), '<main id="top">', crumbs_html(crumbs) if crumbs and path else "", main, '</main>', footer(), '</div>',
         OVERLAYS,
         '<script>var ROOT="%s";</script><script src="%s?v=%s"></script><script src="%s?v=%s"></script>' % ("../" * path.count("/"), asset("data.js"), VER["data"], asset("app.js"), VER["app"]),
         '</body></html>']
    out = OUT + "/" + (out_file or path + "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w").write("".join(h))
    if not out_file and "data-noindex" not in attrs: PAGES_OUT.append(path)
    if not out_file and "data-noindex" not in attrs: PAGE_INDEX.append({"path": path, "title": title, "desc": desc})

# ---------------------------------------------------------------- reusable blocks
def btns(svc, label="Get a free quote"):
    return '<div class="phero-ctas"><button class="btn" type="button" data-svc="%s">%s</button><a class="btn wk" href="%s">%s Call %s</a></div>' % (svc, label, TEL, ic("phone"), PHONE)
def phero(kick, h1, lead, svc, visual="", cls=""):
    return ('<section class="phero %s"><div class="wrap phero-g"><div class="phero-t"><span class="kick">%s</span><h1>%s</h1><p class="lead">%s</p>%s'
            '<ul class="trust"><li>%sLicensed &amp; insured</li><li>%sFree in-home quote</li><li>%s24/7 emergency</li></ul></div>%s</div></section>') % (
        cls, esc(kick), h1, esc(lead), btns(svc), ic("shield"), ic("doc"), ic("clock"), ('<div class="phero-v"><div class="tilt">' + visual + '</div></div>') if visual else "")
def qcard(svc):
    return ('<aside class="qcard"><span class="qc-ic">%s</span><h3>Free in-home quote</h3><p>Answer a few quick questions — takes 2 minutes. No pressure.</p>'
            '<button class="btn" type="button" data-svc="%s">Start my quote</button><a class="btn o" href="%s">Call %s</a>'
            '<a class="qmail" href="mailto:info@joramechanicalsystems.com">info@joramechanicalsystems.com</a><ul><li>Written, upfront pricing</li><li>Licensed technicians</li><li>Rebate help</li></ul></aside>') % (ic("doc"), svc, TEL, PHONE)
def faq_html(faq, title="Frequently asked questions"):
    if not faq: return ""
    return '<section class="sec"><div class="wrap narrow"><h2 class="h2">%s</h2><div class="faq">%s</div></div></section>' % (title, "".join(
        '<details><summary>%s</summary><p>%s</p></details>' % (esc(q), esc(a)) for q, a in faq))
def faq_ld(faq): return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}
def steps_mini():
    return '<section class="sec g"><div class="wrap"><h2 class="h2">How it works</h2><ol class="msteps">%s</ol></div></section>' % "".join(
        '<li><span class="ms-ic">%s<em>%02d</em></span><b>%s</b><small>%s</small></li>' % (ic(s[0]), i + 1, esc(s[1]), esc(s[2])) for i, s in enumerate(STEPS))
def cities_block(title="Areas we serve"):
    return '<section class="sec"><div class="wrap"><h2 class="h2">%s</h2><div class="chipsl">%s<a class="all" href="%s">All service areas ›</a></div></div></section>' % (
        title, "".join('<a href="%s">%s</a>' % (u(CITY_SLUGS[c[0]]), esc(c[0])) for c in CITY_PAGES), u("service-areas/"))
def cta_band(svc=None):
    return ('<section class="cta-band"><div class="wrap"><div><h2>Ready for a free quote?</h2><p>Takes 2 minutes. No pressure, no obligation.</p></div>'
            '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn w" %s type="button">Start my quote</button><a class="btn wk" href="%s">Call %s</a></div></div></section>') % (
        ('data-svc="%s"' % svc) if svc else 'data-open="quote"', TEL, PHONE)
def svc_tiles(svcs, city=None):
    out = []
    for sid in svcs:
        s = next(x for x in SERVICES if x["id"] == sid); sl = LINKS["svc"][sid]
        t = PAGES[sl[:-1]]
        out.append('<a class="stile" href="%s"><span class="st-i">%s</span><b>%s%s</b><small>%s</small></a>' % (u(sl), ic(s["ic"]), esc(t["h1"]), (" in " + esc(city)) if city else "", esc(t["lead"][:90].rsplit(" ", 1)[0] + "…")))
    return '<div class="stiles">' + "".join(out) + '</div>'
def lists(t):
    return ('<div class="lists"><div class="lcard"><h3>%s Signs you need us</h3><ul>%s</ul></div><div class="lcard ok"><h3>%s What\'s included</h3><ul>%s</ul></div></div>' % (
        ic("clock"), "".join("<li>" + esc(x) + "</li>" for x in t["signs"]), ic("check"), "".join("<li>" + esc(x) + "</li>" for x in t["included"])))
def rebate_callout():
    return ('<div class="rcall">%s<div><b>Heat pump rebates up to $10,000</b><p>New federal National Heat Pump Rebate (installs from Nov 1, 2026), plus Ontario\'s Home Renovation Savings rebates. We check what you qualify for.</p></div><a class="btn" href="%s">See rebates</a></div>' % (ic("rebate"), u("national-heat-pump-rebate/")))

# ---------------------------------------------------------------- HOME
def home():
    m = BODY[BODY.index('<main id="top">') + len('<main id="top">'):BODY.index('</main>')]
    m = m.replace('<h1 class="jx-title" id="jx-title">Comfort, installed right</h1>', '<h2 class="jx-title" id="jx-title">Comfort, installed right</h2>')
    m = m.replace('<div class="jx-tabs" role="tablist"', '<h1 class="jx-h1"><span class="h1-m">Furnace, AC, heat pump &amp; tankless experts in the GTA</span><span class="h1-d"><b>Heating, cooling &amp; gas.</b><small>Licensed GTA technicians · 24/7 repairs</small></span></h1>\n      <div class="jx-tabs" role="tablist"')
    m = m.replace('<button class="btn" type="button" data-work="all">See all our work ›</button>', '<a class="btn" href="%s">See all our work ›</a>' % u("our-work/"))
    m = m.replace('{{MAP}}', MAP)
    m = re.sub(r'<!-- SOLUTIONS -->\s*<section class="sec sol" id="solutions">.*?</section>', lambda _: solpages.home_section(globals()), m, count=1, flags=re.S)
    m = m.replace('<div class="blog reveal" id="blogGrid"></div>', '<div class="blog reveal" id="blogGrid">%s</div><p style="margin-top:16px"><a class="btn o" href="%s">All articles ›</a></p>' % (
        "".join(post_card(p, i) for i, p in enumerate(POSTS[:3])), u("blog/")))
    facts = ('<section class="sec facts"><div class="wrap two"><div class="prose"><span class="kick">About Jora</span><h2 class="h2">Heating &amp; cooling contractor for Toronto and the GTA</h2>'
             '<p>Jora Mechanical Systems is a licensed heating, cooling, hot water and plumbing contractor serving homes and businesses in Toronto, Mississauga, Brampton, Vaughan, Markham, Oakville, Durham Region and every other city and town in the GTA.</p>'
             '<p>We install and repair <a href="%s">furnaces</a>, <a href="%s">air conditioners</a>, <a href="%s">cold-climate heat pumps</a>, <a href="%s">tankless water heaters</a>, <a href="%s">AirMax air handlers</a>, <a href="%s">ductwork</a> and <a href="%s">HRV/ERV ventilation</a>, and handle <a href="%s">commercial HVAC</a>. Every job starts with a free in-home visit and a written quote, and we help you check <a href="%s">Ontario rebates</a>.</p></div>'
             '<div class="glance"><b>Jora at a glance</b><dl><div><dt>Phone</dt><dd><a href="%s">%s</a> (24/7)</dd></div><div><dt>Email</dt><dd><a href="mailto:info@joramechanicalsystems.com">info@joramechanicalsystems.com</a></dd></div><div><dt>Services</dt><dd>Furnaces, AC, heat pumps, tankless, air handlers, ductwork, HRV/ERV, plumbing, commercial</dd></div>'
             '<div><dt>Brands</dt><dd>%s</dd></div><div><dt>Service area</dt><dd><a href="%s">The GTA &amp; all of Ontario</a> — Toronto, Barrie, Niagara, London, Windsor, Kingston, Ottawa and more</dd></div><div><dt>Licensing</dt><dd>%s</dd></div><div><dt>Quotes</dt><dd>Free, written, after an in-home visit</dd></div></dl></div></div></section>') % (
        u("furnaces/"), u("air-conditioners/"), u("heat-pumps/"), u("tankless-water-heaters/"), u("air-handlers/"), u("ductwork/"), u("hrv-erv/"), u("commercial-hvac/"), u("rebates/"),
        TEL, PHONE, esc(", ".join(ALL_BRANDS)), u("service-areas/"), esc(", ".join(l[0] for l in J["licences"][:4])))
    m = m.replace('<section class="cta-band">', facts + '<section class="cta-band">')
    # crawlable links to every main page, right under the services buttons
    m = m.replace('<div class="qs reveal" id="qs"></div>', '<div class="qs reveal" id="qs"></div><div class="hlinks">%s</div>' % "".join(
        '<a href="%s">%s</a>' % (u(sl + "/"), esc(PAGES[sl]["h1"])) for sl in PAGES))
    return m
def post_card(p, i):
    return ('<article class="post"><div class="pt" style="background:%s"><span>%s</span>%s</div><div class="pb"><time>%s</time><h3><a href="%s">%s</a></h3><p>%s</p><a class="more" href="%s">Read more ›</a></div></article>' % (
        p["col"], esc(p["tag"]), ic(p["ic"]), esc(p["date"]), u(LINKS["post"][i]), esc(p["t"]), esc(p["x"]), u(LINKS["post"][i])))

page("", "Furnace & AC Installation — Toronto, GTA & Ontario | Jora",
     "Furnace replacement, AC, heat pumps and tankless water heaters across the GTA and Ontario, from Windsor to Ottawa. Rebates help, 24/7 repairs, free in-home quote: 905-667-2823.",
     home, ld=[{"@context": "https://schema.org", "@type": "WebSite", "name": "Jora Mechanical Systems — GTA", "url": SITE_URL, "inLanguage": "en-CA"}])

# ---------------------------------------------------------------- SERVICE & CATEGORY PAGES
for sl, t in PAGES.items():
    if sl in SOL_SLUGS: continue
    def main(sl=sl, t=t):
        prods = [p for p in PRODUCTS if p["cat"] == t.get("cat")]
        if prods:
            brands = []
            for p in prods:
                if p["brand"] not in brands: brands.append(p["brand"])
            h = ('<section class="cattop"><div class="wrap"><div class="ct-h"><span class="ct-ic">%s</span><div><span class="kick">%s</span><h1>%s <span>in the GTA</span></h1><p>%s</p></div></div>'
                 '<div class="ct-step"><b>1</b> Choose a brand</div><div class="pfilter big" role="group" aria-label="Filter by brand"><button type="button" data-pf="All" aria-pressed="true"><b>All brands</b><small>%d models</small></button>%s</div>'
                 '<div class="ct-step"><b>2</b> Pick a model <small>or <button type="button" class="lk" data-svc="%s">skip — I\'m not sure what I need</button></small></div><div class="pgrid" data-cat="%s">%s</div>'
                 '<div class="ct-next"><div><b>3</b><span><strong>Get your free quote</strong><small>Tell us about your home — takes 2 minutes. We\'ll recommend the right model and size.</small></span></div><button class="btn" type="button" data-svc="%s">Start my quote ›</button></div></div></section>') % (
                ic(t["ic"]), esc(t["kick"]), esc(t["h1"]), esc(t["lead"]), len(prods),
                "".join('<button type="button" data-pf="%s" aria-pressed="false">%s<small>%d model%s</small></button>' % (esc(b), logo_img(b, "bm bm-chip"), sum(1 for p in prods if p["brand"] == b), "" if sum(1 for p in prods if p["brand"] == b) == 1 else "s") for b in brands),
                t["svc"], t["cat"], "".join(card(p) for p in prods), t["svc"])
        else:
            h = phero(t["kick"], esc(t["h1"]) + ' <span>in the GTA</span>', t["lead"], t["svc"], '<div class="bigic">' + ic(t["ic"]) + '</div>', "red" if t.get("red") else "")
        glance = ('<div class="glance"><b>At a glance</b><dl><div><dt>Service area</dt><dd>The GTA &amp; all of Ontario — from Windsor to Ottawa</dd></div><div><dt>Quote</dt><dd>Free, in writing, after an in-home visit</dd></div>'
                  '<div><dt>Emergency</dt><dd>24/7 — <a href="%s">%s</a></dd></div><div><dt>Licensing</dt><dd>%s</dd></div></dl></div>') % (TEL, PHONE, esc(", ".join(l[0] for l in J["licences"][:3])))
        h += '<section class="sec g"><div class="wrap two"><div class="prose">%s%s%s%s</div>%s</div></section>' % (
            ('<p class="quick"><strong>Quick answer:</strong> ' + esc(QUICK[sl]) + '</p>') if sl in QUICK else "", glance + blogmd.render(t["body"], u), lists(t), rebate_callout() if sl in ("heat-pumps", "smart-thermostats", "air-conditioners") else "", qcard(t["svc"]))
        if t.get("sol"):
            h += '<section class="sec sol"><div class="wrap"><div class="sol-tabs" role="tablist" id="solTabs"></div><div class="sol-stage" id="solStage"></div></div></section>'
        h += steps_mini() + faq_html(t["faq"]) + cities_block() + cta_band(t["svc"])
        return h
    ld = [faq_ld(t["faq"]), {"@context": "https://schema.org", "@type": "Service", "name": t["h1"], "serviceType": t["h1"], "provider": {"@id": SITE_URL + "#business"},
          "areaServed": "Greater Toronto Area, Ontario", "description": t["desc"]}]
    page(sl + "/", SEO.get(sl, (t["title"],))[0], SEO.get(sl, (0, t["desc"]))[1], main, ld=ld, crumbs=[("Home", ""), (t["h1"], None)], attrs=('data-sol="%s"' % t["sol"]) if t.get("sol") else "")

# ---------------------------------------------------------------- SOLUTION PAGES (home / commercial / industrial)
solpages.build(globals(), "gta")

page("products/item/", "Product | Jora Mechanical Systems", "Product details, specs and a free installation quote from Jora Mechanical Systems.",
     '<section class="sec"><div class="wrap" id="pItem"><p style="color:#666">Loading…</p></div></section>' + cta_band(), attrs='data-noindex="1"')

page("blog/post/", "Advice | Jora Mechanical Systems", "Heating, cooling and hot water advice from Jora Mechanical Systems.",
     '<section class="sec"><div class="wrap narrow" id="postItem"><p style="color:#666">Loading…</p></div></section>' + cta_band(), attrs='data-noindex="1"')

page("page/", "Jora Mechanical Systems", "Jora Mechanical Systems — heating, cooling and hot water.",
     '<section class="sec"><div class="wrap narrow" id="cpItem"><p style="color:#666">Loading…</p></div></section>' + cta_band(), attrs='data-noindex="1"')

# ---------------------------------------------------------------- PRODUCT PAGES
for p in PRODUCTS:
    def main(p=p):
        rel = [x for x in PRODUCTS if x["cat"] == p["cat"] and x["id"] != p["id"]][:4]
        catp = CAT_SLUG[p["cat"]] + "/"
        svc = "tankless" if p["cat"] == "water" else p["cat"]
        h = ('<section class="prod"><div class="wrap prod-g"><div class="prod-v"><div class="tilt">%s</div>%s</div><div class="prod-i">'
             '<a class="pbrand" href="%s">%s</a><h1>%s</h1><p class="lead">%s</p><div class="kv big">%s</div>'
             '<div class="phero-ctas"><button class="btn" type="button" data-quote-product="%s">Get a quote for this</button><a class="btn o" href="%s">Call %s</a></div>'
             '<p class="note">Installed price depends on your home — your free written quote includes equipment, labour and permits.</p></div></div></section>') % (
            pimg(p, eager=True), ('<span class="flag big%s">%s</span>' % (" red" if p.get("flagRed") else "", esc(p["flag"]))) if p.get("flag") else "",
            u(LINKS["brand"][p["brand"]]), logo_img(p["brand"], "bm bm-hero"), esc(p["name"]), esc(p.get("tag", "")), "".join("<span>" + esc(f) + "</span>" for f in p.get("feats3", [])),
            esc(p["id"]), TEL, PHONE)
        h += ('<section class="sec g"><div class="wrap two"><div><h2 class="h2">Specifications</h2><table class="spec"><tbody>%s</tbody></table>%s'
              '<p class="src">Specs from the manufacturer and may vary by size and model.%s</p></div>%s</div></section>') % (
            "".join('<tr><th>%s</th><td>%s</td></tr>' % (esc(a), esc(b)) for a, b in p.get("specs", [])),
            ('<h2 class="h2" style="margin-top:28px">Features</h2><ul class="fe">%s</ul>' % "".join("<li>" + esc(f) + "</li>" for f in p.get("feats", []))) if p.get("feats") else "",
            (' <a href="%s" target="_blank" rel="noopener nofollow">Source</a>' % esc(p["src"])) if p.get("src") else "", qcard(svc))
        if rel: h += '<section class="sec"><div class="wrap"><div class="sech"><h2 class="h2">More %s</h2><a class="btn o" href="%s">See all ›</a></div><div class="pgrid">%s</div></div></section>' % (
            esc(CATS[p["cat"]]["name"].lower()), u(catp), "".join(card(x) for x in rel))
        return h + steps_mini() + cta_band(svc)
    ld = [{"@context": "https://schema.org", "@type": "Product", "name": p["name"], "brand": {"@type": "Brand", "name": p["brand"]}, "description": p.get("tag", ""), "category": CATS[p["cat"]]["name"],
           **({"image": SITE_URL + "assets/img/" + p["img"] + ".webp"} if p.get("img") else {})}]
    page(LINKS["product"][p["id"]], ("%s | Toronto & GTA Install | Jora" % p["name"]) if len(p["name"]) < 38 else ("%s | Jora" % p["name"]),
         "%s: %s Specs, features and a free installation quote in Toronto & the GTA." % (p["name"], p.get("tag", "")),
         main, ld=ld, crumbs=[("Home", ""), (CATS[p["cat"]]["name"], CAT_SLUG[p["cat"]] + "/"), (p["name"], None)], og_img=("img/" + p["img"] + ".webp") if p.get("img") else None)

# ---------------------------------------------------------------- BRAND PAGES
for b in BRAND_PAGES:
    prods = [p for p in PRODUCTS if p["brand"] == b]
    cats = []
    for p in prods:
        if CATS[p["cat"]]["name"] not in cats: cats.append(CATS[p["cat"]]["name"])
    def main(b=b, prods=prods, cats=cats):
        return ('<section class="phero brandh"><div class="wrap phero-g"><div class="phero-t"><span class="kick">Brands we install</span><div class="blogo">%s</div><h1>%s %s <span>installed in the GTA</span></h1><p class="lead">%s</p>%s</div><div class="phero-v"><div class="tilt">%s</div></div></div></section>' % (
            logo_img(b, "bm bm-hero"), esc(b), esc(" & ".join(cats).lower()), esc(BRAND_TEXT.get(b, "")), btns("tankless" if prods[0]["cat"] == "water" else prods[0]["cat"]), pimg(prods[0], eager=True))
            + '<section class="sec"><div class="wrap"><h2 class="h2">%s products</h2><div class="pgrid">%s</div></div></section>' % (esc(b), "".join(card(p) for p in prods))
            + '<section class="sec g"><div class="wrap"><h2 class="h2">Other brands we install</h2><div class="blogos">%s</div></div></section>' % "".join(
                '<a href="%s">%s</a>' % (u(LINKS["brand"][x]), logo_img(x, "bm bm-chip")) for x in BRAND_PAGES if x != b) + cta_band())
    page(LINKS["brand"][b], "%s %s Installation Toronto & GTA | Jora" % (b, ", ".join(c.replace("Tankless Water Heaters", "Tankless").replace("Air Conditioners", "AC") for c in cats)),
         "%s %s installed and serviced by licensed technicians across Toronto & the GTA. Free in-home quote — call %s." % (b, " and ".join(c.lower() for c in cats), PHONE),
         main, crumbs=[("Home", ""), ("Brands", None if False else "brands/"), (b, None)])

# brands index
page("brands/", "HVAC & Water Heater Brands We Install | Jora Mechanical",
     "Lennox, Carrier, Trane, KeepRite, Goodman, TOSOT, Midea, Gree, Navien, Rinnai, Rheem, Bradford White, Noritz and AirMax — installed across the GTA.",
     lambda: phero("Brands", "Brands <span>we install</span>", "The top heating, cooling and hot water brands — installed and serviced by our licensed team.", "furnace") +
     '<section class="sec"><div class="wrap"><div class="bgrid">%s</div></div></section>' % "".join(
         '<a class="bcard" href="%s">%s<small>%s</small></a>' % (u(LINKS["brand"][b]), logo_img(b, "bm bm-hero"), esc(BRAND_TEXT.get(b, ""))) for b in BRAND_PAGES) + cta_band(),
     crumbs=[("Home", ""), ("Brands", None)])

# ---------------------------------------------------------------- CITY PAGES
CORE = ["furnace", "ac", "hp", "tankless", "ah", "repair", "duct", "hrv", "plumb", "maint", "commercial", "water"]
for i, (city, region, hoods) in enumerate(CITY_PAGES):
    near = [c[0] for c in CITY_PAGES if c[1] == region and c[0] != city][:5]
    def main(city=city, region=region, hoods=hoods, near=near, i=i):
        faq = [("Do you serve all of %s?" % city, "Yes — we serve every neighbourhood in %s, including %s." % (city, ", ".join(hoods[:4]))),
               ("How fast can you come for a repair in %s?" % city, "Our emergency line is open 24/7. Call %s and we'll get a technician to you as soon as possible." % PHONE),
               ("Are there heat pump rebates in %s?" % city, "Ontario's Home Renovation Savings Program is available to eligible homeowners across the province, including %s. We'll check what you qualify for." % city)]
        h = phero(REGION_LABEL.get(region, region), 'Heating &amp; cooling in <span>%s</span>' % esc(city),
                  "Furnaces, air conditioners, heat pumps, tankless water heaters and 24/7 repairs for homes and businesses in %s." % city, "furnace",
                  '<div class="cityv">%s<b>%s</b><small>We serve every neighbourhood</small><form class="pcheck" id="pcForm" autocomplete="off"><label for="pcIn" class="vh">Your postal code</label><input id="pcIn" maxlength="7" placeholder="Check your postal code"><button type="submit">Check</button></form><p class="pres" id="pcRes" aria-live="polite"></p></div>' % (ic("home"), esc(city)))
        h += '<section class="sec"><div class="wrap"><h2 class="h2">Services in %s</h2>%s</div></section>' % (esc(city), svc_tiles(CORE, city))
        h += ('<section class="sec g"><div class="wrap two"><div class="prose"><h2 class="h2">Your local %s HVAC team</h2><p>%s</p>%s<p>Whether you need a new high-efficiency furnace, a quieter air conditioner, a cold-climate heat pump with rebates or a tankless water heater, our licensed technicians handle it from the free in-home visit to the final walkthrough.</p>'
              '<h3>Neighbourhoods we serve in %s</h3><div class="chipsl">%s</div>%s</div>%s</div></section>') % (
            esc(city), esc(REGION_TEXT[region]), ("<p>%s</p>" % esc(CITY_NOTES[city])) if city in CITY_NOTES else "", esc(city), "".join("<span>" + esc(x) + "</span>" for x in hoods),
            ('<h3>Nearby</h3><div class="chipsl">%s</div>' % "".join('<a href="%s">%s</a>' % (u(CITY_SLUGS[n]), esc(n)) for n in near)) if near else "", qcard("furnace"))
        return h + rebate_section_small() + faq_html(faq) + cta_band()
    faq = [("Do you serve all of %s?" % city, "Yes — we serve every neighbourhood in %s, including %s." % (city, ", ".join(hoods[:4]))),
           ("How fast can you come for a repair in %s?" % city, "Our emergency line is open 24/7. Call %s and we'll get a technician to you as soon as possible." % PHONE),
           ("Are there heat pump rebates in %s?" % city, "Ontario's Home Renovation Savings Program is available to eligible homeowners across the province, including %s. We'll check what you qualify for." % city)]
    def rebate_section_small(): return '<section class="sec"><div class="wrap">' + rebate_callout() + '</div></section>'
    page(CITY_SLUGS[city], "Furnace, AC & Heat Pump Services in %s, ON | Jora Mechanical" % city,
         "Furnace replacement, AC and heat pump installation, tankless water heaters and 24/7 repairs in %s, Ontario. Free in-home quotes, rebates help, licensed technicians. Call %s." % (city, PHONE),
         main, ld=[faq_ld(faq), {"@context": "https://schema.org", "@type": "Service", "name": "Heating and cooling services in " + city, "serviceType": "HVAC installation and repair",
                   "provider": {"@id": SITE_URL + "#business"}, "areaServed": {"@type": "City", "name": city, "containedInPlace": {"@type": "AdministrativeArea", "name": "Ontario"}}}],
         crumbs=[("Home", ""), ("Service areas", "service-areas/"), (city, None)])

def areas():
    groups = [("City of Toronto", "Toronto"), ("Peel Region", "Peel"), ("York Region", "York"), ("Halton Region", "Halton"), ("Durham Region", "Durham"), ("Hamilton", "Hamilton"),
              ("Barrie, Lake Simcoe, Muskoka &amp; Georgian Bay", "Simcoe"), ("Niagara &amp; Lake Erie", "Niagara"), ("Southwestern Ontario", "Southwest"), ("Windsor-Essex &amp; Chatham-Kent", "Windsor"),
              ("Lake Huron shore", "Huron"), ("Lake Ontario east, Kingston &amp; Ottawa", "East")]
    g = "".join('<div class="areg"><h3>%s</h3><div class="chipsl big">%s</div></div>' % (t, "".join('<a href="%s">%s</a>' % (u(CITY_SLUGS[c[0]]), esc(c[0])) for c in CITY_PAGES if c[1] == r)) for t, r in groups)
    return (phero("Service areas", "The GTA and <span>all of Ontario</span>", "Every city and town in the GTA, plus Barrie, Muskoka and Georgian Bay, Niagara, London and Kitchener-Waterloo, Windsor, the Lake Huron shore, Trenton, Belleville, Kingston and Ottawa. Tap a city to see it on the map.", "furnace")
            + '<section class="mapband" id="area" aria-label="Service area map"><div class="mapfull">' + MAP + '</div></section>'
            + '<section class="sec"><div class="wrap"><h2 class="h2">All our service areas in Ontario</h2><div class="aregs">%s</div></div></section>' % g + cta_band())
page("service-areas/", "Service Areas — GTA & All of Ontario | Jora Mechanical", "Furnace, AC and heat pump service across the GTA and Ontario: Toronto, Barrie, Niagara, London, Kitchener, Windsor, Sarnia, Owen Sound, Trenton, Belleville, Kingston, Ottawa and more. Check your postal code.",
     areas, crumbs=[("Home", ""), ("Service areas", None)])

# ---------------------------------------------------------------- REBATES
def rebates():
    s = between(BODY, '<!-- REBATES -->', '</section>').replace('<section class="sec rebates" id="rebates">', '<section class="sec rebates first" id="rebates">').replace('<h2>Rebates may be available', '<h1>Rebates may be available').replace('qualify for</em></h2>', 'qualify for</em></h1>')
    faq = [("Who offers these rebates?", "Ontario's Home Renovation Savings Program, delivered by Save on Energy and Enbridge Gas."),
           ("Do I need an energy assessment?", "Some upgrades, like insulation and windows, may need one. Heat pumps and smart thermostats often don't — rules change, so check before you start."),
           ("Can I combine rebates?", "Often, yes — for example a heat pump plus a smart thermostat. We'll list what applies in your quote."),
           ("Do you help with the paperwork?", "Yes. We tell you which rebates you may qualify for and help you with the documents you need.")]
    return s + '<section class="sec"><div class="wrap two"><div class="prose"><h2 class="h2">How rebates work</h2><ol class="olist"><li>Free visit and quote — we flag the rebates that may apply.</li><li>Check eligibility and any pre-approval steps before work starts.</li><li>We install your upgrade with the documents the program asks for.</li><li>You submit your application and receive your rebate after approval.</li></ol><p>Program details: <a href="%s" target="_blank" rel="noopener">Save on Energy — Home Renovation Savings</a>.</p><div class="rcall" style="margin-top:18px">%s<div><b>New: federal heat pump rebate up to $10,000</b><p>Canada\'s National Heat Pump Rebate covers cold-climate heat pumps installed from November 1, 2026. Applications open early 2027.</p></div><a class="btn" href="%s">How it works</a></div></div>%s</div></section>' % (REBATES["link"], ic("rebate"), u("national-heat-pump-rebate/"), qcard("hp")) + faq_html(faq) + cta_band("hp")
page("rebates/", "Ontario & Federal HVAC Rebates 2026 — Heat Pumps up to $10,000 | Jora",
     "New federal heat pump rebate up to $10,000, plus Ontario Home Renovation Savings: up to $7,500 for cold-climate heat pumps, $12,000 geothermal. Free quote.",
     rebates, crumbs=[("Home", ""), ("Rebates", None)])

def nhpr_page():
    faq = nhpr_faq("Ontario")
    return (phero("Federal rebate", 'Up to <span>$10,000</span> for a heat pump', "Canada's new National Heat Pump Rebate pays up to $10,000 toward a cold-climate heat pump installed by an HVAC contractor. Installs from November 1, 2026 may qualify.", "hp")
            + nhpr_body("Ontario", u, ic, qcard("hp"), '<h3>Ontario rebates too</h3><p>Ontario\'s Home Renovation Savings Program (Save on Energy and Enbridge Gas) also offers heat pump rebates. Each program sets its own rules on combining rebates, so we check both for you when we quote. <a href="%s">See Ontario rebates</a>.</p>' % u("rebates/")) + faq_html(faq) + cta_band("hp"))
page("national-heat-pump-rebate/", "Canada Heat Pump Rebate up to $10,000 — Ontario | Jora Mechanical",
     "The federal National Heat Pump Rebate pays $2,000 or up to $10,000 for a cold-climate heat pump in Ontario. Installs from Nov 1, 2026 may qualify. Free quote with AHRI numbers.",
     nhpr_page, ld=[faq_ld(nhpr_faq("Ontario"))], crumbs=[("Home", ""), ("Rebates", "rebates/"), ("National Heat Pump Rebate", None)])

# ---------------------------------------------------------------- OUR WORK
def work():
    return ('<section class="wp-top first"><div class="wrap"><span class="kick">Our work</span><h1 class="wph">Installations by <em>Jora technicians</em></h1>'
            '<p>Furnaces, air conditioners, heat pumps, tankless, air handlers, ductwork and commercial jobs across the GTA.</p><div class="wp-stats" id="wpStats"></div></div></section>'
            '<div class="wrap"><div class="wp-filters" id="wpFilters" role="tablist"></div><div class="wp-grid" id="wpGrid"></div>'
            '<div class="wp-std"><h2 class="h2">What every Jora install includes</h2><div class="std" id="wpStd"></div></div></div>' + cta_band())
page("our-work/", "Our Work — Furnace, AC & Heat Pump Installations | Jora Mechanical", "See installations by Jora technicians across the GTA: furnaces, air conditioners, heat pumps, tankless water heaters, ductwork and commercial HVAC.",
     work, crumbs=[("Home", ""), ("Our work", None)])

# ---------------------------------------------------------------- ABOUT / CONTACT / QUOTE / PRIVACY
def about():
    team = between(BODY, '<!-- TEAM -->', '</section>').replace('<h2>Real technicians.', '<h1 class="abh">Real technicians.').replace('Real accountability.</span></h2>', 'Real accountability.</span></h1>')
    lic = between(BODY, '<!-- LICENCES -->', '</section>')
    proc = between(BODY, '<!-- PROCESS -->', '</section>')
    return team + '<section class="sec"><div class="wrap narrow prose">%s</div></section>' % "".join("<p>" + esc(x) + "</p>" for x in ABOUT_TEXT) + lic + proc + cta_band()
page("about/", "About Jora Mechanical Systems — Licensed GTA HVAC Contractor", "Meet Jora Mechanical Systems: licensed, insured heating, cooling, hot water and plumbing technicians serving the GTA 24/7.",
     about, crumbs=[("Home", ""), ("About", None)])
def contact():
    return (phero("Contact", "Talk to <span>Jora</span>", "Call, chat or book online — our emergency line is open 24/7.", "furnace") +
            '<section class="sec"><div class="wrap ccards"><a class="ccard" href="%s">%s<b>%s</b><small>Call or text · 24/7 emergency</small></a>'
            '<a class="ccard" href="mailto:info@joramechanicalsystems.com">%s<b>Email us</b><small>info@joramechanicalsystems.com</small></a><button class="ccard" type="button" data-open="quote">%s<b>Free quote</b><small>Book online in 2 minutes</small></button>'
            '<button class="ccard" type="button" data-chat-open="book">%s<b>Live chat</b><small>Ask anything, any time</small></button>'
            '<a class="ccard" href="%s">%s<b>Service areas</b><small>Every city in the GTA</small></a></div></section>' % (TEL, ic("phone"), PHONE, ic("mail"), ic("doc"), ic("chat"), u("service-areas/"), ic("home")) + cta_band())
page("contact/", "Contact Jora Mechanical Systems — 905-667-2823 | 24/7", "Call 905-667-2823, chat with us or book a free in-home quote. Heating, cooling and plumbing across the GTA, 24/7 emergency service.",
     contact, crumbs=[("Home", ""), ("Contact", None)])
page("free-quote/", "Free HVAC Quote — Furnace, AC, Heat Pump, Tankless | Jora Mechanical", "Get a free written quote for a furnace, air conditioner, heat pump, tankless water heater or any HVAC service in the GTA. Takes 2 minutes.",
     lambda: phero("Free quote", "Get your <span>free quote</span>", "Pick a service, answer a few quick questions, and we'll get back to you with a written quote.", "furnace") +
     '<section class="sec"><div class="wrap"><div class="qs" id="qs"></div></div></section>' + steps_mini(), crumbs=[("Home", ""), ("Free quote", None)], attrs='data-autoquote="1"')
PRIVACY = [
 ("Who we are", ["Jora Mechanical Systems (\"Jora\", \"we\") provides heating, cooling, hot water and plumbing services across the Greater Toronto Area, Ontario. This policy explains how we collect, use and protect personal information through this website, in line with Canada's Personal Information Protection and Electronic Documents Act (PIPEDA)."]),
 ("Information we collect", ["Information you give us: when you request a quote, book a visit, use the chat or call us, you may give us your name, phone number, email address, street address, postal code, details about your home or building (for example home type, size, equipment age) and anything you write in a message.",
   "Information collected automatically: like most websites, our hosting provider may record basic technical data such as your IP address, browser type and the pages you visit. To match the site's colours to your local weather, the site looks up your approximate city from your internet connection and fetches the current weather. This lookup is not linked to your name and is kept only in your browser for about 30 minutes.",
   "Browser storage: the site stores small settings in your browser, such as the thermostat temperature you chose and the current weather theme. These are not used to identify you."]),
 ("How we use your information", ["To answer your request, prepare quotes, schedule and carry out work, and provide warranty and after-sales service.",
   "To tell you about rebates or programs that may apply to your project.",
   "To improve our website and services.",
   "We only send marketing emails if you have agreed to receive them, as required by Canada's Anti-Spam Legislation (CASL). You can unsubscribe at any time."]),
 ("Sharing", ["We do not sell or rent your personal information.",
   "We may share information only where needed to provide your service — for example with equipment manufacturers to register a warranty, with rebate programs when you ask us to help with an application, with municipalities for permits, or with service providers who help us run our business (such as email and website hosting). They may only use it for that purpose.",
   "We may disclose information if required by law."]),
 ("Third-party services used by this website", ["Fonts are loaded from Google Fonts. Your approximate location is looked up through an IP-location service (geojs.io or ipwho.is) and the weather is loaded from Open-Meteo. Quote requests may be sent by email. If we add Google Analytics or Google Ads to measure visits and ads, they may use cookies; we will update this policy when we do."]),
 ("Keeping your information safe", ["We take reasonable steps to protect personal information from loss, misuse and unauthorized access, and we keep it only as long as we need it for the purposes above or as required by law (for example for tax and warranty records)."]),
 ("Your choices and rights", ["You can ask to see the personal information we hold about you, ask us to correct it, or ask us to delete it where we are not required to keep it. You can also withdraw consent to marketing at any time."]),
 ("Children", ["This website is meant for adults arranging home or business services. We do not knowingly collect information from children."]),
 ("Changes to this policy", ["We may update this policy from time to time. The date below shows when it was last changed."]),
 ("Contact us", ["Questions or requests about your privacy? Email %s or call us at %s." % (EMAIL, PHONE)]),
]
page("privacy/", "Privacy Policy | Jora Mechanical Systems", "How Jora Mechanical Systems collects, uses and protects personal information sent through this website, in line with Canada's PIPEDA and CASL.",
     lambda: '<section class="sec first"><div class="wrap narrow prose policy"><span class="kick">Legal</span><h1 class="h1s">Privacy policy</h1><p class="lead">Last updated: %s</p><nav class="toc" aria-label="On this page"><ol>%s</ol></nav>%s</div></section>' % (
         datetime.date.today().strftime("%B %-d, %Y"), "".join('<li><a href="#p%d">%s</a></li>' % (i, esc(h)) for i, (h, _) in enumerate(PRIVACY)),
         "".join('<h2 id="p%d" class="h3">%d. %s</h2>%s' % (i, i + 1, esc(h), "".join("<p>" + esc(x) + "</p>" for x in ps)) for i, (h, ps) in enumerate(PRIVACY))),
     crumbs=[("Home", ""), ("Privacy policy", None)])

# ---------------------------------------------------------------- LEGAL PAGES
def legal_page(path, title, desc, h1, kick, sections, extra=""):
    page(path, title, desc, lambda: '<section class="sec first"><div class="wrap narrow prose policy"><span class="kick">%s</span><h1 class="h1s">%s</h1><p class="lead">Last updated: %s</p><nav class="toc" aria-label="On this page"><ol>%s</ol></nav>%s%s</div></section>' % (
        kick, esc(h1), datetime.date.today().strftime("%B %-d, %Y"), "".join('<li><a href="#p%d">%s</a></li>' % (i, esc(h)) for i, (h, _) in enumerate(sections)),
        "".join('<h2 id="p%d" class="h3">%d. %s</h2>%s' % (i, i + 1, esc(h), "".join("<p>" + esc(x) + "</p>" for x in ps)) for i, (h, ps) in enumerate(sections)), extra),
        crumbs=[("Home", ""), (h1, None)])
legal_page("terms/", "Terms and Conditions | Jora Mechanical Systems", "Terms and conditions for using the Jora Mechanical Systems website and our heating, cooling and plumbing services in Ontario.",
           "Terms and conditions", "Legal", TERMS, '<p class="src">Ontario consumers: <a href="https://www.ontario.ca/page/your-rights-under-consumer-protection-act" target="_blank" rel="noopener">your rights under the Consumer Protection Act (Government of Ontario)</a>.</p>')
legal_page("accessibility/", "Accessibility Policy (AODA) | Jora Mechanical Systems", "Jora Mechanical Systems' accessibility policy under the Accessibility for Ontarians with Disabilities Act (AODA) Customer Service Standard.",
           "Accessibility policy", "AODA", ACCESS)
legal_page("legal-notices/", "Legal Notices | Jora Mechanical Systems", "Trademark, product information, rebate and copyright notices for the Jora Mechanical Systems website.", "Legal notices", "Legal", LEGAL)
page("wsib-clearance/", "WSIB Clearance Certificate | Jora Mechanical Systems", "Jora Mechanical Systems maintains WSIB coverage in Ontario. Request a current WSIB clearance certificate before your job starts.",
     lambda: phero("WSIB", "WSIB <span>clearance</span>", "Covered by Ontario's Workplace Safety and Insurance Board — clearance certificate available on request.", "furnace", '<div class="bigic">' + ic("shield") + '</div>') +
     '<section class="sec"><div class="wrap two"><div class="prose">%s<h3>Request a clearance certificate</h3><p>Call <a href="%s">%s</a>, email <a href="mailto:info@joramechanicalsystems.com">info@joramechanicalsystems.com</a> or ask in the chat and we\'ll send you a current certificate for your project.</p>'
     '<p class="src">Check a contractor yourself: <a href="https://www.wsib.ca/en/clearances" target="_blank" rel="noopener">WSIB clearances (wsib.ca)</a>.</p></div>%s</div></section>' % ("".join("<p>" + esc(x) + "</p>" for x in WSIB_TEXT), TEL, PHONE, qcard("commercial")) + cta_band(),
     crumbs=[("Home", ""), ("WSIB clearance", None)])

# ---------------------------------------------------------------- FAQ (all questions in one place)
ALLFAQ = [("What does Jora Mechanical Systems do?", "Jora Mechanical Systems is a licensed heating, cooling, hot water and plumbing contractor. We install and repair furnaces, air conditioners, heat pumps, tankless and tank water heaters, AirMax air handlers, boilers, ductwork, HRV/ERV ventilation and commercial HVAC equipment."),
          ("What areas do you serve?", "Toronto and the whole GTA — Mississauga, Brampton, Vaughan, Markham, Oakville, Burlington, Hamilton, Durham and more — plus the rest of Ontario: Barrie and Georgian Bay, Owen Sound, Niagara, London, Kitchener-Waterloo, Windsor, Sarnia, Trenton, Belleville, Kingston and Ottawa."),
          ("How do I get a quote?", "Call %s or fill in the online quote form. We visit your home for free, check what you need and send you a written quote with equipment, labour and permits included." % PHONE),
          ("Do you offer emergency service?", "Yes. Our emergency line is open 24/7 at %s." % PHONE),
          ("What brands do you install?", ", ".join(ALL_BRANDS) + ".")]
for sl in PAGES: ALLFAQ += [(q, a) for q, a in PAGES[sl]["faq"]]
page("faq/", "HVAC FAQ — Furnaces, AC, Heat Pumps, Rebates | Jora Mechanical", "Answers to common questions about furnaces, air conditioners, heat pumps, tankless water heaters, rebates, quotes and service areas in the GTA.",
     lambda: phero("FAQ", "Questions &amp; <span>answers</span>", FAQ_PAGE_INTRO, "furnace") + faq_html(ALLFAQ, "Frequently asked questions") + cta_band(),
     ld=[faq_ld(ALLFAQ)], crumbs=[("Home", ""), ("FAQ", None)])

# ---------------------------------------------------------------- BLOG
page("blog/", "HVAC Tips & Advice for Ontario Homes | Jora Mechanical Blog", "Furnace, AC, heat pump, tankless and rebate advice for GTA homeowners from Jora Mechanical's licensed technicians.",
     lambda: phero("Blog", "Tips &amp; <span>advice</span>", "Straight answers about heating, cooling, hot water and rebates in Ontario.", "furnace") +
     '<section class="sec"><div class="wrap"><div class="blog" id="blogAll">%s</div></div></section>' % "".join(post_card(p, i) for i, p in enumerate(POSTS)) + cta_band(),
     crumbs=[("Home", ""), ("Blog", None)])
for i, p in enumerate(POSTS):
    def main(p=p, i=i):
        svc = {"tankless": "tankless", "hrv": "hrv", "water": "water", "ac": "ac", "rebate": "hp", "maint": "maint"}.get(p["ic"], "furnace")
        more = [(j, q) for j, q in enumerate(POSTS) if j != i][:3]
        return ('<article class="sec first"><div class="wrap two"><div class="prose art"><span class="kick">%s · %s</span><h1 class="h1s">%s</h1><p class="lead">%s</p>%s'
                '<p><button class="btn" type="button" data-svc="%s">Get a free quote</button></p></div>%s</div></article>' % (
                    esc(p["tag"]), esc(p["date"]), esc(p["t"]), esc(p["x"]), blogmd.render(p["body"], u), svc, qcard(svc)) + (faq_html(p["faq"]) if p.get("faq") else "") +
                '<section class="sec g"><div class="wrap"><h2 class="h2">More articles</h2><div class="blog">%s</div></div></section>' % "".join(post_card(q, j) for j, q in more) + cta_band(svc))
    page(LINKS["post"][i], "%s | Jora Mechanical" % p["t"], p["x"] + " Advice for Ontario homeowners from licensed HVAC technicians.", main,
         ld=[dict({"@context": "https://schema.org", "@type": "BlogPosting", "headline": p["t"], "description": p["x"], "author": {"@type": "Organization", "name": "Jora Mechanical Systems", "url": SITE_URL},
              "publisher": {"@id": SITE_URL + "#business"}, "mainEntityOfPage": SITE_URL + LINKS["post"][i], "inLanguage": "en-CA", "image": "https://joramechanicalsystems.com/assets/logo-512.png"},
              **({"datePublished": p["iso"], "dateModified": p.get("updated", p["iso"])} if p.get("iso") else {}))] + ([faq_ld(p["faq"])] if p.get("faq") else []), crumbs=[("Home", ""), ("Blog", "blog/"), (p["t"], None)])

# ---------------------------------------------------------------- HTML sitemap
def sitemap_html():
    grp = [("Main", [("Home", ""), ("Free quote", "free-quote/"), ("Rebates", "rebates/"), ("Our work", "our-work/"), ("About us", "about/"), ("Contact", "contact/"), ("FAQ", "faq/"), ("Blog", "blog/")]),
           ("Products & services", [(PAGES[s]["h1"], s + "/") for s in PAGES]),
           ("Products", [(p["name"], LINKS["product"][p["id"]]) for p in PRODUCTS]),
           ("Brands", [(b_, LINKS["brand"][b_]) for b_ in BRAND_PAGES]),
           ("Service areas", [("All service areas", "service-areas/")] + [(c[0], CITY_SLUGS[c[0]]) for c in CITY_PAGES]),
           ("Blog", [(p["t"], LINKS["post"][i]) for i, p in enumerate(POSTS)]),
           ("Legal", [("Privacy policy", "privacy/"), ("Terms and conditions", "terms/"), ("Accessibility policy", "accessibility/"), ("WSIB clearance", "wsib-clearance/"), ("Legal notices", "legal-notices/")])]
    return ('<section class="sec first"><div class="wrap"><span class="kick">Sitemap</span><h1 class="h1s">Sitemap</h1><div class="smap">%s</div></div></section>' % "".join(
        '<div><h2 class="h3">%s</h2><ul>%s</ul></div>' % (t, "".join('<li><a href="%s">%s</a></li>' % (u(p), esc(n)) for n, p in items)) for t, items in grp))
page("sitemap/", "Sitemap | Jora Mechanical Systems", "Every page on the Jora Mechanical Systems website: services, products, brands, GTA service areas, blog and legal pages.", sitemap_html, crumbs=[("Home", ""), ("Sitemap", None)])

# ---------------------------------------------------------------- 404, sitemap, robots
CUR["path"] = ""
page("", "Page not found | Jora Mechanical", "Page not found.", lambda: phero("404", "Page <span>not found</span>", "The page you're looking for has moved. Try the menu, search, or call us.", "furnace"),
     out_file="404.html", base=SITE_URL if MODE == "prod" else None)
open(OUT + "/assets/pages.json", "w").write(json.dumps(PAGE_INDEX, ensure_ascii=False))
open(OUT + "/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
    "<url><loc>%s%s</loc><lastmod>%s</lastmod></url>\n" % (SITE_URL, p, TODAY) for p in PAGES_OUT) + "</urlset>\n")
BOTS = ["Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Applebot", "Applebot-Extended", "DuckDuckBot"]
open(OUT + "/robots.txt", "w").write(("User-agent: *\nDisallow: /\n" if NOINDEX else "".join("User-agent: %s\nAllow: /\n\n" % x for x in BOTS) + "User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n" % SITE_URL))
L_ = ["# Jora Mechanical Systems", "", ("> Licensed heating, cooling, hot water and plumbing contractor serving Toronto and the Greater Toronto Area (GTA), Ontario, Canada — every city and town in Toronto, Peel, York, Halton and Durham. Phone %s, email %s, emergency service 24/7. Free in-home quotes. The Saskatchewan (Saskatoon) site is at %s/saskatchewan/." % (PHONE, EMAIL, SITE_URL.rsplit("/gta/",1)[0])), "",
      "Licensing: " + ", ".join(l[0] for l in J["licences"]) + ".", "Brands installed: " + ", ".join(ALL_BRANDS) + ".", "", "## Services"]
L_ += ["- [%s](%s%s/): %s" % (PAGES[s]["h1"], SITE_URL, s, PAGES[s]["lead"]) for s in PAGES]
L_ += ["", "## Products"] + ["- [%s](%s%s): %s" % (p["name"], SITE_URL, LINKS["product"][p["id"]], p.get("tag", "")) for p in PRODUCTS]
L_ += ["", "## Service areas"] + ["- [%s](%s%s)" % (c[0], SITE_URL, CITY_SLUGS[c[0]]) for c in CITY_PAGES]
L_ += ["", "## Key pages", "- [Ontario rebates](%srebates/)" % SITE_URL, "- [FAQ](%sfaq/)" % SITE_URL, "- [Free quote](%sfree-quote/)" % SITE_URL, "- [Contact](%scontact/)" % SITE_URL, "- [Privacy policy](%sprivacy/)" % SITE_URL, "- [Terms and conditions](%sterms/)" % SITE_URL, "- [Accessibility policy](%saccessibility/)" % SITE_URL, "- [WSIB clearance](%swsib-clearance/)" % SITE_URL]
open(OUT + "/llms.txt", "w").write("\n".join(L_) + "\n")
print(len(PAGES_OUT), "pages ->", OUT)
