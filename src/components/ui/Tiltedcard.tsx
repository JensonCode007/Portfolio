'use client';
import { useRef, useState } from 'react';

interface SpringState { rotateX: number; rotateY: number; scale: number; }

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  overlayContent?: React.ReactNode;
  displayOverlayContent?: boolean;
}

export default function TiltedCard({
  imageSrc, altText = 'Tilted card image', captionText = '',
  containerHeight = '300px', containerWidth = '300px',
  imageHeight = '300px', imageWidth = '300px',
  scaleOnHover = 1.08, rotateAmplitude = 14,
  showMobileWarning = false, showTooltip = true,
  overlayContent = null, displayOverlayContent = false,
}: TiltedCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [spring, setSpring] = useState<SpringState>({ rotateX: 0, rotateY: 0, scale: 1 });
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, opacity: 0 });
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });
  const currentRef = useRef({ rotateX: 0, rotateY: 0, scale: 1 });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = () => {
    const c = currentRef.current, t = targetRef.current;
    c.rotateX = lerp(c.rotateX, t.rotateX, 0.12);
    c.rotateY = lerp(c.rotateY, t.rotateY, 0.12);
    c.scale   = lerp(c.scale,   t.scale,   0.12);
    setSpring({ ...c });
    const dx = Math.abs(c.rotateX - t.rotateX);
    const dy = Math.abs(c.rotateY - t.rotateY);
    if (dx > 0.01 || dy > 0.01) rafRef.current = requestAnimationFrame(animate);
  };

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width / 2;
    const oy = e.clientY - rect.top  - rect.height / 2;
    targetRef.current.rotateX = (oy / (rect.height / 2)) * -rotateAmplitude;
    targetRef.current.rotateY = (ox / (rect.width  / 2)) *  rotateAmplitude;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  const onEnter = () => { targetRef.current.scale = scaleOnHover; };
  const onLeave = () => {
    targetRef.current = { rotateX: 0, rotateY: 0, scale: 1 };
    setTooltip(p => ({ ...p, opacity: 0 }));
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  };

  return (
    <figure ref={ref} style={{ position: 'relative', width: containerWidth, height: containerHeight,
        perspective: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {showMobileWarning && (
        <div style={{ position: 'absolute', top: 8, fontSize: '0.75rem', display: 'none' }}>
          Best viewed on desktop.
        </div>
      )}
      <div style={{ position: 'relative', transformStyle: 'preserve-3d', width: imageWidth, height: imageHeight,
          transform: `rotateX(${spring.rotateX}deg) rotateY(${spring.rotateY}deg) scale(${spring.scale})`,
          transition: 'transform 0.05s linear' }}>
        <img src={imageSrc} alt={altText}
          style={{ position: 'absolute', top: 0, left: 0, width: imageWidth, height: imageHeight,
            objectFit: 'cover', borderRadius: 15, transform: 'translateZ(0)', willChange: 'transform' }} />
        {displayOverlayContent && overlayContent && (
          <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, transform: 'translateZ(30px)' }}>
            {overlayContent}
          </div>
        )}
      </div>
      {showTooltip && captionText && (
        <div style={{ pointerEvents: 'none', position: 'absolute', left: tooltip.x, top: tooltip.y,
            background: '#fff', color: '#2d2d2d', borderRadius: 4, padding: '4px 10px',
            fontSize: '0.7rem', opacity: tooltip.opacity, zIndex: 3,
            transition: 'opacity 0.2s ease', transform: 'translate(8px, 8px)', whiteSpace: 'nowrap' }}>
          {captionText}
        </div>
      )}
    </figure>
  );
}