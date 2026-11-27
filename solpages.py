"""Solution pages (Home & renovation / Commercial / Industrial) and the home-page solution cards.
Shared by generator/build_site.py (GTA) and generator-sk/build_site.py (Saskatchewan).
Call build(globals(), region) from a build_site.py after its helpers are defined."""

ORDER = ["home", "commercial", "industrial"]
# a clearer icon for each item (falls back to the service icon)
ITEM_IC = {"Rooftop units (RTU)": "ac", "Make-up air units": "hrv", "Make-up air": "hrv", "Unit heaters": "garage", "Split & ductless systems": "hp",
           "Restaurant ventilation": "erv", "Gas piping": "permit", "Gas line installs": "permit", "24/7 repairs": "repair", "Maintenance contracts": "maint",
           "Warehouse heating": "garage", "Shop & warehouse heating": "garage", "Radiant tube heaters": "furnace", "Radiant heaters": "furnace",
           "Exhaust & ventilation": "erv", "Process cooling": "ac", "Planned maintenance": "maint", "Emergency repairs": "repair"}
CARD_T = {"home": "Home & renovation", "commercial": "Commercial", "industrial": "Industrial"}


def cards(g):
    """three roomy picture cards that open the solution pages (used on the home page)"""
    S, u, asset, esc, ic = g["SOL_PAGES"], g["u"], g["asset"], g["esc"], g["ic"]
    out = []
    for k in ORDER:
        t = S[k]
        out.append('<a class="solcard" href="%s"><span class="sc-im"><img src="%s" alt="%s" loading="lazy"></span>'
                   '<span class="sc-b"><span class="sc-ic">%s</span><b>%s</b><small>%s</small><em>Explore %s ›</em></span></a>' % (
                       u(t["slug"] + "/"), asset("img/" + t["img"] + ".webp"), esc(t["h1"]), ic(t["ic"]), esc(CARD_T[k]), esc(t["lead"]), esc(CARD_T[k].lower())))
    return '<div class="solcards">' + "".join(out) + '</div>'


def home_section(g):
    return ('<section class="sec solc" id="solutions"><div class="wrap"><div class="sh reveal"><div><span class="kick">Solutions</span>'
            '<h2>Home. Commercial. <em>Industrial.</em></h2><p>One licensed team for every kind of building. Pick yours to see everything we do.</p></div></div>'
            + cards(g) + '</div></section>')


def build(g, region):
    S, u, asset, esc, ic, page = g["SOL_PAGES"], g["u"], g["asset"], g["esc"], g["ic"], g["page"]
    LINKS, SERVICES, TEL, PHONE, SITE_URL = g["LINKS"], g["SERVICES"], g["TEL"], g["PHONE"], g["SITE_URL"]
    where = "Greater Toronto Area, Ontario" if region == "gta" else "Saskatchewan"
    sicon = {s["id"]: s["ic"] for s in SERVICES}

    for k in ORDER:
        t = S[k]
        path = t["slug"] + "/"

        def main(k=k, t=t, path=path):
            img = asset("img/" + t["img"] + ".webp")
            h = ('<section class="solhero"><img class="sh-img" src="%s" alt="%s" fetchpriority="high"><div class="sh-shade"></div>'
                 '<div class="wrap sh-in"><span class="kick">%s</span><h1>%s</h1><p class="lead">%s</p>'
                 '<div class="phero-ctas"><button class="btn" type="button" data-svc="%s">%s</button><a class="btn wk" href="%s">%s Call %s</a></div>'
                 '<ul class="trust"><li>%sLicensed &amp; insured</li><li>%sFree written quote</li><li>%s24/7 emergency</li></ul></div></section>') % (
                img, esc(t["h1"]), esc(t["kick"]), esc(t["h1"]), esc(t["lead"]), t["svc"],
                "Get a free home quote" if k == "home" else "Request a site visit", TEL, ic("phone"), PHONE, ic("shield"), ic("doc"), ic("clock"))
            # intro + at a glance
            h += ('<section class="sec roomy"><div class="wrap two"><div class="prose big">%s</div><div class="glance"><b>At a glance</b><dl>%s</dl></div></div></section>') % (
                "".join("<p>" + esc(p) + "</p>" for p in t["intro"]),
                "".join('<div><dt>%s</dt><dd>%s</dd></div>' % (esc(a), esc(b)) for a, b in t["facts"]))
            # what we install
            items = []
            for name, sub, sid in t["what"]:
                link = LINKS["svc"].get(sid)
                inner = '<span class="sw-ic">%s</span><b>%s</b><small>%s</small>' % (ic(ITEM_IC.get(name) or sicon.get(sid, t["ic"])), esc(name), esc(sub))
                if link and link != path:
                    items.append('<a class="sw" href="%s">%s<em>Learn more ›</em></a>' % (u(link), inner))
                else:
                    items.append('<button class="sw" type="button" data-svc="%s">%s<em>Get a quote ›</em></button>' % (t["svc"], inner))
            h += ('<section class="sec g roomy"><div class="wrap"><div class="sh"><div><span class="kick">What we do</span><h2 class="h2">What we install &amp; service</h2>'
                  '<p>Tap any service to see models, details and how we install it.</p></div></div><div class="solwhat">%s</div></div></section>') % "".join(items)
            # buildings
            h += ('<section class="sec roomy"><div class="wrap"><div class="sh"><div><span class="kick">Who we help</span><h2 class="h2">%s</h2></div></div>'
                  '<ul class="solspaces">%s</ul></div></section>') % (
                "Homes we work on" if k == "home" else "Buildings we work on", "".join('<li>%s%s</li>' % (ic("check"), esc(s)) for s in t["spaces"]))
            # why
            h += ('<section class="sec g roomy"><div class="wrap"><div class="sh"><div><span class="kick">Why Jora</span><h2 class="h2">Why customers choose us</h2></div></div>'
                  '<div class="solwhy">%s</div></div></section>') % "".join(
                '<div class="sy"><span class="sy-n">%02d</span><b>%s</b><p>%s</p></div>' % (i + 1, esc(a), esc(b)) for i, (a, b) in enumerate(t["why"]))
            # live 3D model (Saskatchewan site only)
            if region == "sk":
                h += ('<section class="sec roomy sol3dsec"><div class="wrap"><div class="sh"><div><span class="kick">Take a closer look</span><h2 class="h2">See it in 3D</h2>'
                      '<p>Drag to turn the model.</p></div></div><div class="sol-stage solo" id="solStage"></div></div></section>')
            h += g["steps_mini"]() + g["faq_html"](t["faq"])
            # other solutions
            others = [o for o in ORDER if o != k]
            h += ('<section class="sec roomy"><div class="wrap"><div class="sh"><div><span class="kick">More solutions</span><h2 class="h2">We also do</h2></div></div>'
                  '<div class="solcards two">%s</div></div></section>') % "".join(
                '<a class="solcard" href="%s"><span class="sc-im"><img src="%s" alt="%s" loading="lazy"></span><span class="sc-b"><span class="sc-ic">%s</span><b>%s</b><small>%s</small><em>Explore ›</em></span></a>' % (
                    u(S[o]["slug"] + "/"), asset("img/" + S[o]["img"] + ".webp"), esc(S[o]["h1"]), ic(S[o]["ic"]), esc(CARD_T[o]), esc(S[o]["lead"])) for o in others)
            h += g["cta_band"](t["svc"])
            return h

        ld = [g["faq_ld"](t["faq"]), {"@context": "https://schema.org", "@type": "Service", "name": t["h1"], "serviceType": CARD_T[k] + " HVAC",
                                    "provider": {"@id": SITE_URL + "#business"}, "areaServed": where, "description": t["desc"],
                                    "image": SITE_URL + "assets/img/" + t["img"] + ".webp"}]
        page(path, t["title"], t["desc"], main, ld=ld, crumbs=[("Home", ""), (CARD_T[k], None)],
             attrs=('data-sol="%s"' % k) if region == "sk" else "", og_img="img/" + t["img"] + ".webp")
