/* ======================= LIVE CONTENT (set in the office panel) =======================
   Reads public/<region> (colours, weather, announcement, numbers, hero slider, products) from
   Firestore over plain REST — no SDK, so the site stays light. Until Firebase is connected it
   reads the demo copy the office panel keeps in this browser. Last copy is cached so the next
   page shows it instantly. */
function liveCfg(){return (typeof BACKEND!=="undefined"&&BACKEND)||{}}
function liveFb(){var c=liveCfg().firebase;return c&&c.projectId&&c.apiKey?c:null}
function liveKey(){return "jora_pub_"+REGION}
function liveDemoDB(){try{return JSON.parse(localStorage.getItem("jora_demo_db")||"{}")}catch(e){return {}}}
function liveCached(){try{return JSON.parse(localStorage.getItem(liveKey())||"null")}catch(e){return null}}
function liveBlank(){return "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
function liveEarly(){window.__live={};window.__pimg=window.__pimg||{};var P=liveCached();window.__liveRaw=P;if(P)liveData(P)}
/* apply product changes to the data before the page draws anything */
function liveData(P){window.__live=P||{};var hid=P.hidden||[],fl=P.flags||{};
  if(!window.__orig)window.__orig=PRODUCTS.map(function(p){return Object.assign({},p)});
  PRODUCTS.length=0;__orig.forEach(function(o){if(hid.indexOf(o.id)>-1)return;var p=Object.assign({},o);if(Object.prototype.hasOwnProperty.call(fl,o.id)){p.flag=fl[o.id]||"";p.flagRed=false}PRODUCTS.push(p)});
  CUSTOM.length=0;(P.extra||[]).forEach(function(x){if(x.off||!x.id||!CATS[x.cat])return;var p=Object.assign({},x);
    p.specs=(x.specs||[]).map(function(s){return Array.isArray(s)?s:[s.k,s.v]});p.feats=x.feats||[];p.feats3=x.feats3&&x.feats3.length?x.feats3:(x.feats||[]).slice(0,3);p.model=p.model||p.name;p.custom=true;CUSTOM.push(p)});
  if(P.hero&&+P.hero.seconds)JORA.slideSeconds=Math.max(2,Math.min(12,+P.hero.seconds))}
function pSrc(p){if(p.img&&IMG[p.img])return IMG[p.img];if(p.imgUrl)return p.imgUrl;if(p.imgDoc){livePimg(p.imgDoc);return (window.__pimg&&__pimg[p.imgDoc])||liveBlank()}return liveBlank()}
function heroList(){var all=PRODUCTS.concat(CUSTOM),h=window.__live&&__live.hero,ok=function(p){return p&&((p.img&&IMG[p.img])||p.imgUrl||p.imgDoc)};
  if(h&&h.ids&&h.ids.length){var L=h.ids.map(function(id){return all.find(function(p){return p.id===id})}).filter(ok);if(L.length)return L}
  return PRODUCTS.filter(function(p){return p.img&&IMG[p.img]})}
/* ---------- Firestore REST helpers ---------- */
function fsVal(v){if(!v)return null;if("stringValue" in v)return v.stringValue;if("integerValue" in v)return +v.integerValue;if("doubleValue" in v)return v.doubleValue;if("booleanValue" in v)return v.booleanValue;
  if("timestampValue" in v)return v.timestampValue;if("arrayValue" in v)return (v.arrayValue.values||[]).map(fsVal);if("mapValue" in v)return fsObj(v.mapValue.fields||{});return null}
function fsObj(f){var o={};for(var k in f)o[k]=fsVal(f[k]);return o}
function toFs(v){if(v==null)return {nullValue:null};if(Array.isArray(v))return {arrayValue:{values:v.filter(function(x){return x!==undefined}).map(toFs)}};
  if(typeof v==="boolean")return {booleanValue:v};if(typeof v==="number")return Number.isInteger(v)?{integerValue:String(v)}:{doubleValue:v};
  if(typeof v==="object"){var f={};for(var k in v)if(v[k]!==undefined)f[k]=toFs(v[k]);return {mapValue:{fields:f}}}return {stringValue:String(v)}}
function fsURL(path,q){var c=liveFb();return "https://firestore.googleapis.com/v1/projects/"+c.projectId+"/databases/(default)/documents/"+path+"?"+(q?q+"&":"")+"key="+encodeURIComponent(c.apiKey)}
function liveGet(path){var c=liveFb(),parts=path.split("/");
  if(!c){var d=liveDemoDB();return Promise.resolve(((d[parts[0]]||{})[parts[1]])||null)}
  return fetch(fsURL(path)).then(function(r){return r.ok?r.json().then(function(j){return fsObj(j.fields||{})}):null}).catch(function(){return null})}
var livePend={};
function livePimg(id){if(!id||(window.__pimg&&__pimg[id])||livePend[id])return;livePend[id]=1;
  liveGet("pimg/"+id).then(function(d){if(!d||!d.data)return;__pimg[id]=d.data;$$('img[data-pimg="'+id+'"]').forEach(function(im){im.src=d.data})})}
/* ---------- requests from the website go to the office ---------- */
async function liveSaveRequest(rec,subject,text){rec.region=REGION;var ok=false,c=liveFb();
  if(c){try{var r=await fetch(fsURL("requests","documentId="+encodeURIComponent(rec.ref)),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:toFs(rec).mapValue.fields})});ok=r.ok}catch(e){}}
  else{try{var d=liveDemoDB();d.requests=d.requests||{};d.requests[rec.ref]=JSON.parse(JSON.stringify(rec));localStorage.setItem("jora_demo_db",JSON.stringify(d))}catch(e){}}
  var E=liveCfg().emailjs,ct0=rec.contact||{};if(E&&E.publicKey&&E.teamService&&E.alertTemplate){try{var r3=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({service_id:E.teamService,template_id:E.alertTemplate,user_id:E.publicKey,template_params:{subject:subject+" · "+(REGION==="sk"?"Saskatchewan":"GTA"),from_name:"Jora Mechanical website",reply_to:ct0.email||"admin@joramechanicalsystems.com",message:text+"\n\nName: "+(((ct0.firstName||"")+" "+(ct0.lastName||"")).trim()||"Website visitor")+"\nPhone: "+(ct0.phone||"—")+"\nEmail: "+(ct0.email||"—")}})});if(r3.ok)return true}catch(e){}}
  var k=liveCfg().web3formsKey;if(k){try{var ct=rec.contact||{};var r2=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},
    body:JSON.stringify({access_key:k,subject:subject+" · "+(REGION==="sk"?"Saskatchewan":"GTA"),from_name:"Jora Mechanical website",name:((ct.firstName||"")+" "+(ct.lastName||"")).trim()||"Website visitor",email:ct.email||"",phone:ct.phone||"",message:text})});ok=ok||r2.ok}catch(e){}}
  return ok}
/* ---------- page changes (safe to run again when fresh settings arrive) ---------- */
function liveItemURL(id){return ROOT+"products/item/"+LINKS.idx+"?id="+encodeURIComponent(id)}
function liveCard(p){return '<article class="pc" data-live="1" data-product="'+esc(p.id)+'" data-brand="'+esc(p.brand)+'"><div class="pim">'+(p.flag?'<span class="flag">'+esc(p.flag)+'</span>':'')+visual(p)+'</div><div class="pb"><div class="pbr">'+brandMark(p.brand,"card")+'</div>'+
  '<h3><a href="'+liveItemURL(p.id)+'">'+esc(p.name)+'</a></h3><div class="kv">'+(p.feats3||[]).map(function(f){return "<span>"+esc(f)+"</span>"}).join("")+'</div><div class="pr">Installed price: free quote<small>Equipment, labour &amp; permits in writing</small></div>'+
  '<div class="row"><a class="btn o sm" href="'+liveItemURL(p.id)+'">Details</a><button class="btn sm" type="button" data-quote-product="'+esc(p.id)+'">Get quote</button></div></div></article>'}
function liveHex(c){return /^#[0-9a-f]{6}$/i.test(c||"")?c:null}
function liveDom(P){P=P||{};var hid=P.hidden||[],root=document.documentElement;
  /* colours */
  var cm=liveHex(P.colors&&P.colors.main),ca=liveHex(P.colors&&P.colors.accent);
  if(cm){root.style.setProperty("--or",cm);root.style.setProperty("--or-l",cm+"1f")}else{root.style.removeProperty("--or");root.style.removeProperty("--or-l")}
  if(ca)root.style.setProperty("--red",ca);else root.style.removeProperty("--red");
  /* announcement bar */
  var old=$("#annc");if(old)old.remove();var an=P.announce||{},key="jora_annc_"+(an.text||"");
  if(an.on&&an.text&&!sessionStorage.getItem(key)){var bar=document.createElement("div");bar.id="annc";bar.className="annc";
    bar.innerHTML='<div class="wrap"><span>'+esc(an.text)+'</span>'+(an.link&&/^(https?:\/\/|\/|tel:|mailto:)/.test(an.link)?' <a href="'+esc(an.link)+'">'+esc(an.linkText||"Learn more")+' ›</a>':'')+'<button type="button" aria-label="Close">×</button></div>';
    bar.querySelector("button").onclick=function(){try{sessionStorage.setItem(key,"1")}catch(e){}bar.remove()};var site=$("#site");site.insertBefore(bar,site.firstChild)}
  /* hidden products: hide their cards and menu links */
  $$('.pc[data-product]:not([data-live])').forEach(function(c){c.hidden=hid.indexOf(c.dataset.product)>-1});
  $$('.mega-p').forEach(function(a){var m=/products\/([^/]+)\//.exec(a.getAttribute("href")||"");if(m)a.hidden=hid.indexOf(m[1])>-1});
  /* added products on category pages */
  $$(".pgrid[data-cat]").forEach(function(g){$$('[data-live]',g).forEach(function(x){x.remove()});var cat=g.dataset.cat,L=CUSTOM.filter(function(p){return p.cat===cat});
    g.insertAdjacentHTML("beforeend",L.map(liveCard).join(""));var pf=g.parentNode.querySelector(".pfilter");if(!pf)return;
    L.forEach(function(p){if(!$$('[data-pf]',pf).some(function(b){return b.dataset.pf===p.brand})){pf.insertAdjacentHTML("beforeend",'<button type="button" data-pf="'+esc(p.brand)+'" aria-pressed="false" data-live="1">'+brandMark(p.brand,"chip")+'<small>'+L.filter(function(q){return q.brand===p.brand}).length+' model(s)</small></button>')}});
    var all=pf.querySelector('[data-pf="All"] small');if(all)all.textContent=$$(".pc",g).filter(function(c){return !c.hidden}).length+" models"});
  /* numbers slider */
  var st=P.stats||{};$$("#statTrack [data-n]").forEach(function(b,i){var lab=b.parentNode.querySelector(".stc-l");if(!lab)return;var t=lab.textContent,n=/customers/i.test(t)?+st.customers:/experience/i.test(t)?+st.years:0;if(n){b.dataset.n=n;b.textContent=(n>=1000?n.toLocaleString("en-CA"):n)+(b.dataset.s||"")}});
  if(+st.customers)$$(".tb-c").forEach(function(e){e.textContent=(+st.customers).toLocaleString("en-CA")+"+"});if(+st.years)$$(".tb-y").forEach(function(e){e.textContent=+st.years});
  /* weather effect */
  if(!/[?&#]weather=/.test(location.search+location.hash)){var w=P.weather&&P.weather!=="auto"?P.weather:null;if(w!==WXFORCE){WXFORCE=w;wxApply()}}
  /* added product page */
  if(has("#pItem"))liveItem()}
function liveItem(){var id=(/[?&]id=([^&]+)/.exec(location.search)||[])[1],p=id&&CUSTOM.find(function(x){return x.id===decodeURIComponent(id)}),box=$("#pItem");
  if(!p){box.innerHTML=window.__liveFetched?'<div class="emp" style="padding:40px 0"><h1 class="h2">Product not found</h1><p>This product may have been removed. <a href="'+ROOT+LINKS.idx+'">Back to the home page</a> or call <a href="tel:+19056672823">905-667-2823</a>.</p></div>':'<p style="padding:40px 0;color:#666">Loading…</p>';return}
  document.title=p.name+" | Jora Mechanical Systems";var cu=L("cat",p.cat);
  box.innerHTML='<nav class="crumbs" aria-label="Breadcrumb"><a href="'+ROOT+LINKS.idx+'">Home</a> › '+(cu?'<a href="'+cu+'">'+esc(CATS[p.cat].name)+'</a> › ':'')+'<span>'+esc(p.name)+'</span></nav>'+
   '<div class="pitem"><div class="pi-im">'+(p.flag?'<span class="flag">'+esc(p.flag)+'</span>':'')+visual(p)+'</div><div class="pi-t"><div class="pbr">'+brandMark(p.brand,"card")+'</div><h1>'+esc(p.name)+'</h1>'+(p.tag?'<p class="lead">'+esc(p.tag)+'</p>':'')+
   (p.specs.length?'<table class="spec"><tbody>'+p.specs.map(function(s){return '<tr><th>'+esc(s[0])+'</th><td>'+esc(s[1])+'</td></tr>'}).join("")+'</tbody></table>':'')+
   (p.feats.length?'<ul class="fe">'+p.feats.map(function(f){return '<li>'+esc(f)+'</li>'}).join("")+'</ul>':'')+(p.more?'<p>'+esc(p.more)+'</p>':'')+
   '<div class="phero-ctas"><button class="btn" type="button" data-quote-product="'+esc(p.id)+'">Get a free quote</button><a class="btn wk" href="tel:+19056672823">Call 905-667-2823</a></div>'+
   '<p class="src">Installed price depends on your home — your written quote includes equipment, labour and permits.</p></div></div>'}
/* account link in the header */
(function(){try{var a=JSON.parse(localStorage.getItem("jora_acct")||"null");if(a&&a.name)$$(".acct-l").forEach(function(l){var sp=l.querySelector("span");if(sp)sp.textContent="Hi, "+a.name.split(" ")[0]})}catch(e){}})();
/* draw cached settings now, then fetch fresh ones */
liveDom(window.__live);
liveGet("public/"+REGION).then(function(P){window.__liveFetched=true;if(!P){if(has("#pItem"))liveItem();return}
  var s=JSON.stringify(P);if(s===JSON.stringify(window.__liveRaw||null)){if(has("#pItem"))liveItem();return}
  try{localStorage.setItem(liveKey(),s)}catch(e){}window.__liveRaw=P;liveData(P);renderShop();liveDom(P)});
/* mobile menu + bottom bar chat button */
(function(){var b=$(".mburger"),m=$("#mnav");if(b&&m){function set(o){m.hidden=!o;b.setAttribute("aria-expanded",o);b.setAttribute("aria-label",o?"Close menu":"Open menu");document.body.classList.toggle("mnav-on",o)}
  b.addEventListener("click",function(){set(m.hidden)});
  m.addEventListener("click",function(e){var g=e.target.closest(".mg-b");if(g){var ul=document.getElementById(g.getAttribute("aria-controls")),o=g.getAttribute("aria-expanded")!=="true";g.setAttribute("aria-expanded",o);ul.hidden=!o;g.parentNode.classList.toggle("open",o);return}if(e.target.closest("a,[data-open]"))set(false)});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!m.hidden){set(false);b.focus()}});
  addEventListener("resize",function(){if(innerWidth>900&&!m.hidden)set(false)})}
  document.addEventListener("click",function(e){if(e.target.closest("[data-chat]")){var f=$("#chatFab");if(f)f.click()}})})();
(function(){var i=$("#sIn");if(!i)return;var full=i.placeholder;function ph(){i.placeholder=innerWidth<=900?"Search services, products…":full}ph();addEventListener("resize",ph)})();
/* mobile search button */
(function(){var ts=$$(".msearch"),bar=$("#hdr");if(!ts.length||!bar)return;ts.forEach(function(t){t.addEventListener("click",function(){var o=!bar.classList.contains("s-on");bar.classList.toggle("s-on",o);ts.forEach(function(x){x.setAttribute("aria-expanded",o)});if(o){var m=$("#mnav"),b=$(".mburger");if(m&&!m.hidden&&b)b.click();setTimeout(function(){var i=$("#sIn");i&&i.focus()},50)}})})})();

/* live weather chip in the top line + desktop floating Book / Call / Chat bar */
(function(){var chip=$(".wxchip");var ICW={sun:"☀️",hot:"🔥",cloud:"☁️",fog:"🌫️",rain:"🌧️",storm:"⛈️",snow:"❄️",cold:"🥶"};
  function draw(){if(!chip||typeof WX==="undefined"||WX.temp==null)return;var k=document.body.classList.contains("wx-night")&&WX.kind==="sun"?"🌙":(ICW[WX.kind]||"🌡️");
    chip.innerHTML='<i class="wx-live" aria-hidden="true"></i><span class="wxi" aria-hidden="true">'+k+'</span><b>'+Math.round(WX.temp)+'°C</b><span>'+esc(WX.city||"")+'</span><small>Live</small>';chip.hidden=false;chip.title="Live weather — the website changes with it"}
  draw();var n=0,t=setInterval(function(){draw();if(++n>20){clearInterval(t);setInterval(draw,60000)}},2000);
  var fd=$(".fdock");if(fd){var on=false;function chk(){var s=scrollY>140;if(s!==on){on=s;document.body.classList.toggle("fd-on",s)}}addEventListener("scroll",chk,{passive:true});chk()}})();

/* desktop drop-down menus (hover, click and keyboard) */
(function(){var dds=$$(".dd");if(!dds.length)return;var hov=matchMedia("(hover:hover)").matches,tm;
  function close(x){dds.forEach(function(d){if(d!==x){d.classList.remove("open");d.querySelector(".dd-b").setAttribute("aria-expanded","false")}})}
  function open(d){close(d);d.classList.add("open");d.querySelector(".dd-b").setAttribute("aria-expanded","true")}
  dds.forEach(function(d){var b=d.querySelector(".dd-b");
    b.addEventListener("click",function(){d.classList.contains("open")?close():open(d)});
    if(hov){d.addEventListener("mouseenter",function(){clearTimeout(tm);open(d)});d.addEventListener("mouseleave",function(){tm=setTimeout(function(){d.classList.remove("open");b.setAttribute("aria-expanded","false")},180)})}
    d.addEventListener("click",function(e){if(e.target.closest("a,[data-open]"))close()})});
  document.addEventListener("click",function(e){if(!e.target.closest(".dd"))close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")close()})})();
/* thermostat dial: shows the real outside temperature where the visitor is (setpoint shows briefly when + / − are pressed) */
function dialMode(){var d=$("#dial");if(!d)return;var live=WX.temp!=null,showSet=Date.now()<(window.__setUntil||0);
  var cool=live?WX.temp>=24:document.body.classList.contains("wx-hot");d.classList.toggle("cool",cool);
  if(showSet||!live){$("#tMode").textContent=(cool?"Cool":"Heat")+" to";$("#tSet").textContent=WX.set+"°";d.style.setProperty("--p",Math.round((WX.set-16)/12*100))}
  else{$("#tMode").textContent="Outside";$("#tSet").textContent=Math.round(WX.temp)+"°";d.style.setProperty("--p",Math.max(4,Math.min(100,Math.round((WX.temp+30)/65*100))))}
  d.title=live?"Live temperature in "+(WX.city||"your area")+": "+Math.round(WX.temp)+"°C":"";
  var cap=$("#dialCap");if(!cap){cap=document.createElement("span");cap.id="dialCap";cap.className="dial-cap";d.appendChild(cap)}
  var nm=String(WX.city||"Your area").replace(/\s*\(.*?\)\s*/g,"").trim();cap.style.fontSize=nm.length>18?"9.5px":nm.length>13?"10.5px":"";
  cap.innerHTML=live?'<i aria-hidden="true"></i>'+(showSet?"Your setting":esc(nm)):""}
(function(){$$("#dial .dn,#dial .up").forEach(function(b){b.addEventListener("click",function(){window.__setUntil=Date.now()+2200;dialMode();setTimeout(dialMode,2300)})});dialMode()})();
/* ---------- office-panel content: SEO per page, blog posts, Our Work projects ---------- */
function livePath(){try{var base=new URL(ROOT,location.href).pathname,p=location.pathname;if(p.indexOf(base)===0)p=p.slice(base.length);return p.replace(/index\.html$/,"")}catch(e){return ""}}
function liveMeta(sel,attr,val){var m=document.querySelector(sel);if(m&&val)m.setAttribute(attr,val)}
function liveSEO(P){var s=(P.seo||{})[livePath()];if(!s)return;if(s.title){document.title=s.title;liveMeta('meta[property="og:title"]',"content",s.title)}
  if(s.desc){liveMeta('meta[name="description"]',"content",s.desc);liveMeta('meta[property="og:description"]',"content",s.desc)}}
function livePosts(P){return (P.posts||[]).filter(function(x){return x&&x.id&&!x.off&&x.title}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""))})}
function livePostURL(id){return ROOT+"blog/post/"+LINKS.idx+"?id="+encodeURIComponent(id)}
function livePostCard(x){return '<article class="post" data-live="1"><div class="pt pt-photo">'+(x.imgDoc?'<img data-pimg="'+esc(x.imgDoc)+'" src="'+((window.__pimg||{})[x.imgDoc]||liveBlank())+'" alt="">':'')+'<span>'+esc(x.tag||"Advice")+'</span></div><div class="pb"><time>'+esc(x.date||"")+'</time><h3><a href="'+livePostURL(x.id)+'">'+esc(x.title)+'</a></h3><p>'+esc(x.excerpt||"")+'</p><a class="more" href="'+livePostURL(x.id)+'">Read more ›</a></div></article>'}
function liveContent(P){P=P||{};liveSEO(P);var L=livePosts(P);
  [["#blogAll",99],["#blogGrid",3]].forEach(function(g){var el=$(g[0]);if(!el)return;$$('[data-live]',el).forEach(function(x){x.remove()});if(!L.length)return;
    el.insertAdjacentHTML("afterbegin",L.slice(0,g[1]).map(livePostCard).join(""));if(g[1]<99){var cards=$$(".post",el);cards.slice(g[1]).forEach(function(c){c.remove()})}
    L.forEach(function(x){if(x.imgDoc)livePimg(x.imgDoc)})});
  if(has("#postItem")){var id=(/[?&]id=([^&]+)/.exec(location.search)||[])[1],x=id&&L.find(function(q){return q.id===decodeURIComponent(id)}),box=$("#postItem");
    if(!x){box.innerHTML=window.__liveFetched?'<h1 class="h2">Article not found</h1><p>It may have been removed. <a href="'+ROOT+'blog/'+LINKS.idx+'">See all articles</a>.</p>':'<p style="color:#666">Loading…</p>'}
    else{document.title=x.title+" | Jora Mechanical Systems";liveMeta('meta[name="description"]',"content",x.excerpt||x.title);
      box.innerHTML='<nav class="crumbs" aria-label="Breadcrumb"><a href="'+ROOT+LINKS.idx+'">Home</a> › <a href="'+ROOT+'blog/'+LINKS.idx+'">Advice</a> › <span>'+esc(x.title)+'</span></nav>'+
        '<article class="lpost"><span class="kick">'+esc(x.tag||"Advice")+'</span><h1>'+esc(x.title)+'</h1><p class="lp-meta">'+esc(x.date||"")+' · Jora Mechanical Systems</p>'+
        (x.imgDoc?'<img class="lp-img" data-pimg="'+esc(x.imgDoc)+'" src="'+((window.__pimg||{})[x.imgDoc]||liveBlank())+'" alt="'+esc(x.title)+'">':'')+
        (x.excerpt?'<p class="lead">'+esc(x.excerpt)+'</p>':'')+String(x.body||"").split(/\n\s*\n/).map(function(t){t=t.trim();if(!t)return "";return /^#{1,3}\s/.test(t)?'<h2>'+esc(t.replace(/^#+\s*/,""))+'</h2>':'<p>'+esc(t).replace(/\n/g,"<br>")+'</p>'}).join("")+
        '<div class="phero-ctas" style="margin-top:26px"><button class="btn" type="button" data-open="quote">Get a free quote</button><a class="btn wk" href="tel:+19056672823">Call 905-667-2823</a></div></article>';
      if(x.imgDoc)livePimg(x.imgDoc)}}
  var PR=(P.projects||[]).filter(function(x){return x&&!x.off&&x.title});
  if(PR.length&&(has("#wpGrid")||has("#workStrip"))&&typeof renderWork==="function"){var need=[];PR.forEach(function(x){(x.photos||[]).forEach(function(i){if(!(window.__pimg||{})[i])need.push(i)})});
    Promise.all(need.map(function(i){return liveGet("pimg/"+i).then(function(d){if(d&&d.data)__pimg[i]=d.data})})).then(function(){
      WORKDB=PR.map(function(x){return {title:x.title,city:x.city||"",date:x.date||"",cat:x.cat||"furnace",brand:x.brand||"",text:x.text||"",photos:(x.photos||[]).map(function(i){return __pimg[i]}).filter(Boolean)}});renderWork()})}}
liveContent(window.__live);
(function(){var t=setInterval(function(){if(window.__liveFetched){clearInterval(t);liveContent(window.__live)}},400);setTimeout(function(){clearInterval(t)},15000)})();



/* ======================= WEATHER v2 =======================
   Reliable live weather: the visitor's area is remembered for a week, the last good
   reading is kept (so the chip and thermostat show instantly), three location
   services and two weather services back each other up, and failed look-ups retry
   on their own. The effects are drawn to look like the real thing. */
var WXR=(typeof REGION!=="undefined"&&REGION==="sk")?{prov:"Saskatchewan",lat:52.1332,lon:-106.67,city:"Saskatoon",tz:"America/Regina"}:{prov:"Ontario",lat:43.589,lon:-79.644,city:"Mississauga",tz:"America/Toronto"};
function wxKey(k){return "jora_"+k+"_"+(typeof REGION!=="undefined"?REGION:"gta")}
function wxLS(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(wxKey(k))||"null");localStorage.setItem(wxKey(k),JSON.stringify(v))}catch(e){return null}}
function wxHour(){try{var p=new Intl.DateTimeFormat("en-CA",{timeZone:WXR.tz,hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date()),h=0,m=0;p.forEach(function(x){if(x.type==="hour")h=+x.value%24;if(x.type==="minute")m=+x.value});return h+m/60}catch(e){var d=new Date();return d.getHours()+d.getMinutes()/60}}
function wxSeason(){var mo=new Date().getMonth(),h=wxHour(),win=mo<=1||mo>=10;return {kind:mo<=1||mo===11?"snow":mo===2||mo===3||mo===10?"cloud":mo>=5&&mo<=7?"hot":"sun",night:win?(h<7.5||h>=17.5):(h<6||h>=20.5)}}
async function wxJSON(url,ms){var c=new AbortController(),t=setTimeout(function(){c.abort()},ms||5000);try{var r=await fetch(url,{signal:c.signal,cache:"no-store"});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}finally{clearTimeout(t)}}
async function wxGeo(){var g0=wxLS("geo");if(g0&&Date.now()-g0.ts<(g0.fallback?864e5:7*864e5))return g0;
  function pick(lat,lon,cc,reg,city){return cc==="CA"&&reg===WXR.prov&&lat?{lat:+lat,lon:+lon,city:city||WXR.city,region:reg}:{outside:true}}
  var tries=[
    wxJSON("https://get.geojs.io/v1/ip/geo.json",4000).then(function(g){return pick(g.latitude,g.longitude,g.country_code,g.region,g.city)}),
    wxJSON("https://ipwho.is/?fields=success,latitude,longitude,country_code,city,region",4000).then(function(h){if(!h.success)throw 0;return pick(h.latitude,h.longitude,h.country_code,h.region,h.city)}),
    wxJSON("https://ipapi.co/json/",4000).then(function(a){if(a.error)throw 0;return pick(a.latitude,a.longitude,a.country_code,a.region,a.city)})];
  var r=await new Promise(function(res){var left=tries.length,out=null;tries.forEach(function(p){p.then(function(v){if(v&&!v.outside)res(v);else{out=v;if(--left===0)res(out)}},function(){if(--left===0)res(out)})})});
  var loc=r&&!r.outside?r:{lat:WXR.lat,lon:WXR.lon,city:WXR.city,region:WXR.prov,fallback:true};
  if(r){loc.ts=Date.now();wxLS("geo",loc)}return loc}
var WWO={113:0,116:2,119:3,122:3,143:45,248:45,260:45,200:95,386:95,389:95,392:95,395:95};
[176,263,266,281,284,293,296,299,302,305,308,311,314,353,356,359].forEach(function(c){WWO[c]=61});
[179,182,185,227,230,317,320,323,326,329,332,335,338,350,362,365,368,371,374,377].forEach(function(c){WWO[c]=71});
async function wxFetch(lat,lon){var u="https://api.open-meteo.com/v1/forecast?latitude="+(+lat).toFixed(3)+"&longitude="+(+lon).toFixed(3)+"&current=temperature_2m,weather_code,is_day&timezone=auto";
  for(var i=0;i<2;i++){try{var j=await wxJSON(u,i?9000:6000),c=j&&j.current;if(c&&c.temperature_2m!=null){var r=wxClassify(c.weather_code,c.temperature_2m,c.is_day);return {kind:r.kind,night:r.night,temp:c.temperature_2m,code:c.weather_code}}}catch(e){}}
  var w=await wxJSON("https://wttr.in/"+(+lat).toFixed(3)+","+(+lon).toFixed(3)+"?format=j1",9000),cc=w.current_condition[0],code=WWO[+cc.weatherCode];if(code==null)code=3;
  var day=true;try{var a=w.weather[0].astronomy[0];var pt=function(s){var m=/(\d+):(\d+)\s*(AM|PM)/i.exec(s);return m?(+m[1]%12+(/PM/i.test(m[3])?12:0))+m[2]/60:null};var sr=pt(a.sunrise),st=pt(a.sunset),h=wxHour();if(sr!=null&&st!=null)day=h>=sr&&h<st}catch(e){}
  var r2=wxClassify(code,+cc.temp_C,day?1:0);return {kind:r2.kind,night:r2.night,temp:+cc.temp_C,code:code}}
function wxSave(){wxLS("wx",{kind:WX.kind,night:WX.night,temp:WX.temp,code:WX.code,city:WX.city,region:WX.region,live:true,ts:WX.ts})}
async function wxLoad(force){var c0=wxLS("wx"),age=c0?Date.now()-c0.ts:1e12;
  if(!force&&age<15*6e4){Object.assign(WX,c0);window.JORA_WX=WX;wxApply();return true}
  if(age<6*36e5&&WX.temp==null){Object.assign(WX,c0);wxApply()}
  var loc=await wxGeo(),r=null;try{r=await wxFetch(loc.lat,loc.lon)}catch(e){}
  if(r){WX.city=loc.city;WX.region=loc.region;WX.kind=r.kind;WX.night=r.night;WX.temp=r.temp;WX.code=r.code;WX.live=true;WX.ts=Date.now();wxSave();window.JORA_WX=WX;wxApply();return true}
  if(age<24*36e5){Object.assign(WX,c0);wxApply();return false}
  var s=wxSeason();WX.kind=s.kind;WX.night=s.night;WX.city=WX.city||loc.city;wxApply();return false}
(function(){var fails=0;
  function again(ok){clearTimeout(window.__wxT);if(ok)fails=0;window.__wxT=setTimeout(run,ok?15*6e4:Math.min(10*6e4,3e4*Math.pow(2,fails++)))}
  function run(){wxLoad(true).then(again,function(){again(false)})}
  setTimeout(function(){var ok=WX.live&&WX.ts&&Date.now()-WX.ts<15*6e4;ok?again(true):run()},9000);
  document.addEventListener("visibilitychange",function(){if(!document.hidden&&(!WX.ts||Date.now()-WX.ts>15*6e4))run()});
  addEventListener("online",run)})();

/* ---- effects: real-looking rain, snow and ice glints; soft sun is done in CSS ---- */
var FXS={};function fxSprite(kind){if(FXS[kind])return FXS[kind];var s=document.createElement("canvas"),S=64;s.width=s.height=S;var g=s.getContext("2d"),gr=g.createRadialGradient(S/2,S/2,0,S/2,S/2,S/2);
  if(kind==="snow"){gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(.35,"rgba(255,255,255,.92)");gr.addColorStop(.6,"rgba(255,255,255,.45)");gr.addColorStop(1,"rgba(255,255,255,0)")}
  else if(kind==="shade"){gr.addColorStop(0,"rgba(70,90,120,.30)");gr.addColorStop(.5,"rgba(70,90,120,.14)");gr.addColorStop(1,"rgba(70,90,120,0)")}
  else{gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(.2,"rgba(235,245,255,.8)");gr.addColorStop(1,"rgba(200,225,255,0)")}
  g.fillStyle=gr;g.fillRect(0,0,S,S);if(kind==="ice"){g.strokeStyle="rgba(255,255,255,.7)";g.lineWidth=1.2;g.beginPath();g.moveTo(S/2,6);g.lineTo(S/2,S-6);g.moveTo(6,S/2);g.lineTo(S-6,S/2);g.stroke()}
  return FXS[kind]=s}
function fxNew(m,any){var w=fx.w,h=fx.h,z=Math.random();
  if(m==="rain"||m==="storm"){z=Math.pow(z,1.5);return {x:Math.random()*(w+300)-50,y:any?Math.random()*h:-Math.random()*h*.3-30,z:z,v:(m==="storm"?19:14)+z*15,l:9+z*24}}
  if(m==="snow"){z=Math.pow(z,2.4);return {x:Math.random()*w,y:any?Math.random()*h:-12-Math.random()*60,z:z,r:1.1+z*5.2,v:.32+z*1.25,p:Math.random()*6.28,ps:.005+Math.random()*.012,sw:.25+z*1.1}}
  if(m==="frost"){return {x:Math.random()*w,y:any?Math.random()*h:-8,z:z,r:.8+z*1.6,v:.12+z*.3,p:Math.random()*6.28,ps:.02+Math.random()*.04,sw:.2}}
  return {x:Math.random()*w,y:Math.random()*h,s:Math.random(),p:Math.random()*6.28}}
function fxStart(kind,night){var m=kind==="off"?"none":kind==="frost"?"frost":kind==="storm"?"storm":kind==="rain"?"rain":kind==="snow"?"snow":kind==="hot"?"heat":kind==="fog"?"fog":kind==="cloud"?"cloud":night?"stars":"sun";
  if(m===fx.mode)return;fx.mode=m;fxSize();fx.ctx.clearRect(0,0,fx.w,fx.h);var area=Math.max(.4,Math.min(1.5,fx.w*fx.h/(1440*900)));
  var n=Math.round(({storm:380,rain:280,snow:220,frost:60,stars:0,cloud:9,fog:7}[m]||0)*area*(reduce?.6:1));
  fx.parts=[];for(var i=0;i<n;i++)fx.parts.push(fxNew(m,true));fx.splash=[];fx.drops=[];fx.last=0;
  if(n&&!fx.run){fx.run=true;requestAnimationFrame(fxDraw)}}
function fxDraw(now){var c=fx.ctx,w=fx.w,h=fx.h,m=fx.mode;
  if(!fx.parts.length||m==="none"||m==="sun"||m==="heat"){c.clearRect(0,0,w,h);fx.run=false;return}
  if(document.hidden){setTimeout(function(){requestAnimationFrame(fxDraw)},500);return}
  fx.odd=!fx.odd;if(fx.odd&&fx.last){requestAnimationFrame(fxDraw);return}
  var dt=fx.last?Math.min(3,(now-fx.last)/16.7):1;fx.last=now;c.clearRect(0,0,w,h);
  var nt=document.body.classList.contains("wx-night");
  if(m==="rain"||m==="storm"){var wind=m==="storm"?.32:.16,col=nt?"200,214,236":"88,106,132",B=[[],[],[]];
    fx.parts.forEach(function(p,i){p.y+=p.v*dt;p.x-=p.v*wind*dt;if(p.y-p.l>h||p.x<-60){if(p.z>.55&&Math.random()<.5)fx.splash.push({x:p.x,y:h-2-Math.random()*4,t:0,z:p.z});fx.parts[i]=fxNew(m,false);return}B[p.z<.35?0:p.z<.7?1:2].push(p)});
    [[.7,.17],[1,.28],[1.4,.42]].forEach(function(s,k){c.strokeStyle="rgba("+col+","+(nt?s[1]*1.25:s[1])+")";c.lineWidth=s[0];c.lineCap="round";c.beginPath();B[k].forEach(function(p){c.moveTo(p.x,p.y);c.lineTo(p.x+p.l*wind,p.y-p.l)});c.stroke()});
    c.lineWidth=.8;fx.splash=fx.splash.filter(function(s){s.t+=dt;var k=s.t/14;if(k>=1)return false;c.strokeStyle="rgba("+col+","+(.35*(1-k))+")";c.beginPath();c.ellipse(s.x,s.y,2+k*9*s.z,(2+k*9*s.z)*.25,0,0,6.28);c.stroke();
      c.fillStyle="rgba("+col+","+(.4*(1-k))+")";for(var d=-1;d<=1;d+=2){var px=s.x+d*k*7*s.z,py=s.y-Math.sin(k*3.14)*6*s.z;c.fillRect(px,py,1.2,1.2)}return true})}
  else if(m==="snow"||m==="frost"){var sp=fxSprite(m==="snow"?"snow":"ice"),sh=fxSprite("shade"),wind2=m==="snow"?.18:.05;
    fx.parts.forEach(function(p,i){p.p+=p.ps*dt;p.y+=p.v*dt;p.x+=(Math.sin(p.p)*p.sw*.55+wind2*(.4+p.z))*dt;if(p.y>h+12||p.x>w+20){fx.parts[i]=fxNew(m,false);return}
      var s=p.r*2.6;if(m==="snow"&&!nt){c.globalAlpha=.55+p.z*.3;c.drawImage(sh,p.x-s*.55+p.r*.25,p.y-s*.55+p.r*.45,s*1.1,s*1.1)}c.globalAlpha=m==="frost"?(.25+.75*Math.pow(Math.abs(Math.sin(p.p*2.2)),3)):(.7+p.z*.3);c.drawImage(sp,p.x-s/2,p.y-s/2,s,s)});c.globalAlpha=1}
  else if(m==="cloud"||m==="fog"){fx.parts.forEach(function(p,i){
      if(m==="cloud"){p.x+=(.1+p.s*.2)*dt;if(p.x>w+260)p.x=-260;var cy=30+(i%4)*55+p.s*30,r=70+p.s*90;
        for(var k=0;k<5;k++){var cx=p.x+(k-2)*r*.55,yy=cy+Math.sin(k*1.7+p.p)*r*.18,rr=r*(.55+.25*Math.sin(k+p.p));var g=c.createRadialGradient(cx,yy,0,cx,yy,rr);
          g.addColorStop(0,nt?"rgba(150,160,180,.2)":"rgba(255,255,255,.4)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.arc(cx,yy,rr,0,6.28);c.fill()}}
      else{p.x+=(.12+p.s*.2)*dt;if(p.x>w)p.x-=w*1.4;var by=h*(.15+i/fx.parts.length*.85),g2=c.createLinearGradient(0,by-80,0,by+80);g2.addColorStop(0,"rgba(235,240,245,0)");g2.addColorStop(.5,nt?"rgba(170,180,195,.16)":"rgba(240,244,248,.3)");g2.addColorStop(1,"rgba(235,240,245,0)");
        c.fillStyle=g2;c.beginPath();c.ellipse(p.x,by,w*.7,80,0,0,6.28);c.fill();c.beginPath();c.ellipse(p.x-w*1.4,by,w*.7,80,0,0,6.28);c.fill()}})}
  else if(m==="stars"){fx.parts.forEach(function(p){p.p+=(.01+p.s*.02)*dt;var a=.35+Math.pow(Math.abs(Math.sin(p.p)),2)*.65,r=.7+p.s*p.s*1.9;c.fillStyle="rgba(255,250,240,"+a.toFixed(2)+")";c.beginPath();c.arc(p.x,p.y*.72,r,0,6.28);c.fill();
      if(p.s>.9){c.fillStyle="rgba(255,240,220,"+(a*.18).toFixed(2)+")";c.beginPath();c.arc(p.x,p.y*.72,r*3.2,0,6.28);c.fill()}});
    /* now and then a shooting star */
    if(!fx.shoot&&Math.random()<.004*dt)fx.shoot={x:w*(.35+Math.random()*.6),y:h*(.05+Math.random()*.3),t:0,a:2.5+Math.random()*.5};
    if(fx.shoot){var q=fx.shoot;q.t+=dt;var k=q.t/50,len=140,dx=-Math.cos(q.a-2.2)*q.t*9,dy=Math.sin(q.a-2.2)*q.t*9+q.t*4;if(k>=1)fx.shoot=null;else{var x1=q.x+dx,y1=q.y+dy,g=c.createLinearGradient(x1,y1,x1+len*.9,y1-len*.45);g.addColorStop(0,"rgba(255,250,235,"+(.9*(1-k))+")");g.addColorStop(1,"rgba(255,250,235,0)");c.strokeStyle=g;c.lineWidth=1.6;c.beginPath();c.moveTo(x1,y1);c.lineTo(x1+len*.9,y1-len*.45);c.stroke()}}}
  requestAnimationFrame(fxDraw)}

/* hero model name: shrink only when a long model name would not fit on one line (desktop) */
(function(){var t=$("#jx-title");if(!t)return;
  function fit(){if(innerWidth<=980){t.style.removeProperty("--tfs");return}var s=t.querySelector("span");if(!s)return;t.style.removeProperty("--tfs");
    var cw=t.clientWidth,sw=s.scrollWidth;if(sw>cw&&cw>0){var fs=parseFloat(getComputedStyle(s).fontSize);t.style.setProperty("--tfs",Math.max(28,Math.floor(fs*cw/sw)-1)+"px")}}
  new MutationObserver(fit).observe(t,{childList:true,subtree:true,characterData:true});addEventListener("resize",fit);fit();
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit)})();

/* weather canvas: draw at normal resolution (much lighter on laptops and phones) */
function fxSize(){fx.w=innerWidth;fx.h=innerHeight;fx.cv.width=fx.w;fx.cv.height=fx.h;fx.ctx.setTransform(1,0,0,1,0,0)}

/* team section: the Jora team photo (the office can still replace it with their own photos in the admin panel) */
function renderTeam(){if(!has("#collage"))return;var ph=(SITE.teamPhotos||[]).filter(function(p){return p&&p.url}),src=ph.length?ph[0].url:(typeof IMG!=="undefined"&&IMG["jora-team"]);
  if(!src)return;var c=$("#collage");c.classList.add("one");
  c.innerHTML='<figure class="teamph"><img src="'+esc(src)+'" alt="'+esc(ph.length&&ph[0].caption||"The Jora Mechanical Systems team")+'" loading="lazy" decoding="async" width="1250" height="1499"><figcaption><b>Jora Mechanical Systems</b><span>Heating · Cooling · Gas</span></figcaption></figure>'}
