'use client';
import React, { useEffect, useRef } from 'react';

interface FuzzyTextProps {
  children: React.ReactNode;
  fontSize?: number|string;
  fontWeight?: string|number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  fuzzRange?: number;
  fps?: number;
  gradient?: string[]|null;
  className?: string;
  glitchMode?: boolean;
  glitchInterval?: number;
  glitchDuration?: number;
}

const FuzzyText: React.FC<FuzzyTextProps> = ({
  children, fontSize='clamp(2rem,8vw,8rem)', fontWeight=900,
  fontFamily='inherit', color='#fff', enableHover=true,
  baseIntensity=0.18, hoverIntensity=0.5, fuzzRange=30, fps=60,
  gradient=null, className='', glitchMode=false,
  glitchInterval=2000, glitchDuration=200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement & { _cleanup?:()=>void }>(null);

  useEffect(()=>{
    let rafId:number, cancelled=false;
    let glitchTo:ReturnType<typeof setTimeout>, glitchEnd:ReturnType<typeof setTimeout>;
    const canvas=canvasRef.current; if(!canvas) return;

    const init=async()=>{
      const ctx=canvas.getContext('2d'); if(!ctx) return;
      const ff = fontFamily==='inherit'
        ? window.getComputedStyle(canvas).fontFamily||'sans-serif' : fontFamily;
      const fsStr = typeof fontSize==='number'?`${fontSize}px`:fontSize;
      const fontStr=`${fontWeight} ${fsStr} ${ff}`;
      try { await document.fonts.load(fontStr); } catch { await document.fonts.ready; }
      if(cancelled) return;

      let numFs:number;
      if(typeof fontSize==='number'){numFs=fontSize;}
      else {
        const tmp=document.createElement('span');
        tmp.style.fontSize=fontSize; document.body.appendChild(tmp);
        numFs=parseFloat(window.getComputedStyle(tmp).fontSize);
        document.body.removeChild(tmp);
      }

      const text=React.Children.toArray(children).join('');
      const off=document.createElement('canvas');
      const offCtx=off.getContext('2d')!;
      offCtx.font=fontStr; offCtx.textBaseline='alphabetic';
      const metrics=offCtx.measureText(text);
      const asc=metrics.actualBoundingBoxAscent??numFs;
      const desc=metrics.actualBoundingBoxDescent??numFs*0.2;
      const bw=Math.ceil((metrics.actualBoundingBoxLeft??0)+(metrics.actualBoundingBoxRight??metrics.width))+10;
      const bh=Math.ceil(asc+desc);
      off.width=bw; off.height=bh;
      offCtx.font=fontStr; offCtx.textBaseline='alphabetic';
      if(gradient&&gradient.length>=2){
        const g=offCtx.createLinearGradient(0,0,bw,0);
        gradient.forEach((c,i)=>g.addColorStop(i/(gradient.length-1),c));
        offCtx.fillStyle=g;
      } else { offCtx.fillStyle=color; }
      offCtx.fillText(text,5,asc);

      const hm=fuzzRange+20;
      canvas.width=bw+hm*2; canvas.height=bh;
      ctx.translate(hm,0);

      let hovering=false, glitching=false, intensity=baseIntensity;
      const target=()=>glitching?1:hovering?hoverIntensity:baseIntensity;
      const frame=1000/fps; let last=0;

      if(glitchMode){
        const loop=()=>{
          glitchTo=setTimeout(()=>{
            glitching=true;
            glitchEnd=setTimeout(()=>{ glitching=false; if(!cancelled)loop(); },glitchDuration);
          },glitchInterval);
        };
        loop();
      }

      const run=(ts:number)=>{
        if(cancelled) return;
        if(ts-last<frame){ rafId=requestAnimationFrame(run); return; }
        last=ts;
        intensity+=(target()-intensity)*0.15;
        ctx.clearRect(-hm,0,canvas.width,bh);
        for(let j=0;j<bh;j++){
          const dx=Math.floor(intensity*(Math.random()-0.5)*fuzzRange*2);
          ctx.drawImage(off,0,j,bw,1,dx,j,bw,1);
        }
        rafId=requestAnimationFrame(run);
      };
      rafId=requestAnimationFrame(run);

      if(enableHover){
        const mv=(e:MouseEvent)=>{
          const r=canvas.getBoundingClientRect();
          hovering=(e.clientX-r.left>=hm&&e.clientX-r.left<=hm+bw);
        };
        const ml=()=>{hovering=false;};
        canvas.addEventListener('mousemove',mv);
        canvas.addEventListener('mouseleave',ml);
        canvas._cleanup=()=>{canvas.removeEventListener('mousemove',mv);canvas.removeEventListener('mouseleave',ml);};
      }
    };

    init();
    return()=>{
      cancelled=true; cancelAnimationFrame(rafId);
      clearTimeout(glitchTo); clearTimeout(glitchEnd);
      if(canvas._cleanup) canvas._cleanup();
    };
  },[children,fontSize,fontWeight,fontFamily,color,enableHover,baseIntensity,
     hoverIntensity,fuzzRange,fps,gradient,glitchMode,glitchInterval,glitchDuration]);

  return <canvas ref={canvasRef} className={className} style={{display:'block',maxWidth:'100%'}} />;
};
export default FuzzyText;