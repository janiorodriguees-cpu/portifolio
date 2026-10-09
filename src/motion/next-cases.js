// Troca do case mostrado no fim da página de case (seta "ver outro").
// O título atual sobe e sai pela máscara; depois o novo entra de baixo.
// A cor de fundo muda por transição de CSS (background-color).

export function swapOut(gsap, el) {
  return new Promise((resolve) => {
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return resolve();
    gsap.to(el, { yPercent: -115, duration: 0.45, ease: 'power3.in', onComplete: resolve });
    setTimeout(resolve, 700); // segurança: troca mesmo se a animação não terminar (aba em segundo plano)
  });
}

export function swapIn(gsap, el) {
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.fromTo(el, { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: 'power4.out' });
}
