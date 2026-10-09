'use client';

import Link from 'next/link';
import { useNav } from './nav-context';

// Link interno que usa a transição de cortina. Aceita `color`, `on` e `text`
// (cor da cortina, cor do texto e o rótulo mostrado enquanto ela cobre a tela).
export default function TLink({ href, color, on, text, onClick, children, ...rest }) {
  const nav = useNav();

  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;
    e.preventDefault();
    nav.go(href, { color, on, text });
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
