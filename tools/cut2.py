import cv2,numpy as np,os
from scipy import ndimage as ndi
from PIL import Image
A='/mnt/user-data/attachments/a5422024-2725-52a5-9a6e-1d352b70e06e/'
def logo(f,name,thr=232):
    im=np.array(Image.open(A+f+'-image.jpg').convert('RGB')).astype(np.float32)
    lum=im.mean(2); mx=im.max(2); mn=im.min(2); sat=mx-mn
    # alpha: how far from light grey background
    d=np.clip((245-lum)/45,0,1); d=np.maximum(d,np.clip(sat/60,0,1))
    a=(d*255).astype(np.uint8)
    rgba=np.dstack([im.astype(np.uint8),a])
    ys,xs=np.where(a>20); rgba=rgba[max(0,ys.min()-4):ys.max()+5,max(0,xs.min()-4):xs.max()+5]
    img=Image.fromarray(rgba); img.thumbnail((360,120),Image.LANCZOS); img.save(f'logos/{name}.png'); print(name,img.size)
for f,n in [('7c555867','Lennox'),('93515179','KeepRite'),('fc7dcada','Carrier'),('24879507','Midea'),('fc339d93','Goodman'),('a0a559ec','Noritz'),('49ed0d12','Gree'),('17bf1256','Rinnai')]: logo(f,n)
# Kepler: white on dark - keep as dark chip
im=Image.open(A+'3fb72222-image.jpg').convert('RGB');im.save('logos/Kepler.png');print('Kepler',im.size)
