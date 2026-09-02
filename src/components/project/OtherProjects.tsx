'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollStore } from '@/store/useScrollStore';
import type { Project } from '@/lib/projects';

gsap.registerPlugin(ScrollTrigger);

interface OtherProjectsProps {
  projects: Project[];
}

export default function OtherProjects({ projects }: OtherProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const setCursor = useScrollStore((s) => s.setCursor);

  const NEGATIVE_PALETTE = ['#00E5FF', '#A855F7', '#FF6D00', '#10B981', '#F43F5E'];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (projects.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="py-20 md:py-32 border-t border-border/30"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-10">
        <span className="font-mono text-xs uppercase tracking-widest text-textMuted/60 block mb-2">
          Keep Exploring
        </span>
        <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
          Other Projects
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 md:px-12 pb-6 scrollbar-none"
        style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {projects.map((project, idx) => (
          <Link
            key={project.id}
            href={`/works/${project.slug}`}
            className="flex-shrink-0 w-[70vw] md:w-[35vw] lg:w-[28vw] group relative overflow-hidden rounded-lg"
            style={{ aspectRatio: '16 / 10' }}
            onMouseEnter={() => {
              const color = NEGATIVE_PALETTE[idx % NEGATIVE_PALETTE.length];
              setCursor('project', 'VIEW', color);
            }}
            onMouseLeave={() => {
              setCursor('default', '');
            }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 70vw, (max-width: 1024px) 35vw, 28vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
                {project.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
