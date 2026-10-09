'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/motion/setup';
import { initIntro } from '@/motion/intro';
import TLink from './TLink';
import { site } from '@/data/site';

const Line = ({ children }) => (
  <span className="mask">
    <span data-in>{children}</span>
  </span>
);

// Apresentação pessoal na home: foto à esquerda, saudação e resumo à direita
// (grid de 12 colunas: foto nas colunas 2–5, texto nas 7–11).
export default function Intro() {
  const root = useRef(null);

  useEffect(() => {
    const intro = initIntro(gsap, ScrollTrigger, root.current);
    return () => intro.destroy();
  }, []);

  return (
    <section className="intro" ref={root} aria-labelledby="intro-titulo">
      <div className="intro__photo" data-photo>
        <div className="intro__photo-in" data-photo-in>
          {site.photo ? <img src={site.photo} alt={`Foto de ${site.name}`} /> : <span>Sua foto</span>}
        </div>
      </div>
      <div className="intro__txt">
        <h2 className="intro__title" id="intro-titulo">
          <Line>Prazer, eu sou</Line>
          <Line>o Janio.</Line>
        </h2>
        <p className="intro__sum" data-fade>
          Há mais de 10 anos desenho produtos digitais para bancos, saúde e varejo, da pesquisa ao protótipo testado
          com quem usa.
        </p>
        <TLink href="/sobre/" className="intro__link" data-fade>
          Conheça minha trajetória <span className="arrow">→</span>
        </TLink>
      </div>
    </section>
  );
}
