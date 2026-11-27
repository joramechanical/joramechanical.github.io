
/* ======================= SOLUTIONS (home / commercial / industrial) ======================= */
function fan(cx,cy,r,dur){return '<g transform="translate('+cx+' '+cy+')"><circle r="'+r+'" fill="#1b1b1b"/><g class="spin" style="animation-duration:'+(dur||1.2)+'s">'+[0,120,240].map(function(a){return '<path d="M0 0 C'+(r*.25)+' '+(-r*.3)+' '+(r*.2)+' '+(-r*.8)+' 0 '+(-r*.85)+' C'+(-r*.25)+' '+(-r*.6)+' '+(-r*.2)+' '+(-r*.2)+' 0 0z" fill="#9aa0a6" transform="rotate('+a+')"/>'}).join("")+'</g><circle r="'+(r*.16)+'" fill="#F96302"/><circle r="'+r+'" fill="none" stroke="#3a3a3a" stroke-width="2"/></g>'}
function flow(x,y,w,col,n){var s="";for(var i=0;i<(n||3);i++)s+='<path class="flow" style="animation-delay:'+(i*.35)+'s" d="M'+x+' '+(y+i*12)+' q'+(w/4)+' -8 '+(w/2)+' 0 t'+(w/2)+' 0" stroke="'+col+'" stroke-width="3" fill="none" stroke-linecap="round"/>';return s}
function solArt(k){var W=560,H=340,s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(SOLUTIONS[k].t)+' illustration"><defs><linearGradient id="sky'+k+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4EA"/><stop offset="1" stop-color="#FFE2C8"/></linearGradient><linearGradient id="mt'+k+'" x1="0" x2="1"><stop offset="0" stop-color="#d9dde1"/><stop offset=".5" stop-color="#f4f6f7"/><stop offset="1" stop-color="#bfc5ca"/></linearGradient></defs>'+
  '<rect width="'+W+'" height="'+H+'" rx="18" fill="url(#sky'+k+')"/><circle cx="470" cy="70" r="34" fill="#FFC56B" opacity=".7"/><rect y="290" width="'+W+'" height="50" fill="#3a3a3a"/><rect y="290" width="'+W+'" height="6" fill="#F96302"/>';
  if(k==="home"){s+='<path d="M120 170 L250 80 L380 170 Z" fill="#D7262B"/><rect x="140" y="165" width="220" height="125" fill="#fff" stroke="#e2e2e2"/><rect x="225" y="215" width="50" height="75" fill="#2A2A2A"/><circle cx="266" cy="254" r="3" fill="#F96302"/>'+
    '<rect x="160" y="190" width="45" height="40" fill="#FFD9A8" stroke="#2A2A2A" stroke-width="3"/><rect x="295" y="190" width="45" height="40" fill="#FFD9A8" stroke="#2A2A2A" stroke-width="3"/><path d="M182 190v40M160 210h45M317 190v40M295 210h45" stroke="#2A2A2A" stroke-width="2"/>'+
    '<rect x="320" y="92" width="22" height="50" fill="#555"/>'+
    '<rect x="402" y="215" width="96" height="75" rx="6" fill="url(#mthome)" stroke="#9aa0a6"/>'+fan(440,252,28,.9)+'<rect x="474" y="228" width="16" height="50" rx="2" fill="#cfd4d8"/>'+
    flow(150,120,90,"#F96302",2)+'<text x="250" y="148" text-anchor="middle" fill="#fff" font-family="Oswald,Arial" font-weight="700" font-size="15">HOME</text>'}
  if(k==="commercial"){s+='<rect x="80" y="120" width="300" height="170" fill="#fff" stroke="#e2e2e2"/><rect x="80" y="112" width="300" height="12" fill="#2A2A2A"/><path d="M80 190h300v18H80z" fill="#D7262B"/>'+[0,1,2,3,4,5,6,7,8,9].map(function(i){return '<path d="M'+(80+i*30)+' 208 q15 14 30 0" fill="'+(i%2?'#fff':'#D7262B')+'"/>'}).join("")+
    '<rect x="100" y="222" width="120" height="68" fill="#BFE0F5" stroke="#2A2A2A" stroke-width="3"/><rect x="240" y="222" width="50" height="68" fill="#2A2A2A"/><rect x="305" y="222" width="60" height="45" fill="#BFE0F5" stroke="#2A2A2A" stroke-width="3"/>'+
    '<rect x="100" y="140" width="40" height="34" fill="#BFE0F5"/><rect x="160" y="140" width="40" height="34" fill="#BFE0F5"/><rect x="220" y="140" width="40" height="34" fill="#BFE0F5"/><rect x="280" y="140" width="40" height="34" fill="#BFE0F5"/>'+
    '<rect x="110" y="72" width="110" height="42" rx="4" fill="url(#mtcommercial)" stroke="#9aa0a6"/>'+fan(140,93,15,.7)+fan(190,93,15,.8)+'<rect x="250" y="80" width="90" height="34" rx="4" fill="url(#mtcommercial)" stroke="#9aa0a6"/>'+fan(295,97,13,.75)+
    '<rect x="420" y="160" width="80" height="130" fill="#fff" stroke="#e2e2e2"/><rect x="432" y="176" width="22" height="20" fill="#BFE0F5"/><rect x="466" y="176" width="22" height="20" fill="#BFE0F5"/><rect x="432" y="212" width="22" height="20" fill="#BFE0F5"/><rect x="466" y="212" width="22" height="20" fill="#BFE0F5"/>'+
    flow(115,40,100,"#D7262B",2)+'<text x="230" y="203" text-anchor="middle" font-family="Oswald,Arial" font-weight="700" font-size="13" fill="#fff">OPEN 24/7</text>'}
  if(k==="industrial"){s+='<path d="M40 290V150l70 40v-40l70 40v-40l70 40v-40l70 40v-30h160v130z" fill="#e9ecee" stroke="#9aa0a6"/><rect x="60" y="80" width="22" height="80" fill="#555"/><rect x="100" y="95" width="18" height="65" fill="#666"/>'+
    '<circle class="smoke" cx="71" cy="70" r="12" fill="#cfd4d8"/><circle class="smoke s2" cx="109" cy="85" r="10" fill="#cfd4d8"/>'+
    '<rect x="90" y="230" width="90" height="60" fill="#2A2A2A"/><path d="M90 245h90M90 260h90M90 275h90" stroke="#555" stroke-width="2"/><rect x="220" y="215" width="160" height="16" fill="#F96302"/>'+
    '<rect x="400" y="120" width="110" height="50" rx="4" fill="url(#mtindustrial)" stroke="#9aa0a6"/>'+fan(430,145,18,.6)+fan(480,145,18,.65)+'<path d="M410 170v30h20M500 170v40" stroke="#888" stroke-width="6" fill="none"/>'+
    '<rect x="230" y="245" width="140" height="10" rx="5" fill="#D7262B" class="glow"/><rect x="230" y="265" width="140" height="10" rx="5" fill="#D7262B" class="glow g2"/>'+flow(250,170,110,"#F96302",3)}
  return s+'</svg>'}
var SOLK=Object.keys(SOLUTIONS),solCur="home";
if(!has("#solTabs")&&has("#solStage")){var sk0=document.body.dataset.sol||"home";if(SOLUTIONS[sk0])$("#solStage").innerHTML='<div class="sol-art solo" style="--c:'+SOLUTIONS[sk0].col+'"><div class="sol-tilt">'+solArt(sk0)+'</div></div>'}
if(has("#solTabs")){$("#solTabs").innerHTML=SOLK.map(function(k){var o=SOLUTIONS[k];return '<button type="button" role="tab" class="sol-tab" data-sol="'+k+'" aria-selected="'+(k===solCur)+'" style="--c:'+o.col+'"><span class="st-ic">'+ic(o.ic)+'</span><span><b>'+esc(o.t)+'</b><small>'+esc(o.lead)+'</small></span></button>'}).join("");
function renderSol(){var o=SOLUTIONS[solCur];$$(".sol-tab").forEach(function(t){t.setAttribute("aria-selected",t.dataset.sol===solCur)});
  $("#solStage").innerHTML='<div class="sol-art" style="--c:'+o.col+'"><div class="sol-tilt">'+solArt(solCur)+'</div></div><div class="sol-list"><h3>'+esc(o.t)+'</h3><p>'+esc(o.lead)+'</p><div class="sol-grid">'+o.items.map(function(it){return '<button type="button" class="sol-it" data-svc="'+it[1]+'">'+ic(it[2]||(SERVICES.find(function(s){return s.id===it[1]})||{}).ic||o.ic)+'<span>'+esc(it[0])+'</span></button>'}).join("")+'</div><div class="sol-cta"><button class="btn" type="button" data-svc="'+(solCur==="home"?"furnace":solCur)+'">'+(solCur==="home"?"Get a home quote":"Request a site visit")+'</button><a class="btn o" href="tel:+19056672823">Call 905-667-2823</a></div></div>';
  var a=$(".sol-art"),t=$(".sol-tilt");a.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;var r=a.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform="rotateY("+(x*16)+"deg) rotateX("+(-y*12)+"deg)"});a.addEventListener("pointerleave",function(){t.style.transform=""})}
$("#solTabs").addEventListener("click",function(e){var b=e.target.closest("[data-sol]");if(b){solCur=b.dataset.sol;renderSol()}});
var hs=(location.hash||"").slice(1);if(SOLUTIONS[hs])solCur=hs;if(document.body.dataset.sol)solCur=document.body.dataset.sol;renderSol()}

/* ======================= REBATES ======================= */
function cad(n){return "$"+Math.round(n).toLocaleString("en-CA")}
(function(){if(!has("#rebPick"))return;var R=REBATES,picked={},wins=10;
  if($("#rebMax"))$("#rebMax").textContent=cad(Math.max.apply(null,R.items.map(function(i){return i.amt})));
  $("#rebProg").innerHTML='Saskatchewan homeowners can get money back on high-efficiency furnaces, tankless and condensing water heaters, boilers and HRVs through the <a href="'+esc(R.link)+'" target="_blank" rel="noopener">'+esc(R.program)+'</a>. It must be installed by a TSASK-licensed contractor — that\'s us.';
  $("#rebCards").innerHTML=R.items.map(function(i,n){return '<div class="rc" style="--d:'+(n*.06)+'s"><span class="rc-ic">'+ic(i.ic)+'</span><div><small>'+(i.up?"Up to":"Get")+'</small><b>'+cad(i.amt)+'</b>'+(i.per?'<em>'+esc(i.per)+'</em>':'')+'<span>'+esc(i.t)+'</span></div></div>'}).join("");
  $("#rebNotes").innerHTML=R.notes.map(function(n){return '<li>'+esc(n)+'</li>'}).join("")+'<li>Updated '+esc(R.updated)+' · <a href="'+esc(R.link)+'" target="_blank" rel="noopener">program details</a></li>';
  $("#rebPick").innerHTML=R.items.filter(function(i){return i.id!=="audit"}).map(function(i){return '<label class="rp"><input type="checkbox" value="'+i.id+'"><span class="rp-b">'+ic(i.ic)+'</span><span>'+esc(i.t)+(i.per?' <input class="rp-n" type="number" min="1" max="60" value="'+wins+'" aria-label="Number of windows and doors"> openings':'')+'</span></label>'}).join("");
  function total(){var t=0;R.items.forEach(function(i){if(picked[i.id])t+=i.per?i.amt*wins:i.amt});var any=R.items.some(function(i){return picked[i.id]});$("#rebLbl").textContent=any?"Possible rebates, up to":"Tick what you're planning to see your possible rebate";$("#rebTot").hidden=!any;if(!any)return;if(picked.furn97&&picked.furn96)t-=325;if(picked.tankless&&picked.condwh)t-=1000;if(picked.condwh&&picked.tank)t-=250;if(picked.tankless&&picked.tank)t-=250;if(picked.boiler&&picked.combi)t-=800;$("#rebTot").textContent=cad(t);$("#rebTot").classList.remove("pop");void $("#rebTot").offsetWidth;$("#rebTot").classList.add("pop")}
  $("#rebPick").addEventListener("change",function(e){var c=e.target;if(c.type==="checkbox")picked[c.value]=c.checked;if(c.classList.contains("rp-n"))wins=Math.max(1,Math.min(60,+c.value||1));total()});
  $("#rebPick").addEventListener("input",function(e){if(e.target.classList.contains("rp-n")){wins=Math.max(1,Math.min(60,+e.target.value||1));total()}});
  $("#rebQuote").onclick=function(){var first=R.items.find(function(i){return picked[i.id]});openWizard(first?first.svc:"furnace",{rebate:"Yes, check for me"})};
})();

/* ======================= OUR WORK ======================= */
var WORKDB=[],workF="all";
function allWork(){return PROJECTS.concat(WORKDB).slice().sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""))})}
function wcName(c){var f=WORK_CATS.find(function(x){return x[0]===c});return f?f[1]:c}
function wcIc(c){return ({furnace:"furnace",ac:"ac",hp:"hp",water:"tankless",gh:"garage",duct:"duct",commercial:"office",industrial:"factory"})[c]||"tools"}
function workCard(p,i){var ph=p.photos||[];return '<article class="wc" tabindex="0" data-wk="'+i+'"><div class="wc-im">'+(ph[0]?'<img src="'+esc(ph[0])+'" alt="'+esc(p.title)+'" loading="lazy">':'<div class="wc-ph">'+ic(wcIc(p.cat))+'</div>')+(ph.length>1?'<span class="wc-n">'+ic("camera")+ph.length+'</span>':'')+'<span class="wc-cat">'+esc(wcName(p.cat))+'</span></div><div class="wc-b">'+(p.brand?'<div class="wc-br">'+brandMark(p.brand,"card")+'</div>':'')+'<h3>'+esc(p.title)+'</h3><p class="wc-m">'+esc([p.city,p.date].filter(Boolean).join(" · "))+'</p>'+(p.text?'<p>'+esc(p.text)+'</p>':'')+'</div></article>'}
function emptyWork(big){return '<div class="wk-empty'+(big?' big':'')+'"><span class="we-ic">'+ic("camera")+'</span><div><b>Install photos are on the way</b><p>We\'re adding photos of recent jobs by our technicians. Want to see work near you? Ask us — or book a free visit.</p></div><button class="btn sm" type="button" data-open="quote">Book a free visit</button></div>'}
function renderWork(){var L=allWork();
  if(has("#workStrip"))$("#workStrip").innerHTML=L.length?L.slice(0,6).map(workCard).join(""):emptyWork(false)+'<div class="std mini">'+STANDARDS.slice(0,4).map(stdHTML).join("")+'</div>';
  var cats={};L.forEach(function(p){cats[p.cat]=1});
  if(!has("#wpGrid"))return;$("#wpFilters").innerHTML=WORK_CATS.filter(function(c){return c[0]==="all"||cats[c[0]]||!L.length}).map(function(c){return '<button type="button" role="tab" data-wf="'+c[0]+'" aria-selected="'+(c[0]===workF)+'">'+(c[0]!=="all"?ic(wcIc(c[0])):"")+esc(c[1])+'</button>'}).join("");
  var list=L.map(function(p,i){return [p,i]}).filter(function(x){return workF==="all"||x[0].cat===workF});
  $("#wpGrid").innerHTML=list.length?list.map(function(x){return workCard(x[0],x[1])}).join(""):emptyWork(true);
  var cities={},brands={};L.forEach(function(p){if(p.city)cities[p.city]=1;if(p.brand)brands[p.brand]=1});
  $("#wpStats").innerHTML=(L.length?[[L.length,"Projects shown"],[Object.keys(cities).length,"Cities"],[Object.keys(brands).length,"Brands installed"]]:[[STANDARDS.length,"Point install checklist"],["24/7","Emergency line"],[CITIES.length+"+","Cities served"]]).map(function(s){return '<div><b>'+s[0]+'</b><span>'+s[1]+'</span></div>'}).join("")}
function stdHTML(s,i){return '<div class="sd"><span class="sd-n">'+ic("check")+'</span><div><b>'+esc(s[1])+'</b><small>'+esc(s[2])+'</small></div></div>'}
if(has("#wpStd"))$("#wpStd").innerHTML=STANDARDS.map(stdHTML).join("");
function openWork(f){if(!has("#wpGrid")){location.href=L("page","work");return}workF=f||"all";renderWork();$("#wpFilters").scrollIntoView({behavior:"smooth"})}
function openProject(i){var p=allWork()[i];if(!p)return;var ph=p.photos||[],k=0;$("#lbT").textContent=p.title;
  function draw(){$("#lbBody").innerHTML='<div class="lb-im">'+(ph.length?'<img src="'+esc(ph[k])+'" alt="'+esc(p.title)+' photo '+(k+1)+'">':'<div class="wc-ph">'+ic(wcIc(p.cat))+'</div>')+(ph.length>1?'<button class="lb-a l" type="button" data-lb="-1" aria-label="Previous photo">‹</button><button class="lb-a r" type="button" data-lb="1" aria-label="Next photo">›</button><span class="lb-c">'+(k+1)+' / '+ph.length+'</span>':'')+'</div>'+(ph.length>1?'<div class="lb-th">'+ph.map(function(u,j){return '<button type="button" data-lbi="'+j+'" class="'+(j===k?'on':'')+'"><img src="'+esc(u)+'" alt=""></button>'}).join("")+'</div>':'')+
    '<div class="lb-info">'+(p.brand?brandMark(p.brand,"card"):'')+'<p class="wc-m">'+esc([wcName(p.cat),p.city,p.date].filter(Boolean).join(" · "))+'</p>'+(p.text?'<p>'+esc(p.text)+'</p>':'')+'<button class="btn" type="button" data-svc="'+(({water:"tankless"})[p.cat]||p.cat)+'">Get a quote like this</button></div>'}
  draw();$("#lbBody").onclick=function(e){var a=e.target.closest("[data-lb]"),t=e.target.closest("[data-lbi]");if(a){k=(k+(+a.dataset.lb)+ph.length)%ph.length;draw()}if(t){k=+t.dataset.lbi;draw()}};openO("lbox")}
document.addEventListener("click",function(e){var w=e.target.closest("[data-work]");if(w){e.preventDefault();openWork(w.dataset.work);return}
  var f=e.target.closest("[data-wf]");if(f){workF=f.dataset.wf;renderWork();return}
  var c=e.target.closest("[data-wk]");if(c){openProject(+c.dataset.wk)}});
document.addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.dataset&&e.target.dataset.wk)openProject(+e.target.dataset.wk)});
renderWork();
/* the lightbox's quote button sits in an overlay: close overlays first */
$("#lbBody").addEventListener("click",function(e){var s=e.target.closest("[data-svc]");if(s){e.stopPropagation();$$(".ovl.open").forEach(function(o){o.classList.remove("open")});openWizard(s.dataset.svc)}});

/* admin: add projects */
function aWork(){var c=A.wNew||{title:"",city:"",cat:"furnace",brand:"",date:today().slice(0,7),text:"",photos:[]};A.wNew=c;
  return '<h3>Our work</h3><p class="sub">Add jobs your technicians installed. They show on the front page and the Our Work page.</p><div class="card"><h4>Add a project</h4><div class="fgrid" id="wf"><label class="fl">Title<input name="title" value="'+esc(c.title)+'" placeholder="e.g. Furnace + AC replacement"></label><label class="fl">City<input name="city" value="'+esc(c.city)+'" placeholder="e.g. Mississauga"></label><label class="fl">Category<select name="cat">'+WORK_CATS.slice(1).map(function(w){return '<option value="'+w[0]+'"'+(w[0]===c.cat?' selected':'')+'>'+w[1]+'</option>'}).join("")+'</select></label><label class="fl">Brand<select name="brand"><option value="">—</option>'+allBrands.map(function(b){return '<option'+(b===c.brand?' selected':'')+'>'+esc(b)+'</option>'}).join("")+'</select></label><label class="fl">Month<input name="date" type="month" value="'+esc(c.date)+'"></label><label class="fl full">Description<textarea name="text" placeholder="What we did, equipment, anything special">'+esc(c.text)+'</textarea></label><label class="fl full">Photos (you can pick several)<input type="file" accept="image/*" multiple id="wImg"></label><div class="full wthumbs">'+c.photos.map(function(u){return '<img src="'+esc(u)+'" alt="">'}).join("")+'</div></div><button class="btn" data-a="savework" style="margin-top:12px">Add project</button></div>'+
  '<div class="card"><h4>Projects ('+WORKDB.length+')</h4>'+(WORKDB.length?'<table class="tbl"><tbody>'+WORKDB.map(function(p){return '<tr><td>'+esc(p.date||"")+'</td><td><b>'+esc(p.title)+'</b><br><small>'+esc(p.city||"")+'</small></td><td>'+(p.photos||[]).length+' photos</td><td><button class="btn r sm" data-a="delwork" data-id="'+esc(p._id)+'">Remove</button></td></tr>'}).join("")+'</tbody></table>':'<div class="emp">No projects yet.</div>')+'</div>'}
$("#admMain").addEventListener("input",function(e){var t=e.target;if(t.closest("#wf")&&t.name)A.wNew[t.name]=t.value});
$("#admMain").addEventListener("change",async function(e){var t=e.target;if(t.closest("#wf")&&t.name)A.wNew[t.name]=t.value;
  if(t.id==="wImg"&&t.files.length){for(var i=0;i<t.files.length;i++){var u=await upload(t.files[i]);if(u)A.wNew.photos.push(u)}$("#admMain").innerHTML=aWork()}});
$("#admMain").addEventListener("click",function(e){var b=e.target.closest("[data-a]");if(!b)return;var a=b.dataset.a;
  if(a==="savework"){var c=A.wNew;if(!c.title){toast("Add a title");return}var id="w_"+Date.now();save(async function(){await CAP.db.collection("pub/site/projects").doc(id).set({title:c.title,city:c.city,cat:c.cat,brand:c.brand,date:c.date,text:c.text,photos:c.photos,createdAt:new Date().toISOString()});A.wNew=null;renderA()},"Project added")}
  if(a==="delwork"){if(!confirm("Remove this project?"))return;save(async function(){await CAP.db.collection("pub/site/projects").doc(b.dataset.id).delete();renderA()},"Removed")}});

/* ======================= PROCESS JOURNEY ======================= */
(function(){if(!has("#journey"))return;var J=$("#journey"),svg=$("#jline"),p0=$("#jpath0"),p=$("#jpath"),len=0,lis=$$("#steps li");
  function build(){var r=J.getBoundingClientRect();svg.setAttribute("viewBox","0 0 "+r.width+" "+r.height);svg.setAttribute("width",r.width);svg.setAttribute("height",r.height);
    var pts=lis.map(function(li){var o=li.querySelector(".orb").getBoundingClientRect();return [o.left-r.left+o.width/2,o.top-r.top+o.height/2]});
    var d="M"+pts[0][0]+" "+pts[0][1];for(var i=1;i<pts.length;i++){var a=pts[i-1],b=pts[i];if(Math.abs(a[1]-b[1])<10||Math.abs(a[0]-b[0])<10)d+=" L"+b[0]+" "+b[1];else{var bulge=a[0]>r.width/2?110:-110;d+=" C"+(a[0]+bulge)+" "+a[1]+" "+(b[0]+bulge)+" "+b[1]+" "+b[0]+" "+b[1]}}
    p0.setAttribute("d",d);p.setAttribute("d",d);len=p.getTotalLength();p.style.strokeDasharray=len;prog()}
  function prog(){var r=J.getBoundingClientRect(),f=Math.max(0,Math.min(1,(innerHeight*.72-r.top)/(r.height)));if(reduce)f=1;p.style.strokeDashoffset=len*(1-f);lis.forEach(function(li,i){li.classList.toggle("on",f>=(i+.3)/lis.length)})}
  addEventListener("scroll",prog,{passive:true});addEventListener("resize",build);setTimeout(build,60);addEventListener("load",build);if(document.fonts)document.fonts.ready.then(build)})();

/* ======================= 24/7 CHAT ======================= */
(function(){var fab=$("#chatFab"),box=$("#chat"),log=$("#chatLog"),inp=$("#chatIn"),hist=[],started=false,busy=false,aiTried=false;
  $("#chatName").textContent=CHAT.name;
  function scroll(){log.scrollTop=log.scrollHeight}
  function add(who,html,extra){var d=document.createElement("div");d.className="cm "+who;d.innerHTML='<div class="bub">'+html+'</div>'+(extra||"");log.appendChild(d);scroll();return d}
  function bot(text,acts){var a=(acts||[]).map(function(x){return x}).join("");add("bot",text,a?'<div class="cm-acts">'+a+'</div>':"");hist.push({role:"assistant",content:text.replace(/<[^>]+>/g,"")})}
  function typing(){var d=add("bot",'<span class="dots"><i></i><i></i><i></i></span>');d.classList.add("typing");return d}
  function A_(label,attr){return '<button type="button" class="ca" '+attr+'>'+esc(label)+'</button>'}
  function callBtn(){return '<a class="ca call" href="tel:+19056672823">Call 905-667-2823</a>'}
  function open(topic){box.hidden=false;fab.setAttribute("aria-expanded","true");document.body.classList.add("chat-on");
    if(!started){started=true;bot(esc(CHAT.hello));$("#chatChips").innerHTML=CHAT.chips.map(function(c){return '<button type="button" data-cq="'+c[1]+'">'+esc(c[0])+'</button>'}).join("")}
    if(topic)quick(topic);setTimeout(function(){inp.focus()},80)}
  function close(){box.hidden=true;fab.setAttribute("aria-expanded","false");document.body.classList.remove("chat-on");fab.focus()}
  fab.onclick=function(){box.hidden?open():close()};$("#chatX").onclick=close;
  document.addEventListener("click",function(e){var o=e.target.closest("[data-chat-open]");if(o){open(o.dataset.chatOpen)}});
  box.addEventListener("keydown",function(e){if(e.key==="Escape")close()});
  function gotoSec(id){if(id==="work"){openWork("all");return}var el=$("#"+id);if(!el){var cat=id.indexOf("row-")===0?id.slice(4):null;var u=cat?L("cat",cat):L("page",id);if(u)location.href=u;return}if(el){if(innerWidth<760)close();el.scrollIntoView({behavior:"smooth",block:id.indexOf("row-")===0?"center":"start"})}}
  function quick(k){var lab=(CHAT.chips.find(function(c){return c[1]===k})||[k,k])[0];add("me",esc(lab));hist.push({role:"user",content:lab});
    if(k==="book"){bot("Great — pick what you need and I'll open a 2-minute booking form.",SERVICES.filter(function(s){return ["furnace","ac","hp","tankless","duct","repair","commercial","maint"].indexOf(s.id)>-1}).map(function(s){return A_(s.name,'data-cbook="'+s.id+'"')}));return}
    if(k==="human"){human();return}
    answer(lab)}
  function lic(){return "We're "+JORA.licences.map(function(l){return l[0]}).join(", ")+"."}
  function match(q){var t=q.toLowerCase(),best=null,score=0;CHAT.faq.forEach(function(f){var s=0;f.k.forEach(function(k){if(t.indexOf(k)>-1)s+=k.length});if(s>score){score=s;best=f}});return best}
  function actsFor(f){var a=[];if(f&&f.svc)a.push(A_("Book "+svcName(f.svc).toLowerCase(),'data-cbook="'+f.svc+'"'));if(f&&f.go)a.push(A_(f.go==="work"?"See our work":"Show me",'data-cgo="'+f.go+'"'));if(f&&f.svc==="repair")a.unshift(callBtn());return a}
  function ruleAnswer(q){var pc=/[a-z]\d[a-z]\s?\d[a-z]\d/i.exec(q);if(pc){var r=checkPostal(pc[0]);bot(esc(r.msg)+(r.state==="ok"?" Want to book a free visit?":""),r.state==="ok"?[A_("Book a free visit",'data-cbook=""')]:[callBtn()]);return true}
    var f=match(q);if(!f)return false;bot(esc(f.a==="@lic"?lic():f.a),actsFor(f));return true}
  async function ai(q){if(!window.JRT||!JRT.use)return false;if(!CAP.sample&&!aiTried){aiTried=true;try{CAP.sample=await JRT.use("sample")}catch(e){}}if(!CAP.sample)return false;
    var kb=CHAT.faq.map(function(f){return "- "+(f.a==="@lic"?lic():f.a)}).join("\n");
    var sys="You are the 24/7 website chat assistant for "+JORA.company+", a TSASK-licensed heating, cooling, gas and hot water contractor in Saskatoon, Saskatchewan (no plumbing) (phone "+JORA.phone+"). Answer in 1-3 short, friendly sentences. Only use these facts; if you don't know, say a technician will confirm and suggest calling or booking. Never quote prices or promise dates. For gas smells tell them to leave and call the gas utility emergency line or 911.\nFacts:\n"+kb+"\nRebates: "+REBATES.items.map(function(i){return i.t+" "+(i.up?"up to ":"")+cad(i.amt)+(i.per?" "+i.per:"")}).join("; ")+" ("+REBATES.program+", eligibility applies).\nBrands: "+allBrands.join(", ")+".\nService area: the whole Greater Toronto Area (Toronto, Peel, York, Halton, Durham).";
    var msgs=[{role:"user",content:sys+"\n\nConversation so far follows. Reply to the last customer message only."}].concat(hist.slice(-8).map(function(m){return {role:m.role,content:m.content}}));
    var merged=[];msgs.forEach(function(m){var l=merged[merged.length-1];if(l&&l.role===m.role)l.content+="\n"+m.content;else merged.push({role:m.role,content:m.content})});if(merged[merged.length-1].role!=="user")return false;
    var t=typing();try{var r=await CAP.sample(merged,{modelTier:"quick",cache:false,onText:function(x){t.querySelector(".bub").textContent=x.text;scroll()}});t.remove();var f=match(q);bot(esc(r.text),actsFor(f));return true}catch(e){t.remove();if(e&&e.code==="not_granted")CAP.sample=null;return false}}
  async function answer(q){if(busy)return;busy=true;try{if(/[a-z]\d[a-z]\s?\d[a-z]\d/i.test(q)&&ruleAnswer(q))return;
    var f=match(q);if(f&&(f.svc==="repair"||f.a==="@lic")){ruleAnswer(q);return}
    if(await ai(q))return;
    var t=typing();await new Promise(function(r){setTimeout(r,550)});t.remove();
    if(!ruleAnswer(q))bot("Good question — I'll get a team member to answer that. Leave your details, or call us any time.",[A_("Leave my details",'data-chuman="1"'),callBtn()])}finally{busy=false}}
  function human(){bot("Sure — leave your name and number and a team member will get back to you. For emergencies, please call.",[]);
    var d=add("bot",'<form class="cform" novalidate><input name="n" placeholder="Your name" required autocomplete="name"><input name="p" type="tel" placeholder="Phone" required autocomplete="tel"><input name="pc" placeholder="Postal code (optional)" maxlength="7" autocomplete="postal-code"><textarea name="m" placeholder="How can we help?" rows="2"></textarea><button class="btn sm" type="submit">Send to the team</button></form>');
    d.querySelector("form").addEventListener("submit",async function(e){e.preventDefault();var f=e.target,n=f.n.value.trim(),ph=f.p.value.trim();if(!n||ph.replace(/\D/g,"").length<10){f.querySelector(n?"[name=p]":"[name=n]").focus();f.classList.add("bad");return}
      f.querySelector("button").disabled=true;var rec={ref:refNo(),service:"chat",serviceName:"Chat message",answers:{details:f.m.value.trim(),chat:hist.slice(-10).map(function(m){return (m.role==="user"?"Customer: ":"Assistant: ")+m.content}).join("\n")},contact:{firstName:n.split(" ")[0],lastName:n.split(" ").slice(1).join(" "),phone:ph,postal:f.pc.value.toUpperCase(),email:"",province:"SK",city:""},status:"new",source:"chat",createdAt:new Date().toISOString()};
      var saved=false;if(CAP.db&&CAP.canWrite){try{await CAP.db.collection("requests").doc(rec.ref).set(Object.assign(rec,{track:typeof joraTrack==="function"?joraTrack():{}}));saved=true}catch(err){}}
      if(!saved)saved=await liveSaveRequest(rec,"Chat message "+rec.ref+" — "+n,"Name: "+n+"\nPhone: "+ph+"\nPostal code: "+rec.contact.postal+"\n\n"+rec.answers.details);
      if(!saved&&JORA.formEndpoint){try{var r=await fetch(JORA.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({_subject:"Chat message "+rec.ref,name:n,phone:ph,postal:rec.contact.postal,message:rec.answers.details,chat:rec.answers.chat})});saved=r.ok}catch(err){}}
      f.remove();if(saved)bot("Thanks, "+esc(n.split(" ")[0])+"! Your message is with our team (ref "+esc(rec.ref)+"). We'll call you back soon.");
      else{var mail="mailto:"+(SITE.notifyEmail||JORA.notifyEmail)+"?subject="+encodeURIComponent("Website chat — "+n)+"&body="+encodeURIComponent("Name: "+n+"\nPhone: "+ph+"\nPostal code: "+rec.contact.postal+"\n\n"+rec.answers.details+"\n\n"+rec.answers.chat);bot("Thanks, "+esc(n.split(" ")[0])+"! Tap below to send your message — or call us now.",['<a class="ca" href="'+esc(mail)+'">Send message</a>',callBtn()])}})}
  log.addEventListener("click",function(e){var b=e.target.closest("[data-cbook]");if(b){openWizard(b.dataset.cbook||null);return}var g=e.target.closest("[data-cgo]");if(g){gotoSec(g.dataset.cgo);return}if(e.target.closest("[data-chuman]")){human()}});
  $("#chatChips").addEventListener("click",function(e){var b=e.target.closest("[data-cq]");if(b)quick(b.dataset.cq)});
  $("#chatForm").addEventListener("submit",function(e){e.preventDefault();var q=inp.value.trim();if(!q||busy)return;inp.value="";add("me",esc(q));hist.push({role:"user",content:q});answer(q)});
  setTimeout(function(){if(!started)fab.classList.add("nudge")},6000);
})();
