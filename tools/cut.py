import cv2, numpy as np, sys, os
from scipy import ndimage as ndi
src='/mnt/user-data/uploads/'; out=sys.argv[1]
jobs={'kepler':'1000232020','lennox-slp':'1000232028','keeprite':'1000231996','goodman':'1000231994',
 'carrier':'1000232010','lennox-el':'1000232040','gree':'1000231968','noritz':'1000231970',
 'rinnai':'1000231976','navien':'1000231986','noritz-logo':'1000231972'}
for name,f in jobs.items():
    img=cv2.imread(src+f+'.jpg'); h,w=img.shape[:2]
    lab=cv2.cvtColor(img,cv2.COLOR_BGR2LAB).astype(np.float32)
    bgc=np.median(np.concatenate([lab[:3].reshape(-1,3),lab[-3:].reshape(-1,3),lab[:,:3].reshape(-1,3),lab[:,-3:].reshape(-1,3)]),0)
    d=np.linalg.norm(lab-bgc,axis=2)
    tol=6 if name in('navien','gree') else 9
    near=d<tol
    lbl,_=ndi.label(near); border=set(np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]])))-{0}
    bg=np.isin(lbl,list(border))
    hsv=cv2.cvtColor(img,cv2.COLOR_BGR2HSV)
    if name.startswith('lennox'):
        wood=(hsv[...,1]>55)&(hsv[...,0]<25)
        wood[:int(h*0.55)]=False
        # also everything in lower band outside furnace columns
        bg|=wood
    if name=='gree':
        bg[770:,:]=True
    mask=np.full((h,w),cv2.GC_PR_FGD,np.uint8)
    mask[bg]=cv2.GC_PR_BGD
    mask[ndi.binary_erosion(bg,iterations=6)]=cv2.GC_BGD
    mask[:2]=mask[-2:]=cv2.GC_BGD; mask[:,:2]=mask[:,-2:]=cv2.GC_BGD
    if name=='gree': mask[790:]=cv2.GC_BGD
    if name.startswith('lennox'):
        mask[wood & ndi.binary_erosion(wood,iterations=3)]=cv2.GC_BGD
    if name!='noritz-logo':
        bm=np.zeros((1,65)),np.zeros((1,65))
        cv2.grabCut(img,mask,None,bm[0],bm[1],4,cv2.GC_INIT_WITH_MASK)
    fg=((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD))
    # keep largest components, fill holes
    lb,n=ndi.label(fg)
    if n>1 and name!='noritz-logo':
        sizes=ndi.sum(fg,lb,range(1,n+1)); keep=[i+1 for i,s in enumerate(sizes) if s>0.02*sizes.max()]
        fg=np.isin(lb,keep)
    fg=ndi.binary_fill_holes(fg)
    a=cv2.GaussianBlur(fg.astype(np.float32),(0,0),1.1)
    a=np.clip((a-0.15)/0.7,0,1)
    rgba=np.dstack([img,(a*255).astype(np.uint8)])
    ys,xs=np.where(a>0.05); y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgba=rgba[y0:y1,x0:x1]
    cv2.imwrite(f'{out}/{name}.png',rgba)
    print(name,rgba.shape)
