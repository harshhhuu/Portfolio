'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollStore } from '@/store/useScrollStore';
import { OBJECT_CONFIGS } from '@/lib/constants';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPScrollTrigger() {
  const isLoaded = useScrollStore((s) => s.isLoaded);
  const setActiveSection = useScrollStore((s) => s.setActiveSection);
  const setTargetPosition = useScrollStore((s) => s.setTargetPosition);
  const setTargetScale = useScrollStore((s) => s.setTargetScale);
  const setTargetRotationSpeed = useScrollStore((s) => s.setTargetRotationSpeed);
  const setMaterialTargets = useScrollStore((s) => s.setMaterialTargets);

  useEffect(() => {
    if (!isLoaded) return;

    // Helper to apply object configuration targets
    const applyConfig = (section: 'hero' | 'work' | 'about' | 'contact') => {
      const config = OBJECT_CONFIGS[section];
      setActiveSection(section);
      setTargetPosition(config.position);
      setTargetScale(config.scale);
      setTargetRotationSpeed(config.rotationSpeed);
      setMaterialTargets(config.material);
    };

    // Overall scroll progress tracker
    const mainTrigger = ScrollTrigger.create({
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        useScrollStore.getState().setScrollProgress(self.progress);
      },
    });

    // ─── Hero Section ───
    const heroTrigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => applyConfig('hero'),
      onEnterBack: () => applyConfig('hero'),
    });

    // ─── Work Section ───
    const workTrigger = ScrollTrigger.create({
      trigger: '#work',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => applyConfig('work'),
      onEnterBack: () => applyConfig('work'),
    });

    // Project cards inside Work section to create "weaving" effect
    const cards = gsap.utils.toArray<HTMLElement>('.project-card');
    const cardTriggers: ScrollTrigger[] = [];

    cards.forEach((card, index) => {
      const cardTrigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          // Alternate left and right position per project card
          const side = index % 2 === 0 ? 1 : -1;
          setTargetPosition([1.8 * side, 0, -1]);
          setTargetScale(0.65);
          const colors = ['#A8C5DA', '#B5C9A8', '#D4A574'];
          setMaterialTargets({
            color: colors[index % colors.length],
            roughness: 0.25,
            metalness: 0.85,
            emissiveIntensity: 0.1,
          });
        },
        onEnterBack: () => {
          const side = index % 2 === 0 ? 1 : -1;
          setTargetPosition([1.8 * side, 0, -1]);
          setTargetScale(0.65);
          const colors = ['#A8C5DA', '#B5C9A8', '#D4A574'];
          setMaterialTargets({
            color: colors[index % colors.length],
            roughness: 0.25,
            metalness: 0.85,
            emissiveIntensity: 0.1,
          });
        },
      });
      cardTriggers.push(cardTrigger);
    });

    // ─── About Section ───
    const aboutTrigger = ScrollTrigger.create({
      trigger: '#about',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => applyConfig('about'),
      onEnterBack: () => applyConfig('about'),
    });

    // ─── Contact Section ───
    const contactTrigger = ScrollTrigger.create({
      trigger: '#contact',
      start: 'top center',
      end: 'bottom center',
      onEnter: () => applyConfig('contact'),
      onEnterBack: () => applyConfig('contact'),
    });

    // ─── Advanced Typographic Split Reveals ───
    const splitTextHelper = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const parent = node.parentNode;
        if (!parent) return;

        const fragment = document.createDocumentFragment();
        const words = text.split(/(\s+)/);

        words.forEach((word) => {
          if (word.trim().length === 0) {
            fragment.appendChild(document.createTextNode(word));
          } else {
            const outer = document.createElement('span');
            outer.className = 'inline-block overflow-hidden align-bottom';
            outer.setAttribute('aria-hidden', 'true');
            
            const inner = document.createElement('span');
            inner.className = 'inline-block split-word translate-y-[105%]';
            inner.textContent = word;
            
            outer.appendChild(inner);
            fragment.appendChild(outer);
          }
        });

        parent.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.classList.contains('split-word') || element.classList.contains('overflow-hidden')) {
          return;
        }
        const children = Array.from(element.childNodes);
        children.forEach((child) => splitTextHelper(child));
      }
    };

    const splitTexts = gsap.utils.toArray<HTMLElement>('.split-text');
    const splitRevealAnimations: any[] = [];

    splitTexts.forEach((el) => {
      // Set accessibility label
      const fullText = el.textContent || '';
      el.setAttribute('aria-label', fullText);

      // Perform recursive split
      splitTextHelper(el);

      const inners = el.querySelectorAll('.split-word');
      
      const anim = gsap.fromTo(
        inners,
        { y: '105%' },
        {
          y: '0%',
          duration: 1.0,
          stagger: 0.025,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      splitRevealAnimations.push(anim);
    });

    // Scroll reveal animations for elements
    const reveals = gsap.utils.toArray<HTMLElement>('.reveal-on-scroll');
    const revealTriggers: any[] = [];
    reveals.forEach((el) => {
      const anim = gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
      revealTriggers.push(anim);
    });

    // Cleanup all triggers on unmount
    return () => {
      mainTrigger.kill();
      heroTrigger.kill();
      workTrigger.kill();
      cardTriggers.forEach((t) => t.kill());
      aboutTrigger.kill();
      contactTrigger.kill();
      splitRevealAnimations.forEach((anim) => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      });
      revealTriggers.forEach((anim) => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      });
    };
  }, [
    isLoaded,
    setActiveSection,
    setTargetPosition,
    setTargetScale,
    setTargetRotationSpeed,
    setMaterialTargets,
  ]);
}
