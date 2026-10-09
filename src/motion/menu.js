// Menu do celular (abre pelo botão de três traços do cabeçalho).
//
// Abrir: o fundo escuro se expande em círculo a partir do próprio botão (como uma
// gota de tinta), e as opções chegam grandes, com as letras afastadas que vão se
// juntando (a mesma assinatura do título do Sobre). Fechar: o caminho inverso, mais
// rápido, com o círculo voltando para dentro do botão.

export function createMenu(gsap, el) {
  const items = Array.from(el.querySelectorAll('[data-menu-in]'));
  const extras = Array.from(el.querySelectorAll('[data-menu-fade]'));
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tl = null;

  // raio que cobre a tela inteira a partir do ponto (x, y)
  const cover = (x, y) => Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 20;

  function open(origin) {
    const r = origin?.getBoundingClientRect();
    const x = r ? r.left + r.width / 2 : innerWidth - 32;
    const y = r ? r.top + r.height / 2 : 32;
    tl?.kill();
    gsap.set(el, { visibility: 'visible', pointerEvents: 'auto' });
    if (reduced()) {
      gsap.set(el, { clipPath: 'none' });
      gsap.set([...items, ...extras], { clearProps: 'all', opacity: 1 });
      return;
    }
    tl = gsap
      .timeline()
      .fromTo(
        el,
        { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${cover(x, y)}px at ${x}px ${y}px)`, duration: 0.9, ease: 'power4.inOut' }
      )
      .fromTo(
        items,
        { yPercent: 115, letterSpacing: '0.3em', opacity: 1 },
        { yPercent: 0, letterSpacing: '-0.025em', duration: 1.1, ease: 'power4.out', stagger: 0.08 },
        0.35
      )
      .fromTo(extras, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 }, 0.7);
  }

  function close(origin) {
    return new Promise((resolve) => {
      const done = () => {
        gsap.set(el, { visibility: 'hidden', pointerEvents: 'none' });
        resolve();
      };
      tl?.kill();
      if (reduced()) return done();
      const r = origin?.getBoundingClientRect();
      const x = r ? r.left + r.width / 2 : innerWidth - 32;
      const y = r ? r.top + r.height / 2 : 32;
      tl = gsap
        .timeline({ onComplete: done })
        .to([...extras].reverse(), { autoAlpha: 0, y: 8, duration: 0.25, ease: 'power2.in' }, 0)
        .to([...items].reverse(), { yPercent: -115, duration: 0.4, ease: 'power3.in', stagger: 0.04 }, 0)
        .to(el, { clipPath: `circle(0px at ${x}px ${y}px)`, duration: 0.7, ease: 'power4.inOut' }, 0.2);
    });
  }

  // fechar sem animação (troca de página: a cortina já está cobrindo)
  function hide() {
    tl?.kill();
    gsap.set(el, { visibility: 'hidden', pointerEvents: 'none' });
  }

  return { open, close, hide, destroy: () => tl?.kill() };
}
