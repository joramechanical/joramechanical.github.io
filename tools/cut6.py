import cv2,numpy as np
from scipy import ndimage as ndi
from PIL import Image
A='/mnt/user-data/attachments/a5422024-2725-52a5-9a6e-1d352b70e06e/'
def finish(img,fg,name):
    fg=ndi.binary_fill_holes(fg);lb,n=ndi.label(fg)
    if n>1:s=ndi.sum(fg,lb,range(1,n+1));fg=lb==(np.argmax(s)+1)
    a=cv2.GaussianBlur(fg.astype(np.float32),(0,0),.9);a=np.clip((a-.15)/.7,0,1)
    rgba=np.dstack([img,(a*255).astype(np.uint8)]);ys,xs=np.where(a>.05);rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    cv2.imwrite(f'cut4/{name}.png',rgba);print(name,rgba.shape)
def white(f,name,thr):
    img=cv2.cvtColor(np.array(Image.open(A+f).convert('RGB')),cv2.COLOR_RGB2BGR)
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY);near=g>=thr
    lbl,_=ndi.label(near);b=set(np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]])))-{0};bg=np.isin(lbl,list(b))
    fg=ndi.binary_opening(~bg,iterations=1);finish(img,fg,name)
white('77a6bf27-image.jpg','lennox-hp2',246)
white('5a16c1f6-image.png','trane-furnace',248)
for n in ['lennox-hp2','trane-furnace']:
    im=Image.open(f'cut4/{n}.png');im.save(f'webp/{n}.webp','WEBP',quality=88)
s=Image.new('RGB',(900,460),(40,140,60));x=0
for n in ['lennox-hp2','trane-furnace']:
    im=Image.open(f'cut4/{n}.png');im.thumbnail((440,440));s.paste(im,(x,10),im);x+=450
s.save('sheet6.png')
