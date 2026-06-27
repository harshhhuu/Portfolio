'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, HAS_MORE_PROJECTS } from '@/lib/projects';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { useScrollStore } from '@/store/useScrollStore';

export default function WorkSection() {
  const setTargetPosition = useScrollStore((s) => s.setTargetPosition);
  const setTargetScale = useScrollStore((s) => s.setTargetScale);
  const setMaterialTargets = useScrollStore((s) => s.setMaterialTargets);

  // Helper to update background WebGL 3D object state based on current active project index
  const update3DScene = (index: number) => {
    const colors = ['#A8C5DA', '#B5C9A8', '#D4A574', '#D4A574'];
    const side = index % 2 === 0 ? 1 : -1;

    if (index === 3) {
      // Future release slot: center spinning wireframe
      setTargetPosition([0, 0, -2.2]);
      setTargetScale(0.5);
      setMaterialTargets({
        color: '#D4A574',
        wireframe: true,
        roughness: 0.15,
        metalness: 0.1,
        emissiveIntensity: 0.5,
        transmission: 0,
      });
    } else {
      setTargetPosition([1.8 * side, 0, -1]);
      setTargetScale(0.65);
      setMaterialTargets({
        color: colors[index],
        roughness: 0.25,
        metalness: 0.85,
        emissiveIntensity: 0.1,
        wireframe: false,
        transmission: 0,
      });
    }
  };

  useEffect(() => {
    // Safely register ScrollTrigger on mount
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Default 3D state on mount
    update3DScene(0);

    const containers = gsap.utils.toArray<HTMLElement>('.project-container');
    const triggers: ScrollTrigger[] = [];

    // Bind triggers to update the 3D scene as projects scroll past
    containers.forEach((container, index) => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => update3DScene(index),
        onEnterBack: () => update3DScene(index),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section id="work" className="w-full relative z-10 py-32 md:py-48 bg-transparent">
      
      {/* Section Introduction Header */}
      <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col gap-4 text-center mb-12">
        <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">
          01 / SELECTED WORK
        </span>
        <h2 className="text-4xl md:text-8xl font-medium font-sans uppercase tracking-tight text-text text-center">
          Featured
        </h2>
      </div>

      {/* Projects vertical stack */}
      <div className="flex flex-col w-full gap-8 md:gap-12 items-center justify-center">
        {PROJECTS.map((project, idx) => (
          <div key={project.id} className="project-container w-full flex items-center justify-center relative">
            
            {/* Scroll tilt animation component */}
            <ContainerScroll>
              {/* Card content (16:9 IMAX visual frame) */}
              <div
                className="relative w-full h-full group overflow-hidden"
                onMouseEnter={() => {
                  useScrollStore.getState().setCursorVariant('project');
                  useScrollStore.getState().setCursorLabel('VIEW');
                }}
                onMouseLeave={() => {
                  useScrollStore.getState().setCursorVariant('default');
                  useScrollStore.getState().setCursorLabel('');
                }}
              >
                {/* Subtle digital grid pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#252228_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-10 pointer-events-none" />

                {/* Cinematic film vignette gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/35 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10 pointer-events-none" />

                {/* Project visual graphic */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-1000 ease-out group-hover:scale-105"
                  draggable={false}
                />

                {/* Overlay: Index (Top-Left) */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 font-mono text-xs md:text-sm text-accent font-bold tracking-widest">
                  {project.index}
                </div>

                {/* Overlay: Title & Tech Tags (Bottom-Left) */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 flex flex-col gap-4 max-w-[60%] text-left">
                  <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium font-sans italic tracking-wide text-text drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[8px] md:text-[9px] font-mono tracking-wider bg-black/40 border border-white/10 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-textMuted uppercase backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overlay: Description & Links (Bottom-Right) */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex flex-col gap-3 md:gap-4 max-w-[35%] text-right items-end">
                  <p className="text-[10px] md:text-xs lg:text-sm text-textMuted leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hidden sm:block">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 md:gap-6 pt-1 pointer-events-auto">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-xs font-mono text-textMuted hover:text-text transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                        onMouseEnter={() => useScrollStore.getState().setCursorVariant('hover')}
                        onMouseLeave={() => useScrollStore.getState().setCursorVariant('project')}
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
                        className="text-[10px] md:text-xs font-mono text-textMuted hover:text-text transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
                        onMouseEnter={() => useScrollStore.getState().setCursorVariant('hover')}
                        onMouseLeave={() => useScrollStore.getState().setCursorVariant('project')}
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
            </ContainerScroll>
          </div>
        ))}

        {/* Cinematic credit roll ending slide */}
        {HAS_MORE_PROJECTS && (
          <div className="project-container w-full flex items-center justify-center relative">
            <ContainerScroll>
              {/* Virtual black box representing future work */}
              <div className="w-full h-full bg-zinc-950 flex items-center justify-center relative select-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#252228_1px,transparent_1px)] [background-size:16px_16px] opacity-20 z-10 pointer-events-none" />
                <div className="w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(212,165,116,0.05)_0%,transparent_60%)] animate-pulse" />
                
                {/* Overlay: Index (Top-Left) */}
                <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 font-mono text-xs md:text-sm text-textMuted font-bold tracking-widest">
                  04
                </div>

                {/* Overlay: Title & Tech Tags (Bottom-Left) */}
                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-20 flex flex-col gap-4 max-w-[60%] text-left">
                  <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium font-sans italic tracking-wide text-textMuted drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-tight">
                    Coming Soon
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {['WebGL', 'AI Agents', 'Rust / WASM', 'Network Protocols'].map((tag) => (
                      <span
                        key={tag}
                        className="text-[8px] md:text-[9px] font-mono tracking-wider bg-black/40 border border-white/10 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-textMuted uppercase backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overlay: Description & Links (Bottom-Right) */}
                <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 flex flex-col gap-3 md:gap-4 max-w-[35%] text-right items-end">
                  <p className="text-[10px] md:text-xs lg:text-sm text-textMuted leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hidden sm:block">
                    Currently designing custom WebGL shaders and multi-agent LLM orchestrators.
                  </p>
                  <div className="font-mono text-[9px] text-accent tracking-widest uppercase">
                    STATUS // IN_PRODUCTION
                  </div>
                </div>
              </div>
            </ContainerScroll>
          </div>
        )}
      </div>

    </section>
  );
}
