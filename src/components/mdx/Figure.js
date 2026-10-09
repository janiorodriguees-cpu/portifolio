// Imagem de um case. Sem `src`, mostra um espaço reservado.
// Uso no .mdx:  <Figure src="/cases/case-1/01.jpg" alt="Descrição" caption="Legenda" ratio="16 / 10" />
export default function Figure({ src, alt = '', caption, ratio = '16 / 10' }) {
  return (
    <figure className="fig">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="fig__box" style={{ aspectRatio: ratio }} role="img" aria-label="Imagem a adicionar">
          Imagem do case
        </div>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
