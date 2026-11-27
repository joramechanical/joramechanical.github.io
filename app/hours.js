/* ======================= JOB HOURS + HOURLY TECHNICIAN PAY ======================= */
/* Time is taken from the technician's own taps: "On the way" → "Start job" → "Finish job".
   Owners choose per technician: paid per job (amount on the job) or paid by the hour (hours × rate). */
function hrsBetween(a,b){if(!a||!b)return 0;var h=(new Date(b)-new Date(a))/36e5;return h>0&&h<24?h:0}
function techRate(em){var R=(S.finS&&S.finS.techRates)||{};return R[em]||{type:"job"}}
function roundH(h,step){if(!step)return Math.round(h*100)/100;var q=step/60;return Math.round(h/q)*q}
function jobTimes(j){var site=hrsBetween(j.startedAt,j.doneAt),travel=hrsBetween(j.onWayAt,j.startedAt);if(travel>4)travel=0;
  var adj=j.hoursAdj===""||j.hoursAdj==null?null:num(j.hoursAdj);return {site:site,travel:travel,adj:adj,onSite:adj!=null?adj:site}}
function jobHours(j,em){var r=techRate(em||j.assignedEmail),t=jobTimes(j);return roundH(t.onSite+(r.travel?t.travel:0),num(r.round))}
function jobTechPay(j){if(j.techPay!==""&&j.techPay!=null&&num(j.techPay)>0)return num(j.techPay);var r=techRate(j.assignedEmail);
  return r.type==="hourly"&&num(r.rate)>0?Math.round(jobHours(j)*num(r.rate)*100)/100:0}
function fmtH(h){if(!h)return "—";var m=Math.round(h*60);return Math.floor(m/60)+"\u00a0h\u00a0"+String(m%60).padStart(2,"0")+"\u00a0m"}
/* agreed pay + hours now include hourly technicians */
techStats=function(em,a,b){var J2=S.jobs.filter(function(j){return j.assignedEmail===em&&j.status==="done"&&inR(j.date,a,b)});
  return {jobs:J2.length,rev:J2.reduce(function(s,j){return s+num(j.amount)},0),agreed:J2.reduce(function(s,j){return s+jobTechPay(j)},0),hours:J2.reduce(function(s,j){return s+jobHours(j,em)},0),paid:tpayOf(em,a,b)}};

/* Finance › Technician pay: pay settings + timesheet above the existing page */
var finTPayH=finTPay;
finTPay=function(){var T=techList(),sel=S.tpT||((T.find(function(x){return x.role==="technician"})||T[0]||{})._id||""),R=prange(S.fp);
  var rows=T.map(function(x){var r=techRate(x._id);return '<tr><td data-l="Technician"><b>'+esc(x.name||x._id)+'</b></td><td data-l="Paid by">'+(r.type==="hourly"?'<span class="pill sched">Hourly · '+money(r.rate)+'/h</span>':'<span class="pill">Per job</span>')+'</td><td data-l="Counts">'+(r.type==="hourly"?(r.travel?"Drive + on site":"On site only")+(num(r.round)?" · rounded to "+r.round+" min":""):"Amount on each job")+'</td><td style="text-align:right"><button class="btn g sm" data-act="trEdit" data-id="'+esc(x._id)+'">Change</button></td></tr>'}).join("");
  var e=S.trEdit?Object.assign({type:"job",rate:"",travel:false,round:"15"},techRate(S.trEdit)):null;
  var form=e?'<form class="card" data-form="techrate" style="border:2px solid var(--o,#E8590C)"><h3>How '+esc(tname(S.trEdit))+' is paid</h3>'+
     '<div class="grid2"><label class="f"><span>Pay type</span><select class="inp" name="type"><option value="job"'+(e.type!=="hourly"?" selected":"")+'>Per job (amount on each job)</option><option value="hourly"'+(e.type==="hourly"?" selected":"")+'>Hourly (time × rate)</option></select></label><label class="f"><span>Hourly rate ($)</span><input class="inp" type="number" step="0.01" min="0" name="rate" value="'+esc(e.rate)+'" placeholder="e.g. 35"></label></div>'+
     '<div class="grid2"><label class="f"><span>Round time to</span><select class="inp" name="round">'+[["0","Exact minutes"],["15","Nearest 15 min"],["30","Nearest 30 min"]].map(function(o){return '<option value="'+o[0]+'"'+(String(e.round)===o[0]?" selected":"")+'>'+o[1]+'</option>'}).join("")+'</select></label><label class="f" style="flex-direction:row;gap:8px;align-items:center;margin-top:26px"><input type="checkbox" name="travel"'+(e.travel?" checked":"")+'> <span style="text-transform:none;letter-spacing:0">Pay drive time too (from “On the way”)</span></label></div>'+
     '<div class="acts"><button class="btn">Save</button><button class="btn g" type="button" data-act="trCancel">Cancel</button></div><p class="mut tiny" style="margin:8px 0 0">An amount typed in “Agreed technician pay” on a job always wins over the hourly calculation for that job.</p></form>':'';
  var J2=sel?S.jobs.filter(function(j){return j.assignedEmail===sel&&j.status==="done"&&inR(j.date,R.a,R.b)}).sort(function(a,b){return String(b.date).localeCompare(String(a.date))}):[],r=techRate(sel);
  var tH=0,tP=0;J2.forEach(function(j){tH+=jobHours(j,sel);tP+=jobTechPay(j)});
  var sheet=sel?'<div class="card"><h3>Timesheet — '+esc(tname(sel))+' <small>'+R.label+' · '+(r.type==="hourly"?money(r.rate)+'/h':'per job')+'</small></h3><div class="bar" style="margin:-4px 0 10px"><select class="inp" id="tpT" style="width:auto;min-height:38px">'+T.map(function(x){return '<option value="'+esc(x._id)+'"'+(sel===x._id?" selected":"")+'>'+esc(x.name||x._id)+'</option>'}).join("")+'</select><button class="btn g sm" data-act="tscsv">Download CSV</button><button class="btn g sm" data-act="tsprint">Print / PDF</button></div>'+
    (J2.length?'<div class="tblw"><table class="tbl rsp" id="tsTbl"><thead><tr><th>Date</th><th>Job</th><th>On the way</th><th>Started</th><th>Finished</th><th style="text-align:right">Drive</th><th style="text-align:right">On site</th><th style="text-align:right">Paid hours</th><th style="text-align:right">Pay</th></tr></thead><tbody>'+
      J2.map(function(j){var t=jobTimes(j),h=jobHours(j,sel),p=jobTechPay(j),manual=num(j.techPay)>0;return '<tr class="clk" data-j="'+esc(j._id)+'"><td data-l="Date">'+nice(j.date)+'</td><td data-l="Job">'+esc(cname(j.customer))+'<br><small>'+esc(j.title||svcName(j.service))+'</small></td><td data-l="On the way">'+(j.onWayAt?niceT(j.onWayAt):"—")+'</td><td data-l="Started">'+(j.startedAt?niceT(j.startedAt):"—")+'</td><td data-l="Finished">'+(j.doneAt?niceT(j.doneAt):"—")+'</td><td data-l="Drive" style="text-align:right">'+fmtH(t.travel)+'</td><td data-l="On site" style="text-align:right">'+fmtH(t.onSite)+(t.adj!=null?' <small title="Corrected by the office">✎</small>':'')+'</td><td data-l="Paid hours" style="text-align:right"><b>'+(r.type==="hourly"?fmtH(h):"—")+'</b></td><td data-l="Pay" style="text-align:right">'+(p?money(p):"—")+(manual?'<br><small>set on job</small>':'')+'</td></tr>'}).join("")+
      '</tbody><tfoot><tr><td colspan="7"><b>Total — '+J2.length+' job(s)</b></td><td style="text-align:right"><b>'+(r.type==="hourly"?fmtH(tH):"—")+'</b></td><td style="text-align:right"><b>'+money(tP)+'</b></td></tr></tfoot></table></div>'+
      (J2.some(function(j){return !j.startedAt||!j.doneAt})?'<p class="mut tiny" style="margin:8px 0 0">Jobs without Start/Finish taps show “—”. Open the job to type the hours in “Correct the hours”.</p>':'')
     :'<div class="emp">No finished jobs for '+esc(tname(sel))+' in this period.</div>')+'</div>':'';
  return '<div class="card"><h3>How each technician is paid</h3>'+(rows?'<div class="tblw"><table class="tbl rsp"><thead><tr><th>Technician</th><th>Paid by</th><th>Counts</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':'<div class="emp">No technicians yet — add them in Team.</div>')+'</div>'+form+sheet+finTPayH()};

/* the technician's own page: hours this week / month (no rates shown) */
var myPayH=myPay;
myPay=function(){var em=myEm(),t=ymd(),dow=(new Date(t+"T12:00").getDay()+6)%7,wk=addDays(t,-dow),mm=t.slice(0,7);
  var mine=jobsMine().filter(function(j){return j.status==="done"}),sumH=function(a,b){return mine.filter(function(j){return inR(j.date,a,b)}).reduce(function(s,j){var x=jobTimes(j);return s+x.onSite+x.travel},0)};
  var last=mine.filter(function(j){return j.startedAt&&j.doneAt}).sort(function(a,b){return String(b.doneAt).localeCompare(String(a.doneAt))}).slice(0,10);
  return '<div class="card"><h3>My hours</h3><div class="kpis">'+kpi(fmtH(sumH(wk,t)),"This week (drive + on site)",C.pro)+kpi(fmtH(sumH(mm+"-01",endOf(mm))),"This month",C.rev)+'</div>'+
    (last.length?'<div class="tblw"><table class="tbl rsp"><thead><tr><th>Date</th><th>Job</th><th style="text-align:right">Drive</th><th style="text-align:right">On site</th></tr></thead><tbody>'+last.map(function(j){var x=jobTimes(j);return '<tr><td data-l="Date">'+nice(j.date)+'</td><td data-l="Job">'+esc(cname(j.customer))+'</td><td data-l="Drive" style="text-align:right">'+fmtH(x.travel)+'</td><td data-l="On site" style="text-align:right">'+fmtH(x.onSite)+'</td></tr>'}).join("")+'</tbody></table></div>':'<p class="mut">Tap <b>On the way</b>, <b>Start job</b> and <b>Finish job</b> on each job and your hours add up here.</p>')+'</div>'+myPayH()};

/* the office job form: time on the job + correction */
var sendTechH=sendTech;
sendTech=function(j){return hoursBox(j)+sendTechH(j)};
function hoursRefresh(id){setTimeout(function(){var c=document.querySelector('form[data-form=hadj][data-id="'+id+'"]');c=c&&c.closest(".card");var j=S.jobs.find(function(x){return x._id===id});if(c&&j)c.outerHTML=hoursBox(j)},400)}
function hoursBox(j){if(!j||!j._id)return "";j=S.jobs.find(function(x){return x._id===j._id})||j;var t=jobTimes(j),r=techRate(j.assignedEmail);
  return '<div class="card"><h3>Time on this job</h3><div class="kpis">'+kpi(fmtH(t.travel),"Drive",C.exp)+kpi(fmtH(t.site),"On site (from Start → Finish)",C.pro)+(t.adj!=null?kpi(fmtH(t.adj),"On site — corrected by office","#6b6f76"):"")+(can("finance")&&r.type==="hourly"?kpi(money(jobTechPay(j)),"Technician pay ("+money(r.rate)+"/h)",C.rev):"")+'</div>'+
    '<form data-form="hadj" data-id="'+esc(j._id)+'" style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;margin-top:6px"><label class="f" style="margin:0"><span>Correct the on-site hours <small>(if he forgot to tap Start or Finish)</small></span><input class="inp" name="h" type="number" step="0.25" min="0" max="24" value="'+(t.adj!=null?esc(t.adj):"")+'" placeholder="e.g. 2.5" style="max-width:140px"></label><button class="btn sm">Save hours</button>'+(t.adj!=null?'<button class="btn g sm" type="button" data-act="hclr" data-id="'+esc(j._id)+'">Use his taps</button>':'')+'</form></div>'}

var crmClickH=crmClick;
crmClick=function(e){var b=e.target.closest("[data-act]");if(b){var a=b.dataset.act;
  if(a==="trEdit"){S.trEdit=b.dataset.id;render();setTimeout(function(){var f=$("form[data-form=techrate]");f&&f.scrollIntoView({behavior:"smooth",block:"center"})},50);return true}
  if(a==="trCancel"){S.trEdit=null;render();return true}
  if(a==="hclr"){db.collection("jobs").doc(b.dataset.id).update({hoursAdj:"",updatedAt:J.now(),updatedBy:stamp()}).then(function(){toast("Using the technician's Start/Finish times");hoursRefresh(b.dataset.id)}).catch(fail);return true}
  if(a==="tscsv"){var T=techList(),sel=S.tpT||((T.find(function(x){return x.role==="technician"})||T[0]||{})._id||""),R=prange(S.fp);
    var J2=S.jobs.filter(function(j){return j.assignedEmail===sel&&j.status==="done"&&inR(j.date,R.a,R.b)});
    csv("timesheet-"+(tname(sel)||"tech").replace(/\W+/g,"-")+"-"+ymd()+".csv",[["Date","Customer","Job","On the way","Started","Finished","Drive (h)","On site (h)","Paid hours","Pay"]].concat(J2.map(function(j){var t=jobTimes(j);return [j.date,cname(j.customer),j.title||svcName(j.service),j.onWayAt||"",j.startedAt||"",j.doneAt||"",t.travel.toFixed(2),t.onSite.toFixed(2),jobHours(j,sel).toFixed(2),jobTechPay(j).toFixed(2)]})));return true}
  if(a==="tsprint"){var tb=$("#tsTbl");if(!tb){toast("No jobs to print");return true}var w=window.open("","_blank");if(!w){toast("Allow pop-ups to print");return true}
    w.document.write('<!doctype html><meta charset="utf-8"><title>Timesheet</title><style>body{font:13px/1.4 system-ui,sans-serif;margin:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;text-align:left}h1{font-size:18px}</style><h1>Jora Mechanical Systems — Timesheet: '+esc(tname(S.tpT||""))+' ('+esc(prange(S.fp).label)+')</h1>'+tb.outerHTML+'<script>print()<\/script>');w.document.close();return true}}
  return crmClickH(e)};
var crmSubmitH=crmSubmit;
crmSubmit=function(e){var f=e.target,k=f.dataset.form;
  if(k==="techrate"){e.preventDefault();var R=Object.assign({},(S.finS&&S.finS.techRates)||{});R[S.trEdit]={type:val(f,"type"),rate:num(val(f,"rate")),travel:!!f.elements.travel.checked,round:+val(f,"round")||0};
    if(R[S.trEdit].type==="hourly"&&!R[S.trEdit].rate){toast("Enter the hourly rate");return true}
    db.collection("finance").doc("settings").set({techRates:R,updatedAt:J.now(),updatedBy:stamp()},{merge:true}).then(function(){toast("Saved");S.trEdit=null}).catch(fail);return true}
  if(k==="hadj"){e.preventDefault();var v=val(f,"h");db.collection("jobs").doc(f.dataset.id).update({hoursAdj:v===""?"":num(v),updatedAt:J.now(),updatedBy:stamp()}).then(function(){toast("Hours saved");hoursRefresh(f.dataset.id)}).catch(fail);return true}
  return crmSubmitH(e)};
