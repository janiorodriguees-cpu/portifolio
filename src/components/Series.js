'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/motion/setup';
import { initSeries } from '@/motion/series';
import TLink from './TLink';
import CaseName from './CaseName';

const Line = ({ children }) => (
  <span className="mask">
    <span data-in>{children}</span>
  </span>
);

// Série de cases: um painel de tela cheia por case + índice vertical à direita.
export default function Series({ cases }) {
  const root = useRef(null);
  const index = useRef(null);

  useEffect(() => {
    const series = initSeries(gsap, ScrollTrigger, root.current, index.current);
    return () => series.destroy();
  }, []);

  return (
    <>
      <section className="series" id="trabalhos" ref={root} aria-labelledby="trabalhos-titulo">
        <h2 className="sr-only" id="trabalhos-titulo">
          Trabalhos selecionados
        </h2>
        {cases.map((c) => (
          <article className="panel" data-panel key={c.slug} style={{ '--c': c.color, '--on': c.on, '--hl': c.hl }}>
            <div className="panel__txt">
              <p className="panel__meta">
                {c.sector} · {c.year}
              </p>
              <h3 className="panel__title">
                <TLink
                  href={`/casos/${c.slug}/`}
                  color={c.color}
                  on={c.on}
                  text={c.title}
                  data-cursor="Ver case"
                  aria-label={`${c.title}: ${c.label}`}
                >
                  <Line>
                    <CaseName title={c.title} />
                  </Line>
                </TLink>
              </h3>
              <p className="panel__sum">{c.summary}</p>
              <TLink href={`/casos/${c.slug}/`} color={c.color} on={c.on} text={c.title} className="panel__open">
                Abrir case <span className="arrow">→</span>
              </TLink>
            </div>
            <TLink
              href={`/casos/${c.slug}/`}
              color={c.color}
              on={c.on}
              text={c.title}
              className="panel__media"
              data-media
              data-cursor="Ver case"
              aria-hidden="true"
              tabIndex={-1}
            >
              <div className="media" data-media-in>
                {c.cover ? (
                  <div className="media__fx">
                    <img src={c.cover} alt="" loading="lazy" decoding="async" />
                  </div>
                ) : (
                  'Imagem do case'
                )}
              </div>
            </TLink>
          </article>
        ))}
      </section>

      <nav className="sidx" ref={index} aria-label="Índice dos cases">
        {cases.map((c, i) => (
          <button type="button" key={c.slug} aria-current={i === 0 ? 'true' : 'false'}>
            <span>{c.title}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
