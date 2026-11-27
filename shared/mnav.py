"""Mobile header pieces shared by both regional sites: region pill, menu button, and the drop-down menu."""
import html

def _e(s): return html.escape(s, quote=True)

MENU = {
    "gta": [
        ("Heating", [("Furnaces", "furnaces/"), ("Boilers", "boilers/"), ("Garage heaters", "garage-heaters/"), ("Humidifiers", "humidifiers/"), ("Smart thermostats", "smart-thermostats/")]),
        ("Heat pumps", "heat-pumps/"),
        ("Cooling", [("Air conditioners", "air-conditioners/"), ("Air handlers", "air-handlers/"), ("Ductwork", "ductwork/")]),
        ("Water", [("Tankless water heaters", "tankless-water-heaters/"), ("Tank water heaters", "water-heaters/")]),
        ("Plumbing", "plumbing/"),
        ("Solutions", [("Home & renovation", "home-solutions/"), ("Commercial", "commercial-hvac/"), ("Industrial", "industrial-hvac/")]),
        ("Rebates", "rebates/"),
        ("Our work", "our-work/"),
        ("Blog", "blog/"),
        ("More", [("HRV / ERV", "hrv-erv/"), ("Indoor air quality", "indoor-air-quality/"), ("Maintenance & tune-ups", "hvac-maintenance/"), ("Repairs 24/7", "hvac-repair/"),
                  ("Service areas", "service-areas/"), ("About us", "about/"), ("Contact", "contact/")]),
    ],
    "sk": [
        ("Heating", [("Furnaces", "furnaces/"), ("Garage heaters", "garage-heaters/"), ("Boilers & in-floor", "boilers/"), ("Humidifiers", "humidifiers/"), ("Smart thermostats", "smart-thermostats/")]),
        ("Heat pumps", "heat-pumps/"),
        ("Cooling", [("Air conditioners", "air-conditioners/"), ("Ductwork", "ductwork/")]),
        ("Water", [("Tankless water heaters", "tankless-water-heaters/"), ("Tank water heaters", "water-heaters/")]),
        ("Solutions", [("Home & renovation", "home-solutions/"), ("Commercial", "commercial-hvac/"), ("Industrial & shop", "industrial-hvac/")]),
        ("Rebates", "rebates/"),
        ("Our work", "our-work/"),
        ("Blog", "blog/"),
        ("More", [("HRV / ERV", "hrv-erv/"), ("Indoor air quality", "indoor-air-quality/"), ("Maintenance & tune-ups", "hvac-maintenance/"), ("Repairs 24/7", "hvac-repair/"),
                  ("Service areas", "service-areas/"), ("About us", "about/"), ("Contact", "contact/")]),
    ],
}

MENU_IC = '<svg viewBox="0 0 28 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" aria-hidden="true"><path class="l1" d="M3 5h22"/><path class="l2" d="M3 12h22"/><path class="l3" d="M3 19h22"/></svg>'
SEARCH_IC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.6-4.6"/></svg>'

BOOKBAR = ('<div class="mbook"><span class="wxchip" hidden></span><p>Jora customers can book any repair or install <em>online</em>.</p>'
           '<button class="mb-btn" type="button" data-open="quote">Book Online</button></div>')


def build(region, u, root_up, idx, acct_url, cur_path):
    """region: gta|sk; u(): link helper for this site; root_up: '../' x depth+1 to the domain root.
    Returns (menu button, search button, drop-down menu)."""
    other = "saskatchewan/" if region == "gta" else "gta/"
    pill = ('<div class="mreg"><span>Your area</span><div class="rpill" role="group" aria-label="Choose your region">'
            + ('<span class="on">GTA</span><a href="%s">Saskatchewan</a>' % (root_up + other + idx) if region == "gta"
               else '<a href="%s">GTA</a><span class="on">Saskatchewan</span>' % (root_up + other + idx))
            + '</div></div>')
    burger = '<button class="mburger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Open menu">%s</button>' % MENU_IC
    stog = '<button class="msearch" type="button" aria-expanded="false" aria-controls="sForm" aria-label="Search">%s</button>' % SEARCH_IC
    items = []
    for i, (label, target) in enumerate(MENU[region]):
        if isinstance(target, list):
            on = any(cur_path.startswith(p) for _, p in target)
            items.append('<li class="mg%s"><button type="button" class="mg-b" aria-expanded="%s" aria-controls="mg%d">%s<i aria-hidden="true">↓</i></button><ul id="mg%d"%s>%s</ul></li>' % (
                " open" if on else "", "true" if on else "false", i, _e(label), i, "" if on else " hidden",
                "".join('<li><a href="%s"%s>%s</a></li>' % (u(p), ' aria-current="page"' if cur_path.startswith(p) else "", _e(t)) for t, p in target)))
        else:
            items.append('<li><a href="%s"%s>%s</a></li>' % (u(target), ' aria-current="page"' if cur_path.startswith(target) else "", _e(label)))
    items.append('<li><a class="m-acct" href="%s">My account / Sign in</a></li>' % acct_url)
    mnav = ('<div class="mnav" id="mnav" hidden><ul class="mlist">%s</ul>%s'
            '<div class="mnav-f"><a class="btn" href="tel:+19056672823">Call 905-667-2823</a><button class="btn o" type="button" data-open="quote">Free quote</button></div></div>') % ("".join(items), pill)
    return burger, stog, mnav


DOCK = ('<div class="dock">'
        '<button class="dk dk-b" type="button" data-open="quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Book</button>'
        '<a class="dk dk-c" href="tel:+19056672823"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>Call</a>'
        '<button class="dk dk-h" type="button" data-chat><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5z"/></svg>Chat</button>'
        '</div>')


def acts(acct_url):
    """desktop header buttons: Book · Chat · Call (with number) · Sign in"""
    return ('<div class="acts">'
            '<button class="hb hb-book" type="button" data-open="quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Book</button>'
            '<button class="hb hb-chat" type="button" data-chat><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5z"/></svg>Chat</button>'
            '<a class="hb hb-call" href="tel:+19056672823"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>905-667-2823</a>'
            '<a class="hb-acct acct-l" href="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg><span>Sign in</span></a>'
            '</div>') % acct_url


def util(region, u, acct_url):
    """desktop top row: Solutions, Offers & Rebates, trust badge, Our Work, Contact, My Account"""
    ind = "Industrial & shop" if region == "sk" else "Industrial"
    return ('<nav class="acts util" aria-label="Company">'
            '<div class="ud"><button class="ud-b" type="button" aria-expanded="false">Solutions<i aria-hidden="true"></i></button>'
            '<div class="ud-m"><a href="%s"><b>Home &amp; renovation</b><small>Furnaces, AC, hot water</small></a><a href="%s"><b>Commercial</b><small>Rooftop units, make-up air</small></a><a href="%s"><b>%s</b><small>Warehouses, plants, shops</small></a></div></div>'
            '<a class="u-hot" href="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>Offers &amp; Rebates</a>'
            '<span class="tbadge"><span class="tb-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8L3.5 9.2l5.9-.9z"/></svg></span>'
            '<span><b><span class="tb-c">3,000+</span> happy customers</b><small><span class="tb-y">28</span> years of experience</small></span></span>'
            '<a href="%s">Our Work</a><a href="%s">Contact</a>'
            '<a class="u-acct acct-l" href="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg><span>My Account</span></a>'
            '</nav>') % (u("home-solutions/"), u("commercial-hvac/"), u("industrial-hvac/"), ind, u("rebates/"), u("our-work/"), u("contact/"), acct_url)


def regline(region, root_up, idx):
    name = "GTA, Ontario" if region == "gta" else "Saskatchewan"
    return ('<div class="regline"><div class="wrap"><a href="%s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>'
            '<span>Your area: <b>%s</b></span><em>Change</em></a></div></div>') % (root_up + idx, name)


def actband(tel_text="905-667-2823"):
    """three big action buttons under the first section (desktop / tablet)"""
    return ('<section class="actband" aria-label="Get in touch"><div class="wrap">'
            '<button class="ab ab-book" type="button" data-open="quote"><span class="ab-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h2M12 14h2M16 14h0M8 17h2M12 17h2"/></svg></span><span class="ab-t"><b>Book an appointment</b><small>Pick a time that suits you</small></span></button>'
            '<a class="ab ab-call" href="tel:+19056672823"><span class="ab-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg></span><span class="ab-t"><b>%s</b><small>24/7 — real people answer</small></span></a>'
            '<button class="ab ab-chat" type="button" data-chat><span class="ab-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5z"/></svg></span><span class="ab-t"><b>Chat live now</b><small>Ask us anything</small></span></button>'
            '</div></section>') % tel_text


FDOCK = ('<div class="fdock" aria-label="Contact Jora">'
         '<button class="fd fd-book" type="button" data-open="quote"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg><span>Book</span></button>'
         '<a class="fd fd-call" href="tel:+19056672823"><span class="fd-pulse" aria-hidden="true"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><span><small>24/7 line</small>905-667-2823</span></a>'
         '<button class="fd fd-chat" type="button" data-chat><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5z"/></svg><span>Chat</span></button>'
         '</div>')
