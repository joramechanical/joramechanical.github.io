/* lead source: which page, website or ad brought the visitor (saved with each request) */
(function(){try{var k="jora_track",q=new URLSearchParams(location.search),t=JSON.parse(sessionStorage.getItem(k)||"null");
  if(!t){var r=document.referrer||"",h="";try{h=r?new URL(r).hostname:""}catch(e){}
    if(h&&h.indexOf("joramechanicalsystems.com")>=0)h="";
    t={landing:location.pathname,ref:h,src:q.get("utm_source")||(q.get("gclid")?"google-ads":q.get("fbclid")?"facebook":/google\./.test(h)?"google":/bing\./.test(h)?"bing":/facebook|fb\.|instagram/.test(h)?"facebook":/yelp|homestars|yellowpages/.test(h)?h:h?"other site":"direct"),
       medium:q.get("utm_medium")||(q.get("gclid")?"cpc":/google\.|bing\./.test(h)?"organic":""),campaign:q.get("utm_campaign")||"",at:new Date().toISOString()};
    sessionStorage.setItem(k,JSON.stringify(t))}
  t.pages=(t.pages||0)+1;t.last=location.pathname;sessionStorage.setItem(k,JSON.stringify(t))}catch(e){}})();
window.joraTrack=function(){try{var t=JSON.parse(sessionStorage.getItem("jora_track")||"null");if(t)return {landing:String(t.landing||"").slice(0,120),src:String(t.src||"").slice(0,40),medium:String(t.medium||"").slice(0,30),campaign:String(t.campaign||"").slice(0,60),ref:String(t.ref||"").slice(0,80),pages:t.pages||1,last:String(t.last||"").slice(0,120)}}catch(e){}return {src:"unknown"}};
/* Jora guard: the website only runs on its own address and can't be shown inside another site */
(function(){try{var h=location.hostname,ok=["joramechanicalsystems.com","www.joramechanicalsystems.com","joramechanical.github.io","localhost","127.0.0.1"];
if(ok.indexOf(h)<0&&!/\.localhost$/.test(h)){document.documentElement.style.display="none";location.replace("https://joramechanicalsystems.com/");return}
if(window.top!==window.self){document.documentElement.style.display="none";try{window.top.location.replace(window.self.location.href)}catch(e){}}}catch(e){}})();
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function ic(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[k]||ICONS.home)+'</svg>'}
function money(n){return "$"+(Math.round((+n||0)*100)/100).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})}
function today(){return new Date().toISOString().slice(0,10)}
function has(s){return !!document.querySelector(s)}
function L(k,id){var m=LINKS[k];var u=id==null?m:m&&m[id];return u==null?null:ROOT+u+LINKS.idx}
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ======================= ILLUSTRATIONS ======================= */
function plate(brand,x,y,w){var c=BCOL[brand]||"#333";return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="22" rx="3" fill="#fff" stroke="'+c+'" stroke-width="2"/><text x="'+(x+w/2)+'" y="'+(y+15.5)+'" text-anchor="middle" font-family="Roboto Condensed,Arial" font-weight="800" font-size="13" fill="'+c+'">'+esc(brand.toUpperCase())+'</text>'}
function illAC(brand){var s='<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(brand)+' air conditioner illustration"><defs><linearGradient id="acg" x1="0" x2="1"><stop offset="0" stop-color="#d9dcdf"/><stop offset=".5" stop-color="#f4f5f6"/><stop offset="1" stop-color="#c8ccd0"/></linearGradient></defs>';
  s+='<ellipse cx="120" cy="214" rx="96" ry="10" fill="rgba(0,0,0,.18)"/><rect x="34" y="40" width="172" height="170" rx="6" fill="url(#acg)" stroke="#9aa0a6"/>';
  for(var i=0;i<16;i++)s+='<rect x="42" y="'+(70+i*8.4)+'" width="156" height="3.2" fill="#7c838a" opacity=".55"/>';
  s+='<rect x="30" y="30" width="180" height="16" rx="4" fill="#4a4f55"/><ellipse cx="120" cy="34" rx="62" ry="6" fill="#2b2f33"/>'+plate(brand,72,182,96)+'</svg>';return s}
function illFurn(brand){var s='<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(brand)+' furnace illustration"><defs><linearGradient id="fg" x1="0" x2="1"><stop offset="0" stop-color="#bfc3c7"/><stop offset=".55" stop-color="#e8eaec"/><stop offset="1" stop-color="#b3b8bd"/></linearGradient></defs>';
  s+='<ellipse cx="100" cy="250" rx="80" ry="8" fill="rgba(0,0,0,.18)"/><rect x="34" y="14" width="132" height="232" rx="4" fill="url(#fg)" stroke="#8d939a"/><rect x="44" y="26" width="112" height="98" rx="4" fill="#d5d8db" stroke="#a3a8ad"/><rect x="44" y="132" width="112" height="104" rx="4" fill="#d5d8db" stroke="#a3a8ad"/><circle cx="56" cy="128" r="4" fill="#555"/><circle cx="144" cy="128" r="4" fill="#555"/>'+plate(brand,56,64,88)+'<rect x="88" y="196" width="24" height="10" rx="3" fill="#333"/></svg>';return s}
function illTank(brand){var s='<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(brand)+' tankless water heater illustration"><defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#d0d3d6"/><stop offset=".5" stop-color="#f6f7f8"/><stop offset="1" stop-color="#c3c7cb"/></linearGradient></defs>';
  s+='<rect x="62" y="8" width="18" height="16" fill="#555"/><rect x="118" y="6" width="22" height="18" fill="#555"/><rect x="36" y="22" width="128" height="214" rx="12" fill="url(#tg)" stroke="#9aa0a6"/>'+plate(brand,56,70,88)+'<rect x="78" y="170" width="44" height="34" rx="4" fill="#222"/><text x="100" y="192" text-anchor="middle" font-family="monospace" font-size="13" fill="#58e07a">120°</text><rect x="70" y="236" width="10" height="12" fill="#888"/><rect x="120" y="236" width="10" height="12" fill="#888"/></svg>';return s}
function illGarage(p){var b=p.brand||"",c=BCOL[b]||"#333",id="gh"+(PID++);
  if(b==="Re-Verber-Ray"){var s='<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(b)+' infrared tube heater illustration"><defs><linearGradient id="'+id+'r" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f6f8"/><stop offset=".5" stop-color="#b9c0c7"/><stop offset="1" stop-color="#eef1f3"/></linearGradient><linearGradient id="'+id+'t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a7f86"/><stop offset=".45" stop-color="#d6dade"/><stop offset="1" stop-color="#5d6268"/></linearGradient><radialGradient id="'+id+'g" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ff7a1f" stop-opacity=".45"/><stop offset="1" stop-color="#ff7a1f" stop-opacity="0"/></radialGradient></defs>';
    s+='<path d="M20 40h280M60 40v-28M260 40v-28" stroke="#888" stroke-width="2"/><rect x="40" y="92" width="270" height="90" fill="url(#'+id+'g)"/><path d="M26 64 L48 44 H292 L314 64 Z" fill="url(#'+id+'r)" stroke="#9aa0a6"/><rect x="40" y="62" width="262" height="20" rx="10" fill="url(#'+id+'t)"/>';
    s+='<rect x="8" y="50" width="56" height="44" rx="5" fill="#2b2f33"/><rect x="14" y="56" width="44" height="14" rx="3" fill="'+c+'"/><text x="36" y="66.5" text-anchor="middle" font-family="Roboto Condensed,Arial" font-weight="800" font-size="9" fill="#fff">RE-VERBER-RAY</text><circle cx="24" cy="83" r="4" fill="#58e07a"/>';
    for(var i=0;i<7;i++)s+='<path d="M'+(80+i*32)+' 90 q6 10 0 20 t0 20" stroke="#ff8a3d" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>';
    return s+'<rect x="294" y="58" width="16" height="28" rx="3" fill="#555"/></svg>'}
  if(b==="Ouellet"){var e='<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(b)+' electric garage heater illustration"><defs><linearGradient id="'+id+'e" x1="0" x2="1"><stop offset="0" stop-color="#cfd3d7"/><stop offset=".5" stop-color="#f7f8f9"/><stop offset="1" stop-color="#c3c8cd"/></linearGradient></defs>';
    e+='<path d="M110 8v30M80 38h60" stroke="#666" stroke-width="5"/><rect x="40" y="38" width="140" height="132" rx="10" fill="url(#'+id+'e)" stroke="#9aa0a6"/>';
    for(var j=0;j<7;j++)e+='<rect x="54" y="'+(58+j*14)+'" width="112" height="7" rx="3" fill="#6b7178" transform="rotate(-6 110 '+(61+j*14)+')"/>';
    e+='<rect x="60" y="150" width="100" height="14" rx="3" fill="#fff" stroke="'+c+'" stroke-width="2"/><text x="110" y="161" text-anchor="middle" font-family="Roboto Condensed,Arial" font-weight="800" font-size="10" fill="'+c+'">OUELLET · 5000 W</text>';
    for(var k=0;k<4;k++)e+='<path d="M'+(70+k*26)+' 182 q5 8 0 16 t0 16" stroke="#ff8a3d" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/>';
    return e+'</svg>'}
  var u='<svg viewBox="0 0 260 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(b)+' gas garage heater illustration"><defs><linearGradient id="'+id+'b" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f3f4f5"/><stop offset=".55" stop-color="#d7dadd"/><stop offset="1" stop-color="#b9bec3"/></linearGradient><linearGradient id="'+id+'s" x1="0" x2="1"><stop offset="0" stop-color="#9da3a9"/><stop offset="1" stop-color="#d9dcdf"/></linearGradient><radialGradient id="'+id+'h" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ff7a1f" stop-opacity=".4"/><stop offset="1" stop-color="#ff7a1f" stop-opacity="0"/></radialGradient></defs>';
  u+='<path d="M70 4v40M190 4v40" stroke="#777" stroke-width="4"/><rect x="196" y="18" width="16" height="44" rx="3" fill="#8d939a"/><path d="M204 18V4h50" stroke="#8d939a" stroke-width="12" fill="none"/>';
  u+='<path d="M30 58 L56 40 H226 L244 58 V150 L226 166 H48 L30 150 Z" fill="url(#'+id+'b)" stroke="#8d939a"/><path d="M226 40 L244 58 V150 L226 166 Z" fill="url(#'+id+'s)"/>';
  u+='<rect x="48" y="166" width="178" height="58" fill="url(#'+id+'h)"/>';
  for(var n=0;n<6;n++)u+='<rect x="54" y="'+(118+n*7)+'" width="164" height="4" rx="2" fill="#2b2f33" opacity=".75"/>';
  u+='<rect x="74" y="66" width="128" height="26" rx="3" fill="#fff" stroke="'+c+'" stroke-width="2.4"/><text x="138" y="84" text-anchor="middle" font-family="Roboto Condensed,Arial" font-weight="800" font-size="14" fill="'+c+'">'+esc(b.toUpperCase())+'</text><text x="138" y="108" text-anchor="middle" font-family="Roboto Condensed,Arial" font-weight="700" font-size="10" fill="#555">'+esc((p.model||"").toUpperCase())+'</text>';
  for(var q=0;q<5;q++)u+='<path d="M'+(76+q*28)+' 176 q5 8 0 16 t0 16" stroke="#ff8a3d" stroke-width="2.4" fill="none" opacity=".55" stroke-linecap="round"/>';
  return u+'</svg>'}
function illFor(p){return p.cat==="gh"?illGarage(p):p.cat==="ac"||p.cat==="hp"?illAC(p.brand):p.cat==="water"?illTank(p.brand):illFurn(p.brand)}
function brandMark(b,size){return LOGO[b]?'<img class="bm bm-'+size+(b==="Kepler"?" dark":"")+'" src="'+LOGO[b]+'" alt="'+esc(b)+'">':'<span class="bmt">'+esc(b)+'</span>'}
function visual(p,cls){if(p.imgDoc){livePimg(p.imgDoc);return '<img'+(cls?' class="'+cls+'"':'')+' data-pimg="'+esc(p.imgDoc)+'" src="'+(window.__pimg&&__pimg[p.imgDoc]||"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==")+'" alt="'+esc(p.name)+'" loading="lazy">'}return p.imgUrl?'<img'+(cls?' class="'+cls+'"':'')+' src="'+esc(p.imgUrl)+'" alt="'+esc(p.name)+'" loading="lazy">':p.img&&IMG[p.img]?'<img'+(cls?' class="'+cls+'"':'')+' src="'+IMG[p.img]+'" alt="'+esc(p.name)+'" loading="lazy">':illFor(p)}

/* friendly team illustrations: women & men in JORA shirts and white trousers (shown until real photos are uploaded in Admin) */
var PID=0;
function person(x,y,s,o){o=o||{};var sk=o.skin||"#C68642",hc=o.hc||"#2b1d14",f=!!o.f,w=f?25:29,id="p"+(PID++);
  var g='<g transform="translate('+x+','+y+') scale('+s+')">';
  /* long hair behind */
  if(o.hair==="long")g+='<path d="M-21 -150q-4 34 2 58h38q6-24 2-58z" fill="'+hc+'"/>';
  /* shoes + white trousers */
  g+='<ellipse cx="-9" cy="2" rx="11" ry="5" fill="#151515"/><ellipse cx="9" cy="2" rx="11" ry="5" fill="#151515"/>';
  g+='<path d="M'+(-w+6)+' -70h'+(w-7)+'l-2 70h-'+(w-12)+'z" fill="#FBFBFB" stroke="#CFCFCF" stroke-width="1.5"/><path d="M1 -70h'+(w-7)+'l-3 70h-'+(w-12)+'z" fill="#F2F2F2" stroke="#CFCFCF" stroke-width="1.5"/>';
  g+='<rect x="'+(-w+5)+'" y="-76" width="'+(2*w-10)+'" height="7" rx="2" fill="#1E1E1E"/><rect x="-5" y="-76" width="10" height="7" fill="#C9C9C9"/>';
  /* orange JORA polo */
  g+='<defs><linearGradient id="'+id+'" x1="0" x2="1"><stop offset="0" stop-color="#E95A00"/><stop offset=".45" stop-color="#FF7A1F"/><stop offset="1" stop-color="#E25400"/></linearGradient></defs>';
  g+='<path d="M'+(-w)+' -120q0-14 14-16l12-3 12 3q14 2 14 16l'+(f?-3:0)+' 46h-'+(2*w-(f?6:0))+'z" fill="url(#'+id+')"/>';
  g+='<path d="M-9 -139l9 9 9-9" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M0 -130v14" stroke="#B84400" stroke-width="1.5"/>';
  g+='<rect x="'+(w*0.18)+'" y="-120" width="'+(f?18:20)+'" height="10" rx="1.5" fill="#1E1E1E"/><text x="'+(w*0.18+(f?9:10))+'" y="-112.3" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="6.6" fill="#FF7A1F">JORA</text>';
  g+='<text x="0" y="-86" text-anchor="middle" font-family="Arial" font-weight="700" font-size="4.6" fill="#fff" opacity=".9" letter-spacing=".3">MECHANICAL SYSTEMS</text>';
  /* arms: short orange sleeves then skin */
  var arm=function(sx,hang){var n=function(v){return " "+(+v.toFixed(2))};return '<path d="M'+n(sx*w)+n(-128)+' q'+n(sx*9)+n(4)+n(sx*11)+n(20)+' l'+n(-sx*9)+n(3)+' q'+n(-sx*3)+n(-10)+n(-sx*6)+n(-14)+'z" fill="#E86000"/>'+(hang?'<path d="M'+n(sx*(w+9))+n(-106)+' q'+n(sx*3)+n(18)+n(sx*1)+n(34)+'" stroke="'+sk+'" stroke-width="'+(f?7:8)+'" stroke-linecap="round" fill="none"/>':'')};
  if(o.cross){g+=arm(-1,0)+arm(1,0)+'<path d="M'+(-w-4)+' -106q'+(w+4)+' 16 '+(2*w+8)+' 0" stroke="'+sk+'" stroke-width="9" stroke-linecap="round" fill="none"/><path d="M'+(w+4)+' -100q-'+(w+4)+' 12 -'+(2*w+8)+' 0" stroke="'+sk+'" stroke-width="8" stroke-linecap="round" fill="none" opacity=".95"/>'}
  else g+=arm(-1,1)+arm(1,1);
  /* items */
  if(o.item==="box")g+='<g transform="translate('+(w+2)+',-74)"><rect width="34" height="22" rx="3" fill="#D7262B"/><rect width="34" height="6" fill="#B51E22"/><path d="M9 0v-7h16v7" stroke="#333" stroke-width="2.6" fill="none"/></g>';
  if(o.item==="tab")g+='<g transform="translate('+(w-6)+',-108) rotate(-12)"><rect width="20" height="27" rx="3" fill="#222"/><rect x="2" y="3" width="16" height="20" fill="#7cc8ff"/></g>';
  if(o.item==="gauge")g+='<g transform="translate('+(-w-30)+',-82)"><rect x="-2" y="8" width="34" height="9" rx="3" fill="#555"/><circle cx="6" cy="6" r="8" fill="#fff" stroke="#1F5FBF" stroke-width="3.5"/><circle cx="24" cy="6" r="8" fill="#fff" stroke="#D7262B" stroke-width="3.5"/></g>';
  /* neck + head */
  g+='<rect x="-5" y="-150" width="10" height="13" fill="'+sk+'"/><ellipse cx="0" cy="-165" rx="'+(f?15:16)+'" ry="18" fill="'+sk+'"/>';
  g+='<circle cx="-5.5" cy="-166" r="1.8" fill="#1d1d1d"/><circle cx="5.5" cy="-166" r="1.8" fill="#1d1d1d"/><path d="M-5 -157q5 4.5 10 0" stroke="#5a2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  if(f)g+='<circle cx="-9" cy="-160" r="2.6" fill="#ff8a7a" opacity=".45"/><circle cx="9" cy="-160" r="2.6" fill="#ff8a7a" opacity=".45"/>';
  if(o.beard)g+='<path d="M-14 -166q2 22 14 22t14-22q-4 10-14 10t-14-10z" fill="'+hc+'"/>';
  /* hair / headwear */
  var hr=o.hair||"short";
  if(hr==="cap")g+='<path d="M-17 -170q0-17 17-17t17 17z" fill="#1E1E1E"/><rect x="0" y="-173" width="26" height="5" rx="2.5" fill="#1E1E1E"/><circle cx="0" cy="-180" r="4" fill="#F96302"/>';
  else if(hr==="short")g+='<path d="M-16 -168q-1-18 16-18t16 18q-6-9-16-9t-16 9z" fill="'+hc+'"/>';
  else if(hr==="curly")g+='<circle cx="0" cy="-176" r="17" fill="'+hc+'"/><circle cx="-13" cy="-168" r="7" fill="'+hc+'"/><circle cx="13" cy="-168" r="7" fill="'+hc+'"/>';
  else if(hr==="long")g+='<path d="M-16 -164q-2-22 16-22t16 22q-4-12-16-12t-16 12z" fill="'+hc+'"/>';
  else if(hr==="pony")g+='<path d="M-16 -166q-1-20 16-20t16 20q-6-10-16-10t-16 10z" fill="'+hc+'"/><path d="M12 -178q16 4 10 30q-4-14-12-20z" fill="'+hc+'"/>';
  else if(hr==="bun")g+='<path d="M-16 -166q-1-20 16-20t16 20q-6-10-16-10t-16 10z" fill="'+hc+'"/><circle cx="0" cy="-188" r="8" fill="'+hc+'"/>';
  else if(hr==="hijab")g+='<path d="M-19 -160q-2-30 19-30t19 30q2 14-6 22h-26q-8-8-6-22z" fill="#1E1E1E"/><ellipse cx="0" cy="-163" rx="12" ry="14" fill="'+sk+'"/><circle cx="-4.5" cy="-165" r="1.7" fill="#1d1d1d"/><circle cx="4.5" cy="-165" r="1.7" fill="#1d1d1d"/><path d="M-4 -157q4 4 8 0" stroke="#5a2a1a" stroke-width="1.7" fill="none" stroke-linecap="round"/>';
  return g+'</g>'}
function wallBg(W,H,n){return '<defs><linearGradient id="wb'+n+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2A2A"/><stop offset="1" stop-color="#151515"/></linearGradient><radialGradient id="sp'+n+'" cx=".5" cy=".25" r=".7"><stop offset="0" stop-color="#FF8A3D" stop-opacity=".35"/><stop offset="1" stop-color="#FF8A3D" stop-opacity="0"/></radialGradient><linearGradient id="fl'+n+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DADADA"/><stop offset="1" stop-color="#BDBDBD"/></linearGradient></defs>'+
  '<rect width="'+W+'" height="'+H+'" fill="url(#wb'+n+')"/><rect width="'+W+'" height="'+H+'" fill="url(#sp'+n+')"/><rect y="'+(H*.78)+'" width="'+W+'" height="'+(H*.22)+'" fill="url(#fl'+n+')"/><rect y="'+(H*.78)+'" width="'+W+'" height="4" fill="#F96302"/>'}
function scene(n){PID=n*100;var W=600,H=340,s='<svg viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of the Jora team in uniform">'+wallBg(W,H,n);
  if(n===0){s+='<text x="300" y="48" text-anchor="middle" font-family="Arial Black,Arial" font-weight="900" font-size="40" fill="#F96302" letter-spacing="3">JORA</text><text x="300" y="68" text-anchor="middle" font-family="Arial" font-weight="700" font-size="12" fill="#fff" letter-spacing="5">MECHANICAL SYSTEMS</text>';
    var T=[[95,1,{skin:"#8D5524",hair:"curly",hc:"#1a1a1a",f:1,item:"tab"}],[170,1.05,{skin:"#F1C27D",hair:"cap",item:"gauge"}],[248,1.02,{skin:"#C68642",hair:"pony",hc:"#3b2414",f:1,cross:1}],[330,1.1,{skin:"#E0AC69",hair:"short",hc:"#2b1d14",beard:1,cross:1}],[410,1,{skin:"#FFDBAC",hair:"long",hc:"#a0522d",f:1}],[490,1.05,{skin:"#5C3A21",hair:"cap",item:"box"}]];
    T.forEach(function(t){s+=person(t[0],292,t[1],t[2])})}
  else if(n===1){s+='<g transform="translate(360,90)"><rect width="120" height="200" rx="5" fill="#dfe2e5" stroke="#9aa0a6"/><rect x="10" y="12" width="100" height="84" rx="3" fill="#eef0f2"/><rect x="10" y="104" width="100" height="86" rx="3" fill="#eef0f2"/><rect x="34" y="40" width="52" height="14" rx="3" fill="#fff" stroke="#F96302" stroke-width="2"/></g>'+person(200,292,1.12,{skin:"#C68642",hair:"bun",hc:"#2b1d14",f:1,item:"tab"})+person(300,292,1.12,{skin:"#F1C27D",hair:"cap",item:"gauge"})}
  else {s+='<g transform="translate(70,160)"><rect width="150" height="130" rx="5" fill="#e4e6e8" stroke="#9aa0a6"/><circle cx="75" cy="65" r="48" fill="#cfd3d7" stroke="#8d939a" stroke-width="3"/><circle cx="75" cy="65" r="7" fill="#555"/></g>'+person(330,292,1.12,{skin:"#8D5524",hair:"hijab",f:1,item:"box"})+person(430,292,1.12,{skin:"#E0AC69",hair:"short",hc:"#111",cross:1})}
  return s+'</svg>'}

/* ======================= SITE STATE ======================= */
var CUSTOM=[];        // products added in Admin (db)
var SITE={teamPhotos:[]};
function allProducts(){return PRODUCTS.concat(CUSTOM)}
function byId(id){return allProducts().find(function(p){return p.id===id})}
liveEarly();

/* header height for full-screen hero */
function setHdr(){var h=$("#hdr").getBoundingClientRect().height+((document.querySelector(".topline")||{getBoundingClientRect:function(){return {height:0}}}).getBoundingClientRect().height||0);document.documentElement.style.setProperty("--hdr",Math.round($("#hdr").getBoundingClientRect().height)+"px");document.documentElement.style.setProperty("--top",Math.round(h)+"px")}
setHdr();addEventListener("resize",setHdr);

/* ======================= SERVICES / LICENCES / STEPS ======================= */
if(has("#qs"))$("#qs").innerHTML=SERVICES.map(function(s){var h=L("svc",s.id);return h?'<a class="qb'+(s.red?' red':'')+'" href="'+h+'"><span class="ic">'+ic(s.ic)+'</span>'+esc(s.name)+'</a>':'<button class="qb'+(s.red?' red':'')+'" type="button" data-svc="'+s.id+'"><span class="ic">'+ic(s.ic)+'</span>'+esc(s.name)+'</button>'}).join("");
/* licence slider: each badge gets its own colour */
var LICC=["#F96302","#2F80ED","#16A085","#D7262B","#8E44AD","#E0A100","#0E9FC9","#2E9D57"];
/* stats slider */
(function(){if(!has("#statTrack"))return;var nb={};PRODUCTS.forEach(function(p){nb[p.brand]=1});
  var LS=(window.__live&&__live.stats)||{};var S=[["smile",+LS.customers||3000,"+","Happy customers","Homes and businesses we've helped"],["tools",+LS.years||28,"","Years of experience","Hands-on heating & cooling know-how"],["clock","24/7","","Emergency service","Real people answer, day or night"],
    ["shield",Object.keys(nb).length,"+","Trusted brands","Installed by factory-trained technicians"],["doc",100,"%","Written quotes","Upfront pricing — no surprises"],["home","Saskatoon & area","","Plus Regina, P.A. & Moose Jaw","Saskatoon and surrounding communities, plus Regina, Prince Albert and Moose Jaw"]];
  var one=S.map(function(s,i){var c=LICC[(i*3+1)%LICC.length];return '<div class="stc" style="--c:'+c+'"><span class="stc-ic">'+ic(s[0])+'</span><b'+(typeof s[1]==="number"?' data-n="'+s[1]+'" data-s="'+s[2]+'">'+(s[1]>=1000?s[1].toLocaleString("en-CA"):s[1])+s[2]:'>'+s[1])+'</b><span class="stc-l">'+esc(s[3])+'</span><small>'+esc(s[4])+'</small></div>'}).join("");
  $("#statTrack").innerHTML=one+one.replace(/class="stc"/g,'class="stc" aria-hidden="true"');
  if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var done=false;new IntersectionObserver(function(es,o){if(!es[0].isIntersecting||done)return;done=true;o.disconnect();
    $$("#statTrack [data-n]").forEach(function(b){var n=+b.dataset.n,s=b.dataset.s,t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/1600),v=Math.round(n*(1-Math.pow(1-k,3)));b.textContent=(v>=1000?v.toLocaleString("en-CA"):v)+s;if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.3}).observe($("#statTrack"))})();
var seal=function(red){return '<svg class="seal" viewBox="0 0 60 60" aria-hidden="true"><circle cx="30" cy="30" r="27" fill="'+red+'"/><circle cx="30" cy="30" r="21" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/><path d="M20 31l7 7 14-15" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
var lic=JORA.licences.map(function(l,i){var c=LICC[i%LICC.length];return '<div class="lc" style="--c:'+c+'">'+seal(c)+'<div><b>'+esc(l[0])+'</b><small>'+esc(l[1])+'</small></div></div>'}).join("");
if(has("#licTrack"))$("#licTrack").innerHTML=lic+lic.replace(/class="lc"/g,'class="lc" aria-hidden="true"');
if(has("#fLic"))$("#fLic").textContent=JORA.licences.slice(0,4).map(function(l){return l[0]}).join(" · ");
if(has("#steps"))$("#steps").innerHTML=STEPS.map(function(s,i){return '<li style="--i:'+i+'"><div class="orb"><span class="orb-in">'+ic(s[0])+'</span><em>'+String(i+1).padStart(2,"0")+'</em></div><div class="jt"><b>'+esc(s[1])+'</b><p>'+esc(s[2])+'</p></div></li>'}).join("");
if(has("#blogGrid")&&!$("#blogGrid").children.length)$("#blogGrid").innerHTML=POSTS.map(function(p,i){return '<article class="post"><div class="pt" style="background:'+p.col+'"><span>'+p.tag+'</span>'+ic(p.ic)+'</div><div class="pb"><time>'+p.date+'</time><h3>'+esc(p.t)+'</h3><p>'+esc(p.x)+'</p><button type="button" data-post="'+i+'">Read more ›</button></div></article>'}).join("");
if(has("#fSvc")&&!$("#fSvc").children.length)$("#fSvc").innerHTML=SERVICES.slice(0,10).map(function(s){return '<li><button class="lk" type="button" data-svc="'+s.id+'">'+esc(s.name)+'</button></li>'}).join("");
var allBrands=[];Object.keys(BRANDS).forEach(function(c){BRANDS[c].forEach(function(b){if(allBrands.indexOf(b)<0)allBrands.push(b)})});
if(has("#fBr")&&!$("#fBr").children.length)$("#fBr").innerHTML=allBrands.map(function(b){return '<li>'+esc(b)+'</li>'}).join("");
if(has("#fCity")&&!$("#fCity").children.length)$("#fCity").innerHTML=CITIES.map(function(c){return '<span>'+esc(c)+'</span>'}).join("");
if(has("#yr"))$("#yr").textContent=new Date().getFullYear();

/* team collage */
function renderTeam(){if(!has("#collage"))return;var caps=["Installation crew","On every service call","The Jora team"],cls=["a","b","c"],ph=SITE.teamPhotos||[];
  $("#collage").innerHTML=cls.map(function(c,i){var p=ph[i];return '<figure class="ph3 '+c+'" tabindex="0"><div class="img">'+(p&&p.url?'<img src="'+esc(p.url)+'" alt="'+esc(p.caption||caps[i])+'">':scene(i))+'</div><figcaption>'+esc((p&&p.caption)||caps[i])+'</figcaption></figure>'}).join("")+
  '<span class="l3d bigl" aria-hidden="true"><span class="slab"><span class="bk"></span><span class="lt"></span><span class="rt"></span><span class="tp"></span><span class="bt"></span><span class="f"><img alt="" src="'+$(".logo .f img").src+'"></span></span></span>';
  $$(".ph3").forEach(function(f){f.addEventListener("click",function(){$$(".ph3").forEach(function(o){o.classList.toggle("top",o===f&&!o.classList.contains("top"))})})})}
renderTeam();

/* scroll reveal */
if("IntersectionObserver" in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});$$(".reveal").forEach(function(el){io.observe(el)})}else $$(".reveal").forEach(function(el){el.classList.add("in")});

/* ======================= OVERLAYS ======================= */
var lastFocus=null;
function openO(id){lastFocus=document.activeElement;var o=$("#"+id);o.classList.add("open");document.body.classList.add("lock");setTimeout(function(){var f=o.querySelector(".xb");f&&f.focus()},50)}
function closeO(o){o.classList.remove("open");if(!$$(".ovl.open").length)document.body.classList.remove("lock");lastFocus&&lastFocus.focus&&lastFocus.focus()}
document.addEventListener("click",function(e){var c=e.target.closest("[data-close]");if(c){closeO(c.closest(".ovl"));return}if(e.target.classList.contains("ovl"))closeO(e.target)});
document.addEventListener("keydown",function(e){if(e.key==="Escape"){var o=$$(".ovl.open").pop();o&&closeO(o)}});

/* blog */
document.addEventListener("click",function(e){var b=e.target.closest("[data-post]");if(!b)return;var p=POSTS[+b.dataset.post];
  $("#artT").textContent=p.tag;$("#artBody").innerHTML='<h3 style="font-size:28px;text-transform:uppercase;margin:0 0 12px">'+esc(p.t)+'</h3>'+p.body.map(function(t){return '<p>'+esc(t)+'</p>'}).join("")+'<button class="btn" type="button" data-svc="'+(p.ic==="tankless"?"tankless":p.ic==="hrv"?"hrv":"furnace")+'">Get a free quote</button>';openO("arto")});

/* ======================= PRODUCT DETAIL ======================= */
function showProduct(id){var p=byId(id);if(!p)return;
  $("#pdT").textContent=p.brand+" · "+(CATS[p.cat]?CATS[p.cat].name:"");
  $("#pdBody").innerHTML='<div class="pd"><div class="vis" id="pdVis">'+visual(p)+'</div><div><span class="kick">'+esc(p.brand)+'</span><h3>'+esc(p.name)+'</h3><p class="tag">'+esc(p.tag||"")+'</p>'+
   '<table class="spec"><tbody>'+(p.specs||[]).map(function(s){return '<tr><th>'+esc(s[0])+'</th><td>'+esc(s[1])+'</td></tr>'}).join("")+'</tbody></table>'+
   ((p.feats||[]).length?'<ul class="fe">'+p.feats.map(function(f){return '<li>'+esc(f)+'</li>'}).join("")+'</ul>':'')+
   '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px"><button class="btn" type="button" data-quote-product="'+esc(p.id)+'">Get a quote for this</button><a class="btn o" href="tel:+19056672823">Call 905-667-2823</a></div>'+
   '<p class="src">Installed price depends on your home — your written quote includes equipment, labour and permits. Specs from the manufacturer and may vary by size and model'+(p.src?' · <a href="'+esc(p.src)+'" target="_blank" rel="noopener">source</a>':'')+'.</p></div></div>';
  var v=$("#pdVis");v.addEventListener("pointermove",function(e){var r=v.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;var el=v.firstElementChild;el.style.transform="perspective(700px) rotateY("+(x*22)+"deg) rotateX("+(-y*14)+"deg) scale(1.03)"});
  v.addEventListener("pointerleave",function(){v.firstElementChild.style.transform=""});
  openO("pdo")}
document.addEventListener("click",function(e){var b=e.target.closest("[data-product]");if(b&&!e.target.closest("[data-quote-product]")&&!e.target.closest("a")){var u=L("product",b.dataset.product);if(u)location.href=u;else showProduct(b.dataset.product)}});

/* ======================= CATEGORY SLIDERS (move as you scroll) ======================= */
var shop={brand:{}};Object.keys(CATS).forEach(function(k){shop.brand[k]="All"});
var ROWS=[];
function cardHTML(p){return '<article class="pc" data-product="'+esc(p.id)+'" tabindex="0"><div class="pim">'+(p.flag?'<span class="flag'+(p.flagRed?' red':'')+'">'+esc(p.flag)+'</span>':'')+visual(p)+'</div><div class="pb"><div class="pbr">'+brandMark(p.brand,"card")+'</div><h3>'+(L("product",p.id)?'<a href="'+L("product",p.id)+'">'+esc(p.name)+'</a>':esc(p.name))+'</h3><div class="kv">'+(p.feats3||[]).map(function(f){return '<span>'+esc(f)+'</span>'}).join("")+'</div><div class="pr">Installed price: free quote<small>Equipment, labour &amp; permits in writing</small></div><div class="row"><a class="btn o sm" href="'+(L("product",p.id)||"#")+'">Details</a><button class="btn sm" type="button" data-quote-product="'+esc(p.id)+'">Get quote</button></div></div></article>'}
var arrowL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg>',arrowR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>';
if(has("#logowall"))$("#logowall").innerHTML=Object.keys(LOGO).map(function(b){return '<div class="lw"><img class="'+(b==="Kepler"?"dark":"")+'" src="'+LOGO[b]+'" alt="'+esc(b)+'"></div>'}).join("");
if(has("#prows"))$("#prows").innerHTML=Object.keys(CATS).map(function(k){var n=allProducts().filter(function(p){return p.cat===k}).length;return '<div class="prow" id="row-'+k+'" data-row="'+k+'"><div class="prow-h"><div class="t"><span class="t-ic">'+ic(CATS[k].ic)+'</span><div><h3>'+CATS[k].name+'</h3><small>'+esc(CATS[k].sub)+' · '+n+' model'+(n===1?'':'s')+'</small></div></div><a class="vall" href="'+(L("cat",k)||"#")+'">View all <b>›</b></a><div class="chips"></div><div class="nav2"><button type="button" data-rn="-1" aria-label="Previous">'+arrowL+'</button><button type="button" data-rn="1" aria-label="Next">'+arrowR+'</button></div></div><div class="pview"><div class="rail"></div></div></div>'}).join("");
function renderShop(){if(!has("#prows"))return;Object.keys(CATS).forEach(function(k,ri){var row=$("#row-"+k),brands=BRANDS[k].slice();CUSTOM.forEach(function(p){if(p.cat===k&&brands.indexOf(p.brand)<0)brands.push(p.brand)});
  var cur=shop.brand[k];if(cur!=="All"&&brands.indexOf(cur)<0)cur=shop.brand[k]="All";
  $(".chips",row).innerHTML=["All"].concat(brands).map(function(b){return '<button type="button" data-rb="'+esc(b)+'" aria-pressed="'+(b===cur)+'">'+(b==="All"?"All":(LOGO[b]?'<img class="bm bm-chip'+(b==="Kepler"?" dark":"")+'" src="'+LOGO[b]+'" alt="'+esc(b)+'">':esc(b)))+'</button>'}).join("");
  var list=allProducts().filter(function(p){return p.cat===k&&(cur==="All"||p.brand===cur)});
  $(".rail",row).innerHTML=list.map(cardHTML).join("")||'<div class="emp" style="width:80vw;max-width:1200px">No products yet.</div>';
  var R=ROWS[ri]||(ROWS[ri]={row:row,view:$(".pview",row),rail:$(".rail",row),dir:ri%2?1:-1,man:0,x:0,tilt:0});R.man=0});requestAnimationFrame(tick)}
document.addEventListener("click",function(e){var b=e.target.closest("[data-rb]");if(b){var k=b.closest(".prow").dataset.row;shop.brand[k]=b.dataset.rb;renderShop();return}
  var n=e.target.closest("[data-rn]");if(n){var R=ROWS.find(function(r){return r.row.contains(n)});var t0=target(R);R.man=Math.max(-t0.max-t0.base,Math.min(-t0.base,R.man+(+n.dataset.rn)*-R.view.clientWidth*.75));requestAnimationFrame(tick);return}
  var s=e.target.closest("[data-shop]");if(s){$("#row-"+s.dataset.shop).scrollIntoView({behavior:"smooth",block:"center"})}},true);
/* scroll-linked motion: each row glides sideways as the page scrolls; middle row moves the other way */
var lastY=scrollY,vel=0,ticking=false;
function target(R){var r=R.view.getBoundingClientRect(),vh=innerHeight,max=Math.max(0,R.rail.scrollWidth-R.view.clientWidth);
  var p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));var base=R.dir<0?-max*p:-max*(1-p);if(reduce)base=0;
  return {x:Math.min(0,Math.max(-max,base+R.man)),max:max,base:base}}
function tick(){ticking=false;var dy=scrollY-lastY;lastY=scrollY;vel=vel*.85+dy*.15;var moving=false;
  ROWS.forEach(function(R){var t=target(R);R.x+=(t.x-R.x)*.12;if(Math.abs(t.x-R.x)>.5)moving=true;
    var tilt=reduce?0:Math.max(-14,Math.min(14,vel*R.dir*-.9));R.tilt+=(tilt-R.tilt)*.2;if(Math.abs(R.tilt)>.05)moving=true;
    R.rail.style.transform="translate3d("+R.x.toFixed(1)+"px,0,0)";R.rail.style.setProperty("--tilt",R.tilt.toFixed(2)+"deg");});
  if(moving||Math.abs(vel)>.1){ticking=true;requestAnimationFrame(tick)}}
addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(tick)}},{passive:true});
addEventListener("resize",function(){requestAnimationFrame(tick)});
/* drag / swipe a row */
var dragR=null,dx0=0,man0=0,moved=0;
document.addEventListener("pointerdown",function(e){var v=e.target.closest(".pview");if(!v||e.button>0)return;dragR=ROWS.find(function(r){return r.view===v});dx0=e.clientX;man0=dragR.man;moved=0;v.classList.add("drag")});
addEventListener("pointermove",function(e){if(!dragR)return;var d=e.clientX-dx0;moved=Math.max(moved,Math.abs(d));if(moved>6){dragR.man=man0+d*1.4;if(!ticking){ticking=true;requestAnimationFrame(tick)}}});
addEventListener("pointerup",function(){if(dragR){dragR.view.classList.remove("drag");var t=target(dragR);dragR.man=Math.max(-t.max-t.base,Math.min(-t.base,dragR.man));dragR=null;requestAnimationFrame(tick)}});
document.addEventListener("click",function(e){if(moved>6&&e.target.closest(".pview")){e.stopPropagation();e.preventDefault();moved=0}},true);
if(has("#prows"))$("#prows").addEventListener("keydown",function(e){if(e.key==="Enter"&&e.target.dataset.product)showProduct(e.target.dataset.product)});
renderShop();

/* ======================= HERO 3D SLIDER ======================= */
(function(){if(!has("#jx-hero"))return;
  var SL=heroList();
  var hero=$("#jx-hero"),track=$("#jx-track"),stage=$("#jx-stage"),dotsEl=$("#jx-dots"),info=$("#jx-info"),ghost=$(".jx-ghost",hero),tabs=$$(".jx-tab",hero);
  hero.style.setProperty("--jx-dur",JORA.slideSeconds+"s");
  var N=SL.length,cur=0,timer=null;
  SL.forEach(function(p,i){var s=document.createElement("div");s.className="jx-slide"+(p.wide?" wide":"");s.setAttribute("role","group");s.setAttribute("aria-label",(i+1)+" of "+N+": "+p.brand);
    var bd=p.badge||[p.flag||"New",CATS[p.cat]?CATS[p.cat].short:""],src=pSrc(p),pa=p.imgDoc?' data-pimg="'+esc(p.imgDoc)+'"':'';
    s.innerHTML='<div class="jx-tilt"><img src="'+src+'"'+pa+(i>2&&i<N-2?' loading="lazy"':' fetchpriority="'+(i===0?'high':'auto')+'"')+' decoding="async" alt="'+esc(p.name)+'"><div class="jx-badge'+(p.badgeRed?' red':'')+'"><b>'+esc(bd[0])+'</b>'+esc(bd[1])+'</div><div class="jx-reflect"><img src="'+src+'"'+pa+' loading="lazy" decoding="async" alt=""></div></div>';
    s.addEventListener("click",function(){if(i!==cur)go(i);else showProduct(p.id)});track.appendChild(s);
    var d=document.createElement("button");d.className="jx-dot";d.setAttribute("aria-label","Show "+p.brand);d.onclick=function(){go(i)};dotsEl.appendChild(d)});
  var slides=[].slice.call(track.children),dots=[].slice.call(dotsEl.children);
  slides.forEach(function(s){var a=s.querySelector(".jx-tilt>img"),b=s.querySelector(".jx-reflect img");function fit(){b.style.width=a.clientWidth+"px";var nw=a.naturalWidth,nh=a.naturalHeight,bw=a.clientWidth,bh=a.clientHeight;if(nw&&nh&&bw&&bh){var r=Math.min(bw/nw,bh/nh);s.style.setProperty("--pw",Math.round(nw*r)+"px");s.style.setProperty("--ph",Math.round(nh*r)+"px")}if(nw&&nh){var wd=nw/nh>1.25;if(wd!==s.classList.contains("wd")){s.classList.toggle("wd",wd);fit();layout()}}}a.complete?fit():a.onload=fit;addEventListener("resize",fit)});
  function layout(){var w=stage.clientWidth,gap=Math.min(w*.30,250);if(innerWidth>980){var wdOn=slides[cur].classList.contains("wd"),g1=Math.min(w*(wdOn?.45:.37),wdOn?370:300),g2=Math.min(w*(wdOn?.66:.6),wdOn?520:470);slides.forEach(function(s,i){var o=i-cur;if(o>N/2)o-=N;if(o<-N/2)o+=N;var a=Math.abs(o),sg=o<0?-1:1;var x=a===0?0:sg*(a===1?g1:a===2?g2:g2+160),z=a===0?0:a===1?-190:a===2?-400:-620,ry=a===0?0:sg*(a===1?-26:-36),sc=a===0?1:a===1?.8:.64;s.style.transform="translateX("+x+"px) translateZ("+z+"px) rotateY("+ry+"deg) scale("+sc+")";s.style.opacity=a>2?0:a===2?.42:1;s.style.filter=a===0?"none":a===1?"brightness(.98) saturate(.92)":"brightness(.95) saturate(.8)";s.style.zIndex=10-a;s.style.pointerEvents=a>2?"none":"auto";s.classList.toggle("on",a===0);s.classList.toggle("far",a>2)});return}slides.forEach(function(s,i){var o=i-cur;if(o>N/2)o-=N;if(o<-N/2)o+=N;var a=Math.abs(o);
    s.style.transform="translateX("+(o*gap)+"px) translateZ("+(-a*230)+"px) rotateY("+(o*-32)+"deg) scale("+(a?.86:1.06)+")";s.style.opacity=a>2?0:(a===2?.35:a===1?.75:1);s.style.filter=a?"brightness("+(a===1?.92:.85)+") blur("+(a===1?0:1.5)+"px)":"none";s.style.zIndex=10-a;s.style.pointerEvents=a>2?"none":"auto";s.classList.toggle("on",a===0);s.classList.toggle("far",a>2)})}
  function setInfo(p){info.classList.add("out");setTimeout(function(){var cl=$("#jx-cat");if(!cl){cl=document.createElement("span");cl.id="jx-cat";cl.className="jx-cat";$("#jx-brand").parentNode.insertBefore(cl,$("#jx-brand"))}cl.textContent=CATS[p.cat]?CATS[p.cat].short:"";$("#jx-brand").innerHTML=brandMark(p.brand,"hero");$("#jx-title").innerHTML='<span>'+esc(p.model)+'</span> '+esc(CATS[p.cat].short);$("#jx-desc").textContent=p.tag||"";$("#jx-feats").innerHTML=(p.feats3||[]).map(function(f){return "<li>"+esc(f)+"</li>"}).join("");info.classList.remove("out")},260);
    ghost.style.opacity=0;setTimeout(function(){ghost.textContent=p.brand.toUpperCase();ghost.style.opacity=1},300);tabs.forEach(function(t){t.setAttribute("aria-selected",t.dataset.cat===p.cat)});
    $("#jx-quote").dataset.quoteProduct=p.id;$("#jx-more").dataset.product=p.id}
  function go(i){cur=(i+N)%N;layout();setInfo(SL[cur]);dots.forEach(function(d,k){d.classList.remove("on");if(k===cur){void d.offsetWidth;d.classList.add("on")}});$("#jx-count").innerHTML="<b>"+String(cur+1).padStart(2,"0")+"</b> / "+N;restart()}
  function restart(){clearInterval(timer);if(!hero.classList.contains("paused"))timer=setInterval(function(){go(cur+1)},JORA.slideSeconds*1000)}
  $("#jx-next").onclick=function(){go(cur+1)};$("#jx-prev").onclick=function(){go(cur-1)};
  tabs.forEach(function(t){t.onclick=function(){go(SL.findIndex(function(p){return p.cat===t.dataset.cat}))}});
  stage.addEventListener("keydown",function(e){if(e.key==="ArrowRight")go(cur+1);if(e.key==="ArrowLeft")go(cur-1)});
  /* keep moving; pause only while the visitor points at the product in front */
  slides.forEach(function(sl){sl.addEventListener("mouseenter",function(){if(sl.classList.contains("on")){hero.classList.add("paused");clearInterval(timer)}});sl.addEventListener("mouseleave",function(){if(hero.classList.contains("paused")){hero.classList.remove("paused");restart()}})});
  document.addEventListener("visibilitychange",function(){document.hidden?clearInterval(timer):restart()});
  var sx=null,dx=0;stage.addEventListener("pointerdown",function(e){sx=e.clientX;dx=0});addEventListener("pointermove",function(e){if(sx!==null)dx=e.clientX-sx});addEventListener("pointerup",function(){if(sx!==null&&Math.abs(dx)>45)go(cur+(dx<0?1:-1));sx=null});
  stage.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;var r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;slides[cur].querySelector(".jx-tilt").style.transform="rotateY("+(x*18)+"deg) rotateX("+(-y*10)+"deg)";ghost.style.transform="translate(calc(-50% + "+(x*-30)+"px),calc(-50% + "+(y*-14)+"px))"});
  stage.addEventListener("pointerleave",function(){slides.forEach(function(s){s.querySelector(".jx-tilt").style.transform=""})});
  addEventListener("resize",layout);go(0);
  window.JX={goCat:function(c){var i=SL.findIndex(function(p){return p.cat===c});if(i>-1)go(i)}};
})();

/* ======================= QUOTE WIZARD ======================= */
var HOME_TYPES=[["Detached house","home"],["Semi-detached","semi"],["Townhouse (freehold)","town"],["Condo townhouse","town"],["Bungalow","bung"],["Back-split / Side-split","home"],["Condo / Apartment","condo"],["Commercial / Business","shop"]];
var SIZES=["Under 1,000 sq ft","1,000 – 1,500 sq ft","1,500 – 2,000 sq ft","2,000 – 2,500 sq ft","2,500 – 3,000 sq ft","3,000 – 4,000 sq ft","4,000+ sq ft","Not sure"];
var AGE=["0–5 years","6–10 years","11–15 years","16–20 years","20+ years","Not sure","None yet"];
var JOB=["Replacement","New installation","Repair","Maintenance"];
var GHB=["Reznor","Modine","Lennox","Re-Verber-Ray (infrared)","Electric","No preference"],HVACB=["Lennox","Carrier","Trane","Goodman","Kepler","No preference"],HPB=["Lennox","TOSOT","Midea","Gree","Carrier","Trane","No preference"],WATB=["Rinnai","Navien","Rheem","Bradford White","Noritz","No preference"];
function Q(k,label,opts,o){o=o||{};return {k:k,label:label,opts:opts,many:!!o.many,req:o.req!==false,hint:o.hint,brand:!!o.brand}}
var SYS={
 furnace:[Q("job","What do you need?",JOB),Q("fuel","Current heating fuel",["Natural gas","Propane","Oil","Electric","No current system"]),Q("curAge","How old is your current furnace?",AGE),Q("curBTU","Current furnace size (BTU)",["40,000 BTU","60,000 BTU","80,000 BTU","100,000 BTU","120,000 BTU","Not sure"],{hint:"It's on the label inside the furnace door. Not sure is fine."}),Q("curEff","Current efficiency",["Mid-efficiency (~80%, metal chimney vent)","High-efficiency (90%+, plastic pipe vent)","Not sure"]),Q("addAC","Quote a new AC at the same time?",["Yes","No","Maybe"]),Q("brand","Preferred brand",HVACB,{brand:1})],
 ac:[Q("job","What do you need?",JOB),Q("acType","Type of cooling",["Central air conditioner","Heat pump (heats & cools)","Ductless mini-split","Not sure"]),Q("curAge","Age of current AC",AGE),Q("curSize","Current AC size",["1.5 ton (18,000 BTU)","2 ton (24,000 BTU)","2.5 ton (30,000 BTU)","3 ton (36,000 BTU)","3.5 ton (42,000 BTU)","4 ton (48,000 BTU)","5 ton (60,000 BTU)","Not sure"],{hint:"Check the outdoor unit's label. Not sure is fine."}),Q("heat","Your heating system",["Gas furnace","Electric furnace","Boiler / radiators (no ducts)","Baseboard heaters"]),Q("brand","Preferred brand",HVACB,{brand:1})],
 hp:[Q("job","What do you need?",JOB),Q("hpType","Heat pump type",["Ducted (central)","Ductless mini-split","Hybrid with gas furnace","Advise me"]),Q("zones","Rooms / zones to heat & cool",["Whole home","1 zone","2 zones","3 zones","4+ zones"]),Q("heat","Current heating",["Gas furnace","Electric furnace","Oil","Baseboard heaters","Boiler"]),Q("curAge","Age of current system",AGE),Q("rebate","Interested in rebates?",["Yes, check for me","No"]),Q("brand","Preferred brand",HPB,{brand:1})],
 ah:[Q("job","What do you need?",JOB),Q("curSys","Current system",["AirMax / combo air handler","Other air handler","Gas furnace","Not sure"]),Q("heatSrc","Heat source",["Tankless water heater","Boiler","Tank water heater","Not sure"]),Q("addAC","Include air conditioning?",["Yes","Already have AC","No"]),Q("curAge","Age of current unit",AGE)],
 commercial:[Q("bType","Type of building",["Office","Retail store / plaza","Restaurant","Clinic / dental","Gym / studio","Place of worship","School / daycare","Other"]),Q("need","What do you need?",["Rooftop unit (RTU)","Make-up air unit","Unit heater","Split / ductless system","Kitchen exhaust / ventilation","Maintenance contract","Gas piping","Repair"],{many:1}),Q("area","Area to heat / cool",["Under 2,000 sq ft","2,000 – 5,000 sq ft","5,000 – 10,000 sq ft","10,000 – 25,000 sq ft","25,000+ sq ft"]),Q("units","Number of existing units",["None","1","2–3","4–6","7+"]),Q("urg","Timeline",["Emergency — today","Within 2 weeks","This month","Planning / budget"])],
 industrial:[Q("bType","Type of facility",["Warehouse / distribution","Manufacturing plant","Workshop / garage","Food processing","Other"]),Q("need","What do you need?",["Space heating","Radiant tube heaters","Make-up air","Exhaust / ventilation","Process cooling","Gas line install","Planned maintenance","Repair"],{many:1}),Q("area","Floor area",["Under 10,000 sq ft","10,000 – 50,000 sq ft","50,000 – 100,000 sq ft","100,000+ sq ft"]),Q("ceil","Ceiling height",["Under 16 ft","16 – 24 ft","24 – 32 ft","32 ft+"]),Q("urg","Timeline",["Emergency — today","Within 2 weeks","This month","Planning / budget"])],
 tankless:[Q("job","What do you need?",["Replacement","New installation","Repair","Rental buyout + replace"]),Q("people","People in the home",["1–2","3–4","5–6","7+"]),Q("baths","Bathrooms",["1","2","3","4+"]),Q("curWH","Current water heater",["Tank — owned","Tank — rental","Tankless","None"]),Q("tankSize","Current tank size",["40 gallon","50 gallon","60 gallon","75 gallon","Not sure / no tank"]),Q("fuel","Fuel",["Natural gas","Propane"]),Q("recirc","Want hot water faster at the tap (recirculation)?",["Yes","No","Not sure"]),Q("brand","Preferred brand",WATB,{brand:1})],
 water:[Q("job","What do you need?",["Replacement","New installation","Repair","Rental buyout + replace"]),Q("people","People in the home",["1–2","3–4","5–6","7+"]),Q("curWH","Current water heater",["Tank — owned","Tank — rental","None"]),Q("tankSize","Tank size wanted",["40 gallon","50 gallon","60 gallon","75 gallon","Advise me"]),Q("fuel","Fuel",["Natural gas","Propane","Electric"]),Q("curAge","Age of current tank",AGE),Q("brand","Preferred brand",WATB,{brand:1})],
 garage:[Q("job","What do you need?",JOB),Q("gSize","Garage size",["1-car","2-car","3-car or larger","Workshop / shop"]),Q("fuel","Fuel",["Natural gas","Propane","Electric"]),Q("insul","Is the garage insulated?",["Yes","No","Partly","Not sure"]),Q("gasLine","Gas line to the garage?",["Yes","No","Not sure"]),Q("heatType","Heater type",["Power-vented unit heater","Infrared heater","Electric","Patio heater","Advise me"]),Q("brand","Preferred brand",GHB,{brand:1})],
 duct:[Q("need","What do you need?",["New ductwork","Basement finishing / addition","Uneven temperatures","Weak airflow","Noisy ducts","Duct sealing / cleaning"],{many:1})],
 humid:[Q("job","What do you need?",JOB),Q("hType","Humidifier type",["Bypass","Fan-powered","Steam","Advise me"]),Q("why","What are you noticing?",["Dry air / static shocks","Dry skin or sinuses","Wood floors or trim cracking","Just want comfort"],{many:1,req:false})],
 hrv:[Q("job","What do you need?",["New installation","Replacement","Repair","Maintenance / filter service"]),Q("why","What are you noticing?",["Window condensation","Stale air / odours","New build / addition","Old unit not working"],{many:1,req:false})],
 erv:[Q("job","What do you need?",["New installation","Replacement","Repair","Maintenance / filter service"]),Q("why","What are you noticing?",["Dry air in winter","Stale air / odours","New build / addition","Old unit not working"],{many:1,req:false})],
 thermo:[Q("tType","Thermostat type",["Smart Wi-Fi","Programmable","Basic","Advise me"]),Q("sys","Your system",["Furnace + AC","Heat pump","Boiler","Baseboard / electric"]),Q("qty","How many thermostats?",["1","2","3+"])],
 plumb:[Q("need","What do you need?",["Leak","Clogged drain","Fixture install (tap, toilet, sink)","Water line / shut-off valve","Sump pump","Water softener / filtration","Other"],{many:1}),Q("urg","How urgent?",["Emergency — today","Within 48 hours","This week","Flexible"])],
 boiler:[Q("job","What do you need?",JOB),Q("bSys","Heating type",["Radiators","In-floor radiant","Baseboard","Combi boiler (heat + hot water)"]),Q("curAge","Age of current boiler",AGE),Q("fuel","Fuel",["Natural gas","Propane","Oil","Electric"])],
 filters:[Q("need","What are you interested in?",["Media filter upgrade","Air purifier / HEPA","UV light","Advise me"],{many:1})],
 maint:[Q("sys","Which systems?",["Furnace","Air conditioner","Heat pump","Water heater / tankless","Boiler","HRV / ERV"],{many:1}),Q("plan","Plan",["One-time tune-up","Annual maintenance plan"])],
 repair:[Q("sys","What needs repair?",["Furnace","Air conditioner","Heat pump","Water heater","Tankless water heater","Boiler","Garage heater","Other"]),Q("issue","What's happening?",["No heat","No cooling","No hot water","Strange noise","Strange smell","Leak","Turns on and off a lot","Error code / flashing light"],{many:1}),Q("urg","How urgent?",["Emergency — today","Within 48 hours","This week","Flexible"])]
};
var BIZ={commercial:1,industrial:1};var FULLHOME={ah:1,furnace:1,ac:1,hp:1,duct:1,humid:1,hrv:1,erv:1,boiler:1,tankless:1,water:1,garage:1};
function homeQs(svc){if(BIZ[svc])return [Q("role","You are the…",["Owner","Property / facility manager","Tenant","Contractor / builder"]),Q("hours","Building hours",["Business hours","Extended hours","24/7 operation"],{req:false})];var q=[Q("homeType","Type of home",HOME_TYPES)];if(FULLHOME[svc]){q.push(Q("size","Home size (above grade)",SIZES),Q("storeys","Storeys",["1","2","3+","Not sure"]),Q("basement","Basement",["Finished","Unfinished","Partly finished","No basement"]),Q("built","Year built",["Before 1960","1960–1979","1980–1999","2000–2014","2015 or newer","Not sure"],{req:false}))}return q}
var LABELS={rebate:"Rebates",curSys:"Current system",heatSrc:"Heat source",bType:"Building",area:"Area",units:"Existing units",ceil:"Ceiling height",role:"Contact role",hours:"Building hours",job:"Job",fuel:"Fuel",curAge:"Current age",curBTU:"Current size (BTU)",curEff:"Current efficiency",addAC:"Add AC",brand:"Preferred brand",acType:"Cooling type",curSize:"Current AC size",heat:"Heating system",hpType:"Heat pump type",zones:"Zones",people:"People",baths:"Bathrooms",curWH:"Current water heater",tankSize:"Tank size",recirc:"Recirculation",gSize:"Garage size",insul:"Insulated",need:"Needs",hType:"Humidifier type",why:"Noticing",tType:"Thermostat type",sys:"System",qty:"Quantity",urg:"Urgency",bSys:"Heating type",plan:"Plan",issue:"Issue",homeType:"Home type",size:"Home size",storeys:"Storeys",basement:"Basement",built:"Year built",model:"Product",details:"Details"};

var W={svc:null,step:0,a:{},c:{province:"ON",contactPref:"Phone",bestTime:"Anytime"},steps:[]};
function svcName(id){var s=SERVICES.find(function(x){return x.id===id});return s?s.name:"Free quote"}
function openWizard(svc,preset){W={svc:svc||null,step:0,a:Object.assign({},preset||{}),c:W.c&&W.c.firstName?W.c:{province:"SK",contactPref:"Phone",bestTime:"Anytime"},steps:[],done:null};if(PREPOSTAL){W.c.postal=PREPOSTAL;PREPOSTAL=""}buildSteps();renderW();openO("wiz")}
function buildSteps(){W.steps=[];if(!W.svc)W.steps.push("pick");W.steps.push("project","home","contact","review")}
function optHTML(q){var vals=W.a[q.k];return '<fieldset class="q'+(q.brand?' brandpick':'')+'"><legend>'+esc(q.label)+(q.req?'':' <small style="font:500 13px Roboto;color:#888;text-transform:none">(optional)</small>')+'</legend>'+(q.hint?'<p class="hint">'+esc(q.hint)+'</p>':'')+'<div class="opts">'+q.opts.map(function(o){var v=Array.isArray(o)?o[0]:o,icn=Array.isArray(o)?o[1]:null,on=q.many?(vals||[]).indexOf(v)>-1:vals===v;
  return '<label class="opt"><input type="'+(q.many?'checkbox':'radio')+'" name="'+q.k+'" value="'+esc(v)+'"'+(on?' checked':'')+'><span>'+(icn?ic(icn):'')+esc(v)+'</span></label>'}).join("")+'</div></fieldset>'}
function field(k,label,type,o){o=o||{};var v=W.c[k]||"";if(type==="select")return '<label class="fl'+(o.full?' full':'')+'" data-f="'+k+'">'+label+'<select name="'+k+'">'+o.opts.map(function(x){return '<option'+(x===v?' selected':'')+'>'+esc(x)+'</option>'}).join("")+'</select></label>';
  if(type==="textarea")return '<label class="fl full" data-f="'+k+'">'+label+'<textarea name="'+k+'" placeholder="'+(o.ph||"")+'">'+esc(v)+'</textarea></label>';
  return '<label class="fl'+(o.full?' full':'')+'" data-f="'+k+'">'+label+'<input name="'+k+'" type="'+type+'" value="'+esc(v)+'"'+(o.ac?' autocomplete="'+o.ac+'"':'')+(o.ph?' placeholder="'+o.ph+'"':'')+(o.im?' inputmode="'+o.im+'"':'')+'></label>'}
function renderW(){var st=W.steps[W.step],s=SERVICES.find(function(x){return x.id===W.svc});
  $("#wizIc").innerHTML=ic(s?s.ic:"doc");$("#wizT").innerHTML=esc(s?s.name:"Free quote")+'<small id="wizS">'+(W.done?"Request sent":"Step "+(W.step+1)+" of "+W.steps.length)+'</small>';
  var names={pick:"Service",project:"Your project",home:"Your home",contact:"Your details",review:"Review"};
  $("#wizSteps").innerHTML=W.done?"":W.steps.map(function(x,i){return '<span class="'+(i===W.step?'on':i<W.step?'dn':'')+'">'+(i+1)+'. '+names[x]+'</span>'}).join("");
  $("#wizBar").style.width=W.done?"100%":((W.step)/(W.steps.length))*100+"%";$("#wizErr").textContent="";
  var b=$("#wizBody"),h="";
  if(W.done){h=W.done;$("#wizBack").style.visibility="hidden";$("#wizNext").textContent="Close";b.innerHTML=h;b.scrollTop=0;return}
  $("#wizBack").style.visibility=W.step===0?"hidden":"visible";$("#wizNext").textContent=st==="review"?"Send my request":"Next";
  if(st==="pick")h='<fieldset class="q"><legend>What can we help with?</legend><div class="opts">'+SERVICES.map(function(x){return '<label class="opt"><input type="radio" name="__svc" value="'+x.id+'"'+(W.svc===x.id?' checked':'')+'><span>'+ic(x.ic)+esc(x.name)+'</span></label>'}).join("")+'</div></fieldset>';
  if(st==="project"){if(W.a.model)h+='<div class="note">Product: <b>'+esc(W.a.model)+'</b></div>';h+=(SYS[W.svc]||[]).map(optHTML).join("")+'<label class="fl full q" data-f="details" style="display:grid">Anything else we should know? <small style="font-weight:400;color:#888">(optional)</small><textarea class="inp" id="aDetails" placeholder="e.g. furnace is in a tight closet, want it done before winter">'+esc(W.a.details||"")+'</textarea></label>'}
  if(st==="home")h=homeQs(W.svc).map(optHTML).join("");
  if(st==="contact")h='<div class="fgrid">'+field("firstName","First name","text",{ac:"given-name"})+field("lastName","Last name","text",{ac:"family-name"})+field("email","Email","email",{ac:"email",ph:"you@example.com"})+field("phone","Phone","tel",{ac:"tel",ph:"905-555-0123",im:"tel"})+
    field("street","Street address","text",{ac:"street-address",full:1,ph:"123 Main St"})+field("unit","Unit / Apt (optional)","text",{ac:"address-line2"})+field("city","City","text",{ac:"address-level2"})+field("province","Province","select",{opts:["SK","AB","MB","Other"]})+field("postal","Postal code","text",{ac:"postal-code",ph:"L5B 3C2"})+
    field("contactPref","Best way to reach you","select",{opts:["Phone","Text","Email"]})+field("bestTime","Best time","select",{opts:["Anytime","Morning","Afternoon","Evening","Weekend"]})+
    '<label class="chk full"><input type="checkbox" name="okContact"'+(W.c.okContact?' checked':'')+'> I agree to be contacted about this request.</label>'+
    '<label class="chk full"><input type="checkbox" name="okNews"'+(W.c.okNews?' checked':'')+'> Yes, email me seasonal tips and offers from Jora Mechanical Systems. You can unsubscribe at any time.</label></div>';
  if(st==="review")h=reviewHTML();
  b.innerHTML=h;b.scrollTop=0;
  $$('input[name="postal"]',b).forEach(function(i){i.addEventListener("input",function(){var v=i.value.toUpperCase().replace(/[^A-Z0-9]/g,"");i.value=v.length>3?v.slice(0,3)+" "+v.slice(3,6):v})})}
function collect(){var st=W.steps[W.step],b=$("#wizBody");
  if(st==="pick"){var r=$('input[name="__svc"]:checked',b);if(r){W.svc=r.value}return}
  if(st==="project"||st==="home"){var qs=st==="project"?SYS[W.svc]:homeQs(W.svc);qs.forEach(function(q){if(q.many)W.a[q.k]=$$('input[name="'+q.k+'"]:checked',b).map(function(i){return i.value});else{var c=$('input[name="'+q.k+'"]:checked',b);if(c)W.a[q.k]=c.value}});var d=$("#aDetails");if(d)W.a.details=d.value.trim();return}
  if(st==="contact"){$$("input,select,textarea",b).forEach(function(i){W.c[i.name]=i.type==="checkbox"?i.checked:i.value.trim()})}}
var PC=/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/i;
function validate(){var st=W.steps[W.step],b=$("#wizBody");
  if(st==="pick")return W.svc?"":"Please choose a service.";
  if(st==="project"||st==="home"){var qs=st==="project"?SYS[W.svc]:homeQs(W.svc);for(var i=0;i<qs.length;i++){var q=qs[i],v=W.a[q.k];if(q.req&&(!v||(q.many&&!v.length))){var el=$('input[name="'+q.k+'"]',b);el&&el.closest("fieldset").scrollIntoView({behavior:"smooth",block:"center"});return "Please answer: "+q.label}}return ""}
  if(st==="contact"){$$(".fl",b).forEach(function(f){f.classList.remove("bad")});var c=W.c,bad=[];
    if(!c.firstName)bad.push("firstName");if(!c.lastName)bad.push("lastName");if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email||""))bad.push("email");if((c.phone||"").replace(/\D/g,"").length<10)bad.push("phone");if(!c.street)bad.push("street");if(!c.city)bad.push("city");if(!PC.test(c.postal||""))bad.push("postal");
    bad.forEach(function(k){var f=$('[data-f="'+k+'"]',b);f&&f.classList.add("bad")});
    if(bad.length){var first=$('[data-f="'+bad[0]+'"] input',b);first&&first.focus();return bad.indexOf("postal")>-1&&bad.length===1?"Please enter a valid Canadian postal code (e.g. L5B 3C2).":"Please fix the highlighted fields."}
    if(!c.okContact)return "Please agree to be contacted about this request.";return ""}
  return ""}
function answersRows(a){return Object.keys(a).filter(function(k){var v=a[k];return v&&(!Array.isArray(v)||v.length)}).map(function(k){return [LABELS[k]||k,Array.isArray(a[k])?a[k].join(", "):a[k]]})}
function contactRows(c){return [["Name",(c.firstName||"")+" "+(c.lastName||"")],["Email",c.email],["Phone",c.phone],["Address",[c.street,c.unit].filter(Boolean).join(", ")],["City",c.city+", "+c.province+" "+(c.postal||"").toUpperCase()],["Contact by",c.contactPref+" · "+c.bestTime],["Email offers",c.okNews?"Yes":"No"]]}
function reviewHTML(){return '<div class="rev"><h4>'+esc(svcName(W.svc))+'</h4>'+answersRows(W.a).map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join("")+'<h4>Your details</h4>'+contactRows(W.c).map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join("")+'</div><p class="hint" style="margin-top:12px;color:#666;font-size:13px">We\'ll contact you to confirm a visit. Your details are used only to respond to this request'+(W.c.okNews?' and to send occasional emails you agreed to':'')+'.</p>'}
function summaryText(rec){var L=[JORA.company+" — Quote request "+rec.ref,"Service: "+rec.serviceName,""];answersRows(rec.answers).forEach(function(r){L.push(r[0]+": "+r[1])});L.push("");contactRows(rec.contact).forEach(function(r){L.push(r[0]+": "+r[1])});return L.join("\n")}
$("#wizBack").onclick=function(){collect();if(W.step>0){W.step--;renderW()}};
$("#wizNext").onclick=async function(){if(W.done){closeO($("#wiz"));return}collect();var e=validate();if(e){$("#wizErr").textContent=e;return}
  if(W.steps[W.step]==="review"){$("#wizNext").disabled=true;try{await submitRequest()}finally{$("#wizNext").disabled=false}return}
  W.step++;renderW()};
function refNo(){var d=new Date();return "JM-"+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+Math.random().toString(36).slice(2,6).toUpperCase()}
function custId(email){return "c_"+String(email||"").toLowerCase().replace(/[^a-z0-9]+/g,"_").slice(0,120)}
async function submitRequest(){var rec={ref:refNo(),service:W.svc,serviceName:svcName(W.svc),answers:JSON.parse(JSON.stringify(W.a)),contact:Object.assign({},W.c,{postal:(W.c.postal||"").toUpperCase()}),status:"new",source:"website",createdAt:new Date().toISOString()};
  var saved=false;
  if(CAP.db&&CAP.canWrite){try{await CAP.db.collection("requests").doc(rec.ref).set(Object.assign(rec,{track:joraTrack()}));await upsertCustomer(rec.contact,rec.serviceName);saved=true}catch(err){saved=false}}
  if(!saved)saved=await liveSaveRequest(rec,"Quote request "+rec.ref+" — "+rec.serviceName,summaryText(rec));
  if(!saved&&JORA.formEndpoint){try{var r=await fetch(JORA.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(Object.assign({_subject:"Quote request "+rec.ref,message:summaryText(rec)},rec))});saved=r.ok}catch(err){}}
  var mail="mailto:"+(SITE.notifyEmail||JORA.notifyEmail)+"?subject="+encodeURIComponent("Quote request "+rec.ref+" — "+rec.serviceName)+"&body="+encodeURIComponent(summaryText(rec));
  W.done='<div class="done"><div class="tick">✓</div><h3>Thanks, '+esc(rec.contact.firstName)+'!</h3><p>'+(saved?"Your request is in. We'll be in touch shortly.":"One last step: tap the button to send your request by email.")+'</p><div class="ref">Reference '+esc(rec.ref)+'</div>'+(saved?'':'<a class="btn" href="'+esc(mail)+'">Send my request by email</a>')+'<p style="color:#666">Need it faster? Call <a href="tel:+19056672823"><b>905-667-2823</b></a></p></div>';
  renderW()}
document.addEventListener("click",function(e){var q=e.target.closest("[data-quote-product]");if(q){var p=byId(q.dataset.quoteProduct);if(!p)return;$$(".ovl.open").forEach(function(o){if(o.id!=="wiz")o.classList.remove("open")});openWizard(p.cat==="water"?"tankless":p.cat,{brand:HVACB.concat(WATB,HPB).indexOf(p.brand)>-1?p.brand:undefined,model:p.name});return}
  var s=e.target.closest("[data-svc]");if(s&&!s.closest(".ovl")){openWizard(s.dataset.svc);return}if(s&&s.closest("#arto")){closeO($("#arto"));openWizard(s.dataset.svc);return}
  var o=e.target.closest('[data-open="quote"]');if(o)openWizard(null)});

/* ======================= SEARCH ======================= */
var sIn=$("#sIn"),sRes=$("#sRes"),shown=[],act=-1;
function items(){var it=[];allProducts().forEach(function(p){it.push({k:"Products",t:p.name,s:p.tag||"",img:p.imgUrl||(p.img&&IMG[p.img])||"",ic:CATS[p.cat]?CATS[p.cat].ic:"home",h:(p.name+" "+p.brand+" "+p.model+" "+(CATS[p.cat]?CATS[p.cat].name:"")+" "+({water:"water heater hot water tankless",ac:"air conditioner cooling central air ac",hp:"heat pump heating cooling mini split ductless",ah:"air handler hydronic combo airmax",furnace:"furnace heating gas"})[p.cat]+" "+(p.feats3||[]).join(" ")).toLowerCase(),go:function(){var u=L("product",p.id);if(u)location.href=u;else showProduct(p.id)}})});
  SERVICES.forEach(function(s){it.push({k:"Services",t:s.name,s:"Get a free quote",ic:s.ic,h:(s.name+" "+s.id+(s.id==="plumb"?" pipes drain leak toilet":"")+(s.id==="repair"?" fix broken no heat no cooling emergency":"")).toLowerCase(),go:function(){var u=L("svc",s.id);if(u)location.href=u;else openWizard(s.id)}})});
  allBrands.forEach(function(b){it.push({k:"Brands",t:b,s:"See "+b+" products",ic:"shop",h:b.toLowerCase(),go:function(){var u=L("brand",b);if(u){location.href=u;return}var c=Object.keys(BRANDS).find(function(k){return BRANDS[k].indexOf(b)>-1});shop.brand[c]=b;renderShop();$("#row-"+c).scrollIntoView({behavior:"smooth",block:"center"})}})});
  POSTS.forEach(function(p,i){it.push({k:"Articles",t:p.t,s:p.x,ic:p.ic,h:(p.t+" "+p.x+" "+p.tag).toLowerCase(),go:function(){var u=L("post",i);if(u)location.href=u;else $('[data-post="'+i+'"]').click()}})});return it}
function renderS(){var q=sIn.value.trim().toLowerCase();if(!q){sRes.hidden=true;sIn.setAttribute("aria-expanded","false");return}
  if(/^[a-z]\d[a-z]\s?(\d([a-z](\d)?)?)?$/i.test(q)){var r=checkPostal(q);var full=/^[a-z]\d[a-z]\s?\d[a-z]\d$/i.test(q);shown=[];sRes.innerHTML='<h4>Service area</h4><div class="pcr '+(r.state==="ok"?"ok":"")+'"><span class="ri">'+ic(r.state==="ok"?"check":"home")+'</span><span><b>'+esc(r.state==="bad"?"Postal code check":r.msg)+'</b><small>'+(r.state==="bad"||!full?"Type your full postal code, e.g. L5B 3C2":"Free quotes · Licensed technicians")+'</small></span>'+(r.state!=="bad"?'<button class="btn sm" type="button" data-book-pc="'+esc(r.pc)+'">'+(r.state==="no"?"Call us":"Book")+'</button>':"")+'</div>';sRes.hidden=false;sIn.setAttribute("aria-expanded","true");return}var toks=q.split(/\s+/);shown=items().filter(function(it){return toks.every(function(t){return it.h.indexOf(t)>-1})}).slice(0,10);act=-1;
  if(!shown.length)sRes.innerHTML='<div class="none">No match for “'+esc(sIn.value)+'”. Call <b>'+JORA.phone+'</b> — we probably do that too.</div>';
  else{var g="",h="";shown.forEach(function(it,i){if(it.k!==g){g=it.k;h+="<h4>"+g+"</h4>"}h+='<button type="button" role="option" data-i="'+i+'"><span class="ri">'+(it.img?'<img alt="" src="'+esc(it.img)+'">':ic(it.ic))+'</span><span><b>'+esc(it.t)+'</b><small>'+esc(it.s)+'</small></span></button>'});sRes.innerHTML=h}
  sRes.hidden=false;sIn.setAttribute("aria-expanded","true")}
function choose(i){var it=shown[i];if(!it)return;sRes.hidden=true;sIn.blur();it.go()}
sIn.addEventListener("input",renderS);sIn.addEventListener("focus",renderS);
sIn.addEventListener("keydown",function(e){var bs=$$("button",sRes);if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(!bs.length)return;act=(act+(e.key==="ArrowDown"?1:-1)+bs.length)%bs.length;bs.forEach(function(b,k){b.classList.toggle("on",k===act)})}if(e.key==="Escape")sRes.hidden=true});
sRes.addEventListener("mousedown",function(e){var b=e.target.closest("[data-i]");if(b){e.preventDefault();choose(+b.dataset.i)}});
$("#sForm").addEventListener("submit",function(e){e.preventDefault();renderS();choose(act>=0?act:0)});
document.addEventListener("click",function(e){if(!e.target.closest(".search"))sRes.hidden=true});


/* ======================= POSTAL CODE CHECK ======================= */
var PREPOSTAL="";
function checkPostal(raw){var v=String(raw||"").toUpperCase().replace(/[^A-Z0-9]/g,"");
  if(!/^[A-Z]\d[A-Z](\d[A-Z]\d)?$/.test(v))return {state:"bad",msg:"Enter a postal code like S7K 1J5."};
  var pc=v.length>3?v.slice(0,3)+" "+v.slice(3):v,a=v.slice(0,2),L=v[0];
  if(L==="S")return {state:"ok",pc:pc,msg:"We serve Saskatoon and surrounding communities, plus Regina, Prince Albert and Moose Jaw. Book and we'll confirm "+pc+"."};
  return {state:"no",pc:pc,msg:pc+" is outside our usual area — call us, we may still help."}}
function pcAction(r){return r.state==="bad"?"":'<button type="button" data-book-pc="'+esc(r.pc)+'">'+(r.state==="no"?"Call 905-667-2823":"Book a free quote")+'</button><a class="pc-gmap" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.pc+", Saskatchewan, Canada")+'" target="_blank" rel="noopener">View on Google Maps ↗</a>'}
if(has("#pcForm"))$("#pcForm").addEventListener("submit",function(e){e.preventDefault();var r=checkPostal($("#pcIn").value),o=$("#pcRes");o.className="pres "+(r.state==="bad"?"no":r.state);o.innerHTML=(r.state==="ok"?"✓ ":r.state==="no"?"✕ ":"")+esc(r.msg)+pcAction(r)});
if(has("#pcIn"))$("#pcIn").addEventListener("input",function(){var i=this,v=i.value.toUpperCase().replace(/[^A-Z0-9]/g,"");i.value=v.length>3?v.slice(0,3)+" "+v.slice(3,6):v});
document.addEventListener("click",function(e){var b=e.target.closest("[data-book-pc]");if(!b)return;e.preventDefault();if(/Call/.test(b.textContent)){location.href="tel:+19056672823";return}PREPOSTAL=b.dataset.bookPc;$("#sRes").hidden=true;openWizard(null)});

/* ======================= WHOLE-SITE WEATHER THEME =======================
   The page looks like the weather where the visitor is: rain falls over the
   whole site, snow falls and piles up, sunny days glow, nights get stars.
   Location comes from the visitor's internet connection (no permission pop-up);
   if that fails we use Saskatoon. Owner can preview with ?weather=rain|snow|sun|hot|storm|cloud|night */
var WX={kind:"sun",night:false,temp:null,set:21};
try{var ss=+localStorage.getItem("jora_set");if(ss>=16&&ss<=28)WX.set=ss}catch(e){}
function wxClassify(code,temp,day){var k;if(code>=95)k="storm";else if((code>=71&&code<=77)||code===85||code===86)k="snow";else if((code>=51&&code<=67)||(code>=80&&code<=82))k="rain";else if(code===45||code===48)k="fog";else if(code>=3)k="cloud";else k="sun";if(k==="sun"&&temp>=27)k="hot";return {kind:k,night:!day}}
function wxSeason(){var d=new Date(),m=d.getMonth(),h=d.getHours();return {kind:m<=1||m===11?"snow":m===2||m===3||m===10?"cloud":m>=5&&m<=7?"hot":"sun",night:h<7||h>=19}}
async function wxJSON(url,ms){var c=new AbortController(),t=setTimeout(function(){c.abort()},ms||5000);try{var r=await fetch(url,{signal:c.signal});return await r.json()}finally{clearTimeout(t)}}
async function wxGeo(){
  try{var g=await wxJSON("https://get.geojs.io/v1/ip/geo.json",3500);if(g&&g.latitude&&(g.country_code==="CA"&&g.region==="Saskatchewan"))return {lat:+g.latitude,lon:+g.longitude,city:g.city||"",region:g.region||""}}catch(e){}
  try{var h=await wxJSON("https://ipwho.is/?fields=success,latitude,longitude,country_code,city,region",3500);if(h&&h.success&&(h.country_code==="CA"&&h.region==="Saskatchewan"))return {lat:+h.latitude,lon:+h.longitude,city:h.city||"",region:h.region||""}}catch(e){}
  return {lat:52.1332,lon:-106.67,city:"Saskatoon",region:"Saskatchewan",fallback:true}}
async function wxLoad(){var c0=null;try{c0=JSON.parse(sessionStorage.getItem("jora_wx_sk")||"null")}catch(e){}
  if(c0&&c0.live&&Date.now()-c0.ts<30*60*1000){Object.assign(WX,c0);wxApply();return}
  var loc=await wxGeo();WX.city=loc.city;WX.region=loc.region;
  try{var j=await wxJSON("https://api.open-meteo.com/v1/forecast?latitude="+loc.lat+"&longitude="+loc.lon+"&current=temperature_2m,weather_code,is_day&timezone=auto",5000);var c=j.current;var r=wxClassify(c.weather_code,c.temperature_2m,c.is_day);WX.kind=r.kind;WX.night=r.night;WX.temp=c.temperature_2m;WX.code=c.weather_code;WX.live=true;
    try{sessionStorage.setItem("jora_wx_sk",JSON.stringify({kind:WX.kind,night:WX.night,temp:WX.temp,code:WX.code,city:WX.city,region:WX.region,live:true,ts:Date.now()}))}catch(e){}}
  catch(e){var s=wxSeason();WX.kind=s.kind;WX.night=s.night}
  window.JORA_WX=WX;wxApply()}
var WXFORCE=(function(){var m=/[?&#]weather=(\w+)/.exec(location.search+location.hash);return m?m[1]:null})();
function wxApply(force){var f=force||WXFORCE,kind=WX.kind,night=WX.night;
  if(f==="off"){var b0=document.body;b0.className=b0.className.replace(/\bwx-\S+/g,"").trim();fxStart("off",false);return}
  if(f){night=f==="night";kind=f==="night"?"sun":f}
  var b=document.body;b.className=b.className.replace(/\bwx-\S+/g,"").trim();b.classList.add("wx-"+kind);if(night)b.classList.add("wx-night");var cold=f?f==="cold":(WX.temp!=null&&WX.temp<=-3&&kind!=="snow"&&kind!=="hot");if(f==="cold"){b.classList.remove("wx-cold");b.classList.add("wx-sun")}if(cold)b.classList.add("wx-cold");b.dataset.wxCity=WX.city||"";
  dialMode();fxStart(cold&&kind!=="rain"&&kind!=="storm"?"frost":kind,night);
  if(!WX.heroSet&&window.JX){WX.heroSet=true;if(kind==="hot")JX.goCat("ac");else if(kind==="snow")JX.goCat("furnace")}}

/* thermostat: just the dial */
function dialMode(){var d=$("#dial");if(!d)return;var cool=document.body.classList.contains("wx-hot")||(WX.temp!=null&&WX.temp>=24);d.classList.toggle("cool",cool);$("#tMode").textContent=cool?"Cool":"Heat";$("#tSet").textContent=WX.set+"°";d.style.setProperty("--p",Math.round((WX.set-16)/12*100))}
if(has("#dial")){$("#dial .dn").onclick=function(){WX.set=Math.max(16,WX.set-1);try{localStorage.setItem("jora_set",WX.set)}catch(e){}dialMode()};
$("#dial .up").onclick=function(){WX.set=Math.min(28,WX.set+1);try{localStorage.setItem("jora_set",WX.set)}catch(e){}dialMode()}}
(function(){var d=$("#dial");if(!d)return;d.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;var r=d.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;d.style.transform="rotateY("+(x*36)+"deg) rotateX("+(-y*36)+"deg)"});d.addEventListener("pointerleave",function(){d.style.transform=""})})();

/* full-page particles */
var fx={cv:$("#wxfx"),parts:[],drops:[],splash:[],mode:"",run:false,pile:0};fx.ctx=fx.cv.getContext("2d");
function fxSize(){var d=Math.min(2,devicePixelRatio||1);fx.w=innerWidth;fx.h=innerHeight;fx.cv.width=fx.w*d;fx.cv.height=fx.h*d;fx.ctx.setTransform(d,0,0,d,0,0)}
function fxStart(kind,night){var m=kind==="off"?"none":kind==="frost"?"frost":kind==="storm"?"storm":kind==="rain"?"rain":kind==="snow"?"snow":kind==="hot"?"heat":kind==="fog"?"fog":kind==="cloud"?"cloud":night?"stars":"sun";
  if(m===fx.mode)return;fx.mode=m;fxSize();var area=fx.w*fx.h/(1440*900);
  var n={frost:70,storm:340,rain:230,snow:190,heat:40,stars:120,sun:40,fog:7,cloud:9,none:0}[m]*Math.max(.45,Math.min(1.4,area));if(reduce)n=n/4;n=Math.round(n);
  fx.parts=[];for(var i=0;i<n;i++)fx.parts.push({x:Math.random()*fx.w,y:Math.random()*fx.h,s:Math.random(),p:Math.random()*6.28});
  fx.drops=[];if(m==="rain"||m==="storm")for(var j=0;j<(reduce?4:14);j++)fx.drops.push(newDrop(true));
  fx.splash=[];fx.pile=0;
  if(!fx.run){fx.run=true;requestAnimationFrame(fxDraw)}}
function newDrop(any){return {x:Math.random()*fx.w,y:any?Math.random()*fx.h:-10,r:3+Math.random()*6,v:0,wait:Math.random()*200}}
function fxDraw(){var c=fx.ctx,w=fx.w,h=fx.h,m=fx.mode;
  if(document.hidden){setTimeout(function(){requestAnimationFrame(fxDraw)},500);return}
  c.clearRect(0,0,w,h);
  if(m==="rain"||m==="storm"){var nt=document.body.classList.contains("wx-night");c.strokeStyle=nt?"rgba(200,215,240,.5)":"rgba(60,90,130,.38)";c.lineWidth=1.1;c.beginPath();
    fx.parts.forEach(function(p){var sp=11+p.s*10,len=14+p.s*14;p.y+=sp;p.x-=sp*.2;if(p.y>h){if(Math.random()<.35)fx.splash.push({x:p.x,y:h-4-Math.random()*6,t:0});p.y=-20-Math.random()*40;p.x=Math.random()*w*1.15}c.moveTo(p.x,p.y);c.lineTo(p.x+len*.2,p.y-len)});c.stroke();
    /* splashes along the bottom of the screen */
    c.strokeStyle=nt?"rgba(200,215,240,.55)":"rgba(60,90,130,.4)";fx.splash=fx.splash.filter(function(s){s.t+=1;var r=s.t*.9;c.beginPath();c.ellipse(s.x,s.y,r,r*.28,0,0,6.28);c.globalAlpha=Math.max(0,1-s.t/18);c.stroke();c.globalAlpha=1;return s.t<18});
    /* drops running down the "glass" */
    fx.drops.forEach(function(d,i){if(d.wait>0){d.wait--}else{d.v=Math.min(4,d.v+.06+Math.random()*.05);d.y+=d.v;d.x+=Math.sin(d.y/30)*.2}
      var g=c.createRadialGradient(d.x-d.r*.3,d.y-d.r*.3,0,d.x,d.y,d.r);g.addColorStop(0,"rgba(255,255,255,.55)");g.addColorStop(.6,"rgba(180,205,230,.18)");g.addColorStop(1,"rgba(90,120,160,.28)");
      c.fillStyle=g;c.beginPath();c.ellipse(d.x,d.y,d.r*.8,d.r,0,0,6.28);c.fill();
      if(d.v>.5){c.fillStyle="rgba(170,195,225,.12)";c.fillRect(d.x-d.r*.25,d.y-d.r*4,d.r*.5,d.r*3.2)}
      if(d.y>h+20)fx.drops[i]=newDrop(false)})}
  else if(m==="snow"||m==="frost"){var fr=m==="frost";c.fillStyle="#fff";c.shadowColor="rgba(110,150,200,.55)";c.shadowBlur=3;
    fx.parts.forEach(function(p){p.p+=.008+p.s*.012;p.y+=.45+p.s*1.4;p.x+=Math.sin(p.p)*.8;if(p.y>h-fx.pile*.6){p.y=-8;p.x=Math.random()*w;if(!fr)fx.pile=Math.min(34,fx.pile+.02)}c.globalAlpha=fr?(.35+.6*Math.abs(Math.sin(p.p*3))):(.6+p.s*.4);c.beginPath();c.arc(p.x,p.y,fr?(.8+p.s*1.6):(1.2+p.s*3),0,6.28);c.fill()});c.globalAlpha=1;c.shadowBlur=0;
    /* snow piling up along the bottom of the screen */
    if(fx.pile>1){c.fillStyle="rgba(255,255,255,.96)";c.beginPath();c.moveTo(0,h);for(var x=0;x<=w;x+=24){c.lineTo(x,h-fx.pile+Math.sin(x/53)*fx.pile*.25+Math.sin(x/17)*2)}c.lineTo(w,h);c.closePath();c.shadowColor="rgba(120,160,210,.35)";c.shadowBlur=8;c.fill();c.shadowBlur=0}}
  else if(m==="heat"||m==="sun"){fx.parts.forEach(function(p){p.y-=.25+p.s*.5;p.p+=.02;p.x+=Math.sin(p.p)*.35;if(p.y<-10){p.y=h+10;p.x=Math.random()*w}
      c.fillStyle=m==="heat"?"rgba(255,"+(140+Math.round(p.s*70))+",40,"+(.10+p.s*.22)+")":"rgba(255,200,90,"+(.14+p.s*.24)+")";c.beginPath();c.arc(p.x,p.y,1.8+p.s*(m==="heat"?4:3.5),0,6.28);c.fill()})}
  else if(m==="cloud"||m==="fog"){var ntc=document.body.classList.contains("wx-night");fx.parts.forEach(function(p,i){
      if(m==="cloud"){p.x+=.12+p.s*.25;if(p.x>w+260)p.x=-260;var cy=30+(i%4)*55+p.s*30,r=70+p.s*90;
        for(var k=0;k<5;k++){var cx=p.x+(k-2)*r*.55,yy=cy+Math.sin(k*1.7+p.p)*r*.18,rr=r*(.55+.25*Math.sin(k+p.p));var g=c.createRadialGradient(cx,yy,0,cx,yy,rr);
          g.addColorStop(0,ntc?"rgba(150,160,180,.22)":"rgba(255,255,255,.42)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.arc(cx,yy,rr,0,6.28);c.fill()}}
      else{p.x+=.15+p.s*.2;if(p.x>w)p.x-=w*1.4;var by=h*(.15+i/fx.parts.length*.85),g2=c.createLinearGradient(0,by-80,0,by+80);g2.addColorStop(0,"rgba(235,240,245,0)");g2.addColorStop(.5,ntc?"rgba(170,180,195,.18)":"rgba(240,244,248,.32)");g2.addColorStop(1,"rgba(235,240,245,0)");
        c.fillStyle=g2;c.beginPath();c.ellipse(p.x,by,w*.7,80,0,0,6.28);c.fill();c.beginPath();c.ellipse(p.x-w*1.4,by,w*.7,80,0,0,6.28);c.fill()}})}
  else if(m==="stars"){fx.parts.forEach(function(p){p.p+=.015+p.s*.03;var a=.2+Math.abs(Math.sin(p.p))*.75;c.fillStyle="rgba(255,255,255,"+a.toFixed(2)+")";c.fillRect(p.x,p.y*.75,1+p.s*1.6,1+p.s*1.6)})}
  if(m==="none"){fx.run=false;return}
  requestAnimationFrame(fxDraw)}
addEventListener("resize",function(){var m=fx.mode;fx.mode="";fxSize();wxApply()});
(function(){try{var c0=JSON.parse(sessionStorage.getItem("jora_wx_sk")||"null");if(c0)Object.assign(WX,c0)}catch(e){}})();wxApply();wxLoad().catch(function(){var s=wxSeason();WX.kind=s.kind;WX.night=s.night;wxApply()});
setInterval(function(){try{sessionStorage.removeItem("jora_wx_sk")}catch(e){}wxLoad().catch(function(){})},30*60*1000);

/* ======================= CAPABILITIES (db / user / assets / downloads) ======================= */
var CAP={db:null,user:null,assets:null,dl:null,canWrite:false,admin:false};
window.JORA_CAP=CAP;
(async function(){if(!window.JRT||!JRT.use)return;
  try{CAP.user=await JRT.use("user")}catch(e){}
  try{CAP.db=await JRT.use("db")}catch(e){}
  if(CAP.user){try{CAP.admin=!!(await CAP.user.canEdit())}catch(e){}try{var w=await CAP.user.can("data.write");CAP.canWrite=w===null?CAP.admin:!!w}catch(e){}}
  if(CAP.db){
    CAP.db.doc("pub/site").onSnapshot(function(s){var d=s.exists?s.data():{};SITE=Object.assign({teamPhotos:[]},d);renderTeam()},function(){});
    CAP.db.collection("pub/site/projects").onSnapshot(function(s){WORKDB=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())});renderWork()},function(){});
    CAP.db.collection("pub/site/products").onSnapshot(function(s){CUSTOM=s.docs.map(function(d){return Object.assign({id:d.id},d.data())});renderShop()},function(){});
  }
  if(CAP.admin&&CAP.db){$("#admFab").classList.add("show");if(location.hash==="#admin")openAdmin()}
})();
$("#admFab").onclick=function(){openAdmin()};
window.addEventListener("hashchange",function(){if(location.hash==="#admin"&&CAP.admin)openAdmin()});
async function upsertCustomer(c,svc){var id=custId(c.email),ref=CAP.db.collection("customers").doc(id);var cur=await ref.get();var base=cur.exists?Object.assign({},cur.data()):{createdAt:new Date().toISOString(),services:[]};
  var services=(base.services||[]).slice();if(svc&&services.indexOf(svc)<0)services.push(svc);
  await ref.set(Object.assign(base,{name:((c.firstName||"")+" "+(c.lastName||"")).trim()||c.name||"",firstName:c.firstName||base.firstName||"",email:(c.email||"").toLowerCase(),phone:c.phone||"",street:c.street||"",unit:c.unit||"",city:c.city||"",province:c.province||"SK",postal:(c.postal||"").toUpperCase(),okNews:!!c.okNews||!!base.okNews,services:services,updatedAt:new Date().toISOString()}));return id}

/* ======================= ADMIN PANEL ======================= */
var A={tab:"dash",req:[],cust:[],quotes:[],camps:[],subs:false,qEdit:null,cEdit:null,rView:null};
var TABS=[["dash","Dashboard"],["req","Requests"],["cust","Customers"],["quote","Quotations"],["mail","Email customers"],["prod","Products"],["work","Our work"],["team","Team photos"],["set","Settings"]];
function openAdmin(){if(!CAP.admin||!CAP.db)return;if(!A.subs){A.subs=true;
  CAP.db.collection("requests").orderBy("createdAt","desc").limit(500).onSnapshot(function(s){A.req=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())});renderA()},aErr);
  CAP.db.collection("customers").orderBy("name").limit(1000).onSnapshot(function(s){A.cust=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())});renderA()},aErr);
  CAP.db.collection("quotes").orderBy("createdAt","desc").limit(500).onSnapshot(function(s){A.quotes=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())});renderA()},aErr);
  CAP.db.collection("campaigns").orderBy("at","desc").limit(50).onSnapshot(function(s){A.camps=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())});renderA()},aErr);
  JRT.use("assets").then(function(a){CAP.assets=a}).catch(function(){});JRT.use("downloads").then(function(d){CAP.dl=d}).catch(function(){})}
  renderA();openO("admin")}
function aErr(e){toast("Database: "+(e&&e.message||"unavailable"))}
function toast(m){var t=$("#admToast");if(!t){t=document.createElement("div");t.id="admToast";t.style.cssText="position:fixed;left:50%;bottom:20px;transform:translateX(-50%);background:#1E1E1E;color:#fff;padding:10px 16px;z-index:400;font-weight:700;border-left:4px solid #F96302;max-width:90vw";document.body.appendChild(t)}t.textContent=m;t.style.display="block";clearTimeout(t._h);t._h=setTimeout(function(){t.style.display="none"},3200)}
function setTab(t){A.tab=t;renderA();$("#admMain").scrollTop=0}
$("#admNav").addEventListener("click",function(e){var b=e.target.closest("[data-tab]");if(b){A.qEdit=null;A.cEdit=null;A.rView=null;setTab(b.dataset.tab)}});
function renderA(){if(!$("#admin").classList.contains("open")&&!A.subs)return;var nNew=A.req.filter(function(r){return r.status==="new"}).length;
  $("#admNav").innerHTML=TABS.map(function(t){return '<button type="button" data-tab="'+t[0]+'" class="'+(A.tab===t[0]?'on':'')+'">'+t[1]+(t[0]==="req"&&nNew?' <span class="cnt">'+nNew+'</span>':'')+'</button>'}).join("");
  var m=$("#admMain"),f={dash:aDash,req:aReq,cust:aCust,quote:aQuote,mail:aMail,prod:aProd,work:aWork,team:aTeam,set:aSet}[A.tab];
  var keep=document.activeElement&&m.contains(document.activeElement)&&/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);if(keep&&A.tab!=="dash"&&A.tab!=="req")return;
  m.innerHTML=f()}
function stt(s){return '<span class="st '+esc(s||"new")+'">'+esc(s||"new")+'</span>'}
function d10(s){return s?esc(String(s).slice(0,10)):""}
function qTotals(q){var sub=(q.items||[]).reduce(function(a,i){return a+(+i.q||0)*(+i.p||0)},0),disc=+q.discount||0,net=Math.max(0,sub-disc),tax=[];
  if(q.province==="SK"||!q.province){tax.push(["GST 5%",net*.05],["PST 6%",net*.06])}else if(q.province==="AB"){tax.push(["GST 5%",net*.05])}else{tax.push(["Tax "+(+q.taxRate||0)+"%",net*(+q.taxRate||0)/100])}
  var t=net+tax.reduce(function(a,x){return a+x[1]},0);return {sub:sub,disc:disc,net:net,tax:tax,total:t}}
function aDash(){var open=A.quotes.filter(function(q){return q.status==="sent"||q.status==="draft"}),won=A.quotes.filter(function(q){return q.status==="accepted"}).reduce(function(a,q){return a+qTotals(q).total},0);
  return '<h3>Dashboard</h3><p class="sub">Requests, quotes and customers in one place.</p><div class="kp"><div><b>'+A.req.length+'</b><span>Requests</span></div><div><b>'+A.req.filter(function(r){return r.status==="new"}).length+'</b><span>New — need reply</span></div><div><b>'+A.cust.length+'</b><span>Customers</span></div><div><b>'+money(won)+'</b><span>Accepted quotes</span></div></div>'+
  '<div class="card"><h4>Latest requests</h4>'+(A.req.length?reqTable(A.req.slice(0,6)):'<div class="emp">No requests yet. Requests sent from this page while you\'re signed in appear here. You can also add a customer manually and create a quote.</div>')+'</div>'+
  '<div class="card"><h4>Quick actions</h4><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-a="newquote">New quotation</button><button class="btn k" data-a="newcust">Add customer</button><button class="btn o" data-tab="mail">Email customers</button><button class="btn g" data-tab="team">Upload team photos</button></div></div>'}
function reqTable(list){return '<table class="tbl"><thead><tr><th>Date</th><th>Ref</th><th>Customer</th><th>Service</th><th>City</th><th>Status</th></tr></thead><tbody>'+list.map(function(r){var c=r.contact||{};return '<tr class="clk" data-rq="'+esc(r._id)+'"><td>'+d10(r.createdAt)+'</td><td>'+esc(r.ref)+'</td><td>'+esc((c.firstName||"")+" "+(c.lastName||""))+'<br><small>'+esc(c.phone||"")+'</small></td><td>'+esc(r.serviceName)+'</td><td>'+esc(c.city||"")+'</td><td>'+stt(r.status)+'</td></tr>'}).join("")+'</tbody></table>'}
function aReq(){if(A.rView){var r=A.req.find(function(x){return x._id===A.rView});if(r)return reqDetail(r)}
  return '<h3>Requests</h3><p class="sub">Quote requests from your website.</p>'+(A.req.length?reqTable(A.req):'<div class="emp">No requests yet.</div>')}
function reqDetail(r){var c=r.contact||{};return '<button class="btn g sm" data-a="back">‹ All requests</button><h3 style="margin-top:12px">'+esc(r.serviceName)+' · '+esc(r.ref)+'</h3><p class="sub">'+d10(r.createdAt)+' · '+stt(r.status)+'</p>'+
  '<div class="card"><h4>Project</h4><div class="rev">'+answersRows(r.answers||{}).map(function(x){return '<div><dt>'+esc(x[0])+'</dt><dd>'+esc(x[1])+'</dd></div>'}).join("")+'</div></div>'+
  '<div class="card"><h4>Customer</h4><div class="rev">'+contactRows(c).map(function(x){return '<div><dt>'+esc(x[0])+'</dt><dd>'+esc(x[1])+'</dd></div>'}).join("")+'</div></div>'+
  '<div class="card"><h4>Actions</h4><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><label>Status <select class="inp" style="width:auto;min-height:38px" data-rstatus="'+esc(r._id)+'">'+["new","contacted","quoted","won","lost"].map(function(s){return '<option'+(s===r.status?' selected':'')+'>'+s+'</option>'}).join("")+'</select></label><button class="btn" data-a="quotefromreq" data-id="'+esc(r._id)+'">Create quotation</button><a class="btn k" href="mailto:'+esc(c.email)+'?subject='+encodeURIComponent("Your "+r.serviceName+" request ("+r.ref+")")+'">Email customer</a><a class="btn o" href="tel:'+esc((c.phone||"").replace(/[^\d+]/g,""))+'">Call</a><button class="btn r" data-a="delreq" data-id="'+esc(r._id)+'">Delete</button></div></div>'}
function aCust(){if(A.cEdit)return custForm(A.cEdit);var q=(A.cq||"").toLowerCase(),list=A.cust.filter(function(c){return !q||(c.name+" "+c.email+" "+c.city+" "+c.phone).toLowerCase().indexOf(q)>-1});
  return '<h3>Customers</h3><p class="sub">Everyone who requested a quote, plus customers you add.</p><div class="tools"><input class="inp" id="cq" placeholder="Search name, email, city…" value="'+esc(A.cq||"")+'"><button class="btn" data-a="newcust">Add customer</button></div>'+
  (list.length?'<table class="tbl"><thead><tr><th>Name</th><th>Email / phone</th><th>Address</th><th>Offers</th><th></th></tr></thead><tbody>'+list.map(function(c){return '<tr><td><b>'+esc(c.name)+'</b><br><small>'+esc((c.services||[]).join(", "))+'</small></td><td>'+esc(c.email)+'<br><small>'+esc(c.phone)+'</small></td><td>'+esc([c.street,c.city,c.province,c.postal].filter(Boolean).join(", "))+'</td><td>'+(c.okNews?'✓':'—')+'</td><td style="white-space:nowrap"><button class="btn sm" data-a="quotefor" data-id="'+esc(c._id)+'">Quote</button> <button class="btn g sm" data-a="editcust" data-id="'+esc(c._id)+'">Edit</button></td></tr>'}).join("")+'</tbody></table>':'<div class="emp">No customers yet.</div>')}
function custForm(c){var v=function(k){return esc(c[k]||"")};return '<button class="btn g sm" data-a="back">‹ Customers</button><h3 style="margin-top:12px">'+(c._id?"Edit customer":"Add customer")+'</h3><div class="card"><div class="fgrid" id="cf">'+
  '<label class="fl">Full name<input name="name" value="'+v("name")+'"></label><label class="fl">Email<input name="email" type="email" value="'+v("email")+'"></label><label class="fl">Phone<input name="phone" value="'+v("phone")+'"></label><label class="fl">Street<input name="street" value="'+v("street")+'"></label><label class="fl">Unit<input name="unit" value="'+v("unit")+'"></label><label class="fl">City<input name="city" value="'+v("city")+'"></label><label class="fl">Province<select name="province">'+["SK","AB","MB","Other"].map(function(p){return '<option'+(p===(c.province||"ON")?' selected':'')+'>'+p+'</option>'}).join("")+'</select></label><label class="fl">Postal code<input name="postal" value="'+v("postal")+'"></label>'+
  '<label class="fl full">Notes<textarea name="notes">'+v("notes")+'</textarea></label><label class="chk full"><input type="checkbox" name="okNews"'+(c.okNews?' checked':'')+'> Customer agreed to receive marketing emails</label></div><div style="display:flex;gap:8px;margin-top:12px"><button class="btn" data-a="savecust">Save customer</button>'+(c._id?'<button class="btn r" data-a="delcust" data-id="'+esc(c._id)+'">Delete</button>':'')+'</div></div>'}
function newQuote(cust,item){var n=A.quotes.length+1,y=new Date().getFullYear();return {number:"Q-"+y+"-"+String(n).padStart(4,"0"),date:today(),valid:30,status:"draft",province:(cust&&cust.province==="AB")?"AB":"SK",customerId:cust?cust._id||"":"",customer:cust?{name:cust.name,email:cust.email,phone:cust.phone,address:[cust.street,cust.unit,cust.city,cust.province,cust.postal].filter(Boolean).join(", ")}:{name:"",email:"",phone:"",address:""},items:item?[item]:[{d:"",q:1,p:0}],discount:0,notes:SITE.terms||"Price includes supply, installation, standard materials, permits where required, removal and disposal of old equipment, and start-up testing. Quote valid 30 days. 50% deposit to schedule, balance on completion.",createdAt:new Date().toISOString()}}
function aQuote(){if(A.qEdit)return quoteForm(A.qEdit);return '<h3>Quotations</h3><p class="sub">Build a quote, download it, and email it to your client.</p><div class="tools"><button class="btn" data-a="newquote">New quotation</button></div>'+
  (A.quotes.length?'<table class="tbl"><thead><tr><th>Number</th><th>Date</th><th>Client</th><th>Total</th><th>Status</th></tr></thead><tbody>'+A.quotes.map(function(q){return '<tr class="clk" data-qe="'+esc(q._id)+'"><td><b>'+esc(q.number)+'</b></td><td>'+esc(q.date)+'</td><td>'+esc(q.customer&&q.customer.name)+'</td><td>'+money(qTotals(q).total)+'</td><td>'+stt(q.status)+'</td></tr>'}).join("")+'</tbody></table>':'<div class="emp">No quotations yet.</div>')}
var PRESETS=function(){var p=[["Labour — installation & start-up",1,0],["Permit & inspection",1,0],["Removal & disposal of old equipment",1,0],["Venting / gas line modifications",1,0],["Ductwork modifications",1,0],["Smart thermostat (supply & install)",1,0],["Condensate pump",1,0],["Line set & pad (AC)",1,0],["Annual maintenance plan",1,0]];return allProducts().map(function(x){return [x.name+" — supply",1,0]}).concat(p)};
function quoteForm(q){var t=qTotals(q);return '<button class="btn g sm" data-a="back">‹ Quotations</button><h3 style="margin-top:12px">Quotation '+esc(q.number)+'</h3>'+
  '<div class="card"><h4>Client</h4><div class="fgrid" id="qc"><label class="fl full">Choose existing customer<select data-qcust><option value="">— Select —</option>'+A.cust.map(function(c){return '<option value="'+esc(c._id)+'"'+(c._id===q.customerId?' selected':'')+'>'+esc(c.name+" · "+c.email)+'</option>'}).join("")+'</select></label>'+
  '<label class="fl">Name<input data-qk="customer.name" value="'+esc(q.customer.name)+'"></label><label class="fl">Email<input data-qk="customer.email" value="'+esc(q.customer.email)+'"></label><label class="fl">Phone<input data-qk="customer.phone" value="'+esc(q.customer.phone)+'"></label><label class="fl">Address<input data-qk="customer.address" value="'+esc(q.customer.address)+'"></label></div></div>'+
  '<div class="card"><h4>Details</h4><div class="fgrid"><label class="fl">Quote number<input data-qk="number" value="'+esc(q.number)+'"></label><label class="fl">Date<input type="date" data-qk="date" value="'+esc(q.date)+'"></label><label class="fl">Valid for (days)<input type="number" data-qk="valid" value="'+esc(q.valid)+'"></label><label class="fl">Tax<select data-qk="province">'+[["SK","Saskatchewan — GST 5% + PST 6%"],["AB","Alberta — GST 5%"],["QC","Québec — GST 5% + QST 9.975%"]].map(function(o){return '<option value="'+o[0]+'"'+(o[0]===q.province?' selected':'')+'>'+o[1]+'</option>'}).join("")+'</select></label><label class="fl">Status<select data-qk="status">'+["draft","sent","accepted","declined"].map(function(s){return '<option'+(s===q.status?' selected':'')+'>'+s+'</option>'}).join("")+'</select></label></div></div>'+
  '<div class="card"><h4>Line items</h4><div class="li" style="font-size:12px;font-weight:700;color:#666;text-transform:uppercase"><span>Description</span><span>Qty</span><span>Unit price</span><span class="tot">Amount</span><span></span></div>'+q.items.map(function(it,i){return '<div class="li"><input class="inp" data-li="'+i+'" data-f="d" value="'+esc(it.d)+'" list="presetList" placeholder="Description"><input class="inp" type="number" min="0" step="1" data-li="'+i+'" data-f="q" value="'+esc(it.q)+'"><input class="inp" type="number" min="0" step="0.01" data-li="'+i+'" data-f="p" value="'+esc(it.p)+'"><span class="tot">'+money((+it.q||0)*(+it.p||0))+'</span><button type="button" data-a="delli" data-i="'+i+'" aria-label="Remove line">×</button></div>'}).join("")+
  '<datalist id="presetList">'+PRESETS().map(function(p){return '<option value="'+esc(p[0])+'">'}).join("")+'</datalist><button class="btn g sm" data-a="addli">+ Add line</button>'+
  '<div class="tots" id="qtots"><div><span>Subtotal</span><b>'+money(t.sub)+'</b></div><div><span>Discount <input class="inp" type="number" min="0" step="0.01" data-qk="discount" value="'+esc(q.discount)+'" style="width:110px;min-height:32px;display:inline-block"></span><b>-'+money(t.disc)+'</b></div>'+t.tax.map(function(x){return '<div><span>'+x[0]+'</span><b>'+money(x[1])+'</b></div>'}).join("")+'<div class="gt"><span>Total</span><span>'+money(t.total)+'</span></div></div></div>'+
  '<div class="card"><h4>Notes &amp; terms</h4><textarea class="inp" data-qk="notes" style="width:100%">'+esc(q.notes)+'</textarea></div>'+
  '<div class="card"><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-a="savequote">Save quotation</button><button class="btn k" data-a="dlquote">Download quote</button><button class="btn" data-a="gmailquote">Send with Gmail</button><button class="btn o" data-a="mailquote">Open in email app</button><button class="btn g" data-a="printquote">Print / PDF</button>'+(q._id?'<button class="btn r" data-a="delquote">Delete</button>':'')+'</div><p class="sub" style="margin:10px 0 0">“Send with Gmail” emails the full quote straight from your connected Gmail. Or download it and attach it yourself.</p></div>'}
function quoteDoc(q){var t=qTotals(q),S=SITE;return '<!doctype html><html><head><meta charset="utf-8"><title>'+esc(q.number)+'</title><style>body{font:14px/1.5 Arial,sans-serif;color:#222;max-width:800px;margin:30px auto;padding:0 20px}h1{font:800 28px Arial;margin:0;color:#F96302}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:left}th{background:#f3f3f3}.r{text-align:right}.top{display:flex;justify-content:space-between;gap:20px;border-bottom:4px solid #F96302;padding-bottom:14px}.tot td{border:0}.gt td{font-weight:800;font-size:18px;border-top:2px solid #222}small{color:#666}</style></head><body>'+
  '<div class="top"><div><h1>'+esc(JORA.company)+'</h1><div>'+esc(S.phone||JORA.phone)+' · '+esc(S.notifyEmail||JORA.notifyEmail)+'</div>'+(S.hst?'<small>HST # '+esc(S.hst)+'</small>':'')+'</div><div class="r"><b style="font-size:20px">QUOTATION</b><br>'+esc(q.number)+'<br>Date: '+esc(q.date)+'<br>Valid: '+esc(q.valid)+' days</div></div>'+
  '<p><b>Prepared for</b><br>'+esc(q.customer.name)+'<br>'+esc(q.customer.address)+'<br>'+esc(q.customer.email)+' · '+esc(q.customer.phone)+'</p>'+
  '<table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr></thead><tbody>'+q.items.filter(function(i){return i.d}).map(function(i){return '<tr><td>'+esc(i.d)+'</td><td class="r">'+esc(i.q)+'</td><td class="r">'+money(i.p)+'</td><td class="r">'+money((+i.q||0)*(+i.p||0))+'</td></tr>'}).join("")+'</tbody></table>'+
  '<table class="tot"><tr><td class="r">Subtotal</td><td class="r" style="width:140px">'+money(t.sub)+'</td></tr>'+(t.disc?'<tr><td class="r">Discount</td><td class="r">-'+money(t.disc)+'</td></tr>':'')+t.tax.map(function(x){return '<tr><td class="r">'+x[0]+'</td><td class="r">'+money(x[1])+'</td></tr>'}).join("")+'<tr class="gt"><td class="r">Total (CAD)</td><td class="r">'+money(t.total)+'</td></tr></table>'+
  '<p style="white-space:pre-wrap"><b>Notes &amp; terms</b><br>'+esc(q.notes)+'</p><p style="margin-top:40px">Accepted by: ______________________ &nbsp; Date: ____________</p></body></html>'}
function quoteText(q){var t=qTotals(q),L=["Hi "+(q.customer.name||"").split(" ")[0]+",","","Thank you for choosing "+JORA.company+". Here is your quotation "+q.number+" ("+q.date+"):",""];q.items.filter(function(i){return i.d}).forEach(function(i){L.push("• "+i.d+" — "+i.q+" × "+money(i.p)+" = "+money((+i.q||0)*(+i.p||0)))});L.push("","Subtotal: "+money(t.sub));if(t.disc)L.push("Discount: -"+money(t.disc));t.tax.forEach(function(x){L.push(x[0]+": "+money(x[1]))});L.push("TOTAL: "+money(t.total)+" CAD","","Valid for "+q.valid+" days.","",q.notes,"","Questions? Call "+JORA.phone+".","",JORA.company);return L.join("\n")}
function aMail(){var aud=A.aud||{news:true,city:"",svc:""};A.aud=aud;var list=mailList();
  return '<h3>Email customers</h3><p class="sub">Send news, seasonal tune-up reminders or offers to your customers.</p><div class="note">Canadian anti-spam law (CASL): send marketing emails only to customers who agreed. Keep “Only customers who agreed” ticked unless the email is about a job they asked for.</div>'+
  '<div class="card"><h4>Who gets it</h4><div class="fgrid"><label class="chk full"><input type="checkbox" data-aud="news"'+(aud.news?' checked':'')+'> Only customers who agreed to marketing emails</label><label class="fl">City contains<input data-aud="city" value="'+esc(aud.city)+'"></label><label class="fl">Service<select data-aud="svc"><option value="">Any</option>'+SERVICES.map(function(s){return '<option'+(s.name===aud.svc?' selected':'')+'>'+esc(s.name)+'</option>'}).join("")+'</select></label></div><p style="margin:10px 0 0"><b>'+list.length+'</b> recipient'+(list.length===1?'':'s')+'</p></div>'+
  '<div class="card"><h4>Message</h4><label class="fl">Subject<input id="mSub" value="'+esc(A.mSub||"Time for your fall furnace tune-up")+'"></label><label class="fl" style="margin-top:10px">Message<textarea id="mBody" style="min-height:160px">'+esc(A.mBody||"Hi,\n\nWinter is coming — book your furnace tune-up with Jora Mechanical Systems and stay warm all season.\n\nCall 905-667-2823 or reply to this email to book.\n\nThanks,\nJora Mechanical Systems\n\nTo stop receiving these emails, reply with UNSUBSCRIBE.")+'</textarea></label>'+
  '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px" id="mBtns">'+mailBatches(list)+'<button class="btn g" data-a="copymails">Copy addresses</button><button class="btn g" data-a="csv">Download CSV</button></div><p class="sub" style="margin:10px 0 0">Each send goes to up to 40 customers in BCC (hidden from each other) — straight from your Gmail, or through your email app. For larger lists, use the CSV in Gmail or Mailchimp.</p></div>'+
  (A.camps.length?'<div class="card"><h4>Sent history</h4><table class="tbl"><tbody>'+A.camps.map(function(c){return '<tr><td>'+d10(c.at)+'</td><td>'+esc(c.subject)+'</td><td>'+esc(c.count)+' recipients</td></tr>'}).join("")+'</tbody></table></div>':'')}
function mailList(){var a=A.aud||{news:true};return A.cust.filter(function(c){return c.email&&(!a.news||c.okNews)&&(!a.city||(c.city||"").toLowerCase().indexOf(a.city.toLowerCase())>-1)&&(!a.svc||(c.services||[]).indexOf(a.svc)>-1)})}
function mailBatches(list){if(!list.length)return '<button class="btn" disabled>No recipients</button>';var out="";for(var i=0;i<list.length;i+=40){out+='<button class="btn" data-a="gmailbatch" data-from="'+i+'">Send with Gmail ('+(i+1)+'–'+Math.min(i+40,list.length)+')</button><button class="btn o" data-a="sendbatch" data-from="'+i+'">Email app ('+(i+1)+'–'+Math.min(i+40,list.length)+')</button>'}return out}
function aProd(){var c=A.pNew||{cat:"furnace",brand:"",model:"",name:"",tag:"",specs:"",feats:"",imgUrl:""};A.pNew=c;
  return '<h3>Products</h3><p class="sub">Add a product (e.g. a new brand) and it appears in your product slider and search.</p><div class="card"><h4>Add a product</h4><div class="fgrid" id="pf"><label class="fl">Category<select name="cat">'+Object.keys(CATS).map(function(k){return '<option value="'+k+'"'+(k===c.cat?' selected':'')+'>'+CATS[k].name+'</option>'}).join("")+'</select></label><label class="fl">Brand<input name="brand" value="'+esc(c.brand)+'" placeholder="e.g. Daikin"></label><label class="fl">Model<input name="model" value="'+esc(c.model)+'" placeholder="e.g. DM96VC"></label><label class="fl">Product name<input name="name" value="'+esc(c.name)+'" placeholder="e.g. Daikin DM96VC Gas Furnace"></label><label class="fl full">Short tagline<input name="tag" value="'+esc(c.tag)+'"></label>'+
  '<label class="fl full">Specs — one per line as “Label: Value”<textarea name="specs" placeholder="Efficiency (AFUE): Up to 96%\nHeating: Two-stage\nWarranty: 10-year parts">'+esc(c.specs)+'</textarea></label><label class="fl full">Features — one per line<textarea name="feats">'+esc(c.feats)+'</textarea></label><label class="fl full">Photo (PNG/JPG, transparent background looks best)<input type="file" accept="image/*" id="pImg"></label>'+(c.imgUrl?'<img src="'+esc(c.imgUrl)+'" alt="" style="max-height:120px">':'')+'</div><button class="btn" data-a="saveprod" style="margin-top:12px">Add product</button></div>'+
  '<div class="card"><h4>Your added products</h4>'+(CUSTOM.length?'<table class="tbl"><tbody>'+CUSTOM.map(function(p){return '<tr><td>'+esc(CATS[p.cat]?CATS[p.cat].name:p.cat)+'</td><td><b>'+esc(p.name)+'</b></td><td><button class="btn r sm" data-a="delprod" data-id="'+esc(p.id)+'">Remove</button></td></tr>'}).join("")+'</tbody></table>':'<div class="emp">None yet. Built-in products: '+PRODUCTS.length+'.</div>')+'</div>'}
function aTeam(){var ph=(SITE.teamPhotos||[]).slice();while(ph.length<3)ph.push({});var caps=["Installation crew","On every service call","The Jora team"];
  return '<h3>Team photos</h3><p class="sub">Upload up to 3 photos of your team in uniform. They replace the illustrations on the front page.</p><div class="slot">'+ph.slice(0,3).map(function(p,i){return '<div class="card"><div class="thumb">'+(p.url?'<img src="'+esc(p.url)+'" alt="">':scene(i))+'</div><label class="fl">Caption<input data-tcap="'+i+'" value="'+esc(p.caption||caps[i])+'"></label><label class="fl">Photo<input type="file" accept="image/*" data-tfile="'+i+'"></label>'+(p.url?'<button class="btn g sm" data-a="tremove" data-i="'+i+'">Remove photo</button>':'')+'</div>'}).join("")+'</div><button class="btn" data-a="savecaps">Save captions</button>'}
function aSet(){var s=SITE;return '<h3>Settings</h3><p class="sub">Shown on quotations and used for website requests.</p><div class="card"><div class="fgrid" id="sf"><label class="fl">Business phone<input name="phone" value="'+esc(s.phone||JORA.phone)+'"></label><label class="fl">Email for requests &amp; quotes<input name="notifyEmail" value="'+esc(s.notifyEmail||JORA.notifyEmail)+'"></label><label class="fl">HST / GST number<input name="hst" value="'+esc(s.hst||"")+'"></label><label class="fl full">Default quote terms<textarea name="terms">'+esc(s.terms||"")+'</textarea></label></div><button class="btn" data-a="saveset" style="margin-top:12px">Save settings</button></div><div class="card"><h4>Preview the weather theme</h4><p class="sub" style="margin:0 0 10px">Your site follows each visitor\'s local weather automatically. Use these to see how it looks — only on your screen.</p><div style="display:flex;gap:8px;flex-wrap:wrap">'+[["live","Live weather"],["sun","Sunny"],["hot","Heat wave"],["cloud","Cloudy"],["rain","Rain"],["storm","Storm"],["snow","Snow"],["night","Night"]].map(function(x){return '<button class="btn g sm" data-a="wxprev" data-k="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</div></div>'}
async function savePub(patch){var ref=CAP.db.doc("pub/site"),cur=await ref.get();await ref.set(Object.assign({},cur.exists?cur.data():{},patch))}
function readForm(sel){var o={};$$(sel+" [name]").forEach(function(i){o[i.name]=i.type==="checkbox"?i.checked:i.value.trim()});return o}
function syncQuote(){var q=A.qEdit;if(!q)return;$$("#admMain [data-qk]").forEach(function(i){var k=i.dataset.qk,v=i.value;if(k.indexOf("customer.")===0)q.customer[k.slice(9)]=v;else q[k]=(k==="discount"||k==="valid")?(+v||0):v});
  $$("#admMain [data-li]").forEach(function(i){var it=q.items[+i.dataset.li];if(it)it[i.dataset.f]=i.dataset.f==="d"?i.value:(+i.value||0)})}
function refreshTotals(){syncQuote();var t=qTotals(A.qEdit),box=$("#qtots");if(!box)return;var b=box.querySelectorAll("b");b[0].textContent=money(t.sub);b[1].textContent="-"+money(t.disc);var rows=box.querySelectorAll("div");t.tax.forEach(function(x,k){var r=rows[2+k];if(r)r.lastChild.textContent=money(x[1])});box.querySelector(".gt span:last-child").textContent=money(t.total);
  $$("#admMain .li").forEach(function(row,i){if(i===0)return;var it=A.qEdit.items[i-1],tt=row.querySelector(".tot");if(it&&tt)tt.textContent=money((+it.q||0)*(+it.p||0))})}
async function gmail(input){if(!CAP.mcp){try{CAP.mcp=await JRT.use("mcp")}catch(e){}}if(!CAP.mcp){toast("Gmail isn't available here — use the email app button");return false}try{await CAP.mcp.callTool("Gmail","send_message",input);return true}catch(e){toast("Gmail: "+(e&&(e.message||e.code)||"failed"));return false}}
async function save(fn,ok){try{await fn();ok&&toast(ok)}catch(e){toast("Couldn't save: "+(e&&e.message||e&&e.code||"error"))}}
async function dl(name,data,type){if(!CAP.dl){try{CAP.dl=await JRT.use("downloads")}catch(e){}}if(!CAP.dl){toast("Downloads aren't available here");return}try{await CAP.dl.save({filename:name,data:new Blob([data],{type:type})})}catch(e){if(e&&e.code!=="declined")toast("Download failed: "+(e.message||e.code))}}

$("#admMain").addEventListener("input",function(e){var t=e.target;if(t.id==="cq"){A.cq=t.value;var pos=t.selectionStart;$("#admMain").innerHTML=aCust();var n=$("#cq");n.focus();n.setSelectionRange(pos,pos);return}
  if(A.qEdit&&(t.dataset.li!==undefined||t.dataset.qk)){refreshTotals();return}
  if(t.dataset.aud!==undefined){A.aud[t.dataset.aud]=t.type==="checkbox"?t.checked:t.value;A.mSub=$("#mSub").value;A.mBody=$("#mBody").value;var list=mailList();var p=t.closest(".card").querySelector("p b");p.textContent=list.length;$$("#mBtns [data-a=sendbatch],#mBtns [data-a=gmailbatch],#mBtns [disabled]").forEach(function(b){b.remove()});$("#mBtns").insertAdjacentHTML("afterbegin",mailBatches(list));return}
  if(t.id==="mSub")A.mSub=t.value;if(t.id==="mBody")A.mBody=t.value;
  if(t.closest("#pf")&&t.name)A.pNew[t.name]=t.value});
$("#admMain").addEventListener("change",async function(e){var t=e.target;
  if(t.dataset.aud!==undefined){t.dispatchEvent(new Event("input",{bubbles:true}));return}
  if(t.dataset.rstatus){var id=t.dataset.rstatus,v=t.value;save(function(){return CAP.db.collection("requests").doc(id).update({status:v})},"Status updated");return}
  if(t.dataset.qk==="province"||t.dataset.qk==="status"){syncQuote();$("#admMain").innerHTML=quoteForm(A.qEdit);return}
  if(t.hasAttribute("data-qcust")){syncQuote();var c=A.cust.find(function(x){return x._id===t.value});if(c){A.qEdit.customerId=c._id;A.qEdit.customer={name:c.name,email:c.email,phone:c.phone,address:[c.street,c.unit,c.city,c.province,c.postal].filter(Boolean).join(", ")};if(c.province==="QC")A.qEdit.province="QC"}$("#admMain").innerHTML=quoteForm(A.qEdit);return}
  if(t.id==="pImg"&&t.files[0]){var url=await upload(t.files[0]);if(url){A.pNew.imgUrl=url;$("#admMain").innerHTML=aProd()}return}
  if(t.dataset.tfile!==undefined&&t.files[0]){var i=+t.dataset.tfile,u=await upload(t.files[0]);if(u){var ph=(SITE.teamPhotos||[]).slice();while(ph.length<3)ph.push({});ph[i]={url:u,caption:(ph[i]&&ph[i].caption)||""};save(function(){return savePub({teamPhotos:ph})},"Photo saved")}}});
async function upload(file){if(!CAP.assets){try{CAP.assets=await JRT.use("assets")}catch(e){}}if(!CAP.assets){toast("Uploads need editor access");return null}toast("Uploading…");try{var r=await CAP.assets.upload(file);toast("Uploaded");return r.url}catch(e){toast("Upload failed: "+(e.message||e.code));return null}}
$("#admMain").addEventListener("click",async function(e){var b=e.target.closest("[data-a],[data-rq],[data-qe],[data-tab]");if(!b)return;
  if(b.dataset.tab){A.qEdit=null;A.cEdit=null;A.rView=null;setTab(b.dataset.tab);return}
  if(b.dataset.rq){A.tab="req";A.rView=b.dataset.rq;renderA();return}
  if(b.dataset.qe){var q=A.quotes.find(function(x){return x._id===b.dataset.qe});A.qEdit=JSON.parse(JSON.stringify(q));A.tab="quote";renderA();return}
  var a=b.dataset.a,id=b.dataset.id;
  if(a==="back"){A.qEdit=null;A.cEdit=null;A.rView=null;renderA();return}
  if(a==="newquote"){A.tab="quote";A.qEdit=newQuote(null);renderA();return}
  if(a==="newcust"){A.tab="cust";A.cEdit={province:"ON"};renderA();return}
  if(a==="editcust"){A.cEdit=Object.assign({},A.cust.find(function(c){return c._id===id}));renderA();return}
  if(a==="quotefor"){var c=A.cust.find(function(x){return x._id===id});A.tab="quote";A.qEdit=newQuote(c);renderA();return}
  if(a==="quotefromreq"){var r=A.req.find(function(x){return x._id===id}),cc=r.contact||{},cust=A.cust.find(function(x){return x.email===(cc.email||"").toLowerCase()})||{_id:"",name:(cc.firstName+" "+cc.lastName).trim(),email:cc.email,phone:cc.phone,street:cc.street,unit:cc.unit,city:cc.city,province:cc.province,postal:cc.postal};
    A.tab="quote";A.qEdit=newQuote(cust,{d:(r.answers&&r.answers.model?r.answers.model+" — supply":r.serviceName+" — supply"),q:1,p:0});A.qEdit.items.push({d:"Labour — installation & start-up",q:1,p:0});A.qEdit.requestId=r._id;renderA();return}
  if(a==="savecust"){var f=readForm("#cf");if(!f.name){toast("Name is required");return}f.email=(f.email||"").toLowerCase();var cid=A.cEdit._id||(f.email?custId(f.email):"c_"+Date.now());var base=Object.assign({},A.cEdit);delete base._id;
    save(async function(){await CAP.db.collection("customers").doc(cid).set(Object.assign(base,f,{services:base.services||[],createdAt:base.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()}));A.cEdit=null;renderA()},"Customer saved");return}
  if(a==="delcust"){if(!confirm("Delete this customer?"))return;save(async function(){await CAP.db.collection("customers").doc(id).delete();A.cEdit=null;renderA()},"Customer deleted");return}
  if(a==="delreq"){if(!confirm("Delete this request?"))return;save(async function(){await CAP.db.collection("requests").doc(id).delete();A.rView=null;renderA()},"Request deleted");return}
  if(a==="addli"){syncQuote();A.qEdit.items.push({d:"",q:1,p:0});$("#admMain").innerHTML=quoteForm(A.qEdit);return}
  if(a==="delli"){syncQuote();A.qEdit.items.splice(+b.dataset.i,1);if(!A.qEdit.items.length)A.qEdit.items.push({d:"",q:1,p:0});$("#admMain").innerHTML=quoteForm(A.qEdit);return}
  if(a==="savequote"){syncQuote();var qq=JSON.parse(JSON.stringify(A.qEdit)),qid=qq._id||("q_"+qq.number.replace(/[^A-Za-z0-9-]/g,"")+"_"+Date.now().toString(36));delete qq._id;qq.updatedAt=new Date().toISOString();
    save(async function(){await CAP.db.collection("quotes").doc(qid).set(qq);A.qEdit._id=qid;if(qq.requestId){var rr=A.req.find(function(x){return x._id===qq.requestId});if(rr&&rr.status==="new")await CAP.db.collection("requests").doc(qq.requestId).update({status:"quoted"})}},"Quotation saved");return}
  if(a==="delquote"){if(!confirm("Delete this quotation?"))return;save(async function(){await CAP.db.collection("quotes").doc(A.qEdit._id).delete();A.qEdit=null;renderA()},"Quotation deleted");return}
  if(a==="dlquote"){syncQuote();dl(A.qEdit.number+".html",quoteDoc(A.qEdit),"text/html");return}
  if(a==="printquote"){syncQuote();var w=window.open("","_blank");if(w){w.document.write(quoteDoc(A.qEdit));w.document.close();setTimeout(function(){try{w.print()}catch(x){}},400)}else{$("#printArea").innerHTML=quoteDoc(A.qEdit).replace(/^[\s\S]*<body>|<\/body>[\s\S]*$/g,"");document.body.classList.add("printing");window.print();document.body.classList.remove("printing")}return}
  if(a==="mailquote"){syncQuote();var qe=A.qEdit;if(!qe.customer.email){toast("Add the client's email first");return}var link=document.createElement("a");link.href="mailto:"+encodeURIComponent(qe.customer.email)+"?subject="+encodeURIComponent("Your quotation "+qe.number+" — "+JORA.company)+"&body="+encodeURIComponent(quoteText(qe));link.target="_blank";link.click();
    if(qe._id&&qe.status==="draft"){qe.status="sent";save(function(){return CAP.db.collection("quotes").doc(qe._id).update({status:"sent"})},"Marked as sent")}return}
  if(a==="gmailquote"){syncQuote();var gq=A.qEdit;if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(gq.customer.email||"")){toast("Add the client's email first");return}if(!confirm("Send quotation "+gq.number+" to "+gq.customer.email+" from your Gmail?"))return;b.disabled=true;
    var html=quoteDoc(gq).replace(/^[\s\S]*<body>|<\/body>[\s\S]*$/g,"");var okg=await gmail({to:[gq.customer.email],subject:"Your quotation "+gq.number+" — "+JORA.company,body:quoteText(gq),htmlBody:'<div style="font:14px Arial,sans-serif;color:#222">'+html+'</div>'});b.disabled=false;
    if(okg){toast("Quotation sent to "+gq.customer.email);if(gq._id&&gq.status==="draft"){gq.status="sent";save(function(){return CAP.db.collection("quotes").doc(gq._id).update({status:"sent"})})}}return}
  if(a==="gmailbatch"){var gl=mailList(),gf=+b.dataset.from,gc=gl.slice(gf,gf+40),gs=$("#mSub").value,gb=$("#mBody").value;if(!gs.trim()||!gb.trim()){toast("Add a subject and message");return}if(!confirm("Send “"+gs+"” to "+gc.length+" customer(s) from your Gmail?"))return;b.disabled=true;
    var okb=await gmail({to:[SITE.notifyEmail||JORA.notifyEmail],bcc:gc.map(function(c){return c.email}),subject:gs,body:gb});b.disabled=false;
    if(okb){toast("Sent to "+gc.length+" customer(s)");save(function(){return CAP.db.collection("campaigns").add({at:new Date().toISOString(),subject:gs,count:gc.length,via:"gmail"})})}return}
  if(a==="sendbatch"){var list=mailList(),from=+b.dataset.from,chunk=list.slice(from,from+40),sub=$("#mSub").value,body=$("#mBody").value;var lk=document.createElement("a");lk.href="mailto:"+encodeURIComponent(SITE.notifyEmail||JORA.notifyEmail)+"?bcc="+encodeURIComponent(chunk.map(function(c){return c.email}).join(","))+"&subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(body);lk.target="_blank";lk.click();
    save(function(){return CAP.db.collection("campaigns").add({at:new Date().toISOString(),subject:sub,count:chunk.length})});return}
  if(a==="copymails"){var em=mailList().map(function(c){return c.email}).join(", ");try{await navigator.clipboard.writeText(em);toast("Copied "+mailList().length+" addresses")}catch(x){prompt("Copy these addresses:",em)}return}
  if(a==="csv"){var rows=[["Name","Email","Phone","City","Province","Postal","Agreed to emails","Services"]].concat(mailList().map(function(c){return [c.name,c.email,c.phone,c.city,c.province,c.postal,c.okNews?"yes":"no",(c.services||[]).join("; ")]}));dl("jora-customers.csv",rows.map(function(r){return r.map(function(v){return '"'+String(v||"").replace(/"/g,'""')+'"'}).join(",")}).join("\n"),"text/csv");return}
  if(a==="saveprod"){var p=readForm("#pf");if(!p.brand||!p.name){toast("Brand and product name are required");return}var specs=(p.specs||"").split("\n").map(function(l){var i=l.indexOf(":");return i>0?[l.slice(0,i).trim(),l.slice(i+1).trim()]:null}).filter(Boolean),feats=(p.feats||"").split("\n").map(function(s){return s.trim()}).filter(Boolean);
    var doc={cat:p.cat,brand:p.brand,model:p.model||"",name:p.name,tag:p.tag||"",specs:specs,feats:feats,feats3:specs.slice(0,3).map(function(s){return s[1]}),imgUrl:A.pNew.imgUrl||"",createdAt:new Date().toISOString()};
    save(async function(){await CAP.db.collection("pub/site/products").add(doc);A.pNew=null;renderA()},"Product added");return}
  if(a==="delprod"){if(!confirm("Remove this product?"))return;save(function(){return CAP.db.collection("pub/site/products").doc(id).delete()},"Product removed");return}
  if(a==="tremove"){var ph=(SITE.teamPhotos||[]).slice();ph[+b.dataset.i]={};save(function(){return savePub({teamPhotos:ph})},"Photo removed");return}
  if(a==="savecaps"){var ph2=(SITE.teamPhotos||[]).slice();while(ph2.length<3)ph2.push({});$$("[data-tcap]").forEach(function(i){ph2[+i.dataset.tcap]=Object.assign({},ph2[+i.dataset.tcap],{caption:i.value})});save(function(){return savePub({teamPhotos:ph2})},"Captions saved");return}
  if(a==="wxprev"){var k=b.dataset.k;WXFORCE=k==="live"?null:k;wxApply();closeO($("#admin"));toast(k==="live"?"Showing live weather":"Previewing: "+b.textContent);return}
  if(a==="saveset"){var s=readForm("#sf");save(function(){return savePub(s)},"Settings saved");return}
});
})();
