#!/usr/bin/env python3
"""Quality gate for Jora blog posts. A post is published only if this prints PASS.

Usage:  python3 tools/content_check.py <gta|sk> <slug>      (one post)
        python3 tools/content_check.py --scan /tmp/out       (whole build: banned words)
        python3 tools/content_check.py <gta|sk> --all        (report on every post)

Checks: length, readability (Flesch, grade), sentence variety, filler/cliche phrases
that make text read like generic AI copy, repeated wording, copy-overlap with every
other page and post on both sites, internal + source links, title/description length,
local keyword, figures that need a source, banned names.
"""
import sys, os, re, statistics, importlib.util, glob, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Banned words are stored only as SHA-256 fingerprints so private names never appear in this public code.
BANNED_HASHES = {
    "c857d09db23e6822e3600bc06ad8d58f92ed62bc8efd81c753f77048662cb97d",
    "c70eca6b0f88f44d81a41311647e50fda1ac454ec04ffd442b0eb4743a993131",
    "2f104bc88f46d3ba92c6997917063100043b1d20c80f64b2919bd34bbd862546",
    "5f5e704f7ac42eb6943955a49f971570c827bf43d4f849ac32d0141ba5060838",
}
import hashlib as _hl
def banned_in(text):
    return sorted({w for w in re.findall(r"[a-z0-9]+", text.lower()) if _hl.sha256(w.encode()).hexdigest() in BANNED_HASHES})
FILLER = ["delve", "in today's", "fast-paced", "navigate the", "navigating the", "landscape", "unlock", "elevate",
          "seamless", "robust", "tapestry", "game-changer", "game changer", "it's important to note", "it is important to note",
          "in conclusion", "whether you're", "look no further", "embark", "realm", "furthermore", "moreover",
          "ever-evolving", "cutting-edge", "comprehensive guide", "rest assured", "in the world of", "dive into",
          "deep dive", "harness", "empower", "plethora", "myriad", "paramount", "pivotal", "revolutionize",
          "unparalleled", "state-of-the-art", "testament to", "a must-have", "when it comes to", "ultimately,",
          "in summary", "overall,", "let's explore", "buckle up", "first and foremost", "nestled", "bustling",
          "vibrant", "boasts", "elevating", "crucial role", "key role", "stand out from the crowd"]
REGION_WORDS = {"gta": ["ontario", "gta", "toronto", "barrie", "windsor", "london", "ottawa", "kingston", "niagara", "hamilton", "mississauga", "brampton"],
                "sk": ["saskatchewan", "saskatoon", "regina", "prince albert", "warman", "martensville", "moose jaw"]}

def load(region):
    d = os.path.join(ROOT, "generator" if region == "gta" else "generator-sk")
    spec = importlib.util.spec_from_file_location("content_" + region, os.path.join(d, "content.py"))
    m = importlib.util.module_from_spec(spec); sys.path.insert(0, d); spec.loader.exec_module(m); sys.path.pop(0)
    return m

def plain(lines):
    t = "\n".join(lines)
    t = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", t)
    t = re.sub(r"^\s*(#+|-|\d+\.)\s*", "", t, flags=re.M).replace("**", "")
    return t

def syllables(w):
    w = w.lower().strip(".,;:!?\"'()")
    if len(w) <= 3: return 1
    w = re.sub(r"(?:[^laeiouy]es|ed|[^laeiouy]e)$", "", w); w = re.sub(r"^y", "", w)
    return max(1, len(re.findall(r"[aeiouy]{1,2}", w)))

def sentences(t):
    t = re.sub(r"\n+", ". ", t)
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", t) if len(s.strip().split()) >= 3]

def shingles(t, n=6):
    w = re.findall(r"[a-z0-9']+", t.lower())
    return {" ".join(w[i:i + n]) for i in range(len(w) - n + 1)}

def corpus_texts(skip_slug):
    out = []
    for r in ("gta", "sk"):
        m = load(r)
        for p in getattr(m, "EXTRA_POSTS", []) + getattr(m, "POSTS", []):
            if p.get("slug") != skip_slug: out.append(("post " + r + "/" + p["slug"], plain(p["body"])))
        for k, v in getattr(m, "PAGES", {}).items():
            out.append(("page " + r + "/" + k, " ".join([v.get("lead", "")] + v.get("body", []) + [a for _, a in v.get("faq", [])])))
    return out

def check(region, p, verbose=True):
    errs, warns = [], []
    body = p["body"]; text = plain(body); low = text.lower()
    words = re.findall(r"[A-Za-z0-9'’-]+", text)
    n = len(words)
    if n < 600: errs.append("too short: %d words (need 600+)" % n)
    if n > 1800: warns.append("long: %d words" % n)
    sents = sentences(text)
    sl = [len(s.split()) for s in sents]
    syl = sum(syllables(w) for w in words)
    flesch = 206.835 - 1.015 * (n / max(1, len(sents))) - 84.6 * (syl / max(1, n))
    grade = 0.39 * (n / max(1, len(sents))) + 11.8 * (syl / max(1, n)) - 15.59
    if flesch < 50: errs.append("hard to read: Flesch %.0f (need 50+)" % flesch)
    if grade > 10: errs.append("reading grade %.1f (need 10 or lower)" % grade)
    if sl and max(sl) > 40: errs.append("a sentence has %d words (max 40)" % max(sl))
    if len(sl) > 5 and statistics.pstdev(sl) < 4: errs.append("sentences all the same length (variety %.1f) — reads robotic" % statistics.pstdev(sl))
    for f in FILLER:
        c = low.count(f)
        if c: errs.append('filler phrase "%s" x%d' % (f, c))
    em = text.count("—")
    if em > max(2, n // 150): errs.append("too many dashes (%d)" % em)
    if text.count("!") > 2: errs.append("too many exclamation marks")
    starts = [s.split()[0].lower() for s in sents if s.split()]
    for w in set(starts):
        if starts.count(w) >= max(5, len(starts) // 5) and w not in ("the", "a", "if", "your", "you"): errs.append('%d sentences start with "%s"' % (starts.count(w), w))
    if banned_in(low + " " + p["t"] + " " + p["x"]): errs.append("contains a banned word (private name or assistant name)")
    joined = "\n".join(body)
    internal = re.findall(r"\]\((?!http)[^)]+\)", joined)
    external = re.findall(r"\]\((https?://[^)]+)\)", joined)
    if len(internal) < 3: errs.append("needs 3+ links to our own pages (has %d)" % len(internal))
    figs = re.findall(r"\$\s?\d[\d,]*|\d+(?:\.\d+)?\s?%", text)
    if figs and not external: errs.append("has figures %s but no source link — link the official page" % ", ".join(sorted(set(figs))[:5]))
    if any(k in low for k in ("rebate", "grant", "regulation", "code requires", "by law", "permit")) and not external:
        errs.append("rebate/rule topic needs at least one official source link")
    if len(p["t"]) > 65: errs.append("title %d chars (max 65)" % len(p["t"]))
    if not (90 <= len(p["x"]) <= 160): errs.append("description %d chars (need 90–160)" % len(p["x"]))
    if not any(w in (p["t"] + " " + p["x"]).lower() for w in REGION_WORDS[region]): errs.append("title/description has no local place name")
    if not any(b.startswith("## ") for b in body): errs.append("needs ## section headings")
    if len(p.get("faq", [])) < 3: warns.append("add 3+ FAQs for rich results")
    if not p.get("iso"): errs.append('missing "iso" publish date (YYYY-MM-DD)')
    mine = shingles(text)
    for name, other in corpus_texts(p["slug"]):
        if not other: continue
        o = len(mine & shingles(other)) / max(1, len(mine))
        if o > 0.12: errs.append("%.0f%% of wording repeats %s" % (o * 100, name))
    from collections import Counter
    tri = Counter(" ".join(x) for x in zip(*(re.findall(r"[a-z']+", low)[i:] for i in range(3))))
    rep = [(k, c) for k, c in tri.items() if c >= 4 and not re.match(r"^(of the|in the|to the|and the|on the|for the|is a|it is|you can|if you|a heat|heat pump|the heat|your home)", k)]
    if rep: warns.append("repeated phrases: " + ", ".join("%s x%d" % kc for kc in rep[:5]))
    ok = not errs
    if verbose:
        print("%s  %s/%s  — %d words · Flesch %.0f · grade %.1f · sentences %d (variety %.1f) · links %d internal, %d external" % (
            "PASS" if ok else "FAIL", region, p["slug"], n, flesch, grade, len(sents), statistics.pstdev(sl) if sl else 0, len(internal), len(external)))
        for e in errs: print("  ✗ " + e)
        for w in warns: print("  ! " + w)
    return ok

if __name__ == "__main__":
    if len(sys.argv) < 3: print(__doc__); sys.exit(2)
    if sys.argv[1] == "--scan":
        bad = []
        for dp, dn, fn in os.walk(sys.argv[2]):
            dn[:] = [d for d in dn if d != ".git"]
            for f in fn:
                fp = os.path.join(dp, f)
                try: t = open(fp, encoding="utf-8", errors="ignore").read()
                except Exception: continue
                if banned_in(t): bad.append(fp)
        print("SCAN %s — %d file(s) with banned words" % ("PASS" if not bad else "FAIL", len(bad)))
        for b in bad[:20]: print("  ✗ " + b)
        sys.exit(1 if bad else 0)
    region, slug = sys.argv[1], sys.argv[2]
    m = load(region)
    posts = getattr(m, "EXTRA_POSTS", [])
    if slug == "--all":
        [check(region, p) for p in posts]; sys.exit(0)
    p = next((x for x in posts if x["slug"] == slug), None)
    if not p: print("no post with slug", slug); sys.exit(2)
    sys.exit(0 if check(region, p) else 1)
