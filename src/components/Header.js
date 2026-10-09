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

  return (
    <header className="hdr" ref={el}>
      <TLink href="/" className="brand" aria-label={`${site.name}, início`}>
        {site.name}
      </TLink>
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
