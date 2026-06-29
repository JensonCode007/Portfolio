// CREDIT: Component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN
import React, { useEffect, useRef, useCallback, CSSProperties, ReactNode } from 'react';

function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const int = parseInt(h, 16);
  return `rgba(${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}, ${alpha})`;
}

interface ElectricBorderProps {
  children?: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children, color = '#5227FF', speed = 1, chaos = 0.12,
  borderRadius = 24, className, style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);

  const random = useCallback((x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);
  const noise2D = useCallback((x: number, y: number) => {
    const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
    const a = random(i + j * 57), b = random(i + 1 + j * 57);
    const c = random(i + (j + 1) * 57), d = random(i + 1 + (j + 1) * 57);
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
  }, [random]);

  const octNoise = useCallback((x: number, octaves: number, lac: number, gain: number, amp: number, freq: number, t: number, seed: number) => {
    let y = 0, amplitude = amp, frequency = freq;
    for (let i = 0; i < octaves; i++) {
      y += amplitude * noise2D(frequency * x + seed * 100, t * frequency * 0.3);
      frequency *= lac; amplitude *= gain;
    }
    return y;
  }, [noise2D]);

  const cornerPt = useCallback((cx: number, cy: number, r: number, startA: number, arcLen: number, p: number) => ({
    x: cx + r * Math.cos(startA + p * arcLen),
    y: cy + r * Math.sin(startA + p * arcLen),
  }), []);

  const rectPt = useCallback((t: number, l: number, top: number, w: number, h: number, r: number) => {
    const sw = w - 2 * r, sh = h - 2 * r, ca = (Math.PI * r) / 2;
    const perim = 2 * sw + 2 * sh + 4 * ca;
    const d = t * perim;
    let acc = 0;
    if (d <= acc + sw) return { x: l + r + ((d - acc) / sw) * sw, y: top };
    acc += sw;
    if (d <= acc + ca) return cornerPt(l + w - r, top + r, r, -Math.PI / 2, Math.PI / 2, (d - acc) / ca);
    acc += ca;
    if (d <= acc + sh) return { x: l + w, y: top + r + ((d - acc) / sh) * sh };
    acc += sh;
    if (d <= acc + ca) return cornerPt(l + w - r, top + h - r, r, 0, Math.PI / 2, (d - acc) / ca);
    acc += ca;
    if (d <= acc + sw) return { x: l + w - r - ((d - acc) / sw) * sw, y: top + h };
    acc += sw;
    if (d <= acc + ca) return cornerPt(l + r, top + h - r, r, Math.PI / 2, Math.PI / 2, (d - acc) / ca);
    acc += ca;
    if (d <= acc + sh) return { x: l, y: top + h - r - ((d - acc) / sh) * sh };
    acc += sh;
    return cornerPt(l + r, top + r, r, Math.PI, Math.PI / 2, (d - acc) / ca);
  }, [cornerPt]);

  useEffect(() => {
    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const offset = 60, disp = 60;
    let W = 0, H = 0, lastDpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = container.getBoundingClientRect();
      W = rect.width + offset * 2; H = rect.height + offset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      return { W, H };
    };
    ({ W, H } = resize());

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (dpr !== lastDpr) { lastDpr = dpr; ({ W, H } = resize()); }
      timeRef.current += ((now - lastFrameRef.current) / 1000) * speed;
      lastFrameRef.current = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = color; ctx.lineWidth = 1.5;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      const l = offset, t = offset;
      const bw = W - 2 * offset, bh = H - 2 * offset;
      const r = Math.min(borderRadius, Math.min(bw, bh) / 2);
      const samples = Math.floor((2 * (bw + bh) + 2 * Math.PI * r) / 2);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = rectPt(p, l, t, bw, bh, r);
        const xn = octNoise(p * 8, 10, 1.6, 0.7, chaos, 10, timeRef.current, 0);
        const yn = octNoise(p * 8, 10, 1.6, 0.7, chaos, 10, timeRef.current, 1);
        const x = pt.x + xn * disp, y = pt.y + yn * disp;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke();
      animRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => { ({ W, H } = resize()); });
    ro.observe(container);
    animRef.current = requestAnimationFrame(draw);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, [color, speed, chaos, borderRadius, octNoise, rectPt]);

  return (
    <div ref={containerRef} className={`relative overflow-visible isolate ${className ?? ''}`}
      style={{ borderRadius, ...style } as CSSProperties}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 2 }}>
        <canvas ref={canvasRef} style={{ display: 'block' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `2px solid ${hexToRgba(color, 0.6)}`, filter: 'blur(1px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: `2px solid ${color}`, filter: 'blur(4px)' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: -1, transform: 'scale(1.1)', opacity: 0.3,
          filter: 'blur(32px)', background: `linear-gradient(-30deg, ${color}, transparent, ${color})` }} />
      </div>
      <div style={{ position: 'relative', borderRadius: 'inherit', zIndex: 1 }}>{children}</div>
    </div>
  );
};
export default ElectricBorder;