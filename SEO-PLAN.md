# Daily SEO plan — Jora Mechanical Systems

Goal: more quote requests from Google in Ontario (GTA + lake areas) and Saskatoon + nearby towns.
Main services: furnace replacement/installation, heat pumps, AC, rebates, ductwork, sheet metal,
tankless/water heaters, garage heaters (SK), residential and commercial.

## Rules for every daily update
- ONE solid improvement a day. Quality over quantity — no thin or copy-paste pages.
- Articles: 600–1,000 words of genuinely useful, accurate advice for homeowners or businesses.
  Plain language, local details (climate, housing, lakes), clear "book a free quote" call to action.
- Never invent prices, statistics, reviews, awards, years in business or customer stories.
  Rebate amounts and rules: check the official program page with a web search first; if unsure, describe without numbers.
- Don't name or copy competitors. Don't touch generator/map-source.html.
- Write for both regions when the topic fits (Ontario version in generator/content.py, Saskatchewan in generator-sk/content.py).
- Link new articles to the matching service pages and a few city pages.
- After deploying, log the day below (date — what changed — URLs).

## Two runs a day
- Morning run: ONE article (new, or a rewrite of a thin old post) that passes the quality gate in WORKFLOW.md.
- Evening run: ONE site improvement (city page FAQs, internal links, titles/descriptions, fixing outdated facts,
  page speed, schema). Re-check one rebate/rule page against its official source every evening run.

## Queue (take the first unchecked item for your run type; add new ideas at the end)
- [x] Article (rewrite): GTA "signs-you-need-a-new-furnace" — expand to 700+ words, passes content_check
- [x] Article (rewrite): GTA "ontario-heat-pump-rebates" — verify Ontario Home Renovation Savings on the official page, link /gta/national-heat-pump-rebate/
- [ ] Article (rewrite): GTA "ac-sizing-guide"
- [ ] Article (rewrite): GTA "water-heater-rental-buyout"
- [ ] Article (rewrite): every thin Saskatchewan post (run `python3 tools/content_check.py sk --all` to list them), one per run
- [ ] Improve: Ontario rebates page — re-verify Home Renovation Savings amounts on saveonenergy.ca (2026-11-26 evening: saveonenergy.ca and homerenovationsavings.ca could not be opened from the run; amounts left unchanged — retry)
- [x] City pages: Muskoka (Bracebridge, Huntsville, Gravenhurst), Parry Sound, Kawartha Lakes (Lindsay), Orangeville, Stratford, Napanee, Cornwall, South Bruce Peninsula (Sauble Beach) — region "Simcoe"/"East"/"Southwest"/"Huron" as fits
- [x] Article (ON): Furnace replacement in Ontario — what affects the price, sizing, permits, timeline
- [x] Article (SK): Furnace replacement in Saskatoon — what to expect, sizing for −40, venting in deep snow
- [ ] Article (ON): Ontario home heating and heat pump rebates — current programs (verify official pages first). Link to /gta/national-heat-pump-rebate/
- [ ] Article (SK): Saskatchewan heating rebates and energy programs (verify official pages first)
- [ ] Article (ON): Commercial rooftop unit (RTU) replacement for Ontario stores, offices and restaurants
- [ ] Article (both): Custom sheet metal ductwork for basement finishing and additions
- [ ] Article (ON): Heating a converted cottage on Georgian Bay, Lake Huron or Lake Simcoe year-round
- [ ] Article (ON): Choosing an air conditioner for humid Windsor-Essex and Niagara summers
- [ ] Article (SK): Heat pumps in Saskatchewan — what works at −30 and what to pair them with
- [ ] Article (SK): Acreage and farm-yard heating — propane furnaces, shop heat, water heaters
- [ ] Article (SK): Shop heaters compared — infrared tube vs unit heater vs in-floor
- [ ] Article (both): Tankless vs tank water heaters — cost to run, space, hard water
- [ ] Article (both): No heat? 10 safe checks before you call for furnace repair
- [ ] Article (both): Duct sealing vs duct cleaning — what actually fixes weak airflow
- [ ] Article (both): Commercial HVAC maintenance plans — what's included and why it saves money
- [ ] Article (ON): Rental water heater or furnace vs buying your own — questions to ask
- [ ] Article (SK): Frozen furnace intake/exhaust pipes in deep cold — prevention and fixes
- [ ] Improve: Ontario heat pump page FAQ, rebates page description and rebate callouts say "up to $7,500" with no fuel condition. Official HRS page (checked 2026-11-27): gas-heated Enbridge homes get $500/ton up to $2,000; $1,250/ton up to $7,500 only for electric/oil/propane/wood. Add the condition.
- [ ] Improve: add 2 unique FAQs to each new lake-area city page (local, factual)
- [ ] Improve: check every page title/description is unique and under ~60/155 characters

## Log
- 2026-11-26 — 46 Ontario lake-area city pages, 16 Saskatoon-region town pages, sheet metal pages, lead-source tracking in the panel, sitemaps resubmitted, IndexNow ping.
- 2026-11-26 — National Heat Pump Rebate pages (federal, up to $10,000): /gta/national-heat-pump-rebate/ and /saskatchewan/national-heat-pump-rebate/; rebate callouts and rebates pages updated.
- 2026-11-26 — Blog upgraded (headings, lists, links, FAQ + BlogPosting schema with dates); tools/content_check.py quality gate; articles /gta/blog/furnace-replacement-ontario-guide/ and /saskatchewan/blog/replacing-a-furnace-in-saskatoon/ (both PASS + LanguageTool); SaskEnergy rebates corrected to the Aug 17, 2026 terms ($325 furnace, 120 days); overlay no longer overwrites the Saskatchewan sitemap/search index.
- 2026-11-26 — Rewrote /gta/blog/signs-you-need-a-new-furnace/ (1,022 words, PASS; Ontario CO alarm rules checked on ontario.ca/cosafety). Note: deploy step must keep gta/ and saskatchewan/blog/live-posts.json (robot files, not in the build).
- 2026-11-26 (evening) — 10 Ontario city pages with a local note each: /gta/service-areas/{bracebridge,huntsville,gravenhurst,parry-sound,orangeville,kawartha-lakes,napanee,cornwall,stratford,south-bruce-peninsula}/; postal check now accepts Muskoka/Parry Sound (P1H, P1L, P1P, P2A). Rebate re-check blocked (official HRS site unreachable), no rebate changes.
- 2026-11-27 — Rewrote /gta/blog/ontario-heat-pump-rebates/ (932 words, PASS; HRS amounts checked on homerenovationsavings.ca, federal rebate on canada.ca). LanguageTool not reachable from the run (manual proofread instead).
