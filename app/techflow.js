/* ======================= JOB TYPES (installation · service call · maintenance) + START / FINISH FLOW ======================= */
var JTYPES=[["install","Installation"],["service","Service call"],["maint","Maintenance / tune-up"]];
var JTCOL={install:"#2563A8",service:"#E8590C",maint:"#2E8B57"};
function jtype(j){if(j&&j.jobType&&JTCOL[j.jobType])return j.jobType;var t=((j&&(j.title||""))+" "+(j&&(j.notes||""))).toLowerCase();
  if(/tune|maint|clean|inspect|check[- ]?up/.test(t))return "maint";if(/repair|service|no heat|no cool|not working|diagnos|leak|noise|error|code|broken|fix/.test(t))return "service";return "install"}
function jtLabel(j){var t=jtype(j);return (JTYPES.find(function(x){return x[0]===t})||["",""])[1]}
function jbadge(j){var t=jtype(j);return '<span class="jtb" style="--c:'+JTCOL[t]+'">'+(t==="install"?"Install":t==="service"?"Service call":"Maintenance")+'</span> '}
var CHECKS={
  install:["Old equipment removed and taken away","Gas line done and leak-tested","Venting / exhaust checked","Condensate drain (and pump) working","Electrical and disconnect done","Thermostat installed and set","System started and tested (heat and/or cool)","Work area cleaned up","Customer shown how to use the new system"],
  maint:["Filter checked or replaced","Burners and flame sensor cleaned","Heat exchanger inspected","Safety controls tested","Carbon monoxide / combustion test","Condensate drain cleaned","AC coil and outdoor unit cleaned","Thermostat checked"],
  service:[]};
var WORKING=[["yes","Yes — working now"],["temp","Working for now (temporary fix)"],["no","Not fixed — needs a return visit"]];
var FOLLOW=[["","No follow-up needed"],["quote","Needs a quote (repair or replacement)"],["parts","Waiting for parts — come back"],["return","Needs another visit"]];
function rep(j){return j.report||{}}
function phHas(j,k){return (S.ph[j._id]||[]).some(function(p){return p.kind===k})}
function flowSteps(j){var t=jtype(j),r=rep(j),st=j.status||"scheduled",started=st==="in-progress"||st==="done",ck=(r.checks||[]).length,N=CHECKS[t].length;
  var L=[["Start the job",started]];
  if(t==="install")L=L.concat([["Before photo — the old equipment",phHas(j,"before")],["Main photo of the new install",phHas(j,"main")],["Serial plate photo or serial numbers",phHas(j,"serial")||(j.serials||[]).some(function(s){return s.serial})],["Install checklist ("+ck+" of "+N+")",ck>=N]]);
  if(t==="service")L=L.concat([["Photo of the problem",phHas(j,"before")],["What you found",!!(r.found||"").trim()],["What you did to fix it",!!(r.fixed||"").trim()],["Is it working now?",!!r.working]]);
  if(t==="maint")L=L.concat([["Tune-up checklist ("+ck+" of "+N+")",ck>=N],["Photo of the unit",phHas(j,"main")||phHas(j,"before")]]);
  return L.concat([["Finish the job — customer signs",st==="done"]])}
function stepsCard(j){var L=flowSteps(j),n=L.filter(function(x){return x[1]}).length;
  return '<div class="card steps"><h3>Your steps <small>'+n+' of '+L.length+'</small></h3><ol>'+L.map(function(x){return '<li class="'+(x[1]?"d":"")+'"><span>'+(x[1]?"✓":"")+'</span>'+esc(x[0])+'</li>'}).join("")+'</ol></div>'}
function actCard(j){var st=j.status||"scheduled",id=esc(j._id);
  if(st==="done")return '<div class="card actc done"><p class="big1">✓ Job finished'+(j.doneAt?' <small>'+niceT(j.doneAt)+'</small>':'')+'</p><p class="mut" style="margin:4px 0 10px">Thank you! The office will send the invoice to the customer.</p>'+timeline(j)+'<button class="lnk" data-act="tst" data-s="in-progress" data-id="'+id+'">Not finished? Re-open the job</button></div>';
  if(st==="in-progress")return '<div class="card actc"><p class="lbl">Job started '+niceT(j.startedAt)+'</p><button class="btn big fin" data-act="finish" data-id="'+id+'">■ Finish job</button><p class="mut tiny" style="margin:8px 0 0">Add your photos and fill in the job report below first. When you tap <b>Finish job</b>, the customer signs on your phone.</p></div>';
  return '<div class="card actc"><button class="btn big go" data-act="tst" data-s="in-progress" data-id="'+id+'">▶ Start job</button>'+
    (st==="scheduled"?'<button class="btn g" style="width:100%;margin-top:10px" data-act="tst" data-s="on-the-way" data-id="'+id+'">🚗 I\'m on my way</button>':'<p class="mut tiny" style="margin:10px 0 0">On the way since '+niceT(j.onWayAt)+'</p>')+
    '<p class="mut tiny" style="margin:8px 0 0">Tap <b>Start job</b> when you arrive at the customer\'s home.</p></div>'}
function reportCard(j){var t=jtype(j),r=rep(j),ro=j.status==="done"&&isTechRole(),ck=r.checks||[],id=esc(j._id);
  var ta=function(n,label,ph){return '<label class="f"><span>'+label+'</span><textarea class="inp" name="'+n+'" rows="3" placeholder="'+esc(ph||"")+'">'+esc(r[n]||"")+'</textarea></label>'};
  var sel=function(n,label,opts){return '<label class="f"><span>'+label+'</span><select class="inp" name="'+n+'">'+(n==="working"?'<option value="">Choose…</option>':'')+opts.map(function(o){return '<option value="'+o[0]+'"'+((r[n]||"")===o[0]?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select></label>'};
  var h='<form class="card" data-form="report" data-id="'+id+'"'+(ro?' inert':'')+'><h3>'+(t==="install"?"Installation report":t==="service"?"Service call report":"Tune-up report")+'</h3>';
  if(t==="service")h+=ta("found","What you found — what was wrong","e.g. Cracked igniter, furnace locking out")+ta("fixed","What you did to fix it","e.g. Replaced igniter, cleaned flame sensor, tested 3 cycles")+
    ta("parts","Parts used","e.g. Igniter (Lennox 100870-01) × 1")+'<div class="grid2">'+sel("working","Is it working now?",WORKING)+sel("follow","Follow-up",FOLLOW)+'</div>'+ta("followNote","Follow-up details (for the office)","e.g. Heat exchanger is rusted — quote for a new furnace");
  else h+='<p class="lbl">'+(t==="install"?"Install checklist":"Tune-up checklist")+' — tick each one when done</p><div class="cklist">'+CHECKS[t].map(function(c,i){return '<label class="chk"><input type="checkbox" name="ck" value="'+i+'"'+(ck.indexOf(i)>-1?" checked":"")+'> '+esc(c)+'</label>'}).join("")+'</div>'+
    (t==="maint"?ta("fixed","Recommendations for the customer","e.g. Replace filter every 3 months; blower motor is noisy")+sel("follow","Follow-up",FOLLOW):ta("parts","Extra materials used","e.g. 10 ft gas pipe, 2 elbows, new pad"))+ta("followNote",t==="maint"?"Follow-up details (for the office)":"Anything the office should know",t==="maint"?"":"e.g. Customer wants a humidifier quote");
  h+=(r.at?'<p class="mut tiny" style="margin:6px 0 0">Saved '+niceT(r.at)+(r.by?' · '+esc(tname(r.by)):'')+'</p>':'')+(ro?'':'<div class="acts" style="margin-top:12px"><button class="btn">Save report</button></div>')+'</form>';
  return h}
/* the technician's job screen */
techJob=function(){var j=S.jobs.find(function(x){return S.edit&&x._id===S.edit.id});if(!j){S.edit=null;return vMy()}var c=j.customer||{},a=[c.address,c.city,c.postal].filter(Boolean).join(", "),t=jtype(j);
  if(!S.ph[j._id]&&!S.phLoading){S.phLoading=1;loadPhotos(j._id).then(function(){S.phLoading=0;if(S.edit&&S.edit.id===j._id)render()}).catch(function(){S.phLoading=0})}
  return '<button class="btn g sm back" data-act="cancel">‹ My jobs</button>'+top(jbadge(j)+esc(j.title||svcName(j.service)),pill(j.status)+" "+rpill(j.region)+" "+nice(j.date)+" · "+t12(j.time),"",true)+
   '<div class="two"><div>'+actCard(j)+stepsCard(j)+'</div><div class="card"><h3>Customer</h3><p style="margin:0 0 6px;font-size:18px"><b>'+esc(cname(c))+'</b></p>'+(a?'<p style="margin:0 0 12px">'+esc(a)+'</p>':'')+
   '<div class="acts">'+(c.phone?'<a class="btn o sm" href="tel:'+esc(digits(c.phone))+'">'+ic("phone")+'Call '+esc(c.phone)+'</a>':'')+(a?'<a class="btn g sm" href="'+maps(a)+'" target="_blank" rel="noopener">'+ic("map")+'Directions</a>':'')+'</div>'+
   (j.notes&&t!=="service"?'<p class="lbl" style="margin-top:16px">Notes from the office</p><p style="white-space:pre-wrap;margin:0">'+esc(j.notes)+'</p>':'')+
   (t==="service"&&j.notes?'<p class="lbl" style="margin-top:16px">Problem reported</p><p style="white-space:pre-wrap;margin:0">'+esc(j.notes)+'</p>':'')+'</div></div>'+
   (j.status==="scheduled"||j.status==="on-the-way"?'<p class="mut" style="margin:4px 2px 14px">Photos and the job report open here after you tap <b>Start job</b>.</p>':reportCard(j)+workPanel(j))};
/* the office job screen also shows the technician's report */
var jobForm0=jobForm;
jobForm=function(j){var h=jobForm0(j);if(j._new)return h;var live=S.jobs.find(function(x){return x._id===j._id})||j;var i=h.indexOf('<div class="card" id="phbox"');return i>-1?h.slice(0,i)+reportCard(live)+h.slice(i):h+reportCard(live)};
/* photos: add "before" photos; word the main photo per job type */
var paintPhotos0=paintPhotos;
paintPhotos=function(jid){paintPhotos0(jid);var box=$("#phbox");if(!box||box.dataset.job!==jid)return;var j=S.jobs.find(function(x){return x._id===jid})||(S.edit&&S.edit.data)||{},t=jtype(j);
  var L=(S.ph[jid]||[]).filter(function(p){return p.kind==="before"});
  var blk=document.createElement("div");blk.className="phbefore";blk.innerHTML='<p class="lbl">'+(t==="install"?"Before — the old equipment":t==="service"?"The problem — before you fix it":"Before — the unit when you arrived")+'</p><div class="phg">'+L.map(photoTile).join("")+'</div>'+(L.length?'':'<div class="emp">None yet.</div>')+
    '<div class="acts"><label class="btn g sm upl">'+ic("cam")+'Add before photo<input type="file" accept="image/*" data-phup="before" data-job="'+esc(jid)+'" multiple hidden></label></div>';
  var phs=box.querySelector(".phs");if(phs)box.insertBefore(blk,phs);
  if(t!=="install"){box.innerHTML=box.innerHTML.replace("Main photo — front of the finished job",t==="service"?"After photo — the unit after the repair":"After photo — the unit after the tune-up").replace("No main photo yet.","No after photo yet.").replace(/Add main photo/g,"Add after photo").replace("Serial plate / rating label photos","Rating label photo (model and serial)").replace("Add serial plate photo","Add rating label photo")}};
/* finish: checks that fit the job type, then the customer signs */
var openSign1=openSign;
openSign=function(jid){var j=jobRef(jid);if(!j)return;var miss=flowSteps(j).filter(function(x){return !x[1]&&x[0]!=="Start the job"&&x[0].indexOf("Finish the job")!==0}).map(function(x){return x[0].replace(/ \(\d+ of \d+\)/,"")});
  if(miss.length&&!j._ok2){var d=document.createElement("div");d.className="sigm";d.innerHTML='<div class="sigbox"><h3>Almost done</h3><p>Before you finish, please add:</p><ul>'+miss.map(function(x){return "<li><b>"+esc(x)+"</b></li>"}).join("")+'</ul><label class="chk"><input type="checkbox" id="skp"> I can\'t do this on this job — I\'ll explain in the report</label><div class="acts"><button class="btn" id="skOk">Add them now</button><button class="btn g" id="skGo">Finish anyway</button></div></div>';
    document.body.appendChild(d);$("#skOk").onclick=function(){d.remove();var b=$("[data-form=report]")||$("#phbox");if(b)b.scrollIntoView({behavior:"smooth"})};
    $("#skGo").onclick=function(){if(!$("#skp").checked){toast("Tick the box if you can't add them");return}d.remove();j._ok2=1;j._skipChecks=1;openSign(jid);delete j._ok2;delete j._skipChecks};return}
  j._skipChecks=1;openSign1(jid);delete j._skipChecks};
/* save the report */
var crmSubmitT=crmSubmit;
crmSubmit=function(e){var f=e.target;if(f.dataset.form!=="report")return crmSubmitT(e);
  var id=f.dataset.id,g=function(n){return f.elements[n]?String(f.elements[n].value||"").trim():""},btn=f.querySelector("button:not([type=button])");
  var r={found:g("found"),fixed:g("fixed"),parts:g("parts"),working:g("working"),follow:g("follow"),followNote:g("followNote"),checks:$$("[name=ck]",f).filter(function(x){return x.checked}).map(function(x){return +x.value}),at:J.now(),by:stamp()};
  if(btn)btn.disabled=true;db.collection("jobs").doc(id).update({report:r,updatedAt:J.now(),updatedBy:stamp()}).then(function(){var lj=S.jobs.find(function(x){return x._id===id});if(lj)lj.report=r;toast("Report saved");render()}).catch(fail).finally(function(){if(btn)btn.disabled=false});return true};
/* tick a checklist box = saved right away */
var crmChangeT=crmChange;
crmChange=function(e){var t=e.target;if(t.name==="ck"&&t.form&&t.form.dataset.form==="report"){var f=t.form,id=f.dataset.id,lj=S.jobs.find(function(x){return x._id===id})||{},r=Object.assign({},lj.report||{});r.checks=$$("[name=ck]",f).filter(function(x){return x.checked}).map(function(x){return +x.value});r.at=J.now();r.by=stamp();
    db.collection("jobs").doc(id).update({report:r,updatedAt:J.now(),updatedBy:stamp()}).then(function(){lj.report=r;var sc=$(".steps");if(sc){var tmp=document.createElement("div");tmp.innerHTML=stepsCard(lj);sc.replaceWith(tmp.firstChild)}}).catch(fail);return true}
  return crmChangeT(e)};
