// Seção de um case: título à esquerda (fixo ao rolar) e texto à direita.
// Uso no .mdx:  <Section title="Contexto e problema"> ...texto... </Section>
export default function Section({ title, children }) {
  return (
    <section className="csec">
      <h2 className="csec__h">{title}</h2>
      <div className="csec__b">{children}</div>
    </section>
  );
}
