# Small, safe markdown for blog bodies: "## h2", "### h3", "- bullets", "1. numbered", **bold**, [text](link)
import html, re
def _inline(s, u):
    s = html.escape(s, quote=False)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    def link(m):
        t, h = m.group(1), m.group(2)
        if h.startswith("http"):
            return '<a href="%s" target="_blank" rel="noopener">%s</a>' % (html.escape(h), t)
        return '<a href="%s">%s</a>' % (html.escape(u(h.lstrip("/"))), t)
    return re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link, s)
def render(body, u):
    out, lst, kind = [], [], None
    def flush():
        nonlocal lst, kind
        if lst:
            out.append("<%s>%s</%s>" % (kind, "".join("<li>%s</li>" % x for x in lst), kind))
        lst, kind = [], None
    for raw in body:
        s = raw.strip()
        m = re.match(r"^(\d+)\.\s+(.*)$", s)
        if s.startswith("- "):
            if kind != "ul": flush(); kind = "ul"
            lst.append(_inline(s[2:], u)); continue
        if m:
            if kind != "ol": flush(); kind = "ol"
            lst.append(_inline(m.group(2), u)); continue
        flush()
        if s.startswith("### "): out.append("<h3>%s</h3>" % _inline(s[4:], u))
        elif s.startswith("## "): out.append('<h2 class="h2">%s</h2>' % _inline(s[3:], u))
        else: out.append("<p>%s</p>" % _inline(s, u))
    flush()
    return "".join(out)
