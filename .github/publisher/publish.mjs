// Jora publishing robot — runs on GitHub every hour (and after each deploy).
// Reads the articles and pages written in the office panel (public Firestore data)
// and writes real, Google-indexable HTML pages, cover images and sitemap entries.
import fs from "node:fs";import path from "node:path";import vm from "node:vm";
const ROOT=process.cwd(),SITE="https://joramechanicalsystems.com/",PROJECT="jora-mechanical";
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(new URL("./md.js",import.meta.url),"utf8"),ctx);const {joraMD,joraWords}=ctx;
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const conv=v=>"stringValue" in v?v.stringValue:"integerValue" in v?Number(v.integerValue):"doubleValue" in v?v.doubleValue:"booleanValue" in v?v.booleanValue:"timestampValue" in v?v.timestampValue:"arrayValue" in v?(v.arrayValue.values||[]).map(conv):"mapValue" in v?Object.fromEntries(Object.entries(v.mapValue.fields||{}).map(([k,x])=>[k,conv(x)])):null;
const MOCK=process.env.JORA_MOCK?JSON.parse(fs.readFileSync(process.env.JORA_MOCK,"utf8")):null;
async function getDoc(p){if(MOCK){const [c,id]=p.split("/");return (MOCK[c]||{})[id]||null}const r=await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${p}`);if(r.status===404)return null;if(!r.ok)throw new Error(p+" "+r.status);const j=await r.json();return conv({mapValue:{fields:j.fields||{}}})}
const today=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Karachi",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const read=f=>{try{return fs.readFileSync(path.join(ROOT,f),"utf8")}catch{return null}};
function fill(tpl,o){let h=tpl;const rep=(re,s)=>{h=h.replace(re,s)};
  rep(/<title>[^<]*<\/title>/,`<title>${E(o.title)} | Jora Mechanical Systems</title>`);
  rep(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${E(o.desc)}">`);
  rep(/<link rel="canonical" href="[^"]*">/,`<link rel="canonical" href="${o.url}">`);
  rep(/<meta name="robots" content="[^"]*">/,`<meta name="robots" content="index,follow,max-image-preview:large">`);
  rep(/<meta property="og:type" content="[^"]*">/,`<meta property="og:type" content="${o.type||"article"}">`);
  rep(/<meta property="og:title" content="[^"]*">/,`<meta property="og:title" content="${E(o.title)}">`);
  rep(/<meta property="og:description" content="[^"]*">/,`<meta property="og:description" content="${E(o.desc)}">`);
  rep(/<meta property="og:url" content="[^"]*">/,`<meta property="og:url" content="${o.url}">`);
  if(o.image)rep(/<meta property="og:image" content="[^"]*">/,`<meta property="og:image" content="${o.image}">`);
  h=h.replace("</head>",`<script type="application/ld+json">${JSON.stringify(o.ld).replace(/</g,"\\u003c")}</script></head>`);
  const box=/<div class="wrap narrow" id="postItem">[\s\S]*?<\/div><\/section>/;if(!box.test(h))throw new Error("template changed");
  return h.replace(box,`<div class="wrap narrow" id="postStatic">${o.body}</div></section>`)}
function img(dataUrl,file){const m=/^data:(image\/(jpeg|png|webp));base64,(.+)$/.exec(dataUrl||"");if(!m)return "";const ext=m[2]==="jpeg"?"jpg":m[2];fs.writeFileSync(file+"."+ext,Buffer.from(m[3],"base64"));return path.basename(file)+"."+ext}
const ctas='<div class="phero-ctas" style="margin-top:26px"><button class="btn" type="button" data-open="quote">Get a free quote</button><a class="btn wk" href="tel:+19056672823">Call 905-667-2823</a></div>';
let changed=0;
for(const [r,dir] of [["gta","gta"],["sk","saskatchewan"]]){
  const P=await getDoc("public/"+r);if(!P){console.log("no data for",r);continue}
  const tpl=read(`${dir}/blog/post/index.html`);if(!tpl){console.log("no template for",dir);continue}
  const manF=`${dir}/blog/live-posts.json`,old=JSON.parse(read(manF)||'{"posts":[],"pages":[]}'),man={posts:[],pages:[],at:new Date().toISOString()},urls=[];
  const posts=(P.posts||[]).filter(x=>x&&!x.off&&x.title&&x.slug&&(!x.date||x.date<=today)).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  for(const x of posts){const rel=`${dir}/blog/${x.slug}`,abs=path.join(ROOT,rel);if(fs.existsSync(abs)&&!old.posts.includes(x.slug))continue;fs.mkdirSync(abs,{recursive:true});
    let cover="";if(x.imgDoc){try{const d=await getDoc("pimg/"+x.imgDoc);cover=img(d&&d.data,path.join(abs,"cover"))}catch(e){console.log("image",e.message)}}
    const url=SITE+rel+"/",words=joraWords(x.body),others=posts.filter(q=>q.id!==x.id).slice(0,3);
    const body=`<nav class="crumbs" aria-label="Breadcrumb"><a href="../../">Home</a> › <a href="../">Advice</a> › <span>${E(x.title)}</span></nav><article class="lpost"><span class="kick">${E(x.tag||"Advice")}</span><h1>${E(x.title)}</h1><p class="lp-meta">${E(x.date||"")} · ${Math.max(1,Math.round(words/220))} min read · Jora Mechanical Systems</p>`+
      (cover?`<img class="lp-img" src="${cover}" alt="${E(x.imgAlt||x.title)}" width="1400" height="788">`:"")+(x.excerpt?`<p class="lead">${E(x.excerpt)}</p>`:"")+`<div class="md">${joraMD(x.body)}</div>${ctas}</article>`+
      (others.length?`<aside class="lp-rel"><h2 class="h2">More advice</h2><ul class="lp-more">${others.map(q=>`<li><a href="../${q.slug}/">${E(q.title)}</a></li>`).join("")}</ul></aside>`:"");
    const html=fill(tpl,{title:x.title,desc:x.excerpt||x.title,url,image:cover?url+cover:"",body,ld:{"@context":"https://schema.org","@type":"BlogPosting",headline:x.title,description:x.excerpt||"",datePublished:x.date,dateModified:x.updated||x.date,image:cover?url+cover:undefined,author:{"@type":"Organization",name:"Jora Mechanical Systems",url:SITE},publisher:{"@type":"Organization",name:"Jora Mechanical Systems"},mainEntityOfPage:url,wordCount:words}});
    const f=path.join(abs,"index.html");if(read(path.relative(ROOT,f))!==html){fs.writeFileSync(f,html);changed++}man.posts.push(x.slug);urls.push([url,x.updated||x.date])}
  const pages=(P.cpages||[]).filter(x=>x&&!x.off&&x.title&&x.slug);
  for(const x of pages){const rel=`${dir}/page/${x.slug}`,abs=path.join(ROOT,rel);if(fs.existsSync(abs)&&!old.pages.includes(x.slug))continue;fs.mkdirSync(abs,{recursive:true});
    let cover="";if(x.imgDoc){try{const d=await getDoc("pimg/"+x.imgDoc);cover=img(d&&d.data,path.join(abs,"photo"))}catch(e){}}
    const url=SITE+rel+"/";
    const body=`<nav class="crumbs" aria-label="Breadcrumb"><a href="../../">Home</a> › <span>${E(x.title)}</span></nav><article class="lpost cpage"><h1>${E(x.heading||x.title)}</h1>`+(x.intro?`<p class="lead">${E(x.intro)}</p>`:"")+(cover?`<img class="lp-img" src="${cover}" alt="${E(x.title)}">`:"")+`<div class="md">${joraMD(x.body)}</div>${x.cta===false?"":ctas}</article>`;
    const html=fill(tpl,{title:x.title,desc:x.desc||x.intro||x.title,url,type:"website",image:cover?url+cover:"",body,ld:{"@context":"https://schema.org","@type":"WebPage",name:x.title,description:x.desc||x.intro||"",url}});
    const f=path.join(abs,"index.html");if(read(path.relative(ROOT,f))!==html){fs.writeFileSync(f,html);changed++}man.pages.push(x.slug);urls.push([url,x.updated||today])}
  for(const s of old.posts)if(!man.posts.includes(s)){fs.rmSync(path.join(ROOT,dir,"blog",s),{recursive:true,force:true});changed++}
  for(const s of old.pages)if(!man.pages.includes(s)){fs.rmSync(path.join(ROOT,dir,"page",s),{recursive:true,force:true});changed++}
  const smF=`${dir}/sitemap.xml`,sm=read(smF);if(sm){const block=`<!--panel-->${urls.map(([u,d])=>`<url><loc>${u}</loc>${d?`<lastmod>${d}</lastmod>`:""}</url>`).join("")}<!--/panel-->`;
    const nsm=sm.replace(/<!--panel-->[\s\S]*?<!--\/panel-->/,"").replace("</urlset>",block+"</urlset>");if(nsm!==sm){fs.writeFileSync(path.join(ROOT,smF),nsm);changed++}}
  const ms=JSON.stringify({posts:man.posts,pages:man.pages});if(JSON.stringify({posts:old.posts,pages:old.pages})!==ms||!read(manF)){fs.writeFileSync(path.join(ROOT,manF),JSON.stringify(man));changed++}
  console.log(dir,"posts",man.posts.length,"pages",man.pages.length)}
console.log("changed files:",changed);
