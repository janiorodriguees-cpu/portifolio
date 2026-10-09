'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import TLink from './TLink';
import { watchHeaderTheme } from '@/motion/header-theme';
import { watchHeaderScroll } from '@/motion/header-scroll';
import { site } from '@/data/site';

export default function Header() {
  const pathname = (usePathname() || '/').replace(/\/$/, '') || '/';

  const el = useRef(null);

  useEffect(() => watchHeaderTheme(), []);
  useEffect(() => watchHeaderScroll(el.current), []);

  // Páginas internas ganham um "Voltar" visível (no celular ele ocupa o lugar do nome).
  // Dos cases volta para a lista de trabalhos; do Sobre, para o início.
  const inCase = pathname.startsWith('/casos/');
  const back = pathname === '/' ? null : inCase ? { href: '/#trabalhos', text: 'Trabalhos' } : { href: '/', text: 'Início' };

  return (
    <header className="hdr" ref={el}>
      <div className="hdr__left">
        <TLink href="/" className="brand" aria-label={`${site.name}, início`}>
          {site.name}
        </TLink>
        {back && (
          <TLink href={back.href} text={back.text} className="back">
            <span className="arrow" aria-hidden="true">
              ←
            </span>{' '}
            Voltar
          </TLink>
        )}
      </div>
      <nav aria-label="Principal">
        <TLink href="/#trabalhos">Trabalhos</TLink>
        <TLink href="/sobre/" aria-current={pathname === '/sobre' ? 'page' : undefined}>
          Sobre
        </TLink>
        <a href={`mailto:${site.email}`}>Contato</a>
      </nav>
    </header>
  );
}
