'use client';

import SectionLabel from './SectionLabel';
import { useScrollStore } from '@/store/useScrollStore';
import { PERSONAL } from '@/lib/constants';

export default function AboutSection() {
  const setCursorVariant = useScrollStore((s) => s.setCursorVariant);

  const skills = {
    frontend: ['React', 'Next.js', 'Vite', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3', 'Flutter'],
    backendAI: ['Python', 'Java', 'Spring Boot', 'Node.js', 'Fastify', 'LangChain', 'Gemini / OpenAI API'],
    infraTools: ['Git / GitHub', 'Docker', 'PostgreSQL', 'MySQL', 'MongoDB', 'Supabase', 'Firebase', 'Blender / WebGL'],
  };

  const experience = [
    {
      role: 'Full-Stack Developer (Projects & Freelance)',
      period: 'Jan 2023 – Present',
      description: 'Architecting end-to-end applications from database schemas to responsive interfaces. Building custom SaaS solutions, API orchestrations, and AI integrations.',
    },
  ];

  const education = [
    {
      school: 'NMIMS University, Mumbai',
      degree: 'Master of Computer Applications (MCA)',
      period: '2024 – 2026',
    },
    {
      school: 'GLS University, Ahmedabad',
      degree: 'Bachelor of Computer Applications (BCA)',
      period: '2021 – 2024',
    },
  ];

  const certifications = [
    'Microsoft Certified: Azure AI Fundamentals (AI-900)',
    'Full-Stack Web Development Specialization',
  ];

  return (
    <section
      id="about"
      className="min-h-screen w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-border-custom relative z-10 bg-background flex flex-col items-center justify-center"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column Label */}
        <div className="lg:col-span-1">
          <SectionLabel number="02" label="About" />
        </div>

        {/* Right Column Content */}
        <div className="lg:col-span-3 flex flex-col gap-16 md:gap-24">
          {/* Main Statement */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-light leading-snug text-text font-display split-text">
              I am a developer who cares about <span className="text-accent font-bold uppercase">what&apos;s under the hood</span> as much as <span className="italic font-light">what&apos;s on the screen</span>.
            </h2>
            <p className="text-textMuted font-medium leading-relaxed reveal-on-scroll">
              {PERSONAL.bio}
            </p>
          </div>

          {/* Skills 3-Column Grid */}
          <div className="flex flex-col gap-8 reveal-on-scroll">
            <h3 className="text-xs font-mono tracking-widest text-textMuted uppercase border-b border-border-custom pb-2">
              Technical Competencies // capabilities.ini
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Frontend Column */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-bold uppercase tracking-wider font-display text-accent">
                  Frontend & Mobile
                </span>
                <ul className="flex flex-col gap-2 font-mono text-xs text-textMuted">
                  {skills.frontend.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Backend & AI Column */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-bold uppercase tracking-wider font-display text-accent">
                  Backend & Intelligent Systems
                </span>
                <ul className="flex flex-col gap-2 font-mono text-xs text-textMuted">
                  {skills.backendAI.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools & Infra Column */}
              <div className="flex flex-col gap-4">
                <span className="text-sm font-bold uppercase tracking-wider font-display text-accent">
                  Tools & Architecture
                </span>
                <ul className="flex flex-col gap-2 font-mono text-xs text-textMuted">
                  {skills.infraTools.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Experience & Education Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Experience */}
            <div className="flex flex-col gap-6 reveal-on-scroll">
              <h3 className="text-xs font-mono tracking-widest text-textMuted uppercase border-b border-border-custom pb-2">
                Professional Experience // timeline.log
              </h3>
              <div className="flex flex-col gap-6">
                {experience.map((item) => (
                  <div key={item.role} className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-accent font-bold">
                      {item.period}
                    </span>
                    <h4 className="text-base font-bold font-display uppercase tracking-tight text-text">
                      {item.role}
                    </h4>
                    <p className="text-xs text-textMuted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="flex flex-col gap-6 reveal-on-scroll">
              <h3 className="text-xs font-mono tracking-widest text-textMuted uppercase border-b border-border-custom pb-2">
                Academic Background // education.dat
              </h3>
              <div className="flex flex-col gap-6">
                {education.map((item) => (
                  <div key={item.school} className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] text-accent font-bold">
                      {item.period}
                    </span>
                    <h4 className="text-base font-bold font-display uppercase tracking-tight text-text">
                      {item.degree}
                    </h4>
                    <p className="text-xs text-textMuted">
                      {item.school}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications Block */}
          <div className="flex flex-col gap-6 reveal-on-scroll">
            <h3 className="text-xs font-mono tracking-widest text-textMuted uppercase border-b border-border-custom pb-2">
              Industry Certifications // certs.json
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="bg-card border border-border-custom p-4 rounded-xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs text-text">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
