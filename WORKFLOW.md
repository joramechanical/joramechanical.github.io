# Jora website — source and daily workflow

This branch (`site-source`) holds the source of joramechanicalsystems.com.
The live site is the `main` branch of the same repository (GitHub Pages).

## Build
    python3 build_all.py prod /tmp/out        # builds the whole site into /tmp/out

## Checks before every deploy
- `node --check` on every file in out/app/*.js, out/gta/assets/*.js, out/saskatchewan/assets/*.js
- `python3 tools/content_check.py --scan /tmp/out` must print SCAN PASS (no private names, no assistant names).
  Commit messages must not name the assistant or any tool.
- Never commit firestore.rules or any owner e-mail address.

## Deploy
    git clone --branch main <repo> live && cd live
    find . -mindepth 1 -maxdepth 1 ! -name .git ! -name README.md -exec rm -rf {} +
    cp -a /tmp/out/. .
    git add -A && git commit -m "<short description>" && git push
(The publishing robot also commits to `main` every hour; always pull/rebase first.)
Commit messages: plain, short, no co-author or tool attribution lines.

## Where content lives
- Ontario/GTA site text: generator/content.py (PAGES, CITY_PAGES, REGION_TEXT, EXTRA_POSTS)
- Saskatchewan site text: generator-sk/content.py (same names)
- Office panel: app/*.js (bundled by app_build.py)
- Do NOT change generator/map-source.html (the owner's 3D map) unless the owner asks.

## Quality gate for every article (mandatory)
1. Write the post by hand-quality standards: plain words, short paragraphs, real local detail, ## headings,
   3+ links to our own pages, official source links for any rule, rebate or figure, 3 FAQs, "iso" date.
2. Run `python3 tools/content_check.py gta <slug>` (or `sk <slug>`). It must print PASS. Fix and re-run until it does.
3. Grammar: if api.languagetool.org can be reached (WebFetch or curl), check the text with
   https://api.languagetool.org/v2/check?language=en-CA&text=<text> and fix real errors
   (brand names, AFUE, TSASK, SaskEnergy and town names are fine).
4. Facts: every number, date, rebate or rule must be confirmed today on the official page (web search, then open it).
   Never invent prices, statistics, reviews, customer stories or "we've done X jobs" claims.
5. Only then build and deploy.

## Search engine ping
IndexNow key file is in overlay/ (the 32-hex .txt). After deploying new pages:
    https://api.indexnow.org/indexnow?url=<page url>&key=<key>
