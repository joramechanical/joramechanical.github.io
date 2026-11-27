/* ======================= QUOTATION BRAND OPTIONS (up to 5 units: brand, model #, photo, price, warranty) ======================= */
var BRANDS=["Lennox","Carrier","Trane","American Standard","KeepRite","Goodman","Amana","Daikin","Rheem","Ruud","York","Bryant","Payne","Napoleon","Luxaire","Mitsubishi","Fujitsu","LG","Samsung","Gree","Rinnai","Navien","Bradford White","Noritz","A.O. Smith","GSW","Giant","John Wood"];
var WDEF={wLab:"2 years",wParts:"10 years",wHx:"20 years",wOther:""};
S.units=[];
function newOpt(seed){return Object.assign({id:J.rid(8),brand:"",name:"",model:"",model2:"",eff:"",price:0,img:"",features:"",rec:false},WDEF,seed||{})}
function optEd(o,i,n){var ro=!can("work"),inp=function(k,label,ph,type,list){return '<label class="f"><span>'+label+'</span><input class="inp" name="o.'+k+'" value="'+esc(o[k]==null?"":o[k])+'"'+(ph?' placeholder="'+esc(ph)+'"':'')+(type?' type="'+type+'" step="0.01" min="0"':'')+(list?' list="'+list+'"':'')+'></label>'};
  return '<div class="opt" data-oi="'+i+'"><div class="opt-h"><b>Option '+(i+1)+'</b>'+(o.brand?' — '+esc(o.brand):'')+'<span class="opt-a">'+
    (i>0?'<button class="lnk" type="button" data-act="optup" data-i="'+i+'">↑ Move up</button>':'')+'<button class="lnk" type="button" data-act="optpick" data-i="'+i+'">✓ Customer chose this</button><button class="lnk" type="button" data-act="optsave" data-i="'+i+'">Save to my unit list</button><button class="lnk" type="button" data-act="optcopy" data-i="'+i+'">Copy</button><button class="lnk red" type="button" data-act="optdel" data-i="'+i+'">Remove</button></span></div>'+
    '<div class="opt-g"><div class="opt-ph">'+(o.img?'<img src="'+esc(o.img)+'" alt="">':'<div class="opt-noph">No photo</div>')+
      (ro?'':'<label class="btn g sm upl">'+ic("cam")+(o.img?"Change photo":"Add unit photo")+'<input type="file" accept="image/*" data-optimg="'+i+'" hidden></label>'+(o.img?'<button class="lnk" type="button" data-act="optnoimg" data-i="'+i+'">Remove photo</button>':''))+'</div>'+
    '<div><div class="grid2">'+inp("brand","Brand","e.g. Lennox","","brandList")+inp("name","Product name","e.g. 96% two-stage furnace")+'</div>'+
    '<div class="grid3">'+inp("model","Model #","e.g. EL296UH070XV36B")+inp("model2","2nd model # (AC / coil)","optional")+inp("eff","Size / efficiency","e.g. 60,000 BTU · 96% AFUE")+'</div>'+
    '<div class="grid2">'+inp("price","Installed price before tax ($)","","number")+'<label class="chk" style="margin-top:30px"><input type="checkbox" name="o.rec"'+(o.rec?" checked":"")+'> Mark as recommended</label></div>'+
    '<p class="lbl" style="margin:6px 0 4px">Warranty — change it for this unit</p><div class="grid4">'+inp("wLab","Labour","e.g. 2 years")+inp("wParts","Parts","e.g. 10 years")+inp("wHx","Heat exchanger","blank if none")+inp("wOther","Other","e.g. Compressor 10 years")+'</div>'+
    '<label class="f"><span>Highlights <small>— one per line</small></span><textarea class="inp" name="o.features" rows="3" placeholder="Quiet two-stage heat&#10;Variable-speed blower&#10;Wi-Fi thermostat included">'+esc(o.features||"")+'</textarea></label></div></div></div>'}
function optSection(q){var O=q.options||[],ro=!can("work");
  return '<h3 style="margin-top:8px">Brand options <small class="mut" style="font-weight:500;text-transform:none;letter-spacing:0">— up to 5 units in one quotation; the customer picks one</small></h3>'+
    '<datalist id="brandList">'+BRANDS.map(function(b){return '<option value="'+esc(b)+'">'}).join("")+'</datalist>'+
    '<div id="opts">'+O.map(function(o,i){return optEd(o,i,O.length)}).join("")+'</div>'+
    (ro?'':'<div class="acts" style="margin:6px 0 6px">'+(O.length<5?'<button class="btn sm" type="button" data-act="optadd">'+ic("plus")+'Add a brand option</button>':'<span class="mut tiny">5 options is the most.</span>')+
      (S.units.length&&O.length<5?'<select class="inp" data-optlib style="max-width:320px;min-height:34px"><option value="">Add from my unit list ('+S.units.length+')…</option>'+S.units.slice().sort(function(a,b){return (a.brand+a.name).localeCompare(b.brand+b.name)}).map(function(u){return '<option value="'+esc(u._id)+'">'+esc([u.brand,u.name,u.model].filter(Boolean).join(" · "))+(u.price?" — "+money(u.price):"")+'</option>'}).join("")+'</select>':'')+'</div>'+
      '<p class="mut tiny" style="margin:0 0 18px">'+(O.length?'Each option\'s total = its installed price + the lines below (labour, permit, thermostat…), then tax.':'No options = a normal one-price quotation using the lines below.')+(S.units.length?' Manage saved units in <b>my unit list</b> from any option.':'')+'</p>')}
var quoteEditorO=quoteEditor;
quoteEditor=function(){var h=quoteEditorO(),q=S.edit.data;var i=h.indexOf('<h3 style="margin-top:8px">Work</h3>');if(i<0)return h;
  h=h.slice(0,i)+optSection(q)+h.slice(i).replace('<h3 style="margin-top:8px">Work</h3>','<h3 style="margin-top:8px">'+((q.options||[]).length?'Included with every option':'Work')+'</h3>');return h};
var syncQuoteO=syncQuote;
syncQuote=function(){syncQuoteO();var q=S.edit&&S.edit.data;if(!q||!$("#opts"))return;var old=q.options||[];
  q.options=$$("#opts .opt").map(function(r,i){var g=function(k){var e=r.querySelector("[name='o."+k+"']");return e?e.value.trim():""},o=old[i]||newOpt();
    return Object.assign({},o,{brand:g("brand"),name:g("name"),model:g("model"),model2:g("model2"),eff:g("eff"),price:+g("price")||0,wLab:g("wLab"),wParts:g("wParts"),wHx:g("wHx"),wOther:g("wOther"),features:(r.querySelector("[name='o.features']")||{}).value||"",rec:!!(r.querySelector("[name='o.rec']")||{}).checked})})};
function optRedraw(){var q=S.edit.data,box=$("#opts");if(!box)return;var y=scrollY;render();scrollTo(0,y);qPreview()}
var crmClickQ=crmClick;
crmClick=function(e){var b=e.target.closest&&e.target.closest("[data-act]");if(!b||!S.edit||S.edit.kind!=="quote")return crmClickQ(e);var a=b.dataset.act,i=+b.dataset.i,q=S.edit.data;
  if(/^opt/.test(a))syncQuote();
  if(a==="optadd"){q.options=q.options||[];if(q.options.length>=5)return true;q.options.push(newOpt());optRedraw();setTimeout(function(){var L=$$("#opts .opt");if(L.length)L[L.length-1].scrollIntoView({behavior:"smooth",block:"center"})},60);return true}
  if(a==="optdel"){if(!confirmDo("Remove option "+(i+1)+(q.options[i].brand?" ("+q.options[i].brand+")":"")+"?"))return true;q.options.splice(i,1);optRedraw();return true}
  if(a==="optup"){var x=q.options.splice(i,1)[0];q.options.splice(i-1,0,x);optRedraw();return true}
  if(a==="optcopy"){if(q.options.length>=5){toast("5 options is the most");return true}var c=JSON.parse(JSON.stringify(q.options[i]));c.id=J.rid(8);c.rec=false;q.options.splice(i+1,0,c);optRedraw();toast("Copied — change the brand, model and price");return true}
  if(a==="optpick"){var po=q.options[i];if(!confirmDo("Mark option "+(i+1)+" ("+[po.brand,po.name].filter(Boolean).join(" ")+") as the customer's choice? The quotation becomes accepted."))return true;
    q.chosen=po.id;q.status="accepted";q.response=Object.assign({},q.response||{},{option:po.id,optionName:[po.brand,po.name,po.model?"("+po.model+")":""].filter(Boolean).join(" "),name:(q.response&&q.response.name)||"Office (by phone)",at:(q.response&&q.response.at)||J.now()});
    saveQuote().then(function(){toast("Marked as chosen — you can now book the job");render()}).catch(function(){});return true}
  if(a==="optnoimg"){q.options[i].img="";optRedraw();return true}
  if(a==="optsave"){var o=q.options[i];if(!o.brand&&!o.name){toast("Add the brand and product name first");return true}var u=JSON.parse(JSON.stringify(o));delete u.id;delete u.rec;u.updatedAt=J.now();u.by=stamp();
    var ex=S.units.find(function(x){return x.brand===o.brand&&x.model===o.model&&x.name===o.name});
    (ex?db.collection("units").doc(ex._id).set(u):db.collection("units").add(Object.assign(u,{createdAt:J.now()}))).then(function(){toast(ex?"Unit list updated":"Saved to your unit list — add it to any quote in one tap")}).catch(fail);return true}
  return crmClickQ(e)};
var crmChangeQ=crmChange;
crmChange=function(e){var t=e.target;
  if(t.dataset&&t.dataset.optlib!==undefined){var u=S.units.find(function(x){return x._id===t.value});if(!u)return true;syncQuote();var q=S.edit.data;q.options=q.options||[];if(q.options.length<5){var o=JSON.parse(JSON.stringify(u));delete o._id;delete o.createdAt;delete o.updatedAt;delete o.by;q.options.push(newOpt(o));optRedraw();toast("Added "+[u.brand,u.name].filter(Boolean).join(" "))}return true}
  if(t.dataset&&t.dataset.optimg!==undefined){var i=+t.dataset.optimg,f=t.files&&t.files[0];if(!f)return true;syncQuote();toast("Adding photo…");
    J.shrinkImage(f,700,.75).then(function(d){return d.length>160000?J.shrinkImage(f,520,.68):d}).then(function(d){S.edit.data.options[i].img=d;optRedraw()}).catch(fail);return true}
  return crmChangeQ(e)};
var crmSubscribeQ=crmSubscribe;
crmSubscribe=function(){var r=crmSubscribeQ();if(!r&&can("work"))sub(db.collection("units").limit(400),"units");return r};
