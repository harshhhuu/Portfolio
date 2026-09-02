'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useScrollStore } from '@/store/useScrollStore';
import type { Project } from '@/lib/projects';

interface WorksProjectCardProps {
  project: Project;
}

const PROJECT_NEGATIVE_COLORS: Record<string, string> = {
  'pos-saas': '#00E5FF',     // Electric Cyan -> inverts to warm amber-gold negative
  'access-ai': '#A855F7',    // Electric Violet -> inverts to vivid lime-emerald negative
  'aura-ai': '#FF6D00',      // Vivid Amber -> inverts to deep crystal cyan negative
};

export default function WorksProjectCard({ project }: WorksProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const setCursor = useScrollStore((s) => s.setCursor);

  const handleMouseEnter = () => {
    const color = PROJECT_NEGATIVE_COLORS[project.id] || '#cc0597';
    setCursor('project', 'VIEW', color);
  };

  const handleMouseLeave = () => {
    setCursor('default', '');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const y = (e.clientY - rect.top) / rect.height;
    // Gentle cinematic parallax drift on the image
    const translateY = (y - 0.5) * -12;
    imageRef.current.style.transform = `scale(1.04) translateY(${translateY}px)`;
  };

  const handleMouseLeaveImage = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = 'scale(1) translateY(0px)';
  };

  return (
    <Link
      ref={cardRef}
      href={`/works/${project.slug}`}
      className="works-card group block relative w-full overflow-hidden rounded-md bg-card shadow-2xl"
      style={{ aspectRatio: '16 / 9' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 overflow-hidden rounded-md">
        <div
          ref={imageRef}
          className="absolute inset-0 transition-transform duration-700 ease-out"
          onMouseLeave={handleMouseLeaveImage}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Subtle vignette gradient at bottom so title pops effortlessly */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-75" />
        </div>
      </div>

      {/* Minimalist 375.studio Editorial Serif Title at Bottom-Left */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 pointer-events-none">
        <h3
          className="font-serif text-2xl sm:text-3xl lg:text-[2.25rem] font-normal tracking-wide drop-shadow-sm transition-transform duration-500 ease-out group-hover:translate-x-2"
          style={{ color: project.color || '#7FB8C7' }}
        >
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
