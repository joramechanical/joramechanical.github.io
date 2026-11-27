import cv2,numpy as np,sys
from PIL import Image,ImageFilter
src=sys.argv[1];out=sys.argv[2]
im=Image.open(src).convert("RGBA");a=np.array(im);rgb=a[:,:,:3];al=a[:,:,3]
S=2
# upscale colour with edge-aware steps: cubic up, light denoise, detail enhance, unsharp
big=cv2.resize(cv2.cvtColor(rgb,cv2.COLOR_RGB2BGR),None,fx=S,fy=S,interpolation=cv2.INTER_LANCZOS4)
big=cv2.bilateralFilter(big,5,18,5)
det=cv2.detailEnhance(big,sigma_s=8,sigma_r=0.12)
big=cv2.addWeighted(big,.55,det,.45,0)
blur=cv2.GaussianBlur(big,(0,0),1.6);big=cv2.addWeighted(big,1.55,blur,-.55,0)
alb=cv2.resize(al,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC);alb=cv2.GaussianBlur(alb,(0,0),.7)
alb=np.clip((alb.astype(np.float32)-40)*255/175,0,255).astype(np.uint8)
res=np.dstack([cv2.cvtColor(big,cv2.COLOR_BGR2RGB),alb])
Image.fromarray(res).save(out,"WEBP",quality=92);print(out,res.shape)
