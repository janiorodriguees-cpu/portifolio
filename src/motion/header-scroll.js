// Esconde o cabeçalho ao rolar para baixo e mostra de novo ao rolar para cima
// (como em aaronrudyk.com). Perto do topo ele fica sempre visível.

const TOP = 120; // px a partir do topo em que o cabeçalho pode sumir
const DELTA = 6; // ignora tremidas pequenas de rolagem

export function watchHeaderScroll(el) {
  let lastY = window.scrollY;
  let hidden = false;
  let raf = 0;

  const set = (next) => {
    if (next === hidden) return;
    hidden = next;
    el.classList.toggle('is-hidden', next);
  };

  function read() {
    raf = 0;
    const y = window.scrollY;
    // durante a troca de página (cortina) não mexe no cabeçalho
    if (document.documentElement.dataset.curtain === 'on') {
      lastY = y;
      return;
    }
    if (y < TOP) set(false);
    else if (y - lastY > DELTA) set(true);
    else if (lastY - y > DELTA) set(false);
    else return;
    lastY = y;
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(read);
  };
  // ao focar um link com o teclado, o cabeçalho volta
  const onFocus = () => set(false);

  window.addEventListener('scroll', schedule, { passive: true });
  el.addEventListener('focusin', onFocus);

  return () => {
    window.removeEventListener('scroll', schedule);
    el.removeEventListener('focusin', onFocus);
    cancelAnimationFrame(raf);
  };
}
