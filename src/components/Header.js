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

  // Na home, o canto esquerdo é o nome. Nas páginas internas ele vira "← Voltar"
  // (no mesmo lugar, uma ação só, como em robin-noguier.com): dos cases volta para a
  // lista de trabalhos; do Sobre, para o início.
  const inCase = pathname.startsWith('/casos/');
  const back = pathname === '/' ? null : inCase ? { href: '/#trabalhos', text: 'Trabalhos' } : { href: '/', text: 'Início' };

  return (
    <header className="hdr" ref={el}>
      {back ? (
        <TLink href={back.href} text={back.text} className="back" aria-label={`Voltar para ${back.text.toLowerCase()}`}>
          <span className="arrow" aria-hidden="true">
            ←
          </span>
          Voltar
        </TLink>
      ) : (
        <TLink href="/" className="brand" aria-label={`${site.name}, início`}>
          {site.name}
        </TLink>
      )}
      <nav aria-label="Principal">
        <TLink href="/#trabalhos">Trabalhos</TLink>
        <TLink href="/sobre/" aria-current={pathname === '/sobre' ? 'page' : undefined}>
          Sobre
        </TLink>
        <TLink href="/contato/" aria-current={pathname === '/contato' ? 'page' : undefined}>
          Contato
        </TLink>
      </nav>
    </header>
  );
}
