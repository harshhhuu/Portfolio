import { create } from 'zustand';
import type { SectionId } from '@/lib/constants';

interface ScrollState {
  // ─── Scroll Progress ───
  scrollProgress: number;           // 0–1 overall page scroll
  scrollVelocity: number;           // Scroll speed from Lenis
  activeSection: SectionId;         // Current visible section

  // ─── 3D Object Targets (set by GSAP, read by R3F) ───
  targetPosition: [number, number, number];
  targetScale: number;
  targetRotationSpeed: number;

  // ─── Material Targets ───
  targetColor: string;
  targetRoughness: number;
  targetMetalness: number;
  targetEmissiveIntensity: number;
  targetWireframe: boolean;
  targetTransmission: number;

  // ─── Mouse Position (normalized -1 to 1) ───
  mouseX: number;
  mouseY: number;

  // ─── Preloader State ───
  isLoaded: boolean;
  loadProgress: number;

  // ─── Cursor State ───
  cursorVariant: 'default' | 'hover' | 'project' | 'action' | 'hidden';
  cursorLabel: string;
  cursorColor: string;

  // ─── Setters (non-reactive, used by GSAP callbacks) ───
  setScrollProgress: (v: number) => void;
  setScrollVelocity: (v: number) => void;
  setActiveSection: (s: SectionId) => void;
  setTargetPosition: (p: [number, number, number]) => void;
  setTargetScale: (s: number) => void;
  setTargetRotationSpeed: (s: number) => void;
  setMaterialTargets: (m: {
    color?: string;
    roughness?: number;
    metalness?: number;
    emissiveIntensity?: number;
    wireframe?: boolean;
    transmission?: number;
  }) => void;
  setMouse: (x: number, y: number) => void;
  setLoaded: (v: boolean) => void;
  setLoadProgress: (v: number) => void;
  setCursorVariant: (v: 'default' | 'hover' | 'project' | 'action' | 'hidden') => void;
  setCursorLabel: (v: string) => void;
  setCursorColor: (c: string) => void;
  setCursor: (variant: 'default' | 'hover' | 'project' | 'action' | 'hidden', label?: string, color?: string) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  activeSection: 'hero',

  targetPosition: [0, 0, 0],
  targetScale: 1.0,
  targetRotationSpeed: 0.3,

  targetColor: '#C0C0C0',
  targetRoughness: 0.1,
  targetMetalness: 1.0,
  targetEmissiveIntensity: 0.0,
  targetWireframe: false,
  targetTransmission: 0,

  mouseX: 0,
  mouseY: 0,

  isLoaded: false,
  loadProgress: 0,

  cursorVariant: 'default',
  cursorLabel: '',
  cursorColor: '#cc0597',

  setScrollProgress: (v) => set({ scrollProgress: v }),
  setScrollVelocity: (v) => set({ scrollVelocity: v }),
  setActiveSection: (s) => set({ activeSection: s }),
  setTargetPosition: (p) => set({ targetPosition: p }),
  setTargetScale: (s) => set({ targetScale: s }),
  setTargetRotationSpeed: (s) => set({ targetRotationSpeed: s }),
  setMaterialTargets: (m) =>
    set((state) => ({
      targetColor: m.color ?? state.targetColor,
      targetRoughness: m.roughness ?? state.targetRoughness,
      targetMetalness: m.metalness ?? state.targetMetalness,
      targetEmissiveIntensity: m.emissiveIntensity ?? state.targetEmissiveIntensity,
      targetWireframe: m.wireframe ?? state.targetWireframe,
      targetTransmission: m.transmission ?? state.targetTransmission,
    })),
  setMouse: (x, y) => set({ mouseX: x, mouseY: y }),
  setLoaded: (v) => set({ isLoaded: v }),
  setLoadProgress: (v) => set({ loadProgress: v }),
  setCursorVariant: (v) => set({ cursorVariant: v }),
  setCursorLabel: (v) => set({ cursorLabel: v }),
  setCursorColor: (c) => set({ cursorColor: c }),
  setCursor: (variant, label = '', color = '#cc0597') =>
    set({ cursorVariant: variant, cursorLabel: label, cursorColor: color }),
}));
