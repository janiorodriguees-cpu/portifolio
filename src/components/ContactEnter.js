'use client';

import { useEffect } from 'react';
import { gsap } from '@/motion/setup';
import { onReady } from '@/motion/ready';

// Entrada da página de contato: o título chega com as letras se juntando (mesma
// linguagem do Sobre) e o resto aparece em seguida. Espera a cortina abrir.
export default function ContactEnter() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {});
    const stopReady = onReady(() =>
      ctx.add(() => {
        const delay = document.documentElement.dataset.curtain === 'on' ? 0.75 : 0.35;
        gsap.fromTo(
          '.contact [data-in]',
          { yPercent: 115, letterSpacing: '0.25em', opacity: 1 },
          { yPercent: 0, letterSpacing: '-0.025em', opacity: 1, duration: 1.3, ease: 'power4.out', stagger: 0.1, delay }
        );
        gsap.fromTo(
          '.contact [data-fade]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: delay + 0.5 }
        );
      })
    );
    return () => {
      stopReady();
      ctx.revert();
    };
  }, []);

  return null;
}
