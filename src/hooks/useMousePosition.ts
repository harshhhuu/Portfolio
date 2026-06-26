'use client';

import { useEffect } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

export function useMousePosition() {
  const setMouse = useScrollStore((s) => s.setMouse);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setMouse]);
}
