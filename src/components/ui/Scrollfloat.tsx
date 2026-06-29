'use client';
import { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  as?: 'h1'|'h2'|'h3'|'p'|'span';
}

export default function ScrollFloat({
  children, scrollContainerRef, containerClassName='', textClassName='',
  animationDuration=0.9, stagger=0.03, as: Tag='h2',
}: ScrollFloatProps) {
  const ref = useRef<HTMLElement>(null);

  const chars = useMemo(()=>{
    const text = typeof children==='string' ? children : '';
    return text.split('').map((c,i)=>(
      <span key={i} className="sf-char" style={{ display:'inline-block', willChange:'opacity,transform' }}>
        {c===' '?'\u00A0':c}
      </span>
    ));
  },[children]);

  useEffect(()=>{
    const el = ref.current; if(!el) return;
    const charEls = Array.from(el.querySelectorAll<HTMLElement>('.sf-char'));
    charEls.forEach((c,i)=>{
      c.style.opacity='0';
      c.style.transform='translateY(80%) scaleY(2.3) scaleX(0.7)';
      c.style.transformOrigin='50% 0%';
    });

    const scroller = scrollContainerRef?.current ?? window;
    const root = scroller instanceof Window ? null : scroller as Element;

    const ob = new IntersectionObserver(([entry],obs)=>{
      if(!entry.isIntersecting) return;
      obs.disconnect();
      charEls.forEach((c,i)=>{
        const delay = i*stagger*1000;
        c.style.transition=`opacity ${animationDuration}s cubic-bezier(0.175,0.885,0.32,1.275) ${delay}ms, transform ${animationDuration}s cubic-bezier(0.175,0.885,0.32,1.275) ${delay}ms`;
        c.style.opacity='1';
        c.style.transform='translateY(0) scaleY(1) scaleX(1)';
      });
    },{root, threshold:0.15, rootMargin:'0px 0px -5% 0px'});

    ob.observe(el);
    return()=>ob.disconnect();
  },[scrollContainerRef,animationDuration,stagger]);

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <span className={`inline-block ${textClassName}`}>{chars}</span>
    </Tag>
  );
}