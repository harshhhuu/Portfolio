'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cursorVariant = useScrollStore((s) => s.cursorVariant);
  const cursorLabel = useScrollStore((s) => s.cursorLabel);
  const cursorColor = useScrollStore((s) => s.cursorColor);
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
      // Lerp ring coordinate to lag smoothly behind the mouse
      ring.x += (mouse.x - ring.x) * 0.18;
      ring.y += (mouse.y - ring.y) * 0.18;

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

  const isProject = cursorVariant === 'project';
  const isAction = cursorVariant === 'action';
  const isHover = cursorVariant === 'hover';
  const isNegative = isProject || isAction;

  // Active color for the negative difference shader
  const activeColor = cursorColor || '#cc0597';

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-difference">
      {/* Pointer Center Dot (fades when expanding into negative badge) */}
      <div
        ref={cursorRef}
        className={`absolute w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${
          isNegative ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Lagging Ring / Dynamic Negative Shade Badge */}
      <div
        ref={ringRef}
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-[width,height,background-color,border-color,transform] duration-300 ease-out"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          width: isProject ? '116px' : isAction ? '84px' : isHover ? '50px' : '24px',
          height: isProject ? '116px' : isAction ? '84px' : isHover ? '50px' : '24px',
          backgroundColor: isNegative ? activeColor : isHover ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          border: isNegative ? 'none' : isHover ? '1.5px dashed rgba(255, 255, 255, 0.8)' : '1px solid rgba(255, 255, 255, 0.5)',
        }}
      >
        {isProject && (
          <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-300">
            {/* Rotating circular SVG text path */}
            <svg
              className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]"
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="circlePath"
                  d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                />
              </defs>
              <text
                fill="white"
                fontSize="9"
                letterSpacing="2.2"
                fontWeight="700"
                fontFamily="var(--font-sans), sans-serif"
              >
                <textPath href="#circlePath">
                  DISCOVER • DISCOVER • DISCOVER •
                </textPath>
              </text>
            </svg>

            {/* Center label */}
            <span className="text-[11px] font-mono tracking-widest text-white uppercase font-bold">
              {cursorLabel || 'VIEW'}
            </span>
          </div>
        )}

        {isAction && (
          <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in duration-200">
            {/* Compact rotating circular text for interactive buttons/actions */}
            <svg
              className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]"
              viewBox="0 0 100 100"
            >
              <defs>
                <path
                  id="actionCirclePath"
                  d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0"
                />
              </defs>
              <text
                fill="white"
                fontSize="9.5"
                letterSpacing="2"
                fontWeight="700"
                fontFamily="var(--font-sans), sans-serif"
              >
                <textPath href="#actionCirclePath">
                  EXPLORE • EXPLORE • EXPLORE •
                </textPath>
              </text>
            </svg>

            {/* Center label */}
            <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold">
              {cursorLabel || 'OPEN'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
