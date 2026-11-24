import { site } from '@/data/site';

// Página "em construção": aparece no lugar do site inteiro no janiorodrigues.com enquanto
// `site.construction` estiver ligado (src/data/site.js). Só vale no build de produção:
// no `npm run dev` (localhost) o site completo continua aparecendo para o trabalho.
// Estilos inline de propósito: não depende do CSS do site, que pode estar em obra.
const paper = '#ebebe9';
const ink = '#0e0e11';
const muted = '#5b5b63';
const accent = '#dd0a0d';

const link = { color: ink, textDecoration: 'none', borderBottom: `1px solid ${ink}`, paddingBottom: 2 };

export default function UnderConstruction() {
  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'grid',
        alignContent: 'center',
        gap: 24,
        padding: 'clamp(24px, 6vw, 96px)',
        background: paper,
        color: ink,
        fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
      }}
    >
      <p style={{ display: 'inline-flex', alignItems: 'center', gap: 10, margin: 0, fontSize: '0.95rem' }}>
        <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: ink }} />
        {site.status}
      </p>
      <h1
        style={{
          margin: 0,
          font: '400 clamp(56px, 9vw, 140px) / 0.95 Tinos, "Times New Roman", Times, serif',
          letterSpacing: '-0.025em',
        }}
      >
        {site.name}
        <span style={{ color: accent }}>.</span>
      </h1>
      <p style={{ margin: 0, maxWidth: '34ch', fontSize: 'clamp(20px, 1.8vw, 26px)', lineHeight: 1.35 }}>
        UX/Product Designer. Meu portfólio novo está em construção e volta em breve.
      </p>
      <p style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', margin: '8px 0 0', fontWeight: 500 }}>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" style={link}>
          LinkedIn ↗
        </a>
        <a href={site.cv} target="_blank" rel="noopener noreferrer" style={link}>
          Currículo ↗
        </a>
        <span style={{ color: muted, fontWeight: 400 }}>{site.email}</span>
      </p>
    </main>
  );
}
