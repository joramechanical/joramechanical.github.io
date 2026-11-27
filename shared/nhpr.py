import json
# National Heat Pump Rebate (federal, Environment and Climate Change Canada) — facts checked 2026-11-26 on canada.ca
NHPR_URL = "https://www.canada.ca/en/environment-climate-change/campaigns/one-million-home-energy-retrofits.html"
NHPR_DETAILS = "https://www.canada.ca/en/environment-climate-change/campaigns/one-million-home-energy-retrofits/supplemental-eligibility-program-details.html"
NHPR_LIST = "https://spl-lpi.nrcan-rncan.gc.ca/en-US/product/?product=HP_NHPR&page=1"
NHPR_SIGNUP = "https://forms-formulaires.alpha.canada.ca/en/id/cmuzkn60f004f01xai7v6v4ma"
NHPR_INCOME = {"Ontario": ["46,981", "92,884", "119,850", "146,217", "158,202"],
               "Saskatchewan": ["45,543", "92,884", "112,659", "134,232", "133,034"]}

def nhpr_calc(prov):
    inc = NHPR_INCOME[prov]
    nums = [int(x.replace(",", "")) for x in inc]
    return ('<div class="card nhcalc" style="margin:0 0 26px;padding:22px;border:2px solid #E8590C;border-radius:14px;background:#fff8f3">'
            '<h2 class="h2" style="margin-top:0">Rebate calculator</h2><p>See which federal heat pump rebate your household may get in %s.</p>'
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px">'
            '<label class="fl">People in your household<select id="nhSize"><option value="0">1 person</option><option value="1" selected>2 people</option><option value="2">3 people</option><option value="3">4 people</option><option value="4">5 or more</option></select></label>'
            '<label class="fl">Household after-tax income ($)<input id="nhInc" inputmode="numeric" placeholder="e.g. 85000"></label></div>'
            '<p class="mut" style="font-size:13px;margin:8px 0 0">After-tax income = line 23600 minus line 43500 of your 2025 tax return, plus your spouse\'s or partner\'s.</p>'
            '<div id="nhOut" aria-live="polite" style="margin-top:14px;font-size:18px"></div>'
            '<script>(function(){var L=%s,s=document.getElementById("nhSize"),i=document.getElementById("nhInc"),o=document.getElementById("nhOut");'
            'function f(n){return "$"+n.toLocaleString("en-CA")}function go(){var v=+String(i.value).replace(/[^0-9.]/g,""),lim=L[+s.value];'
            'if(!v){o.innerHTML="Income limit for your household size: <b>"+f(lim)+"</b>. At or below it: up to <b>$10,000</b>. Above it: <b>$2,000</b>.";return}'
            'o.innerHTML=v<=lim?"&#10003; You may qualify for <b>up to $10,000</b> (your income is at or below "+f(lim)+").":"&#10003; You may qualify for <b>$2,000</b> (the higher amount is for incomes up to "+f(lim)+").";'
            'o.innerHTML+=" <button class=\\"btn\\" type=\\"button\\" style=\\"margin-left:8px\\" data-svc=\\"hp\\">Get a free heat pump quote</button>"}'
            's.addEventListener("change",go);i.addEventListener("input",go);go()})();</script>'
            '<p class="mut" style="font-size:13px;margin:12px 0 0">Estimate only, based on the Government of Canada\'s published income table. Final eligibility is decided by the program when you apply.</p></div>') % (prov, json.dumps(nums))

def nhpr_faq(prov):
    return [("How much is the National Heat Pump Rebate?", "$2,000 for households above the median after-tax income, and up to $10,000 for households at or below it (based on your province and household size)."),
            ("When can I apply?", "The online application is expected to open in early 2027. Heat pumps installed on or after November 1, 2026 may qualify, so you can install now and apply when it opens. No payments are made until the program launches and your application is approved."),
            ("What heat pumps qualify?", "A cold-climate heat pump on the program's eligible product list (checked by AHRI number) that heats the whole home, bought from and installed by an HVAC contractor. Ductwork and electrical work for the install can be part of the project cost."),
            ("Do I have to remove my furnace?", "No. You don't need to remove your existing system, and both planned and emergency installs can qualify."),
            ("Who can apply?", "Homeowners who live in Canada and own the home (it doesn't have to be your main home). Only one rebate per household, and not for an address that already received federal funding. Renters aren't covered yet."),
            ("What do I need to keep?", "Your receipts, submitted within 6 months, showing the contractor's details, the equipment make, model and AHRI number, and the total project cost. We put all of this on your invoice."),
            ("Will the government call me or come to my door?", "No. Environment and Climate Change Canada does not go door-to-door or make sales calls about heating equipment. Contact the HVAC company yourself.")]

def nhpr_body(prov, u, ic, qcard_html, other_html):
    inc = NHPR_INCOME[prov]
    rows = "".join("<tr><td>%s</td><td>$%s</td></tr>" % (n, v) for n, v in zip(["1 person", "2 people", "3 people", "4 people", "5 or more"], inc))
    return ('<section class="sec"><div class="wrap two"><div class="prose">' + nhpr_calc(prov) +
            '<h2 class="h2">What the new federal rebate pays</h2>'
            '<p>The Government of Canada\'s <b>National Heat Pump Rebate</b>, run by Environment and Climate Change Canada, helps homeowners switch to a cold-climate heat pump:</p>'
            '<ul class="tick"><li><b>Up to $10,000</b> for households at or below the median after-tax income for their province and household size</li><li><b>$2,000</b> for households above it</li></ul>'
            '<p>Heat pumps installed <b>on or after November 1, 2026</b> may qualify. The online application is expected to open in <b>early 2027</b>, and the program is expected to run until March 2034. No money is paid until the program launches and your application is approved.</p>'
            '<h3>Who qualifies</h3><ul class="tick"><li>You own the home and live in Canada (it doesn\'t have to be your main home)</li><li>The heat pump heats the whole home and is on the eligible product list (AHRI number)</li><li>It is bought from and installed by an HVAC contractor</li><li>Any current heating fuel: natural gas, electric, oil, propane, wood and more</li><li>You can keep your furnace as backup, and emergency replacements count</li><li>One rebate per household; renters aren\'t covered yet</li></ul>'
            '<h3>Income limits in %s</h3><p>To get the higher amount, your household\'s after-tax income (line 23600 minus line 43500 of your 2025 tax return, plus your spouse\'s or partner\'s) must be at or below:</p>'
            '<table class="tbl"><thead><tr><th>Household size</th><th>After-tax income</th></tr></thead><tbody>%s</tbody></table>'
            '<h3>How Jora helps</h3><ol class="olist"><li>Free in-home visit and heat-loss calculation so the heat pump can heat your whole home.</li><li>We quote cold-climate models on the eligible list and show the AHRI number on your quote.</li><li>We install it, including any ductwork, sheet metal and electrical work.</li><li>Your invoice has everything the application asks for: our details, make, model, AHRI number and total cost. Submit receipts within 6 months.</li></ol>'
            '%s'
            '<p class="mut">Official sources: <a href="%s" target="_blank" rel="noopener">National Heat Pump Rebate (canada.ca)</a> · <a href="%s" target="_blank" rel="noopener">detailed eligibility</a> · <a href="%s" target="_blank" rel="noopener">eligible heat pump list</a> · <a href="%s" target="_blank" rel="noopener">sign up for launch updates</a>. Program details can change; always check the official page. Jora Mechanical Systems is an independent contractor and is not part of the Government of Canada.</p>'
            '</div>%s</div></section>') % (prov, rows, other_html, NHPR_URL, NHPR_DETAILS, NHPR_LIST, NHPR_SIGNUP, qcard_html)
