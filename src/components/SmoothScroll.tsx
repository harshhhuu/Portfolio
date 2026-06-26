'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/store/useScrollStore';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const isLoaded = useScrollStore((s) => s.isLoaded);

  useEffect(() => {
    // Wait until preloader is done and page is loaded before activating smooth scroll
    if (!isLoaded) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.4,                      // Slightly heavier duration for premium feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential ease
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger and sync velocity
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      useScrollStore.getState().setScrollVelocity(e.velocity);
    });

    // Add Lenis requestAnimationFrame to GSAP ticker
    const updatePhysics = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updatePhysics);
    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove(updatePhysics);
      lenisRef.current = null;
    };
  }, [isLoaded]);

  return <>{children}</>;
}
