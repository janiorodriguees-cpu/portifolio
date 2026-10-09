// "Site pronto": no primeiro carregamento a cortina de abertura (com o nome) cobre a
// tela; as animações de entrada (reel, Sobre, case) só começam quando ela abre.
// O Shell marca <html class="is-ready"> e dispara o evento 'site:ready'.

export const READY_EVENT = 'site:ready';

export function onReady(cb) {
  if (document.documentElement.classList.contains('is-ready')) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(READY_EVENT, handler);
}

export function markReady() {
  document.documentElement.classList.add('is-ready');
  document.documentElement.classList.remove('is-loading');
  window.dispatchEvent(new Event(READY_EVENT));
}
