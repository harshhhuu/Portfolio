export interface ProjectContentBlock {
  type: 'text' | 'image' | 'image-pair' | 'video';
  heading?: string;
  paragraph?: string;
  src?: string;         // For single image or video
  srcLeft?: string;     // For image-pair
  srcRight?: string;    // For image-pair
  alt?: string;
  altLeft?: string;
  altRight?: string;
}

export interface Project {
  id: string;
  slug: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  color: string;       // Accent color for the card
  image: string;       // 16:9 Cinematic background image (cover)
  link?: string;       // External link (optional)
  github?: string;     // GitHub link (optional)

  // Detail page fields
  client: string;
  year: string;
  services: string[];
  intro: string;       // Short intro for the detail hero
  content: ProjectContentBlock[];
}

export const PROJECTS: Project[] = [
  {
    id: 'pos-saas',
    slug: 'pos-saas',
    index: '01',
    title: 'Cloud-Native Multi-Tenant POS SaaS',
    description:
      'Full-stack POS platform with role-based access for Super Admins, Branch Managers & Cashiers. Real-time analytics, Stripe/Razorpay payments, and centralized inventory across multiple stores.',
    tags: ['React', 'Redux', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Stripe'],
    color: '#A8C5DA',
    image: '/images/pos-saas.png',
    client: 'Personal Project',
    year: '2024',
    services: ['Full-Stack Development', 'UI/UX Design', 'Cloud Architecture'],
    intro:
      'A comprehensive point-of-sale platform built from the ground up to serve multi-tenant retail businesses. Designed for scale, security, and seamless real-time operations across distributed store networks.',
    content: [
      {
        type: 'text',
        heading: 'Rethinking Retail Infrastructure',
        paragraph:
          'Traditional POS systems are monolithic, expensive, and difficult to scale. This project reimagines the retail backbone as a cloud-native SaaS platform — multi-tenant by design, with role-based access control that spans from Super Admins overseeing the entire chain down to individual Cashiers processing transactions.',
      },
      {
        type: 'image',
        src: '/images/pos-saas.png',
        alt: 'POS Dashboard Overview',
      },
      {
        type: 'text',
        heading: 'Real-Time Analytics & Payments',
        paragraph:
          'Every transaction flows through a unified pipeline that feeds real-time dashboards. Integrated Stripe and Razorpay gateways handle payment processing, while WebSocket connections push live updates to all connected terminals. Inventory syncs across branches in milliseconds, not minutes.',
      },
      {
        type: 'image',
        src: '/images/pos-saas.png',
        alt: 'Analytics Dashboard',
      },
    ],
  },
  {
    id: 'access-ai',
    slug: 'access-ai',
    index: '02',
    title: 'AccessAI — AI Accessibility Platform',
    description:
      'AI-powered accessibility platform with real-time sign language recognition, cognitive text simplification, automated image captioning, and voice-controlled navigation. Microservices architecture with WebSocket streaming.',
    tags: ['React', 'Node.js', 'Fastify', 'TensorFlow', 'PostgreSQL', 'Prisma'],
    color: '#B5C9A8',
    image: '/images/access-ai.png',
    client: 'Hackathon Project',
    year: '2024',
    services: ['AI/ML Engineering', 'Microservices', 'Accessibility Design'],
    intro:
      'An AI-driven platform that breaks down digital barriers for users with disabilities. Real-time sign language recognition, cognitive text simplification, and voice-controlled navigation — all powered by a microservices architecture with WebSocket streaming.',
    content: [
      {
        type: 'text',
        heading: 'Accessibility as a First-Class Feature',
        paragraph:
          'The web should be for everyone. AccessAI approaches accessibility not as an afterthought but as the core product. Using TensorFlow models for real-time sign language recognition and NLP pipelines for cognitive text simplification, the platform adapts content to meet users where they are.',
      },
      {
        type: 'image',
        src: '/images/access-ai.png',
        alt: 'AccessAI Interface',
      },
      {
        type: 'text',
        heading: 'Distributed Intelligence',
        paragraph:
          'Each AI capability runs as an independent microservice — sign language recognition, image captioning, text simplification, and voice navigation — all orchestrated through a Fastify gateway with WebSocket streaming for sub-second response times. PostgreSQL with Prisma ORM handles persistent state.',
      },
      {
        type: 'image',
        src: '/images/access-ai.png',
        alt: 'Architecture Diagram',
      },
    ],
  },
  {
    id: 'aura-ai',
    slug: 'aura-ai',
    index: '03',
    title: '"Aura" — Autonomous Agentic AI',
    description:
      'LLM-powered content orchestration engine using LangChain. Deterministic agentic workflow with custom tool definitions, Google Search API for grounding, and structured JSON output generation.',
    tags: ['Python', 'LangChain', 'Gemini', 'REST APIs', 'JSON'],
    color: '#D4A574',
    image: '/images/aura-ai.png',
    client: 'Research Project',
    year: '2025',
    services: ['AI Engineering', 'Prompt Engineering', 'API Design'],
    intro:
      'An autonomous content orchestration engine that combines LLM reasoning with deterministic tool execution. Aura doesn\'t just generate — it researches, validates, and structures outputs with grounded accuracy.',
    content: [
      {
        type: 'text',
        heading: 'Beyond Simple Generation',
        paragraph:
          'Large language models are powerful but unreliable when left unchecked. Aura wraps Gemini in a deterministic agentic framework built with LangChain — custom tool definitions gate every external interaction, Google Search API provides real-time grounding, and structured JSON schemas enforce output consistency.',
      },
      {
        type: 'image',
        src: '/images/aura-ai.png',
        alt: 'Aura Workflow Diagram',
      },
      {
        type: 'text',
        heading: 'Orchestration, Not Automation',
        paragraph:
          'The distinction matters. Automation replaces human effort; orchestration amplifies it. Aura\'s agentic workflow lets the AI reason about which tools to invoke, when to search for ground truth, and how to structure its final output — all while maintaining deterministic control flow that humans can audit and trust.',
      },
      {
        type: 'image',
        src: '/images/aura-ai.png',
        alt: 'Agentic Pipeline',
      },
    ],
  },
];

// Placeholder slot for future projects
export const HAS_MORE_PROJECTS = true;

// Helper to find a project by slug
export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

// Helper to get other projects (excluding current)
export function getOtherProjects(currentSlug: string): Project[] {
  return PROJECTS.filter((p) => p.slug !== currentSlug);
}
