/* Jora Mechanical — customer account */
(function(){
"use strict";
var J=window.JDB,db=J.db,auth=J.auth,esc=J.esc,money=J.money,IDX=window.JORA_IDX||"";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
var ROOT="../",LOGO=ROOT+"assets/logo.png";
var REGION=(/[?&]r=(gta|sk)/.exec(location.search)||[])[1]||(function(){try{return localStorage.getItem("jora_region")}catch(e){return null}})()||"gta";
var SITE={gta:ROOT+"gta/"+IDX,sk:ROOT+"saskatchewan/"+IDX};
var SV=[["furnace","Furnace"],["ac","Air conditioner"],["hp","Heat pump"],["tankless","Tankless water heater"],["water","Water heater"],["garage","Garage heater"],["boiler","Boiler / in-floor heat"],["duct","Ductwork"],["hrv","HRV / ERV"],["thermo","Thermostat"],["humid","Humidifier"],["repair","Repair — something's not working"],["maint","Maintenance / tune-up"],["commercial","Commercial"],["other","Something else"]];
var S={user:null,prof:null,tab:"new",reqs:[],quotes:[],unsub:[]};
function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove("on")},3200)}
function val(f,n){var el=f.elements[n];return el?(el.type==="checkbox"?el.checked:String(el.value).trim()):""}
function nice(s){var d=new Date(s);return isNaN(d)?"":d.toLocaleDateString("en-CA",{year:"numeric",month:"short",day:"numeric"})}
function refNo(){var d=new Date();return "W"+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+J.rid(4).toUpperCase()}
function head(){return (J.demo?'<div class="demo-bar"><b>Preview</b> — online accounts are being set up. Your details are kept in this browser only for now; please also call <a href="tel:+19056672823">905-667-2823</a>.</div>':'')+
  '<div class="chead"><a class="auth-logo" href="'+SITE[REGION]+'"><img src="'+LOGO+'" alt=""><span><b>Jora Mechanical</b><small>'+(REGION==="sk"?"Saskatchewan":"GTA, Ontario")+'</small></span></a><a class="btn g sm" href="'+SITE[REGION]+'">‹ Back to the website</a></div>'}

function authView(mode,msg){mode=mode||"in";document.body.innerHTML=head()+'<div class="auth" style="min-height:calc(100vh - 80px)"><div class="auth-box">'+
  '<h1>'+(mode==="up"?"Create your account":mode==="reset"?"Reset password":"Welcome back")+'</h1><p class="sub">'+(mode==="up"?"Book service, see your quotes and accept them online.":mode==="reset"?"We'll email you a link to choose a new password.":"Sign in to book service and see your quotes.")+'</p>'+
  (mode!=="reset"?'<div class="seg"><button type="button" data-m="in" class="'+(mode==="in"?"on":"")+'">Sign in</button><button type="button" data-m="up" class="'+(mode==="up"?"on":"")+'">Create account</button></div>':'')+
  '<div class="err" id="err"></div>'+(msg?'<div class="okmsg">'+msg+'</div>':'')+'<form id="af" novalidate>'+
  (mode==="up"?'<label class="f"><span>Full name</span><input class="inp" name="name" autocomplete="name" required></label><label class="f"><span>Phone</span><input class="inp" name="phone" type="tel" autocomplete="tel" required></label>':'')+
  '<label class="f"><span>Email</span><input class="inp" name="email" type="email" autocomplete="email" required></label>'+
  (mode!=="reset"?'<label class="f"><span>Password</span><input class="inp" name="pw" type="password" minlength="6" autocomplete="'+(mode==="up"?"new-password":"current-password")+'" required>'+(mode==="up"?'<small>At least 6 characters</small>':'')+'</label>':'')+
  (mode==="up"?'<label class="f"><span>Street address <small>(optional)</small></span><input class="inp" name="address" autocomplete="street-address"></label><div class="grid2"><label class="f"><span>City</span><input class="inp" name="city" autocomplete="address-level2"></label><label class="f"><span>Postal code</span><input class="inp" name="postal" autocomplete="postal-code"></label></div>'+
    '<label class="f" style="font-weight:400"><span><input type="checkbox" name="ok" required> I agree that Jora Mechanical Systems may contact me about my requests.</span></label>':'')+
  '<button class="btn" type="submit">'+(mode==="up"?"Create account":mode==="reset"?"Send reset link":"Sign in")+'</button></form>'+
  '<p style="margin:18px 0 0;text-align:center;font-size:14px">'+(mode==="in"?'<button class="lnk" data-m="reset">Forgot password?</button>':mode==="reset"?'<button class="lnk" data-m="in">‹ Back to sign in</button>':'')+'</p>'+
  '<p class="mut tiny" style="text-align:center;margin:18px 0 0">Prefer to talk? Call <a href="tel:+19056672823">905-667-2823</a> — 24/7.</p></div></div><div class="toast" id="toast"></div>';
  $$("[data-m]").forEach(function(b){b.onclick=function(){authView(b.dataset.m)}});
  $("#af").onsubmit=function(e){e.preventDefault();var f=e.target,er=$("#err"),b=f.querySelector("button[type=submit]"),em=val(f,"email"),pw=f.elements.pw?f.elements.pw.value:"";er.classList.remove("on");
    if(mode==="up"&&(!val(f,"name")||!val(f,"phone")||!val(f,"ok"))){er.textContent="Please fill in your name and phone, and tick the box.";er.classList.add("on");return}
    b.disabled=true;var p;
    if(mode==="in")p=auth.signInWithEmailAndPassword(em,pw);
    else if(mode==="reset")p=auth.sendPasswordResetEmail(em).then(function(){authView("in","If there's an account for that email, a reset link is on its way.")});
    else{var prof={name:val(f,"name"),phone:val(f,"phone"),email:em.toLowerCase(),address:val(f,"address"),city:val(f,"city"),postal:val(f,"postal").toUpperCase(),region:REGION,createdAt:J.now(),updatedAt:J.now()};
      p=auth.createUserWithEmailAndPassword(em,pw).then(function(c){S.pending=prof;return c.user.updateProfile({displayName:prof.name}).then(function(){return db.collection("users").doc(c.user.uid).set(prof)}).then(function(){
        J.notifyOffice("New customer account — "+prof.name,{name:prof.name,email:prof.email,phone:prof.phone,message:"A customer created an online account on the "+(REGION==="sk"?"Saskatchewan":"GTA")+" website.\n\nName: "+prof.name+"\nPhone: "+prof.phone+"\nEmail: "+prof.email+"\nAddress: "+[prof.address,prof.city,prof.postal].filter(Boolean).join(", ")});
        if(c.user.sendEmailVerification&&!J.demo)c.user.sendEmailVerification().catch(function(){});S.prof=prof;main()})})}
    p.catch(function(x){er.textContent=J.friendlyError(x);er.classList.add("on")}).finally(function(){b.disabled=false})}}

auth.onAuthStateChanged(function(u){S.unsub.forEach(function(f){f()});S.unsub=[];S.user=u;
  if(!u){try{localStorage.removeItem("jora_acct")}catch(e){}authView((/[?&]new=1/.test(location.search))?"up":"in");return}
  db.collection("users").doc(u.uid).get().then(function(s){S.prof=s.exists?s.data():(S.pending||{name:u.displayName||"",email:(u.email||"").toLowerCase(),region:REGION});main()}).catch(function(){S.prof={name:u.displayName||"",email:u.email};main()})});

function main(){var p=S.prof||{};try{localStorage.setItem("jora_acct",JSON.stringify({name:p.name||""}));localStorage.setItem("jora_region",REGION)}catch(e){}
  if(!S.unsub.length){
    S.unsub.push(db.collection("requests").where("uid","==",S.user.uid).onSnapshot(function(s){S.reqs=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())}).sort(function(a,b){return String(b.createdAt).localeCompare(String(a.createdAt))});soft()},function(){}));
    S.unsub.push(db.collection("quotes").where("customerEmail","==",(S.user.email||"").toLowerCase()).onSnapshot(function(s){S.quotes=s.docs.map(function(d){return Object.assign({_id:d.id},d.data())}).filter(function(q){return q.status!=="draft"}).sort(function(a,b){return String(b.sentAt||b.createdAt).localeCompare(String(a.sentAt||a.createdAt))});soft()},function(){}))}
  J.roleFor(S.user).then(function(r){S.staff=J.can(r,"view");soft()});draw()}
function soft(){var a=document.activeElement;if(a&&a.closest&&a.closest("form")&&(S.tab==="new"||S.tab==="prof"))return;if(S.tab==="new"||S.tab==="prof"){var f=$("form");if(f&&[].some.call(f.elements,function(x){return x.type!=="select-one"&&x.value&&x.defaultValue!==x.value}))return}draw()}
function draw(){var p=S.prof||{},first=(p.name||"").split(" ")[0];
  document.body.innerHTML=head()+'<div class="cwrap"><div class="top" style="display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:10px"><div><h1 style="font-size:clamp(28px,4vw,40px);text-transform:uppercase">Hi'+(first?", "+esc(first):"")+'</h1><p class="mut" style="margin:4px 0 0">'+esc(S.user.email)+'</p></div><div class="acts">'+(S.staff?'<a class="btn k sm" href="'+ROOT+'admin/'+IDX+'">Office panel</a>':'')+'<button class="btn g sm" id="so">Sign out</button></div></div>'+
  '<div class="tabs">'+[["new","Book service"],["reqs","My requests"+(S.reqs.length?" ("+S.reqs.length+")":"")],["quotes","My quotes"+(S.quotes.length?" ("+S.quotes.length+")":"")],["prof","My details"]].map(function(t){return '<button data-t="'+t[0]+'" class="'+(S.tab===t[0]?"on":"")+'">'+t[1]+'</button>'}).join("")+'</div>'+
  ({new:vNew,reqs:vReqs,quotes:vQuotes,prof:vProf}[S.tab])()+'</div><div class="toast" id="toast"></div>';
  $("#so").onclick=function(){auth.signOut()};$$("[data-t]").forEach(function(b){b.onclick=function(){S.tab=b.dataset.t;draw()}});
  var f=$("form");if(f)f.onsubmit=submit}
function vNew(){var p=S.prof||{};return '<form class="card" data-k="new"><h3>What do you need?</h3><div class="grid2"><label class="f"><span>Service</span><select class="inp" name="service">'+SV.map(function(s){return '<option value="'+s[0]+'">'+s[1]+'</option>'}).join("")+'</select></label>'+
  '<label class="f"><span>When suits you?</span><select class="inp" name="when"><option>As soon as possible</option><option>This week</option><option>Next week</option><option>Within a month</option><option>Just getting prices</option></select></label></div>'+
  '<label class="f"><span>Tell us a little more</span><textarea class="inp" name="details" placeholder="e.g. Furnace is 18 years old and making a loud noise. 2-storey detached home."></textarea></label>'+
  '<div class="grid2"><label class="f"><span>Address for the visit</span><input class="inp" name="address" value="'+esc(p.address||"")+'"></label><div class="grid2"><label class="f"><span>City</span><input class="inp" name="city" value="'+esc(p.city||"")+'"></label><label class="f"><span>Postal code</span><input class="inp" name="postal" value="'+esc(p.postal||"")+'"></label></div></div>'+
  '<div class="grid2"><label class="f"><span>Phone</span><input class="inp" name="phone" value="'+esc(p.phone||"")+'" required></label><label class="f"><span>Best time to call</span><select class="inp" name="pref"><option>Any time</option><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label></div>'+
  '<button class="btn">Send request</button><p class="mut tiny" style="margin:12px 0 0">No heat or a leak? Call <a href="tel:+19056672823">905-667-2823</a> now — we answer 24/7.</p></form>'}
function vReqs(){return '<div class="card"><h3>My requests</h3>'+(S.reqs.length?'<table class="tbl rsp"><thead><tr><th>Sent</th><th>Service</th><th>Status</th></tr></thead><tbody>'+S.reqs.map(function(r){return '<tr><td data-l="Sent">'+nice(r.createdAt)+'<br><small>'+esc(r.ref)+'</small></td><td data-l="Service">'+esc(r.serviceName||"")+'</td><td data-l="Status"><span class="pill '+esc(r.status||"new")+'">'+esc(({new:"received",contacted:"we called you",quoted:"quote sent",scheduled:"booked",won:"done",lost:"closed"})[r.status||"new"]||r.status)+'</span></td></tr>'}).join("")+'</tbody></table>':'<div class="emp">No requests yet. Use <b>Book service</b> to send one.</div>')+'</div>'}
function vQuotes(){return '<div class="card"><h3>My quotes</h3>'+(S.quotes.length?'<table class="tbl rsp"><thead><tr><th>Quote</th><th>Date</th><th>Status</th><th style="text-align:right">Total</th><th></th></tr></thead><tbody>'+S.quotes.map(function(q){return '<tr><td data-l="Quote"><b>'+esc(q.number)+'</b><br><small>'+esc(q.title||"")+'</small></td><td data-l="Date">'+nice(q.sentAt||q.createdAt)+'</td><td data-l="Status"><span class="pill '+esc(q.status)+'">'+esc(q.status==="sent"?"waiting for you":q.status)+'</span></td><td data-l="Total" style="text-align:right"><b>'+money(J.quoteTotals(q).total)+'</b></td><td><a class="btn sm" href="'+ROOT+'quote/'+IDX+'?id='+encodeURIComponent(q._id)+'">Open</a></td></tr>'}).join("")+'</tbody></table>':'<div class="emp">When we send you a quote, it shows up here. You can accept it online.</div>')+'</div>'}
function vProf(){var p=S.prof||{};return '<form class="card" data-k="prof"><h3>My details</h3><div class="grid2"><label class="f"><span>Full name</span><input class="inp" name="name" value="'+esc(p.name||"")+'" required></label><label class="f"><span>Phone</span><input class="inp" name="phone" value="'+esc(p.phone||"")+'"></label></div>'+
  '<label class="f"><span>Street address</span><input class="inp" name="address" value="'+esc(p.address||"")+'"></label><div class="grid2"><label class="f"><span>City</span><input class="inp" name="city" value="'+esc(p.city||"")+'"></label><label class="f"><span>Postal code</span><input class="inp" name="postal" value="'+esc(p.postal||"")+'"></label></div>'+
  '<button class="btn">Save</button> <button class="btn g" type="button" id="pwr">Change password</button></form>'}
function submit(e){e.preventDefault();var f=e.target,k=f.dataset.k,b=f.querySelector("button:not([type=button])");b.disabled=true;var p=S.prof||{};
  if(k==="new"){var sv=f.elements.service,name=(p.name||S.user.displayName||"").trim();
    var rec={ref:refNo(),service:sv.value,serviceName:sv.options[sv.selectedIndex].text,answers:{details:val(f,"details"),when:val(f,"when")},
      contact:{firstName:name.split(" ")[0]||"",lastName:name.split(" ").slice(1).join(" "),email:(S.user.email||"").toLowerCase(),phone:val(f,"phone"),street:val(f,"address"),city:val(f,"city"),postal:val(f,"postal").toUpperCase(),province:REGION==="sk"?"SK":"ON",prefTime:val(f,"pref")},
      status:"new",source:"account",region:REGION,uid:S.user.uid,createdAt:J.now()};
    if(!rec.contact.phone){toast("Please add a phone number");b.disabled=false;return}
    db.collection("requests").doc(rec.ref).set(rec).then(function(){J.notifyOffice("Service request "+rec.ref+" — "+rec.serviceName+" · "+(REGION==="sk"?"Saskatchewan":"GTA"),{name:name,email:rec.contact.email,phone:rec.contact.phone,
      message:"From a customer account.\n\nService: "+rec.serviceName+"\nWhen: "+rec.answers.when+"\nDetails: "+rec.answers.details+"\nAddress: "+[rec.contact.street,rec.contact.city,rec.contact.postal].filter(Boolean).join(", ")+"\nPhone: "+rec.contact.phone+" ("+rec.contact.prefTime+")\nEmail: "+rec.contact.email});
      S.tab="reqs";draw();toast("Request sent — reference "+rec.ref+". We'll be in touch soon.")}).catch(function(x){toast(J.friendlyError(x));b.disabled=false});return}
  if(k==="prof"){var np=Object.assign({},p,{name:val(f,"name"),phone:val(f,"phone"),address:val(f,"address"),city:val(f,"city"),postal:val(f,"postal").toUpperCase(),email:(S.user.email||"").toLowerCase(),region:p.region||REGION,updatedAt:J.now()});if(!np.createdAt)np.createdAt=J.now();
    db.collection("users").doc(S.user.uid).set(np).then(function(){S.prof=np;toast("Saved");draw()}).catch(function(x){toast(J.friendlyError(x));b.disabled=false})}}
document.addEventListener("click",function(e){if(e.target.id==="pwr"){auth.sendPasswordResetEmail(S.user.email).then(function(){toast("We emailed you a link to change your password")}).catch(function(x){toast(J.friendlyError(x))})}});
})();
