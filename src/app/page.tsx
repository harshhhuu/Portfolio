'use client';

import dynamic from 'next/dynamic';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useGSAPScrollTrigger } from '@/hooks/useGSAPScrollTrigger';
import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import { HorizonHero } from '@/components/ui/horizon-hero-section';
import PunchlineSection from '@/components/PunchlineSection';
import WorkSection from '@/components/WorkSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import { useScrollStore } from '@/store/useScrollStore';

// Dynamically import the 3D scene to bypass SSR window issues
const Scene = dynamic(() => import('@/three/Scene'), { ssr: false });

export default function Home() {
  // ─── Initialize Tracking Hooks ───
  useMousePosition();
  useGSAPScrollTrigger();

  const isLoaded = useScrollStore((s) => s.isLoaded);

  return (
    <>
      {/* Cinematic intro loading overlay */}
      <Preloader />

      {/* Customized magnetic ring cursor */}
      <CustomCursor />

      {/* Header navbar links */}
      <Navbar />

      {/* Background 3D Scene Layer (R3F) */}
      <Scene />

      {/* Main Scrollable DOM Sections */}
      <main
        className="w-full flex flex-col relative transition-opacity duration-[1500ms] ease-out-quint"
        style={{
          opacity: isLoaded ? 1 : 0,
          pointerEvents: isLoaded ? 'auto' : 'none',
        }}
      >
        <HorizonHero />
        <PunchlineSection />
        <WorkSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
