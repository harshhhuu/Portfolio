'use client';

import SectionLabel from './SectionLabel';
import { useScrollStore } from '@/store/useScrollStore';
import { PERSONAL, SOCIALS } from '@/lib/constants';
import Magnetic from './Magnetic';

export default function ContactSection() {
  const setCursorVariant = useScrollStore((s) => s.setCursorVariant);

  const handleScrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = document.querySelector('#hero');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="contact"
      className="min-h-screen w-full py-32 md:py-48 px-6 md:px-12 lg:px-24 relative z-10 flex flex-col items-center justify-between bg-background"
    >
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
        {/* Left Column Label */}
        <div className="lg:col-span-1">
          <SectionLabel number="03" label="Contact" />
        </div>

        {/* Right Column Content */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-16">
          {/* CTA Header */}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-display tracking-tight uppercase leading-[1.0] split-text">
              Let&apos;s build <br />
              something <span className="italic font-light text-accent">extraordinary</span>.
            </h2>
            <p className="text-textMuted max-w-lg font-medium leading-relaxed mt-4 reveal-on-scroll">
              Have an idea, project, or opportunity you&apos;d like to discuss? Drop me a message, and let&apos;s make something memorable.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="flex flex-col gap-8 reveal-on-scroll">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest text-textMuted uppercase">
                Direct Email // inbox.sys
              </span>
              <Magnetic range={50} actionStrength={0.2}>
                <a
                  href={`mailto:${SOCIALS.email}`}
                  className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white hover:text-accent transition-colors duration-300 cursor-pointer"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {SOCIALS.email}
                </a>
              </Magnetic>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 mt-4">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest text-textMuted uppercase">
                  LinkedIn // professional.net
                </span>
                <Magnetic range={35} actionStrength={0.25}>
                  <a
                    href={SOCIALS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-text hover:text-accent transition-colors duration-300 cursor-pointer"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    linkedin.com/in/harsh-makwana-389137291
                  </a>
                </Magnetic>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-widest text-textMuted uppercase">
                  GitHub // codebase.rep
                </span>
                <Magnetic range={35} actionStrength={0.25}>
                  <a
                    href={SOCIALS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-text hover:text-accent transition-colors duration-300 cursor-pointer"
                    onMouseEnter={() => setCursorVariant('hover')}
                    onMouseLeave={() => setCursorVariant('default')}
                  >
                    github.com/harshhhuu
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Empty Space for the 3D Object at the bottom */}
          <div className="h-24 md:h-32" />
        </div>
      </div>

      {/* Footer bottom details */}
      <div className="max-w-6xl w-full mx-auto border-t border-border-custom pt-8 mt-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-textMuted">
        <span>© 2026 {PERSONAL.name.toUpperCase()} · ALL RIGHTS RESERVED</span>
        <div className="flex items-center gap-6">
          <span>DESIGNED & BUILT BY ME</span>
          <Magnetic range={45} actionStrength={0.25}>
            <button
              onClick={handleScrollToTop}
              className="text-text hover:text-accent transition-colors duration-300 flex items-center gap-1.5 cursor-pointer"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Back to Top
              <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}