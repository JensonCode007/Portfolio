'use client';
import { useRef, useCallback, useState, useEffect, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  edgeSensitivity?: number;
  glowColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
  glowRadius?: number;
  glowIntensity?: number;
  coneSpread?: number;
  animated?: boolean;
  colors?: string[];
  fillOpacity?: number;
  style?: React.CSSProperties;
}

function parseHSL(s: string) {
  const m = s.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  return m ? { h: +m[1], s: +m[2], l: +m[3] } : { h: 40, s: 80, l: 80 };
}

function buildBoxShadow(glowColor: string, intensity: number) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const layers: [number,number,number,number,number,boolean][] = [
    [0,0,0,1,100,true],[0,0,1,0,60,true],[0,0,3,0,50,true],[0,0,6,0,40,true],
    [0,0,15,0,30,true],[0,0,25,2,20,true],[0,0,50,2,10,true],
    [0,0,1,0,60,false],[0,0,3,0,50,false],[0,0,6,0,40,false],
    [0,0,15,0,30,false],[0,0,25,2,20,false],[0,0,50,2,10,false],
  ];
  return layers.map(([x,y,blur,spread,alpha,inset]) =>
    `${inset?'inset ':''}${x}px ${y}px ${blur}px ${spread}px hsl(${base} / ${Math.min(alpha*intensity,100)}%)`
  ).join(', ');
}

function easeOut(x: number) { return 1 - Math.pow(1 - x, 3); }
function easeIn(x: number)  { return x * x * x; }

function animVal({ start=0, end=100, duration=1000, delay=0, ease=easeOut,
  onUpdate, onEnd }: { start?:number;end?:number;duration?:number;delay?:number;
  ease?:(t:number)=>number;onUpdate:(v:number)=>void;onEnd?:()=>void }) {
  const t0 = performance.now() + delay;
  const tick = () => {
    const elapsed = performance.now() - t0;
    const t = Math.min(elapsed / duration, 1);
    onUpdate(start + (end - start) * ease(t));
    if (t < 1) requestAnimationFrame(tick);
    else if (onEnd) onEnd();
  };
  setTimeout(() => requestAnimationFrame(tick), delay);
}

const POS = ['80% 55%','69% 34%','8% 6%','41% 38%','86% 85%','82% 18%','51% 4%'];
const CMAP = [0,1,2,0,1,2,1];

function meshGrads(colors: string[]) {
  return [...Array(7)].map((_,i) =>
    `radial-gradient(at ${POS[i]}, ${colors[Math.min(CMAP[i],colors.length-1)]} 0px, transparent 50%)`
  ).concat(`linear-gradient(${colors[0]} 0 100%)`);
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children, className='', edgeSensitivity=30, glowColor='40 80 80',
  backgroundColor='#120F17', borderRadius=28, glowRadius=40, glowIntensity=1,
  coneSpread=25, animated=false, colors=['#c084fc','#f472b6','#38bdf8'],
  fillOpacity=0.5, style={},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [angle, setAngle] = useState(45);
  const [edgeProx, setEdgeProx] = useState(0);
  const [sweeping, setSweeping] = useState(false);

  const center = useCallback((el: HTMLElement) => {
    const { width, height } = el.getBoundingClientRect();
    return [width/2, height/2];
  }, []);

  const getProx = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx,cy] = center(el);
    const dx=x-cx, dy=y-cy;
    let kx=Infinity, ky=Infinity;
    if (dx!==0) kx=cx/Math.abs(dx);
    if (dy!==0) ky=cy/Math.abs(dy);
    return Math.min(Math.max(1/Math.min(kx,ky),0),1);
  }, [center]);

  const getAngle = useCallback((el: HTMLElement, x: number, y: number) => {
    const [cx,cy] = center(el);
    let deg = Math.atan2(y-cy, x-cx) * (180/Math.PI) + 90;
    return deg < 0 ? deg + 360 : deg;
  }, [center]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX-rect.left, y = e.clientY-rect.top;
    setEdgeProx(getProx(card,x,y)); setAngle(getAngle(card,x,y));
  }, [getProx, getAngle]);

  useEffect(() => {
    if (!animated) return;
    setSweeping(true); setAngle(110);
    animVal({ duration:500, onUpdate: v => setEdgeProx(v/100) });
    animVal({ ease:easeIn, duration:1500, end:50, onUpdate: v => setAngle(110+(465-110)*(v/100)) });
    animVal({ ease:easeOut, delay:1500, duration:2250, start:50, end:100, onUpdate: v => setAngle(110+(465-110)*(v/100)) });
    animVal({ ease:easeIn, delay:2500, duration:1500, start:100, end:0,
      onUpdate: v => setEdgeProx(v/100), onEnd: () => setSweeping(false) });
  }, [animated]);

  const vis = hovered || sweeping;
  const borderOp = vis ? Math.max(0,(edgeProx*100-edgeSensitivity-20)/(100-edgeSensitivity-20)) : 0;
  const glowOp   = vis ? Math.max(0,(edgeProx*100-edgeSensitivity)/(100-edgeSensitivity)) : 0;
  const grads = meshGrads(colors);
  const angleDeg = `${angle.toFixed(3)}deg`;
  const cone = `conic-gradient(from ${angleDeg} at center, black ${coneSpread}%, transparent ${coneSpread+15}%, transparent ${100-coneSpread-15}%, black ${100-coneSpread}%)`;

  return (
    <div ref={cardRef} onPointerMove={onPointerMove}
      onPointerEnter={()=>setHovered(true)} onPointerLeave={()=>setHovered(false)}
      className={`relative grid isolate ${className}`}
      style={{ background:backgroundColor, borderRadius, border:'1px solid rgba(255,255,255,0.08)',
        boxShadow:'rgba(0,0,0,0.15) 0 2px 4px, rgba(0,0,0,0.1) 0 8px 16px, rgba(0,0,0,0.1) 0 32px 64px',
        transform:'translate3d(0,0,0.01px)', ...style }}>
      {/* border layer */}
      <div style={{ position:'absolute', inset:0, borderRadius:'inherit', border:'1px solid transparent', zIndex:-1,
          background:[`linear-gradient(${backgroundColor} 0 100%) padding-box`,
            'linear-gradient(rgb(255 255 255 / 0%) 0% 100%) border-box',
            ...grads.map(g=>`${g} border-box`)].join(', '),
          opacity:borderOp, maskImage:cone, WebkitMaskImage:cone,
          transition: vis?'opacity 0.25s ease-out':'opacity 0.75s ease-in-out' }} />
      {/* fill layer */}
      <div style={{ position:'absolute', inset:0, borderRadius:'inherit', border:'1px solid transparent', zIndex:-1,
          background:grads.map(g=>`${g} padding-box`).join(', '),
          maskImage:[
            'linear-gradient(to bottom, black, black)',
            'radial-gradient(ellipse at 50% 50%, black 40%, transparent 65%)',
            'radial-gradient(ellipse at 66% 66%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 66% 33%, black 5%, transparent 40%)',
            'radial-gradient(ellipse at 33% 66%, black 5%, transparent 40%)',
            `conic-gradient(from ${angleDeg} at center, transparent 5%, black 15%, black 85%, transparent 95%)`,
          ].join(', '),
          maskComposite:'subtract, add, add, add, add, add',
          opacity:borderOp*fillOpacity, mixBlendMode:'soft-light' as const,
          transition: vis?'opacity 0.25s ease-out':'opacity 0.75s ease-in-out' } as React.CSSProperties} />
      {/* glow */}
      <span style={{ position:'absolute', pointerEvents:'none', zIndex:1, borderRadius:'inherit',
          inset:`-${glowRadius}px`,
          maskImage:`conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          WebkitMaskImage:`conic-gradient(from ${angleDeg} at center, black 2.5%, transparent 10%, transparent 90%, black 97.5%)`,
          opacity:glowOp, mixBlendMode:'plus-lighter' as const,
          transition: vis?'opacity 0.25s ease-out':'opacity 0.75s ease-in-out' } as React.CSSProperties}>
        <span style={{ position:'absolute', borderRadius:'inherit', inset:glowRadius, boxShadow:buildBoxShadow(glowColor,glowIntensity) }} />
      </span>
      <div style={{ display:'flex', flexDirection:'column', position:'relative', overflow:'auto', zIndex:1 }}>
        {children}
      </div>
    </div>
  );
};
export default BorderGlow;