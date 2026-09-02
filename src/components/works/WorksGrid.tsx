'use client';

import { useEffect, useRef } from 'react';
import { PROJECTS } from '@/lib/projects';
import WorksProjectCard from './WorksProjectCard';

export default function WorksGrid() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current || !innerRef.current) return;

    const inner = innerRef.current;
    const totalHeight = inner.scrollHeight / 2; // Half because content is duplicated

    // ── Unified scroll position ──────────────────────────────────
    // This single value drives everything. Both auto-scroll and
    // manual wheel input contribute to it. GSAP modifiers handle wrapping.
    let scrollY = 0;          // Current rendered position (lerped)
    let targetScrollY = 0;    // Target position (instant, from input)
    const autoSpeed = 0.5;    // Auto-scroll pixels per frame (~30px/sec at 60fps)
    const lerpFactor = 0.07;  // Inertia smoothing (lower = smoother, 0.07 = ultra-premium)

    // ── Set the transform directly each frame ────────────────────
    const tick = () => {
      // Auto-scroll: constantly push the target forward
      targetScrollY += autoSpeed;

      // Lerp: smoothly ease current position toward target (Lenis-quality inertia)
      scrollY += (targetScrollY - scrollY) * lerpFactor;

      // Wrap around for infinite loop
      const wrappedY = ((scrollY % totalHeight) + totalHeight) % totalHeight;

      // Apply transform
      inner.style.transform = `translate3d(0, ${-wrappedY}px, 0)`;

      rafId = requestAnimationFrame(tick);
    };

    let rafId = requestAnimationFrame(tick);

    // ── Wheel handler: add delta to target (smooth inertia does the rest) ──
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetScrollY += e.deltaY * 0.8; // Damped multiplier for elegance
    };

    // ── Touch support ────────────────────────────────────────────
    let touchStartY = 0;
    let touchPrevY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchPrevY = touchStartY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const delta = touchPrevY - touchY;
      targetScrollY += delta * 1.2;
      touchPrevY = touchY;
    };

    const scroller = scrollerRef.current;
    scroller.addEventListener('wheel', handleWheel, { passive: false });
    scroller.addEventListener('touchstart', handleTouchStart, { passive: true });
    scroller.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      scroller.removeEventListener('wheel', handleWheel);
      scroller.removeEventListener('touchstart', handleTouchStart);
      scroller.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Duplicate projects for seamless infinite loop
  const displayProjects = [...PROJECTS, ...PROJECTS];

  return (
    <div
      ref={scrollerRef}
      className="relative h-screen overflow-hidden"
    >
      <div ref={innerRef} className="flex flex-col gap-6 md:gap-8 p-4 md:p-6 lg:p-8 will-change-transform">
        {displayProjects.map((project, i) => (
          <WorksProjectCard key={`${project.id}-${i}`} project={project} />
        ))}
      </div>
    </div>
  );
}
