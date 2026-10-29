/* Jora Mechanical — realistic 3D solution models (home / commercial / industrial).
   Uses three.js r128. If WebGL or three.js is not available, the drawn SVG stays. */
(function(){
"use strict";
var stage=document.getElementById("solStage");if(!stage||!window.THREE)return;
try{var tc=document.createElement("canvas");if(!(tc.getContext("webgl")||tc.getContext("experimental-webgl")))return}catch(e){return}
var T=THREE,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var renderer=null,scene=null,camera=null,cur=null,holder=null,updaters=[],yaw=0.75,pitch=0.36,dist=34,target=new T.Vector3(0,3,0),auto=!reduce,drag=null,visible=true,last=performance.now(),idle=0;

/* ---------- procedural textures ---------- */
function canvasTex(w,h,draw,rx,ry){var c=document.createElement("canvas");c.width=w;c.height=h;var g=c.getContext("2d");draw(g,w,h);var t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx||1,ry||1);t.encoding=T.sRGBEncoding;t.anisotropy=4;return t}
function noise(g,w,h,a,col){for(var i=0;i<w*h/18;i++){g.fillStyle=col||("rgba(0,0,0,"+(Math.random()*a)+")");g.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}}
var TEX={};
function tex(k){if(TEX[k])return TEX[k];var t;
  if(k==="siding")t=canvasTex(256,256,function(g,w,h){g.fillStyle="#d9d4c8";g.fillRect(0,0,w,h);for(var y=0;y<h;y+=16){var gr=g.createLinearGradient(0,y,0,y+16);gr.addColorStop(0,"#ece8de");gr.addColorStop(.85,"#d3cdbf");gr.addColorStop(1,"#a9a294");g.fillStyle=gr;g.fillRect(0,y,w,16)}noise(g,w,h,.06)},2,2);
  if(k==="siding2")t=canvasTex(256,256,function(g,w,h){g.fillStyle="#5d6f7d";g.fillRect(0,0,w,h);for(var y=0;y<h;y+=16){var gr=g.createLinearGradient(0,y,0,y+16);gr.addColorStop(0,"#71828f");gr.addColorStop(.85,"#5a6b78");gr.addColorStop(1,"#3e4b55");g.fillStyle=gr;g.fillRect(0,y,w,16)}noise(g,w,h,.07)},2,2);
  if(k==="shingle")t=canvasTex(256,256,function(g,w,h){g.fillStyle="#3a3633";g.fillRect(0,0,w,h);for(var y=0;y<h;y+=16){for(var x=(y/16%2)*16-16;x<w;x+=32){var v=40+Math.random()*25;g.fillStyle="rgb("+v+","+(v-4)+","+(v-8)+")";g.fillRect(x+1,y+1,30,14)}g.fillStyle="rgba(0,0,0,.45)";g.fillRect(0,y+14,w,2)}noise(g,w,h,.15)},3,3);
  if(k==="snow")t=canvasTex(512,512,function(g,w,h){g.fillStyle="#f4f8fc";g.fillRect(0,0,w,h);for(var i=0;i<900;i++){var r=Math.random()*14;g.fillStyle="rgba(160,185,215,"+(Math.random()*.08)+")";g.beginPath();g.arc(Math.random()*w,Math.random()*h,r,0,7);g.fill()}noise(g,w,h,.03)},8,8);
  if(k==="asphalt")t=canvasTex(256,256,function(g,w,h){g.fillStyle="#4a4c50";g.fillRect(0,0,w,h);noise(g,w,h,.35);noise(g,w,h,.2,"rgba(255,255,255,.05)")},6,6);
  if(k==="brick")t=canvasTex(256,256,function(g,w,h){g.fillStyle="#cfc6bb";g.fillRect(0,0,w,h);for(var y=0;y<h;y+=16)for(var x=(y/16%2)*20-20;x<w;x+=40){var r=150+Math.random()*30;g.fillStyle="rgb("+r+","+(r*.48|0)+","+(r*.36|0)+")";g.fillRect(x+2,y+2,36,12)}noise(g,w,h,.12)},4,2);
  if(k==="metal")t=canvasTex(256,256,function(g,w,h){var gr=g.createLinearGradient(0,0,32,0);gr.addColorStop(0,"#b7bec5");gr.addColorStop(.5,"#e6eaee");gr.addColorStop(.62,"#9aa2aa");gr.addColorStop(1,"#c9cfd5");for(var x=0;x<w;x+=32){g.save();g.translate(x,0);g.fillStyle=gr;g.fillRect(0,0,32,h);g.restore()}noise(g,w,h,.05)},6,1);
  if(k==="corr")t=canvasTex(128,128,function(g,w,h){for(var y=0;y<h;y+=8){var gr=g.createLinearGradient(0,y,0,y+8);gr.addColorStop(0,"#dfe4e8");gr.addColorStop(.5,"#9ea7b0");gr.addColorStop(1,"#e9edf0");g.fillStyle=gr;g.fillRect(0,y,w,8)}},6,6);
  if(k==="gdoor")t=canvasTex(256,256,function(g,w,h){g.fillStyle="#f1f1ee";g.fillRect(0,0,w,h);for(var y=0;y<4;y++)for(var x=0;x<4;x++){g.fillStyle="#e2e2dd";g.fillRect(x*64+6,y*64+8,52,48);g.strokeStyle="#c4c4bd";g.lineWidth=3;g.strokeRect(x*64+6,y*64+8,52,48)}for(y=1;y<4;y++){g.fillStyle="#b9b9b2";g.fillRect(0,y*64-1,w,3)}},1,1);
  if(k==="odoor")t=canvasTex(128,256,function(g,w,h){g.fillStyle="#d7dce0";g.fillRect(0,0,w,h);for(var y=0;y<h;y+=16){g.fillStyle="#9aa2aa";g.fillRect(0,y,w,2)}},1,1);
  if(k==="sign")t=canvasTex(512,96,function(g,w,h){g.fillStyle="#1E1E1E";g.fillRect(0,0,w,h);g.font="900 54px Arial";g.fillStyle="#F96302";g.textAlign="center";g.textBaseline="middle";g.fillText("PRAIRIE PLAZA",w/2,h/2+2)},1,1);
  if(k==="lines")t=canvasTex(512,512,function(g,w,h){g.fillStyle="#4a4c50";g.fillRect(0,0,w,h);noise(g,w,h,.35);g.fillStyle="rgba(250,250,250,.85)";for(var x=20;x<w;x+=56)g.fillRect(x,40,5,170);for(x=20;x<w;x+=56)g.fillRect(x,300,5,170)},1,1);
  TEX[k]=t;return t}
var M={};
function mat(k){if(M[k])return M[k];var S=T.MeshStandardMaterial,m;
  switch(k){
  case "siding":m=new S({map:tex("siding"),roughness:.85});break;
  case "siding2":m=new S({map:tex("siding2"),roughness:.85});break;
  case "shingle":m=new S({map:tex("shingle"),roughness:.95});break;
  case "snow":m=new S({map:tex("snow"),color:0xe9f0f7,roughness:1});break;
  case "snowcap":m=new S({color:0xeef4fa,roughness:.9});break;
  case "trim":m=new S({color:0xf5f5f2,roughness:.6});break;
  case "glass":m=new S({color:0x26394d,roughness:.08,metalness:.6,emissive:0x3a2a10,emissiveIntensity:.35});break;
  case "glassW":m=new S({color:0x2f4a62,roughness:.05,metalness:.5,emissive:0xffb35c,emissiveIntensity:.55});break;
  case "door":m=new S({color:0x7a2a1d,roughness:.5});break;
  case "gdoor":m=new S({map:tex("gdoor"),roughness:.6});break;
  case "conc":m=new S({color:0xb9b6b0,roughness:.95});break;
  case "asphalt":m=new S({map:tex("asphalt"),roughness:.95});break;
  case "lines":m=new S({map:tex("lines"),roughness:.95});break;
  case "unit":m=new S({color:0xd5d9dc,roughness:.45,metalness:.55});break;
  case "unitD":m=new S({color:0x9ea5ab,roughness:.5,metalness:.6});break;
  case "dark":m=new S({color:0x22262a,roughness:.6,metalness:.3});break;
  case "grille":m=new S({color:0x1b1d20,roughness:.7,metalness:.4,wireframe:false});break;
  case "fan":m=new S({color:0x55595e,roughness:.4,metalness:.7});break;
  case "pvc":m=new S({color:0xf2f2f0,roughness:.35});break;
  case "gas":m=new S({color:0xf2c200,roughness:.45,metalness:.3});break;
  case "brick":m=new S({map:tex("brick"),roughness:.9});break;
  case "metal":m=new S({map:tex("metal"),roughness:.45,metalness:.5});break;
  case "metalRoof":m=new S({color:0x8c959d,roughness:.5,metalness:.6});break;
  case "corr":m=new S({map:tex("corr"),roughness:.35,metalness:.75});break;
  case "odoor":m=new S({map:tex("odoor"),roughness:.5,metalness:.3});break;
  case "sign":m=new S({map:tex("sign"),emissive:0xffffff,emissiveMap:tex("sign"),emissiveIntensity:.35,roughness:.4});break;
  case "awning":m=new S({color:0x8f1016,roughness:.7});break;
  case "orange":m=new S({color:0xc04a00,roughness:.6});break;
  case "spruce":m=new S({color:0x1f3d2b,roughness:.95});break;
  case "trunk":m=new S({color:0x4b3426,roughness:1});break;
  case "glow":m=new S({color:0xff6a1a,emissive:0xff5a00,emissiveIntensity:1.6,roughness:.4});break;
  case "interior":m=new S({color:0x3b2f27,roughness:1,emissive:0x2a1608,emissiveIntensity:.6});break;
  case "black":m=new S({color:0x111111,roughness:.7});break;
  case "red":m=new S({color:0xb5121b,roughness:.5,metalness:.2});break;
  case "blue":m=new S({color:0x0b4f8a,roughness:.5,metalness:.2});break;
  }
  M[k]=m;return m}

/* ---------- builders ---------- */
function box(g,w,h,d,m,x,y,z,ry){var o=new T.Mesh(new T.BoxGeometry(w,h,d),typeof m==="string"?mat(m):m);o.position.set(x||0,(y||0)+h/2,z||0);if(ry)o.rotation.y=ry;o.castShadow=o.receiveShadow=true;g.add(o);return o}
function cyl(g,r1,r2,h,m,x,y,z,seg){var o=new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg||24),typeof m==="string"?mat(m):m);o.position.set(x||0,(y||0)+h/2,z||0);o.castShadow=o.receiveShadow=true;g.add(o);return o}
function gable(g,w,d,h,m,x,y,z,over){over=over||.5;var hw=w/2+over,hd=d/2+over,s=new T.Shape();s.moveTo(-hw,0);s.lineTo(0,h);s.lineTo(hw,0);s.lineTo(-hw,0);
  var geo=new T.ExtrudeGeometry(s,{depth:hd*2,bevelEnabled:false});geo.translate(0,0,-hd);
  /* uv for shingles */
  var o=new T.Mesh(geo,typeof m==="string"?mat(m):m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;g.add(o);
  /* snow on roof */
  var len=Math.hypot(hw,h),ang=Math.atan2(h,hw);
  [-1,1].forEach(function(sd){var sn=new T.Mesh(new T.BoxGeometry(len*.92,.12,hd*2-.2),mat("snowcap"));sn.position.set(x+sd*hw/2,y+h/2+.08,z);sn.rotation.z=-sd*ang;sn.castShadow=true;g.add(sn)});
  return o}
function gableWall(g,w,h,m,x,y,z,ry){var s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(0,h);s.lineTo(w/2,0);var o=new T.Mesh(new T.ShapeGeometry(s),typeof m==="string"?mat(m):m);o.position.set(x,y,z);o.rotation.y=ry||0;o.material.side=T.DoubleSide;o.castShadow=true;g.add(o);return o}
function windowW(g,w,h,x,y,z,ry,warm){var p=new T.Group();box(p,w+.24,h+.24,.12,"trim",0,-.12,0);box(p,w,h,.14,warm?"glassW":"glass",0,0,.02);box(p,.06,h,.16,"trim",0,0,.03);box(p,w,.06,.16,"trim",0,h/2-.03,.03);box(p,w+.4,.1,.3,"trim",0,-.2,.08);p.position.set(x,y,z);p.rotation.y=ry||0;g.add(p);return p}
function spruce(g,x,z,s){var t=new T.Group();cyl(t,.18*s,.22*s,1*s,"trunk",0,0,0,8);for(var i=0;i<4;i++){var r=(1.9-i*.4)*s,hh=(1.9-i*.25)*s,y=(.7+i*1.05)*s;var c=new T.Mesh(new T.ConeGeometry(r,hh,9),mat("spruce"));c.position.set(0,y+hh/2,0);c.castShadow=true;t.add(c);var sc=new T.Mesh(new T.ConeGeometry(r*.72,hh*.32,9),mat("snowcap"));sc.position.set(0,y+hh*.62,0);t.add(sc)}t.position.set(x,0,z);g.add(t);return t}
function snowbank(g,x,z,sx,sz,h){var o=new T.Mesh(new T.SphereGeometry(1,16,10),mat("snowcap"));o.scale.set(sx,h||.6,sz);o.position.set(x,0,z);o.receiveShadow=o.castShadow=true;g.add(o);return o}
function fanUnit(g,x,y,z,w,h,label){/* condenser / RTU fan with spinning blades */var u=new T.Group();box(u,w,h,w,"unit",0,0,0);
  var gr=new T.Mesh(new T.CylinderGeometry(w*.42,w*.42,.05,32),mat("grille"));gr.position.y=h+.03;u.add(gr);
  var bl=new T.Group();for(var i=0;i<3;i++){var b=new T.Mesh(new T.BoxGeometry(w*.75,.03,w*.16),mat("fan"));b.rotation.y=i*Math.PI/3*2;b.rotation.x=.25;bl.add(b)}bl.position.y=h+.08;u.add(bl);
  for(var k=0;k<4;k++){var s=new T.Mesh(new T.BoxGeometry(w*.98,h*.82,.02),mat("grille"));s.position.set(0,h*.48,0);s.rotation.y=k*Math.PI/2;s.translateZ(w/2+.005);u.add(s)}
  u.position.set(x,y,z);g.add(u);updaters.push(function(dt){if(u.userData.acHome&&MODE.heat)return;bl.rotation.y+=dt*9});return u}
function rtu(g,x,y,z,w,d,h){var u=new T.Group();box(u,w,.25,d,"dark",0,0,0);box(u,w,h,d,"unit",0,.25,0);
  for(var i=0;i<2;i++){var f=fanUnit(u,-w/4+i*w/2,.25+h,d*.18,w*.36,.12);f.children[0].visible=false}
  box(u,w*.95,.04,.02,"unitD",0,.25+h*.55,d/2+.01);box(u,w*.3,h*.6,.04,"unitD",-w*.3,.4,d/2+.01);
  u.position.set(x,y,z);g.add(u);return u}
/* steam plume from vents: soft sprites drifting up */
var steamTex=null;
function steam(g,x,y,z,rate,size){if(!steamTex){steamTex=canvasTex(64,64,function(c,w,h){var r=c.createRadialGradient(32,32,2,32,32,32);r.addColorStop(0,"rgba(255,255,255,.75)");r.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=r;c.fillRect(0,0,w,h)});steamTex.wrapS=steamTex.wrapT=T.ClampToEdgeWrapping}
  var ps=[];for(var i=0;i<14;i++){var sm=new T.SpriteMaterial({map:steamTex,transparent:true,depthWrite:false,opacity:0});var sp=new T.Sprite(sm);sp.userData.t=i/14;g.add(sp);ps.push(sp)}
  updaters.push(function(dt){ps.forEach(function(sp){sp.userData.t+=dt*(rate||.35);if(sp.userData.t>1)sp.userData.t-=1;var t=sp.userData.t;sp.position.set(x+t*1.2+Math.sin(t*6+x)*.15,y+t*2.6,z+t*.4);var s=(size||.5)+t*1.6;sp.scale.set(s,s,s);sp.material.opacity=(1-t)*.55*Math.min(1,t*6)})})}
function snowfall(g,area,count){var geo=new T.BufferGeometry(),pos=new Float32Array(count*3);for(var i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*area;pos[i*3+1]=Math.random()*18;pos[i*3+2]=(Math.random()-.5)*area}
  geo.setAttribute("position",new T.BufferAttribute(pos,3));var pm=new T.PointsMaterial({color:0xffffff,size:.09,transparent:true,opacity:.85,depthWrite:false});var p=new T.Points(geo,pm);g.add(p);
  updaters.push(function(dt){var a=geo.attributes.position.array;for(var i=0;i<count;i++){a[i*3+1]-=dt*(1.1+(i%5)*.15);a[i*3]+=Math.sin((a[i*3+1]+i)*.6)*dt*.2;if(a[i*3+1]<0)a[i*3+1]=18}geo.attributes.position.needsUpdate=true})}
function ground(g,size){var gm=new T.Mesh(new T.PlaneGeometry(size,size),mat("snow"));gm.rotation.x=-Math.PI/2;gm.receiveShadow=true;g.add(gm)}

/* ---------- scenes ---------- */
/* ---------- HOME: cut-away house showing heating & cooling ---------- */
var MODE={heat:true,auto:true,t:0,parts:{}},LABELS=[],glowTex=null;
function mstd(c,o){o=o||{};o.color=c;if(o.r===undefined)o.roughness=.8;else{o.roughness=o.r;delete o.r}return new T.MeshStandardMaterial(o)}
function gtex(){if(!glowTex){glowTex=canvasTex(64,64,function(c,w,h){var r=c.createRadialGradient(32,32,1,32,32,32);r.addColorStop(0,"rgba(255,255,255,1)");r.addColorStop(.35,"rgba(255,255,255,.55)");r.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=r;c.fillRect(0,0,w,h)});glowTex.wrapS=glowTex.wrapT=T.ClampToEdgeWrapping}return glowTex}
function airMat(){return new T.SpriteMaterial({map:gtex(),color:0xff7a1f,transparent:true,depthWrite:false,opacity:.9})}
/* particles that travel along a duct path */
function ductFlow(g,pts,n,speed,size,group){var path=pts.map(function(p){return new T.Vector3(p[0],p[1],p[2])}),seg=[],L=0;
  for(var i=1;i<path.length;i++){var d=path[i].distanceTo(path[i-1]);seg.push(d);L+=d}
  var sp=[];for(var k=0;k<n;k++){var s=new T.Sprite(airMat());s.scale.set(size,size,size);s.userData.u=k/n;g.add(s);sp.push(s);MODE.parts[group].push(s)}
  updaters.push(function(dt){sp.forEach(function(s){s.userData.u=(s.userData.u+dt*speed/L)%1;var d=s.userData.u*L,i=0;while(i<seg.length-1&&d>seg[i]){d-=seg[i];i++}s.position.copy(path[i]).lerp(path[i+1],Math.min(1,d/seg[i]))})})}
/* air leaving a register / heater */
function plume(g,o,dir,n,spread,len,size,group){var sp=[];for(var k=0;k<n;k++){var s=new T.Sprite(airMat());s.userData.t=k/n;s.userData.a=Math.random()*6.28;s.userData.r=Math.random();g.add(s);sp.push(s);MODE.parts[group].push(s)}
  updaters.push(function(dt){var cool=!MODE.heat;sp.forEach(function(s){var u=s.userData;u.t+=dt*.45;if(u.t>1){u.t-=1;u.a=Math.random()*6.28;u.r=Math.random()}var t=u.t,dy=dir[1]*len*t-(cool&&group==="room"?t*t*1.2:0);
    s.position.set(o[0]+dir[0]*len*t+Math.cos(u.a)*spread*t*u.r,o[1]+dy,o[2]+dir[2]*len*t+Math.sin(u.a)*spread*t*u.r);var sc=size*(1+t*1.6);s.scale.set(sc,sc,sc);s.material.opacity=(1-t)*.95*Math.min(1,t*8)})})}
function label(text,pos,key){LABELS.push({text:text,p:new T.Vector3(pos[0],pos[1],pos[2]),key:key})}
function car(g,x,z,col){var c=new T.Group(),m=mstd(col,{r:.35,metalness:.1});box(c,1.9,.7,4.2,m,0,.35,0);box(c,1.7,.6,2.2,mstd(0x22303c,{r:.1,metalness:.6}),0,1.05,-.2);
  [[-.95,1.3],[.95,1.3],[-.95,-1.3],[.95,-1.3]].forEach(function(w){var wh=new T.Mesh(new T.CylinderGeometry(.36,.36,.28,18),mat("black"));wh.rotation.z=Math.PI/2;wh.position.set(w[0],.36,w[1]);wh.castShadow=true;c.add(wh)});
  box(c,.3,.12,.05,mstd(0xfff3c0,{emissive:0xfff3c0,emissiveIntensity:.6}),-.6,.7,2.11);box(c,.3,.12,.05,mstd(0xfff3c0,{emissive:0xfff3c0,emissiveIntensity:.6}),.6,.7,2.11);c.position.set(x,0,z);g.add(c)}
function buildHome(g){MODE.parts={};LABELS=[];ground(g,140);
  var cut=mstd(0xf4efe8,{r:.9}),floorW=mstd(0xc9a273,{r:.7}),duct=mstd(0xaab3bb,{r:.3,metalness:.9});
  /* driveway + sidewalk */
  var dw=new T.Mesh(new T.PlaneGeometry(6.4,14),mat("asphalt"));dw.rotation.x=-Math.PI/2;dw.position.set(7.2,.02,9);dw.receiveShadow=true;g.add(dw);
  var sw=new T.Mesh(new T.PlaneGeometry(1.4,9),mat("conc"));sw.rotation.x=-Math.PI/2;sw.position.set(-1,.02,8.3);g.add(sw);
  /* house body (2 storeys) with the front-left corner cut open to show the furnace room */
  box(g,11,.6,8,"conc",-1.5,0,0);
  box(g,11,3.4,8,"siding",-1.5,3.4,0);              /* upper floor */
  box(g,7,2.8,8,"siding",.5,.6,0);                   /* ground floor right part */
  box(g,4,2.8,4.6,"siding",-5,.6,-1.7);              /* ground floor left-back part */
  /* furnace room: floor, inner walls, ceiling, orange section edges */
  box(g,3.9,.06,3.4,floorW,-5,.6,2.3);box(g,3.9,2.8,.06,cut,-5,.6,.62);box(g,.06,2.8,3.4,cut,-3.03,.6,2.3);box(g,3.9,.06,3.4,cut,-5,3.34,2.3);
  box(g,.2,2.8,3.4,"siding",-6.9,.6,2.3);
  var tw=new T.MeshStandardMaterial({map:tex("siding"),color:0xdfeaf2,transparent:true,opacity:.18,roughness:.15,metalness:.1,depthWrite:false,side:T.DoubleSide});
  var twm=new T.Mesh(new T.BoxGeometry(3.9,2.8,.06),tw);twm.position.set(-5,2,4.0);g.add(twm);
  box(g,4,.08,.1,"trim",-5,.56,4.02);box(g,4,.08,.1,"trim",-5,3.36,4.02);box(g,.08,2.8,.1,"trim",-3.04,.6,4.02);
  /* the furnace */
  var F=new T.Group();box(F,1,1.7,.9,mstd(0x3a3f45,{r:.45,metalness:.5}),0,0,0);box(F,1,.08,.92,mstd(0x2a2e33),0,.85,0);
  var fw=box(F,.46,.32,.03,mat("glow"),0,.45,.46);box(F,.7,.22,.03,mstd(0x9aa1a8,{r:.4,metalness:.6}),0,1.25,.46);box(F,.16,.08,.03,mstd(0x58e07a,{emissive:0x58e07a,emissiveIntensity:.8}),.28,1.5,.46);
  box(F,.9,.7,.8,mstd(0x5b6168,{r:.4,metalness:.6}),0,1.7,0);box(F,.6,.36,.5,duct,0,2.4,-.1);
  F.scale.set(1.15,1.15,1.15);F.position.set(-5.2,.66,1.9);g.add(F);
  var fl=new T.PointLight(0xff7a2a,1.1,4.5,2);fl.position.set(-5.2,1.2,2.6);g.add(fl);updaters.push(function(){var k=1+Math.sin(performance.now()/180)*.08+Math.sin(performance.now()/97)*.05;fl.intensity=1.05*k;fw.material.emissiveIntensity=1.5*k});
  /* PVC exhaust/intake from furnace through the back wall + steam outside */
  [[-5.55],[-4.85]].forEach(function(p){var v=new T.Mesh(new T.CylinderGeometry(.07,.07,1.1,12),mat("pvc"));v.position.set(p[0],2.75,1.35);g.add(v)});
  var room=new T.PointLight(0xffe6c8,.5,6,2);room.position.set(-4.4,2.8,3.2);g.add(room);
  gable(g,11.6,8,3.3,"shingle",-1.5,6.8,0,.45);
  gableWall(g,11,3.2,"siding",-1.5,6.8,4.0);gableWall(g,11,3.2,"siding",-1.5,6.8,-4.0,Math.PI);
  /* front: door with porch */
  box(g,1.2,2.3,.14,"door",-1,.6,4.06);box(g,1.6,.12,.2,"trim",-1,2.95,4.12);box(g,3.2,.3,2,"conc",-1,0,5);
  cyl(g,.1,.1,2.6,"trim",-2.3,.3,5.8,10);cyl(g,.1,.1,2.6,"trim",.3,.3,5.8,10);box(g,3.4,.18,2.4,"trim",-1,2.9,5.1);
  [1.4,3.2].forEach(function(x){windowW(g,1.3,1.5,x,1.7,4.05,0,false)});[-5,-1,3].forEach(function(x){windowW(g,1.4,1.4,x,4.5,4.05,0,true)});
  windowW(g,1.4,1.4,-7.06,4.5,-1,-Math.PI/2,true);windowW(g,1.4,1.5,-7.06,1.7,-2.2,-Math.PI/2);
  /* furnace vents on the side wall + steam */
  [[-7.12,1.3,-3.2],[-7.12,1.3,-3.6]].forEach(function(p,i){var pp=new T.Mesh(new T.CylinderGeometry(.08,.08,.7,14),mat("pvc"));pp.rotation.z=Math.PI/2;pp.position.set(p[0]-.3,p[1],p[2]);pp.castShadow=true;g.add(pp);if(i===0)steam(g,p[0]-.7,p[1],p[2],.32,.35)});
  /* attached garage with the door open, garage heater glowing inside */
  box(g,6.6,3.6,.3,"siding2",7.2,.2,-3.85);box(g,.3,3.6,8.4,"siding2",10.35,.2,.2);box(g,6.6,.3,8.4,"siding2",7.2,3.5,.2);
  box(g,.6,3.6,.3,"siding2",4.2,.2,4.25);box(g,.6,3.6,.3,"siding2",10.2,.2,4.25);box(g,6.6,.7,.3,"siding2",7.2,3.1,4.25);
  gable(g,6.6,8.4,2,"shingle",7.2,3.8,.2,.35);gableWall(g,6.6,2,"siding2",7.2,3.8,4.41);
  box(g,6,.06,8,mstd(0x9a9893,{r:.9}),7.2,.2,0);box(g,5.2,.08,2.6,mat("gdoor"),7.2,3.3,2.7);box(g,5.5,.14,.18,"trim",7.2,3,4.46);
  box(g,6,3.2,.05,mstd(0xe8e2d8,{r:.9}),7.2,.25,-3.68);box(g,.05,3.2,7.8,mstd(0xe8e2d8,{r:.9}),10.18,.25,.2);
  car(g,6.1,.4,0xc4161f);var gi=new T.PointLight(0xfff1dc,2.2,14,1);gi.position.set(7,2.5,3.6);g.add(gi);
  var GH=new T.Group();box(GH,1.2,.6,.9,mstd(0xe9e9e4,{r:.5}),0,0,0);box(GH,1.22,.05,.92,mstd(0x9aa1a8),0,.6,0);box(GH,.78,.36,.02,mat("grille"),-.14,.12,.46);box(GH,.78,.05,.03,mstd(0xc8102e),-.14,.22,.48);
  box(GH,.22,.5,.02,mstd(0xc8102e,{r:.5}),.42,.05,.46);box(GH,.06,.7,.06,mat("dark"),-.45,.6,0);box(GH,.06,.7,.06,mat("dark"),.45,.6,0);
  GH.scale.set(1.6,1.6,1.6);GH.rotation.y=-Math.PI/2;GH.position.set(9.3,1.45,2.2);g.add(GH);
  var gl=new T.PointLight(0xff8a3a,1.2,7,2);gl.position.set(8.2,1.4,2.4);g.add(gl);updaters.push(function(){gl.intensity=1.1+Math.sin(performance.now()/260)*.1});
  var gv=new T.Mesh(new T.CylinderGeometry(.09,.09,1.5,14),mat("unitD"));gv.rotation.z=Math.PI/2;gv.position.set(10.3,2.0,2.2);g.add(gv);steam(g,11.1,2.05,2.2,.4,.3);
  var warm=[];for(var k=0;k<22;k++){var s=new T.Sprite(new T.SpriteMaterial({map:gtex(),color:0xff6a10,transparent:true,depthWrite:false,opacity:0}));s.userData.t=k/22;s.userData.a=Math.random()*6.28;g.add(s);warm.push(s)}
  updaters.push(function(dt){warm.forEach(function(s){var u=s.userData;u.t+=dt*.4;if(u.t>1){u.t-=1;u.a=Math.random()*6.28}var t=u.t;s.position.set(8.5-t*2.4,1.6-t*.8+Math.sin(u.a)*.3*t,2.2+Math.cos(u.a)*.6*t);var sc=.35+t*.9;s.scale.set(sc,sc,sc);s.material.opacity=(1-t)*.5*Math.min(1,t*6)})});
  /* gas meter */
  box(g,.5,.7,.3,"unitD",-7.25,.9,-2.8);var gp=new T.Mesh(new T.CylinderGeometry(.04,.04,1.2,10),mat("gas"));gp.position.set(-7.18,.6,-2.8);g.add(gp);
  /* AC condenser on pad */
  box(g,1.6,.12,1.6,"conc",-8.8,0,-.6);fanUnit(g,-8.8,.12,-.6,1.05,1.05);
  /* yard */
  spruce(g,-12,6,1.2);spruce(g,-13.5,-3,1.45);spruce(g,14.5,-5,1.3);spruce(g,-10,-9,1.1);spruce(g,13,8,.9);
  snowbank(g,3.5,10,1.4,4,.7);snowbank(g,11,10.5,1.2,3,.6);snowbank(g,-6,8,3,1,.45);
  box(g,.12,1.2,10,"trim",-15,0,0);
  snowfall(g,50,700);target.set(1,2.4,0);dist=30}
function setMode(heat){MODE.heat=heat;var P=MODE.parts;if(!P.duct)return;var col=heat?0xff5200:0x0f7bff;
  P.duct.concat(P.room).forEach(function(s){s.material.color.setHex(col)});P.gh.forEach(function(s){s.visible=heat;s.material.color.setHex(0xff5200)});
  if(P.tops)P.tops.forEach(function(t){t.material=heat?P.snowMat:P.grass});if(P.caps)P.caps.forEach(function(o){o.visible=heat});if(P.snow)P.snow.visible=heat;if(P.steam)P.steam.visible=heat;
  if(P.flame)P.flame.material=heat?mat("glow"):mstd(0x333333);if(P.thermo)P.thermo.material.color.setHex(heat?0xff7a1f:0x47b7ff),P.thermo.material.emissive.setHex(heat?0xff6a1a:0x2a9cff);
  LABELS.forEach(function(l){if(l.key==="vents")l.text=heat?"Warm air from vents":"Cool air from vents"});
  if(scene)scene.background=heat?skyTex():skyTex(1);
  var b=holder&&holder.querySelectorAll(".s3m button");if(b)[].forEach.call(b,function(x){x.setAttribute("aria-pressed",(x.dataset.m==="heat")===heat)})}
function buildStore(g){ground(g,160);
  var lot=new T.Mesh(new T.PlaneGeometry(34,14),mat("lines"));lot.rotation.x=-Math.PI/2;lot.position.set(0,.02,12);lot.receiveShadow=true;g.add(lot);
  box(g,30,.25,4,"conc",0,0,6.6);
  /* building */
  box(g,30,5.6,12,"brick",0,0,0);box(g,30.4,1.1,12.4,"dark",0,5.6,0);box(g,30.6,.2,12.6,"snowcap",0,6.7,0);
  for(var i=0;i<5;i++){var x=-12+i*6;box(g,4.6,3.2,.14,"glassW",x,.35,6.05);box(g,.12,3.3,.18,"dark",x,.3,6.1);box(g,4.8,.14,.2,"dark",x,3.55,6.1);box(g,1.1,2.4,.16,"glass",x+1.6,.3,6.1);
    var aw=new T.Mesh(new T.BoxGeometry(5,.12,1.6),mat(i%2?"awning":"orange"));aw.position.set(x,4.35,6.8);aw.rotation.x=.35;aw.castShadow=true;g.add(aw)}
  var sg=new T.Mesh(new T.BoxGeometry(12,1.2,.2),mat("sign"));sg.position.set(0,5.25,6.2);g.add(sg);
  /* rooftop units, make-up air, gas piping */
  rtu(g,-9,6.7,-1.5,3,2.2,1.4);rtu(g,0,6.7,-2,3.4,2.4,1.5);rtu(g,9,6.7,-1.2,3,2.2,1.4);
  box(g,2.4,1.6,1.8,"unitD",-1,6.7,3);steam(g,-1,8.4,3,.3,.4);
  var gp=new T.Mesh(new T.BoxGeometry(22,.08,.08),mat("gas"));gp.position.set(0,6.95,1.4);g.add(gp);
  [-9,0,9].forEach(function(x){var v=new T.Mesh(new T.CylinderGeometry(.04,.04,.6,8),mat("gas"));v.position.set(x,7.2,1.4);g.add(v)});
  for(var k=0;k<3;k++){cyl(g,.08,.1,6,"dark",-14+k*14,0,18.5,8);box(g,1,.2,.4,"dark",-14+k*14,6,18.5)}
  snowbank(g,-17,14,2.5,3.5,1.4);snowbank(g,17,15,2.2,3,1.2);spruce(g,-21,-4,1.3);spruce(g,21,2,1.1);
  snowfall(g,60,700);target.set(0,4,3);dist=40}
function buildIndustry(g){ground(g,200);
  var ap=new T.Mesh(new T.PlaneGeometry(40,16),mat("asphalt"));ap.rotation.x=-Math.PI/2;ap.position.set(0,.02,15);ap.receiveShadow=true;g.add(ap);
  /* warehouse with low-slope roof */
  box(g,32,9,18,"metal",0,0,0);gable(g,32,18,1.6,"metalRoof",0,9,0,.4);gableWall(g,18,1.6,"metal",16,9,0,Math.PI/2);gableWall(g,18,1.6,"metal",-16,9,0,-Math.PI/2);
  /* loading docks + overhead doors, one open with glowing radiant tube heaters inside */
  for(var i=0;i<4;i++){var x=-11+i*6.5;box(g,4.6,1.2,2.2,"conc",x,0,10);
    if(i===2){box(g,4.2,4.8,.1,"interior",x,1.2,8.6);box(g,4.4,.5,.14,"odoor",x,5.6,9.04);
      [2.8,3.6].forEach(function(y){var tu=new T.Mesh(new T.CylinderGeometry(.09,.09,4,12),mat("glow"));tu.rotation.z=Math.PI/2;tu.position.set(x,y+1.2,8.7);g.add(tu)});
      var pl=new T.PointLight(0xff7a2a,1.4,9,2);pl.position.set(x,4.2,9.6);g.add(pl);updaters.push(function(){pl.intensity=1.25+Math.sin(performance.now()/380)*.12})}
    else box(g,4.4,5,.14,"odoor",x,1.2,9.05);
    box(g,5,.18,1.2,"dark",x,6.3,9.6)}
  box(g,1.1,2.3,.12,"door",13.5,0,9.06);windowW(g,3,1.2,9.5,6.5,9.06,0,true);
  /* rooftop make-up air units + exhaust stacks */
  box(g,5,2.2,3,"unit",-7,9.3,-2);box(g,1.2,1.4,1.4,"unitD",-10,11.5,-2);box(g,4,1.8,2.6,"unit",6,9.3,2);
  [[-2,-4],[2,-3],[10,-5]].forEach(function(p){cyl(g,.35,.4,4.5,"unitD",p[0],9.6,p[1],16);cyl(g,.5,.5,.25,"dark",p[0],14.1,p[1],16);steam(g,p[0],14.4,p[1],.25,.8)});
  /* yellow gas piping along the wall */
  var gp=new T.Mesh(new T.BoxGeometry(.12,.12,26),mat("gas"));gp.position.set(16.1,7.5,0);g.add(gp);box(g,.6,1,.5,"unitD",16.3,.9,-7);var gpv=new T.Mesh(new T.CylinderGeometry(.06,.06,6.6,8),mat("gas"));gpv.position.set(16.1,4.2,-7);g.add(gpv);
  /* Saskatchewan touch: grain bins */
  [[-27,-6],[-27,2],[-34,-2]].forEach(function(p){cyl(g,3.2,3.2,7,"corr",p[0],0,p[1],32);var cn=new T.Mesh(new T.ConeGeometry(3.4,2.4,32),mat("metalRoof"));cn.position.set(p[0],8.2,p[1]);cn.castShadow=true;g.add(cn);var cs=new T.Mesh(new T.ConeGeometry(3.1,1.4,32),mat("snowcap"));cs.position.set(p[0],8.7,p[1]);g.add(cs)});
  /* semi truck */
  var tr=new T.Group();box(tr,2.6,3.2,11,"trim",0,.9,0);box(tr,2.6,2.6,2.6,"blue",0,.6,7.2);box(tr,2.4,1,.1,"glass",0,2.1,8.52);
  [[-1.2,-3.5],[1.2,-3.5],[-1.2,-2.2],[1.2,-2.2],[-1.2,6.8],[1.2,6.8]].forEach(function(w){var wh=new T.Mesh(new T.CylinderGeometry(.55,.55,.4,16),mat("black"));wh.rotation.z=Math.PI/2;wh.position.set(w[0],.55,w[1]);tr.add(wh)});
  tr.position.set(-11,0,17.5);tr.rotation.y=Math.PI;g.add(tr);
  snowbank(g,-18,18,3,4,1.6);snowbank(g,20,16,3.5,5,1.8);spruce(g,24,-10,1.6);spruce(g,27,-2,1.3);
  snowfall(g,80,900);target.set(-3,4.5,2);dist=52}

/* ---------- renderer & camera ---------- */
function disposeScene(){if(!scene)return;scene.traverse(function(o){if(o.geometry)o.geometry.dispose()});scene=null;updaters=[]}
function skyTex(summer){return canvasTex(16,256,function(g,w,h){var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,summer?"#2f86d6":"#5d8fc9");gr.addColorStop(.55,summer?"#a9d8f5":"#bcd5ee");gr.addColorStop(1,summer?"#f6f1dc":"#f3e7d4");g.fillStyle=gr;g.fillRect(0,0,w,h)})}
function build(k){disposeScene();scene=new T.Scene();var sk=skyTex();sk.wrapS=sk.wrapT=T.ClampToEdgeWrapping;scene.background=sk;scene.fog=new T.Fog(0xdfe8f2,60,170);
  scene.add(new T.HemisphereLight(0xdfeeff,0x8a8070,.75));
  var sun=new T.DirectionalLight(0xfff1dc,1.15);sun.position.set(-26,34,22);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);var sc=sun.shadow.camera;sc.left=-45;sc.right=45;sc.top=45;sc.bottom=-45;sc.near=1;sc.far=120;sun.shadow.bias=-.0006;sun.shadow.normalBias=.03;scene.add(sun);
  var fill=new T.DirectionalLight(0xbcd2ff,.25);fill.position.set(30,12,-20);scene.add(fill);
  var g=new T.Group();scene.add(g);
  if(k==="commercial")buildStore(g);else if(k==="industrial")buildIndustry(g);else buildHome(g);
  cur=k;place()}
function ensureRenderer(){if(renderer)return;renderer=new T.WebGLRenderer({antialias:true,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.92;
  camera=new T.PerspectiveCamera(32,560/340,.5,400)}
function place(){var cp=Math.cos(pitch);camera.position.set(target.x+dist*cp*Math.sin(yaw),target.y+dist*Math.sin(pitch),target.z+dist*cp*Math.cos(yaw));camera.lookAt(target)}
function resize(){if(!holder||!renderer)return;var w=holder.clientWidth||560,h=holder.clientHeight||340;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function loop(now){requestAnimationFrame(loop);if(!holder||!scene||!visible||document.hidden){last=now;return}var dt=Math.min(.05,(now-last)/1000);last=now;
  if(cur==="home"){if(auto&&!drag){idle+=dt;if(idle>1.2){MODE.t+=dt;yaw=-.25+Math.sin(MODE.t*.22)*.42;place()}}}
  else if(auto&&!drag){idle+=dt;if(idle>1.2)yaw+=dt*.12;place()}updaters.forEach(function(f){f(dt)});renderer.render(scene,camera);drawLabels()}
function drawLabels(){var box_=holder&&holder.querySelector(".s3l");if(!box_)return;if(cur!=="home"){box_.innerHTML="";return}
  var w=holder.clientWidth,h=holder.clientHeight;if(box_.children.length!==LABELS.length){box_.innerHTML=LABELS.map(function(){return "<span></span>"}).join("")}
  LABELS.forEach(function(l,i){var el=box_.children[i],v=l.p.clone().project(camera);el.textContent=l.text;el.className="s3t"+(l.key==="vents"?(MODE.heat?" hot":" cold"):"");
    if(v.z>1||v.x<-1.1||v.x>1.1||v.y<-1.1||v.y>1.1){el.style.opacity=0;return}el.style.opacity=1;el.style.transform="translate("+((v.x+1)/2*w)+"px,"+((1-v.y)/2*h)+"px) translate(-50%,-100%)"})}
function bind(el){el.addEventListener("pointerdown",function(e){if(e.target.closest(".s3m"))return;drag={x:e.clientX,y:e.clientY,yaw:yaw,pitch:pitch,id:e.pointerId,moved:false};el.classList.add("drag");idle=0});
  el.addEventListener("pointermove",function(e){if(!drag)return;var dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dx)>4&&Math.abs(dx)>Math.abs(dy)){drag.moved=true;try{el.setPointerCapture(drag.id)}catch(_){}}
    if(drag.moved){e.preventDefault();yaw=drag.yaw-dx*.008;pitch=Math.max(.12,Math.min(1.05,drag.pitch+dy*.004));place();var h=el.querySelector(".sol3d-hint");if(h)h.style.opacity=0}});
  function up(){if(drag){drag=null;el.classList.remove("drag");idle=0}}el.addEventListener("pointerup",up);el.addEventListener("pointercancel",up);el.addEventListener("pointerleave",up);
  el.addEventListener("keydown",function(e){if(e.key==="ArrowLeft"){yaw-=.2;place()}if(e.key==="ArrowRight"){yaw+=.2;place()}})}
var LBL={home:"Home heating & cooling",commercial:"Retail plaza · rooftop units & make-up air",industrial:"Warehouse & grain yard · radiant & make-up air"};
function mount(){var art=stage.querySelector(".sol-art"),tab=document.querySelector(".sol-tab[aria-selected=\"true\"]"),k=tab?tab.dataset.sol:"home";if(!art)return;
  var tilt=art.querySelector(".sol-tilt");if(!tilt||tilt.querySelector(".sol3d"))return;
  try{ensureRenderer()}catch(e){return}
  art.classList.add("has3d");holder=document.createElement("div");holder.className="sol3d";holder.tabIndex=0;holder.setAttribute("role","img");holder.setAttribute("aria-label","3D model: "+(LBL[k]||k)+". Drag to turn it.");
  holder.innerHTML='<div class="s3l" aria-hidden="true"></div>'+(k==="home"?'':'<span class="sol3d-tag">'+(LBL[k]||"")+'</span>')+'<span class="sol3d-hint">Drag to turn · 3D</span>';
  holder.addEventListener("click",function(e){var b=e.target.closest(".s3m button");if(!b)return;MODE.auto=false;setMode(b.dataset.m==="heat")});

  tilt.innerHTML="";tilt.appendChild(holder);holder.insertBefore(renderer.domElement,holder.firstChild);bind(holder);
  if(k==="home"){yaw=-.25;pitch=.26;MODE.t=0;MODE.clock=0}else if(k==="commercial"){yaw=.45;pitch=.32}else{yaw=.62;pitch=.36}
  build(k);resize()}
new MutationObserver(mount).observe(stage,{childList:true});
addEventListener("resize",resize);
if("IntersectionObserver" in window)new IntersectionObserver(function(es){visible=es[0].isIntersecting}).observe(stage);
mount();requestAnimationFrame(loop);
})();
