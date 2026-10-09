import TLink from './TLink';
import ContactButtons from './ContactButtons';
import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="foot" id="contato">
      <p className="foot__big">Vamos conversar.</p>
      <div className="foot__cta">
        <ContactButtons />
        <TLink href="/contato/" className="foot__form">
          Ou mande uma mensagem <span className="arrow">→</span>
        </TLink>
      </div>
      <div className="foot__row">
        <p className="foot__links">
          <a href={site.cv} target="_blank" rel="noopener noreferrer">
            Currículo
          </a>
          <TLink href="/sobre/">Sobre mim</TLink>
          <TLink href="/contato/">Contato</TLink>
        </p>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
