import cv2,numpy as np,sys
from scipy import ndimage as ndi
from PIL import Image
A='/mnt/user-data/attachments/a5422024-2725-52a5-9a6e-1d352b70e06e/'
def finish(img,fg,name,keepall=False):
    fg=ndi.binary_fill_holes(fg);lb,n=ndi.label(fg)
    if n>1 and not keepall:s=ndi.sum(fg,lb,range(1,n+1));fg=lb==(np.argmax(s)+1)
    a=cv2.GaussianBlur(fg.astype(np.float32),(0,0),1.0);a=np.clip((a-.15)/.7,0,1)
    rgba=np.dstack([img,(a*255).astype(np.uint8)]);ys,xs=np.where(a>.05);rgba=rgba[ys.min():ys.max()+1,xs.min():xs.max()+1]
    cv2.imwrite(f'cut4/{name}.png',rgba);print(name,rgba.shape)
def grab(f,name,rect=None,tol=10,crop=None,flood=True):
    img=cv2.imread(A+f)
    if img.ndim==2 or img.shape[2]==4: img=cv2.cvtColor(np.array(Image.open(A+f).convert('RGB')),cv2.COLOR_RGB2BGR)
    if crop: x0,y0,x1,y1=crop; img=img[y0:y1,x0:x1].copy()
    h,w=img.shape[:2]
    mask=np.full((h,w),cv2.GC_PR_FGD,np.uint8)
    if flood:
        lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB).astype(np.float32);bgc=np.median(np.concatenate([lab[:4].reshape(-1,3),lab[:,:4].reshape(-1,3),lab[:,-4:].reshape(-1,3)]),0)
        near=np.linalg.norm(lab-bgc,axis=2)<tol;lbl,_=ndi.label(near);b=set(np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]])))-{0};bg=np.isin(lbl,list(b))
        mask[bg]=cv2.GC_PR_BGD;mask[ndi.binary_erosion(bg,iterations=4)]=cv2.GC_BGD
    if rect:
        x0,y0,x1,y1=rect;out=np.ones((h,w),bool);out[y0:y1,x0:x1]=False;mask[out]=cv2.GC_BGD
    mask[:2]=0;mask[-2:]=0;mask[:,:2]=0;mask[:,-2:]=0
    m1=np.zeros((1,65));m2=np.zeros((1,65));cv2.grabCut(img,mask,None,m1,m2,5,cv2.GC_INIT_WITH_MASK)
    finish(img,(mask==1)|(mask==3),name)
def alphaimg(f,name):
    im=Image.open(A+f).convert('RGBA');a=np.array(im);ys,xs=np.where(a[...,3]>10);im=im.crop((xs.min(),ys.min(),xs.max()+1,ys.max()+1));im.save(f'cut4/{name}.png');print(name,im.size)
grab('369fbde4-image.jpg','bw-infiniti')
grab('4c19d446-image.jpg','midea-ac')
grab('2ed4dede-image.png','trane-ac')
grab('37916e4a-image.jpg','lennox-hp',crop=(0,540,900,1080),rect=(205,15,690,395),flood=False)
grab('891a09df-image.jpg','airmax',rect=(30,20,390,735),tol=14)
grab('b7ab06c5-image.jpg','airmax-small')
alphaimg('bf8c7f2c-image.png','kepler-ac')
alphaimg('e2f27747-image.png','tosot-hp')
im=Image.open(A+'f20f3f7b-image.png');print('rheem mode',im.mode,im.info.get('transparency'))
alphaimg('f20f3f7b-image.png','rheem')
