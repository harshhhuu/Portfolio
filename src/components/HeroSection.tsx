'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScrollStore } from '@/store/useScrollStore';
import { PERSONAL } from '@/lib/constants';

export default function HeroSection() {
  const isLoaded = useScrollStore((s) => s.isLoaded);
  const setCursorVariant = useScrollStore((s) => s.setCursorVariant);
  const containerRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoaded) return;

    // Reset initial states
    gsap.set([line1Ref.current, line2Ref.current], { y: '100%' });
    gsap.set(detailsRef.current, { opacity: 0, y: 20 });
    gsap.set(scrollIndicatorRef.current, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.5 });

    tl.to([line1Ref.current, line2Ref.current], {
      y: '0%',
      duration: 1.4,
      ease: 'power4.out',
      stagger: 0.15,
    });

    tl.to(
      detailsRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
      },
      '-=0.6'
    );

    tl.to(
      scrollIndicatorRef.current,
      {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.4'
    );
  }, [isLoaded]);

  const handleScrollExplore = () => {
    const nextSection = document.querySelector('#work');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="min-h-screen w-full flex flex-col items-center justify-between pt-32 pb-12 px-6 md:px-12 lg:px-24 relative overflow-hidden"
    >
      {/* Empty Top Div to stretch columns */}
      <div />

      {/* Main Massive Typography */}
      <div className="max-w-6xl w-full mx-auto flex flex-col justify-center flex-1">
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-black font-display tracking-tighter leading-[0.9] uppercase select-none">
          <span className="block overflow-hidden py-1">
            <span ref={line1Ref} className="block transform">
              Building <span className="italic font-light text-accent">digital</span>
            </span>
          </span>
          <span className="block overflow-hidden py-1">
            <span ref={line2Ref} className="block transform">
              experiences <span className="italic font-light">that matter</span>
            </span>
          </span>
        </h1>

        {/* Subtitle Details */}
        <div
          ref={detailsRef}
          className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-0"
        >
          <div className="max-w-md">
            <p className="text-sm font-mono tracking-wider text-textMuted uppercase">
              {PERSONAL.title} · {PERSONAL.location}
            </p>
            <p className="text-lg md:text-xl text-text mt-2 font-medium">
              {PERSONAL.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar with Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="max-w-6xl w-full mx-auto flex justify-between items-center opacity-0 mt-8"
      >
        <button
          onClick={handleScrollExplore}
          className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-textMuted uppercase hover:text-accent transition-colors duration-300 pointer-events-auto"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Scroll to explore
        </button>

        <span className="text-[10px] font-mono tracking-widest text-textMuted uppercase hidden sm:block">
          HARSH MAKWANA © 2026
        </span>
      </div>
    </section>
  );
}
