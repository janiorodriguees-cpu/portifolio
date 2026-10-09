// A "série" de cases na home: um painel de tela cheia por case, cada um com a sua
// cor, título gigante que sobe ao entrar, imagem inclinada com parallax e um
// índice vertical à direita que acompanha o scroll.

export function initSeries(gsap, ScrollTrigger, root, indexEl) {
  const panels = Array.from(root.querySelectorAll('[data-panel]'));
  const dots = indexEl ? Array.from(indexEl.querySelectorAll('button')) : [];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setActive = (i) => {
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
  };

  const goto = dots.map((d, i) => {
    const h = () => panels[i]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    d.addEventListener('click', h);
    return h;
  });

  // Luz no hover da imagem: o ponto de luz segue o mouse e a imagem inclina de leve
  // na direção dele. Só escreve variáveis CSS; a transição fica no CSS (.media__fx).
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hovers = canHover
    ? panels
        .map((panel) => panel.querySelector('[data-media]'))
        .filter((media) => media && media.querySelector('.media__fx'))
        .map((media) => {
          const fx = media.querySelector('.media__fx');
          const move = (e) => {
            const r = media.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            fx.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
            fx.style.setProperty('--my', (y * 100).toFixed(1) + '%');
            if (!reduced) {
              fx.style.setProperty('--ry', ((x - 0.5) * 7).toFixed(2) + 'deg');
              fx.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
            }
          };
          const enter = (e) => {
            move(e);
            media.classList.add('is-hover');
          };
          const leave = () => {
            media.classList.remove('is-hover');
            fx.style.setProperty('--rx', '0deg');
            fx.style.setProperty('--ry', '0deg');
          };
          media.addEventListener('pointerenter', enter);
          media.addEventListener('pointermove', move);
          media.addEventListener('pointerleave', leave);
          return () => {
            media.removeEventListener('pointerenter', enter);
            media.removeEventListener('pointermove', move);
            media.removeEventListener('pointerleave', leave);
          };
        })
    : [];

  const ctx = gsap.context(() => {
    panels.forEach((panel, i) => {
      if (!reduced) {
        const lines = panel.querySelectorAll('[data-in]');
        if (lines.length) {
          gsap.from(lines, {
            yPercent: 115,
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.09,
            scrollTrigger: { trigger: panel, start: 'top 62%', once: true },
          });
        }
        const media = panel.querySelector('[data-media]');
        const inner = panel.querySelector('[data-media-in]');
        const scrub = { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true };
        if (media) {
          gsap.fromTo(media, { yPercent: 9, rotate: -2 }, { yPercent: -9, rotate: -6, ease: 'none', scrollTrigger: scrub });
        }
        if (inner) {
          gsap.fromTo(inner, { yPercent: -9 }, { yPercent: 9, ease: 'none', scrollTrigger: scrub });
        }
      }
      ScrollTrigger.create({
        trigger: panel,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      });
    });

    if (indexEl) {
      ScrollTrigger.create({
        trigger: root,
        start: 'top 70%',
        end: 'bottom 30%',
        onToggle: (self) => indexEl.classList.toggle('is-on', self.isActive),
      });
    }
  }, root);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  return {
    destroy() {
      ctx.revert();
      hovers.forEach((off) => off());
      dots.forEach((d, i) => d.removeEventListener('click', goto[i]));
    },
  };
}
