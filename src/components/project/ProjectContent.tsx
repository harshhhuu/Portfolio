'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import type { ProjectContentBlock } from '@/lib/projects';

gsap.registerPlugin(ScrollTrigger);

interface ProjectContentProps {
  content: ProjectContentBlock[];
}

export default function ProjectContent({ content }: ProjectContentProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each content block on scroll
      const blocks = sectionRef.current!.querySelectorAll('.content-block');
      blocks.forEach((block) => {
        gsap.from(block, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none none',
          },
        });
      });

      // Parallax for images
      const images = sectionRef.current!.querySelectorAll('.content-image');
      images.forEach((img) => {
        gsap.to(img, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <div ref={sectionRef} className="w-full py-20 md:py-32 px-6 md:px-12 lg:px-24 space-y-20 md:space-y-32">
      {content.map((block, index) => {
        if (block.type === 'text') {
          return (
            <div
              key={index}
              className="content-block max-w-3xl mx-auto"
            >
              {block.heading && (
                <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6 md:mb-8">
                  {block.heading}
                </h2>
              )}
              {block.paragraph && (
                <p className="text-textMuted text-base md:text-lg leading-relaxed">
                  {block.paragraph}
                </p>
              )}
            </div>
          );
        }

        if (block.type === 'image') {
          return (
            <div
              key={index}
              className="content-block w-full overflow-hidden rounded-lg"
            >
              <div className="content-image relative w-full aspect-[16/9]">
                <Image
                  src={block.src || '/images/placeholder.png'}
                  alt={block.alt || 'Project image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </div>
          );
        }

        if (block.type === 'image-pair') {
          return (
            <div
              key={index}
              className="content-block grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
            >
              <div className="content-image relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={block.srcLeft || '/images/placeholder.png'}
                  alt={block.altLeft || 'Project image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
              <div className="content-image relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src={block.srcRight || '/images/placeholder.png'}
                  alt={block.altRight || 'Project image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>
          );
        }

        if (block.type === 'video') {
          return (
            <div
              key={index}
              className="content-block w-full overflow-hidden rounded-lg"
            >
              <video
                src={block.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-[16/9] object-cover"
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
