'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorVariant = useScrollStore((s) => s.cursorVariant);
  const cursorLabel = useScrollStore((s) => s.cursorLabel);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only mount on desktop with cursor support
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setIsVisible(true);

    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animFrameId: number;
    const updateRing = () => {
      // Lerp ring coordinate to lag behind the mouse coordinate
      ring.x += (mouse.x - ring.x) * 0.15;
      ring.y += (mouse.y - ring.y) * 0.15;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      animFrameId = requestAnimationFrame(updateRing);
    };

    animFrameId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  if (!isVisible || cursorVariant === 'hidden') return null;

  // Determine size and border classes based on variant
  const getRingStyles = () => {
    switch (cursorVariant) {
      case 'project':
        return {
          width: '70px',
          height: '70px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.1)',
        };
      case 'hover':
        return {
          width: '45px',
          height: '45px',
          border: '1.5px dashed rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.05)',
        };
      default:
        return {
          width: '24px',
          height: '24px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          background: 'transparent',
        };
    }
  };

  const ringStyle = getRingStyles();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-difference">
      {/* Pointer Center Dot */}
      <div
        ref={cursorRef}
        className="absolute w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Lagging Ring */}
      <div
        ref={ringRef}
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-[width,height,background-color,border-style] duration-300 ease-out"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          width: ringStyle.width,
          height: ringStyle.height,
          border: ringStyle.border,
          backgroundColor: ringStyle.background,
        }}
      >
        {cursorVariant === 'project' && (
          <span className="text-[9px] text-white font-mono uppercase tracking-widest font-bold animate-pulse">
            {cursorLabel || 'VIEW'}
          </span>
        )}
      </div>
    </div>
  );
}
