'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MagneticProps {
  children: React.ReactElement;
  range?: number;          // Distance in pixels within which the pull triggers
  actionStrength?: number; // Multiplying factor of the offset movement (e.g. 0.35)
}

export default function Magnetic({ children, range = 50, actionStrength = 0.35 }: MagneticProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId: number | null = null;
    let latestEvent: MouseEvent | null = null;
    let isSnappedBack = true; // Track state to avoid redundant gsap.to calls

    const processMouseMove = () => {
      rafId = null;
      if (!latestEvent || !el) return;
      const e = latestEvent;

      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elCenterX;
      const distanceY = e.clientY - elCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        isSnappedBack = false;
        gsap.to(el, {
          x: distanceX * actionStrength,
          y: distanceY * actionStrength,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else if (!isSnappedBack) {
        // Only snap back once — avoid firing elastic tween every frame when cursor is far away
        isSnappedBack = true;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      latestEvent = e;
      if (rafId === null) {
        rafId = requestAnimationFrame(processMouseMove);
      }
    };

    const handleMouseLeave = () => {
      if (!isSnappedBack) {
        isSnappedBack = true;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [range, actionStrength]);

  // Wrap the child element in an inline-block container for local translation coordinate tracking
  return (
    <div ref={containerRef} className="inline-block pointer-events-auto">
      {children}
    </div>
  );
}
