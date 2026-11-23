'use client';

import { useEffect, useState } from 'react';
import { site } from '@/data/site';

// Formulário de contato. O site é estático (sem servidor), então a mensagem é
// enviada para um serviço de formulários (Formspree): o endereço fica em
// `site.form` (src/data/site.js). Sem ele, o envio avisa para copiar o e-mail.

const TOPICS = ['Vaga CLT', 'Projeto freelance', 'Consultoria', 'Só conversar'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SENT_MS = 5000; // tempo da confirmação "Mensagem enviada." antes de voltar ao formulário

export default function ContactForm() {
  const [topics, setTopics] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  const toggle = (t) => setTopics((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const next = {};
    if (!data.nome?.trim()) next.nome = 'Escreva seu nome.';
    if (!EMAIL.test(data.email || '')) next.email = 'Confira o e-mail.';
    if (!data.mensagem?.trim()) next.mensagem = 'Escreva uma mensagem.';
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    if (data._gotcha) return; // campo invisível: se veio preenchido, é robô

    if (!site.form) {
      setStatus('error');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(site.form, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        // _subject: assunto do e-mail que chega (o Formspree usa o campo "email" como responder-para)
        body: JSON.stringify({
          ...data,
          assunto: topics.join(', ') || '—',
          _subject: `Portfólio: ${data.nome.trim()}${topics.length ? ` (${topics.join(', ')})` : ''}`,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
      setTopics([]);
    } catch {
      setStatus('error');
    }
  };

  // depois de enviar, a confirmação fica alguns segundos e o formulário volta sozinho
  useEffect(() => {
    if (status !== 'sent') return;
    const t = setTimeout(() => setStatus('idle'), SENT_MS);
    return () => clearTimeout(t);
  }, [status]);

  if (status === 'sent') {
    return (
      <div className="cform cform--sent" role="status">
        <p className="cform__ok">Mensagem enviada.</p>
        <p>Obrigado pelo contato. Vou responder no e-mail que você informou.</p>
      </div>
    );
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate>
      <fieldset className="cform__topics">
        <legend>Sobre o que vamos conversar?</legend>
        <p className="cform__hint">Pode marcar mais de uma.</p>
        <div className="chips">
          {TOPICS.map((t) => (
            <button
              type="button"
              key={t}
              className="chip"
              aria-pressed={topics.includes(t)}
              onClick={() => toggle(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>Nome</span>
        <input name="nome" autoComplete="name" placeholder="Seu nome" aria-invalid={!!errors.nome} />
        {errors.nome && <em className="field__err">{errors.nome}</em>}
      </label>
      <label className="field">
        <span>E-mail</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="voce@empresa.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && <em className="field__err">{errors.email}</em>}
      </label>
      <label className="field">
        <span>Mensagem</span>
        <textarea
          name="mensagem"
          rows={4}
          placeholder="Conte sobre a vaga, o projeto ou a ideia."
          aria-invalid={!!errors.mensagem}
        />
        {errors.mensagem && <em className="field__err">{errors.mensagem}</em>}
      </label>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

      <div className="cform__foot">
        <button type="submit" className="btn cform__send" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'} <span className="arrow">→</span>
        </button>
        {status === 'error' && (
          <p className="cform__err" role="alert">
            Não foi possível enviar agora. Use o botão E-mail para copiar meu endereço.
          </p>
        )}
      </div>
    </form>
  );
}
