// Reel de abertura da home.
//
// Uma linha do tempo (GSAP) que toca sozinha e PARA assim que a pessoa interage
// (mouse, scroll, teclado, toque). Depois da pausa dá para retomar, rever ou
// pular direto para uma cena pelos segmentos da barra.
//
// O módulo recebe `gsap` por parâmetro (sem importar o pacote) para rodar tanto
// no Next.js quanto no protótipo em HTML simples.

import { onReady } from './ready';

const TEXT = {
  wait: 'Reel',
  playing: 'Reel em andamento',
  paused: 'Pausado · role para explorar',
  done: 'Fim do reel · role para explorar',
};
const TEXT_HINT = {
  mouse: ' · mexa o mouse para pausar',
  touch: ' · toque para pausar',
};
const BUTTON = { wait: 'Pausar', playing: 'Pausar', paused: 'Retomar', done: 'Rever' };

// Quando cada cena começa na linha do tempo (segundos).
const STARTS = [0, 3.2, 6.8, 11.6, 16.0];
// Em que ponto de cada cena o conteúdo já está todo visível (para pular de cena).
const SHOW_AT = [2.6, 2.9, 4.75, 4.35, 2.4];
const WIPE = 0.9; // duração da cortina que troca de cena
const CONTENT_DELAY = 0.45; // o texto entra depois que a cortina já subiu um pouco
const MOVE_THRESHOLD = 60; // px de movimento do mouse para contar como interação

export function createReel(gsap, root) {
  const q = (sel, ctx = root) => Array.from(ctx.querySelectorAll(sel));
  const stage = root.querySelector('.reel__stage');
  const scenes = q('[data-scene]', stage);
  const subs = q('[data-sub]', stage);
  const segs = q('[data-seg]');
  const statusEl = root.querySelector('[data-status]');
  const toggleBtn = root.querySelector('[data-toggle]');
  const barEl = root.querySelector('[data-reel-bar]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(hover: none)').matches;
  const clamp = (n) => Math.min(1, Math.max(0, n));
  const inside = (el) => q('[data-in]', el);

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
      duration: 1.5,
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
    const at = STARTS[3] + k * 1.45;
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
  let strict = false; // depois de "Retomar", só clique/scroll/tecla/toque pausam (mouse parado não)
  let moved = 0;
  let lastX = null;
  let lastY = null;
  let startTimer = null;
  let lastScene = -1;
  let lastBar = '';
  let destroyed = false;
  let stopReady = () => {};

  function setMode(next) {
    mode = next;
    root.dataset.mode = next;
    if (statusEl) {
      statusEl.textContent =
        next === 'playing' ? TEXT.playing + (touch ? TEXT_HINT.touch : TEXT_HINT.mouse) : TEXT[next];
    }
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
        if (t >= STARTS[3] + k * 1.45 + 0.5) active = sub;
      });
    } else if (t < STARTS[i] + 0.5 && i > 0) {
      active = i === 4 ? subs[subs.length - 1] : scenes[i - 1];
    }
    const color = getComputedStyle(active).color;
    if (color !== lastBar) {
      lastBar = color;
      root.style.setProperty('--bar-fg', color);
    }
    lastScene = i;
  }
  tl.eventCallback('onUpdate', sync);
  tl.eventCallback('onComplete', () => {
    if (!destroyed) setMode('done');
  });

  function play() {
    if (mode === 'done') tl.restart();
    else tl.play();
    setMode('playing');
  }
  function pause() {
    if (mode === 'wait') {
      clearTimeout(startTimer);
      setMode('paused');
      return;
    }
    if (mode !== 'playing') return;
    tl.pause();
    setMode('paused');
  }
  function seekScene(i) {
    clearTimeout(startTimer);
    const t = Math.min(STARTS[i] + SHOW_AT[i], tl.duration());
    tl.pause(t, false); // false: dispara os onUpdate no salto (senão o contador "10" fica parado em 0)
    setMode(i === segs.length - 1 && t >= tl.duration() - 0.01 ? 'done' : 'paused');
    sync();
  }

  // ---------------------------------------------------------- interações
  const fromBar = (e) => barEl && e.target instanceof Node && barEl.contains(e.target);
  const onMove = (e) => {
    if (strict || mode === 'paused' || mode === 'done' || fromBar(e)) return;
    if (lastX !== null) moved += Math.hypot(e.clientX - lastX, e.clientY - lastY);
    lastX = e.clientX;
    lastY = e.clientY;
    if (moved > MOVE_THRESHOLD) pause();
  };
  const onHard = (e) => {
    if (fromBar(e)) return;
    pause();
  };
  const onKey = (e) => {
    if (['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) return;
    if (fromBar(e)) return;
    pause();
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onHard, { passive: true });
  window.addEventListener('wheel', onHard, { passive: true });
  window.addEventListener('touchstart', onHard, { passive: true });
  window.addEventListener('keydown', onKey);

  const onToggle = () => {
    if (mode === 'playing') pause();
    else {
      strict = true;
      play();
    }
  };
  toggleBtn?.addEventListener('click', onToggle);
  const segHandlers = segs.map((seg, i) => {
    const h = () => seekScene(i);
    seg.addEventListener('click', h);
    return h;
  });

  // pausa quando a aba some ou o reel sai da tela (economiza processamento)
  const onVisibility = () => {
    if (document.hidden) pause();
  };
  document.addEventListener('visibilitychange', onVisibility);
  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting && mode === 'playing') pause();
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
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onHard);
      window.removeEventListener('wheel', onHard);
      window.removeEventListener('touchstart', onHard);
      window.removeEventListener('keydown', onKey);
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
