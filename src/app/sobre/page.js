import Section from '@/components/mdx/Section';
import Footer from '@/components/Footer';
import Intro from '@/components/Intro';
import Testimonials from '@/components/Testimonials';
import ContactButtons from '@/components/ContactButtons';

export const metadata = { title: 'Sobre' };

export default function Sobre() {
  return (
    <>
      <Intro />
      <div className="page">
        <p className="page__lead">
          Mais de 10 anos transformando problemas complexos em produtos que as pessoas entendem e usam.
        </p>

        <Section title="Trajetória">
          <ul className="timeline">
            <li>
              <b className="ph">Ano – Ano</b>
              <span className="ph">Empresa · cargo. Uma linha sobre o que você fez.</span>
            </li>
            <li>
              <b className="ph">Ano – Ano</b>
              <span className="ph">Empresa · cargo. Uma linha sobre o que você fez.</span>
            </li>
            <li>
              <b className="ph">Ano – Ano</b>
              <span className="ph">Empresa · cargo. Uma linha sobre o que você fez.</span>
            </li>
          </ul>
        </Section>

        <Section title="Como eu trabalho">
          <ol className="steps">
            <li>
              <strong>Entender</strong>
              <span className="ph">Pesquisa, entrevistas e leitura do negócio antes de desenhar.</span>
            </li>
            <li>
              <strong>Alinhar</strong>
              <span className="ph">Workshops e sprints de design para decidir junto com o time.</span>
            </li>
            <li>
              <strong>Prototipar e testar</strong>
              <span className="ph">Protótipos navegáveis testados com usuários antes de ir para o código.</span>
            </li>
            <li>
              <strong>Entregar e medir</strong>
              <span className="ph">Handoff, acompanhamento e aprendizados depois do lançamento.</span>
            </li>
          </ol>
        </Section>

        <Section title="IA no processo">
          <p className="ph">Como você usa IA no dia a dia: pesquisa, síntese, protótipos. E onde decide não usar.</p>
        </Section>

        <Testimonials />

        <Section title="Contato">
          <ContactButtons />
        </Section>
      </div>
      <Footer />
    </>
  );
}
