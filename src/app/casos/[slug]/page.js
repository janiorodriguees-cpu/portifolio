import { notFound } from 'next/navigation';
import { cases, getCase, otherCases } from '@/data/cases';
import CaseEnter from '@/components/CaseEnter';
import NextCases from '@/components/NextCases';
import Footer from '@/components/Footer';

export const dynamicParams = false;

export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCase(slug);
  return c ? { title: `${c.title}: ${c.label}` } : {};
}

export default async function CasePage({ params }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  const others = otherCases(slug);
  // Cada case é um arquivo em src/content/cases/<slug>.mdx
  const { default: Body } = await import(`@/content/cases/${slug}.mdx`);

  return (
    <article>
      <CaseEnter />
      <header className="case-hero" style={{ '--c': c.color, '--on': c.on }}>
        <p className="case-hero__meta" data-case-fade>
          {c.sector} · {c.year}
        </p>
        <h1 className="case-hero__title">
          <span className="mask">
            <span data-case-in>{c.title}</span>
          </span>
        </h1>
        <p className="case-hero__lead" data-case-fade>
          {c.label}
        </p>
        <dl className="facts" data-case-fade>
          <div>
            <dt>Papel</dt>
            <dd>{c.role}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd>{c.team}</dd>
          </div>
          <div>
            <dt>Duração</dt>
            <dd>{c.duration}</dd>
          </div>
          <div>
            <dt>Ferramentas</dt>
            <dd>{c.tools}</dd>
          </div>
        </dl>
      </header>

      <div className="case-body">
        <Body />
      </div>

      <NextCases others={others} />
      <Footer />
    </article>
  );
}
