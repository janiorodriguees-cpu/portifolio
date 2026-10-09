'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/motion/setup';
import { createCurtain } from '@/motion/curtain';
import { createCursor } from '@/motion/cursor';
import { NavContext } from './nav-context';
import Header from './Header';

const normalize = (p) => (p.length > 1 ? p.replace(/\/$/, '') : p);

// Estrutura fixa do site: cabeçalho, cortina de transição e cursor.
// Também orquestra a troca de página (cobrir → trocar rota → revelar).
export default function Shell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainEl = useRef(null);
  const cursorEl = useRef(null);
  const curtain = useRef(null);
  const busy = useRef(false);
  const failsafe = useRef(0);

  useEffect(() => {
    curtain.current = createCurtain(gsap, curtainEl.current);
    const stopCursor = createCursor(gsap, cursorEl.current);
    // o cabeçalho só entra junto com o conteúdo (evita o nome aparecer sozinho no carregamento)
    let alive = true;
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 800))]).then(() => {
      if (alive) document.documentElement.classList.add('is-ready');
    });
    return () => {
      alive = false;
      stopCursor();
      curtain.current = null;
    };
  }, []);

  const finish = useCallback(() => {
    const c = curtain.current;
    if (!c) {
      busy.current = false;
      return Promise.resolve();
    }
    return c.reveal().then(() => {
      busy.current = false;
      ScrollTrigger.refresh();
    });
  }, []);

  // Quando a rota muda por baixo da cortina, revela a nova página.
  useEffect(() => {
    if (!busy.current || !curtain.current || !curtain.current.covered) return;
    clearTimeout(failsafe.current);
    if (!window.location.hash) window.scrollTo(0, 0);
    const t = setTimeout(finish, 160);
    return () => clearTimeout(t);
  }, [pathname, finish]);

  const go = useCallback(
    (href, opts = {}) => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const url = new URL(href, window.location.href);

      // mesma página: só rola (para o topo ou para a âncora)
      if (normalize(url.pathname) === normalize(window.location.pathname)) {
        const behavior = reduced ? 'auto' : 'smooth';
        if (url.hash) document.querySelector(url.hash)?.scrollIntoView({ behavior, block: 'start' });
        else window.scrollTo({ top: 0, behavior });
        return;
      }

      if (busy.current) return;
      if (reduced || !curtain.current) {
        router.push(href);
        return;
      }

      // cases: cortina sobe; Sobre: cortina atravessa na horizontal (ida pela direita, volta pela esquerda)
      const to = normalize(url.pathname);
      const from = normalize(window.location.pathname);
      let direction = 'up';
      if (to === '/sobre') direction = 'left';
      else if (from === '/sobre' && !to.startsWith('/casos')) direction = 'right';
      const cover =
        direction === 'up'
          ? { ...opts, direction }
          : { color: opts.color, on: opts.on, text: opts.text ?? (to === '/sobre' ? 'Sobre' : 'Início'), direction };

      busy.current = true;
      curtain.current.cover(cover).then(() => {
        router.push(href);
        // rede de segurança: se a rota não mudar, não deixa a cortina travada
        clearTimeout(failsafe.current);
        failsafe.current = setTimeout(finish, 6000);
      });
    },
    [router, finish]
  );

  const value = useMemo(() => ({ go }), [go]);

  return (
    <NavContext.Provider value={value}>
      <Header />
      {children}
      <div className="curtain" ref={curtainEl} aria-hidden="true">
        <span className="curtain__label">
          <span data-curtain-label />
        </span>
      </div>
      <div className="cursor" ref={cursorEl} aria-hidden="true">
        <span />
      </div>
    </NavContext.Provider>
  );
}
