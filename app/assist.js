/* ======================= JORA ASSISTANT: voice + typed commands, invoice / warranty reader, job sign-off =======================
   Runs inside the admin IIFE (after crm.js). Everything is understood in the browser — no outside AI service. */
I.mic='<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>';
I.spk='<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>';
I.doc='<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h7M9 17h5"/>';
I.spark='<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>';
var AS={open:false,speak:true,rec:null,cards:{},n:0,busy:0};
try{AS.speak=localStorage.getItem("jora_as_speak")!=="0"}catch(e){}

/* ---------- words → facts ---------- */
var NW={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
var NWRE=new RegExp("\\b(?:"+Object.keys(NW).join("|")+"|hundred|thousand)(?:[\\s-]+(?:"+Object.keys(NW).join("|")+"|hundred|thousand|and(?=[\\s-]+(?:"+Object.keys(NW).join("|")+"))))*\\b","gi");
function words2num(s){return s.replace(NWRE,function(m){var tot=0,cur=0;m.toLowerCase().split(/[\s-]+/).forEach(function(w){if(w in NW)cur+=NW[w];else if(w==="hundred")cur=(cur||1)*100;else if(w==="thousand"){tot+=(cur||1)*1000;cur=0}});return String(tot+cur)})}
var WD=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],MO=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
function fixYear(y,m,d,mode){var t=ymd(),s=y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");if(mode==="past"&&s>addDays(t,31))s=(y-1)+s.slice(4);if(mode==="future"&&s<addDays(t,-31))s=(y+1)+s.slice(4);return s}
function parseDate(t,mode){var s=t.toLowerCase(),td=ymd(),y=+td.slice(0,4),m;
  if(/\bday after tomorrow\b/.test(s))return addDays(td,2);if(/\btomorrow\b/.test(s))return addDays(td,1);if(/\byesterday\b/.test(s))return addDays(td,-1);if(/\b(today|tonight|this morning|this afternoon)\b/.test(s))return td;
  if((m=s.match(/\b(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})\b/)))return m[1]+"-"+m[2].padStart(2,"0")+"-"+m[3].padStart(2,"0");
  if((m=s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\b/)))return m[3]?m[3]+"-"+String(MO.indexOf(m[1].slice(0,3))+1).padStart(2,"0")+"-"+m[2].padStart(2,"0"):fixYear(y,MO.indexOf(m[1].slice(0,3))+1,+m[2],mode);
  if((m=s.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?(?:,?\s+(\d{4}))?\b/)))return m[3]?m[3]+"-"+String(MO.indexOf(m[2].slice(0,3))+1).padStart(2,"0")+"-"+m[1].padStart(2,"0"):fixYear(y,MO.indexOf(m[2].slice(0,3))+1,+m[1],mode);
  if((m=s.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/))){var a=+m[1],b=+m[2],yy=+m[3];if(yy<100)yy+=2000;var mm=a,dd=b;if(a>12){dd=a;mm=b}if(mm>=1&&mm<=12&&dd>=1&&dd<=31)return yy+"-"+String(mm).padStart(2,"0")+"-"+String(dd).padStart(2,"0")}
  if((m=s.match(/\b(next|this|on|last|coming)?\s*(sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/))){var wd=WD.indexOf(m[2]),cur=new Date(td+"T12:00:00").getDay(),diff;
    if(m[1]==="last"){diff=(cur-wd+7)%7||7;return addDays(td,-diff)}diff=(wd-cur+7)%7;if(diff===0&&(m[1]==="next"||mode!=="past"))diff=7;if(mode==="past"&&!m[1])diff=diff?diff-7:0;return addDays(td,diff)}
  return ""}
function parseTime(t){var s=t.toLowerCase().replace(/\./g,""),m,h,mi=0;
  if(/\bnoon\b/.test(s))return "12:00";
  if((m=s.match(/\b(\d{1,2})(?::(\d{2})|\s(\d{2}))?\s*(am|pm|a m|p m)\b/))){h=+m[1];mi=+(m[2]||m[3]||0);var pm=/p/.test(m[4]);if(pm&&h<12)h+=12;if(!pm&&h===12)h=0}
  else if((m=s.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\b(?!\s*(?:dollars|\$|%))/))){h=+m[1];mi=+(m[2]||0);if(h>=1&&h<=6)h+=12}
  else if(/\bmorning\b/.test(s))return "09:00";else if(/\bafternoon\b/.test(s))return "13:00";else if(/\bevening\b/.test(s))return "17:00";
  if(h==null||h>23||mi>59)return "";return String(h).padStart(2,"0")+":"+String(mi).padStart(2,"0")}
function parseMoney(t){var m=t.match(/\$\s?(\d[\d,]*(?:\.\d{1,2})?)/)||t.match(/(\d[\d,]*(?:\.\d{1,2})?)\s*(?:dollars|bucks|cad|\$)/i)||t.match(/\b(\d[\d,]*\.\d{2})\b/);
  if(!m){var c=t.replace(/\b\d{1,2}(:\d{2})?\s*(am|pm|a\.m\.|p\.m\.)/gi,"").replace(/\b(19|20)\d{2}\b/g,"").replace(/\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/g,"").replace(/\b\d{1,2}(st|nd|rd|th)\b/gi,"").match(/\b(\d[\d,]*(?:\.\d{1,2})?)\b/);m=c}
  return m?+m[1].replace(/,/g,""):0}
function parsePhone(t){var m=t.match(/(?:\+?1[\s.-]?)?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\b/);return m?m[1]+"-"+m[2]+"-"+m[3]:""}
var CITY={gta:["Toronto","Mississauga","Brampton","Vaughan","Markham","Richmond Hill","Oakville","Burlington","Milton","Hamilton","Etobicoke","Scarborough","North York","East York","York","Pickering","Ajax","Whitby","Oshawa","Newmarket","Aurora","Caledon","Bolton","Georgetown","Halton Hills","Stoney Creek","Woodbridge","Concord","Thornhill","King City","Stouffville","Uxbridge","Bradford","Barrie","Guelph","Cambridge","Kitchener","Waterloo","Grimsby","St. Catharines","Courtice","Bowmanville","Orangeville"],
  sk:["Saskatoon","Regina","Prince Albert","Moose Jaw","Warman","Martensville","Swift Current","Yorkton","North Battleford","Estevan","Weyburn","Lloydminster","Humboldt","Rosthern","Dalmeny","Osler","Langham","Delisle","Clavet","Aberdeen","Vanscoy","Hague"]};
function findCity(t){var s=t.toLowerCase(),best=null;["gta","sk"].forEach(function(r){CITY[r].forEach(function(c){var re=new RegExp("\\b"+c.toLowerCase().replace(/[.]/g,"\\.?")+"\\b");if(re.test(s)&&(!best||c.length>best.c.length))best={c:c,r:r}})});
  if(!best&&/\b(gta|ontario|toronto area)\b/.test(s))best={c:"",r:"gta"};if(!best&&/\b(sask|saskatchewan)\b/.test(s))best={c:"",r:"sk"};return best}
function findAddr(t){var m=t.match(/\b\d{1,6}[ ]+[A-Za-z0-9.' -]{2,40}?[ ](?:street|st|avenue|ave|road|rd|drive|dr|crescent|cres|court|ct|boulevard|blvd|way|lane|ln|place|pl|circle|cir|trail|trl|parkway|pkwy|terrace|gate|line|sideroad|concession|highway|hwy|square|sq|grove|heights|hts)\b\.?/i);return m?m[0].replace(/\b\w/g,function(c){return c.toUpperCase()}):""}
var SVCW=[["hp",/heat ?pump/],["tankless",/tankless|on ?demand/],["water",/water heater|hot water|water tank/],["garage",/garage heater|garage/],["boiler",/boiler|in-?floor|radiant/],["ah",/air handler/],["hrv",/\b(hrv|erv)\b/],["humid",/humidifier/],["thermo",/thermostat/],["duct",/duct/],["ac",/\b(ac|a\/c|a c|air condition\w*|cooling|central air)\b/],["furnace",/furnace|no heat|heating/],["plumb",/plumb|drain|leak/],["maint",/tune[- ]?up|maintenance|cleaning|inspection|check[- ]?up/],["commercial",/commercial|rooftop|rtu/],["repair",/repair|fix|broken|not working|service call/]];
function findSvc(t){var s=t.toLowerCase();for(var i=0;i<SVCW.length;i++)if(SVCW[i][1].test(s))return SVCW[i][0];return ""}
var BRANDS=["Lennox","Carrier","Trane","Goodman","Daikin","Rheem","Ruud","York","Amana","Bryant","Napoleon","KeepRite","Keeprite","Payne","Tempstar","Heil","Mitsubishi","Fujitsu","LG","Samsung","Gree","Midea","Bosch","Navien","Noritz","Rinnai","A.O. Smith","Bradford White","Giant","Rheem","Modine","Reznor","Kepler","AirMax","Ecobee","Honeywell","Nest","Aprilaire","Lifebreath","Venmar","Broan","Viessmann","IBC","Weil-McLain","Dettson","Olsen","Luxaire","Coleman","Frigidaire","Armstrong","Ducane","Comfortmaker","Arcoaire","Haier","Pioneer","Senville","Moovair","MrCool"];
function findBrand(t){for(var i=0;i<BRANDS.length;i++)if(new RegExp("\\b"+BRANDS[i].replace(/\./g,"\\.")+"\\b","i").test(t))return BRANDS[i];return ""}
function techIn(t,skip){var s=" "+t.toLowerCase().replace(skip?skip.toLowerCase():"\u0000"," ")+" ",best=null;S.team.filter(function(x){return !x.disabled}).forEach(function(x){var n=(x.name||x._id).toLowerCase(),f=n.split(/\s+/)[0];
  if(s.indexOf(" "+n+" ")>-1||s.indexOf(" "+n+"'s ")>-1){if(!best||best.s<2)best={x:x,s:2}}else if(f.length>1&&new RegExp("\\b"+f.replace(/[^a-z0-9]/g,"")+"\\b").test(s)&&!best)best={x:x,s:1}});
  if(!best&&/\b(me|myself)\b/.test(s)&&/\b(assign|send|give|to)\b/.test(s))return {_id:myEm(),name:S.user.displayName||myEm()};return best?best.x:null}
var STOP=/^(today|tomorrow|tonight|at|on|in|to|with|for|phone|number|job|a|an|the|and|install|installation|replace|repair|service|next|this|monday|tuesday|wednesday|thursday|friday|saturday|sunday|morning|afternoon|evening|address|at|from|by|assign|send|his|her|their|is|was|who|lives|living|located|customer|new|furnace|ac|heat|water|garage|boiler|tune|maintenance|\d.*)$/i;
function nameAfter(t,re){var m=t.match(re);if(!m)return "";var w=t.slice(m.index+m[0].length).trim().split(/\s+/),out=[];for(var i=0;i<w.length&&out.length<4;i++){var x=w[i].replace(/[,.;:!?]+$/,"");if(STOP.test(x)||findCity(x))break;out.push(x);if(/[,.;]$/.test(w[i]))break}
  return out.join(" ").replace(/\b\w/g,function(c){return c.toUpperCase()})}
function findJob(t,opts){opts=opts||{};var s=t.toLowerCase(),td=ymd(),best=null,pool=opts.pool||S.jobs;
  pool.forEach(function(j){var c=j.customer||{},toks=(cname(c)+" "+(c.address||"")).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2&&!/^(customer|street|road|avenue|drive|main|unit|north|south|east|west|crescent|court|boulevard|lane|place|way|the|and|\d+)$/.test(x)}),sc=0;toks.forEach(function(k){if(new RegExp("\\b"+k+"\\b").test(s))sc+=k.length>3?2:1});
    (j.serials||[]).forEach(function(x){if(x.serial&&s.indexOf(x.serial.toLowerCase())>-1)sc+=6});if(!sc)return;
    var dd=Math.abs(new Date(j.date+"T12:00:00")-new Date(td+"T12:00:00"))/864e5;sc+=Math.max(0,2-dd/15)+(j.status!=="done"&&j.status!=="cancelled"&&!opts.done?1:0);if(!best||sc>best.s)best={j:j,s:sc}});
  return best&&best.s>=2?best.j:null}

/* ---------- money questions ---------- */
function periodFrom(s){return /\blast month\b/.test(s)?"last":/\b(this|the) year\b|\byear to date\b|\bytd\b/.test(s)?"ytd":/\blast (12|twelve) months\b|\bpast year\b/.test(s)?"12m":/\b(last|past) (3|three) months\b|\bquarter\b/.test(s)?"3m":/\ball time\b|\bever\b|\btotal\b/.test(s)?"all":"month"}
function regionFrom(s){return /\b(sask|saskatchewan|saskatoon|regina)\b/.test(s)?"sk":/\b(gta|toronto|ontario|mississauga)\b/.test(s)?"gta":"all"}
function withRegion(r,f){var o=S.region;S.region=r;try{return f()}finally{S.region=o}}

/* ======================= THE BRAIN ======================= */
function interpret(raw){var t=words2num(raw).replace(/\s+/g," ").trim(),s=t.toLowerCase(),fin=can("finance"),tech=isTechRole();
  /* technician (or anyone inside "My jobs") */
  var cur=S.edit&&S.edit.kind==="tjob"?S.jobs.find(function(x){return x._id===S.edit.id}):null;
  if(cur){if(/\b(on (my|the) way|leaving now|heading (there|out|over))\b/.test(s))return statusCard(cur,"on-the-way");
    if(/\b(start(ing)?( the)? job|i'?m (here|there|on site)|arrived|begin)\b/.test(s))return statusCard(cur,"in-progress");
    if(/\b(job (is )?(done|finished|complete)|finished|all done|completed)\b/.test(s))return {say:"Great — the customer signs on the screen to finish the job.",run:function(){openSign(cur._id)}};
    var nm=t.match(/^(?:add (?:a )?)?note[:,]?\s+(.+)$/i)||t.match(/^(?:write|add)\s+(.+)$/i);if(nm)return {say:"Add this note to the job?",card:{kind:"note",title:"Technician note",fields:[["text","Note","textarea",nm[1]]],job:cur._id,go:"Add note"}};
    if(/\bcall\b/.test(s)&&(cur.customer||{}).phone){return {say:"Calling "+cname(cur.customer)+".",run:function(){location.href="tel:"+digits(cur.customer.phone)}}}
    if(/\b(directions|navigate|map)\b/.test(s)){var a=[cur.customer.address,cur.customer.city].filter(Boolean).join(", ");return {say:"Opening directions.",html:'<a class="btn sm" href="'+maps(a)+'" target="_blank" rel="noopener">'+ic("map")+'Open directions</a>'}}}
  if(tech){if(/\b(my jobs|today|tomorrow|schedule)\b/.test(s)){var d0=parseDate(s,"future")||ymd(),L0=jobsMine().filter(function(j){return j.date===d0&&j.status!=="cancelled"}).sort(function(a,b){return (a.time||"").localeCompare(b.time||"")});
      return {say:L0.length?"You have "+L0.length+" job"+(L0.length>1?"s":"")+" "+(d0===ymd()?"today":nice(d0))+": "+L0.map(function(j){return t12(j.time)+", "+cname(j.customer)+(j.customer&&j.customer.city?" in "+j.customer.city:"")}).join("; ")+".":"No jobs "+(d0===ymd()?"today":"on "+nice(d0))+"."}}
    var jt=findJob(s,{pool:jobsMine()});if(jt&&/\b(open|show|start|go)\b/.test(s))return {say:"Opening "+cname(jt.customer)+"'s job.",run:function(){S.tab="my";S.edit={kind:"tjob",id:jt._id};render();loadPhotos(jt._id)}};
    return {say:"Open a job first, then say “I'm on my way”, “start the job”, “job finished” or “note: …”. You can also scan a warranty card or invoice with the document button."}}
  /* navigation */
  var NAVW=[["finance","fin"],["expenses","fin","exp"],["monthly bills","fin","rec"],["bills","fin","rec"],["profit split","fin","split"],["personal","fin","pers"],["price list","fin","rates"],["rates","fin","rates"],["company details","fin","co"],["calendar","cal"],["technicians","techs"],["dispatch","techs"],["reports","rep"],["requests","req"],["quotations","quote"],["quotes","quote"],["customers","cust"],["jobs","jobs"],["team","team"],["today","today"],["products","prod"]];
  if(/^(open|show|go to|take me to|show me)\b/.test(s)&&!/\b(how|what|who)\b/.test(s)){for(var i=0;i<NAVW.length;i++)if(s.indexOf(NAVW[i][0])>-1&&(s.replace(/^(open|show me|show|go to|take me to)\s+(the\s+)?/,"").length<=NAVW[i][0].length+12)){var nv=NAVW[i];
    var perm=(NAV.find(function(x){return x[1]===nv[1]})||[])[3];if(perm&&!can(perm))break;return {say:"Opening "+nv[0]+".",run:function(){S.tab=nv[1];S.edit=null;S.view=null;if(nv[2])S.ft=nv[2];render();scrollTo(0,0)}}}}
  /* questions */
  if(/^(how|what|who|which|when|do we|did we|are there|is there|list|tell me)\b|\?$/.test(s)){
    if(/\b(profit|revenue|sales|income|made|make|earn|expenses?|spent|spend|costs?|margin)\b/.test(s)){if(!fin)return {say:"Only the owners can see money figures."};
      var P=periodFrom(s),R=prange(P),rg=regionFrom(s);var res=withRegion(rg,function(){var a=sumIn(revLines(),R.a,R.b),b=sumIn(expLines(),R.a,R.b);return {r:a,e:b}});
      var where=rg==="all"?"":" in "+RNAME[rg];return {say:R.label+where+": revenue "+kf(res.r)+", expenses "+kf(res.e)+", profit "+kf(res.r-res.e)+".",html:'<div class="asfig"><span><b>'+money(res.r)+'</b>Revenue</span><span><b>'+money(res.e)+'</b>Expenses</span><span><b>'+money(res.r-res.e)+'</b>Profit</span></div><button class="lnk" data-asnav="fin">Open Finance</button>'}}
    if(/\b(owe|pay back|paid back|reimburse)\b/.test(s)&&fin){var ow=owedList(),by={};ow.forEach(function(x){by[x.paidBy]=(by[x.paidBy]||0)+x.amount});var ks=Object.keys(by);return {say:ks.length?"To pay back: "+ks.map(function(k){return k+" "+kf(by[k])}).join(", ")+".":"Nothing to pay back right now."}}
    if(/\b(free|available|not busy)\b/.test(s)){var d1=parseDate(s,"future")||ymd(),fr=techs().filter(function(x){return !S.jobs.some(function(j){return j.assignedEmail===x._id&&j.date===d1&&j.status!=="cancelled"})});return {say:fr.length?"Free "+(d1===ymd()?"today":"on "+nice(d1))+": "+fr.map(function(x){return x.name||x._id}).join(", ")+".":"Every technician has at least one job "+(d1===ymd()?"today":"on "+nice(d1))+"."}}
    if(/\b(unassigned|not assigned|no technician|without a technician)\b/.test(s)){var ua=S.jobs.filter(function(j){return j.date>=ymd()&&!j.assignedEmail&&j.status!=="cancelled"&&j.status!=="done"});return {say:ua.length?ua.length+" upcoming job"+(ua.length>1?"s have":" has")+" no technician.":"Every upcoming job has a technician.",html:ua.length?'<button class="lnk" data-asnav="techs">Open Technicians to send them</button>':""}}
    if(/\b(requests?|leads?)\b/.test(s)){var nr=S.req.filter(function(r){return (r.status||"new")==="new"});return {say:nr.length?nr.length+" new request"+(nr.length>1?"s":"")+" waiting for a reply.":"No new requests.",html:nr.length?'<button class="lnk" data-asnav="req">Open Requests</button>':""}}
    if(/\b(jobs?|booked|schedule|on today|appointments?)\b/.test(s)){var d2=parseDate(s,"future")||ymd(),tk=techIn(s),L2=S.jobs.filter(function(j){return j.date===d2&&j.status!=="cancelled"&&(!tk||j.assignedEmail===tk._id)}).sort(function(a,b){return (a.time||"").localeCompare(b.time||"")});
      var when=d2===ymd()?"today":d2===addDays(ymd(),1)?"tomorrow":"on "+nice(d2);
      return {say:(L2.length?L2.length+" job"+(L2.length>1?"s":"")+" "+when+(tk?" for "+(tk.name||tk._id):"")+". ":"No jobs "+when+(tk?" for "+(tk.name||tk._id):"")+".")+L2.slice(0,6).map(function(j){return t12(j.time)+" "+cname(j.customer)+" — "+(tname(j.assignedEmail)||"no technician")}).join(". "),
        html:L2.length?'<div class="asjobs">'+L2.map(function(j){return '<button class="mj" style="--c:'+jcol(j.status)+'" data-j="'+esc(j._id)+'"><b>'+t12(j.time)+'</b> '+esc(cname(j.customer))+' · '+esc(tname(j.assignedEmail)||"no tech")+'</button>'}).join("")+'</div>':""}}}
  /* personal money */
  if(fin&&/\b(personal|draw|took out|withdrew)\b/.test(s)&&parseMoney(t)){var who=partners().find(function(n){return new RegExp("\\b"+n.toLowerCase()+"\\b").test(s)})||partners()[0];
    return {say:"Add this personal expense?",card:{kind:"pers",title:"Personal (not a company expense)",fields:[["date","Date","date",parseDate(s,"past")||ymd()],["amount","Amount ($)","number",parseMoney(t)],["who","Who","select",who,partners()],["cat","Type","select",/draw|took out|withdrew|transfer/.test(s)?"Draw / transfer":"Personal purchase",PCAT],["note","Note","text",raw]],go:"Save"}}}
  /* monthly bill */
  if(fin&&/\b(monthly bill|every month|each month|recurring|per month|a month)\b/.test(s)&&parseMoney(t)){var nm2=raw.replace(/\b(add|a|new|monthly|bill|every|each|month|recurring|per|of|for|is|dollars?|\$?\d[\d,.]*)\b/gi," ").replace(/\s+/g," ").trim();
    return {say:"Add this monthly bill?",card:{kind:"rec",title:"Monthly bill",fields:[["name","Name","text",nm2.replace(/\b\w/g,function(c){return c.toUpperCase()})||"Monthly bill"],["amount","Amount / month ($)","number",parseMoney(t)],["cat","Category","select",guessCat(s),EXPCAT],["region","Region","select",regionFrom(s)==="all"?"both":regionFrom(s),[["both","Both regions"],["gta","GTA"],["sk","Saskatchewan"]]]],go:"Add bill"}}}
  /* expense */
  if(fin&&(/\b(expense|spent|spend|paid|bought|purchase|receipt|cost us|fill(ed)? up|gas for)\b/.test(s)||/^add \$?\d/.test(s))&&parseMoney(t)&&!/\b(job for|book|schedule)\b/.test(s)){
    var pb=/\b(i|me|my card)\b/.test(s)&&!/\bcompany\b/.test(s)?(partners().find(function(n){return (S.user.displayName||"").toLowerCase().indexOf(n.toLowerCase())>-1})||""):"";partners().forEach(function(n){if(new RegExp("\\b(by|paid)\\s+"+n.toLowerCase()+"\\b|\\b"+n.toLowerCase()+"\\s+paid\\b").test(s))pb=n});
    var ven=(t.match(/\b(?:at|from)\s+([A-Z][\w&'.-]*(?:\s+[A-Z][\w&'.-]*){0,3})/)||[])[1]||"",jx=findJob(s);
    return {say:"Add this expense"+(jx?" to "+cname(jx.customer)+"'s job":"")+"?",card:{kind:"exp",title:jx?"Job expense — "+esc(cname(jx.customer)):"Company expense",job:jx?jx._id:"",fields:[["date","Date","date",parseDate(s,"past")||ymd()],["amount","Amount ($)","number",parseMoney(t)],["cat","Category","select",guessCat(s+" "+ven),EXPCAT],["vendor","Vendor / what","text",ven||raw.slice(0,60)],["region","Region","select",jx?jx.region:(regionFrom(s)==="all"?"both":regionFrom(s)),[["both","Both regions"],["gta","GTA"],["sk","Saskatchewan"]]],["paidBy","Paid by","select",pb||"Company",["Company"].concat(partners())]],go:"Save expense"}}}
  if(!fin&&/\b(expense|spent|bought|paid)\b/.test(s)&&parseMoney(t)){var jy=findJob(s);if(jy)return {say:"Add this to "+cname(jy.customer)+"'s job?",card:{kind:"exp",title:"Job expense — "+esc(cname(jy.customer)),job:jy._id,fields:[["amount","Amount ($)","number",parseMoney(t)],["cat","Category","select",guessCat(s),EXPCAT],["vendor","What","text",raw.slice(0,60)]],go:"Add to job"}};return {say:"Company expenses are only for the owners. Say which customer's job it was for, and I'll add it to that job."}}
  /* new job */
  if(can("jobs")&&(/\b(new job|book|schedule|create (a )?job|add (a )?job|appointment|set up a job)\b/.test(s)||(/\bjob for\b/.test(s)&&!/\b(done|finished|complete|cancel|assign|send)\b/.test(s)))){
    var cn=nameAfter(t,/\b(?:for|customer( is| name is)?|client)\s+/i),ci=findCity(t),tk2=techIn(t,cn),sv=findSvc(s),br=findBrand(t),d3=parseDate(s,"future")||ymd(),tm=parseTime(s),ph=parsePhone(t),ad=findAddr(t),
      exc=allCustomers().find(function(x){return cn&&x.name&&x.name.toLowerCase()===cn.toLowerCase()})||{};
    var title=(/\b(install|replace|new)\b/.test(s)?"Install ":/\b(repair|fix|broken|no heat|not working)\b/.test(s)?"Repair ":/\b(tune|maint|clean)\b/.test(s)?"Tune-up ":"")+(br?br+" ":"")+(sv?svcName(sv).toLowerCase():"");title=title.trim().replace(/^\w/,function(c){return c.toUpperCase()});
    return {say:"New job"+(cn?" for "+cn:"")+" "+(d3===ymd()?"today":nice(d3))+(tm?" at "+t12(tm):"")+(tk2?", sent to "+(tk2.name||tk2._id):"")+". Check it and save.",card:{kind:"job",title:"New job",fields:[["c.name","Customer","text",cn||exc.name||""],["c.phone","Phone","text",ph||exc.phone||""],["c.address","Address","text",ad||exc.address||""],["c.city","City","text",(ci&&ci.c)||exc.city||""],["title","Job","text",title],["service","Service","select",sv||"other",SVCS],["date","Date","date",d3],["time","Time","time",tm||"09:00"],["region","Region","select",(ci&&ci.r)||exc.region||(S.region==="sk"?"sk":"gta"),[["gta","GTA"],["sk","Saskatchewan"]]],["assignedEmail","Technician","select",tk2?tk2._id:"",[["","— Not assigned —"]].concat(techs().concat(S.team.filter(function(x){return !x.disabled&&techs().indexOf(x)<0})).map(function(x){return [x._id,x.name||x._id]}))],["notes","Notes","textarea",""]],go:"Save job",alt:"Open in the full form"}}}
  /* send / assign a job */
  if(can("jobs")&&/\b(assign|send|give|dispatch|move)\b/.test(s)){var tk3=techIn(s),jb=findJob(s);if(!tk3)return {say:"Which technician? Say for example “send John Smith's job to Ali”."};if(!jb)return {say:"I couldn't find that job. Say the customer's name, for example “send John Smith's job to "+(tk3.name||"Ali").split(" ")[0]+"”."};
    return {say:"Send "+cname(jb.customer)+"'s job on "+nice(jb.date)+" to "+(tk3.name||tk3._id)+"?",card:{kind:"assign",title:esc(jb.title||svcName(jb.service))+" — "+esc(cname(jb.customer))+" · "+nice(jb.date)+" "+t12(jb.time),job:jb._id,fields:[["assignedEmail","Technician","select",tk3._id,techs().concat(S.team.filter(function(x){return !x.disabled&&techs().indexOf(x)<0})).map(function(x){return [x._id,x.name||x._id]})]],go:"Send job"}}}
  /* change a job's status */
  var stw=/\b(cancel(led)?)\b/.test(s)?"cancelled":/\b(done|finished|complete(d)?)\b/.test(s)?"done":/\b(on the way|on their way)\b/.test(s)?"on-the-way":/\b(started|in progress)\b/.test(s)?"in-progress":"";
  if(stw&&can("jobs")){var jc=findJob(s);if(jc)return statusCard(jc,stw);return {say:"Which job? Say the customer's name, for example “mark John Smith's job done”."}}
  return {say:"I didn't catch a command in that. Try one of these:",html:helpChips()}}
function statusCard(j,st){return {say:"Mark "+cname(j.customer)+"'s job as "+st.replace(/-/g," ")+"?",card:{kind:"status",title:esc(j.title||svcName(j.service))+" — "+esc(cname(j.customer))+" · "+nice(j.date),job:j._id,st:st,fields:[],go:st==="done"?"Mark done":st==="cancelled"?"Cancel job":"Update"}}}
function guessCat(s){s=s.toLowerCase();var G=[["Vehicle & fuel",/petro|esso|shell|husky|ultramar|pioneer|chevron|co-?op gas|fuel|gas station|\bgas\b(?! (line|valve|pipe|fitting|furnace|meter|leak))|diesel|oil change|tire|car wash|407|parking|truck|van/],["RingCentral / phone",/ringcentral|ring central|rogers|bell|telus|sasktel|fido|koodo|freedom mobile|phone bill|cell/],["Office rent",/\brent\b|lease|landlord/],["Internet & software",/internet|software|subscription|quickbooks|google workspace|microsoft|adobe|jobber|housecall|servicetitan|website|domain|hosting|hostinger/],["Insurance",/insurance|intact|aviva|wawanesa|sgi/],["Marketing & ads",/google ads|facebook|meta|marketing|advert|flyer|homestars|yelp|kijiji|print/],["Tools & equipment",/tool|milwaukee|dewalt|makita|fieldpiece|vacuum pump|gauge|ladder/],["Equipment purchase",/lennox|carrier|trane|goodman|daikin|rheem|napoleon|keeprite|navien|noritz|furnace|air conditioner|heat pump|unit|condenser|water heater/],["Licences & permits",/permit|licen[cs]e|tssa|esa|hrai|satcc|wsib|wcb/],["Utilities",/hydro|enbridge|saskpower|saskenergy|electric|utility|water bill/],["Meals & travel",/tim hortons|mcdonald|restaurant|meal|lunch|coffee|hotel|flight|airbnb/],["Bank & card fees",/bank fee|interest|card fee|stripe|square fee/],["Accounting & legal",/accountant|bookkeep|lawyer|legal|cpa/],["Subcontractors",/subcontract|helper|electrician|sheet metal/],["Wages & payroll",/payroll|wage|salary|paycheque/],["Materials & parts",/wolseley|emco|home depot|lowe|gescan|master group|ecco|parts|copper|fitting|duct|pipe|wire|filter|refrigerant|r-?410|r-?32|line set|pvc|valve|supplies/]];
  for(var i=0;i<G.length;i++)if(G[i][1].test(s))return G[i][0];return "Materials & parts"}
function helpChips(){var L=isTechRole()?["What are my jobs today?","I'm on my way","Start the job","Note: replaced the igniter","Job finished"]:
  ["New job for John Smith tomorrow at 10 am furnace install in Brampton, send to "+((techs()[0]||{}).name||"Ali").split(" ")[0],"What jobs are on tomorrow?","Who is free on Friday?","Send John Smith's job to "+((techs()[1]||techs()[0]||{}).name||"Sam").split(" ")[0],"Mark John Smith's job done"].concat(can("finance")?["Spent 85 dollars on fuel at Petro-Canada, paid by Hamza","How much profit this month in GTA?","Add monthly bill RingCentral 180","Hamza personal draw 500"]:[]);
  return '<div class="aschips">'+L.map(function(x){return '<button type="button" data-asx="'+esc(x)+'">'+esc(x)+'</button>'}).join("")+'</div>'}

/* ======================= DOCUMENT READER (invoices, receipts, warranties) ======================= */
var OCRW=null,ocrQ={},ocrN=0,PDFL=null;
function ocrImg(blob){if(!OCRW){OCRW=new Worker(ROOT+"app/ocr/ocr.js");OCRW.onmessage=function(e){var q=ocrQ[e.data.id];if(!q)return;delete ocrQ[e.data.id];if(e.data.error)q[1](new Error(e.data.error));else q[0](e.data.text)};OCRW.onerror=function(e){Object.keys(ocrQ).forEach(function(k){ocrQ[k][1](new Error("Reader failed to start"));delete ocrQ[k]});OCRW=null}}
  return blob.arrayBuffer().then(function(buf){return new Promise(function(res,rej){var id=++ocrN;ocrQ[id]=[res,rej];OCRW.postMessage({id:id,img:buf},[buf])})})}
function canvasFrom(src,w,h){var mx=Math.max(w,h),sc=mx>2400?2400/mx:mx<1400?1400/mx:1,c=document.createElement("canvas");c.width=Math.round(w*sc);c.height=Math.round(h*sc);var x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(src,0,0,c.width,c.height);
  var d=x.getImageData(0,0,c.width,c.height),p=d.data;for(var i=0;i<p.length;i+=4){var g=.299*p[i]+.587*p[i+1]+.114*p[i+2];g=g<110?Math.max(0,g*.75):g>170?255:g;p[i]=p[i+1]=p[i+2]=g}x.putImageData(d,0,0);return c}
function toBlob(c,type,q){return new Promise(function(r){c.toBlob(r,type||"image/png",q)})}
function loadImg(file){return new Promise(function(res,rej){var u=URL.createObjectURL(file),im=new Image();im.onload=function(){res(im)};im.onerror=function(){rej(new Error("Couldn't open that picture (try a JPG or PNG)"))};im.src=u})}
function loadPdfLib(){if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);if(PDFL)return PDFL;PDFL=new Promise(function(res,rej){var sc=document.createElement("script");sc.src=ROOT+"app/ocr/pdf.min.js";sc.onload=function(){window.pdfjsLib.GlobalWorkerOptions.workerSrc=ROOT+"app/ocr/pdf.worker.min.js";res(window.pdfjsLib)};sc.onerror=function(){PDFL=null;rej(new Error("PDF reader didn't load"))};document.head.appendChild(sc)});return PDFL}
function readDoc(file,step){var isPdf=/pdf$/i.test(file.type)||/\.pdf$/i.test(file.name);
  if(isPdf)return loadPdfLib().then(function(L){return file.arrayBuffer().then(function(b){return L.getDocument({data:b,isEvalSupported:false}).promise})}).then(function(pdf){var n=Math.min(pdf.numPages,3),texts=[],thumb="",chain=Promise.resolve();
    for(var i=1;i<=n;i++)(function(i){chain=chain.then(function(){return pdf.getPage(i).then(function(pg){var vp1=pg.getViewport({scale:1}),sc=Math.min(2.5,1800/vp1.width),vp=pg.getViewport({scale:sc}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;
      return pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise.then(function(){if(i===1)thumb=c.toDataURL("image/jpeg",.72);return pg.getTextContent()}).then(function(tc){var rows={},txt;tc.items.forEach(function(it){var y=Math.round(it.transform[5]/3);(rows[y]=rows[y]||[]).push(it)});
        txt=Object.keys(rows).sort(function(a,b){return b-a}).map(function(y){return rows[y].sort(function(a,b){return a.transform[4]-b.transform[4]}).map(function(it){return it.str}).join(" ")}).join("\n");
        if(txt.replace(/\s/g,"").length>40){texts.push(txt);return}step("Reading page "+i+" (scanned PDF)…");return toBlob(canvasFrom(c,c.width,c.height)).then(ocrImg).then(function(x){texts.push(x)})})})})})(i);
    return chain.then(function(){return {text:texts.join("\n"),img:thumb}})});
  return loadImg(file).then(function(im){var c=canvasFrom(im,im.naturalWidth,im.naturalHeight),t=document.createElement("canvas"),s=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight));t.width=Math.round(im.naturalWidth*s);t.height=Math.round(im.naturalHeight*s);t.getContext("2d").drawImage(im,0,0,t.width,t.height);
    var thumb=t.toDataURL("image/jpeg",.72);if(thumb.length>900000)thumb=t.toDataURL("image/jpeg",.5);return toBlob(c).then(ocrImg).then(function(x){return {text:x,img:thumb}})})}
var VENDORS=["Wolseley","Emco","Home Depot","Lowe's","Lowes","Gescan","Master Group","Ecco Supply","Sonepar","Sinclair Supply","Carrier Enterprise","Lennox Stores","Lennox Industries","Trane Supply","Johnstone Supply","Refplus","Ainsworth","Rona","Canadian Tire","Costco","Princess Auto","Petro-Canada","Petro Canada","Esso","Shell","Husky","Co-op","Ultramar","Pioneer","RingCentral","Rogers","Bell","Telus","SaskTel","Enbridge","SaskEnergy","SaskPower","Hydro One","Alectra","Intact","Aviva","Wawanesa","SGI","Amazon","Staples","Best Buy","Google","Microsoft","Hostinger","Uline","Grainger","Napa","Partsource","Midland","Desco","Bartle & Gibson","Andrew Sheret","Noble","Bryant"];
function cleanCode(x){return x.replace(/(\d)[Oo]/g,function(m,a){return a+"0"}).replace(/[Oo](\d)/g,function(m,a){return "0"+a}).replace(/(\d)[Il](\d)/g,function(m,a,b){return a+"1"+b}).replace(/[.,;:]+$/,"")}
function parseDoc(text){var L=text.split(/\n/).map(function(x){return x.replace(/\s+/g," ").trim()}).filter(Boolean),all=L.join("\n"),low=all.toLowerCase(),R={text:all};
  var MONEY=/\$?\s?(\d{1,3}(?:[ ,]\d{3})+(?:\.\d{2})|\d+\.\d{2})\b/g,mv=function(l){var a=[],m;MONEY.lastIndex=0;while((m=MONEY.exec(l)))a.push(+m[1].replace(/[ ,]/g,""));return a};
  var lineVal=function(re,ex){for(var i=L.length-1;i>=0;i--)if(re.test(L[i])&&!(ex&&ex.test(L[i]))){var v=mv(L[i]);if(!v.length&&L[i+1])v=mv(L[i+1]);if(v.length)return v[v.length-1]}return 0};
  R.total=lineVal(/\b(grand\s*total|total\s*(due|amount|cad|payable)?|amount\s*(due|paid)|balance\s*(due)?|invoice\s*total|total\b)/i,/sub\s*-?\s*total|total\s*(tax|hst|gst|qty|items|savings|discount)/i);
  if(!R.total){var allm=mv(all);R.total=allm.length?Math.max.apply(null,allm):0}
  R.tax=lineVal(/\b(hst|gst|pst|tax)\b/i,/total\s*(due|amount)|exempt|registration|reg\.?\s*(no|#)|\bbn\b/i);
  R.subtotal=lineVal(/sub\s*-?\s*total/i);
  var m=all.match(/\b(?:invoice|inv|receipt|order|transaction|bill|ref)\.?\s*(?:#|no\.?|number|num)?\s*[:#]?\s*([A-Z0-9][A-Z0-9-]{3,})/i);R.inv=m?m[1]:"";
  var dl=L.find(function(l){return /\bdate\b/i.test(l)&&!/due\s*date|install/i.test(l)&&parseDate(l,"past")});R.date=dl?parseDate(dl,"past"):(parseDate(all,"past")||"");
  R.brand=findBrand(all);R.vendor="";var head=L.slice(0,10).join("\n");VENDORS.some(function(v){if(new RegExp("\\b"+v.replace(/[.'&]/g,"\\$&").replace(/ /g,"[\\s-]?")+"\\b","i").test(head)){R.vendor=v;return true}});
  if(!R.vendor)VENDORS.some(function(v){if(new RegExp("\\b"+v.replace(/[.'&]/g,"\\$&").replace(/ /g,"[\\s-]?")+"\\b","i").test(all)){R.vendor=v;return true}});
  if(!R.vendor&&R.brand)R.vendor=R.brand;
  if(!R.vendor){var fl=L.find(function(l){return /[a-z]{3}/i.test(l)&&!/invoice|receipt|date|page|bill to|sold to|tel|phone|fax|www|http|@/i.test(l)&&l.replace(/[^a-z]/gi,"").length>=4});R.vendor=fl?fl.slice(0,40):""}
  R.brand=findBrand(all);R.units=[];
  var mre=/\b(?:model|m\/n|mod\.?)\s*(?:no\.?|#|number|num)?\s*[:#.\-]?\s*([A-Z0-9][A-Z0-9\-\/]{3,})/gi,sre=/\b(?:serial|s\/n|ser\.)\s*(?:no\.?|#|number|num)?\s*[:#.\-]?\s*([A-Z0-9][A-Z0-9\-]{4,})/gi,mm,models=[],serials=[];
  while((mm=mre.exec(all)))models.push(cleanCode(mm[1]).toUpperCase());while((mm=sre.exec(all)))serials.push(cleanCode(mm[1]).toUpperCase());
  for(var k=0;k<Math.max(models.length,serials.length);k++)R.units.push({item:R.brand||"",model:models[k]||"",serial:serials[k]||""});
  var cl=L.findIndex(function(l){return /\b(bill(ed)?\s*to|sold\s*to|customer(\s*name)?|homeowner|owner(\s*name)?|ship\s*to|registered\s*to|purchaser|end\s*user)\b\s*:?/i.test(l)});
  if(cl>-1){var v=L[cl].replace(/.*\b(bill(ed)?\s*to|sold\s*to|customer(\s*name)?|homeowner|owner(\s*name)?|ship\s*to|registered\s*to|purchaser|end\s*user)\b\s*:?\s*/i,"").trim();if(v.replace(/[^a-z]/gi,"").length<3)v=L[cl+1]||"";R.customer=v.replace(/[^A-Za-z .'-].*$/,"").trim().slice(0,40)}
  R.phone=parsePhone(all.replace(/\b(fax|f)\s*[:.]?\s*[\d\s().-]{10,}/gi,""));
  var pc=all.match(/\b([A-Z]\d[A-Z])\s?(\d[A-Z]\d)\b/i);R.postal=pc?(pc[1]+" "+pc[2]).toUpperCase():"";R.address=findAddr(all);var cy=findCity(all);R.city=cy?cy.c:"";R.region=cy?cy.r:"";
  R.warranty=/warrant|registration|certificate|limited\s+warranty|extended\s+warranty|protection\s+plan/i.test(all);
  var wy=all.match(/\b(\d{1,2})[\s-]*(?:year|yr)s?\b(?=[^\n]{0,40}(warrant|parts|labou?r|heat exchanger|compressor|limited|coverage))/i)||all.match(/\b(\d{1,2})[\s-]*(?:year|yr)s?\s+(?:limited\s+)?warranty/i);R.years=wy?+wy[1]:"";
  var idl=L.find(function(l){return /(install(ation|ed)?|purchase|registration)\s*date/i.test(l)});R.install=idl?parseDate(idl,"past"):"";
  R.kind=R.warranty?"warranty":R.total?"invoice":"document";return R}
function docCard(file,res){var P=parseDoc(res.text),fin=can("finance"),pool=isTechRole()?jobsMine():S.jobs,cur=S.edit&&S.edit.kind==="tjob"?S.edit.id:S.edit&&S.edit.kind==="job"&&!S.edit.data._new?S.edit.data._id:"";
  var jm=cur?pool.find(function(j){return j._id===cur}):findJob([P.customer,P.address,P.text].join(" "),{pool:pool,done:true});
  var jobs=pool.filter(function(j){return j.status!=="cancelled"}).slice().sort(function(a,b){return Math.abs(new Date(a.date)-Date.now())-Math.abs(new Date(b.date)-Date.now())}).slice(0,60);if(jm&&jobs.indexOf(jm)<0)jobs.unshift(jm);
  var jopts=[["","— Don't attach to a job —"]].concat(jobs.map(function(j){return [j._id,nice(j.date)+" · "+cname(j.customer)+" · "+(j.title||svcName(j.service))]}));
  var F=[["kind","This is a","select",P.kind,[["invoice","Supplier invoice / receipt (we paid)"],["warranty","Warranty / registration"],["custinv","Our invoice to a customer"],["document","Other document"]]],
    ["date","Date","date",P.date||ymd()],["vendor","Company on the document","text",P.vendor],["inv","Invoice / reference #","text",P.inv],["amount","Total ($)","number",P.total||""],["tax","Tax in total ($)","number",P.tax||""]];
  if(fin)F.push(["cat","Expense category","select",guessCat(P.text+" "+P.vendor),EXPCAT],["region","Region","select",P.region||(S.region==="sk"?"sk":S.region==="gta"?"gta":"both"),[["both","Both regions"],["gta","GTA"],["sk","Saskatchewan"]]],["paidBy","Paid by","select","Company",["Company"].concat(partners())]);
  F.push(["units","Units: brand / model / serial (one per line)","textarea",P.units.map(function(u){return [u.item,u.model,u.serial].join(" / ")}).join("\n")],["years","Warranty (years)","number",P.years],["customer","Customer on the document","text",P.customer||""],["address","Customer address","text",[P.address,P.city].filter(Boolean).join(", ")],["job","Job","select",jm?jm._id:"",jopts]);
  var acts=[];if(fin)acts.push(["docexp","Save as company expense"]);acts.push(["docjob","Save to the job"]);if(can("jobs"))acts.push(["docnew","Create a job from it"]);
  var what=P.kind==="warranty"?"a warranty"+(P.brand?" for a "+P.brand:"")+(P.units.length?" ("+P.units.length+" serial number"+(P.units.length>1?"s":"")+")":""):P.kind==="invoice"?"an invoice"+(P.vendor?" from "+P.vendor:"")+(P.total?" for "+money(P.total):""):"a document";
  return {say:"I read "+what+(jm?". It looks like it belongs to "+cname(jm.customer)+"'s job":"")+". Check the details and save.",card:{kind:"doc",title:esc(file.name||"Document"),img:res.img,text:P.text,fields:F,acts:acts,P:P}}}

/* ======================= UI ======================= */
function asMount(){if($("#asFab"))return;var b=document.createElement("div");b.innerHTML='<button class="asfab" id="asFab" type="button" aria-label="Open the Jora assistant">'+ic("spark")+'<span>Assistant</span></button>'+
  '<section class="as" id="as" aria-label="Jora assistant" hidden><header><b>'+ic("spark")+'Jora Assistant</b><span><button type="button" class="icon-b" data-asa="spk" title="Speak answers" aria-pressed="'+AS.speak+'">'+ic("spk")+'</button><button type="button" class="icon-b" data-asa="close" aria-label="Close">×</button></span></header>'+
  '<div class="aslog" id="asLog"></div><form class="asf" id="asF"><button type="button" class="asmic" data-asa="mic" aria-label="Talk">'+ic("mic")+'</button><input id="asIn" class="inp" autocomplete="off" placeholder="Say or type what you need…"><button class="btn sm" aria-label="Send">Go</button></form>'+
  '<label class="asdoc">'+ic("doc")+'<span>Scan invoices, receipts or warranties</span><small>Photo or PDF — I\'ll read it and fill everything in</small><input type="file" id="asFile" accept="image/*,application/pdf" multiple hidden></label></section>';
  document.body.appendChild(b);var as=$("#as");
  $("#asFab").onclick=function(){toggleAs(true)};
  as.addEventListener("click",asClick);as.addEventListener("change",function(e){if(e.target.id==="asFile"){var fs=[].slice.call(e.target.files);e.target.value="";fs.reduce(function(p,f){return p.then(function(){return scanFile(f)})},Promise.resolve())}});
  $("#asF").onsubmit=function(e){e.preventDefault();var v=$("#asIn").value.trim();if(!v)return;$("#asIn").value="";handle(v)};
  document.addEventListener("click",function(e){var b=e.target.closest("[data-asnav]");if(b){S.tab=b.dataset.asnav;S.edit=null;render();if(innerWidth<760)toggleAs(false)}})}
function toggleAs(on){var as=$("#as");AS.open=on;as.hidden=!on;$("#asFab").hidden=on;document.body.classList.toggle("as-on",on);
  if(on&&!$("#asLog").children.length)bubble("ai",'<p>Hi '+esc((S.user.displayName||"").split(" ")[0]||"there")+' — tell me what to do, or send me invoices and warranties and I\'ll put everything in for you.</p>'+helpChips());
  if(on&&innerWidth>760)setTimeout(function(){$("#asIn").focus()},50)}
function bubble(who,html){var d=document.createElement("div");d.className="asb "+who;d.innerHTML=html;$("#asLog").appendChild(d);d.scrollIntoView({block:"end",behavior:"smooth"});return d}
function talk(t){if(!AS.speak||!window.speechSynthesis||!t)return;try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t.replace(/—/g,",").replace(/\$/g,"$"));u.lang="en-CA";u.rate=1.05;speechSynthesis.speak(u)}catch(e){}}
function handle(text){bubble("me",esc(text));var r;try{r=interpret(text)}catch(e){console.error(e);r={say:"Something went wrong understanding that — try saying it a different way."}}reply(r)}
function reply(r){var h='<p>'+esc(r.say||"")+'</p>'+(r.html||"")+(r.card?cardHTML(r.card):"");bubble("ai",h);talk(r.say);if(r.run)setTimeout(r.run,350)}
function fieldHTML(f){var k=f[0],l=f[1],ty=f[2],v=f[3]==null?"":f[3],o=f[4];
  if(ty==="select")return '<label class="f"><span>'+l+'</span><select class="inp" name="'+k+'">'+o.map(function(x){var val=Array.isArray(x)?x[0]:x,lab=Array.isArray(x)?x[1]:x;return '<option value="'+esc(val)+'"'+(String(val)===String(v)?" selected":"")+'>'+esc(lab)+'</option>'}).join("")+'</select></label>';
  if(ty==="textarea")return '<label class="f wide"><span>'+l+'</span><textarea class="inp" name="'+k+'" rows="'+(k==="units"?3:2)+'">'+esc(v)+'</textarea></label>';
  return '<label class="f"><span>'+l+'</span><input class="inp" name="'+k+'" type="'+ty+'"'+(ty==="number"?' step="0.01" min="0"':'')+' value="'+esc(v)+'"></label>'}
function cardHTML(c){var id="c"+(++AS.n);AS.cards[id]=c;var acts=c.acts||[["go",c.go]];if(c.alt)acts=acts.concat([["alt",c.alt]]);
  return '<div class="ascard" data-card="'+id+'"><h4>'+c.title+'</h4>'+(c.img?'<img class="asimg" src="'+c.img+'" alt="">':'')+'<div class="asgrid">'+c.fields.map(fieldHTML).join("")+'</div>'+
   (c.text?'<details><summary>Text I read</summary><pre>'+esc(c.text.slice(0,4000))+'</pre></details>':'')+
   '<div class="acts">'+acts.map(function(a,i){return '<button type="button" class="btn sm'+(i?" g":"")+'" data-asgo="'+a[0]+'">'+esc(a[1])+'</button>'}).join("")+'<button type="button" class="btn sm g" data-asgo="x">Dismiss</button></div></div>'}
function asClick(e){var b=e.target.closest("[data-asa],[data-asx],[data-asgo]");if(!b)return;
  if(b.dataset.asx){handle(b.dataset.asx);return}
  var a=b.dataset.asa;if(a==="close"){toggleAs(false);if(AS.rec)AS.rec.stop();return}
  if(a==="spk"){AS.speak=!AS.speak;b.setAttribute("aria-pressed",AS.speak);try{localStorage.setItem("jora_as_speak",AS.speak?"1":"0")}catch(x){}if(!AS.speak&&window.speechSynthesis)speechSynthesis.cancel();toast(AS.speak?"I'll read answers out loud":"Answers are silent now");return}
  if(a==="mic"){listen();return}
  if(b.dataset.asgo){var el=b.closest("[data-card]"),c=AS.cards[el.dataset.card],v={};$$("[name]",el).forEach(function(x){v[x.name]=x.value.trim()});
    if(b.dataset.asgo==="x"){el.remove();return}b.disabled=true;var fin=function(msg){el.classList.add("done");el.innerHTML='<p class="ok">✓ '+esc(msg)+'</p>';talk(msg)};
    run(c,b.dataset.asgo,v).then(function(m){if(m)fin(m)}).catch(function(err){b.disabled=false;fail(err)})}}
function listen(){var SR=window.SpeechRecognition||window.webkitSpeechRecognition,mic=$("#as .asmic");
  if(!SR){reply({say:"Voice isn't available in this browser. Use Chrome, Edge or Safari — or type instead."});return}
  if(AS.rec){AS.rec.stop();return}if(window.speechSynthesis)speechSynthesis.cancel();
  var r=new SR(),got="";r.lang="en-CA";r.interimResults=true;r.continuous=false;r.maxAlternatives=1;
  r.onresult=function(e){got=[].map.call(e.results,function(x){return x[0].transcript}).join("");$("#asIn").value=got};
  r.onerror=function(e){if(e.error==="not-allowed"||e.error==="service-not-allowed")reply({say:"I can't hear you — allow the microphone for this site in your browser settings, then try again."});else if(e.error==="no-speech")toast("I didn't hear anything — tap the mic and speak");};
  r.onend=function(){AS.rec=null;mic.classList.remove("on");var v=got.trim();if(v){$("#asIn").value="";handle(v)}};
  try{r.start();AS.rec=r;mic.classList.add("on");toast("Listening…")}catch(x){AS.rec=null}}
function scanFile(f){var st=bubble("ai",'<p class="mut">Reading <b>'+esc(f.name)+'</b>…'+(OCRW?"":" (the first one takes a few seconds while the reader loads)")+'</p>'),step=function(m){st.querySelector("p").textContent=m};
  bubble("me",'📄 '+esc(f.name));return readDoc(f,step).then(function(res){st.remove();if(!res.text||res.text.replace(/\s/g,"").length<8){reply({say:"I couldn't read any text on "+f.name+". Try a sharper, straight-on photo in good light."});return}reply(docCard(f,res))})
   .catch(function(e){st.remove();console.error(e);reply({say:"I couldn't read "+f.name+": "+(e.message||e)})})}

/* ---------- doing the work ---------- */
function units(v){return String(v||"").split(/\n/).map(function(l){var p=l.split(/\s*\/\s*/);return {item:(p[0]||"").trim(),model:(p[1]||"").trim(),serial:(p[2]||"").trim()}}).filter(function(u){return u.model||u.serial})}
function jobRef(id){return S.jobs.find(function(x){return x._id===id})}
function saveDocPhoto(j,img,caption){if(!img)return Promise.resolve();return db.collection("jobPhotos").add({jobId:j._id,tech:j.assignedEmail||"",region:j.region||"",kind:"doc",caption:caption,data:img,by:photoBy(),at:J.now()})}
function run(c,act,v){var k=c.kind;
  if(k==="status"){stampLoc(c.job,c.st);var u={status:c.st,updatedAt:J.now(),updatedBy:stamp()};if(c.st==="done")u.doneAt=J.now();if(c.st==="on-the-way")u.onWayAt=J.now();if(c.st==="in-progress")u.startedAt=J.now();return db.collection("jobs").doc(c.job).update(u).then(function(){return "Job marked "+c.st.replace(/-/g," ")})}
  if(k==="assign"){var tn=tname(v.assignedEmail);return db.collection("jobs").doc(c.job).update({assignedEmail:v.assignedEmail,assignedTo:tn,updatedAt:J.now()}).then(function(){return "Sent to "+tn+" — it's in their My jobs now"})}
  if(k==="note"){var j0=jobRef(c.job);var nt=((j0.techNotes||"").trim()+"\n"+v.text).trim();return db.collection("jobs").doc(c.job).update({techNotes:nt,updatedAt:J.now(),updatedBy:stamp()}).then(function(){if(S.edit&&S.edit.kind==="tjob"){render();loadPhotos(c.job)}return "Note added"})}
  if(k==="pers")return db.collection("personal").doc(J.rid(20)).set({date:v.date,amount:num(v.amount),who:v.who,cat:v.cat,note:v.note,by:stamp(),at:J.now()}).then(function(){return "Saved "+money(v.amount)+" for "+v.who})
  if(k==="rec")return db.collection("recurring").doc(J.rid(14)).set({name:v.name,amount:num(v.amount),day:1,cat:v.cat,region:v.region,paidBy:"Company",active:true,at:J.now(),by:stamp()}).then(function(){return "Monthly bill added: "+v.name})
  if(k==="exp"){if(!num(v.amount))return Promise.reject(new Error("Enter the amount"));
    if(c.job){var j1=jobRef(c.job),L=(j1.jobExp||[]).concat([{id:J.rid(8),desc:v.vendor||"Expense",cat:v.cat,amount:num(v.amount),paidBy:v.paidBy||"Company",repaid:false,by:stamp(),at:J.now()}]);return db.collection("jobs").doc(c.job).update({jobExp:L,updatedAt:J.now(),updatedBy:stamp()}).then(function(){return money(v.amount)+" added to "+cname(j1.customer)+"'s job"})}
    return db.collection("expenses").doc(J.rid(20)).set({date:v.date,amount:num(v.amount),cat:v.cat,region:v.region,vendor:v.vendor,paidBy:v.paidBy,note:"",repaid:false,by:stamp(),at:J.now()}).then(function(){return "Expense saved: "+money(v.amount)+" — "+v.cat})}
  if(k==="job"){var seed={title:v.title,service:v.service,date:v.date,time:v.time,region:v.region,notes:v.notes,assignedEmail:v.assignedEmail,assignedTo:v.assignedEmail?tname(v.assignedEmail):"",customer:{name:v["c.name"],phone:v["c.phone"],email:"",address:v["c.address"],city:v["c.city"],postal:""}};
    if(act==="alt"){S.tab="jobs";S.edit={kind:"job",data:newJob(seed)};render();scrollTo(0,0);if(innerWidth<760)toggleAs(false);return Promise.resolve("Opened in the job form")}
    if(!seed.customer.name)return Promise.reject(new Error("Add the customer's name"));var nj=newJob(seed),d=JSON.parse(JSON.stringify(nj));delete d._new;delete d._id;d.createdAt=J.now();d.createdBy=stamp();d.updatedAt=J.now();
    return db.collection("jobs").doc(nj._id).set(d).then(function(){upsertCustomer(Object.assign({region:nj.region},nj.customer)).catch(function(){});return "Job saved for "+nice(v.date)+(v.assignedEmail?" and sent to "+tname(v.assignedEmail):"")})}
  if(k==="doc"){var U=units(v.units),cap=(v.kind==="warranty"?"Warranty":v.kind==="custinv"?"Invoice to customer":v.kind==="invoice"?"Supplier invoice":"Document")+(v.vendor?" — "+v.vendor:"")+(v.inv?" #"+v.inv:"")+(v.years?" · "+v.years+"-year":"")+(v.date?" · "+v.date:"");
    if(act==="docexp"){if(!num(v.amount))return Promise.reject(new Error("Enter the total"));var eid=J.rid(20);
      return db.collection("expenses").doc(eid).set({date:v.date,amount:num(v.amount),tax:num(v.tax),cat:v.cat,region:v.region,vendor:v.vendor,note:(v.inv?"Invoice #"+v.inv:"")+(v.job?" · job: "+cname((jobRef(v.job)||{}).customer):""),paidBy:v.paidBy,repaid:false,hasReceipt:!!c.img,jobId:v.job||"",supplierId:(typeof supOf==="function"&&(supOf(v.vendor,"")||{})._id)||"",invNo:v.inv||"",by:stamp(),at:J.now()})
        .then(function(){return c.img?db.collection("receipts").doc(eid).set({data:c.img,at:J.now(),by:stamp()}):null}).then(function(){var j=v.job&&jobRef(v.job);return j?attachToJob(j,v,U,cap,false):null}).then(function(){return "Saved as an expense: "+money(v.amount)+(v.job?" (and filed on the job)":"")})}
    if(act==="docjob"){var j=jobRef(v.job);if(!j)return Promise.reject(new Error("Pick the job first"));return attachToJob(j,v,U,cap,v.kind==="invoice").then(function(){return "Filed on "+cname(j.customer)+"'s job"+(U.length?" with "+U.length+" serial number"+(U.length>1?"s":""):"")})}
    if(act==="docnew"){var cust=(v.customer||"").trim(),ad=v.address.split(/,\s*/);S.tab="jobs";S.edit={kind:"job",data:newJob({title:(v.kind==="warranty"?"Warranty — ":"")+(c.P.brand||"")+" "+(U[0]?U[0].model:""),date:v.date||ymd(),region:c.P.region||"gta",status:v.kind==="custinv"?"done":"scheduled",amount:v.kind==="custinv"?num(v.amount):"",serials:U,customer:{name:cust,phone:c.P.phone||"",email:"",address:ad[0]||"",city:ad[1]||c.P.city||"",postal:c.P.postal||""},_doc:{img:c.img,cap:cap}})};
      render();scrollTo(0,0);if(innerWidth<760)toggleAs(false);return Promise.resolve("Opened a new job — check it and press Save job (the document is filed on it when you save)")}}
  return Promise.resolve("")}
function attachToJob(j,v,U,cap,asExp){var upd={updatedAt:J.now(),updatedBy:stamp()},ser=(j.serials||[]).slice();
  U.forEach(function(u){if(!ser.some(function(x){return x.serial&&x.serial===u.serial&&x.model===u.model}))ser.push(u)});if(U.length)upd.serials=ser;
  if(v.kind==="warranty"&&v.years&&!isTechRole()){upd.warrantyYears=num(v.years);upd.warrantyDoc=cap}
  if(asExp&&num(v.amount))upd.jobExp=(j.jobExp||[]).concat([{id:J.rid(8),desc:(v.vendor||"Supplier")+(v.inv?" #"+v.inv:""),cat:v.cat||"Materials & parts",amount:num(v.amount),paidBy:v.paidBy||"Company",repaid:false,by:stamp(),at:J.now()}]);
  if(isTechRole()){delete upd.warrantyYears;delete upd.warrantyDoc}
  return db.collection("jobs").doc(j._id).update(upd).then(function(){return saveDocPhoto(j,AS.lastImg=cardImg(v,j),cap)}).then(function(){loadPhotos(j._id)})}
function cardImg(v,j){var el=[].slice.call(document.querySelectorAll("#as .ascard")).find(function(x){var s=x.querySelector("[name=job]");return s&&s.value===j._id&&!x.classList.contains("done")}),c=el&&AS.cards[el.dataset.card];return c?c.img:""}

/* ======================= JOB SIGN-OFF (customer signs to finish) ======================= */
function openSign(jid){var j=jobRef(jid);if(!j)return;var hasMain=(S.ph[jid]||[]).some(function(p){return p.kind==="main"});
  var d=document.createElement("div");d.className="sigm";d.innerHTML='<div class="sigbox"><h3>Finish the job</h3><p class="mut" style="margin:-4px 0 12px">'+esc(cname(j.customer))+' — '+esc(j.title||svcName(j.service))+'</p>'+
   (hasMain?'':'<p class="warnm">No main photo yet. You can still finish, but please add the front photo of the finished job.</p>')+
   '<label class="f"><span>Customer name</span><input class="inp" id="sigName" value="'+esc(cname(j.customer)==="—"?"":cname(j.customer))+'"></label>'+
   '<p class="lbl">Customer signature — “The work is complete”</p><canvas id="sigPad" width="900" height="300"></canvas><div class="acts" style="margin:8px 0 12px"><button type="button" class="lnk" id="sigClr">Clear</button></div>'+
   '<label class="chk"><input type="checkbox" id="sigNo"> Customer isn\'t available to sign</label>'+
   '<div class="acts"><button type="button" class="btn ok" id="sigOk">Finish job</button><button type="button" class="btn g" id="sigX">Not yet</button></div></div>';
  document.body.appendChild(d);var c=$("#sigPad"),x=c.getContext("2d"),down=false,drew=false;x.lineWidth=3.2;x.lineCap="round";x.lineJoin="round";x.strokeStyle="#15171b";
  var pos=function(e){var r=c.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return [(p.clientX-r.left)*c.width/r.width,(p.clientY-r.top)*c.height/r.height]};
  var st=function(e){e.preventDefault();down=true;var p=pos(e);x.beginPath();x.moveTo(p[0],p[1])},mv=function(e){if(!down)return;e.preventDefault();var p=pos(e);x.lineTo(p[0],p[1]);x.stroke();drew=true},en=function(){down=false};
  c.addEventListener("pointerdown",st);c.addEventListener("pointermove",mv);addEventListener("pointerup",en);c.style.touchAction="none";
  $("#sigClr").onclick=function(){x.clearRect(0,0,c.width,c.height);drew=false};$("#sigX").onclick=function(){d.remove()};
  $("#sigOk").onclick=function(){var no=$("#sigNo").checked,nm=$("#sigName").value.trim();if(!no&&!drew){toast("Ask the customer to sign, or tick “isn't available”");return}this.disabled=true;
    var t=document.createElement("canvas");t.width=600;t.height=200;var tx=t.getContext("2d");tx.fillStyle="#fff";tx.fillRect(0,0,600,200);tx.drawImage(c,0,0,600,200);
    var step=no?Promise.resolve():db.collection("jobPhotos").add({jobId:jid,tech:j.assignedEmail||"",region:j.region||"",kind:"sign",caption:"Signed by "+(nm||"customer"),data:t.toDataURL("image/png"),by:photoBy(),at:J.now()});
    step.then(function(){return db.collection("jobs").doc(jid).update({status:"done",doneAt:J.now(),updatedAt:J.now(),updatedBy:stamp(),signedBy:no?"":nm,signedAt:no?"":J.now(),noSignature:no})})
     .then(function(){d.remove();toast("Job finished — thank you!");talk("Job finished. Thank you!");stampLoc(jid,"done");render();loadPhotos(jid);askReview(j)}).catch(function(e){fail(e);$("#sigOk").disabled=false})}}
function timeline(j){var on=j.onWayAt,st=j.startedAt,dn=j.status==="done"?j.doneAt:"",dur=function(a,b){if(!a||!b)return "";var m=Math.round((new Date(b)-new Date(a))/6e4);return m<0?"":m<60?m+" min":Math.floor(m/60)+" h "+String(m%60).padStart(2,"0")+" min"};
  if(!on&&!st&&!dn)return "";
  return '<div class="tl"><span class="'+(on?"d":"")+'"><b>On the way</b>'+(on?niceT(on):"—")+(j.onWayLoc?" "+locLink(j.onWayLoc):"")+'</span><span class="'+(st?"d":"")+'"><b>Started</b>'+(st?niceT(st):"—")+(j.startLoc?" "+locLink(j.startLoc):"")+(dur(on,st)?'<small>travel '+dur(on,st)+'</small>':'')+'</span><span class="'+(dn?"d":"")+'"><b>Finished</b>'+(dn?niceT(dn):"—")+(j.doneLoc?" "+locLink(j.doneLoc):"")+(dur(st,dn)?'<small>on site '+dur(st,dn)+'</small>':'')+'</span>'+
   (j.status==="done"?'<span class="d"><b>Signed</b>'+(j.signedBy?esc(j.signedBy):j.noSignature?"Customer not available":"—")+'</span>':'')+'</div>'}

function askReview(j){var u=reviewUrl(j.region),c=j.customer||{};if(!u||!c.phone&&!c.email)return;var body="Hi "+first(c)+", thank you for choosing Jora Mechanical Systems! If you're happy with the work, would you leave us a quick Google review? "+u+" It really helps a local business.";
  var d=document.createElement("div");d.className="sigm";d.innerHTML='<div class="sigbox"><h3>Ask for a review?</h3><p class="mut">The customer is happiest right now. Send our Google review link while you\'re still there.</p>'+sendBtns(c,"How did we do?",body)+'<div class="acts" style="margin-top:12px"><button class="btn g" id="rvX">Not now</button></div></div>';
  document.body.appendChild(d);d.addEventListener("click",function(e){var cp=e.target.closest("[data-copytxt]");if(cp){try{navigator.clipboard.writeText(cp.dataset.copytxt);toast("Copied")}catch(x){}return}var a=e.target.closest("a");if(a)db.collection("jobs").doc(j._id).update({reviewAskedAt:ymd()}).catch(function(){});if(a||e.target.id==="rvX")setTimeout(function(){d.remove()},300)})}
