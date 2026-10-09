// Cortina de transição entre páginas.
//
// Ao abrir um case, uma cortina com a cor do case sobe cobrindo a tela (com o
// nome do case), a rota muda por baixo dela e a cortina continua subindo e sai
// pelo topo. A mesma linguagem (cortina subindo) é usada na troca de cenas do reel.

const HIDDEN = 'inset(100% 0% 0% 0%)';
const FULL = 'inset(0% 0% 0% 0%)';
const GONE = 'inset(0% 0% 100% 0%)';

export function createCurtain(gsap, el) {
  const label = el.querySelector('[data-curtain-label]');
  let covered = false;

  gsap.set(el, { clipPath: HIDDEN, visibility: 'hidden' });

  function cover({ color, on, text } = {}) {
    return new Promise((resolve) => {
      if (color) el.style.setProperty('--curtain', color);
      else el.style.removeProperty('--curtain');
      if (on) el.style.setProperty('--curtain-on', on);
      else el.style.removeProperty('--curtain-on');
      label.textContent = text || '';
      document.documentElement.dataset.curtain = 'on';
      gsap.set(el, { clipPath: HIDDEN, visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(label, { yPercent: 115 });
      gsap
        .timeline({
          onComplete: () => {
            covered = true;
            resolve();
          },
        })
        .to(el, { clipPath: FULL, duration: 0.85, ease: 'power4.inOut' })
        .to(label, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, '-=0.4');
    });
  }

  function reveal() {
    if (!covered) return Promise.resolve();
    return new Promise((resolve) => {
      gsap
        .timeline({
          onComplete: () => {
            covered = false;
            gsap.set(el, { visibility: 'hidden', pointerEvents: 'none', clipPath: HIDDEN });
            delete document.documentElement.dataset.curtain;
            resolve();
          },
        })
        .to(label, { yPercent: -115, duration: 0.5, ease: 'power3.in' })
        .to(el, { clipPath: GONE, duration: 0.9, ease: 'power4.inOut' }, '-=0.2');
    });
  }

  return {
    cover,
    reveal,
    get covered() {
      return covered;
    },
  };
}
