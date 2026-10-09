'use client';

import { useEffect, useRef, useState } from 'react';
import { site } from '@/data/site';

// Botões de contato (referência: botão de e-mail de robin-noguier.com).
// E-mail: mostra o endereço; no hover vira "Copiar e-mail" com o avatar entrando
// pela esquerda; o clique COPIA o endereço (não abre o app de e-mail do sistema).
// LinkedIn: abre o perfil numa nova aba.

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

export function EmailButton() {
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
    <button
      type="button"
      className={`cbtn cbtn--mail${copied ? ' is-copied' : ''}`}
      onClick={onClick}
      aria-label={`Copiar e-mail: ${site.email}`}
    >
      <span className="cbtn__avatar" aria-hidden="true">
        {site.photo ? <img src={site.photo} alt="" /> : initials}
      </span>
      <span className="cbtn__icon" aria-hidden="true">
        <MailIcon />
      </span>
      <span className="cbtn__swap" aria-hidden="true">
        <span className="cbtn__a">{site.email}</span>
        <span className="cbtn__b">{copied ? 'E-mail copiado ✓' : 'Copiar e-mail'}</span>
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? 'E-mail copiado' : ''}
      </span>
    </button>
  );
}

export function LinkedInButton() {
  return (
    <a className="cbtn cbtn--in" href={site.linkedin} target="_blank" rel="noopener noreferrer">
      <span className="cbtn__icon" aria-hidden="true">
        <LinkedInIcon />
      </span>
      <span className="cbtn__swap">
        <span className="cbtn__a">LinkedIn</span>
        <span className="cbtn__b" aria-hidden="true">
          Abrir perfil ↗
        </span>
      </span>
    </a>
  );
}

export default function ContactButtons() {
  return (
    <div className="cbtns">
      <EmailButton />
      <LinkedInButton />
    </div>
  );
}
