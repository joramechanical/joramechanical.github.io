/* ======================= INVOICES (own tab) · MESSAGES TO ALL CUSTOMERS · CUSTOMER LOGIN LINK ======================= */
NAV.splice(NAV.findIndex(function(x){return x[1]==="quote"})+1,0,["Daily","inv","Invoices","work"]);
NAV.splice(NAV.findIndex(function(x){return x[1]==="cust"})+1,0,["Daily","msg","Messages","work"]);
S.camps=[];S.fi="open";S.iq="";S.ilim=150;S.msg=S.msg||{reg:"all",grp:"all",ch:"email",tpl:"promo"};S.bcc={};
var SITE_HOME="https://joramechanicalsystems.com/";
function acctLink(r){return SITE_HOME+"account/?r="+(r==="sk"?"sk":"gta")}
function acctInvLink(r){return acctLink(r)+"&tab=inv"}

/* ---------- invoices ---------- */
function invDue(i){return Math.max(0,num(i.total)-num(i.paid))}
function invState(i){if(i.status==="void")return "void";if(i.status==="paid"||invDue(i)<0.01)return "paid";if(i.dueDate&&i.dueDate<ymd())return "overdue";return i.sentAt?"sent":"new"}
var INVST={new:["Not sent yet","new"],sent:["Sent — waiting","sent"],overdue:["Overdue","cancelled"],paid:["Paid","done"],void:["Cancelled","cancelled"]};
function invMsg(inv){var c=inv.customer||{};return "Hi "+first(c)+",\n\nThank you for choosing Jora Mechanical Systems. Here is your invoice "+inv.number+" for "+money(inv.total)+(invDue(inv)<inv.total-0.01?" (balance "+money(invDue(inv))+")":"")+":\n"+invLink(inv._id)+"\n\nPay by e-transfer to info@joramechanicalsystems.com (put "+inv.number+" in the message), or call "+PHONE_TXT+" to pay by card.\n\nYou can see all your quotes and invoices any time in your account: "+acctInvLink(inv.region)+"\n\nJora Mechanical Systems\n"+PHONE_TXT}
function invSendBtns(inv){var c=inv.customer||{},body=invMsg(inv),subj="Invoice "+inv.number+" — Jora Mechanical Systems",sm=smsHref(c.phone,body),ml=mailHref(c.email,subj,body);
  return dmailBtn("customer",c.email,cname(c),subj,body,invLink(inv._id),"View your invoice","invsent",inv._id)+
    (ml?'<a class="btn sm '+(J.mailReady("customer")?"g":"")+'" href="'+ml+'" data-act="invsent" data-id="'+esc(inv._id)+'">'+ic("mail")+'Email'+(J.mailReady("customer")?' app':'')+'</a>':'')+
    (sm?'<a class="btn sm o" href="'+sm+'" data-act="invsent" data-id="'+esc(inv._id)+'">'+ic("phone")+'Text</a>':'')+
    '<button class="btn sm g" type="button" data-copytxt="'+esc(body)+'" data-act="invsent" data-id="'+esc(inv._id)+'">Copy message</button>'}
function vInv(){if(S.view==="newinv")return newInvForm();
  var all=S.invs.filter(function(i){return S.region==="all"||(i.region||"gta")===S.region}),t=ymd(),m=t.slice(0,7);
  var open=all.filter(function(i){var s=invState(i);return s!=="paid"&&s!=="void"}),od=open.filter(function(i){return invState(i)==="overdue"}),ns=open.filter(function(i){return !i.sentAt});
  var paidM=all.filter(function(i){return invState(i)==="paid"&&String(i.paidAt||i.createdAt||"").slice(0,7)===m}).reduce(function(s,i){return s+num(i.total)},0);
  var ready=S.jobs.filter(function(j){return j.status==="done"&&!j.invoiceId&&j.date>=addDays(t,-60)&&(num(j.amount)>0||j.quoteId)&&(S.region==="all"||(j.region||"gta")===S.region)}).sort(function(a,b){return String(b.date).localeCompare(String(a.date))});
  var F={open:open,overdue:od,unsent:ns,paid:all.filter(function(i){return invState(i)==="paid"}),all:all}[S.fi]||open,q=S.iq.toLowerCase();
  if(q)F=F.filter(function(i){var c=i.customer||{};return [i.number,i.title,cname(c),c.email,c.phone,c.address].join(" ").toLowerCase().indexOf(q)>=0});
  F=F.slice().sort(function(a,b){return String(b.createdAt).localeCompare(String(a.createdAt))});
  var h=top("Invoices","Make an invoice from a finished job (or a new one), then send it by email or text in one tap. Customers also see their invoices when they sign in to their account.",'<button class="btn" data-act="newinv">'+ic("plus")+'New invoice</button>')+
   '<div class="kpis"><div class="kpi" style="--c:#2563A8"><b>'+money(open.reduce(function(s,i){return s+invDue(i)},0))+'</b><span>Waiting for payment · '+open.length+'</span></div><div class="kpi" style="--c:#C62828"><b>'+money(od.reduce(function(s,i){return s+invDue(i)},0))+'</b><span>Overdue · '+od.length+'</span></div><div class="kpi" style="--c:#E8590C"><b>'+ns.length+'</b><span>Not sent yet</span></div><div class="kpi" style="--c:#2E8B57"><b>'+money(paidM)+'</b><span>Paid in '+mlabel(m,true)+'</span></div></div>';
  if(!J.mailReady("customer"))h+='<div class="card" style="background:#fff8e6;border-color:#f5d48a"><p style="margin:0"><b>Email sending from info@ isn\'t connected yet.</b> Until it is, <b>Email</b> opens your email app with the invoice ready, and <b>Text</b> opens your phone\'s messages. Both work now.</p></div>';
  if(ready.length)h+='<details class="card"'+(ready.length<=6?" open":"")+'><summary><h3 style="display:inline">Finished jobs without an invoice ('+ready.length+')</h3> <small class="mut">last 60 days</small></summary><table class="tbl rsp"><tbody>'+ready.slice(0,20).map(function(j){var c=j.customer||{};return '<tr><td data-l="Job"><b>'+esc(cname(c))+'</b><br><small>'+esc(j.title||svcName(j.service))+' · '+nice(j.date)+'</small></td><td data-l="Value" style="text-align:right">'+money(num(j.amount)+num(j.tax))+'</td><td style="text-align:right"><button class="btn sm" data-act="mkinv2" data-id="'+esc(j._id)+'">'+ic("inv")+'Create invoice</button></td></tr>'}).join("")+'</tbody></table>'+(ready.length>20?'<p class="mut tiny">Showing 20 of '+ready.length+'.</p>':'')+'</details>';
  h+='<div class="bar"><div class="chips">'+[["open","Not paid"],["overdue","Overdue"],["unsent","Not sent"],["paid","Paid"],["all","All"]].map(function(x){return '<button class="chip'+(S.fi===x[0]?" on":"")+'" data-fi="'+x[0]+'">'+x[1]+'</button>'}).join("")+'</div><input class="inp" id="invq" placeholder="Search name, phone, invoice #" value="'+esc(S.iq)+'" style="max-width:280px"></div>';
  h+='<div class="card">'+(F.length?'<table class="tbl rsp"><thead><tr><th>Invoice</th><th>Customer</th><th style="text-align:right">Total</th><th>Status</th><th>Send</th></tr></thead><tbody>'+F.slice(0,S.ilim).map(function(i){var c=i.customer||{},st=invState(i),P=INVST[st];
    return '<tr><td data-l="Invoice"><b>'+esc(i.number)+'</b><br><small>'+esc(i.title||"")+' · '+nice(i.workDate||i.createdAt)+'</small></td><td data-l="Customer">'+esc(cname(c))+'<br><small class="mut">'+esc(c.email||c.phone||"no email or phone")+'</small></td><td data-l="Total" style="text-align:right"><b>'+money(i.total)+'</b>'+(st!=="paid"&&invDue(i)<num(i.total)-0.01?'<br><small>'+money(invDue(i))+' left</small>':'')+'</td><td data-l="Status"><span class="pill '+P[1]+'">'+P[0]+'</span>'+(i.sentAt?'<br><small class="mut">sent '+nice(i.sentAt)+'</small>':'')+(st!=="paid"&&i.dueDate?'<br><small class="mut">due '+nice(i.dueDate)+'</small>':'')+'</td>'+
      '<td data-l="Send"><div class="acts" style="gap:6px;flex-wrap:wrap">'+(st==="void"?'':invSendBtns(i))+'<a class="btn sm g" href="'+esc(invLink(i._id))+'" target="_blank" rel="noopener">Open</a>'+(st!=="paid"&&st!=="void"?'<button class="btn sm ok" data-act="ipaid" data-id="'+esc(i._id)+'">✓ Paid</button>':'')+'</div></td></tr>'}).join("")+'</tbody></table>'+(F.length>S.ilim?'<p><button class="btn g sm" data-act="imore">Show more ('+(F.length-S.ilim)+')</button></p>':''):'<p class="mut">Nothing here.</p>')+'</div>';
  return h}
function newInvForm(){var C=audienceAll();
  return '<p><button class="lnk" data-act="invback">‹ Back to invoices</button></p>'+top("New invoice","For work that isn\'t a job in the panel. For a finished job, use <b>Create invoice</b> instead — it fills everything in.","",true)+
   '<form class="card" data-form="newinv"><datalist id="custDl">'+C.slice(0,6000).map(function(c){return '<option value="'+esc(c.name)+'">'+esc([c.email,c.phone,c.city].filter(Boolean).join(" · "))+'</option>'}).join("")+'</datalist>'+
   '<div class="grid2"><label class="f"><span>Customer name</span><input class="inp" name="name" id="niName" list="custDl" required autocomplete="off"></label><label class="f"><span>Region</span><select class="inp" name="region"><option value="gta">GTA (HST 13%)</option><option value="sk"'+(S.region==="sk"?" selected":"")+'>Saskatchewan (GST 5% + PST 6%)</option></select></label></div>'+
   '<div class="grid2"><label class="f"><span>Email</span><input class="inp" name="email" type="email"></label><label class="f"><span>Phone</span><input class="inp" name="phone"></label></div>'+
   '<div class="grid2"><label class="f"><span>Address</span><input class="inp" name="address"></label><label class="f"><span>City</span><input class="inp" name="city"></label></div>'+
   '<label class="f"><span>What the invoice is for</span><textarea class="inp" name="desc" rows="3" required placeholder="e.g. Furnace repair — replaced igniter and flame sensor"></textarea></label>'+
   '<div class="grid3"><label class="f"><span>Price before tax ($)</span><input class="inp" name="price" type="number" step="0.01" min="0" required></label><label class="f"><span>Tax</span><select class="inp" name="taxMode"><option value="">Add tax</option><option value="none">No tax</option></select></label><label class="f"><span>Payment due in</span><select class="inp" name="days"><option value="0">Due now</option><option value="7" selected>7 days</option><option value="15">15 days</option><option value="30">30 days</option></select></label></div>'+
   '<label class="f" style="flex-direction:row;gap:8px;align-items:center"><input type="checkbox" name="paidNow"> <span style="text-transform:none;letter-spacing:0">Already paid in full</span></label>'+
   '<div class="acts"><button class="btn">Create invoice</button><button class="btn g" type="button" data-act="invback">Cancel</button></div></form>'}

/* ---------- everyone we can message (customers, accounts, jobs, quotes, requests) ---------- */
function audienceAll(){var M={},t=ymd();
  function key(c){var e=(c.email||"").trim().toLowerCase(),p=digits(c.phone||"");return e||(p.length>=10?"ph"+p.slice(-10):"")}
  function add(c,src,extra){if(!c)return;var n=cname(c);var k=key(c);if(!k)return;var o=M[k]||(M[k]={key:k,name:"",email:"",phone:"",city:"",region:"",lastJob:"",jobs:0,account:false,noPromo:false,src:{}});
    if(!o.name&&n&&n!=="—")o.name=n;if(!o.email&&c.email)o.email=String(c.email).trim().toLowerCase();if(!o.phone&&c.phone)o.phone=c.phone;if(!o.city&&c.city)o.city=c.city;if(!o.region&&c.region)o.region=c.region;o.src[src]=1;if(extra)extra(o)}
  S.cust.forEach(function(c){add(c,"cust",function(o){if(c.noPromo)o.noPromo=true;if(c.region)o.region=c.region})});
  S.users.forEach(function(u){add(u,"acct",function(o){o.account=true;if(u.promo===false)o.noPromo=true})});
  S.jobs.forEach(function(j){if(j.status==="cancelled")return;add(j.customer,"job",function(o){o.jobs++;if(j.date&&j.date<=t&&j.date>o.lastJob)o.lastJob=j.date;if(!o.region)o.region=j.region})});
  (S.quotes||[]).forEach(function(q){add(q.customer,"quote",function(o){if(!o.region)o.region=q.region})});
  (S.req||[]).forEach(function(r){add(r.contact,"req",function(o){if(!o.region)o.region=r.region})});
  return Object.keys(M).map(function(k){var o=M[k];if(!o.name)o.name=o.email||o.phone;o.region=o.region||"gta";return o}).sort(function(a,b){return a.name.localeCompare(b.name)})}
var MSG_TPL={
  promo:["Special offer from Jora Mechanical","Hi {first},\n\nThis month only: [describe your offer — e.g. $100 off a new furnace or AC install, or a free thermostat with every heat pump].\n\nBook online or call us at 905-667-2823."],
  tune:["Time for your heating tune-up","Hi {first},\n\nIt's been about a year since your last service. A yearly tune-up keeps your system safe, efficient and covered by warranty.\n\nBook your tune-up online or call us at 905-667-2823."],
  season:["Get ready for the cold — Jora Mechanical","Hi {first},\n\nWinter is coming. Book a quick furnace check now and avoid a no-heat call on the coldest night of the year.\n\nBook online or call us at 905-667-2823."],
  thanks:["Thank you from Jora Mechanical","Hi {first},\n\nThank you for choosing Jora Mechanical Systems. If you were happy with our work, a quick Google review would mean a lot to our small team."],
  custom:["",""]};
function msgFooter(region,ch){return ch==="sms"?"\n\nYour account: "+acctLink(region)+"\nReply STOP to opt out.":"\n\n—\nBook service, see your quotes and invoices: "+acctLink(region)+"\nJora Mechanical Systems · "+PHONE_TXT+" · info@joramechanicalsystems.com\nDon't want these emails? Just reply \"unsubscribe\" and we'll take you off the list."}
function audience(){var o=S.msg,t=ymd(),yr=addDays(t,-330);
  return audienceAll().filter(function(c){if(c.noPromo)return false;if(o.reg!=="all"&&c.region!==o.reg)return false;
    if(o.grp==="job"&&!c.jobs)return false;if(o.grp==="acct"&&!c.account)return false;if(o.grp==="tune"&&!(c.lastJob&&c.lastJob<=yr))return false;
    return o.ch==="sms"?!!digits(c.phone):!!c.email})}
function fill(s,c){return String(s||"").replace(/\{first\}/g,(String(c.name||"").split(" ")[0]||"there").replace(/@.*/,"")).replace(/\{name\}/g,c.name||"")}
function vMsg(){var o=S.msg,A=audience(),all=audienceAll(),stop=all.filter(function(c){return c.noPromo}),ready=J.mailReady("customer");
  if(o.subj==null){o.subj=MSG_TPL[o.tpl][0];o.body=MSG_TPL[o.tpl][1]}
  var sel=function(n,v,opts){return '<select class="inp" data-msg="'+n+'">'+opts.map(function(x){return '<option value="'+x[0]+'"'+(v===x[0]?" selected":"")+'>'+x[1]+'</option>'}).join("")+'</select>'};
  var h=top("Messages","Send one message to all your customers — or one group — in a few taps. Each message starts with the customer\'s first name and ends with their sign-in link and a way to opt out.","",true);
  h+='<div class="two wide"><div><div class="card"><h3>1 · Who gets it</h3><div class="grid3"><label class="f"><span>Region</span>'+sel("reg",o.reg,[["all","GTA + Saskatchewan"],["gta","GTA only"],["sk","Saskatchewan only"]])+'</label><label class="f"><span>Group</span>'+sel("grp",o.grp,[["all","Everyone"],["job","Customers we did work for"],["tune","Tune-up due (last job 11+ months ago)"],["acct","Customers with an online account"]])+'</label><label class="f"><span>Send by</span>'+sel("ch",o.ch,[["email","Email"],["sms","Text message"]])+'</label></div>'+
    '<p style="margin:4px 0 0;font-size:18px"><b>'+A.length.toLocaleString()+'</b> customer(s) will get this'+(stop.length?' <small class="mut">· '+stop.length+' opted out (skipped)</small>':'')+'</p></div>';
  h+='<div class="card"><h3>2 · The message</h3><label class="f"><span>Start from</span>'+sel("tpl",o.tpl,[["promo","Special offer"],["tune","Tune-up reminder"],["season","Seasonal check"],["thanks","Thank you / review"],["custom","Blank"]])+'</label>'+(o.ch==="email"?'<label class="f"><span>Subject</span><input class="inp" data-msg="subj" value="'+esc(o.subj)+'"></label>':'')+
    '<label class="f"><span>Message — {first} becomes each customer\'s first name</span><textarea class="inp" data-msg="body" rows="9">'+esc(o.body)+'</textarea></label>'+
    '<p class="mut tiny" style="margin:-4px 0 0">Added automatically at the end:</p><pre class="mpv">'+esc(msgFooter(o.reg==="sk"?"sk":"gta",o.ch).trim())+'</pre></div>';
  h+='<div class="card"><h3>3 · Send</h3>';
  if(!A.length)h+='<p class="mut">No customers match. Change the group or region above.</p>';
  else if(o.ch==="email"){
    h+=(ready?'<p><button class="btn" data-act="msgsend">'+ic("mail")+'Send to all '+A.length.toLocaleString()+' now (from info@)</button></p><div id="msgProg"></div>'+(A.length>150?'<p class="mut tiny">Big lists: your email plan sets a monthly limit. If sending stops part-way, press Send again later — it carries on from where it stopped and nobody gets it twice.</p>':''):'<p class="mut">One-click sending from info@ switches on as soon as the email connection is finished. Meanwhile, use the groups below — each opens your email app with up to 50 customers in <b>BCC</b> (they can\'t see each other).</p>');
    var G=[];for(var i=0;i<A.length;i+=50)G.push(A.slice(i,i+50));var sub=o.subj||"Jora Mechanical Systems",gen=fill(o.body,{name:""}).replace(/^Hi there,/,"Hi,")+msgFooter(o.reg==="sk"?"sk":"gta","email");
    h+='<details'+(ready?'':' open')+'><summary><b>Send with my email app</b> ('+G.length+' group'+(G.length>1?"s":"")+' of up to 50)</summary><div class="acts" style="flex-wrap:wrap;margin-top:10px">'+G.map(function(g,n){var href="mailto:info@joramechanicalsystems.com?bcc="+encodeURIComponent(g.map(function(c){return c.email}).join(","))+"&subject="+encodeURIComponent(sub)+"&body="+encodeURIComponent(gen);return '<a class="btn sm '+(S.bcc[n]?"ok":"g")+'" href="'+esc(href)+'" data-bcc="'+n+'">'+(S.bcc[n]?"✓ ":"")+'Group '+(n+1)+' ('+g.length+')</a>'}).join("")+'</div><p class="mut tiny">Group emails say "Hi," instead of the first name.</p></details>';
  } else {
    h+='<p class="mut">Texts to many people at once go through a texting service, so numbers stay private. With <b>RingCentral</b>: download the list below, then use RingCentral\'s bulk / high-volume SMS to upload it and paste the message. For a few customers, use the <b>Text</b> buttons.</p>'+
      '<details><summary><b>Text one by one</b> (first '+Math.min(A.length,40)+')</summary><div class="acts" style="flex-wrap:wrap;margin-top:10px">'+A.slice(0,40).map(function(c){return '<a class="btn sm g" href="'+esc(smsHref(c.phone,fill(o.body,c)+msgFooter(c.region,"sms")))+'">'+esc(c.name)+'</a>'}).join("")+'</div></details>';
  }
  if(A.length)h+='<div class="acts" style="margin-top:12px"><button class="btn g sm" data-act="msgcsv">Download list (CSV)</button><button class="btn g sm" data-act="msgcopy">Copy all '+(o.ch==="sms"?"numbers":"emails")+'</button></div>';
  h+='</div></div><div>';
  var c0=A[0]||{name:"Sam Patel",region:"gta"};
  h+='<div class="card"><h3>Preview</h3><p class="mut tiny" style="margin-top:-6px">How '+esc(String(c0.name).split(" ")[0])+' will see it</p>'+(o.ch==="email"?'<p style="margin:0 0 6px"><b>'+esc(o.subj||"(no subject)")+'</b><br><small class="mut">From: Jora Mechanical Systems &lt;info@joramechanicalsystems.com&gt;</small></p>':'')+'<pre class="mpv" style="max-height:420px">'+esc(fill(o.body,c0)+msgFooter(c0.region,o.ch))+'</pre></div>';
  h+='<div class="card"><h3>Customer sign-in page</h3><p style="margin-top:-6px">Customers sign in or create their account here. Every message already includes this link.</p><p><b>GTA:</b> <a href="'+acctLink("gta")+'" target="_blank" rel="noopener">'+acctLink("gta").replace("https://","")+'</a><br><b>Saskatchewan:</b> <a href="'+acctLink("sk")+'" target="_blank" rel="noopener">'+acctLink("sk").replace("https://","")+'</a></p><p class="mut tiny">There they can book service, accept quotes, see and print invoices, update their details, and turn offers on or off. It is also under <b>My account</b> at the top of every page of the website.</p><button class="btn g sm" data-copytxt="'+esc(acctLink("gta"))+'">Copy GTA link</button></div>';
  h+='<div class="card"><h3>Opted out ('+stop.length+')</h3><p class="mut tiny" style="margin-top:-6px">These customers never get group messages. When someone replies "unsubscribe" or "STOP", add them here.</p><form data-form="optout" style="display:flex;gap:8px"><input class="inp" name="who" placeholder="Email or phone" required><button class="btn sm">Add</button></form>'+(stop.length?'<ul class="plain" style="margin:10px 0 0;padding:0;list-style:none">'+stop.slice(0,60).map(function(c){return '<li style="display:flex;justify-content:space-between;gap:8px;padding:4px 0;border-bottom:1px solid #eef1f4"><span>'+esc(c.name)+' <small class="mut">'+esc(c.email||c.phone)+'</small></span><button class="lnk" data-act="optin" data-k="'+esc(c.key)+'">undo</button></li>'}).join("")+'</ul>':'')+'</div>';
  h+='<div class="card"><h3>Sent before</h3>'+(S.camps.length?S.camps.slice(0,15).map(function(c){return '<p style="margin:0 0 8px"><b>'+esc(c.subject||"Text message")+'</b><br><small class="mut">'+nice(c.at)+' · '+(c.ch==="sms"?"text":"email")+' · '+esc(String(c.sent||0))+' of '+esc(String(c.total||0))+' sent</small></p>'}).join(""):'<p class="mut">Nothing yet.</p>')+'</div>';
  return h+'</div></div>'}
function custDocId(c){return (c.email?c.email.toLowerCase().replace(/[\/.#$\[\]]/g,"_"):"ph-"+digits(c.phone).slice(-10))}
function csvCell(v){v=String(v==null?"":v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}
function sendAll(btn){var o=S.msg,A=audience(),cid=o.cid||(o.cid="c"+Date.now()),doneKey="jora_msgdone_"+cid,done={};try{done=JSON.parse(localStorage.getItem(doneKey)||"{}")}catch(e){}
  var todo=A.filter(function(c){return !done[c.key]});if(!todo.length){toast("Everyone on this list already got it");return}
  if(!confirmDo("Send \""+(o.subj||"")+"\" to "+todo.length.toLocaleString()+" customer(s) from info@joramechanicalsystems.com?"))return;
  btn.disabled=true;var i=0,sent=Object.keys(done).length,err=0,stopNow=false,box=$("#msgProg");
  box.innerHTML='<div class="prog"><div id="msgBar" style="width:0"></div></div><p class="mut tiny" id="msgTxt">Starting…</p><button class="btn g sm" type="button" id="msgStop">Stop</button>';
  $("#msgStop").onclick=function(){stopNow=true};
  function log(fin){db.collection("campaigns").doc(cid).set({subject:o.subj||"",body:o.body||"",ch:"email",region:o.reg,group:o.grp,total:A.length,sent:sent,errors:err,at:J.now(),by:stamp(),finished:!!fin},{merge:true}).catch(function(){})}
  (function next(){if(stopNow||i>=todo.length){log(i>=todo.length);btn.disabled=false;var tx=$("#msgTxt");if(tx)tx.textContent=(stopNow?"Stopped. ":"Finished. ")+sent+" sent"+(err?", "+err+" failed":"")+".";toast(sent+" email(s) sent");return}
    var c=todo[i++];J.sendMail("customer",{to_email:c.email,to_name:c.name,subject:o.subj||"Jora Mechanical Systems",message:fill(o.body,c)+msgFooter(c.region,"email")})
      .then(function(){sent++;done[c.key]=1;try{localStorage.setItem(doneKey,JSON.stringify(done))}catch(e){}},function(e){err++;if(/limit|quota|429|402/i.test(String(e&&e.message))){stopNow=true;toast("Your email plan's limit was reached — the rest can be sent later")}})
      .then(function(){var bar=$("#msgBar"),tx=$("#msgTxt");if(bar)bar.style.width=Math.round(i/todo.length*100)+"%";if(tx)tx.textContent=sent+" sent of "+A.length+(err?" · "+err+" failed":"");if(i%25===0)log(false);setTimeout(next,350)})})()}

/* ---------- hooks ---------- */
var crmClickC=crmClick;
crmClick=function(e){var t=e.target,b;
  if((b=t.closest("[data-fi]"))){S.fi=b.dataset.fi;S.ilim=150;render();return true}
  if((b=t.closest("[data-bcc]"))){S.bcc[b.dataset.bcc]=1;setTimeout(function(){b.classList.remove("g");b.classList.add("ok")},300);return false}
  b=t.closest("[data-act]");if(b){var a=b.dataset.act,id=b.dataset.id;
    if(a==="newinv"){S.view="newinv";render();window.scrollTo(0,0);return true}
    if(a==="invback"){S.view=null;render();return true}
    if(a==="imore"){S.ilim+=300;render();return true}
    if(a==="mkinv2"){var j=S.jobs.find(function(x){return x._id===id});if(!j)return true;b.disabled=true;var inv=buildInvoice(j),iid=J.rid(24);inv.status=j.payStatus==="paid"?"paid":"open";if(j.payStatus==="paid")inv.paidAt=J.now();
      db.collection("invoices").doc(iid).set(inv).then(function(){return db.collection("jobs").doc(j._id).update({invoiceId:iid,updatedAt:J.now(),updatedBy:stamp()})}).then(function(){toast("Invoice "+inv.number+" created — now tap Send");S.fi=inv.status==="paid"?"paid":"unsent"}).catch(fail);return true}
    if(a==="ipaid"){var iv=S.invs.find(function(x){return x._id===id});if(!iv||!confirmDo("Mark invoice "+iv.number+" as paid in full ("+money(iv.total)+")?"))return true;
      db.collection("invoices").doc(id).update({paid:num(iv.total),status:"paid",paidAt:J.now()}).then(function(){if(iv.jobId)return db.collection("jobs").doc(iv.jobId).update({payStatus:"paid",paidOn:ymd(),updatedAt:J.now(),updatedBy:stamp()}).catch(function(){})}).then(function(){toast("Marked paid")}).catch(fail);return true}
    if(a==="msgsend"){sendAll(b);return true}
    if(a==="msgcsv"){var A=audience(),csv="Name,Email,Phone,City,Region,Last job\n"+A.map(function(c){return [c.name,c.email,c.phone,c.city,c.region==="sk"?"Saskatchewan":"GTA",c.lastJob].map(csvCell).join(",")}).join("\n");
      var u=URL.createObjectURL(new Blob(["﻿"+csv],{type:"text/csv"})),l=document.createElement("a");l.href=u;l.download="jora-customers-"+ymd()+".csv";document.body.appendChild(l);l.click();l.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000);return true}
    if(a==="msgcopy"){var L=audience().map(function(c){return S.msg.ch==="sms"?c.phone:c.email}).join(S.msg.ch==="sms"?"\n":", ");(navigator.clipboard?navigator.clipboard.writeText(L):Promise.reject()).then(function(){toast("Copied")}).catch(function(){prompt("Copy:",L)});return true}
    if(a==="optin"){var k=b.dataset.k,c=audienceAll().find(function(x){return x.key===k});if(!c)return true;
      db.collection("customers").doc(custDocId(c)).set({noPromo:false,name:c.name||c.email||c.phone},{merge:true}).then(function(){toast("They'll get messages again")}).catch(fail);
      var us=S.users.find(function(u){return (u.email||"").toLowerCase()===c.email});if(us&&us.promo===false)toast("Note: they turned offers off in their own account");return true}
  }
  return crmClickC(e)};
var crmChangeC=crmChange;
crmChange=function(e){var t=e.target;
  if(t.dataset&&t.dataset.msg){var n=t.dataset.msg;S.msg[n]=t.value;if(n==="tpl"){S.msg.subj=MSG_TPL[t.value][0];S.msg.body=MSG_TPL[t.value][1]}if(n!=="subj"&&n!=="body"){S.msg.cid=null;S.bcc={}}render();return true}
  if(t.id==="niName"){var c=audienceAll().find(function(x){return x.name===t.value});if(c){var f=t.form;["email","phone","city"].forEach(function(k){if(!f.elements[k].value&&c[k])f.elements[k].value=c[k]});f.elements.region.value=c.region==="sk"?"sk":"gta";
      var j=S.jobs.find(function(x){return x.customer&&((x.customer.email||"").toLowerCase()===c.email||digits(x.customer.phone)===digits(c.phone))&&x.customer.address});if(j&&!f.elements.address.value)f.elements.address.value=j.customer.address}return true}
  return crmChangeC(e)};
var crmInputC=crmInput;
crmInput=function(e){var t=e.target;
  if(t.id==="invq"){clearTimeout(S.iqT);S.iqT=setTimeout(function(){S.iq=t.value;render();var n=$("#invq");if(n){n.focus();try{n.setSelectionRange(n.value.length,n.value.length)}catch(x){}}},250);return true}
  if(t.dataset&&(t.dataset.msg==="subj"||t.dataset.msg==="body")){S.msg[t.dataset.msg]=t.value;S.msg.cid=null;clearTimeout(S.mpT);S.mpT=setTimeout(function(){var p=$$(".mpv");var A=audience(),c0=A[0]||{name:"Sam Patel",region:"gta"};if(p[1])p[1].textContent=fill(S.msg.body,c0)+msgFooter(c0.region,S.msg.ch)},200);return true}
  return crmInputC(e)};
var crmSubmitC=crmSubmit;
crmSubmit=function(e){var f=e.target,k=f.dataset.form;
  if(k==="newinv"){var g=function(n){return String(f.elements[n].value||"").trim()},btn=f.querySelector("button:not([type=button])");btn.disabled=true;
    var c={name:g("name"),email:g("email").toLowerCase(),phone:g("phone"),address:g("address"),city:g("city")},paid=f.elements.paidNow.checked;
    var inv={number:invNumber(),jobId:"",quoteId:"",region:g("region"),customer:c,customerEmail:c.email,title:g("desc").split("\n")[0].slice(0,80),site:[c.address,c.city].filter(Boolean).join(", "),items:[{desc:g("desc"),qty:1,price:num(g("price"))}],discount:0,taxMode:g("taxMode"),workDate:ymd(),dueDate:addDays(ymd(),+g("days")||0),
      terms:"Payment due "+(+g("days")?"within "+g("days")+" days":"on receipt")+". Pay by e-transfer to info@joramechanicalsystems.com, or call "+PHONE_TXT+" to pay by card. Thank you for choosing Jora Mechanical Systems.",createdAt:J.now(),createdBy:stamp()};
    var tt=J.quoteTotals(inv);inv.total=Math.round(tt.total*100)/100;inv.paid=paid?inv.total:0;inv.status=paid?"paid":"open";if(paid)inv.paidAt=J.now();
    db.collection("invoices").doc(J.rid(24)).set(inv).then(function(){toast("Invoice "+inv.number+" created — tap Send to send it");S.view=null;S.fi=paid?"paid":"unsent";render()}).catch(function(x){fail(x);btn.disabled=false});return true}
  if(k==="optout"){var w=String(f.elements.who.value||"").trim().toLowerCase(),d=digits(w),c=audienceAll().find(function(x){return (w.indexOf("@")>0&&x.email===w)||(d.length>=10&&digits(x.phone).slice(-10)===d.slice(-10))})||(w.indexOf("@")>0?{email:w,name:w}:{phone:w,name:w,email:""});
    if(!c.email&&digits(c.phone).length<10){toast("Enter an email or a 10-digit phone");return true}
    db.collection("customers").doc(custDocId(c)).set({noPromo:true,noPromoAt:J.now(),name:c.name||c.email||c.phone,email:c.email||"",phone:c.phone||""},{merge:true}).then(function(){toast("Added — they won't get group messages");f.reset()}).catch(fail);return true}
  return crmSubmitC(e)};
var crmSubscribeC=crmSubscribe;
crmSubscribe=function(){var r=crmSubscribeC();if(!r&&can("work"))sub(db.collection("campaigns").orderBy("at","desc").limit(50),"camps");return r};
