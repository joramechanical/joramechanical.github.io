"""Site header for both regional sites (desktop + phone), Jora's own design.

Desktop:  [weather · tagline · 24/7 line]
          [3D logo  JORA | Products ▾  Services ▾  Solutions ▾  Rebates  Our Work  Advice | search · account · Get a free quote]
Phone:    [weather · 24/7 call]
          [3D logo  JORA | search · menu]   + drop-down menu, bottom Book / Call / Chat bar
"""
import html

def e(s): return html.escape(str(s), quote=True)

SERVICES_MENU = {
    "gta": [("repair", "Repairs — 24/7", "hvac-repair/"), ("maint", "Maintenance & tune-ups", "hvac-maintenance/"), ("duct", "Ductwork", "ductwork/"),
            ("hrv", "HRV / ERV fresh air", "hrv-erv/"), ("filters", "Indoor air quality", "indoor-air-quality/"), ("humid", "Humidifiers", "humidifiers/"),
            ("thermo", "Smart thermostats", "smart-thermostats/"), ("water", "Tank water heaters", "water-heaters/"), ("boiler", "Boilers", "boilers/"),
            ("garage", "Garage heaters", "garage-heaters/"), ("plumb", "Plumbing", "plumbing/")],
    "sk": [("repair", "Repairs — 24/7", "hvac-repair/"), ("maint", "Maintenance & tune-ups", "hvac-maintenance/"), ("duct", "Ductwork", "ductwork/"),
           ("hrv", "HRV / ERV fresh air", "hrv-erv/"), ("filters", "Indoor air quality", "indoor-air-quality/"), ("humid", "Humidifiers", "humidifiers/"),
           ("thermo", "Smart thermostats", "smart-thermostats/"), ("water", "Tank water heaters", "water-heaters/"), ("boiler", "Boilers & in-floor heat", "boilers/")],
}
SOLUTIONS = [("Home & renovation", "Furnaces, cooling, hot water, fresh air", "home-solutions/", "sol-home"),
             ("Commercial", "Rooftop units, make-up air, maintenance plans", "commercial-hvac/", "sol-commercial"),
             ("Industrial", "Warehouses, plants and shops", "industrial-hvac/", None)]

I = {
    "menu": '<svg viewBox="0 0 30 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path class="l1" d="M3 5h24"/><path class="l2" d="M3 12h24"/><path class="l3" d="M3 19h24"/></svg>',
    "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/></svg>',
    "user": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>',
    "phone": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    "cal": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    "chat": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5z"/></svg>',
    "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    "pin": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
}


CAT_MENU = {   # what people usually need for each kind of equipment (Jora's own wording)
    "furnace": ("Furnace", ["No heat at all", "Turns on and off a lot", "Loud or strange noises", "Burning smell"]),
    "ac": ("Air conditioner", ["Blowing warm air", "Water leaking inside", "Ice on the pipes", "Keeps tripping the breaker"]),
    "hp": ("Heat pump", ["Not heating or cooling", "Outdoor unit iced over", "Noisy outdoor unit", "High energy bills"]),
    "water": ("Water heater", ["No hot water", "Runs out too fast", "Error code on display", "Leak near the unit"]),
    "ah": ("Air handler", ["Weak airflow", "No heat from vents", "Water around the unit", "Noisy blower"]),
    "gh": ("Garage heater", ["Won't light", "Not warm enough", "Shuts off by itself", "Smell when running"]),
}
CAT_LABEL = {"furnace": "Furnaces", "ac": "AC & Cooling", "hp": "Heat Pumps", "water": "Water Heaters", "ah": "Air Handlers", "gh": "Garage Heaters"}


def cat_mega(c, k):
    u, asset, ic = c["u"], c["asset"], c["ic"]
    cat = c["cats"][k]; slug = c["cat_slug"][k] + "/"
    prods = [p for p in c["products"] if p["cat"] == k]
    brands = []
    for p in prods:
        if p["brand"] not in brands: brands.append(p["brand"])
    top = next((p for p in prods if p.get("flag") and c["img_ok"](p)), None) or next((p for p in prods if c["img_ok"](p)), None)
    one, probs = CAT_MENU.get(k, (cat.get("short", cat["name"]), []))
    svc = "tankless" if k == "water" else ("garage" if k == "gh" else k)
    col_new = ('<div class="cm-col"><span class="cm-h">%s Get a new %s</span><a class="cm-big" href="%s">%s %s</a>'
               '<div class="cm-brands">%s</div><button class="cm-btn" type="button" data-svc="%s">Free in-home quote</button></div>') % (
        ic(cat.get("ic", "home")), e(one.lower()), u(slug), ("See 1 model" if len(prods) == 1 else "See all %d models" % len(prods)), I["arrow"],
        "".join('<a href="%s#brand=%s">%s</a>' % (u(slug), e(b.replace(" ", "+")), e(b)) for b in brands), svc)
    col_fix = ('<div class="cm-col"><span class="cm-h">%s Fix my %s</span>%s<a class="cm-link" href="%s">Book a repair visit %s</a>'
               '<a class="cm-tel" href="%s">%s 24/7: %s</a></div>') % (
        ic("repair"), e(one.lower()), "".join('<button class="cm-prob" type="button" data-svc="repair">%s</button>' % e(t) for t in probs),
        u("hvac-repair/"), I["arrow"], c["tel"], I["phone"], c["phone"])
    col_keep = ('<div class="cm-col"><span class="cm-h">%s Keep it running</span><p>A yearly check keeps it safe, efficient and helps keep your manufacturer warranty valid.</p>'
                '<a class="cm-link" href="%s">Maintenance &amp; tune-ups %s</a><span class="cm-h cm-h2">%s Save money</span><a class="cm-link" href="%s">Rebates you may qualify for %s</a></div>') % (
        ic("maint"), u("hvac-maintenance/"), I["arrow"], ic("rebate"), u("rebates/"), I["arrow"])
    feat = ""
    if top:
        feat = ('<a class="cm-feat" href="%s"><span class="cm-fi"><img src="%s" alt="" loading="lazy"></span><span class="cm-ft"><small>%s</small><b>%s</b><em>View details %s</em></span></a>') % (
            u("products/" + top["id"] + "/"), asset("img/" + top["img"] + ".webp"), e(top.get("flag") or "Featured"), e(top["name"]), I["arrow"])
    return '<div class="dd-m dd-cat" id="dd-%s"><div class="dd-in cm">%s%s%s%s</div></div>' % (k, col_new, col_fix, col_keep, feat)


def build(c):
    """c: dict with region, u, asset, ic, logo_file, acct, root_up, idx, cur, cats, cat_slug, products, img_ok, search_html, phone, tel"""
    region, u, asset, ic, cur = c["region"], c["u"], c["asset"], c["ic"], c["cur"]
    tel, phone = c["tel"], c["phone"]

    # --- Products mega: one tile per category with its lead product photo
    tiles = []
    for k, cat in c["cats"].items():
        prods = [p for p in c["products"] if p["cat"] == k]
        lead = next((p for p in prods if c["img_ok"](p)), None)
        im = '<img src="%s" alt="" loading="lazy">' % asset("img/" + lead["img"] + ".webp") if lead else '<span class="hm-pic">%s</span>' % ic(cat.get("ic", "home"))
        tiles.append('<a class="hm-p" href="%s"><span class="hm-pim">%s</span><span class="hm-pt"><b>%s</b><small>%s · %d models</small></span></a>' % (
            u(c["cat_slug"][k] + "/"), im, e(cat["name"]), e(cat.get("sub", "")), len(prods)))
    prod_m = ('<div class="dd-m dd-prod" id="dd-prod"><div class="dd-in"><div class="hm-ps">%s</div>'
              '<div class="dd-foot"><span>Not sure which one fits your home?</span><button class="dd-cta" type="button" data-open="quote">Get a free in-home quote %s</button></div></div></div>') % ("".join(tiles), I["arrow"])

    svc = SERVICES_MENU[region]
    svc_m = ('<div class="dd-m dd-svc" id="dd-svc"><div class="dd-in"><div class="hm-ss">%s</div>'
             '<div class="dd-foot"><span>No heat, no cooling, or a leak?</span><a class="dd-cta" href="%s">%s Call %s</a></div></div></div>') % (
        "".join('<a class="hm-s" href="%s"><span class="hm-sic">%s</span><b>%s</b></a>' % (u(p), ic(k), e(t)) for k, t, p in svc), tel, I["phone"], phone)

    sol_m = '<div class="dd-m dd-sol" id="dd-sol"><div class="dd-in"><div class="hm-ls">%s</div></div></div>' % "".join(
        '<a class="hm-l" href="%s"><span class="hm-lim" style="background-image:url(\'%s\')"></span><b>%s</b><small>%s</small></a>' % (
            u(p), asset("img/" + (img or ("sol-industrial-sk" if region == "sk" else "sol-industrial-gta")) + ".webp"), e(t), e(d)) for t, d, p, img in SOLUTIONS)

    def dd(key, label, menu, paths):
        on = ' data-cur="1"' if any(cur.startswith(p) for p in paths) and cur else ""
        return '<div class="dd"><button class="dd-b" type="button" aria-expanded="false" aria-controls="dd-%s"%s>%s<i aria-hidden="true"></i></button>%s</div>' % (key, on, label, menu)

    def nl(label, p):
        return '<a class="dn-l" href="%s"%s>%s</a>' % (u(p), ' aria-current="page"' if cur.startswith(p) else "", label)

    more_m = ('<div class="dd-m dd-more" id="dd-more"><div class="dd-in"><div class="mo">'
              '<div><span class="cm-h">Services</span>%s</div><div><span class="cm-h">Solutions</span>%s</div>'
              '<div><span class="cm-h">Jora</span>%s</div></div></div></div>') % (
        "".join('<a class="hm-s" href="%s"><span class="hm-sic">%s</span><b>%s</b></a>' % (u(p), ic(k), e(t)) for k, t, p in svc),
        "".join('<a class="mo-sol" href="%s"><span class="hm-lim" style="background-image:url(\'%s\')"></span><b>%s</b></a>' % (
            u(p), asset("img/" + (img or ("sol-industrial-sk" if region == "sk" else "sol-industrial-gta")) + ".webp"), e(t)) for t, d, p, img in SOLUTIONS),
        "".join('<a class="mo-l" href="%s">%s</a>' % (u(p), t) for t, p in (("Rebates &amp; savings", "rebates/"), ("Our Work", "our-work/"), ("Advice &amp; tips", "blog/"), ("Service areas", "service-areas/"), ("About Jora", "about/"), ("Contact", "contact/"))))
    cats_order = [k for k in ("furnace", "ac", "hp", "water", "gh", "ah") if k in c["cats"]]
    extra = [("Protection Plan", "hvac-maintenance/")]
    extra += [("Plumbing", "plumbing/")] if region == "gta" else [("Boilers", "boilers/")]
    dnav = ('<nav class="dnav" aria-label="Main">' +
            "".join(dd(k, CAT_LABEL.get(k, c["cats"][k]["name"]), cat_mega(c, k), [c["cat_slug"][k] + "/"]) for k in cats_order) +
            "".join(nl(t, p) for t, p in extra) +
            '<a class="dn-l dn-hot" href="%s"><i aria-hidden="true"></i>Repairs 24/7</a>' % u("hvac-repair/") +
            dd("more", "More", more_m, [p for _, _, p in svc] + [p for _, _, p, _ in SOLUTIONS] + ["rebates/", "our-work/", "blog/", "about/", "contact/", "service-areas/"]) + '</nav>')
    sol_dd = ('<div class="dd dd-u"><button class="dd-b" type="button" aria-expanded="false" aria-controls="dd-usol">Solutions<i aria-hidden="true"></i></button>'
              '<div class="dd-m dd-sol" id="dd-usol"><div class="dd-in"><div class="hm-ls">%s</div></div></div></div>') % "".join(
        '<a class="hm-l" href="%s"><span class="hm-lim" style="background-image:url(\'%s\')"></span><b>%s</b><small>%s</small></a>' % (
            u(p), asset("img/" + (img or ("sol-industrial-sk" if region == "sk" else "sol-industrial-gta")) + ".webp"), e(t), e(d)) for t, d, p, img in SOLUTIONS)
    dutil = ('<nav class="dutil" aria-label="Company">' +
             '<a class="du-l du-hot" href="%s"><span class="du-tag" aria-hidden="true">%%</span>Deals &amp; Savings</a>'
             '<span class="du-trust"><span class="du-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg></span><span><b><span class="tb-c">3,000+</span> happy customers</b><small><span class="tb-y">28</span> years in the trade</small></span></span>'
             '<a class="du-l du-acct acct-l" href="%s">%s<span>My Account</span></a>'
             '<button class="msearch du-s" type="button" aria-expanded="false" aria-controls="sForm" aria-label="Search">%s</button>'
             '</nav>') % (u("rebates/"), c["acct"], I["user"], I["search"])

    logo = ('<a class="logo" href="%s" aria-label="Jora Mechanical Systems home">'
            '<span class="l3d" aria-hidden="true"><span class="slab"><span class="bk"></span><span class="lt"></span><span class="rt"></span><span class="tp"></span><span class="bt"></span>'
            '<span class="f"><img alt="" src="%s"></span></span><span class="l3d-sh"></span></span>'
            '<span class="wm"><b>Jora</b><small>Mechanical Systems</small></span></a>') % (u(""), asset(c["logo_file"]))

    icons = ('<div class="hicons">'
             '<button class="msearch" type="button" aria-expanded="false" aria-controls="sForm" aria-label="Search">%s</button>'
             '<a class="hacct acct-l" href="%s" aria-label="My account">%s<span>Sign in</span></a>'
             '<button class="hq" type="button" data-open="quote">Get a free quote</button>'
             '</div>') % (I["search"], c["acct"], I["user"])
    hleft = '<div class="hleft"><button class="msearch hsp" type="button" aria-expanded="false" aria-controls="sForm" aria-label="Search">%s<span>Search products &amp; services</span></button></div>' % I["search"]
    burger = '<button class="mburger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">%s</button>' % I["menu"]

    region_name = "GTA, Ontario" if region == "gta" else "Saskatchewan"
    topline = ('<div class="topline"><div class="wrap">'
               '<span class="wxchip" hidden></span>'
               '<span class="tl-msg"><span>Repair or new install? <b>Book your visit online</b> in about 2 minutes.</span><button class="tl-book" type="button" data-open="quote">Book Online</button></span>'
               '<a class="tl-call" href="%s"><i aria-hidden="true"></i><span>24/7 emergency</span><b>%s</b></a>'
               '</div></div>') % (tel, phone)

    # --- phone menu
    other = "saskatchewan/" if region == "gta" else "gta/"
    groups = [("Products", [(cat["name"], c["cat_slug"][k] + "/") for k, cat in c["cats"].items()]),
              ("Services", [(t, p) for _, t, p in svc]),
              ("Solutions", [(t, p) for t, _, p, _ in SOLUTIONS])]
    items = []
    for i, (label, links) in enumerate(groups):
        on = any(cur.startswith(p) for _, p in links) and cur
        items.append('<li class="mg"><button type="button" class="mg-b" aria-expanded="%s" aria-controls="mg%d">%s<i aria-hidden="true"></i></button><ul id="mg%d"%s>%s</ul></li>' % (
            "true" if on else "false", i, label, i, "" if on else " hidden",
            "".join('<li><a href="%s"%s>%s</a></li>' % (u(p), ' aria-current="page"' if cur.startswith(p) else "", e(t)) for t, p in links)))
    for label, p in (("Rebates", "rebates/"), ("Our Work", "our-work/"), ("Advice & tips", "blog/"), ("About Jora", "about/"), ("Contact", "contact/")):
        items.append('<li><a href="%s"%s>%s</a></li>' % (u(p), ' aria-current="page"' if cur.startswith(p) else "", label))
    mnav = ('<div class="mnav" id="mnav" hidden><ul class="mlist">%s</ul>'
            '<div class="mnav-f"><a class="mf-acct" href="%s">%s My account</a><a class="mf-reg" href="%s">%s %s <em>Change</em></a></div></div>') % (
        "".join(items), c["acct"], I["user"], c["root_up"] + c["idx"], I["pin"], region_name)

    search = '<div class="hsearch">%s</div>' % c["search_html"]
    return (topline + '<header class="hdr" id="hdr"><div class="wrap bar">' + burger + hleft + logo + dutil + dnav + icons + '</div>' + search + mnav + '</header>')


DOCK = ('<div class="dock">'
        '<button class="dk dk-b" type="button" data-open="quote">%s<span>Book</span></button>'
        '<a class="dk dk-c" href="tel:+19056672823">%s<span>Call</span></a>'
        '<button class="dk dk-h" type="button" data-chat>%s<span>Chat</span></button></div>') % (I["cal"], I["phone"], I["chat"])

FDOCK = ('<div class="fdock" aria-label="Contact Jora">'
         '<button class="fd fd-book" type="button" data-open="quote">%s<span>Book</span></button>'
         '<a class="fd fd-call" href="tel:+19056672823"><span class="fd-pulse" aria-hidden="true"></span>%s<span><small>24/7 line</small>905-667-2823</span></a>'
         '<button class="fd fd-chat" type="button" data-chat>%s<span>Chat</span></button></div>') % (I["cal"], I["phone"], I["chat"])
