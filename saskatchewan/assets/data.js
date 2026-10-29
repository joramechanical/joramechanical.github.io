var IMG={};["airmax-small", "bw-infiniti", "carrier", "carrier-ac", "goodman", "gree", "keeprite", "keeprite-ac", "kepler", "kepler-ac", "king-kbp", "lennox-ac", "lennox-el", "lennox-hp2", "lennox-lf24", "lennox-slp", "midea-ac", "modine-hd", "mrheater-bigmaxx", "navien", "noritz", "rheem", "rinnai", "rvr-designer", "rvr-dr", "tosot-hp", "trane-ac", "trane-furnace"].forEach(function(n){IMG[n]=ROOT+'assets/img/'+n+'.webp'});
var LOGO={};(function(m){for(var k in m)LOGO[k]=ROOT+'assets/logos/'+m[k]})({"Rinnai": "rinnai.webp", "Carrier": "carrier.webp", "KeepRite": "keeprite.webp", "Noritz": "noritz.webp", "Midea": "midea.webp", "Kepler": "kepler.webp", "Goodman": "goodman.webp", "Lennox": "lennox.webp", "Gree": "gree.webp", "Bradford White": "bradford-white.webp", "AirMax": "airmax.webp", "Trane": "trane.webp", "TOSOT": "tosot.webp", "Rheem": "rheem.webp"});
var LINKS={"cat": {"furnace": "furnaces/", "ac": "air-conditioners/", "hp": "heat-pumps/", "water": "tankless-water-heaters/", "gh": "garage-heaters/"}, "product": {"lennox-el296v": "products/lennox-el296v/", "lennox-slp99v": "products/lennox-slp99v/", "carrier-59sc6": "products/carrier-59sc6/", "trane-s9v2": "products/trane-s9v2/", "goodman-gmvc96": "products/goodman-gmvc96/", "kepler-furnace": "products/kepler-furnace/", "lennox-el16xc1": "products/lennox-el16xc1/", "carrier-26spa6": "products/carrier-26spa6/", "trane-xv18": "products/trane-xv18/", "kepler-ac": "products/kepler-ac/", "lennox-el18kslv": "products/lennox-el18kslv/", "tosot-apex": "products/tosot-apex/", "midea-hp": "products/midea-hp/", "gree-minisplit": "products/gree-minisplit/", "modine-hd45": "products/modine-hd45/", "mrheater-bigmaxx": "products/mrheater-bigmaxx/", "lennox-lf24": "products/lennox-lf24/", "king-kbp2406": "products/king-kbp2406/", "rvr-dr50": "products/rvr-dr50/", "rvr-designer": "products/rvr-designer/", "navien-npe240a2": "products/navien-npe240a2/", "rinnai-rx199in": "products/rinnai-rx199in/", "rheem-ikonic": "products/rheem-ikonic/", "bw-infiniti-gs": "products/bw-infiniti-gs/", "noritz-eztr50": "products/noritz-eztr50/"}, "brand": {"Lennox": "brands/lennox/", "Carrier": "brands/carrier/", "Trane": "brands/trane/", "Goodman": "brands/goodman/", "Kepler": "brands/kepler/", "TOSOT": "brands/tosot/", "Midea": "brands/midea/", "Gree": "brands/gree/", "Rinnai": "brands/rinnai/", "Navien": "brands/navien/", "Rheem": "brands/rheem/", "Bradford White": "brands/bradford-white/", "Noritz": "brands/noritz/", "Modine": "brands/modine/", "Mr. Heater": "brands/mr-heater/", "King": "brands/king/", "Re-Verber-Ray": "brands/re-verber-ray/"}, "svc": {"furnace": "furnaces/", "ac": "air-conditioners/", "hp": "heat-pumps/", "tankless": "tankless-water-heaters/", "garage": "garage-heaters/", "repair": "hvac-repair/", "water": "water-heaters/", "duct": "ductwork/", "humid": "humidifiers/", "thermo": "smart-thermostats/", "hrv": "hrv-erv/", "erv": "hrv-erv/", "boiler": "boilers/", "filters": "indoor-air-quality/", "maint": "hvac-maintenance/", "commercial": "commercial-hvac/", "industrial": "industrial-hvac/"}, "post": ["blog/furnace-or-heat-pump/", "blog/tankless-vs-tank-water-heater/", "blog/hrv-or-erv/", "blog/garage-heater-sizing-saskatchewan/", "blog/saskenergy-rebates-explained/", "blog/signs-you-need-a-new-furnace/", "blog/frozen-furnace-vent-pipes/", "blog/fall-furnace-checklist/"], "page": {"rebates": "rebates/", "area": "service-areas/", "work": "our-work/", "solutions": "commercial-hvac/", "about": "about/", "contact": "contact/", "blog": "blog/", "quote": "free-quote/", "home": ""}, "idx": ""};
/* ===================== SETTINGS — EDIT THESE ===================== */
var JORA = {
  company: "Jora Mechanical Systems",
  phone: "905-667-2823",
  notifyEmail: "info@joramechanicalsystems.com",
  email: "info@joramechanicalsystems.com",   // where website quote requests are emailed (change if needed)
  formEndpoint: "",                        // optional: a form service URL (e.g. Formspree) so requests arrive automatically on your live site
  slideSeconds: 3.5,
  licences: [
    ["TSASK Licensed","Gas contractor licensed by the Technical Safety Authority of Saskatchewan"],
    ["TSASK Gas Fitters","Gas work done by TSASK-licensed gas fitters, with TSASK gas permits"],
    ["Red Seal Refrigeration","Refrigeration & Air Conditioning Mechanics — SATCC / Red Seal trade"],
    ["National Building Code","Installs to the National Building Code as adopted in Saskatchewan"],
    ["CSA B149 Gas Code","Gas appliances, piping and venting to the CSA B149 codes"],
    ["Permits Pulled","Gas, electrical and municipal building permits handled where required"],
    ["WCB Saskatchewan","Workers covered — clearance letter available on request"],
    ["Fully Insured","Liability coverage on every job"]
  ]
};
/* ================================================================= */

var BRANDS = {
  furnace:["Lennox","Carrier","Trane","Goodman","Kepler"],
  ac:["Lennox","Carrier","Trane","Kepler"],
  hp:["Lennox","TOSOT","Midea","Gree"],
  water:["Rinnai","Navien","Rheem","Bradford White","Noritz"],
  gh:["Modine","Mr. Heater","Lennox","King","Re-Verber-Ray"]
};
var CATS = {
  furnace:{name:"Furnaces",sub:"Gas furnaces, 96%+ AFUE",ic:"furnace",short:"Furnace"},
  ac:{name:"Air Conditioners",sub:"Central air conditioning",ic:"ac",short:"Air Conditioner"},
  hp:{name:"Heat Pumps",sub:"Cold-climate heating & cooling",ic:"hp",short:"Heat Pump"},
  water:{name:"Tankless Water Heaters",sub:"Endless hot water",ic:"tankless",short:"Tankless"},
  gh:{name:"Garage Heaters",sub:"Gas, infrared & electric shop heat",ic:"garage",short:"Garage Heater"}
};
var BCOL = {Lennox:"#C8102E",Carrier:"#1F3F96",Trane:"#B3121B",KeepRite:"#1A73B8",Goodman:"#D22630",Kepler:"#2A2A2A",Gree:"#1B5FA8",Rinnai:"#555",Navien:"#0A4D8C",Rheem:"#C8102E","Bradford White":"#123E7C",Noritz:"#D7262B",TOSOT:"#C8202A",Midea:"#1CA0E3",Modine:"#00529B","Mr. Heater":"#1E1E1E",King:"#1B5FA8","Re-Verber-Ray":"#D9531E"};

var PRODUCTS = [
 /* ---------- FURNACES ---------- */
 {id:"lennox-el296v",cat:"furnace",brand:"Lennox",img:"lennox-el",model:"Elite EL296V",name:"Lennox Elite EL296V Gas Furnace",
  tag:"Two-stage, variable-speed comfort with up to 96% AFUE.",feats3:["Up to 96% AFUE","Two-stage heat","Variable-speed blower"],badge:["Top pick","Furnace"],flag:"Top pick",
  specs:[["Efficiency (AFUE)","Up to 96%"],["Heating","Two-stage"],["Blower","Variable-speed motor"],["Heat exchanger warranty","Limited lifetime (model dependent)"],["Parts warranty","5 years; 10 years with registration"],["ENERGY STAR","Yes"]],
  feats:["Variable-speed airflow — no cold start-up blasts","Sealed blower compartment","Enhanced humidity control","Ultra-low continuous fan","Dual-fuel capable (pairs with a heat pump)","SureLight silicon nitride ignitor"],
  src:"https://www.lennox.com/products/heating-cooling/furnaces/el296v"},
 {id:"lennox-slp99v",cat:"furnace",brand:"Lennox",img:"lennox-slp",model:"Signature SLP99V",name:"Lennox Signature SLP99V Gas Furnace",
  tag:"Lennox's premium modulating furnace — up to 99% AFUE.",feats3:["Up to 99% AFUE","Modulating heat","Ultra-quiet"],badge:["Premium","Signature"],flag:"Premium",
  specs:[["Efficiency (AFUE)","Up to 99%"],["Heating","Variable-capacity (modulating)"],["Blower","Variable-speed"],["Warranty","Ask us for current terms"]],
  feats:["Precise, even temperatures room to room","Very quiet operation","Smart-thermostat ready"],src:""},
 {id:"carrier-59sc6",cat:"furnace",brand:"Carrier",img:"carrier",model:"Comfort 96 (59SC6)",name:"Carrier Comfort 96 Gas Furnace (59SC6)",
  tag:"Reliable Carrier heat with up to 97% AFUE.",feats3:["Up to 97% AFUE","18-speed ECM blower","Propane convertible"],badge:["Trusted","Brand"],
  specs:[["Efficiency (AFUE)","Up to 97%"],["Gas valve","Single-stage"],["Blower","ECM, 18 speeds"],["Parts warranty","10 years with timely registration (5 without)"],["Heat exchanger","Lifetime limited with registration (20 years without)"],["Fuel","Natural gas; propane with optional kit"]],
  feats:["Quiet operation","Wi-Fi control with Carrier smart thermostat","Standard humidity control","Multiple sizes available"],
  src:"https://carrier.com/residential/en/ca/products/furnaces/59sc6"},
 {id:"trane-s9v2",cat:"furnace",brand:"Trane",img:"trane-furnace",model:"S9V2-VS",name:"Trane S9V2-VS Gas Furnace",
  tag:"97% AFUE, two-stage, variable-speed — built tough.",feats3:["97% AFUE","Two-stage","Variable-speed"],badge:["97%","AFUE"],
  specs:[["Efficiency (AFUE)","97%"],["Burner","Two-stage"],["Blower","Variable-speed (Vortica II)"],["Input range","40,000 – 100,000 BTU"],["Parts warranty","10 years (register within 60 days)"],["Heat exchanger","Lifetime limited (register within 60 days)"]],
  feats:["Stainless steel primary & secondary heat exchangers","Variable-speed draft inducer","Comfort-R enhanced dehumidification","Insulated cabinet, compact size","Self-diagnosing control"],
  src:"https://www.furnaceprices.ca/?p=30546"},
 {id:"goodman-gmvc96",cat:"furnace",brand:"Goodman",img:"goodman",model:"GMVC96",name:"Goodman GMVC96 Gas Furnace",
  tag:"96% AFUE two-stage furnace — strong value.",feats3:["96% AFUE","Two-stage","Variable-speed ECM"],badge:["Best","Value"],flag:"Best value",
  specs:[["Efficiency (AFUE)","96%"],["Heating","Two-stage"],["Blower","Variable-speed ECM"],["Parts warranty","10 years (register within 60 days)"],["Unit replacement","10-year limited"],["Communicating","ComfortBridge built in"]],
  feats:["Multi-position install","Self-diagnostic control with fault history","Silicon nitride igniter","Ready for humidifier & air cleaner","ENERGY STAR certified"],
  src:"https://www.goodmanmfg.com/products/gas-furnaces/96-afue-gmvc96"},
 {id:"kepler-furnace",cat:"furnace",brand:"Kepler",img:"kepler",model:"Gas furnace",name:"Kepler High-Efficiency Gas Furnace",
  tag:"Modern design, steady efficient warmth.",feats3:["High efficiency","Quiet","Modern design"],badge:["New","Arrival"],flag:"New",
  specs:[["Type","High-efficiency gas furnace"],["Model specs","Ask us — we'll match the size to your home"]],
  feats:["Clean modern cabinet","Quiet operation"],src:""},
 /* ---------- AIR CONDITIONERS ---------- */
 {id:"lennox-el16xc1",cat:"ac",brand:"Lennox",img:"lennox-ac",model:"Elite EL16XC1",name:"Lennox Elite EL16XC1 Air Conditioner",
  tag:"Quiet, efficient central air — up to 17 SEER.",feats3:["Up to 17 SEER","As low as 71 dB","Scroll compressor"],badge:["Quiet","Cooling"],
  specs:[["Efficiency","Up to 17 SEER"],["Cooling","Single-stage"],["Compressor","Scroll"],["Sound","As low as 71 dB"],["Refrigerant","R-410A"],["Warranty","10-yr compressor, 5-yr parts (10-yr with registration)"]],
  feats:["SilentComfort sound dampening","Quantum corrosion-resistant coil","PermaGuard cabinet","ENERGY STAR certified"],
  src:"https://www.lennox.com/products/heating-cooling/air-conditioners/el16xc1"},
 {id:"carrier-26spa6",cat:"ac",brand:"Carrier",img:"carrier-ac",model:"Performance 26SPA6",name:"Carrier Performance Air Conditioner (26SPA6)",
  tag:"Up to 16.5 SEER2 with Carrier reliability.",feats3:["Up to 16.5 SEER2","67 dB","Up to 4 zones"],badge:["16.5","SEER2"],
  specs:[["Efficiency","Up to 16.5 SEER2"],["EER2","Up to 14.5"],["Cooling","Single-stage"],["Sound","67 dB"],["Zoning","Up to 4 zones"],["Warranty","10-yr parts with registration"]],
  feats:["InteliSense technology","Enhanced humidity control","Works with ecobee for Carrier smart thermostats"],
  src:"https://www.carrier.com/residential/en/ca/products/air-conditioners/24spa6"},
 {id:"trane-xv18",cat:"ac",brand:"Trane",img:"trane-ac",model:"XV18",name:"Trane XV18 Variable-Speed Air Conditioner",
  tag:"Variable-speed TruComfort cooling, quiet as 55 dB.",feats3:["Up to 18 SEER","750 stages","As low as 55 dB"],badge:["Variable","Speed"],flag:"Premium",
  specs:[["Efficiency","Up to 18 SEER"],["Compressor","Variable-speed, 750 stages (TruComfort)"],["Sound","As low as 55 dB"],["Sizes","24,000 – 60,000 BTU"],["Coil","Spine Fin aluminum"],["Warranty","12-yr compressor, 10-yr parts (register within 60 days)"]],
  feats:["Precise temperature and humidity control","ENERGY STAR certified","Works with Trane CleanEffects filtration","Rust-proof base pan"],
  src:"https://www.furnaceprices.ca/?p=25937"},
 {id:"kepler-ac",cat:"ac",brand:"Kepler",img:"kepler-ac",model:"Central AC",name:"Kepler Central Air Conditioner",
  tag:"Clean, modern outdoor unit for steady summer comfort.",feats3:["Quiet fan","Compact","Easy service"],badge:["New","Arrival"],flag:"New",
  specs:[["Type","Split-system outdoor unit"],["Sizes & ratings","Ask us — we match the size to your home's cooling load"]],
  feats:["Compact cabinet","Corrosion-resistant finish","Pairs with your furnace coil"],src:""},
 {id:"lennox-el18kslv",cat:"hp",brand:"Lennox",img:"lennox-hp2",model:"Elite EL18KSLV",name:"Lennox Elite EL18KSLV Heat Pump",
  tag:"Slim side-discharge cold-climate heat pump, made for Canada.",feats3:["Up to 19 SEER2","Up to 10 HSPF2","As low as 54 dB"],badge:["Cold","Climate"],flag:"New",
  specs:[["Cooling","Up to 19 SEER2"],["Heating","Up to 10 HSPF2"],["Capacity","Variable-capacity"],["Sound","As low as 54 dB"],["Refrigerant","R-454B"],["Warranty","10-yr compressor, 5-yr parts (10-yr with registration)"]],
  feats:["Slim side-discharge cabinet — fits tight side yards","Cold-climate heating technology","ENERGY STAR certified","Heats and cools in one unit"],
  src:"https://www.lennox.com/residential/products/heating-cooling/heat-pumps/el18kslv"},
 {id:"tosot-apex",cat:"hp",brand:"TOSOT",img:"tosot-hp",model:"APEX",name:"TOSOT APEX Central Heat Pump",
  tag:"Inverter central heat pump that heats down to −30 °C.",feats3:["Heats to −30 °C","Up to 18 SEER","Up to 11 HSPF"],badge:["−30","°C"],badgeRed:true,
  specs:[["Cooling","Up to 18 SEER"],["Heating","Up to 11 HSPF"],["Low-temp heating","Down to −30 °C (−22 °F)"],["Capacity","2 – 5 ton models"],["Compressor","Inverter"],["Sound","As low as 52 dB(A)"],["Warranty","10-yr compressor, 10-yr parts (3-ton model)"]],
  feats:["Pairs with the APEX air handler","Works with a standard 24 V thermostat","Self-diagnosis and auto-restart"],
  src:"https://airgreen.ca/en/products/thermopompe-centrale-tosot-apex-3-tonnes"},
 {id:"midea-hp",cat:"hp",brand:"Midea",img:"midea-ac",wide:true,model:"Inverter heat pump",name:"Midea Inverter Heat Pump",
  tag:"Efficient inverter heating & cooling for rooms or whole homes.",feats3:["Heats & cools","Inverter","Quiet"],badge:["Heat","& Cool"],
  specs:[["Type","Inverter heat pump outdoor unit"],["Systems","Ductless mini-split or ducted"],["Sizes & ratings","Ask us — depends on the model we size for your home"]],
  feats:["Variable-speed inverter compressor","Low-noise fan","Great for additions, basements and condos"],src:""},
 {id:"gree-minisplit",cat:"hp",brand:"Gree",img:"gree",wide:true,model:"Ductless mini-split",name:"Gree Ductless Mini-Split Heat Pump",
  tag:"Cools and heats rooms with no ductwork.",feats3:["Heats & cools","No ducts","Whisper quiet"],badge:["Heat","& Cool"],
  specs:[["Type","Ductless mini-split heat pump"],["Refrigerant","R-410A"],["Certification","AHRI certified"],["Best for","Additions, basements, condos, single rooms"]],
  feats:["Inverter compressor","Wall-mounted indoor unit with remote","Zone-by-zone comfort"],src:""},
 /* ---------- GARAGE HEATERS ---------- */
 {id:"modine-hd45",cat:"gh",brand:"Modine",img:"modine-hd",model:"Hot Dawg HD45",name:"Modine Hot Dawg HD45 Garage Heater",
  tag:"The classic 2-car garage heater — low profile and power vented.",feats3:["45,000 BTU input","80% efficient","Wall or roof vent"],badge:["2-car","Garage"],flag:"Most popular",
  specs:[["Input","45,000 BTU/h"],["Output","36,900 BTU/h"],["Thermal efficiency","80%"],["Venting","Power exhaust, 3\" vent — side-wall or roof"],["Fuel","Natural gas or propane models"],["Heats","About a 2 to 2½-car garage"],["Weight","60 lb"],["Warranty","10-yr heat exchanger, 2-yr parts"],["Series sizes","30,000 – 125,000 BTU/h"]],
  feats:["Low-profile cabinet mounts about 1\" below the ceiling","Gas and electrical connections on the left or right","Quiet, permanently lubricated fan motor","Ceiling brackets included","Thermostat-controlled — set it and forget it"],
  more:"The Hot Dawg is the heater we put in most attached and detached two-car garages around Saskatoon. Power venting means it exhausts through the side wall — no chimney needed — and a 45,000 BTU unit keeps an insulated double garage comfortable through a prairie cold snap.",
  src:"https://www.greenhousemegastore.com/products/modine-hd45-unit-heater"},
 {id:"mrheater-bigmaxx",cat:"gh",brand:"Mr. Heater",img:"mrheater-bigmaxx",model:"Big Maxx MHU50",name:"Mr. Heater Big Maxx 50,000 BTU Garage Heater",
  tag:"Strong-value 50,000 BTU unit heater for garages, shops and farm buildings.",feats3:["50,000 BTU","Up to 1,667 sq ft","Propane kit included"],badge:["Best","Value"],flag:"Best value",
  specs:[["Heat output","50,000 BTU/h"],["Heats","Up to about 1,667 sq ft"],["Fuel","Natural gas — propane conversion kit included"],["Venting","Category I vertical or Category III horizontal"],["Ignition","Electronic spark with self-diagnostic control"],["Power","115 V"],["Mounting","Ceiling brackets, at least 8 ft above the floor"],["Weight","About 70 lb"],["Warranty","10-yr heat exchanger, 3-yr parts & burner"]],
  feats:["High-limit safety shut-off","1/2\" gas connection","Vertical or horizontal venting options","Suits garages, metal buildings and agricultural buildings"],
  more:"The Big Maxx gives a lot of heat for the money — a good fit for detached garages, metal shops and farm buildings around Saskatchewan. It comes ready for natural gas with a propane kit in the box, which suits acreages on propane.",
  src:"https://mrheater.com/products/50-000-btu-big-maxx-natural-gas-unit-heater"},
 {id:"lennox-lf24",cat:"gh",brand:"Lennox",img:"lennox-lf24",model:"LF24-45A",name:"Lennox LF24 45,000 BTU Garage Heater",
  tag:"Quiet, low-profile Lennox unit heater for garages and utility rooms.",feats3:["45,000 BTU input","Up to 81% efficient","Direct spark ignition"],badge:["Lennox","Quality"],
  specs:[["Input","45,000 BTU/h"],["Output","36,500 BTU/h"],["Thermal efficiency","Up to 81%"],["Ignition","Direct spark"],["Heat exchanger","Tubular aluminized steel"],["Fuel","Natural gas (propane kit available)"],["Electrical","115 V, single phase"],["Size","25\" W × 13\" H × 24\" D, 63 lb"],["Series sizes","30,000 – 75,000 BTU/h"]],
  feats:["Low-profile design saves headroom","Tubular heat exchanger spreads heat evenly","Sizes for a 1-car up to a 4+ car garage","Matches a Lennox furnace in the house"],
  more:"If you already have a Lennox furnace, the LF24 keeps the whole property on one brand and one service team. It's quiet enough for a garage that doubles as a workshop or gym.",
  src:"https://www.lennoxpros.com/lf24-45a-unit-heater45000-input-btuh36500-output-btuh-115-v-60hz-1-ph-81%25-efficiency/p/40K87"},
 {id:"king-kbp2406",cat:"gh",brand:"King",img:"king-kbp",model:"KBP2406",name:"King KBP Pic-A-Watt Electric Garage Heater",
  tag:"No gas line needed — 240 V electric heater you can set from 950 to 5,700 W.",feats3:["Up to 5,700 W","Built-in thermostat","Ceiling/wall bracket"],badge:["Electric","240 V"],
  specs:[["Power","950 – 5,700 W, set at installation (Pic-A-Watt)"],["Heat","Up to about 19,450 BTU/h"],["Voltage","240/208 V, single phase"],["Airflow","270 CFM"],["Thermostat","Built-in, 40 – 90 °F"],["Mounting","Universal ceiling/wall bracket, 6 ft+ above floor"],["Motor","Cast iron, with fan delay"],["Warranty","5-year limited"],["Finish","Onyx gray"]],
  feats:["Pick the wattage to match your circuit and garage","Fan / heat / off switch","Fan keeps running briefly after heat stops","No venting, no gas permit — just a 240 V circuit","UL and cCSAus listed"],
  more:"For a single garage, a heated workshop corner or a garage with no gas line, the King KBP is the simplest install. We set the wattage to suit your electrical panel and run a dedicated 240 V circuit with a TSASK electrical permit.",
  src:"https://www.homelectrical.com/sites/default/files/KNG-KBP2406Spec_0.pdf"},
 {id:"rvr-dr50",cat:"gh",brand:"Re-Verber-Ray",img:"rvr-dr",model:"DR-50",name:"Re-Verber-Ray DR-50 High-Intensity Infrared Heater",
  tag:"Glowing ceramic infrared heat for shops, bays and big doors.",feats3:["50,000 BTU","1,690 °F ceramic","Mount 12–14 ft"],badge:["Infrared","Heat"],flag:"Shop favourite",
  specs:[["Input","50,000 BTU/h"],["Type","High-intensity ceramic infrared"],["Ceramic temperature","1,690 °F"],["Mounting","12 – 14 ft, angled 20° – 35°"],["Ignition","Direct spark (FS models) or standing pilot (MV models)"],["Fuel","Natural gas or propane"],["Ventilation","Unvented — needs a well-ventilated space (4 CFM per 1,000 BTU/h)"],["Weight","27 lb"],["Warranty","5-year limited ceramic burner"]],
  feats:["Heats people, vehicles and floors directly — not just the air","Warmth comes back fast after the overhead door opens","Aluminum and stainless steel construction","CSA design certified"],
  more:"High-intensity infrared is the answer for mechanic bays, farm shops and loading areas where big doors open all day. The glowing ceramic warms the floor and the person working, so the space feels warm even when the air is cold.",
  src:"https://supplyshop.com/products/re-verber-ray-dr-50-high-intensity-gas-fired-infrared-heater-50-000-btu"},
 {id:"rvr-designer",cat:"gh",brand:"Re-Verber-Ray",img:"rvr-designer",model:"Designer Series",name:"Re-Verber-Ray Designer Series Patio Heater",
  tag:"Stylish stainless infrared heat for decks, patios and restaurant terraces.",feats3:["65,000 – 100,000 BTU","Two-stage","Outdoor rated"],badge:["Patio","Heat"],
  specs:[["Input","65,000 / 80,000 / 100,000 BTU/h models (two-stage)"],["Type","Low-intensity infrared, decorative housing"],["Coverage","About 26 ft × 12 ft"],["Mounting height","9 – 16 ft"],["Fuel","Natural gas or propane"],["Controls","24 V, two-stage"],["Use","Outdoor only — patios, decks, terraces"],["Warranty","10-yr burner, 5-yr tubes, 3-yr controls"]],
  feats:["Brushed stainless designer housing","Two-stage heat — low on mild evenings, high when it's cold","Gas line by our TSASK-licensed gas fitters","Great for restaurant patios and backyard decks"],
  more:"Saskatchewan patio season is short — a Designer Series heater stretches it into the cool spring and fall evenings. It's rated for outdoor use only, so we install it on covered patios and decks, never in a garage or living space.",
  src:"https://hvacdirect.com/media/pdf/DSRL%20Submittal%20Sheets.pdf"},
 /* ---------- TANKLESS ---------- */
 {id:"navien-npe240a2",cat:"water",brand:"Navien",img:"navien",model:"NPE-240A2",name:"Navien NPE-240A2 Tankless Water Heater",
  tag:"Built-in recirculation for hot water faster.",feats3:["0.95 UEF","Up to 11.2 GPM","ComfortFlow recirc"],badge:["ENERGY","STAR"],
  specs:[["Gas input","13,300 – 199,900 BTU/h"],["Flow","5.6 GPM at 67°F rise · 11.2 GPM at 35°F rise"],["Efficiency","0.95 UEF"],["Recirculation","Built-in buffer tank & pump (ComfortFlow)"],["Venting","2\" or 3\" PVC/CPVC, up to 75 ft"],["Warranty","15-yr heat exchanger · 5-yr parts · 1-yr labour"]],
  feats:["Dual stainless steel heat exchangers","Indoor or outdoor wall mount","Natural gas or propane (field convertible)"],
  src:"https://www.navieninc.com/downloads/npe-2-quickfacts-en/download"},
 {id:"rinnai-rx199in",cat:"water",brand:"Rinnai",img:"rinnai",model:"SENSEI RX199iN",name:"Rinnai RX199iN Condensing Tankless",
  tag:"Up to 11.1 GPM and 0.98 UEF, Wi-Fi built in.",feats3:["0.98 UEF","11.1 GPM","Wi-Fi"],badge:["Smart","Wi-Fi"],
  specs:[["Gas input","15,000 – 199,000 BTU"],["Max flow","11.1 GPM"],["Efficiency","0.98 UEF"],["Type","Condensing"],["Install","Indoor or outdoor"],["Recirculation","Capable"]],
  feats:["Wi-Fi control","Natural gas or propane","ENERGY STAR certified","Ultra Low NOx"],
  src:"https://www.rinnai.us/residential/product-detail/rx199in"},
 {id:"rheem-ikonic",cat:"water",brand:"Rheem",img:"rheem",model:"Super High Efficiency",name:"Rheem Super High Efficiency Tankless",
  tag:"Condensing tankless with built-in recirculation.",feats3:["0.93 UEF","9.5 GPM","Built-in recirc"],badge:["Built-in","Recirc"],
  specs:[["Max flow","9.5 GPM"],["Efficiency","0.93 UEF"],["Recirculation","Built-in"],["Fuel","Natural gas"],["Warranty","15 years (primary)"]],
  feats:["Compact wall-mount (23\" x 18\" x 9\")","Hot water on demand"],
  src:"https://rheem.com/product/rheem-rtgh-series-super-high-efficiency-condensing-tankless-gas-water-heaters-rtgh-95dvln-3"},
 {id:"bw-infiniti-gs",cat:"water",brand:"Bradford White",img:"bw-infiniti",model:"Infiniti GS 199",name:"Bradford White Infiniti GS 199 Tankless",
  tag:"Made-tough condensing tankless, 199,000 BTU.",feats3:["199,000 BTU","Up to 9.7 GPM","Ultra Low NOx"],badge:["199K","BTU"],
  specs:[["Gas input","199,000 BTU/h"],["Max flow","Up to 9.7 GPM"],["Efficiency","0.95 UEF"],["Type","Condensing, indoor"],["Water connections","3/4\""],["Warranty","15-yr limited residential heat exchanger"]],
  feats:["ENERGY STAR certified","Ultra Low NOx","Natural gas or propane models"],
  src:"https://ferguson.com/product/bradford-white-infiniti-gs-series-199-mbh-indoor-condensing-natural-gas-tankless-water-heater-brtgs199n1/9938270.html"},
 {id:"noritz-eztr50",cat:"water",brand:"Noritz",img:"noritz",model:"EZTR50",name:"Noritz EZ Series EZTR50 Tankless",
  tag:"Drop-in replacement for a 50-gallon tank.",feats3:["0.98 UEF","9.8 GPM","25-yr warranty"],badge:["25-Year","Warranty"],badgeRed:true,flag:"25-yr warranty",flagRed:true,
  specs:[["Gas input","18,000 – 180,000 BTU"],["Max flow","9.8 GPM"],["Efficiency","0.98 UEF"],["Install","Indoor or outdoor"],["Venting","25 ft flex vent kit included"],["Warranty","25 years"]],
  feats:["Uses your tank's existing connections","Dual stainless steel heat exchangers","Bluetooth app (EZ Start Plus)","Natural gas to propane kit included"],
  src:"https://noritz.com/products/eztr50"}
];

var ICONS = {
  repair:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  furnace:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 1-3 0-6 1-9z"/>',
  ac:'<path d="M12 2v20M4.9 6l14.2 12M4.9 18 19.1 6M2 12h20"/>',
  hp:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/><path d="M12 8v8M8 12h8"/>',
  water:'<rect x="6.5" y="3" width="11" height="18" rx="3"/><path d="M6.5 8h11M12 12.5c1 1.2 1.6 2 1.6 3a1.6 1.6 0 0 1-3.2 0c0-1 .6-1.8 1.6-3z"/>',
  tankless:'<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M12.8 7 9.5 12.2h2.6l-.9 4.8 3.4-5.2h-2.6z"/>',
  garage:'<path d="M3 10 12 4l9 6v10H3z"/><path d="M7 20v-7h10v7M7 16h10"/>',
  duct:'<path d="M3 8h12l3 2.5V16l-3 2.5H3z"/><path d="M7 8v10.5M11 8v10.5M18 10.5h3M18 16h3"/>',
  humid:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9 15a3 3 0 0 0 3 3"/>',
  thermo:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v4.8l3 1.8"/>',
  plumb:'<path d="M4 4h6v4H8v3a3 3 0 0 0 3 3h5v-2h4v6h-4v-2h-5a5 5 0 0 1-5-5V8H4z"/>',
  hrv:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h6l-2-2M17 14h-6l2 2"/>',
  erv:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 9c2 0 2 6 4 6s2-6 4-6"/>',
  maint:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  filters:'<rect x="4" y="4" width="16" height="16"/><path d="M4 9h16M4 14h16M9 4v16M14 4v16"/>',
  boiler:'<rect x="5" y="3" width="14" height="14" rx="2"/><path d="M9 17v4M15 17v4M8 21h8M9 7.5c-1 1 1 1.6 0 3M13 7.5c-1 1 1 1.6 0 3"/>',
  home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  town:'<path d="M2 12l5-4 5 4 5-4 5 4"/><path d="M3 11v9h18v-9M7 20v-4M12 20v-4M17 20v-4"/>',
  semi:'<path d="M2 12l5-5 5 5 5-5 5 5"/><path d="M3 11v9h18v-9M12 12v8"/>',
  condo:'<rect x="5" y="3" width="14" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  bung:'<path d="M2 13l10-7 10 7"/><path d="M4 12v8h16v-8M10 20v-4h4v4"/>',
  shop:'<path d="M3 9h18l-1-5H4z"/><path d="M4 9v11h16V9M9 20v-6h6v6"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  ruler:'<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
  tools:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  ah:'<rect x="6" y="3" width="12" height="18" rx="1.5"/><circle cx="10" cy="6" r="1.6"/><circle cx="14" cy="6" r="1.6"/><path d="M6 11h12M9 15h6M9 18h6"/>',
  office:'<path d="M4 21V5l8-2v18M12 7h8v14M7 8h2M7 12h2M7 16h2M15 11h2M15 15h2M2 21h20"/>',
  factory:'<path d="M2 21V10l6 4V10l6 4V6h3l1 4h4v11z"/><path d="M6 17h2M11 17h2M16 17h2"/>',
  rebate:'<circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.6-.8-1.7-1.2-3-1.2-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.3 0-2.5-.5-3.1-1.3M12 6v2M12 16v2"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  camera:'<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="13" r="4"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  permit:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 13l2 2 4-4"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M8 18h2M12 18h4"/>',
  smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'
};

var SERVICES = [
  {id:"repair",name:"Repair Service",ic:"repair",red:1},
  {id:"furnace",name:"Furnace",ic:"furnace"},
  {id:"ac",name:"Air Conditioner",ic:"ac"},
  {id:"hp",name:"Heat Pump",ic:"hp"},
  {id:"tankless",name:"Tankless Water Heater",ic:"tankless"},
  {id:"water",name:"Water Heater (Tank)",ic:"water"},
  {id:"garage",name:"Garage Heater",ic:"garage"},
  {id:"duct",name:"Duct Work",ic:"duct"},
  {id:"humid",name:"Humidifier",ic:"humid"},
  {id:"thermo",name:"Thermostat",ic:"thermo"},
  {id:"hrv",name:"HRV",ic:"hrv"},
  {id:"erv",name:"ERV",ic:"erv"},
  {id:"boiler",name:"Boiler",ic:"boiler"},
  {id:"filters",name:"Air Filters & Purifiers",ic:"filters"},
  {id:"maint",name:"Maintenance / Tune-up",ic:"maint"},
  {id:"commercial",name:"Commercial HVAC",ic:"office"},
  {id:"industrial",name:"Industrial HVAC",ic:"factory"}
];
var STEPS = [
  ["chat","Call, chat or book","Phone us 24/7, chat on this site, or book online in 2 minutes."],
  ["home","Free in-home visit","We look at your home, your current system and what you want fixed."],
  ["calc","Heat-loss & sizing","We size the equipment to your home — no guessing."],
  ["rebate","Written quote + rebates","Clear options in writing, and the rebates you may qualify for."],
  ["permit","Permits & scheduling","We pull permits where needed and book a day that suits you."],
  ["tools","Clean install to code","Licensed techs, floors protected, TSASK permits, work to code."],
  ["check","Test & walkthrough","Every system tested and explained before we leave."],
  ["shield","Warranty & aftercare","We register your warranty and stay on call 24/7."]
];
var CITIES=["Saskatoon","Warman","Martensville","Dalmeny","Osler","Langham","Aberdeen","Hague","Rosthern","Delisle","Vanscoy","Dundurn","Clavet","Allan","Corman Park","Regina","Moose Jaw","Prince Albert","North Battleford","Yorkton","Swift Current","Humboldt","Lloydminster","Melfort","Estevan","Weyburn","Kindersley","Outlook","Rosetown","Biggar"];
var POSTS=[
  {tag:"Heating",col:"#F96302",ic:"furnace",date:"Oct 2026",t:"Furnace or heat pump for a Saskatchewan home?",x:"How they compare in a −35 °C prairie winter, and when a hybrid makes sense.",
   body:["Saskatoon sees some of the coldest winter nights of any large Canadian city, so a high-efficiency gas furnace is still the backbone of most Saskatchewan homes. Cold-climate heat pumps can now heat well below −20 °C and also cool in summer.","Many homeowners choose a hybrid system: the heat pump handles spring, fall and milder winter days, and the furnace takes over in deep cold. The right answer depends on insulation, ductwork, your electrical panel and SaskPower and SaskEnergy rates.","We measure your home with a heat-loss calculation before recommending anything, so the system is sized properly rather than guessed."]},
  {tag:"Hot water",col:"#D7262B",ic:"tankless",date:"Sep 2026",t:"Tankless vs. tank water heater",x:"Endless hot water, space savings, and what to check first.",
   body:["A tankless water heater heats water only when you need it, so it doesn't run out during back-to-back showers and it frees up floor space.","Before switching, we check your gas line size, venting route and water hardness. Hard water can shorten the life of any water heater, so a softener or regular flushing may be recommended.","A tank heater can still be the right fit for some homes. We'll lay out both options in your quote."]},
  {tag:"Air quality",col:"#1E1E1E",ic:"hrv",date:"Aug 2026",t:"Why tight homes need an HRV or ERV",x:"Fresh air without wasting heat — and which one you need.",
   body:["Newer and well-sealed homes hold in moisture, cooking smells and stale air. A heat recovery ventilator (HRV) or energy recovery ventilator (ERV) brings in fresh air while recovering much of the heat from the air going out.","An HRV is common in colder, more humid homes; an ERV also transfers some moisture, which can help homes that get too dry in winter.","Signs you may need one: condensation on windows, lingering odours, or stuffy rooms."]}
];

/* ===================== REBATES (Saskatchewan) — edit amounts here ===================== */
var REBATES = {
  updated:"October 2026",
  program:"SaskEnergy Residential Equipment Replacement Rebate",
  link:"https://www.saskenergy.com/residential/programs-and-services/energy-efficiency-rebates/",
  items:[
    {id:"furn97",ic:"furnace",t:"Furnace 97%+ AFUE (natural gas)",amt:650,svc:"furnace"},
    {id:"furn96",ic:"furnace",t:"Furnace 96.0–96.9% AFUE",amt:325,svc:"furnace"},
    {id:"tankless",ic:"tankless",t:"Tankless water heater (0.87+ UEF)",amt:1000,svc:"tankless"},
    {id:"condwh",ic:"water",t:"Condensing tank water heater (0.80+ UEF)",amt:1000,svc:"water"},
    {id:"tank",ic:"water",t:"Tank water heater (0.64–0.79 UEF)",amt:250,svc:"water"},
    {id:"boiler",ic:"boiler",t:"High-efficiency boiler (95%+)",amt:2000,up:true,svc:"boiler"},
    {id:"combi",ic:"boiler",t:"Combi boiler (95%+)",amt:800,svc:"boiler"},
    {id:"hrv",ic:"hrv",t:"ENERGY STAR HRV",amt:100,svc:"hrv"}
  ],
  notes:["Units must be installed by a contractor holding a valid TSASK gas licence — self-installs don't qualify. We hold the licence and send you the paperwork.","Apply within 90 days of installation. SaskEnergy pays approved rebates within about 6 weeks.","Funding is limited and SaskEnergy can change or end the program. We confirm what's open when we quote."]
};

/* ===================== SOLUTIONS ===================== */
var SOLUTIONS = {
  home:{t:"Home solutions",ic:"home",lead:"Comfort for houses, acreages, townhouses and condos.",col:"#F96302",
    items:[["Furnaces","furnace"],["Air conditioners","ac"],["Heat pumps","hp"],["Tankless & tanks","tankless"],["Garage heaters","garage"],["Ductwork","duct"],["HRV / ERV","hrv"],["Boilers & in-floor","boiler"]]},
  commercial:{t:"Commercial solutions",ic:"office",lead:"Shops, offices, restaurants, clinics and plazas.",col:"#D7262B",
    items:[["Rooftop units (RTU)","commercial","ac"],["Make-up air units","commercial","hrv"],["Unit heaters","commercial","garage"],["Split & ductless systems","commercial","hp"],["Restaurant ventilation","commercial","erv"],["Maintenance contracts","commercial","maint"],["Gas piping (TSASK)","commercial","furnace"],["24/7 service","repair","repair"]]},
  industrial:{t:"Industrial solutions",ic:"factory",lead:"Warehouses, farm shops and plants.",col:"#1E1E1E",
    items:[["Shop & warehouse heating","industrial","furnace"],["Radiant tube heaters","industrial","garage"],["Large make-up air","industrial","hrv"],["Exhaust & ventilation","industrial","erv"],["Process cooling","industrial","ac"],["Gas line installs","industrial","furnace"],["Planned maintenance","industrial","maint"],["Emergency repairs","repair","repair"]]}
};

/* ===================== OUR WORK — add your real jobs here =====================
   {title:"Furnace + AC replacement", city:"Mississauga", cat:"furnace", brand:"Lennox", date:"2026-09",
    text:"Short description", photos:["photo-url-1.jpg","photo-url-2.jpg"]}
   cat: furnace | ac | hp | water | ah | duct | commercial | industrial                         */
var PROJECTS = typeof PROJECTS_DATA!=='undefined'?PROJECTS_DATA:[];
var WORK_CATS=[["all","All work"],["furnace","Furnaces"],["ac","Air conditioning"],["hp","Heat pumps"],["water","Tankless"],["gh","Garage heaters"],["duct","Ductwork"],["commercial","Commercial"],["industrial","Industrial"]];
var STANDARDS=[
  ["level","Level, secure mounting","Equipment set level on proper pads or stands."],
  ["seal","Sealed duct connections","Joints sealed and taped so the air goes where it should."],
  ["drain","Proper condensate drains","Neatly routed drains and traps — no leaks, no puddles."],
  ["vent","Venting to code","Clearances, slope and terminations done to code."],
  ["test","Tested before we leave","Gas pressure, temperatures and airflow checked."],
  ["label","Labelled & documented","Shut-offs labelled, paperwork and warranty left with you."],
  ["clean","Clean job site","Floors protected, old equipment hauled away."],
  ["walk","Walkthrough","We show you how to use it and what to maintain."]
];

/* ===================== CHAT — answers the assistant can give =====================
   Add your own: {k:["keywords"], a:"answer", svc:"service id to book (optional)"}       */
var CHAT = {
  name:"Jora Assistant",
  hello:"Hi! I'm the Jora assistant for Saskatoon and Saskatchewan — here 24/7. Ask me anything, or pick an option below.",
  chips:[["Book a free visit","book"],["Emergency repair","emergency"],["Rebates","rebate"],["Do you serve my area?","area"],["Prices","price"],["Talk to a person","human"]],
  faq:[
    {k:["emergency","no heat","no hot water","leak","gas smell","smell gas","not working","broken","urgent"],a:"If you smell gas, leave the home and call SaskEnergy's 24-hour emergency line at 1-888-700-0427 or 911 from outside first. For no heat, no cooling, no hot water or leaks, call our 24/7 line at 905-667-2823 — a technician will help right away.",svc:"repair"},
    {k:["price","cost","how much","quote","estimate","expensive","cheap"],a:"Every home is different, so we give a free written quote with equipment, labour and permits included — no surprises. It takes about 2 minutes to request.",svc:null},
    {k:["rebate","grant","incentive","saskenergy","saskpower","greener"],a:"SaskEnergy's Residential Equipment Replacement Rebate pays $650 for a 97%+ furnace, $1,000 for a tankless or condensing water heater, up to $2,000 for a boiler and $100 for an HRV. It must be installed by a TSASK-licensed contractor like us, and you apply within 90 days. We do the paperwork with you.",go:"rebates"},
    {k:["area","serve","city","where","location","come to","saskatoon","warman","martensville","regina","prince albert","moose jaw","sask"],a:"We're based around Saskatoon and serve Warman, Martensville, Osler, Dalmeny, Langham, Delisle, Clavet and the rest of the Saskatoon region — plus Regina, Prince Albert, Moose Jaw and more across Saskatchewan. Type your postal code here and I'll check it.",go:"area"},
    {k:["furnace","heating","heater"],a:"We install and repair Lennox, Carrier, Trane, Goodman and Kepler furnaces — high-efficiency, sized for a Saskatchewan winter. 96%+ models can earn a SaskEnergy rebate.",svc:"furnace",go:"row-furnace"},
    {k:["air condition","ac","cooling","central air"],a:"We install Lennox, Carrier, Trane and Kepler air conditioners, and repair most brands.",svc:"ac",go:"row-ac"},
    {k:["heat pump","heatpump","mini split","mini-split","ductless"],a:"Heat pumps heat and cool in one system. We install cold-climate models from Lennox, TOSOT, Midea and Gree — and many qualify for rebates.",svc:"hp",go:"row-hp"},
    {k:["tankless","water heater","hot water","tank"],a:"We install tankless water heaters from Rinnai, Navien, Rheem, Bradford White and Noritz, plus regular tanks. Rental buyouts too.",svc:"tankless",go:"row-water"},
    {k:["garage","shop heater","unit heater","workshop","hot dawg","modine","big maxx","mr heater","king","infrared","patio heater"],a:"Garage heaters are our specialty in Saskatchewan: Modine Hot Dawg, Mr. Heater Big Maxx, Lennox LF24, King electric and Re-Verber-Ray infrared. We run the gas line, venting and thermostat with a TSASK permit.",svc:"garage",go:"row-gh"},
    {k:["duct","vent","airflow","cold room","hot room"],a:"We design and install ductwork, fix weak airflow and uneven rooms, and do duct sealing.",svc:"duct"},
    {k:["hrv","erv","ventilation","fresh air","stale","condensation"],a:"HRVs and ERVs bring in fresh air while saving heat — great for tight or newer homes. We install, replace and service them.",svc:"hrv"},
    {k:["plumb","drain","toilet","sink","sump"],a:"In Saskatchewan we focus on heating, cooling, gas and hot water — we don't do general plumbing. For a water heater, gas line or boiler, we're your team.",svc:"tankless"},
    {k:["commercial","business","office","restaurant","store","rooftop","rtu","plaza"],a:"We handle commercial HVAC: rooftop units, make-up air, unit heaters, ventilation and maintenance contracts.",svc:"commercial",go:"solutions"},
    {k:["industrial","warehouse","factory","plant","shop heater"],a:"For shops, warehouses, farm buildings and plants we install and service unit heaters, radiant tube heaters, large make-up air units, ventilation and gas lines.",svc:"industrial",go:"solutions"},
    {k:["licen","tsask","insured","certified","red seal","wcb","satcc","gas fitter"],a:"@lic",go:null},
    {k:["maintenance","tune","service","clean","filter"],a:"We do furnace, AC, heat pump, tankless and HRV tune-ups. Yearly maintenance keeps warranties valid and systems efficient.",svc:"maint"},
    {k:["warranty","guarantee"],a:"We register your manufacturer warranty for you. Most brands give 10-year parts coverage when registered on time.",go:null},
    {k:["hours","open","time","weekend","sunday"],a:"Our emergency line is open 24/7 at 905-667-2823, and you can book online any time.",go:null},
    {k:["past work","photos","jobs","installations","portfolio","previous"],a:"You can see our installations on the Our Work page.",go:"work"}
  ]
};
