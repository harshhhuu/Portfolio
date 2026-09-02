'use client';

import { useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { useMousePosition } from '@/hooks/useMousePosition';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import ProjectHero from '@/components/project/ProjectHero';
import ProjectContent from '@/components/project/ProjectContent';
import OtherProjects from '@/components/project/OtherProjects';
import { getProjectBySlug, getOtherProjects } from '@/lib/projects';
import { useScrollStore } from '@/store/useScrollStore';

export default function ProjectDetailPage() {
  useMousePosition();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const isLoaded = useScrollStore((s) => s.isLoaded);
  const setLoaded = useScrollStore((s) => s.setLoaded);

  // Mark page as loaded immediately (no preloader on sub-pages)
  useEffect(() => {
    if (!isLoaded) {
      setLoaded(true);
    }
  }, [isLoaded, setLoaded]);

  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const otherProjects = getOtherProjects(slug);

  return (
    <>
      <CustomCursor />
      <Navbar />

      <main className="w-full min-h-screen bg-background">
        <ProjectHero project={project} />
        <ProjectContent content={project.content} />
        <OtherProjects projects={otherProjects} />
      </main>
    </>
  );
}
