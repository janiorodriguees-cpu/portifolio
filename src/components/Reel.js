'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/motion/setup';
import { createReel } from '@/motion/reel';
import TLink from './TLink';
import CaseName from './CaseName';
import { site } from '@/data/site';

// Na ordem do processo, do problema ao teste.
const SKILLS = [
  'Conhecendo o problema',
  'Entrevistas com usuários',
  'Dinâmicas',
  'Mapeamentos',
  'Fluxos e jornadas',
  'Wireframe e protótipo',
  'Testes de usabilidade',
];
const SEGMENTS = ['Olá', 'Experiência', 'Meu dia a dia', 'Trabalhos', 'Contato'];

const Line = ({ children }) => (
  <span className="mask">
    <span data-in>{children}</span>
  </span>
);

// Abertura em movimento (reel). A lógica fica em src/motion/reel.js.
export default function Reel({ cases }) {
  const root = useRef(null);

  useEffect(() => {
    const reel = createReel(gsap, root.current);
    return () => reel.destroy();
  }, []);

  return (
    <section className="reel" ref={root} data-mode="wait" aria-label="Apresentação em movimento">
      <div className="reel__stage">
        {/* 1 · Olá */}
        <div className="scene" data-scene data-bg="light" aria-hidden="true">
          <p className="scene__lead">
            <Line>Eu sou o Janio,</Line>
            <Line>UX e Product Designer.</Line>
          </p>
          <div className="hello">
            {[...'Olá.'].map((ch, i) => (
              <Line key={i}>{ch === '.' ? <span className="hl">.</span> : ch}</Line>
            ))}
          </div>
        </div>

        {/* 2 · anos de experiência */}
        <div className="scene" data-scene data-bg="dark" aria-hidden="true">
          <p className="kicker">
            <Line>Mais de</Line>
          </p>
          <div className="num">
            <span className="mask">
              <span data-in>
                <span data-count="10">10</span>+
              </span>
            </span>
            <i className="mask">
              <span data-in className="hl">
                anos
              </span>
            </i>
          </div>
          <p className="lead2">
            <Line>desenhando produtos digitais,</Line>
            <Line>da pesquisa ao protótipo testado.</Line>
          </p>
        </div>

        {/* 3 · o que eu faço */}
        <div className="scene" data-scene data-bg="light" aria-hidden="true">
          <p className="kicker">
            <Line>Um resumo do meu dia a dia</Line>
          </p>
          <ul className="skills">
            {SKILLS.map((s) => (
              <li key={s}>
                <Line>{s}</Line>
              </li>
            ))}
          </ul>
        </div>

        {/* 4 · cases, um painel colorido por vez */}
        <div className="scene scene--cases" data-scene aria-hidden="true">
          {cases.map((c) => (
            <div className="sub" data-sub key={c.slug} style={{ '--c': c.color, '--on': c.on, '--hl': c.hl }}>
              <p className="sub__t">
                <Line>
                  <CaseName title={c.title} />
                </Line>
              </p>
              <p className="sub__d">
                <Line>
                  {c.label} · {c.sector}
                </Line>
              </p>
            </div>
          ))}
        </div>

        {/* 5 · fechamento (também é a versão estática para quem prefere menos movimento) */}
        <div className="scene" data-scene data-bg="light">
          <h1 className="final__name">
            <Line>Janio</Line>
            <Line>Rodrigues</Line>
          </h1>
          <p className="final__role">
            <Line>{site.role}</Line>
          </p>
          <div className="final__actions">
            <TLink href="/#trabalhos" className="btn btn--down" data-fade>
              Ver trabalhos <span className="arrow">↓</span>
            </TLink>
            <TLink href="/contato/" className="btn" data-fade>
              Falar comigo
            </TLink>
          </div>
        </div>
      </div>

      <div className="reel__bar" data-reel-bar>
        <p className="reel__status" data-status aria-live="polite" />
        <div className="reel__segs" role="group" aria-label="Cenas do reel">
          {SEGMENTS.map((label, i) => (
            <button key={label} type="button" className="seg" data-seg={i} data-label={label} aria-label={`Ir para: ${label}`}>
              <i />
            </button>
          ))}
        </div>
        <button type="button" className="reel__toggle" data-toggle>
          Pausar
        </button>
      </div>
    </section>
  );
}
