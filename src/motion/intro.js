// Apresentação da home (foto + "Prazer, eu sou o Janio."), na linha do "Bonjour, I'm Robin"
// de robin-noguier.com: o título sobe linha a linha, a foto se revela de baixo para cima
// e depois acompanha a rolagem com um parallax leve.

export function initIntro(gsap, ScrollTrigger, root) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return { destroy() {} };

  const ctx = gsap.context(() => {
    const start = { trigger: root, start: 'top 65%', once: true };
    const photo = root.querySelector('[data-photo]');
    const inner = root.querySelector('[data-photo-in]');

    gsap.from(root.querySelectorAll('[data-in]'), {
      yPercent: 115,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.1,
      scrollTrigger: start,
    });
    gsap.from(root.querySelectorAll('[data-fade]'), {
      autoAlpha: 0,
      y: 24,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.45,
      scrollTrigger: start,
    });
    if (photo) {
      gsap.fromTo(
        photo,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut', scrollTrigger: start }
      );
    }
    if (inner) {
      gsap.fromTo(
        inner,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      );
    }
  }, root);

  return {
    destroy() {
      ctx.revert();
    },
  };
}
