'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';

export default function RoamingObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const fragmentRefs = useRef<THREE.Mesh[]>([]);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  // Current interpolated values (not React state — pure mutation)
  const current = useRef({
    position: new THREE.Vector3(0, 0, 0),
    scale: 1.0,
    rotationX: 0,
    rotationY: 0,
    color: new THREE.Color('#C0C0C0'),
    roughness: 0.1,
    metalness: 1.0,
    emissiveIntensity: 0.0,
    emissiveColor: new THREE.Color('#D4A574'),
    transmission: 0,
  });

  const targetColor = useRef(new THREE.Color('#C0C0C0'));

  // Create fragment positions for the About section
  const fragmentPositions = useMemo(
    () => [
      [1.2, 0.8, -0.5],
      [-1.0, 1.0, 0.3],
      [0.8, -0.7, 0.4],
      [-1.3, -0.5, -0.3],
    ] as [number, number, number][],
    []
  );

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const store = useScrollStore.getState();
    const { targetPosition, targetScale, targetRotationSpeed, mouseX, mouseY, activeSection, isLoaded } = store;

    if (!isLoaded) return;

    const lerpFactor = 1 - Math.pow(0.001, delta);
    const c = current.current;

    // ─── Position lerp with mouse parallax ───
    const parallaxX = mouseX * 0.3;
    const parallaxY = mouseY * 0.2;
    c.position.x = THREE.MathUtils.lerp(c.position.x, targetPosition[0] + parallaxX, lerpFactor);
    c.position.y = THREE.MathUtils.lerp(c.position.y, targetPosition[1] + parallaxY, lerpFactor);
    c.position.z = THREE.MathUtils.lerp(c.position.z, targetPosition[2], lerpFactor);
    meshRef.current.position.copy(c.position);

    // ─── Scale lerp ───
    c.scale = THREE.MathUtils.lerp(c.scale, targetScale, lerpFactor);
    meshRef.current.scale.setScalar(c.scale);

    // ─── Rotation ───
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * targetRotationSpeed * 0.5 + mouseY * 0.1;
    meshRef.current.rotation.y = time * targetRotationSpeed + mouseX * 0.1;

    // ─── Material lerp ───
    targetColor.current.set(store.targetColor);
    c.color.lerp(targetColor.current, lerpFactor * 0.5);
    materialRef.current.color.copy(c.color);

    c.roughness = THREE.MathUtils.lerp(c.roughness, store.targetRoughness, lerpFactor * 0.5);
    materialRef.current.roughness = c.roughness;

    c.metalness = THREE.MathUtils.lerp(c.metalness, store.targetMetalness, lerpFactor * 0.5);
    materialRef.current.metalness = c.metalness;

    c.emissiveIntensity = THREE.MathUtils.lerp(c.emissiveIntensity, store.targetEmissiveIntensity, lerpFactor * 0.5);
    materialRef.current.emissive.copy(c.emissiveColor);
    materialRef.current.emissiveIntensity = c.emissiveIntensity;

    c.transmission = THREE.MathUtils.lerp(c.transmission, store.targetTransmission, lerpFactor * 0.3);
    materialRef.current.transmission = c.transmission;

    materialRef.current.wireframe = store.targetWireframe;

    // ─── Fragments (orbit around main in About section) ───
    fragmentRefs.current.forEach((frag, i) => {
      if (!frag) return;
      const showFragments = activeSection === 'about';
      const fragScale = showFragments ? 0.15 : 0.0;
      frag.scale.setScalar(THREE.MathUtils.lerp(frag.scale.x, fragScale, lerpFactor));

      if (showFragments) {
        const angle = time * 0.5 + (i * Math.PI * 2) / 4;
        const radius = 1.5;
        frag.position.x = c.position.x + Math.cos(angle) * radius * fragmentPositions[i][0];
        frag.position.y = c.position.y + Math.sin(angle * 0.7) * radius * 0.5 + fragmentPositions[i][1] * 0.3;
        frag.position.z = c.position.z + Math.sin(angle) * radius * 0.3;
        frag.rotation.x = time * (1 + i * 0.3);
        frag.rotation.y = time * (0.5 + i * 0.2);
      }
    });
  });

  return (
    <group>
      {/* Main icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          ref={materialRef}
          color="#C0C0C0"
          roughness={0.1}
          metalness={1.0}
          envMapIntensity={1.5}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Orbital fragments */}
      {fragmentPositions.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) fragmentRefs.current[i] = el;
          }}
          scale={0}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#D4A574"
            roughness={0.2}
            metalness={0.8}
            emissive="#D4A574"
            emissiveIntensity={0.3}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}
