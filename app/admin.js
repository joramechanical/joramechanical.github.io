/* Jora Mechanical — office panel */
(function(){
"use strict";
var J=window.JDB,db=J.db,auth=J.auth,esc=J.esc,money=J.money,IDX=window.JORA_IDX||"";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var ROOT="../",LOGO=ROOT+"assets/logo.png",SITE={gta:ROOT+"gta/"+IDX,sk:ROOT+"saskatchewan/"+IDX},RNAME={gta:"GTA",sk:"Saskatchewan"};
function quoteLink(id,abs){var p="quote/"+IDX+"?id="+encodeURIComponent(id);return abs?new URL(ROOT+p,location.href).href:ROOT+p}
var I={
 today:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/><path d="M8 14h3v3H8z"/>',
 req:'<path d="M4 4h16v12H7l-3 3z"/><path d="M8 9h8M8 12h5"/>',
 quote:'<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h7M9 17h7"/>',
 job:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
 cust:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M16 4a4 4 0 0 1 0 8M22 21c0-3-1.8-5.6-4.5-6.6"/>',
 prod:'<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
 hero:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 15l3-3 3 3 2-2 3 3"/><circle cx="8" cy="9" r="1.5"/>',
 site:'<circle cx="12" cy="12" r="9"/><path d="M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18M3 12h18"/>',
 team:'<circle cx="12" cy="7" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M19 8l1.5 1.5L23 7"/>',
 setup:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',map:'<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
 print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',ext:'<path d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7"/>'};
function ic(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(I[k]||"")+'</svg>'}

var S={user:null,role:"none",tab:"today",region:"all",view:null,day:ymd(new Date()),
  req:[],quotes:[],jobs:[],cust:[],team:[],users:[],pub:{gta:null,sk:null},cat:{gta:null,sk:null},
  f:{req:"all",quote:"all",jobs:"day",q:""},edit:null,unsub:[]};
try{var rg=localStorage.getItem("jora_adm_region");if(rg)S.region=rg}catch(e){}

/* ---------- utilities ---------- */
function ymd(d){d=d||new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function addDays(s,n){var d=new Date(s+"T12:00:00");d.setDate(d.getDate()+n);return ymd(d)}
function dayOf(iso){if(!iso)return "";var d=new Date(iso);return isNaN(d)?String(iso).slice(0,10):ymd(d)}
function nice(s){if(!s)return "";var d=new Date(String(s).length<=10?s+"T12:00:00":s);return isNaN(d)?esc(s):d.toLocaleDateString("en-CA",{weekday:"short",month:"short",day:"numeric"})}
function niceT(s){if(!s)return "";var d=new Date(s);return isNaN(d)?"":d.toLocaleString("en-CA",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}
function t12(t){if(!t)return "Any time";var p=t.split(":"),h=+p[0];return (h%12||12)+":"+p[1]+(h<12?" am":" pm")}
function pill(s,extra){return '<span class="pill '+esc(s||"new")+'">'+esc((s||"new").replace(/-/g," "))+'</span>'+(extra||"")}
function rpill(r){return r?'<span class="pill '+r+'">'+RNAME[r]+'</span>':""}
function inRegion(x){return S.region==="all"||!x.region||x.region===S.region}
function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove("on")},3200)}
function fail(e){console.error(e);toast(J.friendlyError(e))}
function can(w){return J.can(S.role,w)}
function cname(c){c=c||{};return c.name||((c.firstName||"")+" "+(c.lastName||"")).trim()||"—"}
function caddr(c){c=c||{};return c.address||[c.street,c.unit].filter(Boolean).join(" ")}
function digits(s){return String(s||"").replace(/\D/g,"")}
function custKey(c){var e=(c.email||"").trim().toLowerCase();return e?e.replace(/[\/.#$\[\]]/g,"_"):(digits(c.phone)?"ph-"+digits(c.phone):J.rid(16))}
function val(f,n){var el=f.elements[n];return el?(el.type==="checkbox"?el.checked:String(el.value).trim()):""}
function qNumber(){var d=new Date();return "JQ-"+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+String(Math.floor(Math.random()*900)+100)}
function confirmDo(msg){return window.confirm(msg)}
function maps(a){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(a)}
var SVCS=[["furnace","Furnace"],["ac","Air conditioner"],["hp","Heat pump"],["tankless","Tankless water heater"],["water","Water heater (tank)"],["garage","Garage heater"],["boiler","Boiler / in-floor"],["ah","Air handler"],["duct","Ductwork"],["hrv","HRV / ERV"],["humid","Humidifier"],["thermo","Thermostat"],["plumb","Plumbing"],["repair","Repair"],["maint","Maintenance / tune-up"],["commercial","Commercial"],["industrial","Industrial"],["other","Other"]];
function svcName(id){var s=SVCS.find(function(x){return x[0]===id});return s?s[1]:(id||"")}
var JOBST=[["scheduled","#2F6FED"],["on-the-way","#7E57C2"],["in-progress","#B26A00"],["done","#2E7D32"],["cancelled","#9aa0a6"]];
function jcol(s){var x=JOBST.find(function(j){return j[0]===s});return x?x[1]:"#2F6FED"}

/* ---------- catalog (built-in products from each website) ---------- */
function loadCat(r){if(S.cat[r])return Promise.resolve(S.cat[r]);return fetch(ROOT+"app/catalog-"+r+".json").then(function(x){return x.json()}).then(function(c){S.cat[r]=c;return c})}
function prodImg(p,r){return p.imgDoc?(S.pimg[p.imgDoc]||""):p.img?ROOT+(r==="sk"?"saskatchewan":"gta")+"/assets/img/"+p.img+".webp":""}
S.pimg={};
function loadPimg(id){if(!id||S.pimg[id]!==undefined)return;S.pimg[id]="";db.collection("pimg").doc(id).get().then(function(s){if(s.exists){S.pimg[id]=s.data().data;$$('img[data-pimg="'+id+'"]').forEach(function(i){i.src=S.pimg[id]})}}).catch(function(){})}
function pubOf(r){return S.pub[r]||{}}
function defaultPub(){return {colors:{main:"",accent:""},weather:"auto",announce:{on:false,text:"",link:"",linkText:""},stats:{customers:3000,years:28},hero:{ids:[],seconds:3.5},hidden:[],flags:{},extra:[]}}
function savePub(r,P){P.updatedAt=J.now();P.updatedBy=S.user.email;return db.collection("public").doc(r).set(JSON.parse(JSON.stringify(P))).then(function(){toast("Saved — live on the "+RNAME[r]+" website")}).catch(fail)}

/* ======================= SIGN-IN ======================= */
function authScreen(mode,msg){mode=mode||"in";document.body.innerHTML=(J.demo?demoBar():"")+'<div class="auth"><div class="auth-box"><a class="auth-logo" href="'+SITE.gta+'"><img src="'+LOGO+'" alt=""><span><b>Jora Mechanical</b><small>Office panel</small></span></a>'+
  (mode==="in"?'<h1>Sign in</h1><p class="sub">For the Jora team and partners.</p>':mode==="up"?'<h1>Create your login</h1><p class="sub">Use the email address the office added to the team.</p>':'<h1>Reset password</h1><p class="sub">We\'ll email you a link to set a new password.</p>')+
  '<div class="err" id="err"></div>'+(msg?'<div class="okmsg">'+msg+'</div>':'')+
  '<form id="af" novalidate>'+(mode==="up"?'<label class="f"><span>Your name</span><input class="inp" name="name" autocomplete="name" required></label>':'')+
  '<label class="f"><span>Email</span><input class="inp" name="email" type="email" autocomplete="email" required></label>'+
  (mode!=="reset"?'<label class="f"><span>Password</span><input class="inp" name="pw" type="password" autocomplete="'+(mode==="up"?"new-password":"current-password")+'" minlength="6" required></label>':'')+
  '<button class="btn" type="submit">'+(mode==="in"?"Sign in":mode==="up"?"Create login":"Send reset link")+'</button></form>'+
  '<p style="margin:18px 0 0;text-align:center;font-size:14px">'+(mode==="in"?'<button class="lnk" data-m="reset">Forgot password?</button> · <button class="lnk" data-m="up">First time? Create your login</button>':'<button class="lnk" data-m="in">‹ Back to sign in</button>')+'</p>'+
  (J.demo?'<div style="margin-top:22px;padding-top:18px;border-top:1px solid #eee"><button class="btn k" id="demoGo" type="button">Open the demo panel</button><p class="mut tiny" style="margin:8px 0 0;text-align:center">Demo mode: everything is saved only in this browser until the database is connected.</p></div>':'')+
  '</div></div><div class="toast" id="toast"></div>';
  $$("[data-m]").forEach(function(b){b.onclick=function(){authScreen(b.dataset.m)}});
  if($("#demoGo"))$("#demoGo").onclick=function(){J.demoOwnerSignIn()};
  $("#af").onsubmit=function(e){e.preventDefault();var f=e.target,em=val(f,"email"),pw=f.elements.pw?f.elements.pw.value:"",er=$("#err"),b=f.querySelector("button");er.classList.remove("on");b.disabled=true;
    var p=mode==="in"?auth.signInWithEmailAndPassword(em,pw):mode==="up"?auth.createUserWithEmailAndPassword(em,pw).then(function(c){var u=c.user;return u.updateProfile({displayName:val(f,"name")}).then(function(){return u.sendEmailVerification&&!J.demo?u.sendEmailVerification():null})}):auth.sendPasswordResetEmail(em).then(function(){authScreen("in","If that email has a login, a reset link is on its way.")});
    p.catch(function(x){er.textContent=J.friendlyError(x);er.classList.add("on")}).finally(function(){b.disabled=false})}}
function demoBar(){return '<div class="demo-bar"><b>Demo mode</b> — the database isn\'t connected yet, so changes are saved only in this browser. <button class="lnk" id="demoReset">Clear demo data</button></div>'}
function noAccess(msg){document.body.innerHTML=(J.demo?demoBar():"")+'<div class="auth"><div class="auth-box"><a class="auth-logo" href="'+SITE.gta+'"><img src="'+LOGO+'" alt=""><span><b>Jora Mechanical</b><small>Office panel</small></span></a>'+msg+
  '<div class="acts" style="margin-top:18px"><button class="btn g" id="so" type="button">Sign out</button><a class="btn o" href="'+ROOT+'account/'+IDX+'">Customer account</a></div></div></div>';$("#so").onclick=function(){auth.signOut()}}

auth.onAuthStateChanged(function(u){S.unsub.forEach(function(f){try{f()}catch(e){}});S.unsub=[];S.user=u;
  if(!u){authScreen("in");return}
  J.roleFor(u).then(function(role){S.role=role;
    if(!can("view")){noAccess('<h1>No office access</h1><p class="sub">'+esc(u.email)+' isn\'t on the Jora team list. Ask the office to add you in <b>Team</b>, then sign in again.</p>');return}
    if(!J.demo&&!u.emailVerified){noAccess('<h1>Verify your email</h1><p class="sub">We sent a link to <b>'+esc(u.email)+'</b>. Open it, then come back and press the button below.</p><div class="acts"><button class="btn" id="vchk" type="button">I\'ve verified — continue</button><button class="btn g" id="vre" type="button">Send the link again</button></div>');
      $("#vchk").onclick=function(){u.reload().then(function(){return u.getIdToken(true)}).then(function(){if(auth.currentUser.emailVerified)location.reload();else toast("Not verified yet — check your inbox (and spam).")})};
      $("#vre").onclick=function(){u.sendEmailVerification().then(function(){toast("Sent again")}).catch(fail)};return}
    shell();subscribe()})});

/* ======================= DATA ======================= */
function sub(q,key,map){S.unsub.push(q.onSnapshot(function(s){S[key]=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())});if(map)map();refresh()},function(e){console.warn(key,e)}))}
function subscribe(){
  sub(db.collection("requests").orderBy("createdAt","desc").limit(1500),"req");
  sub(db.collection("quotes").orderBy("createdAt","desc").limit(1500),"quotes");
  sub(db.collection("jobs").orderBy("date","desc").limit(2000),"jobs");
  sub(db.collection("customers").orderBy("name").limit(3000),"cust");
  sub(db.collection("users").limit(3000),"users");
  if(can("team"))sub(db.collection("team"),"team");else db.collection("team").get().then(function(s){S.team=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())})}).catch(function(){});
  ["gta","sk"].forEach(function(r){S.unsub.push(db.collection("public").doc(r).onSnapshot(function(s){S.pub[r]=s.exists?s.data():null;(pubOf(r).extra||[]).forEach(function(p){if(p.imgDoc)loadPimg(p.imgDoc)});refresh()},function(){}))});
  loadCat("gta");loadCat("sk")}
var rT=0;function refresh(){clearTimeout(rT);rT=setTimeout(function(){if(!S.edit)render();else navCounts()},60)}

/* ======================= SHELL ======================= */
var NAV=[["Daily","today","Today",null],["Daily","req","Requests","view"],["Daily","quote","Quotations","view"],["Daily","jobs","Jobs","jobs"],["Daily","cust","Customers","view"],
  ["Website","prod","Products","site"],["Website","seo","SEO & page titles","site"],["Website","blog","Blog & advice","site"],["Website","work","Our Work photos","site"],["Website","hero","Hero slider","site"],["Website","site","Colours, weather & more","site"],["Office","team","Team","team"],["Office","setup","Setup & help",null]];
function shell(){document.body.innerHTML=(J.demo?demoBar():"")+'<div class="mtop"><button id="mOpen" aria-label="Menu">'+ic("menu")+'</button><b>Jora office</b><span></span></div><div class="scrim" id="scrim"></div>'+
  '<div class="adm"><aside class="side" id="side"><a class="brand" href="'+SITE.gta+'" target="_blank" rel="noopener"><img src="'+LOGO+'" alt=""><span><b>Jora Mechanical</b><small>OFFICE PANEL</small></span></a><nav id="nav"></nav>'+
  '<div class="me"><b>'+esc(S.user.displayName||S.user.email)+'</b><span>'+esc(J.ROLES[S.role]||S.role)+' · '+esc(S.user.email)+'</span><br><button class="btn g sm" id="so" type="button">Sign out</button></div></aside><main class="main" id="main"></main></div><div class="toast" id="toast"></div>';
  $("#so").onclick=function(){auth.signOut()};$("#mOpen").onclick=function(){$("#side").classList.add("open");$("#scrim").classList.add("on")};$("#scrim").onclick=closeSide;
  if($("#demoReset"))$("#demoReset").onclick=function(){if(confirmDo("Clear all demo data in this browser?")){J.resetDemo();location.reload()}};
  $("#nav").addEventListener("click",function(e){var b=e.target.closest("[data-tab]");if(!b)return;if(S.edit&&!confirmDo("Leave without saving?"))return;S.tab=b.dataset.tab;S.view=null;S.edit=null;closeSide();render();scrollTo(0,0)});
  $("#main").addEventListener("click",onClick);$("#main").addEventListener("submit",onSubmit);$("#main").addEventListener("change",onChange);$("#main").addEventListener("input",onInput);
  render()}
function closeSide(){$("#side").classList.remove("open");$("#scrim").classList.remove("on")}
function navCounts(){var n=S.req.filter(function(r){return (r.status||"new")==="new"&&inRegion(r)}).length,grp="",h="";
  NAV.forEach(function(x){if(x[3]&&!can(x[3]))return;if(x[0]!==grp){grp=x[0];h+='<div class="grp">'+grp+'</div>'}
    h+='<button class="nv'+(S.tab===x[1]?" on":"")+'" data-tab="'+x[1]+'">'+ic({today:"today",req:"req",quote:"quote",jobs:"job",cust:"cust",prod:"prod",hero:"hero",site:"site",team:"team",setup:"setup",seo:"site",blog:"quote",work:"prod"}[x[1]])+'<span>'+x[2]+'</span>'+(x[1]==="req"&&n?'<span class="cnt">'+n+'</span>':'')+'</button>'});
  $("#nav").innerHTML=h}
function top(t,sub,acts,noRegion){return '<div class="top"><div><h1>'+t+'</h1>'+(sub?'<p>'+sub+'</p>':'')+'</div><div class="acts">'+(acts||"")+(noRegion?"":rsw())+'</div></div>'}
function rsw(){return '<div class="rsw">'+[["all","Both"],["gta","GTA"],["sk","Saskatchewan"]].map(function(r){return '<button type="button" data-region="'+r[0]+'" class="'+(S.region===r[0]?"on":"")+'">'+r[1]+'</button>'}).join("")+'</div>'}
function render(){if(!$("#main"))return;navCounts();var f={today:vToday,req:vReq,quote:vQuote,jobs:vJobs,cust:vCust,prod:vProd,hero:vHero,site:vSite,team:vTeam,setup:vSetup,seo:vSeo,blog:vBlog,work:vWork}[S.tab]||vToday;$("#main").innerHTML=f();after()}
function after(){$$("img[data-pimg]").forEach(function(i){loadPimg(i.dataset.pimg)});if(S.tab==="quote"&&S.edit)qPreview()}

/* ======================= TODAY / DAY SUMMARY ======================= */
function vToday(){var d=S.day,R=S.req.filter(inRegion),Q=S.quotes.filter(inRegion),Jb=S.jobs.filter(inRegion);
  var newReq=R.filter(function(r){return dayOf(r.createdAt)===d}),sent=Q.filter(function(q){return dayOf(q.sentAt)===d}),acc=Q.filter(function(q){return q.status==="accepted"&&dayOf(q.response&&q.response.at)===d}),
    jobs=Jb.filter(function(j){return j.date===d}).sort(function(a,b){return (a.time||"99").localeCompare(b.time||"99")}),done=jobs.filter(function(j){return j.status==="done"}),
    quotedAmt=Q.filter(function(q){return dayOf(q.createdAt)===d}).reduce(function(a,q){return a+J.quoteTotals(q).total},0),accAmt=acc.reduce(function(a,q){return a+J.quoteTotals(q).total},0),
    doneAmt=done.reduce(function(a,j){return a+(+j.amount||0)},0);
  var stale=R.filter(function(r){return (r.status||"new")==="new"&&Date.now()-new Date(r.createdAt)>864e5}),waiting=Q.filter(function(q){return q.status==="sent"&&Date.now()-new Date(q.sentAt)>7*864e5}),
    unassigned=Jb.filter(function(j){return j.date>=ymd()&&j.status==="scheduled"&&!j.assignedTo});
  var isToday=d===ymd();
  return top(isToday?"Today":"Day summary",nice(d)+(isToday?" · here's your day":""),'<div class="daynav noprint"><button class="icon-b" data-act="day" data-n="-1" aria-label="Previous day">‹</button><input class="inp" type="date" id="dayIn" value="'+d+'"><button class="icon-b" data-act="day" data-n="1" aria-label="Next day">›</button></div><button class="btn g noprint" data-act="print">'+ic("print")+'Print</button><button class="btn o noprint" data-act="copysum">Copy summary</button>')+
  '<div class="kpis"><div class="kpi" style="--c:#F96302"><b>'+newReq.length+'</b><span>New requests</span></div><div class="kpi" style="--c:#2F6FED"><b>'+jobs.length+'</b><span>Jobs booked · '+done.length+' done</span></div>'+
  '<div class="kpi" style="--c:#B26A00"><b>'+sent.length+'</b><span>Quotes sent</span></div><div class="kpi" style="--c:#2E7D32"><b>'+money(accAmt)+'</b><span>'+acc.length+' quote(s) accepted</span></div>'+
  '<div class="kpi" style="--c:#7E57C2"><b>'+money(quotedAmt)+'</b><span>Quoted today</span></div><div class="kpi" style="--c:#0E9FC9"><b>'+money(doneAmt)+'</b><span>Jobs completed value</span></div></div>'+
  '<div class="two wide"><div><div class="card"><h3>Jobs '+(isToday?"today":"this day")+' <button class="btn sm noprint" data-act="newjob" data-date="'+d+'">'+ic("plus")+'New job</button></h3>'+(jobs.length?jobs.map(jobCard).join(""):'<div class="emp">No jobs booked for this day.</div>')+'</div>'+
  '<div class="card"><h3>New requests</h3>'+(newReq.length?reqTable(newReq):'<div class="emp">No new requests this day.</div>')+'</div></div>'+
  '<div><div class="card"><h3>Needs attention</h3>'+((stale.length||waiting.length||unassigned.length)?'<ul class="att">'+
    (stale.length?'<li><button class="lnk" data-tab2="req" data-f="new">'+stale.length+' request(s)</button> waiting more than a day for a reply</li>':'')+
    (waiting.length?'<li><button class="lnk" data-tab2="quote" data-f="sent">'+waiting.length+' quote(s)</button> sent over a week ago with no answer — follow up</li>':'')+
    (unassigned.length?'<li><button class="lnk" data-tab2="jobs" data-f="list">'+unassigned.length+' upcoming job(s)</button> with no technician assigned</li>':'')+'</ul>':'<div class="emp">All caught up 👍</div>')+'</div>'+
  '<div class="card"><h3>Quotes</h3>'+((sent.length||acc.length)?'<table class="tbl"><tbody>'+sent.concat(acc.filter(function(q){return sent.indexOf(q)<0})).map(function(q){return '<tr class="clk" data-q="'+esc(q._id)+'"><td><b>'+esc(q.number)+'</b><br><small>'+esc(cname(q.customer))+'</small></td><td>'+pill(q.status)+'</td><td style="text-align:right">'+money(J.quoteTotals(q).total)+'</td></tr>'}).join("")+'</tbody></table>':'<div class="emp">No quote activity this day.</div>')+
  '<div class="acts noprint" style="margin-top:14px"><button class="btn sm" data-act="newquote">'+ic("plus")+'New quotation</button></div></div>'+
  '<div class="card noprint"><h3>Quick links</h3><div class="acts"><a class="btn g sm" href="'+SITE.gta+'" target="_blank" rel="noopener">GTA website '+ic("ext")+'</a><a class="btn g sm" href="'+SITE.sk+'" target="_blank" rel="noopener">Saskatchewan website '+ic("ext")+'</a></div></div></div></div>'}
function daySummaryText(){var d=S.day,R=S.req.filter(inRegion),Q=S.quotes.filter(inRegion),jobs=S.jobs.filter(function(j){return inRegion(j)&&j.date===d}).sort(function(a,b){return (a.time||"").localeCompare(b.time||"")});
  var L=["Jora Mechanical — day summary "+d+(S.region!=="all"?" ("+RNAME[S.region]+")":""),"","JOBS ("+jobs.length+")"];
  jobs.forEach(function(j){L.push("• "+t12(j.time)+" — "+(j.title||svcName(j.service))+" — "+cname(j.customer)+", "+(j.customer&&j.customer.city||"")+" — "+(j.assignedTo||"unassigned")+" — "+j.status)});
  var nr=R.filter(function(r){return dayOf(r.createdAt)===d});L.push("","NEW REQUESTS ("+nr.length+")");nr.forEach(function(r){L.push("• "+r.ref+" — "+(r.serviceName||"")+" — "+cname(r.contact)+" "+(r.contact&&r.contact.phone||""))});
  var qs=Q.filter(function(q){return dayOf(q.sentAt)===d||dayOf(q.response&&q.response.at)===d});L.push("","QUOTES ("+qs.length+")");qs.forEach(function(q){L.push("• "+q.number+" — "+cname(q.customer)+" — "+q.status+" — "+money(J.quoteTotals(q).total))});
  return L.join("\n")}
function jobCard(j){var c=j.customer||{};return '<div class="jobc" style="--c:'+jcol(j.status)+'" data-j="'+esc(j._id)+'"><div class="t">'+t12(j.time)+'<small>'+(j.hours?esc(j.hours)+" h":"")+'</small></div><div><b>'+esc(j.title||svcName(j.service))+'</b> '+rpill(j.region)+'<br><span class="mut">'+esc(cname(c))+' · '+esc([caddr(c),c.city].filter(Boolean).join(", "))+'</span><br><small class="mut">'+(j.assignedTo?'👷 '+esc(j.assignedTo):'No technician yet')+'</small></div>'+
  '<div class="acts">'+pill(j.status)+(j.status!=="done"&&j.status!=="cancelled"&&can("jobs")?'<button class="btn sm ok noprint" data-act="jobdone" data-id="'+esc(j._id)+'">Done</button>':'')+'</div></div>'}

/* ======================= REQUESTS ======================= */
var RST=["new","contacted","quoted","scheduled","won","lost"];
function reqTable(L){return '<div class="tblw"><table class="tbl rsp"><thead><tr><th>Received</th><th>Customer</th><th>Service</th><th>Area</th><th>Status</th></tr></thead><tbody>'+L.map(function(r){var c=r.contact||{};
  return '<tr class="clk" data-r="'+esc(r._id)+'"><td data-l="Received">'+niceT(r.createdAt)+'<br><small>'+esc(r.ref||"")+'</small></td><td data-l="Customer"><b>'+esc(cname(c))+'</b><br><small>'+esc(c.phone||c.email||"")+'</small></td><td data-l="Service">'+esc(r.serviceName||svcName(r.service))+(r.source&&r.source!=="website"?'<br><small>via '+esc(r.source)+'</small>':'')+'</td><td data-l="Area">'+esc(c.city||c.postal||"")+' '+rpill(r.region)+'</td><td data-l="Status">'+pill(r.status)+'</td></tr>'}).join("")+'</tbody></table></div>'}
function vReq(){if(S.view)return reqDetail(S.req.find(function(r){return r._id===S.view}));
  var L=S.req.filter(inRegion).filter(function(r){return S.f.req==="all"||(r.status||"new")===S.f.req}).filter(qmatch);
  return top("Requests","Quote requests, chats and customer-account requests from both websites.")+'<div class="bar"><input class="inp" type="search" placeholder="Search name, phone, city, ref…" data-search value="'+esc(S.f.q)+'"><div class="chips">'+["all"].concat(RST).map(function(s){var n=s==="all"?"":" ("+S.req.filter(inRegion).filter(function(r){return (r.status||"new")===s}).length+")";return '<button data-fr="'+s+'" class="'+(S.f.req===s?"on":"")+'">'+(s==="all"?"All":s[0].toUpperCase()+s.slice(1))+n+'</button>'}).join("")+'</div></div>'+
  '<div class="card">'+(L.length?reqTable(L):'<div class="emp">'+(S.req.length?"Nothing matches.":"No requests yet. When customers send a quote request, a chat message or a request from their account, it shows up here — and you get an email.")+'</div>')+'</div>'}
function qmatch(x){var q=S.f.q.toLowerCase();if(!q)return true;return JSON.stringify(x).toLowerCase().indexOf(q)>-1}
function reqDetail(r){if(!r){S.view=null;return vReq()}var c=r.contact||{},a=r.answers||{},addr=[caddr(c),c.city,c.province,c.postal].filter(Boolean).join(", ");
  var rows=Object.keys(a).filter(function(k){return a[k]!==""&&a[k]!=null&&k!=="chat"}).map(function(k){var v=a[k];return '<dt>'+esc(k.replace(/([A-Z])/g," $1").replace(/^./,function(x){return x.toUpperCase()}))+'</dt><dd>'+esc(Array.isArray(v)?v.join(", "):typeof v==="object"?JSON.stringify(v):v)+'</dd>'}).join("");
  var hist=S.quotes.filter(function(q){return (c.email&&q.customerEmail===c.email.toLowerCase())||q.requestRef===r.ref});
  return '<button class="btn g sm back" data-act="back">‹ All requests</button>'+top(esc(r.serviceName||svcName(r.service)),'Ref '+esc(r.ref||r._id)+' · received '+niceT(r.createdAt)+' '+rpill(r.region),"",true)+
  '<div class="two wide"><div><div class="card"><h3>Customer</h3><dl class="dl"><dt>Name</dt><dd><b>'+esc(cname(c))+'</b></dd>'+(c.phone?'<dt>Phone</dt><dd><a href="tel:'+esc(digits(c.phone))+'">'+esc(c.phone)+'</a></dd>':'')+(c.email?'<dt>Email</dt><dd><a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a></dd>':'')+(addr?'<dt>Address</dt><dd>'+esc(addr)+'</dd>':'')+(c.prefTime?'<dt>Best time</dt><dd>'+esc(c.prefTime)+'</dd>':'')+'</dl>'+
  '<div class="acts" style="margin-top:16px">'+(c.phone?'<a class="btn sm" href="tel:'+esc(digits(c.phone))+'">'+ic("phone")+'Call</a>':'')+(c.email?'<a class="btn o sm" href="mailto:'+esc(c.email)+'?subject='+encodeURIComponent("Your request "+(r.ref||"")+" — Jora Mechanical")+'">'+ic("mail")+'Email</a>':'')+(addr?'<a class="btn g sm" href="'+maps(addr)+'" target="_blank" rel="noopener">'+ic("map")+'Map</a>':'')+'</div></div>'+
  '<div class="card"><h3>What they asked for</h3>'+(rows?'<dl class="dl">'+rows+'</dl>':'<p class="mut">No extra details.</p>')+(a.chat?'<details style="margin-top:12px"><summary>Chat history</summary><pre style="white-space:pre-wrap;font:inherit;color:#444">'+esc(a.chat)+'</pre></details>':'')+'</div></div>'+
  '<div><div class="card"><h3>Status</h3><div class="chips" style="margin-bottom:16px">'+RST.map(function(s){return '<button data-rst="'+s+'" data-id="'+esc(r._id)+'" class="'+((r.status||"new")===s?"on":"")+'">'+s+'</button>'}).join("")+'</div>'+
  '<form data-form="rnote" data-id="'+esc(r._id)+'"><label class="f"><span>Office notes <small>(only the team sees these)</small></span><textarea class="inp" name="notes">'+esc(r.notes||"")+'</textarea></label><button class="btn g sm">Save notes</button></form></div>'+
  (can("work")?'<div class="card"><h3>Next step</h3><div class="acts"><button class="btn" data-act="req2quote" data-id="'+esc(r._id)+'">'+ic("quote")+'Create quotation</button><button class="btn o" data-act="req2job" data-id="'+esc(r._id)+'">'+ic("job")+'Schedule job</button><button class="btn g" data-act="req2cust" data-id="'+esc(r._id)+'">Save to customers</button></div>'+
  (hist.length?'<p style="margin:16px 0 6px"><b>Quotes for this customer</b></p>'+hist.map(function(q){return '<div><button class="lnk" data-q="'+esc(q._id)+'">'+esc(q.number)+'</button> '+pill(q.status)+' '+money(J.quoteTotals(q).total)+'</div>'}).join(""):'')+
  (can("site")?'<p style="margin-top:18px"><button class="btn red sm" data-act="delreq" data-id="'+esc(r._id)+'">Delete request</button></p>':'')+'</div>':'')+'</div></div>'}
function reqToCustomer(r){var c=r.contact||{};return {name:cname(c),email:(c.email||"").toLowerCase(),phone:c.phone||"",address:caddr(c),city:c.city||"",postal:(c.postal||"").toUpperCase(),region:r.region||"gta"}}

/* ======================= CUSTOMERS ======================= */
function upsertCustomer(c,extra){if(!c||(!c.email&&!c.phone))return Promise.resolve();var id=custKey(c),ex=S.cust.find(function(x){return x._id===id})||{};
  var d=Object.assign({},ex,{name:c.name||ex.name||"",email:c.email||ex.email||"",phone:c.phone||ex.phone||"",address:c.address||ex.address||"",city:c.city||ex.city||"",postal:c.postal||ex.postal||"",region:c.region||ex.region||"gta",updatedAt:J.now()},extra||{});
  delete d._id;if(!d.createdAt)d.createdAt=J.now();return db.collection("customers").doc(id).set(d)}
function allCustomers(){var m={};S.cust.forEach(function(c){m[c._id]=Object.assign({},c)});
  S.users.forEach(function(u){if(!u.email)return;var id=custKey(u);m[id]=Object.assign({name:u.name,email:u.email,phone:u.phone,address:u.address,city:u.city,postal:u.postal,region:u.region,createdAt:u.createdAt},m[id]||{},{_id:id,account:true,uid:u._id})});
  return Object.keys(m).map(function(k){return m[k]}).sort(function(a,b){return (a.name||"").localeCompare(b.name||"")})}
function vCust(){if(S.view)return custDetail(allCustomers().find(function(c){return c._id===S.view}));
  var L=allCustomers().filter(inRegion).filter(qmatch);
  return top("Customers","Everyone you've quoted, booked or who has an online account.",can("work")?'<button class="btn" data-act="newcust">'+ic("plus")+'Add customer</button>':'')+
  '<div class="bar"><input class="inp" type="search" placeholder="Search name, phone, email, city…" data-search value="'+esc(S.f.q)+'"><span class="mut">'+L.length+' customer(s)</span></div>'+
  (S.edit&&S.edit.kind==="cust"?custForm(S.edit.data):'')+
  '<div class="card">'+(L.length?'<div class="tblw"><table class="tbl rsp"><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>City</th><th></th></tr></thead><tbody>'+L.map(function(c){return '<tr class="clk" data-c="'+esc(c._id)+'"><td data-l="Name"><b>'+esc(c.name||"—")+'</b></td><td data-l="Phone">'+esc(c.phone||"")+'</td><td data-l="Email">'+esc(c.email||"")+'</td><td data-l="City">'+esc(c.city||"")+' '+rpill(c.region)+'</td><td>'+(c.account?'<span class="pill sent">Online account</span>':'')+'</td></tr>'}).join("")+'</tbody></table></div>':'<div class="emp">No customers yet.</div>')+'</div>'}
function custForm(c){c=c||{};return '<div class="card"><h3>'+(c._id?"Edit customer":"New customer")+'</h3><form data-form="cust" data-id="'+esc(c._id||"")+'"><div class="grid2"><label class="f"><span>Name</span><input class="inp" name="name" value="'+esc(c.name||"")+'" required></label><label class="f"><span>Phone</span><input class="inp" name="phone" value="'+esc(c.phone||"")+'"></label>'+
  '<label class="f"><span>Email</span><input class="inp" name="email" type="email" value="'+esc(c.email||"")+'"></label><label class="f"><span>Region</span><select class="inp" name="region"><option value="gta">GTA</option><option value="sk"'+(c.region==="sk"?" selected":"")+'>Saskatchewan</option></select></label>'+
  '<label class="f"><span>Street address</span><input class="inp" name="address" value="'+esc(c.address||"")+'"></label><div class="grid2"><label class="f"><span>City</span><input class="inp" name="city" value="'+esc(c.city||"")+'"></label><label class="f"><span>Postal code</span><input class="inp" name="postal" value="'+esc(c.postal||"")+'"></label></div></div>'+
  '<label class="f"><span>Notes</span><textarea class="inp" name="notes">'+esc(c.notes||"")+'</textarea></label><div class="acts"><button class="btn">Save customer</button><button class="btn g" type="button" data-act="cancel">Cancel</button></div></form></div>'}
function custDetail(c){if(!c){S.view=null;return vCust()}var em=(c.email||"").toLowerCase(),ph=digits(c.phone);
  var R=S.req.filter(function(r){var x=r.contact||{};return (em&&(x.email||"").toLowerCase()===em)||(ph&&digits(x.phone)===ph)}),Q=S.quotes.filter(function(q){return (em&&q.customerEmail===em)||(ph&&digits(q.customer&&q.customer.phone)===ph)}),
    Jb=S.jobs.filter(function(j){var x=j.customer||{};return (em&&(x.email||"").toLowerCase()===em)||(ph&&digits(x.phone)===ph)});
  var addr=[c.address,c.city,c.postal].filter(Boolean).join(", ");
  return '<button class="btn g sm back" data-act="back">‹ All customers</button>'+top(esc(c.name||"Customer"),(c.account?'Has an online account · ':'')+'Customer since '+nice(dayOf(c.createdAt)),"",true)+(S.edit&&S.edit.kind==="cust"?custForm(S.edit.data):'')+
  '<div class="two wide"><div><div class="card"><h3>Details '+(can("work")?'<button class="btn g sm" data-act="editcust" data-id="'+esc(c._id)+'">Edit</button>':'')+'</h3><dl class="dl">'+(c.phone?'<dt>Phone</dt><dd><a href="tel:'+ph+'">'+esc(c.phone)+'</a></dd>':'')+(c.email?'<dt>Email</dt><dd><a href="mailto:'+esc(c.email)+'">'+esc(c.email)+'</a></dd>':'')+(addr?'<dt>Address</dt><dd>'+esc(addr)+' · <a href="'+maps(addr)+'" target="_blank" rel="noopener">map</a></dd>':'')+'<dt>Region</dt><dd>'+rpill(c.region||"gta")+'</dd>'+(c.notes?'<dt>Notes</dt><dd>'+esc(c.notes)+'</dd>':'')+'</dl>'+
  (can("work")?'<div class="acts" style="margin-top:16px"><button class="btn sm" data-act="cust2quote" data-id="'+esc(c._id)+'">New quotation</button><button class="btn o sm" data-act="cust2job" data-id="'+esc(c._id)+'">New job</button></div>':'')+'</div>'+
  '<div class="card"><h3>Jobs</h3>'+(Jb.length?Jb.map(jobCard).join(""):'<div class="emp">No jobs yet.</div>')+'</div></div><div><div class="card"><h3>Quotations</h3>'+(Q.length?Q.map(function(q){return '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #f0f1f3"><button class="lnk" data-q="'+esc(q._id)+'">'+esc(q.number)+'</button>'+pill(q.status)+'<b>'+money(J.quoteTotals(q).total)+'</b></div>'}).join(""):'<div class="emp">No quotations yet.</div>')+'</div>'+
  '<div class="card"><h3>Requests</h3>'+(R.length?reqTable(R):'<div class="emp">No requests.</div>')+'</div></div></div>'}

/* ======================= QUOTATIONS ======================= */
var QST=["draft","sent","accepted","declined"];
function vQuote(){if(S.edit&&S.edit.kind==="quote")return quoteEditor();
  var L=S.quotes.filter(inRegion).filter(function(q){return S.f.quote==="all"||q.status===S.f.quote}).filter(qmatch);
  var open=S.quotes.filter(inRegion).filter(function(q){return q.status==="sent"}).reduce(function(a,q){return a+J.quoteTotals(q).total},0),won=S.quotes.filter(inRegion).filter(function(q){return q.status==="accepted"}).reduce(function(a,q){return a+J.quoteTotals(q).total},0);
  return top("Quotations","Build a quote, send it to the customer, and see when they accept.",can("work")?'<button class="btn" data-act="newquote">'+ic("plus")+'New quotation</button>':'')+
  '<div class="kpis"><div class="kpi" style="--c:#2F6FED"><b>'+money(open)+'</b><span>Waiting for an answer</span></div><div class="kpi" style="--c:#2E7D32"><b>'+money(won)+'</b><span>Accepted</span></div><div class="kpi" style="--c:#B26A00"><b>'+S.quotes.filter(inRegion).filter(function(q){return q.status==="draft"}).length+'</b><span>Drafts</span></div></div>'+
  '<div class="bar"><input class="inp" type="search" placeholder="Search number, customer…" data-search value="'+esc(S.f.q)+'"><div class="chips">'+["all"].concat(QST).map(function(s){return '<button data-fq="'+s+'" class="'+(S.f.quote===s?"on":"")+'">'+(s==="all"?"All":s[0].toUpperCase()+s.slice(1))+'</button>'}).join("")+'</div></div>'+
  '<div class="card">'+(L.length?'<div class="tblw"><table class="tbl rsp"><thead><tr><th>Quote</th><th>Customer</th><th>Date</th><th>Status</th><th style="text-align:right">Total</th></tr></thead><tbody>'+L.map(function(q){return '<tr class="clk" data-q="'+esc(q._id)+'"><td data-l="Quote"><b>'+esc(q.number)+'</b><br><small>'+esc(q.title||"")+'</small></td><td data-l="Customer">'+esc(cname(q.customer))+'<br><small>'+esc(q.customer&&q.customer.phone||"")+'</small></td><td data-l="Date">'+nice(dayOf(q.sentAt||q.createdAt))+' '+rpill(q.region)+'</td><td data-l="Status">'+pill(q.status)+'</td><td data-l="Total" style="text-align:right"><b>'+money(J.quoteTotals(q).total)+'</b></td></tr>'}).join("")+'</tbody></table></div>':'<div class="emp">No quotations yet. Press <b>New quotation</b> to make one.</div>')+'</div>'}
function newQuote(seed){var r=(seed&&seed.region)||(S.region==="all"?"gta":S.region),d=new Date();d.setDate(d.getDate()+30);
  return Object.assign({_new:true,_id:J.rid(20),number:qNumber(),region:r,status:"draft",title:"",customer:{name:"",email:"",phone:"",address:"",city:"",postal:""},items:[{desc:"",qty:1,price:0}],discount:0,depositPct:0,validUntil:ymd(d),notes:"",terms:J.DEFAULT_TERMS,taxMode:"std"},seed||{})}
function openQuote(q){S.tab="quote";S.view=null;S.edit={kind:"quote",data:JSON.parse(JSON.stringify(q))};render();scrollTo(0,0)}
function quoteEditor(){var q=S.edit.data,c=q.customer||{},ro=!can("work");loadCat(q.region).then(function(){var dl=$("#prodList");if(dl&&!dl.children.length)dl.innerHTML=catOptions(q.region)});
  return '<button class="btn g sm back" data-act="qclose">‹ All quotations</button>'+top((q._new?"New quotation":"Quotation "+esc(q.number)),pill(q.status)+(q.response&&q.response.at?' · '+esc(q.status)+' by '+esc(q.response.name||"customer")+' on '+niceT(q.response.at)+(q.response.note?' — “'+esc(q.response.note)+'”':''):''),"",true)+
  '<div class="two"><form class="card" data-form="quote" id="qf"'+(ro?' inert':'')+'><h3>Customer</h3><div class="grid2"><label class="f"><span>Name</span><input class="inp" name="c.name" list="custList" value="'+esc(c.name)+'" required></label><label class="f"><span>Phone</span><input class="inp" name="c.phone" value="'+esc(c.phone)+'"></label>'+
  '<label class="f"><span>Email <small>(for sending the quote)</small></span><input class="inp" name="c.email" type="email" value="'+esc(c.email)+'"></label><label class="f"><span>Website / tax</span><select class="inp" name="region"><option value="gta">GTA — HST 13%</option><option value="sk"'+(q.region==="sk"?" selected":"")+'>Saskatchewan — GST 5% + PST 6%</option></select></label>'+
  '<label class="f"><span>Address</span><input class="inp" name="c.address" value="'+esc(c.address)+'"></label><div class="grid2"><label class="f"><span>City</span><input class="inp" name="c.city" value="'+esc(c.city)+'"></label><label class="f"><span>Postal code</span><input class="inp" name="c.postal" value="'+esc(c.postal)+'"></label></div></div>'+
  '<datalist id="custList">'+allCustomers().slice(0,500).map(function(x){return '<option value="'+esc(x.name)+'">'+esc([x.phone,x.email].filter(Boolean).join(" · "))+'</option>'}).join("")+'</datalist>'+
  '<h3 style="margin-top:8px">Work</h3><label class="f"><span>Project title</span><input class="inp" name="title" value="'+esc(q.title)+'" placeholder="e.g. Furnace and AC replacement"></label>'+
  '<div class="li h"><span>Description</span><span>Qty</span><span>Unit price</span><span class="tot">Amount</span><span></span></div><div id="items">'+q.items.map(itemRow).join("")+'</div>'+
  '<div class="acts" style="margin:6px 0 18px"><button class="btn g sm" type="button" data-act="additem">'+ic("plus")+'Add line</button><input class="inp" list="prodList" id="addProd" placeholder="Add a product from the website…" style="max-width:300px;min-height:34px"><datalist id="prodList">'+catOptions(q.region)+'</datalist>'+
  ["Labour — installation","Permit & inspection","Removal & disposal of old equipment","Smart thermostat","Service call / diagnostic"].map(function(x){return '<button class="btn g sm" type="button" data-act="quick" data-t="'+esc(x)+'">+ '+esc(x.split(" ")[0])+'</button>'}).join("")+'</div>'+
  '<div class="grid3"><label class="f"><span>Discount ($)</span><input class="inp" name="discount" type="number" min="0" step="0.01" value="'+esc(q.discount||0)+'"></label><label class="f"><span>Deposit to book (%)</span><input class="inp" name="depositPct" type="number" min="0" max="100" step="1" value="'+esc(q.depositPct||0)+'"></label><label class="f"><span>Valid until</span><input class="inp" name="validUntil" type="date" value="'+esc(q.validUntil||"")+'"></label></div>'+
  '<label class="f"><span><input type="checkbox" name="notax"'+(q.taxMode==="none"?" checked":"")+'> No tax on this quote</span></label>'+
  '<label class="f"><span>Notes for the customer</span><textarea class="inp" name="notes" placeholder="What\'s included, timing, rebates…">'+esc(q.notes)+'</textarea></label><label class="f"><span>Terms</span><textarea class="inp" name="terms">'+esc(q.terms||"")+'</textarea></label>'+
  (ro?'':'<div class="acts"><button class="btn" type="submit">Save</button><button class="btn k" type="button" data-act="qsend">'+ic("mail")+'Send to customer</button><button class="btn g" type="button" data-act="qprint">'+ic("print")+'Print / PDF</button>'+(q._new?'':'<button class="btn g" type="button" data-act="qdup">Duplicate</button>')+
  (!q._new&&q.status==="accepted"?'<button class="btn ok" type="button" data-act="q2job">Book the job</button>':'')+(!q._new?'<button class="btn red" type="button" data-act="qdel">Delete</button>':'')+'</div>')+
  '<div id="sendBox"></div></form><div style="position:sticky;top:20px"><p class="mut tiny" style="margin:0 0 8px">Preview — this is what the customer sees</p><div id="qprev"></div></div></div>'}
function itemRow(i,n){return '<div class="li" data-i="'+n+'"><textarea class="inp" name="desc" rows="1" style="min-height:44px">'+esc(i.desc)+'</textarea><input class="inp" name="qty" type="number" step="any" value="'+esc(i.qty)+'"><input class="inp" name="price" type="number" step="0.01" value="'+esc(i.price)+'"><span class="tot">'+money((+i.qty||0)*(+i.price||0))+'</span><button class="x" type="button" data-act="delitem" aria-label="Remove line">×</button></div>'}
function catOptions(r){var c=S.cat[r];if(!c)return "";var L=c.products.map(function(p){return p.brand+" "+p.name}).concat((pubOf(r).extra||[]).map(function(p){return p.brand+" "+p.name}));return L.map(function(x){return '<option value="'+esc(x)+'">'}).join("")}
function syncQuote(){var f=$("#qf");if(!f||!S.edit||S.edit.kind!=="quote")return;var q=S.edit.data;
  q.customer={name:val(f,"c.name"),phone:val(f,"c.phone"),email:val(f,"c.email"),address:val(f,"c.address"),city:val(f,"c.city"),postal:val(f,"c.postal").toUpperCase()};
  q.region=val(f,"region");q.title=val(f,"title");q.discount=+val(f,"discount")||0;q.depositPct=+val(f,"depositPct")||0;q.validUntil=val(f,"validUntil");q.notes=f.elements.notes.value;q.terms=f.elements.terms.value;q.taxMode=val(f,"notax")?"none":"std";
  q.items=$$("#items .li").map(function(r){return {desc:r.querySelector("[name=desc]").value,qty:+r.querySelector("[name=qty]").value||0,price:+r.querySelector("[name=price]").value||0}});
  $$("#items .li").forEach(function(r,i){r.querySelector(".tot").textContent=money(q.items[i].qty*q.items[i].price)})}
function qPreview(){var p=$("#qprev");if(p&&S.edit)p.innerHTML=J.quoteHTML(S.edit.data,{logo:LOGO,status:true})}
function quoteDoc(q){var d=JSON.parse(JSON.stringify(q));delete d._new;delete d._id;d.customerEmail=(d.customer.email||"").toLowerCase();d.total=Math.round(J.quoteTotals(d).total*100)/100;d.updatedAt=J.now();if(!d.createdAt){d.createdAt=J.now();d.createdBy=S.user.email}return d}
function saveQuote(extra){syncQuote();var q=S.edit.data;if(!q.customer.name){toast("Add the customer's name first");return Promise.reject(new Error("name"))}
  Object.assign(q,extra||{});var d=quoteDoc(q);return db.collection("quotes").doc(q._id).set(d).then(function(){q._new=false;q.createdAt=d.createdAt;upsertCustomer(Object.assign({region:q.region},q.customer)).catch(function(){});
    if(q.requestRef){var r=S.req.find(function(x){return x.ref===q.requestRef||x._id===q.requestRef});if(r&&["new","contacted"].indexOf(r.status||"new")>-1)db.collection("requests").doc(r._id).update({status:"quoted"}).catch(function(){})}return q})}
function sendBox(){var q=S.edit.data,link=quoteLink(q._id,true),em=q.customer.email,t=J.quoteTotals(q),direct=!!(J.cfg.emailjs&&J.cfg.emailjs.serviceId);
  var body="Hi "+(q.customer.name||"").split(" ")[0]+",\n\nThank you for choosing Jora Mechanical Systems. Your quotation "+q.number+(q.title?" for "+q.title:"")+" is ready.\n\nTotal: "+money(t.total)+" (CAD, incl. tax)\n\nView, print or accept it here:\n"+link+"\n\nAny questions, just reply or call 905-667-2823.\n\nJora Mechanical Systems\ninfo@joramechanicalsystems.com";
  $("#sendBox").innerHTML='<div class="card" style="margin-top:18px;background:#fafbfc"><h3>Send quotation '+esc(q.number)+'</h3>'+(em?'<p>To: <b>'+esc(em)+'</b></p>':'<p class="err on">Add the customer\'s email above to send it by email. You can still copy the link and text it.</p>')+
  '<label class="f"><span>Message</span><textarea class="inp" id="sendMsg" rows="9">'+esc(body)+'</textarea></label><div class="acts">'+
  (direct&&em?'<button class="btn" type="button" data-act="sendDirect">Send now</button>':'')+(em?'<a class="btn '+(direct?"o":"")+'" id="sendMail" href="#" data-act="sendMail">Open in my email</a>':'')+'<button class="btn g" type="button" data-act="copyLink">Copy link</button><a class="btn g" href="'+quoteLink(q._id)+'&preview=1" target="_blank" rel="noopener">Open customer page '+ic("ext")+'</a></div>'+
  (direct?'':'<p class="mut tiny" style="margin:12px 0 0">“Open in my email” opens your email app with the message ready — press send there. To send straight from this panel, connect EmailJS in Setup.</p>')+'</div>';
  $("#sendBox").scrollIntoView({behavior:"smooth",block:"center"})}
function markSent(){var q=S.edit.data;if(q.status==="draft"||!q.status)return saveQuote({status:"sent",sentAt:J.now()});return saveQuote({sentAt:q.sentAt||J.now()})}

/* ======================= JOBS ======================= */
function vJobs(){if(S.edit&&S.edit.kind==="job")return jobForm(S.edit.data);var m=S.f.jobs,d=S.day,L=S.jobs.filter(inRegion);
  var head=top("Jobs","Schedule installs and service calls, assign technicians, and mark them done.",can("jobs")?'<button class="btn" data-act="newjob" data-date="'+d+'">'+ic("plus")+'New job</button>':'')+
   '<div class="bar"><div class="chips">'+[["day","Day"],["week","Week"],["list","Upcoming"],["all","All"]].map(function(x){return '<button data-fj="'+x[0]+'" class="'+(m===x[0]?"on":"")+'">'+x[1]+'</button>'}).join("")+'</div>'+
   (m==="day"||m==="week"?'<div class="daynav"><button class="icon-b" data-act="day" data-n="'+(m==="week"?-7:-1)+'">‹</button><input class="inp" type="date" id="dayIn" value="'+d+'"><button class="icon-b" data-act="day" data-n="'+(m==="week"?7:1)+'">›</button><button class="btn g sm" data-act="today">Today</button></div>':'<input class="inp" type="search" placeholder="Search…" data-search value="'+esc(S.f.q)+'">')+'</div>';
  if(m==="day"){var D=L.filter(function(j){return j.date===d}).sort(function(a,b){return (a.time||"99").localeCompare(b.time||"99")});return head+'<div class="card"><h3>'+nice(d)+' <small>'+D.length+' job(s)</small></h3>'+(D.length?D.map(jobCard).join(""):'<div class="emp">Nothing booked. Press <b>New job</b> to add one.</div>')+'</div>'}
  if(m==="week"){var dt=new Date(d+"T12:00:00"),st=addDays(d,-((dt.getDay()+6)%7)),days=[0,1,2,3,4,5,6].map(function(i){return addDays(st,i)});
    return head+'<div class="week">'+days.map(function(x){var D=L.filter(function(j){return j.date===x}).sort(function(a,b){return (a.time||"99").localeCompare(b.time||"99")});return '<div class="d'+(x===ymd()?" today":"")+'"><h4>'+nice(x)+'</h4>'+D.map(function(j){return '<button class="j" style="--c:'+jcol(j.status)+'" data-j="'+esc(j._id)+'"><b>'+t12(j.time)+'</b> '+esc(cname(j.customer))+'<br><small>'+esc(j.title||svcName(j.service))+'</small></button>'}).join("")+'<button class="lnk tiny" data-act="newjob" data-date="'+x+'">+ add</button></div>'}).join("")+'</div>'}
  var U=(m==="list"?L.filter(function(j){return j.date>=ymd()&&j.status!=="cancelled"}).sort(function(a,b){return (a.date+(a.time||"")).localeCompare(b.date+(b.time||""))}):L).filter(qmatch);
  return head+'<div class="card">'+(U.length?U.map(function(j){return '<p style="margin:14px 0 6px;font-weight:700">'+nice(j.date)+'</p>'+jobCard(j)}).join(""):'<div class="emp">No jobs.</div>')+'</div>'}
function newJob(seed){return Object.assign({_new:true,_id:J.rid(20),region:S.region==="all"?"gta":S.region,title:"",service:"furnace",date:S.day,time:"09:00",hours:2,assignedTo:"",status:"scheduled",amount:"",notes:"",customer:{name:"",phone:"",email:"",address:"",city:"",postal:""}},seed||{})}
function teamNames(){return S.team.filter(function(t){return !t.disabled}).map(function(t){return t.name||t._id}).concat([S.user.displayName||S.user.email])}
function jobForm(j){var c=j.customer||{},ro=!can("jobs");return '<button class="btn g sm back" data-act="cancel">‹ Back to jobs</button>'+top(j._new?"New job":"Job — "+esc(cname(c)),j._new?"":pill(j.status)+" "+rpill(j.region),"",true)+
  '<form class="card" data-form="job"'+(ro?' inert':'')+'><div class="two"><div><h3>Customer</h3><label class="f"><span>Name</span><input class="inp" name="c.name" list="custList" value="'+esc(c.name)+'" required></label><div class="grid2"><label class="f"><span>Phone</span><input class="inp" name="c.phone" value="'+esc(c.phone)+'"></label><label class="f"><span>Email</span><input class="inp" name="c.email" type="email" value="'+esc(c.email)+'"></label></div>'+
  '<label class="f"><span>Address</span><input class="inp" name="c.address" value="'+esc(c.address)+'"></label><div class="grid2"><label class="f"><span>City</span><input class="inp" name="c.city" value="'+esc(c.city)+'"></label><label class="f"><span>Postal code</span><input class="inp" name="c.postal" value="'+esc(c.postal)+'"></label></div>'+
  '<datalist id="custList">'+allCustomers().slice(0,500).map(function(x){return '<option value="'+esc(x.name)+'">'+esc(x.phone||"")+'</option>'}).join("")+'</datalist>'+
  (c.address?'<a class="btn g sm" href="'+maps([c.address,c.city].join(", "))+'" target="_blank" rel="noopener">'+ic("map")+'Open in Maps</a>':'')+'</div>'+
  '<div><h3>The job</h3><div class="grid2"><label class="f"><span>Service</span><select class="inp" name="service">'+SVCS.map(function(s){return '<option value="'+s[0]+'"'+(j.service===s[0]?" selected":"")+'>'+s[1]+'</option>'}).join("")+'</select></label><label class="f"><span>Website</span><select class="inp" name="region"><option value="gta">GTA</option><option value="sk"'+(j.region==="sk"?" selected":"")+'>Saskatchewan</option></select></label></div>'+
  '<label class="f"><span>Short title</span><input class="inp" name="title" value="'+esc(j.title)+'" placeholder="e.g. Install Lennox furnace + AC"></label><div class="grid3"><label class="f"><span>Date</span><input class="inp" name="date" type="date" value="'+esc(j.date)+'" required></label><label class="f"><span>Start time</span><input class="inp" name="time" type="time" value="'+esc(j.time)+'"></label><label class="f"><span>Hours</span><input class="inp" name="hours" type="number" step="0.5" min="0" value="'+esc(j.hours)+'"></label></div>'+
  '<div class="grid2"><label class="f"><span>Technician</span><input class="inp" name="assignedTo" list="techList" value="'+esc(j.assignedTo)+'" placeholder="Who is going?"><datalist id="techList">'+teamNames().map(function(n){return '<option value="'+esc(n)+'">'}).join("")+'</datalist></label><label class="f"><span>Status</span><select class="inp" name="status">'+JOBST.map(function(s){return '<option value="'+s[0]+'"'+(j.status===s[0]?" selected":"")+'>'+s[0].replace(/-/g," ")+'</option>'}).join("")+'</select></label></div>'+
  '<label class="f"><span>Job value ($) <small>optional</small></span><input class="inp" name="amount" type="number" step="0.01" value="'+esc(j.amount)+'"></label><label class="f"><span>Notes for the technician</span><textarea class="inp" name="notes">'+esc(j.notes)+'</textarea></label></div></div>'+
  (j.quoteId?'<p>Linked quotation: <button class="lnk" type="button" data-q="'+esc(j.quoteId)+'">open</button></p>':'')+
  (ro?'':'<div class="acts"><button class="btn">Save job</button>'+(j._new?'':'<button class="btn ok" type="button" data-act="jobdone" data-id="'+esc(j._id)+'">Mark done</button><button class="btn red" type="button" data-act="jobdel" data-id="'+esc(j._id)+'">Delete</button>')+'<button class="btn g" type="button" data-act="cancel">Cancel</button></div>')+'</form>'}

/* ======================= PRODUCTS ======================= */
function siteRegion(){return S.region==="all"?(S.siteR||"gta"):S.region}
function regionPick(){return S.region==="all"?'<div class="rsw" style="margin-bottom:18px;width:max-content">'+["gta","sk"].map(function(r){return '<button type="button" data-siter="'+r+'" class="'+(siteRegion()===r?"on":"")+'">'+RNAME[r]+' website</button>'}).join("")+'</div>':''}
function vProd(){var r=siteRegion(),c=S.cat[r];if(!c){loadCat(r).then(render);return top("Products","Loading…")}
  if(S.edit&&S.edit.kind==="prod")return prodForm(S.edit.data,r);
  var P=Object.assign(defaultPub(),pubOf(r)),hid=P.hidden||[],fl=P.flags||{},hero=(P.hero&&P.hero.ids&&P.hero.ids.length)?P.hero.ids:c.products.filter(function(p){return p.img}).map(function(p){return p.id}),ex=P.extra||[];
  var groups={};c.products.forEach(function(p){(groups[p.cat]=groups[p.cat]||[]).push(p)});
  return top("Products","What shows on the "+RNAME[r]+" website. Add as many products as you like.",'<button class="btn" data-act="newprod">'+ic("plus")+'Add product</button><a class="btn g" href="'+SITE[r]+'" target="_blank" rel="noopener">View website '+ic("ext")+'</a>')+regionPick()+
  '<div class="card"><h3>Your added products <small>'+ex.length+' product(s)</small></h3>'+(ex.length?'<div class="plist">'+ex.map(function(p,i){return '<div class="pi'+(p.off?" off":"")+'">'+(p.imgDoc?'<img data-pimg="'+esc(p.imgDoc)+'" src="'+esc(S.pimg[p.imgDoc]||"")+'" alt="">':'<span class="ph"></span>')+'<div class="grow"><b>'+esc(p.name)+'</b><small>'+esc(p.brand)+' · '+esc((c.cats[p.cat]||{}).name||p.cat)+'</small><div class="tg"><button class="lnk" data-act="editprod" data-i="'+i+'">Edit</button>'+(p.off?'<span class="pill">hidden</span>':'')+(hero.indexOf(p.id)>-1?'<span class="pill sent">in hero</span>':'')+'</div></div></div>'}).join("")+'</div>':'<div class="emp">No added products yet. Press <b>Add product</b> — give it a photo, specs and features, and it appears on the website with its own page.</div>')+'</div>'+
  Object.keys(groups).map(function(k){return '<div class="card"><h3>'+esc((c.cats[k]||{}).name||k)+' <small>built-in models · switch off to hide from the website</small></h3><div class="plist">'+groups[k].map(function(p){var on=hid.indexOf(p.id)<0;return '<div class="pi'+(on?"":" off")+'"><img src="'+prodImg(p,r)+'" alt="" loading="lazy"><div class="grow"><b>'+esc(p.name)+'</b><small>'+esc(p.brand)+'</small><div class="tg">'+
    '<label><span class="sw"><input type="checkbox" data-vis="'+esc(p.id)+'"'+(on?" checked":"")+'><i></i></span> Show</label><label><input type="checkbox" data-hero="'+esc(p.id)+'"'+(hero.indexOf(p.id)>-1?" checked":"")+'> Hero</label>'+
    '<select class="inp" data-flag="'+esc(p.id)+'" style="min-height:30px;padding:2px 6px;width:auto;font-size:13px"><option value="__">Label: '+esc(p.flag||"none")+'</option>'+["","Top pick","Best value","New","On sale","Popular"].map(function(x){return '<option value="'+esc(x)+'"'+(Object.prototype.hasOwnProperty.call(fl,p.id)&&fl[p.id]===x?" selected":"")+'>'+(x||"No label")+'</option>'}).join("")+'</select></div></div></div>'}).join("")+'</div></div>'}).join("")}
function newProd(r){var c=S.cat[r],k=Object.keys(c.cats)[0];return {_new:true,id:"x-"+J.rid(10).toLowerCase(),cat:k,brand:"",name:"",model:"",tag:"",flag:"",specs:[{k:"",v:""}],feats:[],more:"",imgDoc:"",off:false}}
function prodForm(p,r){var c=S.cat[r],brands={};Object.keys(c.brands).forEach(function(k){c.brands[k].forEach(function(b){brands[b]=1})});
  return '<button class="btn g sm back" data-act="cancel">‹ Back to products</button>'+top(p._new?"Add product":"Edit "+esc(p.name),RNAME[r]+" website","",true)+
  '<form class="card" data-form="prod"><div class="two"><div><div class="grid2"><label class="f"><span>Category</span><select class="inp" name="cat">'+Object.keys(c.cats).map(function(k){return '<option value="'+k+'"'+(p.cat===k?" selected":"")+'>'+esc(c.cats[k].name)+'</option>'}).join("")+'</select></label>'+
  '<label class="f"><span>Brand</span><input class="inp" name="brand" list="brandList" value="'+esc(p.brand)+'" required><datalist id="brandList">'+Object.keys(brands).map(function(b){return '<option value="'+esc(b)+'">'}).join("")+'</datalist></label></div>'+
  '<label class="f"><span>Product name</span><input class="inp" name="name" value="'+esc(p.name)+'" placeholder="e.g. Lennox SL280V Furnace" required></label><div class="grid2"><label class="f"><span>Model</span><input class="inp" name="model" value="'+esc(p.model)+'" placeholder="e.g. SL280V"></label><label class="f"><span>Label <small>(optional)</small></span><input class="inp" name="flag" value="'+esc(p.flag)+'" placeholder="Top pick, New…"></label></div>'+
  '<label class="f"><span>Short description</span><input class="inp" name="tag" value="'+esc(p.tag)+'" placeholder="One line customers see on the card"></label>'+
  '<label class="f"><span>Features <small>(one per line — the first 3 show on the card)</small></span><textarea class="inp" name="feats">'+esc((p.feats||[]).join("\n"))+'</textarea></label>'+
  '<label class="f"><span>More details <small>(optional)</small></span><textarea class="inp" name="more">'+esc(p.more||"")+'</textarea></label></div>'+
  '<div><div class="f" style="margin-bottom:16px"><span style="display:block;font-weight:600;margin-bottom:6px">Photo</span><div class="photo"><div class="pv" id="pv" style="background-image:url(\''+esc(p.imgDoc?S.pimg[p.imgDoc]||"":p._img||"")+'\')"></div><div><input type="file" accept="image/*" id="pfile"><p class="mut tiny">A clear photo on a white background looks best. It\'s resized automatically.</p></div></div></div>'+
  '<span style="display:block;font-weight:600;margin-bottom:6px;font-size:14px">Specifications</span><div id="specs">'+(p.specs||[]).map(specRow).join("")+'</div><button class="btn g sm" type="button" data-act="addspec">'+ic("plus")+'Add spec</button>'+
  '<label class="f" style="margin-top:18px"><span><input type="checkbox" name="off"'+(p.off?" checked":"")+'> Hide from the website for now</span></label></div></div>'+
  '<div class="acts" style="margin-top:10px"><button class="btn">Save product</button>'+(p._new?'':'<button class="btn red" type="button" data-act="delprod">Delete</button>')+'<button class="btn g" type="button" data-act="cancel">Cancel</button></div></form>'}
function specRow(s){return '<div class="grid2" style="grid-template-columns:1fr 1fr 36px;gap:8px;margin-bottom:8px"><input class="inp" name="sk" value="'+esc(s.k)+'" placeholder="e.g. Efficiency"><input class="inp" name="sv" value="'+esc(s.v)+'" placeholder="e.g. 96% AFUE"><button class="x icon-b" type="button" data-act="delspec">×</button></div>'}

/* ======================= HERO ======================= */
function vHero(){var r=siteRegion(),c=S.cat[r];if(!c){loadCat(r).then(render);return top("Hero slider","Loading…")}
  var P=Object.assign(defaultPub(),pubOf(r)),all=c.products.map(function(p){return Object.assign({_r:r},p)}).concat((P.extra||[]).filter(function(p){return !p.off&&p.imgDoc})),hid=P.hidden||[];
  all=all.filter(function(p){return hid.indexOf(p.id)<0});
  var ids=S.edit&&S.edit.kind==="hero"&&S.edit.r===r?S.edit.ids:((P.hero&&P.hero.ids&&P.hero.ids.length)?P.hero.ids.slice():all.filter(function(p){return p.img}).map(function(p){return p.id}));
  if(!S.edit||S.edit.kind!=="hero"||S.edit.r!==r)S.hEdit={r:r,ids:ids,seconds:(P.hero&&P.hero.seconds)||3.5};else S.hEdit=S.edit;
  var H=S.hEdit,byId=function(id){return all.find(function(p){return p.id===id})};
  return top("Hero slider","The big 3D product slider at the top of the "+RNAME[r]+" home page.",'<a class="btn g" href="'+SITE[r]+'" target="_blank" rel="noopener">View website '+ic("ext")+'</a>')+regionPick()+
  '<div class="two"><div class="card"><h3>Slides in order <small>'+H.ids.length+' slide(s)</small></h3><div class="hero-l">'+(H.ids.length?H.ids.map(function(id,i){var p=byId(id);if(!p)return "";var src=p.imgDoc?(S.pimg[p.imgDoc]||""):prodImg(p,r);
    return '<div class="hl"><span class="n">'+(i+1)+'</span><img '+(p.imgDoc?'data-pimg="'+esc(p.imgDoc)+'" ':'')+'src="'+esc(src)+'" alt=""><div class="grow"><b>'+esc(p.name)+'</b><br><small class="mut">'+esc(p.brand)+'</small></div><button class="icon-b" data-act="hup" data-i="'+i+'" aria-label="Move up">↑</button><button class="icon-b" data-act="hdown" data-i="'+i+'" aria-label="Move down">↓</button><button class="icon-b" data-act="hdel" data-i="'+i+'" aria-label="Remove">×</button></div>'}).join(""):'<div class="emp">No slides — the website will show all products with photos.</div>')+'</div>'+
  '<label class="f" style="margin-top:20px"><span>Seconds per slide: <b id="secV">'+H.seconds+'</b></span><input type="range" min="2" max="10" step="0.5" value="'+H.seconds+'" id="hSec" style="width:100%"></label>'+
  '<div class="acts"><button class="btn" data-act="hsave">Save hero slider</button><button class="btn g" data-act="hreset">Reset to default</button></div></div>'+
  '<div class="card"><h3>Add a product</h3><div class="hero-l">'+all.filter(function(p){return H.ids.indexOf(p.id)<0&&(p.img||p.imgDoc)}).map(function(p){var src=p.imgDoc?(S.pimg[p.imgDoc]||""):prodImg(p,r);return '<div class="hl"><img '+(p.imgDoc?'data-pimg="'+esc(p.imgDoc)+'" ':'')+'src="'+esc(src)+'" alt="" loading="lazy"><div class="grow"><b>'+esc(p.name)+'</b><br><small class="mut">'+esc(p.brand)+'</small></div><button class="btn g sm" data-act="hadd" data-id="'+esc(p.id)+'">Add</button></div>'}).join("")+'</div></div></div>'}

/* ======================= SITE SETTINGS ======================= */
var WXO=[["auto","Live weather","Matches each visitor's real weather"],["off","Off","No weather effects"],["sun","Sunny","Warm light and glow"],["hot","Heat wave","Shimmering heat"],["cloud","Cloudy","Drifting clouds"],["fog","Foggy","Soft mist"],["rain","Rain","Falling rain"],["storm","Storm","Rain and lightning"],["snow","Snow","Falling snow"],["cold","Frost","Icy frost"],["night","Night","Stars"]];
var SWA=[["Jora orange","#F96302","#D7262B"],["Deep red","#D7262B","#8E1B1F"],["Ocean blue","#1E6FD9","#0B3C7A"],["Forest green","#2E8B57","#1B5E3A"],["Royal purple","#7B4FD6","#4A2C91"],["Charcoal","#3A3F47","#F96302"]];
function vSite(){var r=siteRegion(),P=Object.assign(defaultPub(),pubOf(r)),co=P.colors||{},an=P.announce||{},st=P.stats||{};
  return top("Colours, weather & more","Changes go live on the "+RNAME[r]+" website after you press Save.",'<a class="btn g" href="'+SITE[r]+'" target="_blank" rel="noopener">View website '+ic("ext")+'</a>')+regionPick()+
  '<form data-form="site"><div class="two"><div><div class="card"><h3>Brand colours</h3><div class="swatches">'+SWA.map(function(s){return '<button type="button" data-sw="'+s[1]+'|'+s[2]+'"><i style="--a:'+s[1]+';--b:'+s[2]+'"></i>'+s[0]+'</button>'}).join("")+'</div>'+
  '<div class="grid2"><label class="f"><span>Main colour <small>(buttons, highlights)</small></span><span class="cpick"><input type="color" name="main" value="'+(co.main||"#F96302")+'"><code>'+(co.main||"#F96302")+'</code></span></label><label class="f"><span>Accent colour <small>(emergency, labels)</small></span><span class="cpick"><input type="color" name="accent" value="'+(co.accent||"#D7262B")+'"><code>'+(co.accent||"#D7262B")+'</code></span></label></div>'+
  '<p class="mut tiny">Tip: keep enough contrast so white text on buttons stays easy to read.</p></div>'+
  '<div class="card"><h3>Announcement bar <small>a line across the top of every page</small></h3><label class="f"><span><span class="sw"><input type="checkbox" name="an_on"'+(an.on?" checked":"")+'><i></i></span> Show the announcement</span></label>'+
  '<label class="f"><span>Message</span><input class="inp" name="an_text" value="'+esc(an.text||"")+'" maxlength="160" placeholder="e.g. Fall furnace tune-up — $99 this month"></label><div class="grid2"><label class="f"><span>Link <small>(optional)</small></span><input class="inp" name="an_link" value="'+esc(an.link||"")+'" placeholder="https://… or tel:+19056672823"></label><label class="f"><span>Link text</span><input class="inp" name="an_lt" value="'+esc(an.linkText||"")+'" placeholder="Book now"></label></div></div>'+
  '<div class="card"><h3>Numbers slider</h3><div class="grid2"><label class="f"><span>Happy customers</span><input class="inp" name="st_c" type="number" min="0" value="'+esc(st.customers||3000)+'"></label><label class="f"><span>Years of experience</span><input class="inp" name="st_y" type="number" min="0" value="'+esc(st.years||28)+'"></label></div></div></div>'+
  '<div><div class="card"><h3>Weather effect</h3><p class="mut" style="margin-top:-6px">“Live weather” shows each visitor the weather where they are. Pick one to show the same effect to everyone.</p><div class="wxopts">'+WXO.map(function(w){return '<label><input type="radio" name="wx" value="'+w[0]+'"'+((P.weather||"auto")===w[0]?" checked":"")+'><b>'+w[1]+'</b><small>'+w[2]+'</small></label>'}).join("")+'</div>'+
  '<p style="margin:14px 0 0"><a class="lnk" href="'+SITE[r]+'?weather=snow" target="_blank" rel="noopener">Preview snow</a> · <a class="lnk" href="'+SITE[r]+'?weather=rain" target="_blank" rel="noopener">rain</a> · <a class="lnk" href="'+SITE[r]+'?weather=hot" target="_blank" rel="noopener">heat</a> · <a class="lnk" href="'+SITE[r]+'?weather=cloud" target="_blank" rel="noopener">clouds</a></p></div>'+
  '<div class="card"><div class="acts"><button class="btn">Save — publish to the '+RNAME[r]+' website</button><button class="btn g" type="button" data-act="sitereset">Reset colours</button></div><p class="mut tiny" style="margin:10px 0 0">Visitors see the change on their next page view.</p></div></div></div></form>'}


/* ======================= SEO & PAGE TITLES ======================= */
S.pages={};
function loadPages(r){if(S.pages[r])return Promise.resolve(S.pages[r]);return fetch(ROOT+(r==="sk"?"saskatchewan":"gta")+"/assets/pages.json").then(function(x){return x.json()}).then(function(L){S.pages[r]=L;return L})}
function siteURL(r,path){return new URL(ROOT+(r==="sk"?"saskatchewan/":"gta/")+path+IDX,location.href).href}
function vSeo(){var r=siteRegion(),L=S.pages[r];if(!L){loadPages(r).then(render).catch(function(){toast("Couldn't load the page list")});return top("SEO & page titles","Loading…")}
  var P=Object.assign(defaultPub(),pubOf(r)),seo=P.seo||{},q=S.f.q.toLowerCase();
  if(S.edit&&S.edit.kind==="seo"){var pg=S.edit.data,o=seo[pg.path]||{},t=o.title||pg.title,d=o.desc||pg.desc;
    return '<button class="btn g sm back" data-act="cancel">‹ All pages</button>'+top("Edit page — Google listing",'<code>/'+esc(pg.path)+'</code>',"",true)+
    '<div class="two"><form class="card" data-form="seo"><label class="f"><span>Page title <small>(best 50–60 characters) · <b id="tc">'+t.length+'</b></small></span><input class="inp" name="title" maxlength="70" value="'+esc(t)+'"></label>'+
    '<label class="f"><span>Description <small>(best 140–160 characters) · <b id="dc">'+d.length+'</b></small></span><textarea class="inp" name="desc" maxlength="170">'+esc(d)+'</textarea></label>'+
    '<div class="acts"><button class="btn">Save</button>'+(seo[pg.path]?'<button class="btn g" type="button" data-act="seoreset">Back to original</button>':'')+'<a class="btn g" href="'+siteURL(r,pg.path)+'" target="_blank" rel="noopener">Open page '+ic("ext")+'</a></div></form>'+
    '<div class="card"><h3>Google preview</h3><div style="font-family:Arial,sans-serif;max-width:600px"><div style="color:#202124;font-size:14px">joramechanical.github.io › '+(r==="sk"?"saskatchewan":"gta")+'</div><div id="gt" style="color:#1a0dab;font-size:20px;line-height:1.3;margin:4px 0">'+esc(t)+'</div><div id="gd" style="color:#4d5156;font-size:14px;line-height:1.58">'+esc(d)+'</div></div>'+
    '<p class="mut tiny" style="margin-top:16px">Tips: put the main service and the city first (e.g. “Furnace Installation Brampton”), keep it natural, and end with a reason to click (free quote, 24/7).</p></div></div>'}
  var rows=L.filter(function(x){return !q||(x.path+x.title+x.desc).toLowerCase().indexOf(q)>-1});
  return top("SEO & page titles","How each page of the "+RNAME[r]+" website shows up on Google.")+regionPick()+
  '<div class="bar"><input class="inp" type="search" placeholder="Search pages…" data-search value="'+esc(S.f.q)+'"><span class="mut">'+rows.length+' pages · '+Object.keys(seo).length+' edited</span></div>'+
  '<div class="card"><div class="tblw"><table class="tbl rsp"><thead><tr><th>Page</th><th>Title on Google</th><th></th></tr></thead><tbody>'+rows.map(function(x){var o=seo[x.path];return '<tr class="clk" data-seo="'+esc(x.path)+'"><td data-l="Page"><code>/'+esc(x.path)+'</code></td><td data-l="Title">'+esc((o&&o.title)||x.title)+'<br><small>'+esc(((o&&o.desc)||x.desc).slice(0,110))+'…</small></td><td>'+(o?'<span class="pill sent">edited</span>':'')+'</td></tr>'}).join("")+'</tbody></table></div></div>'}

/* ======================= BLOG ======================= */
var TAGS=["Furnaces","Air conditioning","Heat pumps","Water heaters","Rebates","Maintenance","Indoor air","Tips","News"];
function vBlog(){var r=siteRegion(),P=Object.assign(defaultPub(),pubOf(r)),L=(P.posts||[]).slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
  if(S.edit&&S.edit.kind==="post"){var x=S.edit.data,img=x._img||(x.imgDoc?S.pimg[x.imgDoc]||"":"");
    return '<button class="btn g sm back" data-act="cancel">‹ All articles</button>'+top(x._new?"New article":"Edit article",RNAME[r]+" website","",true)+
    '<form class="card" data-form="post"><div class="two"><div><label class="f"><span>Title</span><input class="inp" name="title" value="'+esc(x.title)+'" required placeholder="e.g. 5 signs your furnace needs replacing"></label>'+
    '<div class="grid2"><label class="f"><span>Date</span><input class="inp" name="date" type="date" value="'+esc(x.date)+'"></label><label class="f"><span>Topic</span><input class="inp" name="tag" list="tagList" value="'+esc(x.tag)+'"><datalist id="tagList">'+TAGS.map(function(t){return '<option value="'+t+'">'}).join("")+'</datalist></label></div>'+
    '<label class="f"><span>Short summary <small>(shows on the card and on Google)</small></span><textarea class="inp" name="excerpt" maxlength="220" style="min-height:70px">'+esc(x.excerpt)+'</textarea></label>'+
    '<label class="f"><span>Article <small>— leave an empty line between paragraphs; start a line with # for a heading</small></span><textarea class="inp" name="body" style="min-height:320px">'+esc(x.body)+'</textarea></label></div>'+
    '<div><div class="f"><span style="display:block;font-weight:600;margin-bottom:6px">Cover photo</span><div class="photo"><div class="pv" id="pv" style="background-size:cover;background-image:url(\''+esc(img)+'\')"></div><div><input type="file" accept="image/*" id="xfile" data-kind="post"><p class="mut tiny">Landscape photos look best. Resized automatically.</p></div></div></div>'+
    '<label class="f" style="margin-top:16px"><span><input type="checkbox" name="off"'+(x.off?" checked":"")+'> Hide this article for now</span></label></div></div>'+
    '<div class="acts"><button class="btn">Publish</button>'+(x._new?'':'<button class="btn red" type="button" data-act="delpost">Delete</button>')+'<button class="btn g" type="button" data-act="cancel">Cancel</button></div></form>'}
  return top("Blog & advice","Write articles for customers. They appear on the Advice page and the home page.",'<button class="btn" data-act="newpost">'+ic("plus")+'New article</button><a class="btn g" href="'+siteURL(r,"blog/")+'" target="_blank" rel="noopener">View Advice page '+ic("ext")+'</a>')+regionPick()+
  '<div class="card">'+(L.length?'<div class="tblw"><table class="tbl rsp"><thead><tr><th>Article</th><th>Topic</th><th>Date</th><th></th></tr></thead><tbody>'+L.map(function(x){return '<tr class="clk" data-post="'+esc(x.id)+'"><td data-l="Article"><b>'+esc(x.title)+'</b><br><small>'+esc((x.excerpt||"").slice(0,90))+'</small></td><td data-l="Topic">'+esc(x.tag||"")+'</td><td data-l="Date">'+esc(x.date||"")+'</td><td>'+(x.off?'<span class="pill">hidden</span>':'<span class="pill won">live</span>')+'</td></tr>'}).join("")+'</tbody></table></div>':'<div class="emp">No articles yet. Press <b>New article</b> — add a title, a photo and your text, then Publish.</div>')+'</div>'}

/* ======================= OUR WORK PHOTOS ======================= */
var WCATS=[["furnace","Furnace"],["ac","Air conditioner"],["hp","Heat pump"],["water","Water heater"],["gh","Garage heater"],["duct","Ductwork"],["commercial","Commercial"],["industrial","Industrial"]];
function vWork(){var r=siteRegion(),P=Object.assign(defaultPub(),pubOf(r)),L=(P.projects||[]).slice().sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
  if(S.edit&&S.edit.kind==="proj"){var x=S.edit.data,ph=(x.photos||[]).map(function(i){return S.pimg[i]||""}).concat(x._imgs||[]);
    return '<button class="btn g sm back" data-act="cancel">‹ All projects</button>'+top(x._new?"New project":"Edit project",RNAME[r]+" website — Our Work page","",true)+
    '<form class="card" data-form="proj"><div class="two"><div><label class="f"><span>Title</span><input class="inp" name="title" value="'+esc(x.title)+'" required placeholder="e.g. Lennox furnace + AC replacement"></label>'+
    '<div class="grid2"><label class="f"><span>City</span><input class="inp" name="city" value="'+esc(x.city)+'"></label><label class="f"><span>Date</span><input class="inp" name="date" type="date" value="'+esc(x.date)+'"></label>'+
    '<label class="f"><span>Type</span><select class="inp" name="cat">'+WCATS.map(function(c){return '<option value="'+c[0]+'"'+(x.cat===c[0]?" selected":"")+'>'+c[1]+'</option>'}).join("")+'</select></label><label class="f"><span>Brand <small>(optional)</small></span><input class="inp" name="brand" value="'+esc(x.brand)+'"></label></div>'+
    '<label class="f"><span>What we did</span><textarea class="inp" name="text">'+esc(x.text)+'</textarea></label><label class="f"><span><input type="checkbox" name="off"'+(x.off?" checked":"")+'> Hide for now</span></label></div>'+
    '<div><span style="display:block;font-weight:600;margin-bottom:8px">Photos <small class="mut">(up to 8)</small></span><div class="wph">'+ph.map(function(src,i){return '<span class="wpi" style="background-image:url(\''+esc(src)+'\')"><button type="button" data-act="delphoto" data-i="'+i+'" aria-label="Remove photo">×</button></span>'}).join("")+'</div>'+
    '<input type="file" accept="image/*" multiple id="xfile" data-kind="proj" style="margin-top:10px"><p class="mut tiny">Before/after and finished-install photos work best. Resized automatically.</p></div></div>'+
    '<div class="acts"><button class="btn">Publish</button>'+(x._new?'':'<button class="btn red" type="button" data-act="delproj">Delete</button>')+'<button class="btn g" type="button" data-act="cancel">Cancel</button></div></form>'}
  return top("Our Work photos","Show real jobs with photos on the Our Work page and the home page.",'<button class="btn" data-act="newproj">'+ic("plus")+'New project</button><a class="btn g" href="'+siteURL(r,"our-work/")+'" target="_blank" rel="noopener">View Our Work '+ic("ext")+'</a>')+regionPick()+
  '<div class="card">'+(L.length?'<div class="plist">'+L.map(function(x){var f=(x.photos||[])[0];if(f)loadPimg(f);return '<div class="pi clk'+(x.off?" off":"")+'" data-proj="'+esc(x.id)+'" style="cursor:pointer">'+(f?'<img data-pimg="'+esc(f)+'" src="'+esc(S.pimg[f]||"")+'" alt="" style="object-fit:cover">':'<span class="ph"></span>')+'<div class="grow"><b>'+esc(x.title)+'</b><small>'+esc([x.city,x.date].filter(Boolean).join(" · "))+' · '+(x.photos||[]).length+' photo(s)</small></div></div>'}).join("")+'</div>':'<div class="emp">No projects yet. Press <b>New project</b>, add photos of a finished job, and publish.</div>')+'</div>'}

function xClick(e){var b=e.target.closest("[data-seo],[data-post],[data-proj],[data-act]");if(!b)return false;var r=siteRegion(),P=Object.assign(defaultPub(),pubOf(r));
  if(b.dataset.seo!==undefined&&!b.dataset.act){var pg=(S.pages[r]||[]).find(function(x){return x.path===b.dataset.seo});if(pg){S.edit={kind:"seo",data:pg};render()}return true}
  if(b.dataset.post&&!b.dataset.act){var x=(P.posts||[]).find(function(q){return q.id===b.dataset.post});if(x){S.edit={kind:"post",data:JSON.parse(JSON.stringify(x))};render()}return true}
  if(b.dataset.proj&&!b.dataset.act){var y=(P.projects||[]).find(function(q){return q.id===b.dataset.proj});if(y){(y.photos||[]).forEach(loadPimg);S.edit={kind:"proj",data:JSON.parse(JSON.stringify(y))};render()}return true}
  var a=b.dataset.act;
  if(a==="seoreset"){P.seo=Object.assign({},P.seo||{});delete P.seo[S.edit.data.path];savePub(r,P).then(function(){S.edit=null;render()});return true}
  if(a==="newpost"){S.edit={kind:"post",data:{_new:true,id:"p-"+J.rid(10).toLowerCase(),title:"",date:ymd(),tag:"Tips",excerpt:"",body:"",imgDoc:"",off:false}};render();return true}
  if(a==="delpost"){if(confirmDo("Delete this article?")){P.posts=(P.posts||[]).filter(function(q){return q.id!==S.edit.data.id});savePub(r,P).then(function(){if(S.edit.data.imgDoc)db.collection("pimg").doc(S.edit.data.imgDoc).delete().catch(function(){});S.edit=null;render()})}return true}
  if(a==="newproj"){S.edit={kind:"proj",data:{_new:true,id:"w-"+J.rid(10).toLowerCase(),title:"",city:"",date:ymd(),cat:"furnace",brand:"",text:"",photos:[],off:false}};render();return true}
  if(a==="delproj"){if(confirmDo("Delete this project?")){var d=S.edit.data;P.projects=(P.projects||[]).filter(function(q){return q.id!==d.id});savePub(r,P).then(function(){(d.photos||[]).forEach(function(i){db.collection("pimg").doc(i).delete().catch(function(){})});S.edit=null;render()})}return true}
  if(a==="delphoto"){syncProj();var x2=S.edit.data,i=+b.dataset.i,n=(x2.photos||[]).length;if(i<n){x2._gone=(x2._gone||[]).concat(x2.photos.splice(i,1))}else{x2._imgs.splice(i-n,1)}render();return true}
  return false}
function syncProj(){var f=$("form[data-form=proj]");if(!f||!S.edit||S.edit.kind!=="proj")return;var x=S.edit.data;["title","city","date","cat","brand"].forEach(function(n){x[n]=val(f,n)});x.text=f.elements.text.value;x.off=val(f,"off")}
function xChange(e){var t=e.target;if(t.id!=="xfile"||!t.files.length)return false;var x=S.edit.data;syncProj();
  if(t.dataset.kind==="post"){J.shrinkImage(t.files[0],1400,.8).then(function(d){x._img=d;$("#pv").style.backgroundImage="url('"+d+"')"}).catch(function(){toast("Couldn't read that photo")})}
  else{var files=[].slice.call(t.files,0,Math.max(0,8-(x.photos||[]).length-(x._imgs||[]).length));Promise.all(files.map(function(f){return J.shrinkImage(f,1400,.8)})).then(function(L){x._imgs=(x._imgs||[]).concat(L);render()}).catch(function(){toast("Couldn't read a photo")})}
  return true}
function xSubmit(e){var f=e.target,k=f.dataset.form;if(["seo","post","proj"].indexOf(k)<0)return false;var r=siteRegion(),P=Object.assign(defaultPub(),pubOf(r)),btn=f.querySelector("button:not([type=button])");if(btn)btn.disabled=true;var done=function(){if(btn)btn.disabled=false};
  if(k==="seo"){var pg=S.edit.data;P.seo=Object.assign({},P.seo||{});var t=val(f,"title"),d=f.elements.desc.value.trim();
    if(t===pg.title&&d===pg.desc)delete P.seo[pg.path];else P.seo[pg.path]={title:t,desc:d};savePub(r,P).then(function(){S.edit=null;render()}).finally(done);return true}
  if(k==="post"){var x=S.edit.data,np={id:x.id,title:val(f,"title"),date:val(f,"date"),tag:val(f,"tag"),excerpt:f.elements.excerpt.value.trim(),body:f.elements.body.value,imgDoc:x.imgDoc||"",off:val(f,"off")};
    var step=Promise.resolve();if(x._img){var iid=x.imgDoc||("img-"+J.rid(12).toLowerCase());np.imgDoc=iid;step=db.collection("pimg").doc(iid).set({data:x._img,postId:x.id,region:r,updatedAt:J.now()}).then(function(){S.pimg[iid]=x._img})}
    step.then(function(){P.posts=(P.posts||[]).slice();var i=P.posts.findIndex(function(q){return q.id===np.id});if(i>-1)P.posts[i]=np;else P.posts.push(np);return savePub(r,P)}).then(function(){S.edit=null;render()}).catch(fail).finally(done);return true}
  if(k==="proj"){var y=S.edit.data,ids=(y.photos||[]).slice();
    var ups=(y._imgs||[]).map(function(d){var iid="img-"+J.rid(12).toLowerCase();ids.push(iid);return db.collection("pimg").doc(iid).set({data:d,projectId:y.id,region:r,updatedAt:J.now()}).then(function(){S.pimg[iid]=d})});
    Promise.all(ups).then(function(){var np={id:y.id,title:val(f,"title"),city:val(f,"city"),date:val(f,"date"),cat:val(f,"cat"),brand:val(f,"brand"),text:f.elements.text.value.trim(),photos:ids,off:val(f,"off")};
      P.projects=(P.projects||[]).slice();var i=P.projects.findIndex(function(q){return q.id===np.id});if(i>-1)P.projects[i]=np;else P.projects.push(np);return savePub(r,P)})
    .then(function(){(y._gone||[]).forEach(function(i){db.collection("pimg").doc(i).delete().catch(function(){})});S.edit=null;render()}).catch(fail).finally(done);return true}
  return false}
document.addEventListener("input",function(e){var t=e.target;if(!t.closest||!t.closest("form[data-form=seo]"))return;if(t.name==="title"){$("#tc").textContent=t.value.length;$("#gt").textContent=t.value}if(t.name==="desc"){$("#dc").textContent=t.value.length;$("#gd").textContent=t.value}});

/* ======================= TEAM ======================= */
function vTeam(){var L=S.team.slice().sort(function(a,b){return (a.name||a._id).localeCompare(b.name||b._id)});
  return top("Team","Give employees and partners their own login. Each person signs in with their own email and password.","",true)+
  '<div class="two wide"><div class="card"><h3>People with access</h3><div class="tblw"><table class="tbl rsp"><thead><tr><th>Name</th><th>Email</th><th>Access</th><th></th></tr></thead><tbody><tr><td data-l="Name"><b>Office (owner)</b></td><td data-l="Email">'+esc(J.owner)+'</td><td data-l="Access"><span class="pill won">Owner</span></td><td></td></tr>'+
  L.map(function(t){return '<tr><td data-l="Name"><b>'+esc(t.name||"—")+'</b>'+(t.phone?'<br><small>'+esc(t.phone)+'</small>':'')+'</td><td data-l="Email">'+esc(t._id)+'</td><td data-l="Access"><select class="inp" data-role="'+esc(t._id)+'" style="min-height:36px;width:auto">'+["admin","staff","partner"].map(function(r){return '<option value="'+r+'"'+(t.role===r?" selected":"")+'>'+J.ROLES[r]+'</option>'}).join("")+'</select>'+(t.disabled?' <span class="pill lost">paused</span>':'')+'</td>'+
    '<td><button class="btn g sm" data-act="tpause" data-id="'+esc(t._id)+'">'+(t.disabled?"Resume":"Pause")+'</button> <button class="btn red sm" data-act="tdel" data-id="'+esc(t._id)+'">Remove</button></td></tr>'}).join("")+'</tbody></table></div></div>'+
  '<div><div class="card"><h3>Add a person</h3><form data-form="team"><label class="f"><span>Name</span><input class="inp" name="name" required></label><label class="f"><span>Email</span><input class="inp" name="email" type="email" required></label><label class="f"><span>Phone <small>(optional)</small></span><input class="inp" name="phone"></label>'+
  '<label class="f"><span>Access</span><select class="inp" name="role"><option value="staff">Staff — requests, quotes, jobs, customers</option><option value="partner">Partner — sees everything, updates jobs</option><option value="admin">Admin — everything, incl. website & team</option></select></label><button class="btn">Add to team</button></form></div>'+
  '<div class="card"><h3>How they sign in</h3><ol style="padding-left:20px;margin:0;line-height:1.8"><li>Add them here.</li><li>Send them this link: <code>'+esc(new URL(location.href).href.split("#")[0].split("?")[0])+'</code></li><li>They press <b>First time? Create your login</b>, use the same email, and choose a password.</li><li>They confirm their email from the message they get — done.</li></ol></div></div></div>'}

/* ======================= SETUP ======================= */
function vSetup(){var c=J.cfg,ok='<span class="pill won">Connected</span>',no='<span class="pill new">Not yet</span>';
  return top("Setup & help","What's connected, and what each part of the panel does.","",true)+
  '<div class="two"><div class="card"><h3>Connections</h3><dl class="dl"><dt>Database &amp; logins</dt><dd>'+(J.demo?no+' — demo mode (this browser only)':ok+' Firebase project <code>'+esc(c.firebase.projectId)+'</code>')+'</dd><dt>Email alerts to the office</dt><dd>'+(c.web3formsKey?ok+' sent to info@':no)+'</dd><dt>Send quotes from the panel</dt><dd>'+(c.emailjs&&c.emailjs.serviceId?ok:no+' — “Open in my email” works meanwhile')+'</dd></dl>'+
  (J.demo?'<p style="margin-top:16px">To go live, the database (Firebase) needs to be connected. Until then you can try everything here — it\'s saved only in this browser, and nobody else can see it.</p>':'')+'</div>'+
  '<div class="card"><h3>What each page does</h3><dl class="dl"><dt>Today</dt><dd>The day at a glance: jobs, new requests, quotes, money. Print it or copy it to send.</dd><dt>Requests</dt><dd>Every quote request, chat and account request from both websites.</dd><dt>Quotations</dt><dd>Build a quote with tax worked out, send it, and see when the customer accepts online.</dd><dt>Jobs</dt><dd>Book work by day or week and assign a technician.</dd><dt>Products / Hero</dt><dd>Add products with photos, hide models, pick the hero slider.</dd><dt>Colours, weather</dt><dd>Brand colours, weather effect, announcement bar, numbers.</dd><dt>Team</dt><dd>Logins for employees and partners.</dd></dl></div></div>'}

/* ======================= EVENTS ======================= */
function findReq(id){return S.req.find(function(r){return r._id===id})}
function onClick(e){if(xClick(e))return;var t=e.target,b;
  if((b=t.closest("[data-region]"))){S.region=b.dataset.region;try{localStorage.setItem("jora_adm_region",S.region)}catch(x){}render();return}
  if((b=t.closest("[data-siter]"))){if(S.edit&&!confirmDo("Leave without saving?"))return;S.edit=null;S.siteR=b.dataset.siter;render();return}
  if((b=t.closest("[data-fr]"))){S.f.req=b.dataset.fr;render();return}
  if((b=t.closest("[data-fq]"))){S.f.quote=b.dataset.fq;render();return}
  if((b=t.closest("[data-fj]"))){S.f.jobs=b.dataset.fj;render();return}
  if((b=t.closest("[data-tab2]"))){S.tab=b.dataset.tab2;S.view=null;S.edit=null;if(S.tab==="req")S.f.req=b.dataset.f;if(S.tab==="quote")S.f.quote=b.dataset.f;if(S.tab==="jobs")S.f.jobs=b.dataset.f;render();return}
  if((b=t.closest("[data-sw]"))){var p=b.dataset.sw.split("|"),f=b.closest("form");f.elements.main.value=p[0];f.elements.accent.value=p[1];$$(".cpick code",f).forEach(function(c,i){c.textContent=p[i]});return}
  if((b=t.closest("[data-rst]"))){db.collection("requests").doc(b.dataset.id).update({status:b.dataset.rst,updatedAt:J.now()}).then(function(){toast("Status: "+b.dataset.rst)}).catch(fail);return}
  if((b=t.closest("tr[data-r]"))){S.tab="req";S.view=b.dataset.r;S.edit=null;render();scrollTo(0,0);return}
  if((b=t.closest("[data-c]"))){S.view=b.dataset.c;render();scrollTo(0,0);return}
  if((b=t.closest("[data-q]"))){var q=S.quotes.find(function(x){return x._id===b.dataset.q});if(q)openQuote(q);return}
  if((b=t.closest("[data-j]"))&&!t.closest("[data-act]")){var j=S.jobs.find(function(x){return x._id===b.dataset.j});if(j){S.tab="jobs";S.edit={kind:"job",data:JSON.parse(JSON.stringify(j))};render();scrollTo(0,0)}return}
  b=t.closest("[data-act]");if(!b)return;var a=b.dataset.act,id=b.dataset.id;
  if(a==="back"){S.view=null;S.edit=null;render();return}
  if(a==="cancel"){S.edit=null;render();return}
  if(a==="print"){window.print();return}
  if(a==="day"){S.day=addDays(S.day,+b.dataset.n);render();return}
  if(a==="today"){S.day=ymd();render();return}
  if(a==="copysum"){var txt=daySummaryText();(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){toast("Summary copied — paste it into an email or WhatsApp")}).catch(function(){prompt("Copy the summary:",txt)});return}
  if(a==="newquote"){openQuote(newQuote());return}
  if(a==="newjob"){S.tab="jobs";S.edit={kind:"job",data:newJob({date:b.dataset.date||S.day})};render();scrollTo(0,0);return}
  if(a==="newcust"){S.edit={kind:"cust",data:{region:S.region==="all"?"gta":S.region}};render();return}
  if(a==="editcust"){var cu=allCustomers().find(function(x){return x._id===id});S.edit={kind:"cust",data:JSON.parse(JSON.stringify(cu))};render();return}
  if(a==="req2quote"){var r=findReq(id),c=reqToCustomer(r);openQuote(newQuote({region:r.region||"gta",requestRef:r.ref||r._id,customer:c,title:r.serviceName||"",items:[{desc:(r.serviceName||"Work")+(r.answers&&r.answers.model?" — "+r.answers.model:""),qty:1,price:0}]}));return}
  if(a==="req2job"){var r2=findReq(id);S.tab="jobs";S.edit={kind:"job",data:newJob({region:r2.region||"gta",service:r2.service||"other",title:r2.serviceName||"",customer:reqToCustomer(r2),requestRef:r2.ref||r2._id,date:ymd()})};render();scrollTo(0,0);return}
  if(a==="req2cust"){var r3=findReq(id);upsertCustomer(reqToCustomer(r3)).then(function(){toast("Saved to customers")}).catch(fail);return}
  if(a==="delreq"){if(confirmDo("Delete this request for good?"))db.collection("requests").doc(id).delete().then(function(){S.view=null;render();toast("Deleted")}).catch(fail);return}
  if(a==="cust2quote"){var c2=allCustomers().find(function(x){return x._id===id});openQuote(newQuote({region:c2.region||"gta",customer:{name:c2.name||"",email:c2.email||"",phone:c2.phone||"",address:c2.address||"",city:c2.city||"",postal:c2.postal||""}}));return}
  if(a==="cust2job"){var c3=allCustomers().find(function(x){return x._id===id});S.tab="jobs";S.edit={kind:"job",data:newJob({region:c3.region||"gta",customer:{name:c3.name||"",email:c3.email||"",phone:c3.phone||"",address:c3.address||"",city:c3.city||"",postal:c3.postal||""}})};render();return}
  /* quote editor */
  if(a==="qclose"){S.edit=null;render();return}
  if(a==="additem"){syncQuote();S.edit.data.items.push({desc:"",qty:1,price:0});$("#items").innerHTML=S.edit.data.items.map(itemRow).join("");qPreview();return}
  if(a==="delitem"){syncQuote();var li=+b.closest(".li").dataset.i;S.edit.data.items.splice(li,1);$("#items").innerHTML=S.edit.data.items.map(itemRow).join("");qPreview();return}
  if(a==="quick"){syncQuote();var its=S.edit.data.items;if(its.length===1&&!its[0].desc)its.pop();its.push({desc:b.dataset.t,qty:1,price:0});$("#items").innerHTML=its.map(itemRow).join("");qPreview();return}
  if(a==="qsend"){saveQuote().then(function(){sendBox();qPreview()}).catch(function(){});return}
  if(a==="sendMail"){e.preventDefault();var q1=S.edit.data;location.href="mailto:"+encodeURIComponent(q1.customer.email)+"?subject="+encodeURIComponent("Your quotation "+q1.number+" — Jora Mechanical Systems")+"&body="+encodeURIComponent($("#sendMsg").value);markSent().then(function(){toast("Marked as sent")});return}
  if(a==="sendDirect"){var q2=S.edit.data;b.disabled=true;J.emailCustomer({to_email:q2.customer.email,to_name:q2.customer.name,subject:"Your quotation "+q2.number+" — Jora Mechanical Systems",message:$("#sendMsg").value,quote_link:quoteLink(q2._id,true),quote_number:q2.number,total:money(J.quoteTotals(q2).total),reply_to:"info@joramechanicalsystems.com"})
    .then(function(){return markSent()}).then(function(){toast("Quotation emailed to "+q2.customer.email)}).catch(fail).finally(function(){b.disabled=false});return}
  if(a==="copyLink"){var ql=quoteLink(S.edit.data._id,true);(navigator.clipboard?navigator.clipboard.writeText(ql):Promise.reject()).then(function(){toast("Link copied")}).catch(function(){prompt("Copy this link:",ql)});markSent();return}
  if(a==="qprint"){saveQuote().then(function(q){window.open(quoteLink(q._id)+"&print=1","_blank")}).catch(function(){});return}
  if(a==="qdup"){syncQuote();var d=JSON.parse(JSON.stringify(S.edit.data));d._new=true;d._id=J.rid(20);d.number=qNumber();d.status="draft";delete d.sentAt;delete d.response;delete d.createdAt;openQuote(d);toast("Copy made — change it and save");return}
  if(a==="qdel"){if(confirmDo("Delete quotation "+S.edit.data.number+"?"))db.collection("quotes").doc(S.edit.data._id).delete().then(function(){S.edit=null;render();toast("Deleted")}).catch(fail);return}
  if(a==="q2job"){var q3=S.edit.data;S.tab="jobs";S.edit={kind:"job",data:newJob({region:q3.region,title:q3.title,customer:Object.assign({},q3.customer),quoteId:q3._id,amount:Math.round(J.quoteTotals(q3).total*100)/100,date:ymd()})};render();return}
  /* jobs */
  if(a==="jobdone"){db.collection("jobs").doc(id).update({status:"done",doneAt:J.now(),updatedAt:J.now()}).then(function(){toast("Job marked done");if(S.edit&&S.edit.kind==="job"){S.edit=null;render()}}).catch(fail);return}
  if(a==="jobdel"){if(confirmDo("Delete this job?"))db.collection("jobs").doc(id).delete().then(function(){S.edit=null;render();toast("Deleted")}).catch(fail);return}
  /* products */
  if(a==="newprod"){S.edit={kind:"prod",data:newProd(siteRegion())};render();return}
  if(a==="editprod"){var P=pubOf(siteRegion()),pp=JSON.parse(JSON.stringify(P.extra[+b.dataset.i]));pp.specs=(pp.specs||[]).length?pp.specs:[{k:"",v:""}];S.edit={kind:"prod",data:pp,idx:+b.dataset.i};render();return}
  if(a==="addspec"){$("#specs").insertAdjacentHTML("beforeend",specRow({k:"",v:""}));return}
  if(a==="delspec"){b.parentNode.remove();return}
  if(a==="delprod"){if(!confirmDo("Delete this product from the website?"))return;var r4=siteRegion(),P4=Object.assign(defaultPub(),pubOf(r4)),pd=S.edit.data;P4.extra=(P4.extra||[]).filter(function(x){return x.id!==pd.id});P4.hero.ids=(P4.hero.ids||[]).filter(function(x){return x!==pd.id});
    savePub(r4,P4).then(function(){if(pd.imgDoc)db.collection("pimg").doc(pd.imgDoc).delete().catch(function(){});S.edit=null;render()});return}
  /* hero */
  var H=S.hEdit;
  if(a==="hadd"){H.ids.push(b.dataset.id);S.edit=Object.assign({kind:"hero"},H);render();return}
  if(a==="hdel"){H.ids.splice(+b.dataset.i,1);S.edit=Object.assign({kind:"hero"},H);render();return}
  if(a==="hup"||a==="hdown"){var i=+b.dataset.i,k=a==="hup"?i-1:i+1;if(k<0||k>=H.ids.length)return;var tmp=H.ids[i];H.ids[i]=H.ids[k];H.ids[k]=tmp;S.edit=Object.assign({kind:"hero"},H);render();return}
  if(a==="hsave"){var P5=Object.assign(defaultPub(),pubOf(H.r));P5.hero={ids:H.ids.slice(),seconds:+H.seconds||3.5};savePub(H.r,P5).then(function(){S.edit=null;render()});return}
  if(a==="hreset"){var P6=Object.assign(defaultPub(),pubOf(H.r));P6.hero={ids:[],seconds:3.5};savePub(H.r,P6).then(function(){S.edit=null;render()});return}
  if(a==="sitereset"){var f2=b.closest("form");f2.elements.main.value="#F96302";f2.elements.accent.value="#D7262B";$$(".cpick code",f2).forEach(function(c,i){c.textContent=i?"#D7262B":"#F96302"});f2.dataset.resetColors="1";toast("Press Save to publish");return}
  /* team */
  if(a==="tpause"){var tm=S.team.find(function(x){return x._id===id});db.collection("team").doc(id).update({disabled:!tm.disabled}).then(function(){toast(tm.disabled?"Access resumed":"Access paused")}).catch(fail);return}
  if(a==="tdel"){if(confirmDo("Remove "+id+" from the team? They lose access right away."))db.collection("team").doc(id).delete().then(function(){toast("Removed")}).catch(fail);return}
}
function onChange(e){if(xChange(e))return;var t=e.target;
  if(t.id==="dayIn"){S.day=t.value||ymd();render();return}
  if(t.dataset.vis||t.dataset.hero||t.dataset.flag){var r=siteRegion(),P=Object.assign(defaultPub(),pubOf(r));P.hidden=(P.hidden||[]).slice();P.flags=Object.assign({},P.flags||{});P.hero=Object.assign({ids:[],seconds:3.5},P.hero);
    if(t.dataset.vis){var i=P.hidden.indexOf(t.dataset.vis);if(t.checked&&i>-1)P.hidden.splice(i,1);if(!t.checked&&i<0)P.hidden.push(t.dataset.vis)}
    if(t.dataset.hero){var ids=P.hero.ids&&P.hero.ids.length?P.hero.ids.slice():S.cat[r].products.filter(function(p){return p.img}).map(function(p){return p.id});var k=ids.indexOf(t.dataset.hero);if(t.checked&&k<0)ids.push(t.dataset.hero);if(!t.checked&&k>-1)ids.splice(k,1);P.hero.ids=ids}
    if(t.dataset.flag){if(t.value==="__")return;P.flags[t.dataset.flag]=t.value}
    savePub(r,P);return}
  if(t.dataset.role){db.collection("team").doc(t.dataset.role).update({role:t.value}).then(function(){toast("Access updated")}).catch(fail);return}
  if(t.id==="pfile"&&t.files[0]){J.shrinkImage(t.files[0],900,.82).then(function(d){S.edit.data._img=d;$("#pv").style.backgroundImage="url('"+d+"')";if(d.length>900000)toast("That photo is very large — try a smaller one")}).catch(function(){toast("Couldn't read that photo")});return}
  if(t.type==="color"){var c=t.parentNode.querySelector("code");if(c)c.textContent=t.value}
  if(t.closest("#qf")){syncQuote();qPreview();if(t.name==="region"){var dl=$("#prodList");loadCat(t.value).then(function(){dl.innerHTML=catOptions(t.value)})}
    if(t.name==="c.name"){var cu=allCustomers().find(function(x){return x.name===t.value});if(cu){var f=$("#qf");["phone","email","address","city","postal"].forEach(function(k){if(!f.elements["c."+k].value)f.elements["c."+k].value=cu[k]||""});syncQuote();qPreview()}}}
  if(t.id==="addProd"&&t.value){var q=S.edit.data,r2=q.region,c2=S.cat[r2],all=(c2?c2.products:[]).concat(pubOf(r2).extra||[]),p=all.find(function(x){return (x.brand+" "+x.name)===t.value});syncQuote();if(q.items.length===1&&!q.items[0].desc)q.items.pop();
    q.items.push({desc:p?p.brand+" "+p.name+(p.model&&p.name.indexOf(p.model)<0?" ("+p.model+")":""):t.value,qty:1,price:0});t.value="";$("#items").innerHTML=q.items.map(itemRow).join("");qPreview();return}
  if(t.closest("form[data-form=job]")&&t.name==="c.name"){var cj=allCustomers().find(function(x){return x.name===t.value});if(cj){var fj=t.form;["phone","email","address","city","postal"].forEach(function(k){if(!fj.elements["c."+k].value)fj.elements["c."+k].value=cj[k]||""})}}}
var sT=0;
function onInput(e){var t=e.target;if(t.dataset.search!==undefined){clearTimeout(sT);sT=setTimeout(function(){S.f.q=t.value;var pos=t.selectionStart;render();var n=$("[data-search]");if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}},250);return}
  if(t.id==="hSec"){S.hEdit.seconds=+t.value;S.edit=Object.assign({kind:"hero"},S.hEdit);$("#secV").textContent=t.value;return}
  if(t.closest("#qf")){syncQuote();clearTimeout(sT);sT=setTimeout(qPreview,200)}}
function onSubmit(e){e.preventDefault();if(xSubmit(e))return;var f=e.target,k=f.dataset.form,btn=f.querySelector("button:not([type=button])");if(btn)btn.disabled=true;var done=function(){if(btn)btn.disabled=false};
  if(k==="rnote"){db.collection("requests").doc(f.dataset.id).update({notes:f.elements.notes.value,updatedAt:J.now()}).then(function(){toast("Notes saved")}).catch(fail).finally(done);return}
  if(k==="cust"){var c={name:val(f,"name"),phone:val(f,"phone"),email:val(f,"email").toLowerCase(),address:val(f,"address"),city:val(f,"city"),postal:val(f,"postal").toUpperCase(),region:val(f,"region")};if(!c.email&&!c.phone){toast("Add a phone number or email");done();return}
    upsertCustomer(c,{notes:f.elements.notes.value}).then(function(){S.edit=null;S.view=custKey(c);render();toast("Customer saved")}).catch(fail).finally(done);return}
  if(k==="quote"){saveQuote().then(function(){toast("Quotation saved");render()}).catch(function(x){if(x&&x.message!=="name")fail(x)}).finally(done);return}
  if(k==="job"){var j=S.edit.data;j.customer={name:val(f,"c.name"),phone:val(f,"c.phone"),email:val(f,"c.email").toLowerCase(),address:val(f,"c.address"),city:val(f,"c.city"),postal:val(f,"c.postal").toUpperCase()};
    ["service","region","title","date","time","assignedTo","status","notes"].forEach(function(n){j[n]=n==="notes"?f.elements.notes.value:val(f,n)});j.hours=+val(f,"hours")||0;j.amount=val(f,"amount")===""?"":+val(f,"amount");
    var d=JSON.parse(JSON.stringify(j));delete d._new;delete d._id;d.updatedAt=J.now();if(!d.createdAt){d.createdAt=J.now();d.createdBy=S.user.email}if(d.status==="done"&&!d.doneAt)d.doneAt=J.now();
    db.collection("jobs").doc(j._id).set(d).then(function(){upsertCustomer(Object.assign({region:j.region},j.customer)).catch(function(){});
      if(j.requestRef){var r=S.req.find(function(x){return x.ref===j.requestRef||x._id===j.requestRef});if(r&&["new","contacted","quoted"].indexOf(r.status||"new")>-1)db.collection("requests").doc(r._id).update({status:"scheduled"}).catch(function(){})}
      S.edit=null;S.day=j.date;S.f.jobs="day";render();toast("Job saved")}).catch(fail).finally(done);return}
  if(k==="prod"){var r=siteRegion(),p=S.edit.data,P=Object.assign(defaultPub(),pubOf(r));
    var np={id:p.id,cat:val(f,"cat"),brand:val(f,"brand"),name:val(f,"name"),model:val(f,"model"),tag:val(f,"tag"),flag:val(f,"flag"),more:f.elements.more.value.trim(),off:val(f,"off"),
      feats:f.elements.feats.value.split("\n").map(function(x){return x.trim()}).filter(Boolean),specs:$$("#specs .grid2").map(function(g){return {k:g.querySelector("[name=sk]").value.trim(),v:g.querySelector("[name=sv]").value.trim()}}).filter(function(s){return s.k||s.v}),imgDoc:p.imgDoc||""};
    var step=Promise.resolve();if(p._img){var iid=p.imgDoc||("img-"+J.rid(12).toLowerCase());np.imgDoc=iid;step=db.collection("pimg").doc(iid).set({data:p._img,productId:p.id,region:r,updatedAt:J.now()}).then(function(){S.pimg[iid]=p._img})}
    step.then(function(){P.extra=(P.extra||[]).slice();var i=P.extra.findIndex(function(x){return x.id===np.id});if(i>-1)P.extra[i]=np;else P.extra.push(np);return savePub(r,P)}).then(function(){S.edit=null;render()}).catch(fail).finally(done);return}
  if(k==="site"){var r5=siteRegion(),P5=Object.assign(defaultPub(),pubOf(r5)),mc=val(f,"main"),ac=val(f,"accent");
    P5.colors={main:mc.toLowerCase()==="#f96302"?"":mc,accent:ac.toLowerCase()==="#d7262b"?"":ac};P5.weather=(f.querySelector("[name=wx]:checked")||{}).value||"auto";
    P5.announce={on:val(f,"an_on"),text:val(f,"an_text"),link:val(f,"an_link"),linkText:val(f,"an_lt")};P5.stats={customers:+val(f,"st_c")||3000,years:+val(f,"st_y")||28};
    savePub(r5,P5).finally(done);return}
  if(k==="team"){var em=val(f,"email").toLowerCase();if(em===J.owner){toast("That's already the owner account");done();return}
    db.collection("team").doc(em).set({name:val(f,"name"),phone:val(f,"phone"),role:val(f,"role"),addedAt:J.now(),addedBy:S.user.email,disabled:false}).then(function(){f.reset();toast(em+" added — send them the sign-in link")}).catch(fail).finally(done);return}
  done()}
})();
