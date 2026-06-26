'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { useScrollStore } from '@/store/useScrollStore';
import { PERSONAL } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  locations: number[];
  targetCameraX: number;
  targetCameraY: number;
  targetCameraZ: number;
}

export const HorizonHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hudLabelRef = useRef<HTMLDivElement>(null);
  const sectionLabelRef = useRef<HTMLDivElement>(null);

  const isLoaded = useScrollStore((s) => s.isLoaded);
  const setCursorVariant = useScrollStore((s) => s.setCursorVariant);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 300 });
  const smoothVelocity = useRef(0);
  const customTime = useRef(0);
  const prevTime = useRef(Date.now());
  const prevSection = useRef(0);
  
  const [scrollProgress, setScrollProgressState] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;

  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
    locations: [],
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 300,
  });

  // Initialize Three.js
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const refs = threeRefs.current;
    
    // Scene setup
    refs.scene = new THREE.Scene();
    refs.scene.fog = new THREE.FogExp2(0x0E0E12, 0.0003);

    // Camera
    refs.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    refs.camera.position.set(0, 30, 300);

    // Renderer
    refs.renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    refs.renderer.setSize(window.innerWidth, window.innerHeight);
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    refs.renderer.toneMappingExposure = 0.6;

    // Post-processing
    refs.composer = new EffectComposer(refs.renderer);
    const renderPass = new RenderPass(refs.scene, refs.camera);
    refs.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // bloom strength (perfect movie-like glow)
      0.45, // radius
      0.8 // threshold (blooms only HDR cores & particles)
    );
    refs.composer.addPass(bloomPass);

    createStarField();
    createNebula();
    createMountains();
    createComet();
    getLocation();

    // Start animation
    animate();
    
    // Mark as ready
    setIsReady(true);

    function createStarField() {
      const starCount = 2000;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 250 + Math.random() * 950;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Color variation (warm cream, peach, sand)
          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.6) {
            color.setHSL(0.08, 0.12, 0.88 + Math.random() * 0.1); // Warm cream
          } else if (colorChoice < 0.85) {
            color.setHSL(0.07, 0.45, 0.78); // Warm peach
          } else {
            color.setHSL(0.55, 0.2, 0.8); // Muted sky
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2.5 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Slow rotation based on depth
              float angle = time * 0.02 * (1.0 - depth * 0.25);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (350.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const starsPoints = new THREE.Points(geometry, material);
        refs.scene!.add(starsPoints);
        refs.stars.push(starsPoints);
      }
    }

    function createNebula() {
      const geometry = new THREE.PlaneGeometry(6000, 3000, 80, 80);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xD4A574) }, // warm clay
          color2: { value: new THREE.Color(0xA8C5DA) }, // pastel sky
          opacity: { value: 0.15 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.008 + time) * cos(pos.y * 0.008 + time) * 35.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 8.0 + time * 0.2) * cos(vUv.y * 8.0 + time * 0.2);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.008;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebulaMesh = new THREE.Mesh(geometry, material);
      nebulaMesh.position.z = -1100;
      refs.scene!.add(nebulaMesh);
      refs.nebula = nebulaMesh;
    }

    function createMountains() {
      // Mountains colors
      const layers = [
        { distance: -80, height: 50, color: 0x0E0D10, opacity: 1.0 },
        { distance: -160, height: 75, color: 0x16131A, opacity: 0.9 },
        { distance: -240, height: 100, color: 0x1E1A20, opacity: 0.7 },
        { distance: -320, height: 130, color: 0x2A2430, opacity: 0.4 }
      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 40;
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1200;
          // Mathematical noise function for mountain ridges
          const y = Math.sin(i * 0.15) * layer.height + 
                   Math.sin(i * 0.07) * layer.height * 0.6 +
                   Math.cos(i * 0.3) * layer.height * 0.25 - 120;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(6000, -400));
        points.push(new THREE.Vector2(-6000, -400));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountainMesh = new THREE.Mesh(geometry, material);
        mountainMesh.position.z = layer.distance;
        mountainMesh.userData = { baseZ: layer.distance, index };
        refs.scene!.add(mountainMesh);
        refs.mountains.push(mountainMesh);
      });
    }



    function getLocation() {
      const locations: number[] = [];
      refs.mountains.forEach((mountain, i) => {
        locations[i] = mountain.position.z;
      });
      refs.locations = locations;
    }

    // Handle resize
    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        if (Array.isArray(starField.material)) {
          starField.material.forEach(m => m.dispose());
        } else {
          starField.material.dispose();
        }
      });

      refs.mountains.forEach(mountain => {
        mountain.geometry.dispose();
        if (Array.isArray(mountain.material)) {
          mountain.material.forEach(m => m.dispose());
        } else {
          mountain.material.dispose();
        }
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        if (Array.isArray(refs.nebula.material)) {
          refs.nebula.material.forEach(m => m.dispose());
        } else {
          refs.nebula.material.dispose();
        }
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, [isLoaded]);

  // Comet parameters
  const cometMeshRef = useRef<THREE.Group | null>(null);
  const cometLightRef = useRef<THREE.PointLight | null>(null);
  const cometParticlesRef = useRef<THREE.Points | null>(null);
  const smoothScrollProgress = useRef<number>(0);
  const particleCount = 800; // Increased density for smooth structured tail

  // Precomputed curve points & tangents to optimize rendering loop (avoiding spline calculations per frame)
  const cometCurveData = React.useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(650, 240, -400),   // Shifted further right (start, outside view)
      new THREE.Vector3(450, 175, -280),   // Shifted further right (Section 0 top-right)
      new THREE.Vector3(220, 60, -140),    // Shifted further right (Curved transition)
      new THREE.Vector3(0, -35, -40),      // Section 1 swoop low near mountains
      new THREE.Vector3(-150, -80, -350),  // Curved transition
      new THREE.Vector3(-350, -120, -750), // Section 2 far bottom-left
      new THREE.Vector3(-450, -140, -950)  // Far bottom-left (end, outside view)
    ]);

    const sampleCount = 1000;
    const points: THREE.Vector3[] = [];
    const tangents: THREE.Vector3[] = [];
    for (let i = 0; i <= sampleCount; i++) {
      const u = i / sampleCount;
      points.push(curve.getPointAt(u));
      tangents.push(curve.getTangentAt(u));
    }

    return { curve, points, tangents, sampleCount };
  }, []);

  // Pre-allocated reusable vectors to prevent garbage collection pressure and layout stutters in render loop
  const mathRefs = useRef({
    pos: new THREE.Vector3(),
    tangent: new THREE.Vector3(),
    up: new THREE.Vector3(0, 1, 0),
    normal: new THREE.Vector3(),
    binormal: new THREE.Vector3(),
    waveOffset: new THREE.Vector3(),
    offset1: new THREE.Vector3(),
    offset2: new THREE.Vector3(),
    splitDir: new THREE.Vector3(),
    headPos: new THREE.Vector3(),
    headTangent: new THREE.Vector3(),
    headNormal: new THREE.Vector3(),
    headBinormal: new THREE.Vector3()
  });

  const createComet = () => {
    const refs = threeRefs.current;
    if (!refs.scene) return;

    // Group to hold double core
    const cometGroup = new THREE.Group();

    // 1. Emissive deep outer core (warm peach glow envelope)
    const deepOuterGeom = new THREE.SphereGeometry(7.0, 16, 16);
    const deepOuterMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(2.5, 1.5, 0.8), // Warm peach outer glow (HDR boost)
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const deepOuterCore = new THREE.Mesh(deepOuterGeom, deepOuterMat);
    cometGroup.add(deepOuterCore);

    // 2. Emissive outer core (warm golden glow)
    const outerGeom = new THREE.SphereGeometry(4.5, 16, 16);
    const outerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(3.0, 2.2, 1.2), // Warm golden glow (HDR boost)
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const outerCore = new THREE.Mesh(outerGeom, outerMat);
    cometGroup.add(outerCore);

    // 3. Super-hot inner core (bright white)
    const innerGeom = new THREE.SphereGeometry(2.5, 12, 12);
    const innerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(4.0, 4.0, 4.0), // White (HDR boost)
    });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    cometGroup.add(innerCore);

    refs.scene.add(cometGroup);
    cometMeshRef.current = cometGroup;

    // Comet light casting warm golden halos
    const light = new THREE.PointLight(0xD4A574, 120, 450, 1.2);
    refs.scene.add(light);
    cometLightRef.current = light;

    // Double trail particle geometry
    const pGeom = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 2 * 3);
    const pColors = new Float32Array(particleCount * 2 * 3);
    const pSizes = new Float32Array(particleCount * 2);

    pGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeom.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    pGeom.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    // Custom shader material for soft glowing flares
    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vDepth;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (380.0 / -mvPosition.z);
          // Limit maximum point size to prevent giant close-up circles
          gl_PointSize = min(gl_PointSize, 32.0);
          vDepth = -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDepth;
        
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 2.0) * 1.5;
          
          // Smoothly fade out particles that are too close to the camera (between 25 and 100 units)
          float alphaFactor = smoothstep(25.0, 100.0, vDepth);
          
          // Boost color brightness to exceed bloom threshold (HDR effect)
          gl_FragColor = vec4(vColor * 2.0, glow * alphaFactor);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeom, pMat);
    refs.scene.add(particles);
    cometParticlesRef.current = particles;
  };

  const animate = () => {
    const refs = threeRefs.current;
    refs.animationId = requestAnimationFrame(animate);
    
    const now = Date.now();
    const delta = (now - prevTime.current) * 0.001;
    prevTime.current = now;

    const storeVelocity = useScrollStore.getState().scrollVelocity;
    smoothVelocity.current += (storeVelocity - smoothVelocity.current) * 0.1;

    // Time accelerates significantly based on scroll velocity for WebGL reaction
    customTime.current += delta * (1.0 + Math.abs(smoothVelocity.current) * 0.15);
    const time = customTime.current;

    // Update stars rotation
    refs.stars.forEach((starField) => {
      if (starField.material && 'uniforms' in starField.material) {
        (starField.material as THREE.ShaderMaterial).uniforms.time.value = time;
      }
    });

    // Update nebula waving
    if (refs.nebula && refs.nebula.material && 'uniforms' in refs.nebula.material) {
      (refs.nebula.material as THREE.ShaderMaterial).uniforms.time.value = time * 0.4;
    }

    // Camera Easing & Mouse Parallax
    if (refs.camera && refs.targetCameraZ !== undefined) {
      const smoothingFactor = 0.04;
      
      const mouseX = useScrollStore.getState().mouseX;
      const mouseY = useScrollStore.getState().mouseY;
      
      // Calculate smooth translation
      smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
      smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
      smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;
      
      // Subtle float + Mouse Parallax
      const floatX = Math.sin(time * 0.08) * 1.5 + mouseX * 15;
      const floatY = Math.cos(time * 0.12) * 1.0 + mouseY * 10;
      
      refs.camera.position.x = smoothCameraPos.current.x + floatX;
      refs.camera.position.y = smoothCameraPos.current.y + floatY;
      refs.camera.position.z = smoothCameraPos.current.z;
      
      // Camera faces the horizon center
      refs.camera.lookAt(0, 15, -600);
    }

    // Parallax mountains
    refs.mountains.forEach((mountain, i) => {
      const idx = mountain.userData.index;
      const factor = 1.0 + idx * 0.4;
      mountain.position.x = Math.sin(time * 0.08) * 1.2 * factor;
      mountain.position.y = Math.cos(time * 0.12) * 0.6 * factor;
    });

    // Update Comet Flight along the scroll progress path
    if (cometMeshRef.current && cometLightRef.current && cometParticlesRef.current) {
      const currentScroll = useScrollStore.getState().scrollProgress;
      
      // Smoothly ease the scroll progress for inertia (makes it glide beautifully)
      smoothScrollProgress.current += (currentScroll - smoothScrollProgress.current) * 0.05;

      const u_start = 0.15;
      const u_end = 0.85;
      const u_head = u_start + smoothScrollProgress.current * (u_end - u_start);
      
      const velocityStretch = Math.min(0.12, Math.abs(smoothVelocity.current) * 0.005);
      const tailLength = 0.18 + velocityStretch; // 18% of curve length + dynamic stretch

      // Helper function to fetch precomputed position & tangent along the curve
      const getPrecomputedData = (uVal: number, outPos: THREE.Vector3, outTangent: THREE.Vector3) => {
        const uClamped = Math.max(0, Math.min(1, uVal));
        const indexFloat = uClamped * cometCurveData.sampleCount;
        const index0 = Math.floor(indexFloat);
        const index1 = Math.min(cometCurveData.sampleCount, index0 + 1);
        const tVal = indexFloat - index0;
        
        outPos.lerpVectors(cometCurveData.points[index0], cometCurveData.points[index1], tVal);
        outTangent.lerpVectors(cometCurveData.tangents[index0], cometCurveData.tangents[index1], tVal).normalize();
      };

      const m = mathRefs.current;

      // Get head position and tangent from precomputed data (O(1) lookup!)
      getPrecomputedData(u_head, m.headPos, m.headTangent);

      // Compute coordinate frame perpendicular to tangent at the head to apply wave flutter
      m.up.set(0, 1, 0);
      if (Math.abs(m.headTangent.y) > 0.99) {
        m.up.set(1, 0, 0);
      }
      m.headNormal.crossVectors(m.headTangent, m.up);
      if (m.headNormal.lengthSq() < 0.0001) {
        m.headNormal.set(1, 0, 0);
      } else {
        m.headNormal.normalize();
      }
      m.headBinormal.crossVectors(m.headTangent, m.headNormal).normalize();

      // Head wave flutter
      const headWaveX = Math.cos(time * 6.0) * 1.5;
      const headWaveY = Math.sin(time * 5.0) * 2.0;
      
      m.headPos.addScaledVector(m.headNormal, headWaveX);
      m.headPos.addScaledVector(m.headBinormal, headWaveY);

      // Calculate distance to camera to prevent close-up camera clipping / screen-blocking
      let headScale = 1.0;
      if (refs.camera) {
        const distToCamera = m.headPos.distanceTo(refs.camera.position);
        if (distToCamera < 130) {
          headScale = Math.max(0.0, (distToCamera - 25) / 105);
        }
      }
      cometMeshRef.current.scale.setScalar(headScale);
      cometMeshRef.current.position.copy(m.headPos);
      cometLightRef.current.position.copy(m.headPos);
      
      // Pulsating light intensity matching the bloom effect and scaled down near the camera
      cometLightRef.current.intensity = (120 + Math.sin(time * 6.0) * 40) * (1.0 - smoothScrollProgress.current * 0.4) * headScale;

      // Populate positions, colors, and sizes for the double-branched tail
      const particlesGeo = cometParticlesRef.current.geometry;
      const positions = particlesGeo.attributes.position.array as Float32Array;
      const colors = particlesGeo.attributes.color.array as Float32Array;
      const sizes = particlesGeo.attributes.size.array as Float32Array;

      // Split branch direction (curves away on normal/binormal diagonal plane)
      m.splitDir.copy(m.headNormal).multiplyScalar(0.4).addScaledVector(m.headBinormal, -0.9).normalize();
      const t_split = 0.08; // Point along the tail where the split starts to diverge

      for (let i = 0; i < particleCount; i++) {
        const t = i / (particleCount - 1);
        
        // Sample parameter u goes from u_head (at t = 0) back to u_head - tailLength (at t = 1)
        const u = u_head - t * tailLength;
        
        // Get precomputed position and tangent along the curve
        getPrecomputedData(u, m.pos, m.tangent);
        
        // Compute local frame perpendicular to the curve tangent at this point
        m.up.set(0, 1, 0);
        if (Math.abs(m.tangent.y) > 0.99) {
          m.up.set(1, 0, 0);
        }
        m.normal.crossVectors(m.tangent, m.up);
        if (m.normal.lengthSq() < 0.0001) {
          m.normal.set(1, 0, 0);
        } else {
          m.normal.normalize();
        }
        m.binormal.crossVectors(m.tangent, m.normal).normalize();

        // Wave flutter propagating down the tail
        const waveX = Math.cos(time * 6.0 - t * 8.0) * 1.5 * (1.0 - t);
        const waveY = Math.sin(time * 5.0 - t * 10.0) * 2.0 * (1.0 - t);
        
        m.waveOffset.copy(m.normal).multiplyScalar(waveX).addScaledVector(m.binormal, waveY);

        // Max radius of the tail tube (expands on fast scroll)
        const maxRadius = 10.0 + velocityStretch * 30.0;

        // ─── Branch 1: Main Cyan/Blue Tail (Structured twisting filaments) ───
        const filamentId1 = i % 5;
        const angle1 = (filamentId1 / 5) * Math.PI * 2 + t * 4.0 + time * 1.5;
        const r1 = maxRadius * Math.pow(1.0 - t, 0.6) * (0.85 + 0.15 * Math.sin(t * 8.0 - time * 6.0));
        
        m.offset1.copy(m.normal).multiplyScalar(Math.cos(angle1) * r1).addScaledVector(m.binormal, Math.sin(angle1) * r1);
        // Random micro-dispersion for organic feel
        m.offset1.x += (Math.random() - 0.5) * 2.0 * (1.0 - t);
        m.offset1.y += (Math.random() - 0.5) * 2.0 * (1.0 - t);
        m.offset1.z += (Math.random() - 0.5) * 2.0 * (1.0 - t);

        const idx1 = i * 2;
        positions[idx1 * 3] = m.pos.x + m.offset1.x + m.waveOffset.x;
        positions[idx1 * 3 + 1] = m.pos.y + m.offset1.y + m.waveOffset.y;
        positions[idx1 * 3 + 2] = m.pos.z + m.offset1.z + m.waveOffset.z;

        // Color transition: warm cream -> golden sand -> warm clay
        const c1 = new THREE.Color();
        if (t < 0.15) {
          const mixFactor = t / 0.15;
          c1.lerpColors(new THREE.Color(0xFFF8EE), new THREE.Color(0xE8C9A0), mixFactor);
        } else {
          const mixFactor = (t - 0.15) / 0.85;
          c1.lerpColors(new THREE.Color(0xE8C9A0), new THREE.Color(0xB8896A), mixFactor);
        }
        colors[idx1 * 3] = c1.r;
        colors[idx1 * 3 + 1] = c1.g;
        colors[idx1 * 3 + 2] = c1.b;

        // Enhanced sizes for a bold, non-sparkly look, swelling on scroll
        sizes[idx1] = 26.0 * Math.pow(1.0 - t, 0.5) * (0.8 + 0.2 * Math.random()) * (1.0 + velocityStretch * 3.0);

        // ─── Branch 2: Hot Pink/Magenta Split Tail (Curves away) ───
        const separation = t > t_split ? (55.0 + velocityStretch * 120.0) * Math.pow(t - t_split, 1.3) : 0;
        const filamentId2 = (i + 2) % 4;
        const angle2 = (filamentId2 / 4) * Math.PI * 2 - t * 3.0 - time * 1.2;
        const r2 = maxRadius * 0.75 * Math.pow(1.0 - t, 0.7) * (0.8 + 0.2 * Math.sin(t * 10.0 - time * 5.0));

        m.offset2.copy(m.splitDir).multiplyScalar(separation);
        m.offset2.addScaledVector(m.normal, Math.cos(angle2) * r2).addScaledVector(m.binormal, Math.sin(angle2) * r2);
        // Random micro-dispersion
        m.offset2.x += (Math.random() - 0.5) * 1.5 * (1.0 - t);
        m.offset2.y += (Math.random() - 0.5) * 1.5 * (1.0 - t);
        m.offset2.z += (Math.random() - 0.5) * 1.5 * (1.0 - t);

        const idx2 = i * 2 + 1;
        positions[idx2 * 3] = m.pos.x + m.offset2.x + m.waveOffset.x;
        positions[idx2 * 3 + 1] = m.pos.y + m.offset2.y + m.waveOffset.y;
        positions[idx2 * 3 + 2] = m.pos.z + m.offset2.z + m.waveOffset.z;

        // Color transition: warm cream -> dusty rose -> muted mauve
        const c2 = new THREE.Color();
        if (t < 0.15) {
          const mixFactor = t / 0.15;
          c2.lerpColors(new THREE.Color(0xFFF8EE), new THREE.Color(0xC9A0A0), mixFactor);
        } else {
          const mixFactor = (t - 0.15) / 0.85;
          c2.lerpColors(new THREE.Color(0xC9A0A0), new THREE.Color(0x8A7080), mixFactor);
        }
        colors[idx2 * 3] = c2.r;
        colors[idx2 * 3 + 1] = c2.g;
        colors[idx2 * 3 + 2] = c2.b;

        sizes[idx2] = 20.0 * Math.pow(1.0 - t, 0.6) * (0.8 + 0.2 * Math.random()) * (1.0 + velocityStretch * 3.0);
      }

      particlesGeo.attributes.position.needsUpdate = true;
      particlesGeo.attributes.color.needsUpdate = true;
      particlesGeo.attributes.size.needsUpdate = true;
    }

    if (refs.composer) {
      refs.composer.render();
    }
  };

  // Scroll handler linked to Zustand state
  useEffect(() => {
    if (!isReady) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight || 1;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgressState(progress);
      
      // Calculate sections
      const totalProgress = progress * totalSections;
      const currentSec = Math.min(Math.floor(totalProgress), totalSections - 1);
      
      if (currentSec !== prevSection.current) {
        prevSection.current = currentSec;
        if (hudLabelRef.current && sectionLabelRef.current) {
          const labels = ['SYS.HORIZON', 'SYS.COSMOS', 'SYS.INFINITY'];
          const scrambleText = (el: HTMLElement, targetText: string) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_/.';
            let iteration = 0;
            clearInterval((el as any).scrambleInterval);
            (el as any).scrambleInterval = setInterval(() => {
              el.innerText = targetText.split('').map((char, index) => {
                if (index < iteration || char === ' ') return char;
                return chars[Math.floor(Math.random() * chars.length)];
              }).join('');
              if (iteration >= targetText.length) clearInterval((el as any).scrambleInterval);
              iteration += 1 / 3;
            }, 30);
          };
          scrambleText(hudLabelRef.current, labels[currentSec] || 'SYS.HORIZON');
          scrambleText(sectionLabelRef.current, `SECTION // ${String(currentSec).padStart(2, '0')} / ${String(totalSections).padStart(2, '0')}`);
        }
      }
      
      setCurrentSection(currentSec);

      const refs = threeRefs.current;
      const sectionProgress = totalProgress % 1;

      // Horizon camera coordinate transitions
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },   // Horizon (Section 0)
        { x: 0, y: 45, z: -50 },   // Cosmos (Section 1)
        { x: 0, y: 60, z: -700 }   // Infinity (Section 2)
      ];

      const currentPos = cameraPositions[currentSec] || cameraPositions[0];
      const nextPos = cameraPositions[currentSec + 1] || currentPos;

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      // Parallax mountains depth transitions
      refs.mountains.forEach((mountain, i) => {
        const speed = 1.0 + i * 0.7;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.4;
        
        if (progress > 0.65) {
          // Fade away below the horizon line on deeper sections
          mountain.position.z = 10000;
        } else {
          mountain.position.z = targetZ;
        }
      });

      if (refs.nebula) {
        refs.nebula.position.z = -1100 + scrollY * 0.15;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReady, totalSections]);

  // Entrance timelines
  useEffect(() => {
    if (!isReady) return;

    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
      visibility: 'visible',
      opacity: 0
    });

    const tl = gsap.timeline({ delay: 0.6 });

    // Side menu fade in
    tl.to(menuRef.current, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power3.out'
    });

    // Title reveal
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: 'power4.out'
    }, '-=0.8');

    // Subtitle reveal
    tl.to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=1.0');

    // Indicator reveal
    tl.to(scrollProgressRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.6');

    return () => {
      tl.kill();
    };
  }, [isReady]);

  return (
    <div
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen bg-background overflow-hidden select-none"
    >
      {/* ThreeJS canvas absolute background layer */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
      />

      {/* Side menu vertical HUD */}
      <div
        ref={menuRef}
        className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20"
        style={{ visibility: 'hidden' }}
      >
        <div className="flex flex-col gap-1.5 group cursor-pointer"
             onMouseEnter={() => setCursorVariant('hover')}
             onMouseLeave={() => setCursorVariant('default')}>
          <span className="w-4 h-[1px] bg-white group-hover:bg-accent group-hover:w-5 transition-all duration-300"></span>
          <span className="w-3 h-[1px] bg-white group-hover:bg-accent group-hover:w-5 transition-all duration-300"></span>
          <span className="w-4 h-[1px] bg-white group-hover:bg-accent group-hover:w-5 transition-all duration-300"></span>
        </div>
        <div
          ref={hudLabelRef}
          className="text-[9px] font-mono tracking-widest text-textMuted uppercase select-none mt-4 font-bold min-h-[100px]"
          style={{ writingMode: 'vertical-rl' }}
        >
          SYS.HORIZON
        </div>
      </div>

      {/* Hero content overlay */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-center min-h-screen pointer-events-none px-6 md:px-12 lg:px-24">
        <div className="flex flex-col">
          <h1
            ref={titleRef}
            className="text-6xl sm:text-8xl md:text-9xl font-black font-display tracking-tighter uppercase leading-[0.85] text-white"
            style={{ visibility: 'hidden' }}
          >
            {PERSONAL.name.split(' ')[0]}<br />
            <span className="text-accent font-light italic">{PERSONAL.name.split(' ')[1]}</span>
          </h1>
          
          <div
            ref={subtitleRef}
            className="mt-8 text-xs sm:text-sm md:text-base font-mono uppercase tracking-widest text-textMuted max-w-lg flex flex-col gap-2"
            style={{ visibility: 'hidden' }}
          >
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {PERSONAL.title} · {PERSONAL.location}
            </p>
            <p className="font-sans text-lg text-white font-medium normal-case tracking-normal mt-2 leading-relaxed">
              {PERSONAL.tagline}. Beyond boundaries, shape the digital tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Scroll progress HUD */}
      <div
        ref={scrollProgressRef}
        className="fixed bottom-8 left-12 right-12 z-20 flex items-center justify-between pointer-events-none font-mono text-[9px] text-textMuted"
        style={{ visibility: 'hidden' }}
      >
        <span className="tracking-widest uppercase">SCROLL TO EXPLORE</span>
        <div className="flex-1 mx-8 h-[1px] bg-white/10 relative overflow-hidden hidden sm:block">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-accent transition-all duration-75" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div ref={sectionLabelRef} className="tracking-widest">
          SECTION // 00 / 03
        </div>
      </div>
    </div>
  );
};
