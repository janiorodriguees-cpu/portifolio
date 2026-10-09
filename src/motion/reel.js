// Reel de abertura da home.
//
// Uma linha do tempo (GSAP) que toca sozinha até o fim. Só pausa quando a pessoa
// pede (botão "Pausar" ou clique num segmento para ir a uma cena). Se o reel sai da
// tela (rolagem) ou a aba fica em segundo plano, pausa sozinho e continua ao voltar;
// se foi a pessoa quem pausou, continua pausado.
//
// O módulo recebe `gsap` por parâmetro (sem importar o pacote) para rodar tanto
// no Next.js quanto no protótipo em HTML simples.

import { onReady } from './ready';

const BUTTON = { wait: 'Pausar', playing: 'Pausar', paused: 'Retomar', done: 'Rever' };

// Duração de cada cena (segundos). A dos cases depende de quantos cases existem:
// cada um fica SUB_STEP segundos na tela.
const DUR = { hello: 3.2, years: 5.6, skills: 4.8 };
const SUB_STEP = 2.6;
// Em que ponto de cada cena o conteúdo já está todo visível (para pular de cena).
// Na cena dos cases, pular leva ao primeiro case já visível.
const SHOW_AT = [2.6, 2.9, 4.75, 1.9, 2.4];
const WIPE = 0.9; // duração da cortina que troca de cena
const CONTENT_DELAY = 0.45; // o texto entra depois que a cortina já subiu um pouco

export function createReel(gsap, root) {
  const q = (sel, ctx = root) => Array.from(ctx.querySelectorAll(sel));
  const stage = root.querySelector('.reel__stage');
  const scenes = q('[data-scene]', stage);
  const subs = q('[data-sub]', stage);
  const segs = q('[data-seg]');
  const statusEl = root.querySelector('[data-status]');
  const toggleBtn = root.querySelector('[data-toggle]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n) => Math.min(1, Math.max(0, n));
  const inside = (el) => q('[data-in]', el);

  // quando cada cena começa na linha do tempo
  const STARTS = [0, DUR.hello, DUR.hello + DUR.years, DUR.hello + DUR.years + DUR.skills];
  STARTS.push(STARTS[3] + Math.max(1, subs.length) * SUB_STEP + 0.3);

  const tl = gsap.timeline({ paused: true });
  const wipe = (el, at) =>
    tl.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: WIPE, ease: 'power4.inOut' },
      at
    );
  const rise = (els, at, extra = {}) =>
    tl.fromTo(
      els,
      { yPercent: 115, opacity: 1 },
      { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.09, ...extra },
      at
    );

  // Cena 1 · Olá
  rise(q('.hello [data-in]', scenes[0]), 0.2, { stagger: 0.1 });
  rise(q('.scene__lead [data-in]', scenes[0]), 0.75, { stagger: 0.12, duration: 0.9 });

  // Cena 2 · anos de experiência
  wipe(scenes[1], STARTS[1]);
  rise(inside(scenes[1]), STARTS[1] + CONTENT_DELAY, { stagger: 0.14 });
  const counter = { v: 0 };
  const countEl = scenes[1].querySelector('[data-count]');
  const countTo = Number(countEl.getAttribute('data-count')) || 10;
  tl.fromTo(
    counter,
    { v: 0 },
    {
      v: countTo,
      duration: 2.2, // contagem mais lenta, acompanha a cena mais longa
      ease: 'power2.out',
      onUpdate: () => {
        countEl.textContent = String(Math.round(counter.v));
      },
    },
    STARTS[1] + CONTENT_DELAY + 0.1
  );

  // Cena 3 · o que eu faço (lista que se acende linha a linha)
  wipe(scenes[2], STARTS[2]);
  rise(q('.kicker [data-in]', scenes[2]), STARTS[2] + CONTENT_DELAY);
  const skills = q('.skills li', scenes[2]);
  skills.forEach((li, k) => {
    const at = STARTS[2] + 0.9 + k * 0.5;
    rise(inside(li), at, { duration: 0.8 });
    if (k > 0) tl.to(skills[k - 1], { opacity: 0.2, duration: 0.45, ease: 'power2.out' }, at);
  });

  // Cena 4 · cases, um painel colorido por vez
  subs.forEach((sub, k) => {
    const at = STARTS[3] + k * SUB_STEP;
    wipe(sub, at);
    rise(inside(sub), at + CONTENT_DELAY, { stagger: 0.1 });
  });

  // Cena 5 · fechamento (é também a versão estática para quem prefere menos movimento)
  wipe(scenes[4], STARTS[4]);
  rise(inside(scenes[4]), STARTS[4] + CONTENT_DELAY, { stagger: 0.12 });
  tl.fromTo(
    q('[data-fade]', scenes[4]),
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
    STARTS[4] + CONTENT_DELAY + 0.6
  );

  // ---------------------------------------------------------------- estado
  let mode = 'wait';
  let autoPaused = false; // pausado pelo próprio reel (fora da tela / aba oculta), não pela pessoa
  let startTimer = null;
  let lastScene = -1;
  let lastBar = '';
  let destroyed = false;
  let stopReady = () => {};

  // barra: só a cena atual, curta o bastante para nunca cortar ("02 / 05 · Experiência")
  const pad = (n) => String(n).padStart(2, '0');
  function setStatus(i) {
    if (!statusEl) return;
    const label = segs[i]?.dataset.label || '';
    statusEl.textContent = pad(i + 1) + ' / ' + pad(segs.length) + (label ? ' · ' + label : '');
  }

  function setMode(next) {
    mode = next;
    root.dataset.mode = next;
    if (toggleBtn) toggleBtn.textContent = BUTTON[next] || 'Pausar';
  }

  function sceneAt(t) {
    let i = 0;
    STARTS.forEach((s, k) => {
      if (t >= s - 0.001) i = k;
    });
    return i;
  }

  function sync() {
    const t = tl.time();
    const i = sceneAt(t);
    const total = tl.duration();
    segs.forEach((seg, k) => {
      const a = STARTS[k];
      const b = STARTS[k + 1] ?? total;
      const f = k < i ? 1 : k > i ? 0 : clamp((t - a) / (b - a));
      seg.firstElementChild.style.transform = 'scaleX(' + f + ')';
      seg.setAttribute('aria-current', k === i ? 'step' : 'false');
    });
    // a barra usa a cor de texto da cena que está por cima
    let active = scenes[i];
    if (i === 3) {
      active = subs[0];
      subs.forEach((sub, k) => {
        if (t >= STARTS[3] + k * SUB_STEP + 0.5) active = sub;
      });
    } else if (t < STARTS[i] + 0.5 && i > 0) {
      active = i === 4 ? subs[subs.length - 1] : scenes[i - 1];
    }
    const color = getComputedStyle(active).color;
    if (color !== lastBar) {
      lastBar = color;
      root.style.setProperty('--bar-fg', color);
    }
    if (i !== lastScene) setStatus(i);
    lastScene = i;
  }
  tl.eventCallback('onUpdate', sync);
  tl.eventCallback('onComplete', () => {
    if (!destroyed) setMode('done');
  });

  function play() {
    autoPaused = false;
    if (mode === 'done') tl.restart();
    else tl.play();
    setMode('playing');
  }
  // auto = pausa feita pelo reel (fora da tela / aba oculta): ele mesmo retoma depois
  function pause(auto = false) {
    if (mode !== 'playing') return;
    tl.pause();
    autoPaused = auto;
    setMode('paused');
  }
  function seekScene(i) {
    clearTimeout(startTimer);
    autoPaused = false;
    const t = Math.min(STARTS[i] + SHOW_AT[i], tl.duration());
    tl.pause(t, false); // false: dispara os onUpdate no salto (senão o contador "10" fica parado em 0)
    setMode(i === segs.length - 1 && t >= tl.duration() - 0.01 ? 'done' : 'paused');
    sync();
  }

  // ---------------------------------------------------------- interações
  const onToggle = () => {
    if (mode === 'playing') pause();
    else if (mode !== 'wait') play();
  };
  toggleBtn?.addEventListener('click', onToggle);
  const segHandlers = segs.map((seg, i) => {
    const h = () => seekScene(i);
    seg.addEventListener('click', h);
    return h;
  });

  // pausa sozinho quando a aba some ou o reel sai da tela, e retoma ao voltar
  // (só se a pausa foi dele; se a pessoa pausou, respeita)
  let inView = true;
  const resumeIfAuto = () => {
    if (autoPaused && mode === 'paused' && inView && !document.hidden) play();
  };
  const onVisibility = () => {
    if (document.hidden) pause(true);
    else resumeIfAuto();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            if (!inView) pause(true);
            else resumeIfAuto();
          },
          { threshold: 0.15 }
        )
      : null;
  io?.observe(root);

  // ------------------------------------------------------------- partida
  if (reduced) {
    tl.progress(1);
    root.dataset.mode = 'static';
    sync();
  } else {
    setMode('wait');
    setStatus(0);
    sync();
    // começa quando a cortina de abertura abre (site pronto), junto com o cabeçalho
    stopReady = onReady(() => {
      if (destroyed) return;
      startTimer = setTimeout(() => {
        if (mode === 'wait' && !destroyed) play();
      }, 250);
    });
  }

  return {
    pause,
    play,
    destroy() {
      destroyed = true;
      stopReady();
      clearTimeout(startTimer);
      tl.kill();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      toggleBtn?.removeEventListener('click', onToggle);
      segs.forEach((seg, i) => seg.removeEventListener('click', segHandlers[i]));
    },
    get mode() {
      return mode;
    },
    timeline: tl,
  };
}
