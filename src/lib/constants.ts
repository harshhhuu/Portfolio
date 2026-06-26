// ─── Design Tokens ───────────────────────────────────────────────
export const COLORS = {
  bg: '#0E0E12',
  text: '#EDE8E3',
  textMuted: '#9A938B',
  accent: '#D4A574',      // Warm clay/caramel
  accentLight: '#E8C9A0',
  accentDark: '#B8896A',
  cardBg: '#141418',
  border: '#252228',
} as const;

// ─── Section IDs ─────────────────────────────────────────────────
export const SECTIONS = ['hero', 'work', 'about', 'contact'] as const;
export type SectionId = (typeof SECTIONS)[number];

// ─── 3D Object Config per Section ────────────────────────────────
export interface ObjectConfig {
  position: [number, number, number];
  scale: number;
  rotationSpeed: number;
  material: {
    color: string;
    roughness: number;
    metalness: number;
    emissiveIntensity: number;
    wireframe: boolean;
    transmission: number;
  };
}

export const OBJECT_CONFIGS: Record<SectionId, ObjectConfig> = {
  hero: {
    position: [0, 0, 0],
    scale: 1.0,
    rotationSpeed: 0.3,
    material: {
      color: '#C0C0C0',
      roughness: 0.1,
      metalness: 1.0,
      emissiveIntensity: 0.0,
      wireframe: false,
      transmission: 0,
    },
  },
  work: {
    position: [2.5, 0, -1],
    scale: 0.6,
    rotationSpeed: 0.5,
    material: {
      color: '#4A4A5A',
      roughness: 0.3,
      metalness: 0.9,
      emissiveIntensity: 0.05,
      wireframe: false,
      transmission: 0,
    },
  },
  about: {
    position: [0, 0.5, 0],
    scale: 0.8,
    rotationSpeed: 0.4,
    material: {
      color: '#D4A574',
      roughness: 0.05,
      metalness: 0.2,
      emissiveIntensity: 0.1,
      wireframe: true,
      transmission: 0.6,
    },
  },
  contact: {
    position: [0, -0.5, 0],
    scale: 0.7,
    rotationSpeed: 0.1,
    material: {
      color: '#D4A574',
      roughness: 0.2,
      metalness: 0.5,
      emissiveIntensity: 0.8,
      wireframe: false,
      transmission: 0,
    },
  },
};

// ─── Navigation ──────────────────────────────────────────────────
export const NAV_ITEMS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

// ─── Social Links ────────────────────────────────────────────────
export const SOCIALS = {
  email: 'harsh.hmak@gmail.com',
  linkedin: 'https://www.linkedin.com/in/harsh-makwana-389137291',
  github: 'https://github.com/harshhhuu/',
} as const;

// ─── Personal Info ───────────────────────────────────────────────
export const PERSONAL = {
  name: 'Harsh Makwana',
  initials: 'HM',
  title: 'Full-Stack Developer',
  location: 'Mumbai, India',
  tagline: 'Building digital experiences that matter',
  bio: 'Software developer with proficiency in application architecture, backend logic, and frontend engineering. I like making products that are dependable and effective on the inside while feeling smooth to use on the outside.',
} as const;
