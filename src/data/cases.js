// Lista dos cases. Hoje são três exemplos ("Case 1, 2 e 3") só para ver o layout e
// as transições. Para cada case real:
//   1. ajuste os dados abaixo (título, cor, resumo, ficha). `hl` é a cor da última
//      palavra do título; teste o contraste com `color` (mínimo 3:1 para texto grande);
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
    color: '#1a2188',
    on: '#f6f4ee',
    hl: '#dd0a0d', // número do case (escolha do Janio; contraste 2,6 com o azul)
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
    color: '#ca2215',
    on: '#f6f4ee',
    hl: '#0004ff', // escolha do Janio; contraste 1,5 com o vermelho
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
    hl: '#dd0a0d', // escolha do Janio; contraste 2,5 com o verde
    summary: 'Uma frase sobre o problema, o que você fez e o que mudou depois.',
    role: 'A definir',
    team: 'A definir',
    duration: 'A definir',
    tools: 'A definir',
  },
];

export const getCase = (slug) => cases.find((c) => c.slug === slug);

// Os outros cases, começando pelo próximo da lista (e dando a volta no fim).
export const otherCases = (slug) => {
  const i = cases.findIndex((c) => c.slug === slug);
  return cases.slice(i + 1).concat(cases.slice(0, i));
};
