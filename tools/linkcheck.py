import os,re,sys,glob,html
R=sys.argv[1];bad=[];n=0
for f in glob.glob(R+'/**/*.html',recursive=True):
    s=open(f).read();d=os.path.dirname(f)
    for m in re.findall(r'(?:href|src)="([^"#]+)"',s):
        if m.startswith(('http','tel:','mailto:','data:','//')) or '{' in m or "'" in m: continue
        p=os.path.normpath(os.path.join(d,html.unescape(m.split('?')[0])))
        if m.endswith('/'): p=os.path.join(p,'index.html')
        n+=1
        if not os.path.exists(p): bad.append((f.replace(R,''),m))
print(n,'links checked;',len(bad),'broken');[print(b) for b in bad[:20]]
