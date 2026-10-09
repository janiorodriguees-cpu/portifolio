'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/motion/setup';
import { createMenu } from '@/motion/menu';
import TLink from './TLink';
import ContactButtons from './ContactButtons';
import { site } from '@/data/site';

const ITEMS = [
  { href: '/#trabalhos', path: '/', label: 'Trabalhos', text: 'Trabalhos' },
  { href: '/sobre/', path: '/sobre', label: 'Sobre', text: 'Sobre' },
  { href: '/contato/', path: '/contato', label: 'Contato', text: 'Contato' },
];

// Menu de tela cheia do celular. A animação fica em src/motion/menu.js.
// `button` é o botão de três traços (o círculo nasce e volta para ele).
export default function MobileMenu({ open, onClose, button, pathname }) {
  const el = useRef(null);
  const menu = useRef(null);
  const navigating = useRef(false);
  const first = useRef(true);

  useEffect(() => {
    menu.current = createMenu(gsap, el.current);
    return () => menu.current?.destroy();
  }, []);

  // abre/fecha conforme o estado do cabeçalho
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const root = document.documentElement;
    if (open) {
      root.classList.add('menu-open');
      menu.current?.open(button.current);
      const t = setTimeout(() => el.current?.querySelector('a')?.focus({ preventScroll: true }), 500);
      return () => clearTimeout(t);
    }
    root.classList.remove('menu-open');
    if (navigating.current) return; // a cortina de transição está cobrindo: some ao trocar de página
    menu.current?.close(button.current);
    button.current?.focus({ preventScroll: true });
  }, [open, button]);

  // trocou de página por baixo da cortina: o menu some sem animação
  useEffect(() => {
    if (!navigating.current) return;
    navigating.current = false;
    menu.current?.hide();
  }, [pathname]);

  // Esc fecha
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onItem = (item) => {
    // mesma página (ex.: Trabalhos estando na home): fecha com animação e rola
    // outra página: a cortina sobe por cima do menu, que some quando a rota troca
    navigating.current = item.path !== pathname;
    onClose();
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="mmenu" id="menu-celular" ref={el} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
      <nav className="mmenu__nav" aria-label="Principal">
        <ol>
          {ITEMS.map((item, i) => {
            const current = item.path === pathname && item.path !== '/';
            return (
              <li key={item.href}>
                <TLink
                  href={item.href}
                  text={item.text}
                  className="mmenu__link"
                  aria-current={current ? 'page' : undefined}
                  tabIndex={open ? 0 : -1}
                  onClick={() => onItem(item)}
                >
                  <span className="mmenu__n">{pad(i + 1)}</span>
                  <span className="mask">
                    <span data-menu-in>
                      {item.label}
                      {current && <span className="mmenu__dot" aria-hidden="true" />}
                    </span>
                  </span>
                </TLink>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="mmenu__foot">
        <p className="mmenu__status" data-menu-fade>
          <span className="foot__dot" aria-hidden="true" />
          {site.status}
        </p>
        <div data-menu-fade>
          <ContactButtons />
        </div>
      </div>
    </div>
  );
}
