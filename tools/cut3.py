import cv2,numpy as np
from scipy import ndimage as ndi
A='/mnt/user-data/attachments/a5422024-2725-52a5-9a6e-1d352b70e06e/'
def finish(img,fg,name):
    fg=ndi.binary_fill_holes(fg);lb,n=ndi.label(fg)
    if n>1:s=ndi.sum(fg,lb,range(1,n+1));fg=lb==(np.argmax(s)+1)
    a=cv2.GaussianBlur(fg.astype(np.float32),(0,0),1.0);a=np.clip((a-.15)/.7,0,1)
    rgba=np.dstack([img,(a*255).astype(np.uint8)]);ys,xs=np.where(a>.05);rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    cv2.imwrite(f'cut/{name}.png',rgba);print(name,rgba.shape)
def grab(f,name,rect=None,tol=10):
    img=cv2.imread(A+f+'-image.jpg');h,w=img.shape[:2]
    lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB).astype(np.float32);bgc=np.median(lab[:4].reshape(-1,3),0)
    near=np.linalg.norm(lab-bgc,axis=2)<tol;lbl,_=ndi.label(near);b=set(np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]])))-{0};bg=np.isin(lbl,list(b))
    mask=np.full((h,w),cv2.GC_PR_FGD,np.uint8);mask[bg]=cv2.GC_PR_BGD;mask[ndi.binary_erosion(bg,iterations=4)]=cv2.GC_BGD
    if rect:
        x0,y0,x1,y1=rect;out=np.ones((h,w),bool);out[y0:y1,x0:x1]=False;mask[out]=cv2.GC_BGD
    m1=np.zeros((1,65));m2=np.zeros((1,65));cv2.grabCut(img,mask,None,m1,m2,4,cv2.GC_INIT_WITH_MASK)
    finish(img,(mask==1)|(mask==3),name)
grab('f2db3cc5','carrier-ac')
grab('d0a75c91','keeprite-ac')
