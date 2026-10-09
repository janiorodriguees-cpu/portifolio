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

// Marca a página como "com JavaScript" antes da primeira pintura (evita piscar o conteúdo animado).
const jsFlag = `document.documentElement.classList.add('js')`;

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
