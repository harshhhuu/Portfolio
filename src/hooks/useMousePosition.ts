'use client';

import { useEffect } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

export function useMousePosition() {
  const setMouse = useScrollStore((s) => s.setMouse);

  useEffect(() => {
    let rafId: number | null = null;
    let latestX = 0;
    let latestY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      latestX = (e.clientX / window.innerWidth) * 2 - 1;
      latestY = -(e.clientY / window.innerHeight) * 2 + 1;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          setMouse(latestX, latestY);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [setMouse]);
}
