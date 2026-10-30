/* Jora data layer — Firebase (Auth + Firestore, compat SDK) or a demo copy saved in this browser.
   Both expose the same small API, so the admin, account and quote pages run the same code either way. */
(function(){
"use strict";
var CFG=window.JORA_CONFIG||{};
var DEMO=!(CFG.firebase&&CFG.firebase.projectId&&window.firebase);
var OWNER=(CFG.ownerEmail||"info@joramechanicalsystems.com").toLowerCase(),OWNERH=CFG.ownerHashes||[];
function sha(t){try{return crypto.subtle.digest("SHA-256",new TextEncoder().encode(t)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")})}catch(e){return Promise.resolve("")}}

/* ---------- small helpers shared by every page ---------- */
function rid(n){var a="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789",s="",r=new Uint8Array(n||20);crypto.getRandomValues(r);for(var i=0;i<r.length;i++)s+=a[r[i]%a.length];return s}
function now(){return new Date().toISOString()}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function money(n){return "$"+(Math.round((+n||0)*100)/100).toLocaleString("en-CA",{minimumFractionDigits:2,maximumFractionDigits:2})}
/* tax by region: GTA = Ontario HST 13%; Saskatchewan = GST 5% + PST 6% */
function quoteTotals(q){var sub=(q.items||[]).reduce(function(a,i){return a+(+i.qty||0)*(+i.price||0)},0),disc=Math.min(sub,+q.discount||0),net=Math.max(0,sub-disc),tax=[];
  if(q.taxMode==="none"){}else if(q.region==="sk"){tax.push(["GST 5%",net*.05],["PST 6%",net*.06])}else{tax.push(["HST 13%",net*.13])}
  var total=net+tax.reduce(function(a,x){return a+x[1]},0),dep=q.depositPct?total*(+q.depositPct)/100:0;
  return {sub:sub,disc:disc,net:net,tax:tax,total:total,deposit:dep}}
/* shrink a photo in the browser before saving it (keeps the free database plan small) */
function shrinkImage(file,max,q){return new Promise(function(res,rej){var r=new FileReader();r.onerror=rej;r.onload=function(){var im=new Image();im.onerror=rej;im.onload=function(){var s=Math.min(1,(max||900)/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);var x=c.getContext("2d");x.drawImage(im,0,0,c.width,c.height);var d=c.toDataURL("image/webp",q||.82);if(d.indexOf("data:image/webp")!==0)d=c.toDataURL("image/jpeg",q||.82);res(d)};im.src=r.result};r.readAsDataURL(file)})}
/* email to the office through Web3Forms (free); quietly does nothing until a key is set */
function notifyOffice(subject,fields){if(!CFG.web3formsKey)return Promise.resolve(false);
  var body=Object.assign({access_key:CFG.web3formsKey,subject:subject,from_name:"Jora Mechanical website"},fields||{});
  return fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(body)}).then(function(r){return r.ok}).catch(function(){return false})}
/* send an email straight to a customer through EmailJS (optional) */
function emailCustomer(p){var E=CFG.emailjs;if(!E||!E.serviceId||!E.templateId||!E.publicKey)return Promise.reject(new Error("Direct email isn't set up yet"));
  return fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:E.serviceId,template_id:E.templateId,user_id:E.publicKey,template_params:p})}).then(function(r){if(!r.ok)return r.text().then(function(t){throw new Error(t||"Email failed")});return true})}

/* ======================= DEMO DATABASE (localStorage) ======================= */
var KEY="jora_demo_db",subs=[];
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){alert("This browser's storage is full. Remove some photos or old records.");throw e}fire()}
function fire(){subs.slice().forEach(function(s){try{s()}catch(e){}})}
addEventListener("storage",function(e){if(e.key===KEY)fire()});
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o))}
function getPath(o,p){return p.split(".").reduce(function(a,k){return a==null?a:a[k]},o)}
function DSnap(id,data){return {id:id,exists:data!==undefined,data:function(){return clone(data)}}}
function DQSnap(list){return {docs:list,size:list.length,empty:!list.length,forEach:function(f){list.forEach(f)}}}
function DDoc(col,id){this.col=col;this.id=id}
DDoc.prototype.get=function(){var d=load(),c=d[this.col]||{};return Promise.resolve(DSnap(this.id,c[this.id]))};
DDoc.prototype.set=function(data,opt){var d=load(),c=d[this.col]=d[this.col]||{};c[this.id]=opt&&opt.merge?Object.assign({},c[this.id]||{},clone(data)):clone(data);save(d);return Promise.resolve()};
DDoc.prototype.update=function(data){var d=load(),c=d[this.col]||{};if(!c[this.id])return Promise.reject(new Error("Not found"));c[this.id]=Object.assign({},c[this.id],clone(data));save(d);return Promise.resolve()};
DDoc.prototype.delete=function(){var d=load();if(d[this.col])delete d[this.col][this.id];save(d);return Promise.resolve()};
DDoc.prototype.onSnapshot=function(cb){var me=this,f=function(){me.get().then(cb)};subs.push(f);f();return function(){subs.splice(subs.indexOf(f),1)}};
function DCol(name,q){this.name=name;this.q=q||{w:[],o:null,l:0}}
DCol.prototype.doc=function(id){return new DDoc(this.name,id||rid(20))};
DCol.prototype.add=function(data){var r=this.doc();return r.set(data).then(function(){return r})};
DCol.prototype.where=function(f,op,v){return new DCol(this.name,{w:this.q.w.concat([[f,op,v]]),o:this.q.o,l:this.q.l})};
DCol.prototype.orderBy=function(f,dir){return new DCol(this.name,{w:this.q.w,o:[f,dir||"asc"],l:this.q.l})};
DCol.prototype.limit=function(n){return new DCol(this.name,{w:this.q.w,o:this.q.o,l:n})};
DCol.prototype.get=function(){var c=load()[this.name]||{},q=this.q;
  var list=Object.keys(c).map(function(id){return [id,c[id]]}).filter(function(x){return q.w.every(function(w){var v=getPath(x[1],w[0]);return w[1]==="=="?v===w[2]:w[1]==="in"?w[2].indexOf(v)>-1:w[1]===">="?v>=w[2]:w[1]==="<="?v<=w[2]:w[1]==="array-contains"?(v||[]).indexOf(w[2])>-1:true})});
  if(q.o)list.sort(function(a,b){var x=getPath(a[1],q.o[0]),y=getPath(b[1],q.o[0]);x=x==null?"":x;y=y==null?"":y;return (x<y?-1:x>y?1:0)*(q.o[1]==="desc"?-1:1)});
  if(q.l)list=list.slice(0,q.l);
  return Promise.resolve(DQSnap(list.map(function(x){return DSnap(x[0],x[1])})))};
DCol.prototype.onSnapshot=function(cb){var me=this,f=function(){me.get().then(cb)};subs.push(f);f();return function(){subs.splice(subs.indexOf(f),1)}};
var demoDB={collection:function(n){return new DCol(n)}};

/* demo sign-in: accounts live in this browser only (passwords are kept as a SHA-256 hash) */
var AKEY="jora_demo_auth",authSubs=[],demoUser=null;
function sha(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(function(b){return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,"0")}).join("")})}
function accts(){try{return JSON.parse(localStorage.getItem(AKEY)||"{}")}catch(e){return {}}}
function mkUser(a){return a?{uid:a.uid,email:a.email,displayName:a.name||"",emailVerified:true,demo:true,
  updateProfile:function(p){var A=accts();if(A[a.email]){A[a.email].name=p.displayName;localStorage.setItem(AKEY,JSON.stringify(A))}this.displayName=p.displayName;return Promise.resolve()},
  sendEmailVerification:function(){return Promise.resolve()},reload:function(){return Promise.resolve()}}:null}
function setDemoUser(a){demoUser=mkUser(a);try{sessionStorage.setItem("jora_demo_session",a?a.email:"")}catch(e){}authSubs.forEach(function(f){f(demoUser)})}
(function(){try{var e=sessionStorage.getItem("jora_demo_session");if(e){var a=accts()[e];if(a)demoUser=mkUser(a)}}catch(e){}})();
function aerr(code,msg){var e=new Error(msg);e.code=code;return e}
var demoAuth={
  get currentUser(){return demoUser},
  onAuthStateChanged:function(f){authSubs.push(f);setTimeout(function(){f(demoUser)},0);return function(){authSubs.splice(authSubs.indexOf(f),1)}},
  signInWithEmailAndPassword:function(email,pw){email=String(email||"").trim().toLowerCase();var a=accts()[email];if(!a)return Promise.reject(aerr("auth/user-not-found","No account with that email."));
    return sha(pw).then(function(h){if(h!==a.pw)throw aerr("auth/wrong-password","Wrong password.");setDemoUser(a);return {user:demoUser}})},
  createUserWithEmailAndPassword:function(email,pw){email=String(email||"").trim().toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return Promise.reject(aerr("auth/invalid-email","Enter a valid email."));
    if((pw||"").length<6)return Promise.reject(aerr("auth/weak-password","Password needs at least 6 characters."));var A=accts();if(A[email])return Promise.reject(aerr("auth/email-already-in-use","There's already an account with that email."));
    return sha(pw).then(function(h){A[email]={uid:rid(28),email:email,pw:h,name:""};localStorage.setItem(AKEY,JSON.stringify(A));setDemoUser(A[email]);return {user:demoUser}})},
  signOut:function(){setDemoUser(null);return Promise.resolve()},
  sendPasswordResetEmail:function(){return Promise.resolve()}
};
/* one-click demo owner (only exists in demo mode) */
function demoOwnerSignIn(){var A=accts(),a=A[OWNER];if(!a){a=A[OWNER]={uid:"demo-owner",email:OWNER,pw:"-",name:"Jora Office"};localStorage.setItem(AKEY,JSON.stringify(A))}setDemoUser(a);return Promise.resolve({user:demoUser})}

/* ======================= FIREBASE ======================= */
var fbDB=null,fbAuth=null;
if(!DEMO){try{firebase.initializeApp(CFG.firebase);fbAuth=firebase.auth();fbDB=firebase.firestore()}catch(e){console.error(e);DEMO=true}}

/* ======================= ROLES ======================= */
/* owner = the office account (info@); team members are invited by email in Admin > Team */
var ROLES={owner:"Owner",admin:"Admin",staff:"Staff",partner:"Partner",customer:"Customer"};
function roleFor(user){if(!user)return Promise.resolve("none");var em=(user.email||"").toLowerCase();
  if(em===OWNER)return Promise.resolve("owner");
  return sha(em).then(function(hx){if(OWNERH.indexOf(hx)>-1)return "owner";return JDB.db.collection("team").doc(em).get().then(function(s){return s.exists&&s.data().role&&!s.data().disabled?s.data().role:"customer"}).catch(function(){return "customer"})})}
function can(role,what){var R={
  view:["owner","admin","staff","partner"],           // see the office panel
  work:["owner","admin","staff"],                     // requests, quotes, customers
  jobs:["owner","admin","staff","partner"],           // schedule and update jobs
  site:["owner","admin"],                             // products, hero, colours, weather
  team:["owner","admin"]};return (R[what]||[]).indexOf(role)>-1}

/* ======================= QUOTE DOCUMENT ======================= */
var DEFAULT_TERMS="Prices include equipment, labour and standard materials as listed. Permits and inspections are included where noted. Any extra work found on site is quoted in writing before we start. Manufacturer warranty applies; registration is done by Jora. Quote valid until the date shown.";
function quoteHTML(q,opt){opt=opt||{};var t=quoteTotals(q),c=q.customer||{},reg=q.region==="sk"?"Saskatchewan":"GTA, Ontario";
  function d(s){if(!s)return "";var x=new Date(String(s).length<=10?s+"T12:00:00":s);return isNaN(x)?esc(s):x.toLocaleDateString("en-CA",{year:"numeric",month:"long",day:"numeric"})}
  return '<div class="qdoc"><div class="qd-h"><div class="qd-co"><img src="'+esc(opt.logo||"../assets/logo.png")+'" alt=""><div><b>Jora Mechanical Systems</b><small>Heating · Cooling · Hot water · '+esc(reg)+'</small><small>905-667-2823 · info@joramechanicalsystems.com</small></div></div>'+
   '<div class="qd-no"><h2>Quotation</h2><div><b>'+esc(q.number||"Draft")+'</b></div><div>Date: '+d(q.sentAt||q.createdAt||new Date().toISOString())+'</div>'+(q.validUntil?'<div>Valid until: '+d(q.validUntil)+'</div>':'')+(opt.status&&q.status?'<span class="pill qd-st '+esc(q.status)+'">'+esc(q.status)+'</span>':'')+'</div></div>'+
   '<div class="qd-to"><div><h4>Prepared for</h4><b>'+esc(c.name||"—")+'</b><br>'+[c.address,[c.city,c.postal].filter(Boolean).join(" ")].filter(Boolean).map(esc).join("<br>")+(c.phone?'<br>'+esc(c.phone):'')+(c.email?'<br>'+esc(c.email):'')+'</div>'+
   '<div><h4>Project</h4><b>'+esc(q.title||"Heating & cooling work")+'</b>'+(q.site?'<br>'+esc(q.site):'')+'</div></div>'+
   '<table class="qd-t"><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr></thead><tbody>'+
   ((q.items||[]).length?(q.items||[]).map(function(i){return '<tr><td>'+esc(i.desc).replace(/\n/g,"<br>")+'</td><td class="r">'+esc(i.qty)+'</td><td class="r">'+money(i.price)+'</td><td class="r">'+money((+i.qty||0)*(+i.price||0))+'</td></tr>'}).join(""):'<tr><td colspan="4" style="color:#999">No items yet</td></tr>')+'</tbody></table>'+
   '<div class="qd-sum"><div><span>Subtotal</span><span>'+money(t.sub)+'</span></div>'+(t.disc?'<div><span>Discount</span><span>−'+money(t.disc)+'</span></div>':'')+t.tax.map(function(x){return '<div><span>'+x[0]+'</span><span>'+money(x[1])+'</span></div>'}).join("")+
   '<div class="g"><span>Total (CAD)</span><span>'+money(t.total)+'</span></div>'+(t.deposit?'<div class="dep"><span>Deposit to book ('+esc(q.depositPct)+'%)</span><span>'+money(t.deposit)+'</span></div>':'')+'</div>'+
   (q.notes?'<div class="qd-n"><h4>Notes</h4>'+esc(q.notes)+'</div>':'')+'<div class="qd-n"><h4>Terms</h4>'+esc(q.terms||DEFAULT_TERMS)+'</div>'+
   '<div class="qd-f">Thank you for choosing Jora Mechanical Systems · Licensed &amp; insured · 24/7 emergency service 905-667-2823</div></div>'}

var JDB=window.JDB={demo:DEMO,quoteHTML:quoteHTML,DEFAULT_TERMS:DEFAULT_TERMS,owner:OWNER,cfg:CFG,
  db:DEMO?demoDB:fbDB,auth:DEMO?demoAuth:fbAuth,
  demoOwnerSignIn:demoOwnerSignIn,roleFor:roleFor,can:can,ROLES:ROLES,
  rid:rid,now:now,esc:esc,money:money,quoteTotals:quoteTotals,shrinkImage:shrinkImage,notifyOffice:notifyOffice,emailCustomer:emailCustomer,
  resetDemo:function(){localStorage.removeItem(KEY);localStorage.removeItem(AKEY);sessionStorage.removeItem("jora_demo_session");fire()},
  friendlyError:function(e){var c=(e&&e.code)||"",m={"auth/invalid-credential":"Email or password is wrong. First time here? Press “First time? Create your login” below. Forgot it? Press “Forgot password?”.","auth/invalid-login-credentials":"Email or password is wrong. First time here? Press “First time? Create your login” below. Forgot it? Press “Forgot password?”.","auth/wrong-password":"Email or password is wrong. Forgot it? Press “Forgot password?” below.","auth/user-not-found":"No login with that email yet — press “First time? Create your login” below.","auth/operation-not-allowed":"Email sign-in is switched off for this site. In Firebase → Authentication → Sign-in method, turn on Email/Password.","auth/unauthorized-domain":"This web address isn't allowed to sign in yet. In Firebase → Authentication → Settings → Authorized domains, add this website’s address.","auth/user-disabled":"This login has been turned off by the office.","auth/missing-password":"Type your password.",
    "auth/email-already-in-use":"There's already an account with that email — sign in instead.","auth/weak-password":"Password needs at least 6 characters.","auth/invalid-email":"Enter a valid email address.",
    "auth/too-many-requests":"Too many tries. Wait a minute and try again.","auth/network-request-failed":"No internet connection.","permission-denied":"You don't have permission to do that."};
    return m[c]||((e&&e.message)||"Something went wrong.")+(c?" ("+c+")":"")}};
})();
