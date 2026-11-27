
/* ======================= INNER PAGES ======================= */
/* illustrations for products without a photo */
$$("[data-ill]").forEach(function(el){el.innerHTML=illFor({cat:el.dataset.ill,brand:el.dataset.brand})});
/* brand filter on category pages */
document.addEventListener("click",function(e){var b=e.target.closest("[data-pf]");if(!b)return;var g=b.closest(".pfilter"),v=b.dataset.pf;
  $$("button",g).forEach(function(x){x.setAttribute("aria-pressed",x===b)});
  var grid=g.closest(".wrap").querySelector(".pgrid");$$(".pc",grid).forEach(function(c){c.hidden=v!=="All"&&c.dataset.brand!==v})});
/* 3D tilt on page visuals */
$$(".phero-v,.prod-v").forEach(function(v){var t=$(".tilt",v);if(!t)return;
  v.addEventListener("pointermove",function(e){if(e.pointerType!=="mouse")return;var r=v.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform="rotateY("+(x*22)+"deg) rotateX("+(-y*14)+"deg)"});
  v.addEventListener("pointerleave",function(){t.style.transform=""})});
/* free-quote page opens the form */
if(document.body.dataset.autoquote)setTimeout(function(){openWizard(null)},400);
/* hero "see full details" goes to the product page */
(function(){var m=$("#jx-more");if(!m)return;m.addEventListener("click",function(e){var u=L("product",m.dataset.product);if(u){e.stopPropagation();location.href=u}},true)})();
/* brand from the menu: furnaces/#brand=Lennox */
(function(){var m=/brand=([^&]+)/.exec(location.hash);if(!m)return;var b=decodeURIComponent(m[1].replace(/\+/g," "));var btn=$$('.pfilter [data-pf]').find(function(x){return x.dataset.pf===b});if(btn){btn.click();setTimeout(function(){btn.scrollIntoView({block:"center"})},100)}})();
/* top menu: categories open a panel with brands & models */
(function(){var bs=$$(".mm-b");if(!bs.length)return;var open=null;
  function shut(){if(!open)return;open.b.setAttribute("aria-expanded","false");open.p.hidden=true;open.p.classList.remove("in");document.body.classList.remove("mega-on");open=null}
  function show(b){var p=$("#mega-"+b.dataset.mega);if(open&&open.b===b){shut();return}shut();b.setAttribute("aria-expanded","true");p.hidden=false;void p.offsetWidth;p.classList.add("in");document.body.classList.add("mega-on");open={b:b,p:p}}
  bs.forEach(function(b){b.addEventListener("click",function(e){e.stopPropagation();show(b)})});
  document.addEventListener("click",function(e){if(open&&!e.target.closest(".mega"))shut()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&open){var b=open.b;shut();b.focus()}});
  $$(".mega [data-svc]").forEach(function(x){x.addEventListener("click",shut)});
  /* moving to another page's brand on the same page: re-apply the filter */
  addEventListener("hashchange",function(){var m=/brand=([^&]+)/.exec(location.hash);if(!m)return;shut();var b=decodeURIComponent(m[1].replace(/\+/g," "));var btn=$$('.pfilter [data-pf]').find(function(x){return x.dataset.pf===b});if(btn){btn.click();btn.scrollIntoView({block:"center"})}});
})();
/* back to top */
(function(){var t=$(".totop");if(!t)return;function f(){t.classList.toggle("on",scrollY>700)}addEventListener("scroll",f,{passive:true});f();t.onclick=function(){scrollTo({top:0,behavior:reduce?"auto":"smooth"});$(".logo").focus()}})();
