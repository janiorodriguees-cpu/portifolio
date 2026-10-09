// Cortina de transição entre páginas.
//
// Duas linguagens, conforme o destino:
// - "up" (cases): a cortina com a cor do case sobe cobrindo a tela (com o nome do
//   case), a rota muda por baixo dela e a cortina continua subindo e sai pelo topo.
//   É a mesma linguagem da troca de cenas do reel.
// - "left" / "right" (Sobre): a cortina atravessa a tela na horizontal e o rótulo
//   chega com as letras afastadas que vão se juntando (referência: robin-noguier.com).
//   "left" = entra pela direita e sai pela esquerda (ir para o Sobre);
//   "right" = o caminho de volta.

const SHAPES = {
  up: {
    hidden: 'inset(100% 0% 0% 0%)',
    gone: 'inset(0% 0% 100% 0%)',
  },
  left: {
    hidden: 'inset(0% 0% 0% 100%)',
    gone: 'inset(0% 100% 0% 0%)',
  },
  right: {
    hidden: 'inset(0% 100% 0% 0%)',
    gone: 'inset(0% 0% 0% 100%)',
  },
};
const FULL = 'inset(0% 0% 0% 0%)';

export function createCurtain(gsap, el) {
  const label = el.querySelector('[data-curtain-label]');
  let covered = false;
  let dir = 'up';

  gsap.set(el, { clipPath: SHAPES.up.hidden, visibility: 'hidden' });

  function cover({ color, on, text, direction = 'up' } = {}) {
    dir = SHAPES[direction] ? direction : 'up';
    const shape = SHAPES[dir];
    const side = dir !== 'up';
    return new Promise((resolve) => {
      if (color) el.style.setProperty('--curtain', color);
      else el.style.removeProperty('--curtain');
      if (on) el.style.setProperty('--curtain-on', on);
      else el.style.removeProperty('--curtain-on');
      label.textContent = text || '';
      document.documentElement.dataset.curtain = 'on';
      gsap.set(el, { clipPath: shape.hidden, visibility: 'visible', pointerEvents: 'auto' });
      if (side) gsap.set(label, { yPercent: 0, xPercent: dir === 'left' ? 30 : -30, opacity: 0, letterSpacing: '0.4em' });
      else gsap.set(label, { yPercent: 115, xPercent: 0, opacity: 1, letterSpacing: '' });

      const tl = gsap.timeline({
        onComplete: () => {
          covered = true;
          resolve();
        },
      });
      tl.to(el, { clipPath: FULL, duration: side ? 0.8 : 0.85, ease: 'power4.inOut' });
      if (side) {
        tl.to(
          label,
          { xPercent: 0, opacity: 1, letterSpacing: '-0.025em', duration: 0.9, ease: 'power4.out' },
          '-=0.45'
        );
      } else {
        tl.to(label, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, '-=0.4');
      }
    });
  }

  function reveal() {
    if (!covered) return Promise.resolve();
    const shape = SHAPES[dir];
    const side = dir !== 'up';
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          covered = false;
          gsap.set(el, { visibility: 'hidden', pointerEvents: 'none', clipPath: SHAPES.up.hidden });
          gsap.set(label, { clearProps: 'letterSpacing,opacity,xPercent' });
          delete document.documentElement.dataset.curtain;
          resolve();
        },
      });
      if (side) {
        tl.to(label, { xPercent: dir === 'left' ? -30 : 30, opacity: 0, duration: 0.5, ease: 'power3.in' });
      } else {
        tl.to(label, { yPercent: -115, duration: 0.5, ease: 'power3.in' });
      }
      tl.to(el, { clipPath: shape.gone, duration: 0.9, ease: 'power4.inOut' }, '-=0.2');
    });
  }

  // Abertura do site (carregamento ou atualização da página): a cortina já está
  // cobrindo a tela (classe is-loading), o nome sobe, segura um instante e a cortina
  // sai pelo topo. `onOpen` é chamado quando ela começa a abrir.
  function intro({ text, onOpen } = {}) {
    label.textContent = text || '';
    covered = true;
    dir = 'up';
    gsap.set(el, { clipPath: FULL, visibility: 'visible', pointerEvents: 'auto' });
    gsap.set(label, { yPercent: 115, opacity: 1 });
    return gsap
      .timeline()
      .to(label, { yPercent: 0, duration: 0.9, ease: 'power4.out' })
      .add(() => onOpen?.(), '+=0.45')
      .add(() => reveal());
  }

  return {
    cover,
    reveal,
    intro,
    get covered() {
      return covered;
    },
  };
}
