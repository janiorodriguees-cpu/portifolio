'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/motion/setup';
import { initIntro } from '@/motion/intro';
import { site } from '@/data/site';
import TLink from './TLink';

const Line = ({ children }) => (
  <span className="mask">
    <span data-in>{children}</span>
  </span>
);

// Abertura da página Sobre: foto à esquerda, saudação e resumo à direita
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
        <h1 className="intro__title" id="intro-titulo">
          <Line>Prazer, eu sou</Line>
          <Line>
            o Janio<span className="hl">.</span>
          </Line>
        </h1>
        <p className="intro__sum" data-fade>
          Há mais de 10 anos desenho produtos digitais para bancos, saúde e varejo, da pesquisa ao protótipo testado
          com quem usa.
        </p>
        <p className="intro__links" data-fade>
          <TLink href="/contato/">Contato</TLink>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={site.cv} target="_blank" rel="noopener noreferrer">
            Currículo
          </a>
        </p>
      </div>
    </section>
  );
}
