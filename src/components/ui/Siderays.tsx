'use client';
import { useRef, useEffect, useState } from 'react';

type Origin = 'top-right'|'top-left'|'bottom-right'|'bottom-left';
interface SideRaysProps {
  speed?:number; rayColor1?:string; rayColor2?:string; intensity?:number;
  spread?:number; origin?:Origin; tilt?:number; saturation?:number;
  blend?:number; falloff?:number; opacity?:number; className?:string;
}

const toRgb = (hex:string):[number,number,number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m?[parseInt(m[1],16)/255,parseInt(m[2],16)/255,parseInt(m[3],16)/255]:[1,1,1];
};
const flipOf = (o:Origin):[number,number] =>
  o==='top-left'?[1,0]:o==='bottom-right'?[0,1]:o==='bottom-left'?[1,1]:[0,0];

export default function SideRays({
  speed=2.5,rayColor1='#F97316',rayColor2='#96c8ff',intensity=2,spread=2,
  origin='top-right',tilt=0,saturation=1.5,blend=0.75,falloff=1.6,opacity=1,className='',
}:SideRaysProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible,setVisible] = useState(false);
  const cleanRef = useRef<(()=>void)|null>(null);

  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const ob=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{threshold:0.1});
    ob.observe(el); return()=>ob.disconnect();
  },[]);

  useEffect(()=>{
    if(!visible||!ref.current) return;
    if(cleanRef.current){cleanRef.current();cleanRef.current=null;}
    let rafId:number, cancelled=false;

    (async()=>{
      await new Promise<void>(r=>setTimeout(r,10));
      if(cancelled||!ref.current) return;
      const el=ref.current;

      // Fallback canvas renderer (no OGL dep needed for portfolio)
      const canvas=document.createElement('canvas');
      canvas.style.width='100%'; canvas.style.height='100%';
      while(el.firstChild) el.removeChild(el.firstChild);
      el.appendChild(canvas);

      const ctx=canvas.getContext('2d')!;
      const [flipX,flipY]=flipOf(origin);
      let W=0,H=0,t=0;

      const resize=()=>{
        W=el.clientWidth; H=el.clientHeight;
        canvas.width=W; canvas.height=H;
      };

      const [r1,g1,b1]=toRgb(rayColor1);
      const [r2,g2,b2]=toRgb(rayColor2);

      const draw=(now:number)=>{
        t=now*0.001*speed;
        ctx.clearRect(0,0,W,H);
        // Ray source: top-right quadrant
        const sx = flipX>0.5 ? W*-0.1 : W*1.1;
        const sy = flipY>0.5 ? H*1.5  : -H*0.5;
        const tiltRad = tilt*Math.PI/180;
        const NUM=16;
        for(let i=0;i<NUM;i++){
          const angle = (Math.PI*0.25)+(i/NUM-0.5)*spread*0.55+tiltRad;
          const wave  = 0.5+0.35*Math.sin(i*2.1+t*speed)+0.2*Math.cos(i*1.3+t*speed*0.4);
          const len   = Math.sqrt(W*W+H*H)*1.5;
          const ex    = sx+Math.cos(angle)*len;
          const ey    = sy+Math.sin(angle)*len;
          const frac  = i/NUM;
          const rv    = r1+(r2-r1)*frac, gv=g1+(g2-g1)*frac, bv=b1+(b2-b1)*frac;
          const alpha = wave*(intensity*0.12)*opacity*(1-frac*0.4)*saturation;
          const grad  = ctx.createLinearGradient(sx,sy,ex,ey);
          grad.addColorStop(0,`rgba(${(rv*255)|0},${(gv*255)|0},${(bv*255)|0},${Math.min(alpha,0.55)})`);
          grad.addColorStop(falloff>1?0.4:0.6,'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.moveTo(sx,sy);
          const spread2=spread*0.3;
          ctx.lineTo(sx+Math.cos(angle-spread2)*len,sy+Math.sin(angle-spread2)*len);
          ctx.lineTo(ex,ey);
          ctx.closePath();
          ctx.fillStyle=grad; ctx.fill();
        }
        if(!cancelled) rafId=requestAnimationFrame(draw);
      };

      resize();
      const ro=new ResizeObserver(resize); ro.observe(el);
      rafId=requestAnimationFrame(draw);
      cleanRef.current=()=>{cancelled=true;cancelAnimationFrame(rafId);ro.disconnect();canvas.remove();};
    })();
    return()=>{cancelled=true;if(cleanRef.current){cleanRef.current();cleanRef.current=null;}};
  },[visible,speed,rayColor1,rayColor2,intensity,spread,origin,tilt,saturation,blend,falloff,opacity]);

  return <div ref={ref} className={className}
    style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',pointerEvents:'none',zIndex:3}} />;
}