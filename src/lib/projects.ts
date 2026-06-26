export interface Project {
  id: string;
  index: string;
  title: string;
  description: string;
  tags: string[];
  color: string;       // Accent color for the card
  link?: string;       // External link (optional)
  github?: string;     // GitHub link (optional)
}

export const PROJECTS: Project[] = [
  {
    id: 'pos-saas',
    index: '01',
    title: 'Cloud-Native Multi-Tenant POS SaaS',
    description:
      'Full-stack POS platform with role-based access for Super Admins, Branch Managers & Cashiers. Real-time analytics, Stripe/Razorpay payments, and centralized inventory across multiple stores.',
    tags: ['React', 'Redux', 'Tailwind CSS', 'Spring Boot', 'MySQL', 'Stripe'],
    color: '#A8C5DA',
  },
  {
    id: 'access-ai',
    index: '02',
    title: 'AccessAI — AI Accessibility Platform',
    description:
      'AI-powered accessibility platform with real-time sign language recognition, cognitive text simplification, automated image captioning, and voice-controlled navigation. Microservices architecture with WebSocket streaming.',
    tags: ['React', 'Node.js', 'Fastify', 'TensorFlow', 'PostgreSQL', 'Prisma'],
    color: '#B5C9A8',
  },
  {
    id: 'aura-ai',
    index: '03',
    title: '"Aura" — Autonomous Agentic AI',
    description:
      'LLM-powered content orchestration engine using LangChain. Deterministic agentic workflow with custom tool definitions, Google Search API for grounding, and structured JSON output generation.',
    tags: ['Python', 'LangChain', 'Gemini', 'REST APIs', 'JSON'],
    color: '#D4A574',
  },
];

// Placeholder slot for future projects
export const HAS_MORE_PROJECTS = true;
