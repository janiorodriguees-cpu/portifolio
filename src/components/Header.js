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
  // (no mesmo lugar, uma ação só, como em robin-noguier.com) e sempre leva ao topo
  // da home. Dos cases a cortina sobe sem rótulo; do Sobre/Contato mostra "Início".
  const inCase = pathname.startsWith('/casos/');
  const back = pathname === '/' ? null : { href: '/', text: inCase ? '' : 'Início' };

  return (
    <header className="hdr" ref={el}>
      {back ? (
        <TLink href={back.href} text={back.text} className="back" aria-label="Voltar para o início">
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
