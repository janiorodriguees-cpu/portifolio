import TLink from './TLink';
import ContactButtons from './ContactButtons';
import BackToTop from './BackToTop';
import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="foot" id="contato">
      <p className="foot__big">
        Vamos conversar<span className="hl">.</span>
      </p>
      <div className="foot__cta">
        <ContactButtons />
        <TLink href="/contato/" className="foot__form">
          Ou mande uma mensagem <span className="arrow">→</span>
        </TLink>
      </div>
      <div className="foot__row">
        <p className="foot__status">
          <span className="foot__dot" aria-hidden="true" />
          {site.status}
        </p>
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <BackToTop />
      </div>
    </footer>
  );
}
