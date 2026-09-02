'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import type { Project } from '@/lib/projects';

interface ProjectHeroProps {
  project: Project;
}

export default function ProjectHero({ project }: ProjectHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(labelRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
        .from(
          titleRef.current,
          {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .from(
          metaRef.current,
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          imageRef.current,
          {
            y: 80,
            opacity: 0,
            scale: 0.98,
            duration: 1.2,
            ease: 'power3.out',
          },
          '-=0.4'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* Hero Metadata Section */}
      <section className="min-h-screen w-full flex flex-col justify-end pb-12 md:pb-20 px-6 md:px-12 lg:px-24 pt-32">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-16">
          {/* Left: Title */}
          <div className="flex-1">
            <span
              ref={labelRef}
              className="font-mono text-xs tracking-[0.3em] uppercase text-textMuted block mb-4"
            >
              {project.client}
            </span>
            <h1
              ref={titleRef}
              className="font-display text-[clamp(2.5rem,7vw,6rem)] font-black leading-[0.95] tracking-tight text-foreground"
            >
              {project.title}
            </h1>
          </div>

          {/* Right: Meta Info */}
          <div ref={metaRef} className="flex-shrink-0 md:max-w-sm md:text-right space-y-4">
            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-textMuted block mb-1">
                Year
              </span>
              <span className="text-foreground text-sm font-medium">{project.year}</span>
            </div>

            {project.link && (
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-textMuted block mb-1">
                  Website
                </span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground text-sm hover:text-accent transition-colors duration-300 underline underline-offset-4 decoration-accent/30 hover:decoration-accent"
                >
                  {project.link.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            <div>
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-textMuted block mb-1">
                Info
              </span>
              <p className="text-foreground/80 text-sm leading-relaxed">{project.intro}</p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end pt-2">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="text-[10px] font-mono tracking-wider uppercase border border-accent/30 text-accent px-3 py-1 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-width Cover Image */}
      <div
        ref={imageRef}
        className="w-full aspect-[16/9] relative overflow-hidden"
      >
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
