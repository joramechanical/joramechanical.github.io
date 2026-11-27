import cv2,numpy as np
from scipy import ndimage as ndi
from PIL import Image
A='/mnt/user-data/attachments/a5422024-2725-52a5-9a6e-1d352b70e06e/'
exec(open('cut4.py').read().split('def grab')[0])
def white(f,name,thr,crop=None,rect=None):
    img=cv2.imread(A+f)
    if crop:x0,y0,x1,y1=crop;img=img[y0:y1,x0:x1].copy()
    g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY);near=g>=thr
    lbl,_=ndi.label(near);b=set(np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]])))-{0};bg=np.isin(lbl,list(b))
    fg=~bg
    if rect:x0,y0,x1,y1=rect;m=np.zeros_like(fg);m[y0:y1,x0:x1]=True;fg&=m
    fg=ndi.binary_opening(fg,iterations=2)
    finish(img,fg,name)
white('369fbde4-image.jpg','bw-infiniti',251)
white('37916e4a-image.jpg','lennox-hp',248,crop=(0,650,1080,1300),rect=(266,20,798,440))
img=cv2.imread(A+'891a09df-image.jpg');h,w=img.shape[:2]
poly=np.array([(44,108),(60,92),(120,80),(185,88),(200,104),(300,104),(312,118),(312,150),(358,192),(360,215),(348,335),(350,600),(345,628),(152,652),(128,600),(110,425),(103,360),(52,140)],np.int32)
pm=np.zeros((h,w),np.uint8);cv2.fillPoly(pm,[poly],1)
mask=np.where(pm>0,cv2.GC_PR_FGD,cv2.GC_BGD).astype(np.uint8)
mask[ndi.binary_erosion(pm>0,iterations=14)]=cv2.GC_FGD
m1=np.zeros((1,65));m2=np.zeros((1,65));cv2.grabCut(img,mask,None,m1,m2,5,cv2.GC_INIT_WITH_MASK)
finish(img,(mask==1)|(mask==3),'airmax')
