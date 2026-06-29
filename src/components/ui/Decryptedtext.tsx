'use client';
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start'|'end'|'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: 'view'|'hover'|'click';
  style?: React.CSSProperties;
}

export default function DecryptedText({
  text, speed=50, maxIterations=10, sequential=false,
  revealDirection='start', useOriginalCharsOnly=false,
  characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()',
  className='', encryptedClassName='', parentClassName='',
  animateOn='hover', style={},
}: DecryptedTextProps) {
  const [display, setDisplay] = useState(text);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(animateOn!=='click');
  const [animated, setAnimated] = useState(false);
  const ivRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const chars = useMemo(()=>
    useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(c=>c!==' ')
      : characters.split(''),
  [useOriginalCharsOnly,text,characters]);

  const scramble = useCallback((orig:string, revSet:Set<number>) =>
    orig.split('').map((c,i)=>{
      if(c===' ') return ' ';
      if(revSet.has(i)) return orig[i];
      return chars[Math.floor(Math.random()*chars.length)];
    }).join('')
  ,[chars]);

  const start = useCallback(()=>{
    if(running) return;
    setRevealed(new Set()); setDone(false); setRunning(true);
  },[running]);

  const reset = useCallback(()=>{
    if(ivRef.current) clearInterval(ivRef.current);
    setRunning(false); setRevealed(new Set()); setDisplay(text); setDone(true);
  },[text]);

  useEffect(()=>{
    if(!running) return;
    let iter=0;
    ivRef.current=setInterval(()=>{
      setRevealed(prev=>{
        if(sequential){
          if(prev.size>=text.length){
            clearInterval(ivRef.current!); setRunning(false); setDone(true); return prev;
          }
          const next=new Set(prev);
          const idx = revealDirection==='end' ? text.length-1-prev.size
            : revealDirection==='center'
              ? (() => { const m=Math.floor(text.length/2), o=Math.floor(prev.size/2);
                  return prev.size%2===0?m+o:m-o-1; })()
              : prev.size;
          next.add(idx);
          setDisplay(scramble(text,next));
          return next;
        } else {
          setDisplay(scramble(text,prev));
          iter++;
          if(iter>=maxIterations){
            clearInterval(ivRef.current!); setRunning(false);
            setDisplay(text); setDone(true);
          }
          return prev;
        }
      });
    },speed);
    return()=>{ if(ivRef.current) clearInterval(ivRef.current); };
  },[running,text,speed,maxIterations,sequential,revealDirection,scramble]);

  useEffect(()=>{
    if(animateOn!=='view') return;
    const el=containerRef.current; if(!el) return;
    const ob=new IntersectionObserver(([e])=>{
      if(e.isIntersecting&&!animated){ setAnimated(true); start(); }
    },{threshold:0.1});
    ob.observe(el); return()=>ob.disconnect();
  },[animateOn,animated,start]);

  useEffect(()=>{ if(animateOn==='click'){ setDisplay(scramble(text,new Set())); setDone(false); } },[animateOn,text,scramble]);

  const handlers = animateOn==='hover'
    ? { onMouseEnter:start, onMouseLeave:reset }
    : animateOn==='click'
      ? { onClick:()=>{ if(!done&&!running) start(); } }
      : {};

  return (
    <span ref={containerRef} className={`inline-block whitespace-pre-wrap ${parentClassName}`} style={style} {...handlers}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {display.split('').map((ch,i)=>(
          <span key={i} className={(revealed.has(i)||(!running&&done))?className:encryptedClassName}>{ch}</span>
        ))}
      </span>
    </span>
  );
}