/* Jora article formatting (used by the website, the office panel preview and the publishing robot) */
function joraSlug(s){return String(s||"").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g,"").replace(/&/g," and ").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,70)||"article"}
function joraMD(src,opt){opt=opt||{};var E=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})};
  var inl=function(t){t=E(t);t=t.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|\.\.?\/|tel:|mailto:|#)[^)\s]*)\)/g,function(m,a,u){var ext=/^https?:/.test(u)&&u.indexOf("joramechanicalsystems.com")<0;return '<a href="'+u+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+a+'</a>'});
    return t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g,"$1<em>$2</em>")};
  var out=[],blocks=String(src||"").replace(/\r/g,"").split(/\n\s*\n/);
  var block=function(L){if(!L.length)return;var b=L.join("\n"),m;
    if(/^#{1,3}\s/.test(L[0])){var h=/^###\s/.test(L[0])?"h3":"h2";out.push("<"+h+">"+inl(L[0].replace(/^#+\s*/,""))+"</"+h+">");return block(L.slice(1))}
    if((m=b.match(/^\s*\[button(?::\s*([^\]]*))?\]\s*$/i))){out.push('<p class="md-cta"><button class="btn" type="button" data-open="quote">'+E(m[1]||"Get a free quote")+'</button></p>');return}
    if(L.every(function(l){return /^\s*[-*\u2022]\s+/.test(l)})){out.push("<ul>"+L.map(function(l){return "<li>"+inl(l.replace(/^\s*[-*\u2022]\s+/,""))+"</li>"}).join("")+"</ul>");return}
    if(L.every(function(l){return /^\s*\d+[.)]\s+/.test(l)})){out.push("<ol>"+L.map(function(l){return "<li>"+inl(l.replace(/^\s*\d+[.)]\s+/,""))+"</li>"}).join("")+"</ol>");return}
    if(L.every(function(l){return /^\s*>/.test(l)})){out.push("<blockquote>"+inl(L.map(function(l){return l.replace(/^\s*>\s?/,"")}).join(" "))+"</blockquote>");return}
    out.push("<p>"+L.map(inl).join("<br>")+"</p>")};
  blocks.forEach(function(b){b=b.replace(/^\n+|\n+$/g,"");if(b.trim())block(b.split("\n"))});
  return out.join("\n")}
function joraWords(src){return (String(src||"").replace(/[#*>\[\]()_-]/g," ").match(/\b[\w'’]+\b/g)||[]).length}
