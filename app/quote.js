/* Jora Mechanical — customer quotation page (view, print, accept) */
(function(){
"use strict";
var J=window.JDB,db=J.db,esc=J.esc,money=J.money,IDX=window.JORA_IDX||"";
var $=function(s){return document.querySelector(s)};
var ROOT="../",LOGO=ROOT+"assets/logo.png",id=decodeURIComponent((/[?&]id=([^&]+)/.exec(location.search)||[])[1]||""),preview=/[?&]preview=1/.test(location.search),autoPrint=/[?&]print=1/.test(location.search);
var box=$("#q");
function toast(m){var t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(t._h);t._h=setTimeout(function(){t.classList.remove("on")},3500)}
function show(q){var site=ROOT+(q.region==="sk"?"saskatchewan/":"gta/")+IDX,t=J.quoteTotals(q);document.title="Quotation "+(q.number||"")+" — Jora Mechanical Systems";
  $("#back").href=site;
  var st=q.status,act="";
  if(!preview&&st==="sent")act='<div class="card qactions"><h3>Happy with this quote?</h3><p class="mut" style="margin-top:-6px">Accept it here and we\'ll call you to book a date'+(t.deposit?' and arrange the deposit of <b>'+money(t.deposit)+'</b>':'')+'.</p>'+
    '<form id="af"><div class="grid2"><label class="f"><span>Your name</span><input class="inp" name="name" value="'+esc(q.customer&&q.customer.name||"")+'" required></label><label class="f"><span>Message <small>(optional)</small></span><input class="inp" name="note" placeholder="Best days, questions…"></label></div>'+
    '<div class="acts"><button class="btn ok" name="go" value="accepted">✓ Accept quotation</button><button class="btn g" name="go" value="declined" type="submit">Decline</button><button class="btn g" type="button" id="pr">Print / save PDF</button></div></form></div>';
  else if(st==="accepted")act='<div class="card qactions" style="border-color:#bfe3c3;background:#f3fbf4"><h3 style="color:#1b5e20">✓ Accepted'+(q.response&&q.response.at?' on '+new Date(q.response.at).toLocaleDateString("en-CA",{month:"long",day:"numeric",year:"numeric"}):'')+'</h3><p style="margin:0">Thank you! We\'ll be in touch to book your installation. Questions? Call <a href="tel:+19056672823">905-667-2823</a>.</p><div class="acts" style="margin-top:14px"><button class="btn g" type="button" id="pr">Print / save PDF</button></div></div>';
  else if(st==="declined")act='<div class="card qactions"><h3>Quotation declined</h3><p style="margin:0">Changed your mind or want a different option? Call <a href="tel:+19056672823">905-667-2823</a> — happy to help.</p></div>';
  else act='<div class="card qactions"><div class="acts"><button class="btn g" type="button" id="pr">Print / save PDF</button></div></div>';
  box.innerHTML=act+J.quoteHTML(q,{logo:LOGO,status:true});
  var pr=$("#pr");if(pr)pr.onclick=function(){window.print()};
  var f=$("#af");if(f){var choice="accepted";f.addEventListener("click",function(e){var b=e.target.closest("button[name=go]");if(b)choice=b.value});
    f.onsubmit=function(e){e.preventDefault();var name=f.elements.name.value.trim();if(!name){f.elements.name.focus();return}if(choice==="declined"&&!confirm("Decline this quotation?"))return;
      var resp={name:name,note:f.elements.note.value.trim(),at:J.now()};[].forEach.call(f.querySelectorAll("button"),function(b){b.disabled=true});
      db.collection("quotes").doc(id).update({status:choice,response:resp}).then(function(){q.status=choice;q.response=resp;show(q);scrollTo(0,0);toast(choice==="accepted"?"Thank you! Your quotation is accepted.":"Got it — thanks for letting us know.");
        J.notifyOffice("Quotation "+q.number+" "+choice.toUpperCase()+" — "+name,{name:name,email:q.customer&&q.customer.email||"",phone:q.customer&&q.customer.phone||"",message:"Quotation "+q.number+" was "+choice+" online.\n\nCustomer: "+name+"\nTotal: "+money(t.total)+"\nMessage: "+(resp.note||"—")})})
      .catch(function(x){toast(J.friendlyError(x));[].forEach.call(f.querySelectorAll("button"),function(b){b.disabled=false})})}}
  if(autoPrint)setTimeout(function(){window.print()},500)}
if(!id){box.innerHTML='<div class="emp">This link is missing the quotation number. Please use the link from your email, or call 905-667-2823.</div>';return}
db.collection("quotes").doc(id).get().then(function(s){if(!s.exists){box.innerHTML='<div class="emp"><h3>Quotation not found</h3><p>The link may be incomplete'+(J.demo?' (demo quotes only open in the browser that made them)':'')+'. Please call <a href="tel:+19056672823">905-667-2823</a>.</p></div>';return}show(s.data())})
  .catch(function(x){box.innerHTML='<div class="emp">'+esc(J.friendlyError(x))+'</div>'});
})();
