'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import RoamingObject from './RoamingObject';
import Lighting from './Lighting';
import PostProcessing from './PostProcessing';
import { useScrollStore } from '@/store/useScrollStore';

export default function Scene() {
  const isLoaded = useScrollStore((s) => s.isLoaded);

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0"
      style={{ opacity: isLoaded ? 1 : 0 }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <Lighting />
          <RoamingObject />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}
