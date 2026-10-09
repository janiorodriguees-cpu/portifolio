import '@fontsource/tinos/latin-400.css';
import '@fontsource/tinos/latin-400-italic.css';
import '@fontsource-variable/inter/wght.css';
import './fonts.css';
import './globals.css';
import Shell from '@/components/Shell';
import { site } from '@/data/site';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: 'Portfólio de UX e Product Design: pesquisa, facilitação, protótipos e produtos digitais.',
};

export const viewport = { themeColor: '#ebebe9' };

// Antes da primeira pintura: marca "com JavaScript" (evita piscar o conteúdo animado) e,
// se a pessoa não pediu menos movimento, liga a cortina de abertura com o nome.
// Trava de segurança: se o JavaScript do site não carregar, a cortina sai em 6 s.
// Atualizar a página (F5) recomeça do início: volta para a home, no topo. Abrir um link
// direto (ex.: um case compartilhado) continua abrindo aquela página.
const jsFlag = `(function(d){var n=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'){if('scrollRestoration' in history)history.scrollRestoration='manual';if(location.pathname!=='/'||location.hash){location.replace('/');return}window.__reloadTop=true;addEventListener('load',function(){scrollTo(0,0)})}d.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('is-loading');setTimeout(function(){if(d.classList.contains('is-loading')&&!d.classList.contains('is-ready')&&!window.__shell){d.classList.remove('is-loading');d.classList.add('is-ready')}},6000)})(document.documentElement)`;

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Pular para o conteúdo
        </a>
        <Shell>
          <main id="main">{children}</main>
        </Shell>
      </body>
    </html>
  );
}
