import ContactButtons from '@/components/ContactButtons';
import ContactForm from '@/components/ContactForm';
import ContactEnter from '@/components/ContactEnter';

export const metadata = { title: 'Contato' };

// Página de contato: convite + botões (e-mail que copia, LinkedIn) à esquerda,
// formulário à direita (grid de 12 colunas: 1–5 e 7–12).
export default function Contato() {
  return (
    <section className="contact" aria-labelledby="contato-titulo">
      <ContactEnter />
      <div className="contact__intro">
        <h1 className="contact__title" id="contato-titulo">
          <span className="mask">
            <span data-in>Vamos</span>
          </span>
          <span className="mask">
            <span data-in>
              conversar<span className="hl">.</span>
            </span>
          </span>
        </h1>
        <p className="contact__lead" data-fade>
          Tem uma vaga, um projeto ou uma ideia? Me conte um pouco e eu respondo.
        </p>
        <div data-fade>
          <ContactButtons />
        </div>
        <p className="contact__note" data-fade>
          Prefere não usar formulário? Copie o e-mail acima e me escreva quando quiser.
        </p>
      </div>
      <div className="contact__form" data-fade>
        <ContactForm />
      </div>
    </section>
  );
}
