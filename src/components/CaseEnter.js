'use client';

import { useEffect } from 'react';
import { gsap } from '@/motion/setup';

// Entrada do conteúdo da página de case (título sobe, ficha aparece).
// Se a página chegou por baixo da cortina, espera ela abrir.
export default function CaseEnter() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const delay = document.documentElement.dataset.curtain === 'on' ? 0.7 : 0.15;
    const ctx = gsap.context(() => {
      gsap.from('[data-case-in]', {
        yPercent: 115,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.1,
        delay,
      });
      gsap.from('[data-case-fade]', {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        delay: delay + 0.35,
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
