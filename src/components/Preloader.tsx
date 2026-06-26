'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useScrollStore } from '@/store/useScrollStore';
import { PERSONAL } from '@/lib/constants';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);

  const setLoaded = useScrollStore((s) => s.setLoaded);
  const setLoadProgress = useScrollStore((s) => s.setLoadProgress);

  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    const letters = PERSONAL.initials.split('');
    const scrambleLetters = ['X', 'Z', 'Y', 'A', 'W', 'V', 'K', 'Q', 'H', 'M'];
    let scrambleInterval: NodeJS.Timeout;

    // ─── Scramble Monogram Text ───
    if (textRef.current) {
      let count = 0;
      scrambleInterval = setInterval(() => {
        if (count < 8) {
          textRef.current!.innerText = letters
            .map(() => scrambleLetters[Math.floor(Math.random() * scrambleLetters.length)])
            .join('');
          count++;
        } else {
          textRef.current!.innerText = PERSONAL.initials;
          clearInterval(scrambleInterval);
        }
      }, 150);
    }

    // ─── Animate Loading Progress ───
    const progressObj = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        // Peel panels away
        const peelTimeline = gsap.timeline({
          onComplete: () => {
            setLoaded(true);
            // Hide the container fully to allow interactions
            if (containerRef.current) {
              containerRef.current.style.display = 'none';
            }
          }
        });

        peelTimeline.to([percentRef.current, textRef.current], {
          opacity: 0,
          y: -50,
          duration: 0.6,
          ease: 'power3.in',
        });

        peelTimeline.to(
          panel3Ref.current,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 0.8,
            ease: 'power4.inOut',
          },
          '-=0.3'
        );

        peelTimeline.to(
          panel2Ref.current,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 0.8,
            ease: 'power4.inOut',
          },
          '-=0.6'
        );

        peelTimeline.to(
          panel1Ref.current,
          {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 0.8,
            ease: 'power4.inOut',
          },
          '-=0.6'
        );
      }
    });

    timeline.to(progressObj, {
      value: 100,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => {
        const rounded = Math.floor(progressObj.value);
        setDisplayPercent(rounded);
        setLoadProgress(rounded);
        if (percentRef.current) {
          percentRef.current.innerText = `LOAD.SYS // ${rounded.toString().padStart(3, '0')}%`;
        }
      },
    });

    return () => {
      clearInterval(scrambleInterval);
      timeline.kill();
    };
  }, [setLoaded, setLoadProgress]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center font-mono pointer-events-auto"
    >
      {/* Panel 1 (Backmost Overlay) */}
      <div
        ref={panel1Ref}
        className="absolute inset-0 bg-accent-dark/30"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      />

      {/* Panel 2 (Middle Overlay) */}
      <div
        ref={panel2Ref}
        className="absolute inset-0 bg-zinc-900"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      />

      {/* Panel 3 (Frontmost Main Overlay) */}
      <div
        ref={panel3Ref}
        className="absolute inset-0 bg-background flex flex-col items-center justify-center"
        style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      >
        <div className="relative flex flex-col items-center gap-6">
          {/* Monogram */}
          <div
            ref={textRef}
            className="text-7xl md:text-9xl font-black font-display tracking-tighter text-foreground"
          >
            {PERSONAL.initials}
          </div>

          {/* Loading status bar */}
          <div className="w-48 h-1 bg-border-custom rounded-full overflow-hidden relative">
            <div
              className="absolute left-0 top-0 bottom-0 bg-accent transition-all duration-75"
              style={{ width: `${displayPercent}%` }}
            />
          </div>

          {/* Loading percentage text */}
          <div
            ref={percentRef}
            className="text-xs text-textMuted font-mono tracking-widest uppercase mt-2"
          >
            LOAD.SYS // 000%
          </div>
        </div>
      </div>
    </div>
  );
}
