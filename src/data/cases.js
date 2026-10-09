// Lista dos cases. Hoje são três exemplos ("Case 1, 2 e 3") só para ver o layout e
// as transições. Para cada case real:
//   1. ajuste os dados abaixo (título, cor, resumo, ficha);
//   2. escreva o texto em src/content/cases/<slug>.mdx;
//   3. coloque as imagens em public/cases/<slug>/.
export const cases = [
  {
    slug: 'case-1',
    cover: '/cases/case-1/capa.svg', // imagem fictícia (cliente inventado), troque pela real
    n: 1,
    title: 'Case 1',
    label: 'Título do projeto',
    sector: 'Setor',
    year: 'Ano',
    color: '#2f3cff',
    on: '#f6f4ee',
    summary: 'Uma frase sobre o problema, o que você fez e o que mudou depois.',
    role: 'A definir',
    team: 'A definir',
    duration: 'A definir',
    tools: 'A definir',
  },
  {
    slug: 'case-2',
    cover: '/cases/case-2/capa.svg', // imagem fictícia (cliente inventado), troque pela real
    n: 2,
    title: 'Case 2',
    label: 'Título do projeto',
    sector: 'Setor',
    year: 'Ano',
    color: '#d92d20',
    on: '#f6f4ee',
    summary: 'Uma frase sobre o problema, o que você fez e o que mudou depois.',
    role: 'A definir',
    team: 'A definir',
    duration: 'A definir',
    tools: 'A definir',
  },
  {
    slug: 'case-3',
    cover: '/cases/case-3/capa.svg', // imagem fictícia (cliente inventado), troque pela real
    n: 3,
    title: 'Case 3',
    label: 'Título do projeto',
    sector: 'Setor',
    year: 'Ano',
    color: '#0e3a31',
    on: '#f1ece1',
    summary: 'Uma frase sobre o problema, o que você fez e o que mudou depois.',
    role: 'A definir',
    team: 'A definir',
    duration: 'A definir',
    tools: 'A definir',
  },
];

export const getCase = (slug) => cases.find((c) => c.slug === slug);

export const nextCase = (slug) => {
  const i = cases.findIndex((c) => c.slug === slug);
  return cases[(i + 1) % cases.length];
};
