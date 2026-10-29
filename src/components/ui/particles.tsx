'use client';

import React, { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface ParticlesProps extends ComponentPropsWithoutRef<'div'> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? value.split('').map((char) => char + char).join('') : value;
  const parsed = Number.parseInt(full, 16);
  return Number.isNaN(parsed) ? [255, 255, 255] : [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255];
};

export const Particles: React.FC<ParticlesProps> = ({
  className = '', quantity = 100, staticity = 50, ease = 50, size = 0.4,
  refresh = false, color = '#ffffff', vx = 0, vy = 0, ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!container || !canvas || !context) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const rgb = hexToRgb(color);
    const mouse = { x: 0, y: 0 };
    const canvasSize = { width: 0, height: 0 };
    const circles: Circle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const safeEase = Math.max(1, ease);
    const safeStaticity = Math.max(1, staticity);
    let animationFrame = 0;
    let resizeFrame = 0;
    let visible = true;

    const circleParams = (): Circle => ({
      x: Math.floor(Math.random() * canvasSize.width), y: Math.floor(Math.random() * canvasSize.height),
      translateX: 0, translateY: 0, size: Math.floor(Math.random() * 2) + size, alpha: 0,
      targetAlpha: Number((Math.random() * 0.6 + 0.1).toFixed(1)), dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1, magnetism: 0.1 + Math.random() * 4
    });

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvasSize.width = Math.max(1, Math.floor(rect.width));
      canvasSize.height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(canvasSize.width * dpr);
      canvas.height = Math.floor(canvasSize.height * dpr);
      canvas.style.width = `${canvasSize.width}px`;
      canvas.style.height = `${canvasSize.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      circles.length = 0;
      for (let index = 0; index < quantity; index += 1) circles.push(circleParams());
    };

    const draw = (animate: boolean) => {
      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
      for (let index = circles.length - 1; index >= 0; index -= 1) {
        const circle = circles[index];
        const edge = [circle.x + circle.translateX - circle.size, canvasSize.width - circle.x - circle.translateX - circle.size, circle.y + circle.translateY - circle.size, canvasSize.height - circle.y - circle.translateY - circle.size];
        const edgeAlpha = Math.min(Math.max(Math.min(...edge) / 20, 0), 1);
        circle.alpha = edgeAlpha < 1 ? circle.targetAlpha * edgeAlpha : Math.min(circle.alpha + 0.02, circle.targetAlpha);

        if (animate) {
          circle.x += circle.dx + vx;
          circle.y += circle.dy + vy;
          circle.translateX += (mouse.x / (safeStaticity / circle.magnetism) - circle.translateX) / safeEase;
          circle.translateY += (mouse.y / (safeStaticity / circle.magnetism) - circle.translateY) / safeEase;
        }
        context.beginPath();
        context.arc(circle.x + circle.translateX, circle.y + circle.translateY, circle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(${rgb.join(', ')}, ${circle.alpha})`;
        context.fill();
        if (circle.x < -circle.size || circle.x > canvasSize.width + circle.size || circle.y < -circle.size || circle.y > canvasSize.height + circle.size) circles[index] = circleParams();
      }
    };

    const animate = () => {
      animationFrame = 0;
      if (!visible) return;
      draw(!reduceMotion);
      animationFrame = window.requestAnimationFrame(animate);
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - canvasSize.width / 2;
      const y = event.clientY - rect.top - canvasSize.height / 2;
      if (x > -canvasSize.width / 2 && x < canvasSize.width / 2 && y > -canvasSize.height / 2 && y < canvasSize.height / 2) { mouse.x = x; mouse.y = y; }
    };
    const onPointerLeave = () => { mouse.x = 0; mouse.y = 0; };
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !animationFrame && !reduceMotion) animationFrame = requestAnimationFrame(animate);
    }, { threshold: 0.01 });

    resizeObserver.observe(container);
    visibilityObserver.observe(container);
    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave, { passive: true });
    resize();
    draw(!reduceMotion);
    if (!reduceMotion) animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [color, ease, quantity, refresh, size, staticity, vx, vy]);

  return <div ref={containerRef} className={cn('pointer-events-none', className)} aria-hidden="true" {...props}><canvas ref={canvasRef} className="size-full" /></div>;
};
