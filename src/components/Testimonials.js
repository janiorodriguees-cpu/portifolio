'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/motion/setup';
import { createTestimonials } from '@/motion/testimonials';
import { testimonials } from '@/data/testimonials';

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// Depoimentos de quem já trabalhou com o Janio (dados em src/data/testimonials.js).
export default function Testimonials() {
  const root = useRef(null);

  useEffect(() => {
    const t = createTestimonials(gsap, root.current);
    return () => t.destroy();
  }, []);

  if (!testimonials.length) return null;

  return (
    <section className="quotes" ref={root} aria-labelledby="quotes-titulo" aria-roledescription="carrossel">
      <h2 className="quotes__h" id="quotes-titulo">
        O que dizem de trabalhar comigo
      </h2>
      <div className="quotes__stage">
        {testimonials.map((t, i) => (
          <figure className="quote" data-quote key={i} aria-roledescription="depoimento">
            <blockquote className="quote__text">
              <p>
                <span className="hl">“</span>
                {t.quote}
                <span className="hl">”</span>
              </p>
            </blockquote>
            <figcaption className="quote__who">
              <span className="quote__avatar" aria-hidden="true">
                {t.photo ? <img src={t.photo} alt="" /> : initials(t.name)}
              </span>
              <span>
                <b>{t.name}</b>
                <span>{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="quotes__nav">
        <p className="quotes__count" data-counter aria-live="polite" />
        <button type="button" className="quotes__btn" data-prev aria-label="Depoimento anterior">
          ←
        </button>
        <button type="button" className="quotes__btn" data-next aria-label="Próximo depoimento">
          →
        </button>
      </div>
    </section>
  );
}
