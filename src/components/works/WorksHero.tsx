'use client';

import Link from 'next/link';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/store/useScrollStore';

import LiquidText from '@/components/ui/liquid-text';

export default function WorksHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(labelRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
        .from(
          titleRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .from(
          bottomRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        );
    }, containerRef);

    return () => {
      ctx.revert();
      useScrollStore.getState().setCursor('default', '');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col justify-between"
      style={{
        paddingTop: 'clamp(160px, 23vh, 240px)',
        paddingLeft: 'clamp(48px, 6.5vw, 100px)',
        paddingRight: 'clamp(24px, 4vw, 64px)',
        paddingBottom: 'clamp(36px, 6vh, 56px)',
      }}
    >
      {/* Center-forward Group: Label + Royal Italic Headline */}
      <div className="w-full">
        <span
          ref={labelRef}
          className="font-mono text-[11px] tracking-[0.25em] uppercase text-textMuted/75 mb-6 md:mb-8 block"
        >
          Projects
        </span>

        <div
          ref={titleRef}
          className="w-full cursor-pointer"
          onMouseEnter={() => useScrollStore.getState().setCursor('action', 'EXPLORE', '#A855F7')}
          onMouseLeave={() => useScrollStore.getState().setCursor('default', '')}
        >
          <LiquidText
            lines={[
              "Things I made instead of",
              "having a normal",
              "sleep schedule."
            ]}
            fontSize={58}
            lineHeight={1.2}
            fontWeight="400"
            fontStyle="italic"
            fontFamily="var(--font-cormorant), 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
            colorBack="#F5EFEB"
            colorInner="#D4A574"
            colors={["#FFFFFF", "#F3E5D8", "#D4A574"]}
          />
        </div>
      </div>

      {/* Bottom Group: Description + Back to Start Portal + Filter */}
      <div ref={bottomRef} className="flex items-end justify-between w-full pt-8">
        <div className="flex flex-col gap-3.5">
          <p className="text-textMuted/70 text-xs md:text-sm max-w-[280px] leading-relaxed">
            Every project tells a story of creativity, strategy, and impact.
          </p>

          {/* Interactive Back to Start Portal Button */}
          <Link
            href="/"
            onClick={() => useScrollStore.getState().setCursor('default', '')}
            className="group/back inline-flex items-center gap-2.5 w-fit py-1 px-3 -ml-3 rounded-full border border-white/10 hover:border-accent/50 bg-white/[0.03] hover:bg-accent/[0.08] backdrop-blur-sm transition-all duration-300 cursor-pointer"
            onMouseEnter={() => useScrollStore.getState().setCursor('action', 'RETURN', '#00E5FF')}
            onMouseLeave={() => useScrollStore.getState().setCursor('default', '')}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 group-hover/back:bg-accent flex items-center justify-center transition-colors duration-300">
              <svg
                className="w-2.5 h-2.5 text-white transition-transform duration-300 group-hover/back:-translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-textMuted group-hover/back:text-white transition-colors duration-300">
              Back to Start
            </span>
          </Link>
        </div>

        <span
          className="font-mono text-[11px] tracking-widest text-textMuted/60 hover:text-accent transition-colors duration-300 cursor-pointer hidden sm:block uppercase"
          onMouseEnter={() => useScrollStore.getState().setCursor('action', 'FILTER', '#D4A574')}
          onMouseLeave={() => useScrollStore.getState().setCursor('default', '')}
        >
          Filter +
        </span>
      </div>
    </div>
  );
}
