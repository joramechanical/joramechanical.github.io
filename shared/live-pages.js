/* ---------- articles & custom pages written in the office panel (overrides the basic versions in live.js) ---------- */
var LP_MAN=null;
function lpBase(){try{return new URL(ROOT,location.href).href}catch(e){return ""}}
function lpToday(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
fetch(ROOT+"blog/live-posts.json",{cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(m){LP_MAN=m||{};if(window.__liveFetched)liveContent(window.__live)}).catch(function(){LP_MAN={}});
function livePosts(P){var t=lpToday();return (P.posts||[]).filter(function(x){return x&&x.id&&!x.off&&x.title&&(!x.date||x.date<=t)}).sort(function(a,b){return String(b.date||"").localeCompare(String(a.date||""))})}
function lpStatic(kind,x){var L=LP_MAN&&LP_MAN[kind];return x.slug&&L&&L.indexOf(x.slug)>-1}
function livePostURL(id){var P=window.__live||{},x=(P.posts||[]).find(function(q){return q.id===id});if(x&&lpStatic("posts",x))return ROOT+"blog/"+x.slug+"/"+LINKS.idx;return ROOT+"blog/post/"+LINKS.idx+"?id="+encodeURIComponent(id)}
function livePageURL(x){return lpStatic("pages",x)?ROOT+"page/"+x.slug+"/"+LINKS.idx:ROOT+"page/"+LINKS.idx+"?p="+encodeURIComponent(x.slug)}
function lpMeta(name,val,prop){if(!val)return;var sel=prop?'meta[property="'+name+'"]':'meta[name="'+name+'"]',m=document.querySelector(sel);if(!m){m=document.createElement("meta");m.setAttribute(prop?"property":"name",name);document.head.appendChild(m)}m.setAttribute("content",val)}
function lpCanon(u){var l=document.querySelector('link[rel="canonical"]');if(!l){l=document.createElement("link");l.rel="canonical";document.head.appendChild(l)}l.href=u}
function lpLD(o){var s=document.getElementById("lpld");if(!s){s=document.createElement("script");s.type="application/ld+json";s.id="lpld";document.head.appendChild(s)}s.textContent=JSON.stringify(o)}
function lpShare(url,title){var u=encodeURIComponent(url),t=encodeURIComponent(title);return '<div class="lp-share"><span>Share</span><a href="https://wa.me/?text='+t+'%20'+u+'" target="_blank" rel="noopener">WhatsApp</a><a href="https://www.facebook.com/sharer/sharer.php?u='+u+'" target="_blank" rel="noopener">Facebook</a><a href="mailto:?subject='+t+'&body='+u+'">Email</a><button type="button" data-copy="'+esc(url)+'">Copy link</button></div>'}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-copy]");if(!b)return;try{navigator.clipboard.writeText(b.dataset.copy);b.textContent="Link copied ✓"}catch(x){}});
function lpArticle(x,L,abs){var words=joraWords(x.body),mins=Math.max(1,Math.round(words/220)),rel=L.filter(function(q){return q.id!==x.id&&q.tag===x.tag}).concat(L.filter(function(q){return q.id!==x.id&&q.tag!==x.tag})).slice(0,3);
  return '<nav class="crumbs" aria-label="Breadcrumb"><a href="'+ROOT+LINKS.idx+'">Home</a> › <a href="'+ROOT+'blog/'+LINKS.idx+'">Advice</a> › <span>'+esc(x.title)+'</span></nav>'+
   '<article class="lpost"><span class="kick">'+esc(x.tag||"Advice")+'</span><h1>'+esc(x.title)+'</h1><p class="lp-meta">'+esc(x.date||"")+' · '+mins+' min read · Jora Mechanical Systems</p>'+
   (x.imgDoc?'<img class="lp-img" data-pimg="'+esc(x.imgDoc)+'" src="'+((window.__pimg||{})[x.imgDoc]||liveBlank())+'" alt="'+esc(x.imgAlt||x.title)+'">':'')+
   (x.excerpt?'<p class="lead">'+esc(x.excerpt)+'</p>':'')+'<div class="md">'+joraMD(x.body)+'</div>'+
   '<div class="phero-ctas" style="margin-top:26px"><button class="btn" type="button" data-open="quote">Get a free quote</button><a class="btn wk" href="tel:+19056672823">Call 905-667-2823</a></div>'+lpShare(abs,x.title)+'</article>'+
   (rel.length?'<aside class="lp-rel"><h2 class="h2">More advice</h2><div class="blog">'+rel.map(livePostCard).join("")+'</div></aside>':'')}
function lpFooter(P){var C=(P.cpages||[]).filter(function(x){return x&&!x.off&&x.slug&&x.title&&x.footer});$$(".lp-flinks").forEach(function(n){n.remove()});if(!C.length)return;
  var p=document.querySelector(".foot .fg > div:first-child p:last-of-type");if(p)p.insertAdjacentHTML("afterend",'<p class="lp-flinks" style="margin:6px 0 0">'+C.map(function(x){return '<a href="'+livePageURL(x)+'">'+esc(x.nav||x.title)+'</a>'}).join(" · ")+'</p>')}
function liveContent(P){P=P||{};liveSEO(P);var L=livePosts(P);lpFooter(P);
  [["#blogAll",99],["#blogGrid",3]].forEach(function(g){var el=$(g[0]);if(!el)return;$$('[data-live]',el).forEach(function(x){x.remove()});if(!L.length)return;
    el.insertAdjacentHTML("afterbegin",L.slice(0,g[1]).map(livePostCard).join(""));if(g[1]<99){$$(".post",el).slice(g[1]).forEach(function(c){c.remove()})}
    L.forEach(function(x){if(x.imgDoc)livePimg(x.imgDoc)})});
  if(has("#postItem")){var id=(/[?&]id=([^&]+)/.exec(location.search)||[])[1],x=id&&L.find(function(q){return q.id===decodeURIComponent(id)}),box=$("#postItem");
    if(!x){box.innerHTML=window.__liveFetched?'<h1 class="h2">Article not found</h1><p>It may have been removed. <a href="'+ROOT+'blog/'+LINKS.idx+'">See all articles</a>.</p>':'<p style="color:#666">Loading…</p>';return}
    var abs=x.slug?lpBase()+"blog/"+x.slug+"/":location.href;document.title=(x.seoTitle||x.title)+" | Jora Mechanical Systems";lpMeta("description",x.excerpt||x.title);lpMeta("og:title",x.title,1);lpMeta("og:description",x.excerpt||"",1);lpMeta("og:type","article",1);
    if(x.slug)lpCanon(abs);lpLD({"@context":"https://schema.org","@type":"BlogPosting",headline:x.title,description:x.excerpt||"",datePublished:x.date||"",dateModified:x.updated||x.date||"",author:{"@type":"Organization",name:"Jora Mechanical Systems"},publisher:{"@type":"Organization",name:"Jora Mechanical Systems"},mainEntityOfPage:abs});
    box.innerHTML=lpArticle(x,L,abs);if(x.imgDoc)livePimg(x.imgDoc);L.forEach(function(q){if(q.imgDoc)livePimg(q.imgDoc)})}
  if(has("#cpItem")){var sl=decodeURIComponent((/[?&]p=([^&]+)/.exec(location.search)||[])[1]||""),c=(P.cpages||[]).find(function(q){return q&&!q.off&&q.slug===sl}),cb=$("#cpItem");
    if(!c){cb.innerHTML=window.__liveFetched?'<h1 class="h2">Page not found</h1><p><a href="'+ROOT+LINKS.idx+'">Back to the home page</a></p>':'<p style="color:#666">Loading…</p>';return}
    document.title=(c.seoTitle||c.title)+" | Jora Mechanical Systems";lpMeta("description",c.desc||c.intro||c.title);lpCanon(lpBase()+"page/"+c.slug+"/");
    cb.innerHTML=lpPage(c);if(c.imgDoc)livePimg(c.imgDoc)}}
function lpPage(c){return '<nav class="crumbs" aria-label="Breadcrumb"><a href="'+ROOT+LINKS.idx+'">Home</a> › <span>'+esc(c.title)+'</span></nav><article class="lpost cpage"><h1>'+esc(c.heading||c.title)+'</h1>'+(c.intro?'<p class="lead">'+esc(c.intro)+'</p>':'')+
  (c.imgDoc?'<img class="lp-img" data-pimg="'+esc(c.imgDoc)+'" src="'+((window.__pimg||{})[c.imgDoc]||liveBlank())+'" alt="'+esc(c.title)+'">':'')+'<div class="md">'+joraMD(c.body)+'</div>'+
  (c.cta!==false?'<div class="phero-ctas" style="margin-top:26px"><button class="btn" type="button" data-open="quote">Get a free quote</button><a class="btn wk" href="tel:+19056672823">Call 905-667-2823</a></div>':'')+'</article>'}
