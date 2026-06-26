'use client';

import { useScrollStore } from '@/store/useScrollStore';
import { NAV_ITEMS, PERSONAL, SOCIALS } from '@/lib/constants';
import Magnetic from './Magnetic';

export default function Navbar() {
  const activeSection = useScrollStore((s) => s.activeSection);
  const setCursorVariant = useScrollStore((s) => s.setCursorVariant);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 md:top-6 z-40 flex justify-center px-4 md:px-6 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4 rounded-full border border-white/5 bg-black/40 backdrop-blur-md w-full max-w-7xl pointer-events-auto">
        {/* Monogram / Logo */}
        <Magnetic range={40} actionStrength={0.25}>
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 group cursor-pointer"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-display font-black text-sm text-white group-hover:scale-105 transition-transform duration-300">
              {PERSONAL.initials}
            </div>
            <span className="font-mono text-xs tracking-widest text-text hidden sm:inline-block group-hover:text-accent transition-colors duration-300">
              {PERSONAL.name.toUpperCase()}
            </span>
          </a>
        </Magnetic>

        {/* Center Nav Items */}
        <nav className="flex items-center gap-4 md:gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <Magnetic key={item.href} range={35} actionStrength={0.3}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`font-mono text-xs tracking-wider uppercase transition-all duration-300 relative py-1 cursor-pointer ${
                    isActive ? 'text-accent' : 'text-textMuted hover:text-text'
                  }`}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-accent rounded-full animate-pulse" />
                  )}
                </a>
              </Magnetic>
            );
          })}
        </nav>

        {/* CTA Contact link */}
        <div className="hidden md:flex items-center">
          <Magnetic range={50} actionStrength={0.25}>
            <a
              href={`mailto:${SOCIALS.email}`}
              className="font-mono text-[10px] tracking-widest uppercase border border-accent/40 px-4 py-2 rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
            >
              Get In Touch
            </a>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
