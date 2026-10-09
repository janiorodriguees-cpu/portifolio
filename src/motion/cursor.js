// Cursor que segue o mouse e vira um círculo com rótulo sobre qualquer elemento
// com data-cursor="Texto" (ex.: "Ver case"). Só em dispositivos com mouse.

export function createCursor(gsap, el) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return () => {};

  const label = el.querySelector('span');
  const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

  const onMove = (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
    el.classList.add('is-on');
  };
  const onOver = (e) => {
    const t = e.target instanceof Element ? e.target.closest('[data-cursor]') : null;
    if (t) {
      label.textContent = t.getAttribute('data-cursor');
      el.classList.add('is-label');
    } else {
      el.classList.remove('is-label');
    }
  };
  const onLeave = () => el.classList.remove('is-on');

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver);
  document.documentElement.addEventListener('pointerleave', onLeave);

  return () => {
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.documentElement.removeEventListener('pointerleave', onLeave);
  };
}
