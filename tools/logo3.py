import numpy as np,json,base64,io
from PIL import Image
A='/mnt/user-data/attachments/a5422024-2725-52a5-9a6e-1d352b70e06e/'
def lum_alpha(im,name,size=(360,120)):
    a=np.array(im.convert('RGB')).astype(np.float32);lum=a.mean(2);sat=a.max(2)-a.min(2)
    d=np.maximum(np.clip((248-lum)/50,0,1),np.clip(sat/60,0,1));al=(d*255).astype(np.uint8)
    rgba=np.dstack([a.astype(np.uint8),al]);ys,xs=np.where(al>20);rgba=rgba[max(0,ys.min()-3):ys.max()+4,max(0,xs.min()-3):xs.max()+4]
    img=Image.fromarray(rgba);img.thumbnail(size,Image.LANCZOS);img.save(f'logos/{name}.png');print(name,img.size);return img
lum_alpha(Image.open(A+'4d034e99-image.png'),'Bradford White')
lum_alpha(Image.open(A+'8c282ad8-image.png'),'AirMax')
lum_alpha(Image.open(A+'ff62b757-image.png'),'Trane')
# TOSOT badge from product photo (red text on white plate)
t=Image.open(A+'e2f27747-image.png').convert('RGB');W,H=t.size
b=t.crop((int(W*.77),int(H*.13),int(W*.92),int(H*.19)));lum_alpha(b,'TOSOT')
# Rheem red badge
r=Image.open(A+'f20f3f7b-image.png').convert('RGBA');W,H=r.size;rb=r.crop((int(W*.68),int(H*.26),int(W*.85),int(H*.37)));rb.save('logos/Rheem.png');print('Rheem',rb.size)
L=json.load(open('v2/logos.json'))
for n in ['Bradford White','AirMax','Trane','TOSOT','Rheem']:
    im=Image.open(f'logos/{n}.png');buf=io.BytesIO();im.save(buf,'WEBP',quality=88);L[n]='data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
json.dump(L,open('v2/logos.json','w'))
# product webps
for n in ['bw-infiniti','midea-ac','trane-ac','lennox-hp','airmax','kepler-ac','tosot-hp','rheem']:
    im=Image.open(f'cut4/{n}.png');im.thumbnail((620,620),Image.LANCZOS);im.save(f'webp/{n}.webp','WEBP',quality=82);print(n,im.size)
