"""Builds the office panel (/admin/), customer accounts (/account/) and quotation pages (/quote/).
Called from build_all.py after both regional sites are built."""
import json, os, shutil, html

HERE = os.path.dirname(os.path.abspath(__file__))
FB_VER = "10.12.2"


def build(OUT, MODE):
    cfg = json.load(open(os.path.join(HERE, "backend-config.json")))
    idx = "index.html" if MODE != "prod" else ""
    fb = cfg.get("firebase")
    A = os.path.join(OUT, "app")
    os.makedirs(A, exist_ok=True)
    for f in ["jdb.js", "admin.js", "account.js", "quote.js", "app.css"]:
        shutil.copy(os.path.join(HERE, "app", f), os.path.join(A, f))
    # the CRM (technicians, photos, calendar, finance, reports) lives in app/crm.js and runs inside the admin IIFE
    adm = open(os.path.join(HERE, "app", "admin.js")).read().rstrip()
    assert adm.endswith("})();")
    open(os.path.join(A, "admin.js"), "w").write(adm[:-5] + open(os.path.join(HERE, "app", "crm.js")).read() + open(os.path.join(HERE, "app", "assist.js")).read() + open(os.path.join(HERE, "app", "owners.js")).read() + open(os.path.join(HERE, "shared", "md.js")).read() + open(os.path.join(HERE, "app", "site.js")).read() + open(os.path.join(HERE, "app", "followups.js")).read() + open(os.path.join(HERE, "app", "remind.js")).read() + open(os.path.join(HERE, "app", "business.js")).read() + open(os.path.join(HERE, "app", "comms.js")).read() + open(os.path.join(HERE, "app", "hours.js")).read() + open(os.path.join(HERE, "app", "techflow.js")).read() + open(os.path.join(HERE, "app", "quoteopts.js")).read() + "\n})();\n")
    if os.path.exists(os.path.join(A, "ocr")): shutil.rmtree(os.path.join(A, "ocr"))
    shutil.copytree(os.path.join(HERE, "app", "ocr"), os.path.join(A, "ocr"))
    pub = {"firebase": fb, "web3formsKey": cfg.get("web3formsKey", ""), "emailjs": cfg.get("emailjs"), "ownerEmail": cfg.get("ownerEmail"), "ownerHashes": sorted(set(cfg.get("ownerHashes", []) + [__import__("hashlib").sha256(e.lower().encode()).hexdigest() for e in cfg.get("ownerEmailsPrivate", [])]))}
    open(os.path.join(A, "config.js"), "w").write("window.JORA_CONFIG=%s;window.JORA_IDX=%s;\n" % (json.dumps(pub), json.dumps(idx)))

    # built-in product catalog of each website, for the office panel
    for reg, gen, sub in (("gta", "generator", "gta"), ("sk", "generator-sk", "saskatchewan")):
        d = json.load(open(os.path.join(HERE, gen, "data.json")))
        imgdir = os.path.join(OUT, sub, "assets", "img")
        prods = []
        for p in d["PRODUCTS"]:
            img = p.get("img") if p.get("img") and os.path.exists(os.path.join(imgdir, p["img"] + ".webp")) else ""
            prods.append({k: p.get(k, "") for k in ("id", "cat", "brand", "model", "name", "tag", "flag")} | {"img": img})
        cat = {"products": prods, "cats": {k: {"name": v["name"], "short": v.get("short", "")} for k, v in d["CATS"].items()}, "brands": d["BRANDS"]}
        open(os.path.join(A, "catalog-%s.json" % reg), "w").write(json.dumps(cat, separators=(",", ":")))

    sdk = ""
    if fb and fb.get("projectId"):
        sdk = "".join('<script src="https://www.gstatic.com/firebasejs/%s/firebase-%s-compat.js"></script>' % (FB_VER, m) for m in ("app", "auth", "firestore"))
    csp = ("default-src 'self'; script-src 'self' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; "
           "img-src 'self' data: blob: https:; worker-src 'self' blob:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com "
           "https://www.googleapis.com https://api.web3forms.com https://api.emailjs.com; frame-src https://*.firebaseapp.com; object-src 'none'; base-uri 'self'; form-action 'self'")

    import hashlib
    ver = hashlib.md5(b"".join(open(os.path.join(A, f), "rb").read() for f in ["jdb.js", "admin.js", "account.js", "quote.js", "app.css", "config.js"])).hexdigest()[:8]

    def page(path, title, js, body='<div style="padding:60px;text-align:center;color:#888">Loading…</div>'):
        d = os.path.join(OUT, path)
        os.makedirs(d, exist_ok=True)
        open(os.path.join(d, "index.html"), "w").write(
            '<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<meta http-equiv="Content-Security-Policy" content="%s"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="strict-origin-when-cross-origin">'
            '<title>%s</title><link rel="icon" href="../assets/logo.png"><meta name="theme-color" content="#15171b">'
            '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            '<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">'
            '<link rel="stylesheet" href="../app/app.css?v=%s"></head><body>%s'
            '<script src="../app/config.js?v=%s"></script>%s<script src="../app/jdb.js?v=%s"></script><script src="../app/%s?v=%s"></script></body></html>' % (csp, html.escape(title), ver, body, ver, sdk, ver, js, ver))

    page("admin", "Office panel — Jora Mechanical Systems", "admin.js")
    app_icons(OUT)
    page("account", "My account — Jora Mechanical Systems", "account.js")
    page("quote", "Quotation — Jora Mechanical Systems", "quote.js",
         '<div class="chead"><a class="auth-logo" href="../"><img src="../assets/logo.png" alt=""><span><b>Jora Mechanical</b><small>Quotation</small></span></a><a class="btn g sm" id="back" href="../">‹ Website</a></div>'
         '<div class="cwrap" id="q"><div style="padding:60px;text-align:center;color:#888">Loading your quotation…</div></div><div class="toast" id="toast"></div>')


def app_icons(OUT):
    """Home-screen app for the office panel: technicians can 'Add to Home Screen' and open Jora like an app."""
    try:
        from PIL import Image
        src = Image.open(os.path.join(OUT, "assets", "logo.png")).convert("RGBA")
        for n in (192, 512):
            bg = Image.new("RGBA", (n, n), (249, 99, 2, 255))
            im = src.resize((int(n * .86), int(n * .86)), Image.LANCZOS)
            bg.paste(im, ((n - im.width) // 2, (n - im.height) // 2), im)
            bg.convert("RGB").save(os.path.join(OUT, "app", "icon-%d.png" % n))
    except Exception as e:
        print("icons skipped:", e)
    man = {"name": "Jora Office", "short_name": "Jora", "start_url": "./", "scope": "./", "display": "standalone", "background_color": "#15171b", "theme_color": "#15171b",
           "icons": [{"src": "../app/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "../app/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}]}
    open(os.path.join(OUT, "admin", "manifest.webmanifest"), "w").write(json.dumps(man))
    p = os.path.join(OUT, "admin", "index.html")
    h = open(p).read().replace("</head>", '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="../app/icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Jora"></head>', 1)
    open(p, "w").write(h)
