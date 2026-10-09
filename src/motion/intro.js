// Abertura da página Sobre (foto + "Prazer, eu sou o Janio."), na linha do
// "Bonjour, I'm Robin" de robin-noguier.com: o título chega com as letras afastadas
// que vão se juntando, a foto se revela de baixo para cima e depois acompanha a
// rolagem com um parallax leve. Espera a cortina (de abertura ou de transição) abrir.

import { onReady } from './ready';

export function initIntro(gsap, ScrollTrigger, root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return { destroy() {} };

  const ctx = gsap.context(() => {}, root);
  const stopReady = onReady(() => ctx.add(() => {
    const delay = document.documentElement.dataset.curtain === 'on' ? 0.75 : 0.35;
    const photo = root.querySelector('[data-photo]');
    const inner = root.querySelector('[data-photo-in]');

    gsap.fromTo(
      root.querySelectorAll('[data-in]'),
      { yPercent: 115, letterSpacing: '0.25em', opacity: 1 },
      { yPercent: 0, letterSpacing: '-0.025em', opacity: 1, duration: 1.3, ease: 'power4.out', stagger: 0.1, delay }
    );
    gsap.fromTo(root.querySelectorAll('[data-fade]'), { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      delay: delay + 0.55,
    });
    if (photo) {
      gsap.fromTo(
        photo,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', delay }
      );
    }
    if (inner) {
      gsap.fromTo(
        inner,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        }
      );
    }
  }));

  return {
    destroy() {
      stopReady();
      ctx.revert();
    },
  };
}
