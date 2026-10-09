// Nome do case com a última palavra (hoje o número: "Case 1") na cor de destaque do
// próprio case (`hl` em cases.js, escolhida para contrastar com o fundo `color`).
// Quem usa precisa definir --hl no elemento pai (style={{ '--hl': c.hl }}).
export default function CaseName({ title }) {
  const i = title.lastIndexOf(' ');
  if (i < 0) return <span className="case-n">{title}</span>;
  return (
    <>
      {title.slice(0, i + 1)}
      <span className="case-n">{title.slice(i + 1)}</span>
    </>
  );
}
