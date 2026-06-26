'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';

export default function Lighting() {
  const pointLightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const { activeSection, mouseX, mouseY } = useScrollStore.getState();

    // Move key light subtly with mouse
    if (pointLightRef.current) {
      pointLightRef.current.position.x = THREE.MathUtils.lerp(
        pointLightRef.current.position.x,
        2 + mouseX * 1.5,
        0.05
      );
      pointLightRef.current.position.y = THREE.MathUtils.lerp(
        pointLightRef.current.position.y,
        3 + mouseY * 1.0,
        0.05
      );

      // Section-based intensity
      const intensities: Record<string, number> = {
        hero: 80,
        work: 50,
        about: 60,
        contact: 40,
      };
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        intensities[activeSection] ?? 80,
        0.05
      );
    }

    // Accent spotlight
    if (spotLightRef.current) {
      const time = state.clock.getElapsedTime();
      spotLightRef.current.position.x = Math.sin(time * 0.3) * 3;
      spotLightRef.current.position.z = Math.cos(time * 0.3) * 3;

      const spotIntensities: Record<string, number> = {
        hero: 30,
        work: 20,
        about: 40,
        contact: 60,
      };
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        spotIntensities[activeSection] ?? 30,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight
        ref={pointLightRef}
        position={[2, 3, 4]}
        intensity={80}
        color="#ffffff"
        decay={2}
      />
      <spotLight
        ref={spotLightRef}
        position={[-3, 5, 2]}
        intensity={30}
        color="#D4A574"
        angle={0.5}
        penumbra={1}
        decay={2}
      />
      <pointLight position={[-4, -2, -3]} intensity={20} color="#A8C5DA" decay={2} />
    </>
  );
}
