// Carrossel de depoimentos (referência: página About de robin-noguier.com).
// Um depoimento por vez; setas e teclado (← →) trocam. A citação que sai sobe e
// some, a que entra vem de baixo. Não troca sozinho: quem lê controla o ritmo.

export function createTestimonials(gsap, root) {
  const slides = Array.from(root.querySelectorAll('[data-quote]'));
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const counter = root.querySelector('[data-counter]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let busy = false;

  const pad = (n) => String(n).padStart(2, '0');
  const update = () => {
    if (counter) counter.textContent = `${pad(index + 1)} / ${pad(slides.length)}`;
    slides.forEach((s, k) => s.setAttribute('aria-hidden', k === index ? 'false' : 'true'));
  };

  gsap.set(slides, { autoAlpha: 0 });
  gsap.set(slides[index], { autoAlpha: 1 });
  update();

  function go(step) {
    if (busy || slides.length < 2) return;
    const from = slides[index];
    index = (index + step + slides.length) % slides.length;
    const to = slides[index];
    update();
    if (reduced) {
      gsap.set(from, { autoAlpha: 0 });
      gsap.set(to, { autoAlpha: 1 });
      return;
    }
    busy = true;
    const dir = step > 0 ? 1 : -1;
    gsap
      .timeline({ onComplete: () => (busy = false) })
      .to(from, { autoAlpha: 0, y: -32 * dir, duration: 0.45, ease: 'power3.in' })
      .fromTo(to, { autoAlpha: 0, y: 40 * dir }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power4.out' }, '-=0.1');
  }

  const onPrev = () => go(-1);
  const onNext = () => go(1);
  const onKey = (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };
  prev?.addEventListener('click', onPrev);
  next?.addEventListener('click', onNext);
  root.addEventListener('keydown', onKey);

  return {
    destroy() {
      prev?.removeEventListener('click', onPrev);
      next?.removeEventListener('click', onNext);
      root.removeEventListener('keydown', onKey);
      gsap.killTweensOf(slides);
    },
  };
}
