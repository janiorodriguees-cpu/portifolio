import TLink from './TLink';
import { site } from '@/data/site';

export default function Footer() {
  return (
    <footer className="foot" id="contato">
      <p className="foot__big">Vamos conversar.</p>
      <a className="foot__mail" href={`mailto:${site.email}`}>
        {site.email}
      </a>
      <div className="foot__row">
        <p className="foot__links">
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={site.cv} target="_blank" rel="noopener noreferrer">
            Currículo
          </a>
          <TLink href="/sobre/">Sobre mim</TLink>
        </p>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
