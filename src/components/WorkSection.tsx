'use client';

import { gsap } from 'gsap';
import { PROJECTS, HAS_MORE_PROJECTS } from '@/lib/projects';
import SectionLabel from './SectionLabel';
import { useScrollStore } from '@/store/useScrollStore';

export default function WorkSection() {

  return (
    <section
      id="work"
      className="min-h-screen w-full py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-border-custom relative z-10 flex flex-col items-center justify-center"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column Section Label */}
        <div className="lg:col-span-1">
          <SectionLabel number="01" label="Work" />
        </div>

        {/* Right Column Featured Projects */}
        <div className="lg:col-span-3 flex flex-col gap-16 md:gap-24">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight uppercase split-text">
              Featured Projects
            </h2>
            <p className="text-textMuted max-w-xl font-medium reveal-on-scroll">
              A curated selection of applications spanning cloud architectures, intelligent agentic workflows, and machine learning systems.
            </p>
          </div>

          {/* Projects Gallery */}
          <div className="flex flex-col gap-12" style={{ perspective: 1200 }}>
            {PROJECTS.map((project, idx) => (
              <div
                key={project.id}
                className="project-card group relative bg-card border border-border-custom rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-accent/40 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(212,165,116,0.1)] reveal-on-scroll"
                style={{ willChange: 'transform' }}
                onMouseEnter={() => {
                  useScrollStore.getState().setCursorVariant('project');
                  useScrollStore.getState().setCursorLabel('VIEW');
                }}
                onMouseMove={(e) => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;

                  gsap.to(card, {
                    rotateY: x * 12,
                    rotateX: -y * 12,
                    transformPerspective: 1200,
                    ease: 'power2.out',
                    duration: 0.4
                  });
                  
                  const glare = card.querySelector('.glare-effect');
                  if (glare) {
                    gsap.to(glare, {
                      x: e.clientX - rect.left - rect.width,
                      y: e.clientY - rect.top - rect.height,
                      opacity: 0.15,
                      ease: 'power2.out',
                      duration: 0.4
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  useScrollStore.getState().setCursorVariant('default');
                  useScrollStore.getState().setCursorLabel('');
                  
                  const card = e.currentTarget;
                  gsap.to(card, {
                    rotateY: 0,
                    rotateX: 0,
                    ease: 'power3.out',
                    duration: 0.8
                  });
                  
                  const glare = card.querySelector('.glare-effect');
                  if (glare) {
                    gsap.to(glare, {
                      opacity: 0,
                      ease: 'power3.out',
                      duration: 0.8
                    });
                  }
                }}
              >
                {/* Glare Element */}
                <div 
                  className="glare-effect pointer-events-none absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_50%)] opacity-0 mix-blend-overlay z-50 rounded-full"
                  style={{ left: 0, top: 0 }}
                />

                {/* Project Styled Graphics Cover */}
                <div className="md:w-2/5 h-48 md:h-auto relative bg-zinc-950 overflow-hidden flex items-center justify-center border-b md:border-b-0 md:border-r border-border-custom">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[radial-gradient(#252228_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

                  {/* Aesthetic Abstract Visualizer */}
                  <div
                    className="w-24 h-24 rounded-full filter blur-xl opacity-20 animate-pulse duration-1000"
                    style={{ backgroundColor: project.color }}
                  />

                  {/* Schematic UI / Code Simulation */}
                  <div className="absolute inset-4 rounded-xl border border-white/5 bg-black/60 p-4 font-mono text-[9px] text-textMuted flex flex-col justify-between select-none">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] text-text font-bold uppercase">
                        {project.id}.config
                      </span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
                    </div>
                    <div className="flex-1 py-2 flex flex-col gap-1.5 opacity-80">
                      <span>$ npm init {project.id} --y</span>
                      <span className="text-accent">$ status: operational</span>
                      <span>$ tags: [{project.tags.slice(0, 3).join(', ')}]</span>
                    </div>
                    <div className="text-right text-[8px] opacity-60">SYS_BUILD_v2026.0</div>
                  </div>
                </div>

                {/* Project Details Content */}
                <div className="p-8 md:w-3/5 flex flex-col justify-between gap-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-accent font-bold">
                        PROJECT // {project.index}
                      </span>
                      <span className="text-[10px] font-mono text-textMuted">2026</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-display uppercase tracking-tight text-text group-hover:text-accent transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-textMuted leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono tracking-wider bg-zinc-900 border border-border-custom px-2.5 py-1 rounded-full text-textMuted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* External links */}
                    <div className="flex items-center gap-4 pt-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-textMuted hover:text-text transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                          onMouseEnter={() => useScrollStore.getState().setCursorVariant('hover')}
                          onMouseLeave={() => useScrollStore.getState().setCursorVariant('project')}
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-textMuted hover:text-text transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                          onMouseEnter={() => useScrollStore.getState().setCursorVariant('hover')}
                          onMouseLeave={() => useScrollStore.getState().setCursorVariant('project')}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty Ghost Slot Card */}
            {HAS_MORE_PROJECTS && (
              <div className="border border-dashed border-border-custom bg-transparent rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 h-48 md:h-64 reveal-on-scroll">
                <span className="font-mono text-xs text-textMuted">EMPTY_SLOT_04 // FUTURE_RELEASE</span>
                <h4 className="text-lg font-bold font-display uppercase tracking-tight text-textMuted">
                  More Projects in the Pipeline
                </h4>
                <p className="text-xs text-textMuted max-w-sm">
                  Working on new experiments involving WebGL, distributed databases, and automated software agents. Check back soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
