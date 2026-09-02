'use client';

import dynamic from 'next/dynamic';
import { useMousePosition } from '@/hooks/useMousePosition';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import WorksHero from '@/components/works/WorksHero';
import WorksGrid from '@/components/works/WorksGrid';
import Auralis from '@/components/ui/auralis';
import { useScrollStore } from '@/store/useScrollStore';
import { useEffect } from 'react';

export default function WorksPage() {
  useMousePosition();

  const isLoaded = useScrollStore((s) => s.isLoaded);
  const setLoaded = useScrollStore((s) => s.setLoaded);

  // Mark page as loaded immediately (no preloader on sub-pages)
  useEffect(() => {
    if (!isLoaded) {
      setLoaded(true);
    }
  }, [isLoaded, setLoaded]);

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="w-full h-screen flex relative overflow-hidden bg-background">
        {/* Auralis WebGL ambient background — golden glow */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
          <Auralis
            colors={['#D4A574', '#E8C9A0', '#B8896A']}
            speed={0.2}
            grain={0.25}
            height="100%"
          />
        </div>

        {/* Left Column — Sticky Hero */}
        <div className="hidden md:flex w-1/2 h-screen flex-shrink-0 relative z-10">
          <WorksHero />
        </div>

        {/* Right Column — Auto-scrolling project grid */}
        <div className="w-full md:w-1/2 h-screen relative z-10">
          <WorksGrid />
        </div>
      </main>
    </>
  );
}
