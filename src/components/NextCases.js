'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/motion/setup';
import { swapIn, swapOut } from '@/motion/next-cases';
import TLink from './TLink';
import CaseName from './CaseName';

// Fim da página de case: mostra o próximo case. O título abre o case; a seta só
// troca qual case aparece aqui (Case 2 → Case 3 → …), sem sair da página.
// `others` = os outros cases, já na ordem a partir do próximo.
export default function NextCases({ others }) {
  const [index, setIndex] = useState(0);
  const title = useRef(null);
  const busy = useRef(false);
  const first = useRef(true);
  const c = others[index];

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    swapIn(gsap, title.current);
    busy.current = false;
  }, [index]);

  const showNext = async () => {
    if (busy.current || others.length < 2) return;
    busy.current = true;
    await swapOut(gsap, title.current);
    setIndex((i) => (i + 1) % others.length);
    setTimeout(() => (busy.current = false), 300);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section
      className="next"
      style={{ '--c': c.color, '--on': c.on, '--hl': c.hl }}
      aria-label="Outros cases"
    >
      <TLink
        href={`/casos/${c.slug}/`}
        color={c.color}
        on={c.on}
        text={c.title}
        className="next__link"
        data-cursor="Ver case"
      >
        <span className="next__k">{index === 0 ? 'Próximo case' : 'Outro case'}</span>
        <span className="next__t">
          <span className="mask">
            <span ref={title}>
              <CaseName title={c.title} />
            </span>
          </span>
        </span>
        <span className="next__label">{c.label}</span>
      </TLink>

      {others.length > 1 && (
        <div className="next__ctrl">
          <span className="next__count" aria-live="polite">
            {pad(index + 1)} / {pad(others.length)}
          </span>
          <button type="button" className="next__arrow" onClick={showNext} aria-label="Mostrar outro case">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  );
}
