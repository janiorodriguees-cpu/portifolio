'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';

// Botões de contato (referência: botão de e-mail de robin-noguier.com).
// E-mail: mostra "E-mail" (endereço no title); no hover vira "Copiar e-mail" com o avatar entrando
// pela esquerda; o clique COPIA o endereço (não abre o app de e-mail do sistema).
// LinkedIn: abre o perfil numa nova aba. Currículo ("CV"): abre o PDF numa nova aba (o
// portfólio continua aberto; quem quiser baixa pelo visualizador do navegador).

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
  </svg>
);
const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);
const initials = site.name
  .split(' ')
  .map((w) => w[0])
  .slice(0, 2)
  .join('');

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // navegadores sem a API de área de transferência
    const t = document.createElement('textarea');
    t.value = text;
    t.setAttribute('readonly', '');
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand('copy');
    t.remove();
    return ok;
  }
}

// Botões compactos que crescem no hover (classe .cbtn--grow): parado mostram um
// rótulo curto; no hover cresce até caber o texto de baixo. As larguras dos dois
// textos são medidas aqui e viram --wa/--wb no CSS, para a largura animar.
// Os textos têm largura própria (max-content no CSS), então a medida não depende
// do tamanho atual do botão (antes, medir com o botão crescido gravava a largura
// errada). Mede só quando visível (no menu do celular ele nasce escondido);
// `dep` remede quando o texto de baixo muda (ex.: "E-mail copiado ✓").
function measureSwap(swap) {
  const a = Math.ceil(swap.querySelector('.cbtn__a').getBoundingClientRect().width);
  const b = Math.ceil(swap.querySelector('.cbtn__b').getBoundingClientRect().width);
  if (!a || !b) return null;
  swap.style.setProperty('--wa', `${a}px`);
  swap.style.setProperty('--wb', `${b}px`);
  return { a, b };
}

function useGrow(dep) {
  const ref = useRef(null);
  const measure = useCallback(() => {
    if (ref.current) measureSwap(ref.current);
  }, []);
  useEffect(() => {
    measure();
    document.fonts?.ready.then(measure);
  }, [measure, dep]);
  return [ref, measure];
}

export function EmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const [swap, measure] = useGrow(copied);

  const onClick = async () => {
    if (await copy(site.email)) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <button
      type="button"
      className={`cbtn cbtn--mail cbtn--grow${copied ? ' is-copied' : ''}`}
      onClick={onClick}
      onPointerEnter={measure}
      onFocus={measure}
      title={site.email}
      aria-label={`Copiar e-mail: ${site.email}`}
    >
      <span className="cbtn__avatar" aria-hidden="true">
        {site.avatar ? <img src={site.avatar} alt="" /> : initials}
      </span>
      <span className="cbtn__icon" aria-hidden="true">
        <MailIcon />
      </span>
      <span className="cbtn__swap" ref={swap} aria-hidden="true">
        <span className="cbtn__a">E-mail</span>
        <span className="cbtn__b">{copied ? 'E-mail copiado ✓' : 'Copiar e-mail'}</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'E-mail copiado' : ''}
      </span>
    </button>
  );
}

// Versão em texto (links da abertura do Sobre): "E-mail" que copia o endereço.
export function CopyEmailLink() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const onClick = async () => {
    if (await copy(site.email)) {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    }
  };
  return (
    <button type="button" className={copied ? 'is-copied' : undefined} onClick={onClick} title={site.email}>
      {copied ? 'E-mail copiado ✓' : 'E-mail'}
      <span className="sr-only" aria-live="polite">
        {copied ? `E-mail ${site.email} copiado` : ''}
      </span>
    </button>
  );
}

export function LinkedInButton() {
  const [swap, measure] = useGrow();
  return (
    <a
      className="cbtn cbtn--in cbtn--grow"
      href={site.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn: abrir perfil (abre em nova aba)"
      onPointerEnter={measure}
      onFocus={measure}
    >
      <span className="cbtn__icon" aria-hidden="true">
        <LinkedInIcon />
      </span>
      <span className="cbtn__swap" ref={swap} aria-hidden="true">
        <span className="cbtn__a">LinkedIn</span>
        <span className="cbtn__b">Abrir perfil ↗</span>
      </span>
    </a>
  );
}

// Currículo: parado mostra só "CV"; no hover cresce até "Visualizar ↗".
export function CvButton() {
  const [swap, measure] = useGrow();
  return (
    <a
      className="cbtn cbtn--cv cbtn--grow"
      href={site.cv}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visualizar currículo (PDF, abre em nova aba)"
      onPointerEnter={measure}
      onFocus={measure}
    >
      <span className="cbtn__icon" aria-hidden="true">
        <FileIcon />
      </span>
      <span className="cbtn__swap" ref={swap} aria-hidden="true">
        <span className="cbtn__a">CV</span>
        <span className="cbtn__b">Visualizar ↗</span>
      </span>
    </a>
  );
}

// Fileira dos três botões. Se a linha não tem espaço para um botão crescer no
// hover, eles ficam empilhados desde o início; senão a fileira já reserva esse
// espaço (min-width). Assim o hover nunca faz um botão pular de linha (e voltar,
// em loop) nem empurra o link ao lado no rodapé.
const GROW_SLACK = 32; // folga para "E-mail copiado ✓", maior que o hover

export default function ContactButtons() {
  const row = useRef(null);
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const fit = () => {
      const btns = [...el.children];
      let rest = 0;
      let grow = 0;
      for (const btn of btns) {
        const swap = btn.querySelector('.cbtn__swap');
        const m = measureSwap(swap);
        if (!m) return; // escondido (menu do celular fechado)
        rest += btn.getBoundingClientRect().width - swap.getBoundingClientRect().width + m.a;
        grow = Math.max(grow, m.b - m.a);
      }
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const need = Math.ceil(rest + gap * (btns.length - 1) + grow + GROW_SLACK);
      const avail = el.parentElement.getBoundingClientRect().width;
      const stacked = need > avail;
      el.classList.toggle('is-stacked', stacked);
      el.style.minWidth = stacked ? '' : `${need}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="cbtns" ref={row}>
      <EmailButton />
      <LinkedInButton />
      <CvButton />
    </div>
  );
}
